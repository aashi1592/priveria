import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Clock, AlertCircle, CheckCircle } from "lucide-react";

export const RecentAssessments = () => {
  const assessments = [
    {
      id: "DPIA-2025-034",
      name: "AI-Powered Resume Screening System",
      category: "CAT-01",
      riskLevel: "High",
      riskColor: "destructive",
      status: "Pending Review",
      statusIcon: Clock,
      date: "2025-01-15",
      owner: "Sarah Chen",
    },
    {
      id: "DPIA-2025-033",
      name: "Employee Wellness App - Health Data",
      category: "CAT-03",
      riskLevel: "High",
      riskColor: "destructive",
      status: "In Progress",
      statusIcon: AlertCircle,
      date: "2025-01-14",
      owner: "Michael Torres",
    },
    {
      id: "DPIA-2025-032",
      name: "Customer Loyalty Program Analytics",
      category: "CAT-10",
      riskLevel: "Medium",
      riskColor: "secondary",
      status: "Approved",
      statusIcon: CheckCircle,
      date: "2025-01-13",
      owner: "Emma Williams",
    },
    {
      id: "DPIA-2025-031",
      name: "Biometric Access Control - HQ Building",
      category: "CAT-02",
      riskLevel: "Critical",
      riskColor: "destructive",
      status: "DPA Consultation",
      statusIcon: AlertCircle,
      date: "2025-01-12",
      owner: "David Park",
    },
    {
      id: "DPIA-2025-030",
      name: "Marketing Email Campaign - GDPR",
      category: "CAT-10",
      riskLevel: "Low",
      riskColor: "secondary",
      status: "Approved",
      statusIcon: CheckCircle,
      date: "2025-01-11",
      owner: "Lisa Anderson",
    },
  ];

  return (
    <Card className="shadow-md">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl">Recent Assessments</CardTitle>
          <Button variant="outline" size="sm">
            View All
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {assessments.map((assessment) => {
            const StatusIcon = assessment.statusIcon;
            return (
              <div
                key={assessment.id}
                className="flex items-center justify-between p-4 border border-border rounded-lg hover:bg-muted/50 transition-colors cursor-pointer"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <Badge variant="outline" className="text-xs font-mono">
                      {assessment.id}
                    </Badge>
                    <Badge variant="outline" className="text-xs">
                      {assessment.category}
                    </Badge>
                    <Badge variant={assessment.riskColor as any}>{assessment.riskLevel}</Badge>
                  </div>
                  <h4 className="font-semibold text-foreground mb-1">{assessment.name}</h4>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <span>{assessment.owner}</span>
                    <span>•</span>
                    <span>{new Date(assessment.date).toLocaleDateString()}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <StatusIcon className="w-5 h-5 text-muted-foreground" />
                  <span className="text-sm font-medium text-foreground min-w-[120px]">
                    {assessment.status}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};
