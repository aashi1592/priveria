import { useState } from "react";
import { PageHeader } from "@/components/layout/PageHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Search, Building2, ShieldAlert, ClipboardList, LineChart, Link as LinkIcon, Users, Download, ChevronDown, ChevronUp } from "lucide-react";
import { toast } from "sonner";
import { useAssessments } from "@/contexts/AssessmentsContext";

interface POC {
  name: string;
  role: string;
  email: string;
  riskLevel: string;
}

interface Vendor {
  id: string;
  name: string;
  category: string;
  riskLevel: "Low" | "Medium" | "High";
  riskScore: number;
  lastAssessment: string;
  nextReview: string;
  status: string;
  compliance: number;
  dataTypes: string[];
  pocs: POC[];
  linkedDPIAs: string[];
  notes?: string;
}

const STORAGE_KEY = "priveria.vendors";

const SEED_VENDORS: Vendor[] = [
  {
    id: "vendor-001",
    name: "AWS Cloud Services",
    category: "Cloud Infrastructure",
    riskLevel: "Low",
    riskScore: 8,
    lastAssessment: "2025-01-10",
    nextReview: "2025-07-10",
    status: "Approved",
    compliance: 98,
    dataTypes: ["Personal Data", "Financial Data"],
    pocs: [
      { name: "John Smith", role: "Account Manager", email: "john.smith@aws.com", riskLevel: "Low" },
      { name: "Sarah Johnson", role: "Security Lead", email: "sarah.j@aws.com", riskLevel: "Low" },
    ],
    linkedDPIAs: ["Customer Analytics Platform", "Cloud Migration Assessment"],
  },
  {
    id: "vendor-002",
    name: "HubSpot CRM",
    category: "Marketing Platform",
    riskLevel: "Medium",
    riskScore: 15,
    lastAssessment: "2024-12-20",
    nextReview: "2025-06-20",
    status: "Approved",
    compliance: 94,
    dataTypes: ["Contact Information", "Behavioral Data"],
    pocs: [
      { name: "Michael Chen", role: "Customer Success", email: "m.chen@hubspot.com", riskLevel: "Low" },
    ],
    linkedDPIAs: ["Marketing Automation System"],
  },
  {
    id: "vendor-003",
    name: "Biometric Systems Inc",
    category: "Biometric Processing",
    riskLevel: "High",
    riskScore: 28,
    lastAssessment: "2025-01-05",
    nextReview: "2025-04-05",
    status: "Under Review",
    compliance: 87,
    dataTypes: ["Biometric Data", "Personal Identifiers"],
    pocs: [
      { name: "Dr. Lisa Martinez", role: "Data Protection Officer", email: "l.martinez@biosys.com", riskLevel: "High" },
      { name: "Robert Kim", role: "Technical Lead", email: "r.kim@biosys.com", riskLevel: "High" },
    ],
    linkedDPIAs: [],
  },
];

function loadVendors(): Vendor[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw) as Vendor[];
  } catch {
    // corrupted — fall back to seed
  }
  return SEED_VENDORS;
}

function saveVendors(vendors: Vendor[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(vendors));
  } catch {
    // quota exceeded — silently continue
  }
}

