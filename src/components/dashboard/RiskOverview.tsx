import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export const RiskOverview = () => {
  const riskData = [
    { level: "Critical", count: 3, percentage: 1.2, color: "bg-risk-critical" },
    { level: "High", count: 18, percentage: 7.3, color: "bg-risk-high" },
    { level: "Medium", count: 67, percentage: 27.1, color: "bg-risk-medium" },
    { level: "Low", count: 142, percentage: 57.5, color: "bg-risk-low" },
    { level: "Minimal", count: 17, percentage: 6.9, color: "bg-risk-minimal" },
  ];

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
            <span className="font-semibold text-foreground">21 assessments</span> require action this quarter
          </p>
        </div>
      </CardContent>
    </Card>
  );
};
