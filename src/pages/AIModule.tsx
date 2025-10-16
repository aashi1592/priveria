import { PageHeader } from "@/components/layout/PageHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Brain, AlertTriangle, CheckCircle, Activity } from "lucide-react";

const AIModule = () => {
  const aiSystems = [
    {
      name: "Resume Screening AI",
      classification: "High-Risk",
      compliance: 87,
      status: "Active Monitoring",
      biasScore: 92,
      explainability: 78,
    },
    {
      name: "Customer Service Chatbot",
      classification: "Limited Risk",
      compliance: 96,
      status: "Compliant",
      biasScore: 95,
      explainability: 88,
    },
    {
      name: "Predictive Maintenance System",
      classification: "Minimal Risk",
      compliance: 98,
      status: "Compliant",
      biasScore: 98,
      explainability: 92,
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <PageHeader
        title="AI Impact Assessment Module"
        description="EU AI Act compliance and risk management for AI systems"
      />

      <div className="px-6 py-8 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[
            { label: "Total AI Systems", value: "34", icon: Brain, color: "text-accent" },
            { label: "High-Risk", value: "8", icon: AlertTriangle, color: "text-risk-high" },
            { label: "Compliant", value: "31", icon: CheckCircle, color: "text-status-success" },
            { label: "Active Monitoring", value: "12", icon: Activity, color: "text-status-info" },
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

              <TabsContent value="high-risk" className="space-y-4 mt-6">
                {aiSystems.map((system) => (
                  <Card key={system.name} className="hover:shadow-md transition-shadow">
                    <CardContent className="pt-6">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <h3 className="text-lg font-semibold text-foreground mb-1">
                            {system.name}
                          </h3>
                          <div className="flex items-center gap-2">
                            <Badge variant="destructive">{system.classification}</Badge>
                            <Badge variant="secondary">{system.status}</Badge>
                          </div>
                        </div>
                        <Badge variant="outline" className="text-2xl font-bold">
                          {system.compliance}%
                        </Badge>
                      </div>

                      <div className="space-y-4">
                        <div>
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-sm font-medium text-foreground">
                              Bias Testing Score
                            </span>
                            <span className="text-sm text-muted-foreground">
                              {system.biasScore}%
                            </span>
                          </div>
                          <Progress value={system.biasScore} className="h-2" />
                        </div>

                        <div>
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-sm font-medium text-foreground">
                              Explainability
                            </span>
                            <span className="text-sm text-muted-foreground">
                              {system.explainability}%
                            </span>
                          </div>
                          <Progress value={system.explainability} className="h-2" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </TabsContent>
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
