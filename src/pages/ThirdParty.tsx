import { useState } from "react";
import { PageHeader } from "@/components/layout/PageHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Plus, Search, AlertTriangle, CheckCircle, Clock } from "lucide-react";

const ThirdParty = () => {
  const [searchTerm, setSearchTerm] = useState("");

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
    },
  ];

  const stats = [
    { label: "Total Vendors", value: "124", icon: CheckCircle, color: "text-status-info" },
    { label: "High Risk", value: "12", icon: AlertTriangle, color: "text-risk-high" },
    { label: "Pending Review", value: "23", icon: Clock, color: "text-status-warning" },
    { label: "Avg Compliance", value: "93%", icon: CheckCircle, color: "text-status-success" },
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
                    <Icon className={`w-8 h-8 ${stat.color}`} />
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

                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    View Details
                  </Button>
                  <Button variant="outline" size="sm">
                    Assessment History
                  </Button>
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
