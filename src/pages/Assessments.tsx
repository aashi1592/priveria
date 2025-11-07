import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { PageHeader } from "@/components/layout/PageHeader";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Plus, Search, Filter, Download, Eye, Edit, Trash2 } from "lucide-react";
import { Assessment, useAssessments } from "@/contexts/AssessmentsContext";
import { toast } from "sonner";

const Assessments = () => {
  const navigate = useNavigate();
  const { assessments, deleteAssessment } = useAssessments();
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState("all");
  const [filterRisk, setFilterRisk] = useState("all");
  const [filterTier, setFilterTier] = useState("all");
  const [reportOpen, setReportOpen] = useState(false);
  const [selectedAssessment, setSelectedAssessment] = useState<Assessment | null>(null);

  const handleDelete = (id: string, name: string) => {
    deleteAssessment(id);
    toast.success("Assessment deleted", {
      description: `${name} has been removed.`,
    });
  };

  const openReport = (assessment: Assessment) => {
    setSelectedAssessment(assessment);
    setReportOpen(true);
  };

  const handleDownload = (assessment: Assessment) => {
    if (typeof window === "undefined") return;

    const payload = {
      ...assessment,
      downloadedAt: new Date().toISOString(),
    };

    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const safeFileName = assessment.id.replace(/[^\w.-]+/g, "_") || "dpia-assessment";
    const link = document.createElement("a");
    link.href = url;
    link.download = `${safeFileName}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    toast.success("Assessment report downloaded", {
      description: `${assessment.name} exported as JSON.`,
    });
  };

  const handleExportFiltered = () => {
    if (typeof window === "undefined") return;

    if (filteredAssessments.length === 0) {
      toast.info("No assessments to export", {
        description: "Try adjusting your filters or search term.",
      });
      return;
    }

    const payload = filteredAssessments.map((assessment) => ({
      ...assessment,
    }));

    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const fileName = `dpia-assessments-${new Date().toISOString().split("T")[0]}.json`;
    const link = document.createElement("a");
    link.href = url;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    toast.success("Assessments exported", {
      description: `Downloaded ${filteredAssessments.length} assessment(s).`,
    });
  };

  const renderDetailValue = (value: unknown) => {
    if (value === null || value === undefined || value === "") {
      return <span className="text-muted-foreground">Not provided</span>;
    }

    if (Array.isArray(value)) {
      if (value.length === 0) {
        return <span className="text-muted-foreground">None</span>;
      }

      return value.join(", ");
    }

    if (typeof value === "boolean") {
      return value ? "Yes" : "No";
    }

    if (typeof value === "object") {
      return (
        <pre className="mt-1 whitespace-pre-wrap rounded-md bg-muted p-3 text-xs">
          {JSON.stringify(value, null, 2)}
        </pre>
      );
    }

    return String(value);
  };

  const formatKeyLabel = (key: string) => {
    return key
      .replace(/([a-z0-9])([A-Z])/g, "$1 $2")
      .replace(/[-_]/g, " ")
      .replace(/\b\w/g, (char) => char.toUpperCase());
  };

  const filteredAssessments = useMemo(() => {
    return assessments.filter((assessment) => {
      const matchesSearch =
        assessment.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        assessment.id.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = filterCategory === "all" || assessment.category === filterCategory;
      const matchesRisk = filterRisk === "all" || assessment.riskLevel === filterRisk;
      const matchesTier = filterTier === "all" || assessment.tier === filterTier;
      return matchesSearch && matchesCategory && matchesRisk && matchesTier;
    });
  }, [assessments, filterCategory, filterRisk, filterTier, searchTerm]);

  return (
    <div className="min-h-screen bg-background">
      <PageHeader
        title="DPIA Assessments"
        description="Manage and review all data protection impact assessments"
        action={{
          label: "New Assessment",
          onClick: () => navigate("/dpia-wizard"),
          icon: <Plus className="w-4 h-4" />,
        }}
      />

      <div className="px-6 py-8 space-y-6">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  placeholder="Search assessments..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>

              <Select value={filterCategory} onValueChange={setFilterCategory}>
                <SelectTrigger className="w-[200px]">
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  <SelectItem value="Product/Application">Product/Application</SelectItem>
                  <SelectItem value="Vendor">Vendor</SelectItem>
                  <SelectItem value="Internal Process">Internal Process</SelectItem>
                </SelectContent>
              </Select>

              <Select value={filterRisk} onValueChange={setFilterRisk}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Risk Level" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Levels</SelectItem>
                  <SelectItem value="critical">Critical</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="low">Low</SelectItem>
                </SelectContent>
              </Select>

              <Select value={filterTier} onValueChange={setFilterTier}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Assessment Tier" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Tiers</SelectItem>
                  <SelectItem value="tier-1">Tier 1 (Critical)</SelectItem>
                  <SelectItem value="tier-2">Tier 2 (Important)</SelectItem>
                  <SelectItem value="tier-3">Tier 3 (Standard)</SelectItem>
                </SelectContent>
              </Select>

              <Button variant="outline" size="icon">
                <Filter className="w-4 h-4" />
              </Button>

              <Button variant="outline" size="icon" onClick={handleExportFiltered}>
                <Download className="w-4 h-4" />
              </Button>
            </div>
          </CardContent>
        </Card>

        <div className="space-y-4">
          {filteredAssessments.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center">
                <p className="text-muted-foreground">No assessments found matching your criteria.</p>
              </CardContent>
            </Card>
          ) : (
            filteredAssessments.map((assessment) => (
              <Card key={assessment.id} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-3">
                        <Badge variant="outline" className="font-mono text-xs">
                          {assessment.id}
                        </Badge>
                        <Badge variant="outline">{assessment.category}</Badge>
                        <Badge variant={assessment.tier === "tier-1" ? "destructive" : assessment.tier === "tier-2" ? "default" : "secondary"}>
                          {assessment.tier.toUpperCase()}
                        </Badge>
                        <Badge variant={assessment.riskLevel === "critical" || assessment.riskLevel === "high" ? "destructive" : "secondary"}>
                          {assessment.riskLevel}
                        </Badge>
                        <Badge variant="secondary" className="capitalize">{assessment.status.replace("-", " ")}</Badge>
                      </div>

                      <h3 className="text-xl font-semibold text-foreground mb-2">
                        {assessment.name}
                      </h3>

                      <div className="grid grid-cols-4 gap-4 text-sm">
                        <div>
                          <p className="text-muted-foreground">Category</p>
                          <p className="font-medium text-foreground">{assessment.category}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Risk Score</p>
                          <p className="font-medium text-foreground">{assessment.riskScore}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Owner</p>
                          <p className="font-medium text-foreground">{assessment.owner}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Next Review</p>
                          <p className="font-medium text-foreground">
                            {assessment.nextReview ? new Date(assessment.nextReview).toLocaleDateString() : "N/A"}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 ml-4">
                      <Button
                        variant="outline"
                        size="icon"
                        title="View full report"
                        onClick={() => openReport(assessment)}
                      >
                        <Eye className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="icon"
                        title="Download report"
                        onClick={() => handleDownload(assessment)}
                      >
                        <Download className="w-4 h-4" />
                      </Button>
                      <Button variant="outline" size="icon" title="Edit">
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button 
                        variant="outline" 
                        size="icon" 
                        title="Delete"
                        onClick={() => handleDelete(assessment.id, assessment.name)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>

      <Dialog open={reportOpen} onOpenChange={setReportOpen}>
        <DialogContent className="max-w-3xl">
          {selectedAssessment && (
            <>
              <DialogHeader>
                <DialogTitle>{selectedAssessment.name}</DialogTitle>
                <DialogDescription>
                  {selectedAssessment.id} • {new Date(selectedAssessment.date).toLocaleDateString()}
                </DialogDescription>
              </DialogHeader>

              <ScrollArea className="max-h-[60vh] pr-2">
                <div className="space-y-6">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-muted-foreground">Category</p>
                      <p className="font-medium text-foreground">{selectedAssessment.category}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Owner</p>
                      <p className="font-medium text-foreground">{selectedAssessment.owner}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Risk Score</p>
                      <p className="font-medium text-foreground">{selectedAssessment.riskScore}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Risk Level</p>
                      <p className="font-medium text-foreground capitalize">{selectedAssessment.riskLevel}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Assessment Tier</p>
                      <p className="font-medium text-foreground uppercase">{selectedAssessment.tier}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Status</p>
                      <p className="font-medium text-foreground capitalize">{selectedAssessment.status.replace("-", " ")}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Next Review</p>
                      <p className="font-medium text-foreground">
                        {selectedAssessment.nextReview
                          ? new Date(selectedAssessment.nextReview).toLocaleDateString()
                          : "Not scheduled"}
                      </p>
                    </div>
                  </div>

                  <div>
                    <h4 className="text-sm font-semibold text-foreground mb-3">Assessment Details</h4>
                    {selectedAssessment.details && Object.keys(selectedAssessment.details).length > 0 ? (
                      <div className="space-y-3 text-sm">
                        {Object.entries(selectedAssessment.details)
                          .filter(([, value]) => value !== undefined)
                          .map(([key, value]) => (
                            <div key={key}>
                              <p className="text-muted-foreground">{formatKeyLabel(key)}</p>
                              <div className="font-medium text-foreground">{renderDetailValue(value)}</div>
                            </div>
                          ))}
                      </div>
                    ) : (
                      <p className="text-sm text-muted-foreground">
                        This assessment does not have additional details captured yet.
                      </p>
                    )}
                  </div>
                </div>
              </ScrollArea>

              <div className="flex justify-end gap-3 pt-4">
                <Button variant="outline" onClick={() => setReportOpen(false)}>
                  Close
                </Button>
                <Button onClick={() => selectedAssessment && handleDownload(selectedAssessment)}>
                  Download JSON
                </Button>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Assessments;
