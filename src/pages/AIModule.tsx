import { PageHeader } from "@/components/layout/PageHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Brain, AlertTriangle, CheckCircle, Activity } from "lucide-react";
import { useAssessments } from "@/contexts/AssessmentsContext";

const CLASSIFICATION_TAB: Record<string, string> = {
  "high-risk": "high-risk",
  "limited": "limited-risk",
  "limited-risk": "limited-risk",
  "minimal": "minimal-risk",
  "minimal-risk": "minimal-risk",
  "prohibited": "prohibited",
};

const AIModule = () => {
  const { assessments } = useAssessments();

  const aiAssessments = assessments.filter((a) => {
    const details = a.details as Record<string, unknown> | undefined;
    return details?.aiInvolved === true || details?.aiClassification;
  });

  const getClassification = (a: typeof assessments[number]): string => {
    const details = a.details as Record<string, unknown> | undefined;
    const raw = (details?.aiClassification as string | undefined) ?? "minimal";
    return raw === "not-applicable" ? "minimal" : raw;
  };

  const getTab = (a: typeof assessments[number]): string =>
    CLASSIFICATION_TAB[getClassification(a)] ?? "minimal-risk";

  const getExplainability = (a: typeof assessments[number]): number => {
    const details = a.details as Record<string, unknown> | undefined;
    const val = details?.explainability;
    if (typeof val === "number") return Math.min(100, val * 20);
    if (typeof val === "string") return Math.min(100, parseInt(val, 10) * 20);
    return 80;
  };

  const getBiasScore = (a: typeof assessments[number]): number => {
    // Derive a bias score from risk level — lower risk level implies better bias controls
    const map: Record<string, number> = { minimal: 97, low: 92, medium: 85, high: 76, critical: 65 };
    return map[a.riskLevel] ?? 80;
  };

  const complianceFromRisk = (a: typeof assessments[number]): number => {
    const map: Record<string, number> = { minimal: 98, low: 94, medium: 88, high: 80, critical: 70 };
    return map[a.riskLevel] ?? 85;
  };

  const highRiskCount = aiAssessments.filter((a) => getClassification(a) === "high-risk").length;
  const monitoringCount = aiAssessments.filter((a) => a.status === "in-review" || a.riskLevel === "high" || a.riskLevel === "critical").length;
  const compliantCount = aiAssessments.filter((a) => a.status === "completed").length;

  const aiSystemsByTab = (tab: string) =>
    aiAssessments.filter((a) => getTab(a) === tab);

  const renderSystemCard = (a: typeof assessments[number]) => (
    <Card key={a.id} className="hover:shadow-md transition-shadow">
      <CardContent className="pt-6">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h3 className="text-lg font-semibold text-foreground mb-1">{a.name}</h3>
            <div className="flex items-center gap-2">
              <Badge variant="destructive">{getClassification(a)}</Badge>
              <Badge variant="secondary">{a.status}</Badge>
            </div>
          </div>
          <Badge variant="outline" className="text-2xl font-bold">
            {complianceFromRisk(a)}%
          </Badge>
        </div>

        <div className="space-y-4">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-foreground">Bias Testing Score</span>
              <span className="text-sm text-muted-foreground">{getBiasScore(a)}%</span>
            </div>
            <Progress value={getBiasScore(a)} className="h-2" />
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-foreground">Explainability</span>
              <span className="text-sm text-muted-foreground">{getExplainability(a)}%</span>
            </div>
            <Progress value={getExplainability(a)} className="h-2" />
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="min-h-screen bg-background">
      <PageHeader
        title="AI Impact Assessment Module"
        description="EU AI Act compliance and risk management for AI systems"
      />

      <div className="px-6 py-8 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[
            { label: "Total AI Systems", value: String(aiAssessments.length), icon: Brain, color: "text-accent" },
            { label: "High-Risk", value: String(highRiskCount), icon: AlertTriangle, color: "text-risk-high" },
            { label: "Compliant", value: String(compliantCount), icon: CheckCircle, color: "text-status-success" },
            { label: "Active Monitoring", value: String(monitoringCount), icon: Activity, color: "text-status-info" },
          ].map((stat) => {
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
          <CardHeader>
            <CardTitle>EU AI Act Classification</CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="high-risk">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="prohibited">Prohibited</TabsTrigger>
                <TabsTrigger value="high-risk">High-Risk</TabsTrigger>
                <TabsTrigger value="limited-risk">Limited Risk</TabsTrigger>
                <TabsTrigger value="minimal-risk">Minimal Risk</TabsTrigger>
              </TabsList>

              {["prohibited", "high-risk", "limited-risk", "minimal-risk"].map((tab) => {
                const systems = aiSystemsByTab(tab);
                return (
                  <TabsContent key={tab} value={tab} className="space-y-4 mt-6">
                    {systems.length === 0 ? (
                      <p className="text-sm text-muted-foreground text-center py-8">
                        No AI assessments in this category
                      </p>
                    ) : (
                      systems.map(renderSystemCard)
                    )}
                  </TabsContent>
                );
              })}
            </Tabs>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>ISO 42001 Compliance</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {[
                { name: "AI System Lifecycle", progress: 94 },
                { name: "Risk Management", progress: 89 },
                { name: "Performance Monitoring", progress: 92 },
                { name: "Documentation", progress: 96 },
                { name: "Incident Response", progress: 88 },
              ].map((item) => (
                <div key={item.name}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-foreground">{item.name}</span>
                    <span className="text-sm text-muted-foreground">{item.progress}%</span>
                  </div>
                  <Progress value={item.progress} className="h-2" />
                </div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Risk Mitigation Status</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {[
                { issue: "Bias in training data", status: "Mitigated", color: "success" },
                { issue: "Limited explainability", status: "In Progress", color: "warning" },
                { issue: "Human oversight gaps", status: "Mitigated", color: "success" },
                { issue: "Performance drift", status: "Monitoring", color: "info" },
                { issue: "Data quality issues", status: "Mitigated", color: "success" },
              ].map((item) => (
                <div
                  key={item.issue}
                  className="flex items-center justify-between p-3 border border-border rounded-lg"
                >
                  <span className="text-sm font-medium text-foreground">{item.issue}</span>
                  <Badge variant="secondary">{item.status}</Badge>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AIModule;
