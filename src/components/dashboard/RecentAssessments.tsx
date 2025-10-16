import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Clock, AlertCircle, CheckCircle } from "lucide-react";
import { useAssessments } from "@/contexts/AssessmentsContext";
import { useNavigate } from "react-router-dom";

export const RecentAssessments = () => {
  const { assessments } = useAssessments();
  const navigate = useNavigate();
  const recentAssessments = assessments.slice(0, 5);

  const statusIcons = {
    completed: CheckCircle,
    "in-review": Clock,
    pending: Clock,
    draft: AlertCircle,
  };

  return (
    <Card className="shadow-md">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl">Recent Assessments</CardTitle>
          <Button variant="outline" size="sm" onClick={() => navigate("/assessments")}>
            View All
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {recentAssessments.map((assessment) => {
            const StatusIcon = statusIcons[assessment.status] || Clock;
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
                    <Badge variant={assessment.riskLevel === "critical" || assessment.riskLevel === "high" ? "destructive" : "secondary"}>
                      {assessment.riskLevel}
                    </Badge>
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
                  <span className="text-sm font-medium text-foreground min-w-[120px] capitalize">
                    {assessment.status.replace("-", " ")}
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
