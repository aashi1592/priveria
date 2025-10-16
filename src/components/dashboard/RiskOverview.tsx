import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useAssessments } from "@/contexts/AssessmentsContext";

export const RiskOverview = () => {
  const { stats } = useAssessments();
  const total = stats.total || 1;
  
  const riskData = [
    { level: "Critical", count: stats.byRisk.critical, percentage: Math.round((stats.byRisk.critical / total) * 1000) / 10, color: "bg-risk-critical" },
    { level: "High", count: stats.byRisk.high, percentage: Math.round((stats.byRisk.high / total) * 1000) / 10, color: "bg-risk-high" },
    { level: "Medium", count: stats.byRisk.medium, percentage: Math.round((stats.byRisk.medium / total) * 1000) / 10, color: "bg-risk-medium" },
    { level: "Low", count: stats.byRisk.low, percentage: Math.round((stats.byRisk.low / total) * 1000) / 10, color: "bg-risk-low" },
    { level: "Minimal", count: stats.byRisk.minimal, percentage: Math.round((stats.byRisk.minimal / total) * 1000) / 10, color: "bg-risk-minimal" },
  ];
  
  const actionRequired = stats.byRisk.critical + stats.byRisk.high;

  return (
    <Card className="shadow-md">
      <CardHeader>
        <CardTitle className="text-xl">Risk Distribution</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {riskData.map((risk) => (
            <div key={risk.level} className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`w-3 h-3 rounded-full ${risk.color}`} />
                  <span className="font-medium text-foreground">{risk.level}</span>
                </div>
                <div className="flex items-center gap-3">
                  <Badge variant="secondary">{risk.count} assessments</Badge>
                  <span className="text-sm text-muted-foreground w-12 text-right">
                    {risk.percentage}%
                  </span>
                </div>
              </div>
              <div className="w-full bg-secondary rounded-full h-2 overflow-hidden">
                <div
                  className={`h-full ${risk.color} transition-all duration-500`}
                  style={{ width: `${risk.percentage}%` }}
                />
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6 p-4 bg-muted rounded-lg">
          <p className="text-sm text-muted-foreground">
            <span className="font-semibold text-foreground">{actionRequired} assessments</span> require action this quarter
          </p>
        </div>
      </CardContent>
    </Card>
  );
};
