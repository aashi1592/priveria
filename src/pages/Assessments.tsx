import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { PageHeader } from "@/components/layout/PageHeader";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Search, Filter, Download, Eye, Edit, Trash2 } from "lucide-react";
import { useAssessments } from "@/contexts/AssessmentsContext";
import { toast } from "sonner";

const Assessments = () => {
  const navigate = useNavigate();
  const { assessments, deleteAssessment } = useAssessments();
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState("all");
  const [filterRisk, setFilterRisk] = useState("all");
  const [filterTier, setFilterTier] = useState("all");

  const handleDelete = (id: string, name: string) => {
    deleteAssessment(id);
    toast.success("Assessment deleted", {
      description: `${name} has been removed.`,
    });
  };

  const filteredAssessments = assessments.filter((assessment) => {
    const matchesSearch =
      assessment.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      assessment.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filterCategory === "all" || assessment.category === filterCategory;
    const matchesRisk = filterRisk === "all" || assessment.riskLevel === filterRisk;
    const matchesTier = filterTier === "all" || assessment.tier === filterTier;
    return matchesSearch && matchesCategory && matchesRisk && matchesTier;
  });

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

              <Button variant="outline" size="icon">
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
                      <Button variant="outline" size="icon" title="View">
                        <Eye className="w-4 h-4" />
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
    </div>
  );
};

export default Assessments;