const ThirdParty = () => {
  const { assessments } = useAssessments();
  const [vendors, setVendors] = useState<Vendor[]>(loadVendors);
  const [searchTerm, setSearchTerm] = useState("");
  const [expandedVendors, setExpandedVendors] = useState<Set<string>>(new Set());

  // Add Vendor dialog state
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [newVendor, setNewVendor] = useState({
    name: "",
    category: "",
    riskLevel: "Medium" as Vendor["riskLevel"],
    dataTypes: "",
    pocName: "",
    pocRole: "",
    pocEmail: "",
    notes: "",
  });

  // Link to DPIA dialog state
  const [linkDialogOpen, setLinkDialogOpen] = useState(false);
  const [selectedVendor, setSelectedVendor] = useState<string>("");
  const [selectedDPIA, setSelectedDPIA] = useState("");
  const [usageContext, setUsageContext] = useState("");

  const filteredVendors = vendors.filter(
    (v) =>
      v.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      v.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const toggleExpand = (id: string) => {
    setExpandedVendors((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const handleAddVendor = () => {
    if (!newVendor.name.trim()) {
      toast.error("Vendor name is required");
      return;
    }
    const id = `vendor-${Date.now()}`;
    const today = new Date().toISOString().split("T")[0];
    const sixMonths = new Date();
    sixMonths.setMonth(sixMonths.getMonth() + 6);
    const nextReview = sixMonths.toISOString().split("T")[0];

    const vendor: Vendor = {
      id,
      name: newVendor.name.trim(),
      category: newVendor.category.trim() || "Uncategorised",
      riskLevel: newVendor.riskLevel,
      riskScore: newVendor.riskLevel === "High" ? 25 : newVendor.riskLevel === "Medium" ? 15 : 5,
      lastAssessment: today,
      nextReview,
      status: "Pending Review",
      compliance: 80,
      dataTypes: newVendor.dataTypes
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean),
      pocs: newVendor.pocName
        ? [{ name: newVendor.pocName, role: newVendor.pocRole, email: newVendor.pocEmail, riskLevel: newVendor.riskLevel }]
        : [],
      linkedDPIAs: [],
      notes: newVendor.notes,
    };
    const next = [vendor, ...vendors];
    setVendors(next);
    saveVendors(next);
    setAddDialogOpen(false);
    setNewVendor({ name: "", category: "", riskLevel: "Medium", dataTypes: "", pocName: "", pocRole: "", pocEmail: "", notes: "" });
    toast.success(`${vendor.name} added`);
  };

  const handleLinkDPIA = () => {
    if (!selectedDPIA) {
      toast.error("Select a processing activity");
      return;
    }
    const next = vendors.map((v) =>
      v.id === selectedVendor
        ? { ...v, linkedDPIAs: v.linkedDPIAs.includes(selectedDPIA) ? v.linkedDPIAs : [...v.linkedDPIAs, selectedDPIA] }
        : v
    );
    setVendors(next);
    saveVendors(next);
    setLinkDialogOpen(false);
    setUsageContext("");
    setSelectedDPIA("");
    toast.success("Vendor linked to processing activity");
  };

  const handleDownloadReport = (vendor: Vendor) => {
    const lines = [
      `# Vendor Risk Report: ${vendor.name}`,
      ``,
      `**Category:** ${vendor.category}  `,
      `**Risk Level:** ${vendor.riskLevel}  `,
      `**Risk Score:** ${vendor.riskScore}  `,
      `**Status:** ${vendor.status}  `,
      `**Compliance:** ${vendor.compliance}%  `,
      ``,
      `## Assessment Dates`,
      `- Last Assessment: ${new Date(vendor.lastAssessment).toLocaleDateString()}`,
      `- Next Review: ${new Date(vendor.nextReview).toLocaleDateString()}`,
      ``,
      `## Data Types Processed`,
      vendor.dataTypes.map((d) => `- ${d}`).join("\n"),
      ``,
      `## Points of Contact`,
      vendor.pocs.map((p) => `- ${p.name} (${p.role}) — ${p.email}`).join("\n"),
      ``,
      `## Linked Processing Activities`,
      vendor.linkedDPIAs.length > 0 ? vendor.linkedDPIAs.map((d) => `- ${d}`).join("\n") : "- None",
      vendor.notes ? `\n## Notes\n${vendor.notes}` : "",
    ];
    const blob = new Blob([lines.join("\n")], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `vendor-${vendor.id}-report.md`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success(`Report downloaded for ${vendor.name}`);
  };

  const stats = [
    { label: "Total Vendors", value: String(vendors.length), icon: Building2, color: "text-primary", background: "bg-primary/10" },
    { label: "High Risk", value: String(vendors.filter((v) => v.riskLevel === "High").length), icon: ShieldAlert, color: "text-risk-high", background: "bg-risk-high/10" },
    { label: "Pending Review", value: String(vendors.filter((v) => v.status === "Pending Review" || v.status === "Under Review").length), icon: ClipboardList, color: "text-status-warning", background: "bg-status-warning/10" },
    {
      label: "Avg Compliance",
      value: vendors.length > 0 ? `${Math.round(vendors.reduce((s, v) => s + v.compliance, 0) / vendors.length)}%` : "—",
      icon: LineChart,
      color: "text-status-success",
      background: "bg-status-success/10",
    },
  ];

  const dpiaOptions = assessments.map((a) => a.name);

  return (
    <div className="min-h-screen bg-background">
      <PageHeader
        title="Third-Party Risk Management"
        description="Vendor assessment and compliance tracking"
        action={{
          label: "Add Vendor",
          onClick: () => setAddDialogOpen(true),
          icon: <Plus className="w-4 h-4" />,
        }}
      />

      <div className="px-6 py-8 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {stats.map((stat) => {
            const Icon = stat.icon;
            return (
              <Card key={stat.label}>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">{stat.label}</p>
                      <p className="text-3xl font-bold text-foreground mt-1">{stat.value}</p>
                    </div>
                    <div className={`flex h-12 w-12 items-center justify-center rounded-full ${stat.background}`}>
                      <Icon className={`w-6 h-6 ${stat.color}`} />
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <Card>
          <CardContent className="pt-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input
                placeholder="Search vendors..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </CardContent>
        </Card>

        <div className="space-y-4">
          {filteredVendors.map((vendor) => {
            const isExpanded = expandedVendors.has(vendor.id);
            return (
              <Card key={vendor.id} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-xl font-semibold text-foreground">{vendor.name}</h3>
                        <Badge variant={vendor.riskLevel === "Low" ? "secondary" : "destructive"}>
                          {vendor.riskLevel} Risk
                        </Badge>
                        <Badge variant="outline">{vendor.status}</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">{vendor.category}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-3xl font-bold text-foreground">{vendor.compliance}%</p>
                      <p className="text-sm text-muted-foreground">Compliance</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-5 gap-4 mb-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Risk Score</p>
                      <p className="font-medium text-foreground">{vendor.riskScore}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Last Assessment</p>
                      <p className="font-medium text-foreground">
                        {new Date(vendor.lastAssessment).toLocaleDateString()}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Next Review</p>
                      <p className="font-medium text-foreground">
                        {new Date(vendor.nextReview).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="col-span-2">
                      <p className="text-sm text-muted-foreground mb-1">Data Types</p>
                      <div className="flex gap-2 flex-wrap">
                        {vendor.dataTypes.map((type) => (
                          <Badge key={type} variant="outline" className="text-xs">
                            {type}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>

                  <Progress value={vendor.compliance} className="h-2 mb-4" />

                  {/* Expandable detail section */}
                  {isExpanded && (
                    <>
                      <div className="border-t border-border pt-4 mt-4">
                        <div className="flex items-center gap-2 mb-3">
                          <Users className="w-4 h-4 text-muted-foreground" />
                          <h4 className="font-semibold text-foreground">Points of Contact</h4>
                        </div>
                        {vendor.pocs.length === 0 ? (
                          <p className="text-sm text-muted-foreground">No contacts recorded</p>
                        ) : (
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            {vendor.pocs.map((poc) => (
                              <div key={poc.email} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                                <div>
                                  <p className="font-medium text-foreground">{poc.name}</p>
                                  <p className="text-sm text-muted-foreground">{poc.role}</p>
                                  <p className="text-xs text-muted-foreground">{poc.email}</p>
                                </div>
                                <Badge variant={poc.riskLevel === "Low" ? "secondary" : "destructive"} className="ml-2">
                                  {poc.riskLevel}
                                </Badge>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>

                      {vendor.linkedDPIAs.length > 0 && (
                        <div className="border-t border-border pt-4 mt-4">
                          <div className="flex items-center gap-2 mb-3">
                            <LinkIcon className="w-4 h-4 text-muted-foreground" />
                            <h4 className="font-semibold text-foreground">Linked Processing Activities</h4>
                          </div>
                          <div className="flex flex-wrap gap-2">
                            {vendor.linkedDPIAs.map((dpia) => (
                              <Badge key={dpia} variant="outline" className="bg-primary/10">
                                {dpia}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}

                      {vendor.notes && (
                        <div className="border-t border-border pt-4 mt-4">
                          <p className="text-sm font-medium mb-1">Notes</p>
                          <p className="text-sm text-muted-foreground">{vendor.notes}</p>
                        </div>
                      )}
                    </>
                  )}

                  <div className="flex gap-2 mt-4">
                    <Button variant="outline" size="sm" onClick={() => toggleExpand(vendor.id)} className="gap-1">
                      {isExpanded ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                      {isExpanded ? "Hide Details" : "View Details"}
                    </Button>
                    <Dialog
                      open={linkDialogOpen && selectedVendor === vendor.id}
                      onOpenChange={(open) => {
                        setLinkDialogOpen(open);
                        if (open) setSelectedVendor(vendor.id);
                      }}
                    >
                      <DialogTrigger asChild>
                        <Button variant="outline" size="sm" className="bg-primary/10 hover:bg-primary/20 gap-1">
                          <LinkIcon className="w-3 h-3" />
                          Link to DPIA
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-2xl">
                        <DialogHeader>
                          <DialogTitle>Link {vendor.name} to Processing Activity</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4 py-4">
                          <div>
                            <Label>Vendor Risk Level</Label>
                            <Badge variant={vendor.riskLevel === "Low" ? "secondary" : "destructive"} className="ml-2">
                              {vendor.riskLevel} Risk
                            </Badge>
                            {vendor.riskLevel === "High" && (
                              <p className="text-sm text-status-warning mt-2">
                                ⚠️ High-risk vendors require explicit approval and will automatically trigger enhanced DPIA requirements
                              </p>
                            )}
                          </div>

                          <div>
                            <Label>Select Processing Activity</Label>
                            <Select value={selectedDPIA} onValueChange={setSelectedDPIA}>
                              <SelectTrigger className="mt-1">
                                <SelectValue placeholder="Choose a processing activity..." />
                              </SelectTrigger>
                              <SelectContent>
                                {dpiaOptions.map((name) => (
                                  <SelectItem key={name} value={name}>{name}</SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>

                          <div>
                            <Label>Usage Context & Data Sharing</Label>
                            <Textarea
                              placeholder="Describe how this vendor is used in the processing activity, what data is shared, and any specific safeguards in place..."
                              value={usageContext}
                              onChange={(e) => setUsageContext(e.target.value)}
                              className="mt-1 min-h-[120px]"
                            />
                          </div>

                          {vendor.pocs.length > 0 && (
                            <div>
                              <Label>Primary Point of Contact for this Activity</Label>
                              <select className="w-full mt-1 px-3 py-2 border border-input rounded-md bg-background">
                                {vendor.pocs.map((poc) => (
                                  <option key={poc.email}>{poc.name} — {poc.role}</option>
                                ))}
                              </select>
                            </div>
                          )}

                          {vendor.riskLevel === "High" && (
                            <div className="p-4 bg-risk-high/10 border border-risk-high/20 rounded-lg">
                              <h4 className="font-semibold text-foreground mb-2">High-Risk Approval Required</h4>
                              <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside">
                                <li>Data Processing Agreement review</li>
                                <li>Security assessment verification</li>
                                <li>Privacy impact documentation</li>
                                <li>DPO sign-off required</li>
                              </ul>
                            </div>
                          )}

                          <div className="flex gap-2 pt-4">
                            <Button className="flex-1" onClick={handleLinkDPIA}>
                              {vendor.riskLevel === "High" ? "Submit for Approval" : "Link to DPIA"}
                            </Button>
                            <Button variant="outline" onClick={() => setLinkDialogOpen(false)}>
                              Cancel
                            </Button>
                          </div>
                        </div>
                      </DialogContent>
                    </Dialog>
                    <Button variant="outline" size="sm" onClick={() => handleDownloadReport(vendor)} className="gap-1">
                      <Download className="w-3 h-3" />
                      Download Report
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Add Vendor dialog */}
      <Dialog open={addDialogOpen} onOpenChange={setAddDialogOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Add New Vendor</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div>
              <Label>Vendor Name *</Label>
              <Input
                className="mt-1"
                placeholder="e.g. Salesforce"
                value={newVendor.name}
                onChange={(e) => setNewVendor({ ...newVendor, name: e.target.value })}
              />
            </div>
            <div>
              <Label>Category</Label>
              <Input
                className="mt-1"
                placeholder="e.g. CRM, Cloud Storage, Analytics"
                value={newVendor.category}
                onChange={(e) => setNewVendor({ ...newVendor, category: e.target.value })}
              />
            </div>
            <div>
              <Label>Risk Level</Label>
              <Select value={newVendor.riskLevel} onValueChange={(v) => setNewVendor({ ...newVendor, riskLevel: v as Vendor["riskLevel"] })}>
                <SelectTrigger className="mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Low">Low</SelectItem>
                  <SelectItem value="Medium">Medium</SelectItem>
                  <SelectItem value="High">High</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Data Types (comma-separated)</Label>
              <Input
                className="mt-1"
                placeholder="e.g. Personal Data, Financial Data"
                value={newVendor.dataTypes}
                onChange={(e) => setNewVendor({ ...newVendor, dataTypes: e.target.value })}
              />
            </div>
            <div className="border-t border-border pt-3">
              <p className="text-sm font-medium mb-3">Primary Point of Contact</p>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <Label className="text-xs">Name</Label>
                  <Input
                    className="mt-1"
                    placeholder="Full name"
                    value={newVendor.pocName}
                    onChange={(e) => setNewVendor({ ...newVendor, pocName: e.target.value })}
                  />
                </div>
                <div>
                  <Label className="text-xs">Role</Label>
                  <Input
                    className="mt-1"
                    placeholder="Job title"
                    value={newVendor.pocRole}
                    onChange={(e) => setNewVendor({ ...newVendor, pocRole: e.target.value })}
                  />
                </div>
              </div>
              <div className="mt-2">
                <Label className="text-xs">Email</Label>
                <Input
                  className="mt-1"
                  type="email"
                  placeholder="contact@vendor.com"
                  value={newVendor.pocEmail}
                  onChange={(e) => setNewVendor({ ...newVendor, pocEmail: e.target.value })}
                />
              </div>
            </div>
            <div>
              <Label>Notes</Label>
              <Textarea
                className="mt-1"
                placeholder="Additional context..."
                value={newVendor.notes}
                onChange={(e) => setNewVendor({ ...newVendor, notes: e.target.value })}
              />
            </div>
            <div className="flex gap-2 pt-2">
              <Button className="flex-1" onClick={handleAddVendor}>Add Vendor</Button>
              <Button variant="outline" onClick={() => setAddDialogOpen(false)}>Cancel</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ThirdParty;
