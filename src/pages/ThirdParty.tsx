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
import { Plus, Search, Building2, ShieldAlert, ClipboardList, LineChart, Link as LinkIcon, Users } from "lucide-react";

const ThirdParty = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [linkDialogOpen, setLinkDialogOpen] = useState(false);
  const [selectedVendor, setSelectedVendor] = useState<string>("");
  const [usageContext, setUsageContext] = useState("");

  const vendors = [
    {
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
        { name: "Sarah Johnson", role: "Security Lead", email: "sarah.j@aws.com", riskLevel: "Low" }
      ],
      linkedDPIAs: ["Customer Analytics Platform", "Cloud Migration Assessment"]
    },
    {
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
        { name: "Michael Chen", role: "Customer Success", email: "m.chen@hubspot.com", riskLevel: "Low" }
      ],
      linkedDPIAs: ["Marketing Automation System"]
    },
    {
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
        { name: "Robert Kim", role: "Technical Lead", email: "r.kim@biosys.com", riskLevel: "High" }
      ],
      linkedDPIAs: []
    },
  ];

  const stats = [
    { label: "Total Vendors", value: "124", icon: Building2, color: "text-primary", background: "bg-primary/10" },
    { label: "High Risk", value: "12", icon: ShieldAlert, color: "text-risk-high", background: "bg-risk-high/10" },
    { label: "Pending Review", value: "23", icon: ClipboardList, color: "text-status-warning", background: "bg-status-warning/10" },
    { label: "Avg Compliance", value: "93%", icon: LineChart, color: "text-status-success", background: "bg-status-success/10" },
  ];

  return (
    <div className="min-h-screen bg-background">
      <PageHeader
        title="Third-Party Risk Management"
        description="Vendor assessment and compliance tracking"
        action={{
          label: "Add Vendor",
          onClick: () => {},
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
          {vendors.map((vendor) => (
            <Card key={vendor.name} className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-xl font-semibold text-foreground">{vendor.name}</h3>
                      <Badge
                        variant={vendor.riskLevel === "Low" ? "secondary" : "destructive"}
                      >
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
                    <div className="flex gap-2">
                      {vendor.dataTypes.map((type) => (
                        <Badge key={type} variant="outline" className="text-xs">
                          {type}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>

                <Progress value={vendor.compliance} className="h-2 mb-4" />

                {/* Points of Contact Section */}
                <div className="border-t border-border pt-4 mt-4">
                  <div className="flex items-center gap-2 mb-3">
                    <Users className="w-4 h-4 text-muted-foreground" />
                    <h4 className="font-semibold text-foreground">Points of Contact</h4>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {vendor.pocs.map((poc) => (
                      <div key={poc.email} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                        <div>
                          <p className="font-medium text-foreground">{poc.name}</p>
                          <p className="text-sm text-muted-foreground">{poc.role}</p>
                          <p className="text-xs text-muted-foreground">{poc.email}</p>
                        </div>
                        <Badge 
                          variant={poc.riskLevel === "Low" ? "secondary" : "destructive"}
                          className="ml-2"
                        >
                          {poc.riskLevel}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Linked DPIAs Section */}
                {vendor.linkedDPIAs.length > 0 && (
                  <div className="border-t border-border pt-4 mt-4">
                    <div className="flex items-center gap-2 mb-3">
                      <LinkIcon className="w-4 h-4 text-muted-foreground" />
                      <h4 className="font-semibold text-foreground">Linked to Processing Activities</h4>
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

                <div className="flex gap-2 mt-4">
                  <Button variant="outline" size="sm">
                    View Details
                  </Button>
                  <Button variant="outline" size="sm">
                    Assessment History
                  </Button>
                  <Dialog open={linkDialogOpen && selectedVendor === vendor.name} onOpenChange={(open) => {
                    setLinkDialogOpen(open);
                    if (open) setSelectedVendor(vendor.name);
                  }}>
                    <DialogTrigger asChild>
                      <Button 
                        variant="outline" 
                        size="sm"
                        className="bg-primary/10 hover:bg-primary/20"
                      >
                        <LinkIcon className="w-3 h-3 mr-1" />
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
                          <Badge 
                            variant={vendor.riskLevel === "Low" ? "secondary" : "destructive"}
                            className="ml-2"
                          >
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
                          <select className="w-full mt-1 px-3 py-2 border border-input rounded-md bg-background">
                            <option>Customer Analytics Platform</option>
                            <option>Marketing Automation System</option>
                            <option>Employee Biometric Authentication</option>
                            <option>Cloud Migration Assessment</option>
                            <option>AI Model Training Pipeline</option>
                          </select>
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

                        <div>
                          <Label>Primary Point of Contact for this Activity</Label>
                          <select className="w-full mt-1 px-3 py-2 border border-input rounded-md bg-background">
                            {vendor.pocs.map((poc) => (
                              <option key={poc.email}>{poc.name} - {poc.role}</option>
                            ))}
                          </select>
                        </div>

                        {vendor.riskLevel === "High" && (
                          <div className="p-4 bg-risk-high/10 border border-risk-high/20 rounded-lg">
                            <h4 className="font-semibold text-foreground mb-2">High-Risk Approval Required</h4>
                            <p className="text-sm text-muted-foreground mb-3">
                              This vendor will be added to the DPIA with "Pending Approval" status. Additional requirements:
                            </p>
                            <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside">
                              <li>Data Processing Agreement review</li>
                              <li>Security assessment verification</li>
                              <li>Privacy impact documentation</li>
                              <li>DPO sign-off required</li>
                            </ul>
                          </div>
                        )}

                        <div className="flex gap-2 pt-4">
                          <Button className="flex-1">
                            {vendor.riskLevel === "High" ? "Submit for Approval" : "Link to DPIA"}
                          </Button>
                          <Button variant="outline" onClick={() => setLinkDialogOpen(false)}>
                            Cancel
                          </Button>
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>
                  <Button variant="outline" size="sm">
                    Download Report
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ThirdParty;
