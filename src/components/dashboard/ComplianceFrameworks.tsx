import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

export const ComplianceFrameworks = () => {
  const frameworks = [
    { name: "GDPR", compliance: 96, status: "Compliant", color: "text-status-success" },
    { name: "CPRA", compliance: 92, status: "Compliant", color: "text-status-success" },
    { name: "EU AI Act", compliance: 87, status: "In Progress", color: "text-status-warning" },
    { name: "ISO 42001", compliance: 94, status: "Compliant", color: "text-status-success" },
    { name: "ISO 27001", compliance: 98, status: "Compliant", color: "text-status-success" },
    { name: "ISO 27701", compliance: 91, status: "Compliant", color: "text-status-success" },
  ];

  return (
    <Card className="shadow-md">
      <CardHeader>
        <CardTitle className="text-xl">Compliance Frameworks</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {frameworks.map((framework) => (
            <div key={framework.name} className="space-y-2">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-foreground">{framework.name}</p>
                  <p className={`text-sm ${framework.color}`}>{framework.status}</p>
                </div>
                <span className="text-2xl font-bold text-foreground">{framework.compliance}%</span>
              </div>
              <Progress value={framework.compliance} className="h-2" />
            </div>
          ))}
        </div>

        <div className="mt-6 p-4 bg-muted rounded-lg">
          <p className="text-sm text-muted-foreground">
            Average compliance score: <span className="font-semibold text-foreground">93.0%</span>
          </p>
        </div>
      </CardContent>
    </Card>
  );
};
