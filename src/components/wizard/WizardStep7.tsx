import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Textarea } from "@/components/ui/textarea";
import { Brain, Shield, AlertTriangle, Target, CheckCircle2, Loader2, Users } from "lucide-react";
import { toast } from "sonner";

const MAESTRO_CATEGORIES = [
  {
    id: "multi-agent",
    name: "Multi-Agent Environment",
    icon: Users,
    description: "Threats arising from interactions between multiple AI agents",
    color: "text-purple-500"
  },
  {
    id: "security",
    name: "Security",
    icon: Shield,
    description: "Security vulnerabilities in agentic AI systems",
    color: "text-blue-500"
  },
  {
    id: "threat-risk",
    name: "Threat & Risk",
    icon: AlertTriangle,
    description: "Identified threats and associated risks",
    color: "text-orange-500"
  },
  {
    id: "outcome",
    name: "Outcome",
    icon: Target,
    description: "Potential adverse outcomes and impacts",
    color: "text-red-500"
  }
];

interface MaestroThreat {
  id: number;
  category: string;
  name: string;
  description: string;
  scenario: string;
  likelihood: number;
  impact: number;
  riskLevel: string;
  aiConfidence: number;
  validated: boolean;
  affectedSystems: string[];
  mitigations: string[];
}

const MOCK_THREATS: MaestroThreat[] = [
  {
    id: 1,
    category: "multi-agent",
    name: "Agent Coordination Failure",
    description: "Multiple AI agents may fail to coordinate properly when processing personal data",
    scenario: "Two agents simultaneously process the same user request, leading to duplicate data processing and potential data inconsistencies",
    likelihood: 4,
    impact: 4,
    riskLevel: "high",
    aiConfidence: 0.87,
    validated: false,
    affectedSystems: ["Agent Orchestrator", "Data Processing Pipeline"],
    mitigations: [
      "Implement distributed locking mechanisms",
      "Add agent coordination protocols",
      "Enable transaction-level consistency checks"
    ]
  },
  {
    id: 2,
    category: "security",
    name: "Prompt Injection via Agent Chain",
    description: "Malicious prompts could be injected through agent communication channels",
    scenario: "An attacker manipulates input to one agent, which propagates malicious instructions through the agent chain, potentially exposing sensitive data",
    likelihood: 5,
    impact: 5,
    riskLevel: "critical",
    aiConfidence: 0.92,
    validated: false,
    affectedSystems: ["Agent Communication Layer", "Input Validation"],
    mitigations: [
      "Implement strict input sanitization at each agent boundary",
      "Use agent-to-agent authentication",
      "Deploy prompt firewall for inter-agent communications"
    ]
  },
  {
    id: 3,
    category: "threat-risk",
    name: "Autonomous Decision Escalation",
    description: "AI agents making autonomous decisions about sensitive personal data without human oversight",
    scenario: "An agent autonomously decides to share user data with third-party services based on learned patterns, bypassing consent mechanisms",
    likelihood: 3,
    impact: 5,
    riskLevel: "high",
    aiConfidence: 0.89,
    validated: false,
    affectedSystems: ["Decision Engine", "Data Sharing Module"],
    mitigations: [
      "Require human-in-the-loop for sensitive decisions",
      "Implement decision audit trails",
      "Set strict decision boundaries for autonomous actions"
    ]
  },
  {
    id: 4,
    category: "outcome",
    name: "Cascading Agent Failures",
    description: "Failure in one agent could cascade through the system affecting data integrity",
    scenario: "A memory leak in one agent causes it to fail, triggering failures in dependent agents and potentially corrupting user data",
    likelihood: 3,
    impact: 4,
    riskLevel: "medium",
    aiConfidence: 0.85,
    validated: false,
    affectedSystems: ["Agent Runtime", "Data Storage"],
    mitigations: [
      "Implement circuit breakers between agents",
      "Add health monitoring and auto-recovery",
      "Use data validation at each processing stage"
    ]
  },
  {
    id: 5,
    category: "multi-agent",
    name: "Agent Privilege Escalation",
    description: "An agent gaining unauthorized access to data meant for other agents",
    scenario: "Through learned behavior, an agent exploits communication protocols to access data beyond its designated scope",
    likelihood: 4,
    impact: 5,
    riskLevel: "high",
    aiConfidence: 0.90,
    validated: false,
    affectedSystems: ["Access Control", "Agent Permissions"],
    mitigations: [
      "Implement role-based access control for agents",
      "Regular permission audits",
      "Zero-trust architecture between agents"
    ]
  }
];

export const WizardStep7 = ({ data, setData }: any) => {
  const [threats, setThreats] = useState<MaestroThreat[]>(data.maestroThreats || MOCK_THREATS);
  const [selectedThreat, setSelectedThreat] = useState<number | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const handleValidate = (threatId: number) => {
    const updatedThreats = threats.map(t => 
      t.id === threatId ? { ...t, validated: true } : t
    );
    setThreats(updatedThreats);
    setData({ ...data, maestroThreats: updatedThreats });
    toast.success("Threat validated successfully");
  };

  const handleReject = (threatId: number) => {
    const updatedThreats = threats.filter(t => t.id !== threatId);
    setThreats(updatedThreats);
    setData({ ...data, maestroThreats: updatedThreats });
    toast.success("Threat rejected");
  };

  const runAIAnalysis = () => {
    setIsAnalyzing(true);
    toast.info("Running MAESTRO AI analysis...");
    
    setTimeout(() => {
      setIsAnalyzing(false);
      toast.success("MAESTRO analysis complete! Review the identified threats below.");
    }, 3000);
  };

  const threatsByCategory = MAESTRO_CATEGORIES.map(category => ({
    ...category,
    threats: threats.filter(t => t.category === category.id)
  }));

  const stats = {
    total: threats.length,
    critical: threats.filter(t => t.riskLevel === "critical").length,
    high: threats.filter(t => t.riskLevel === "high").length,
    medium: threats.filter(t => t.riskLevel === "medium").length,
    validated: threats.filter(t => t.validated).length
  };

  return (
    <div className="space-y-6">
      <Alert>
        <Brain className="h-4 w-4" />
        <AlertTitle>CSA MAESTRO Threat Modeling for Agentic AI</AlertTitle>
        <AlertDescription>
          MAESTRO (Multi-Agent Environment, Security, Threat Risk, and Outcome) framework analyzes 
          privacy and security threats specific to agentic AI systems with multiple autonomous agents.
        </AlertDescription>
      </Alert>

      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Threats</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Critical</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-risk-critical">{stats.critical}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">High Risk</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-risk-high">{stats.high}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Validated</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{stats.validated}</div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>AI-Powered Threat Detection</CardTitle>
          <CardDescription>
            Run automated analysis to identify agentic AI threats in your processing activities
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button onClick={runAIAnalysis} disabled={isAnalyzing} className="w-full">
            {isAnalyzing ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Analyzing Agent Architecture...
              </>
            ) : (
              <>
                <Brain className="mr-2 h-4 w-4" />
                Run MAESTRO Analysis
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Identified MAESTRO Threats</CardTitle>
          <CardDescription>
            Review and validate threats identified across Multi-Agent, Security, Threat-Risk, and Outcome categories
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Accordion type="single" collapsible className="w-full">
            {threatsByCategory.map((category) => {
              const Icon = category.icon;
              return (
                <AccordionItem key={category.id} value={category.id}>
                  <AccordionTrigger className="hover:no-underline">
                    <div className="flex items-center gap-3">
                      <Icon className={`h-5 w-5 ${category.color}`} />
                      <div className="text-left">
                        <div className="font-semibold">{category.name}</div>
                        <div className="text-sm text-muted-foreground">{category.description}</div>
                      </div>
                      <Badge variant="secondary" className="ml-auto">
                        {category.threats.length}
                      </Badge>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="space-y-4 pt-4">
                      {category.threats.map((threat) => (
                        <Card key={threat.id} className={selectedThreat === threat.id ? "border-primary" : ""}>
                          <CardHeader>
                            <div className="flex items-start justify-between">
                              <div className="flex-1">
                                <CardTitle className="text-base flex items-center gap-2">
                                  {threat.name}
                                  {threat.validated && (
                                    <CheckCircle2 className="h-4 w-4 text-green-600" />
                                  )}
                                </CardTitle>
                                <CardDescription className="mt-1">
                                  {threat.description}
                                </CardDescription>
                              </div>
                              <div className="flex gap-2">
                                <Badge variant={
                                  threat.riskLevel === "critical" ? "destructive" :
                                  threat.riskLevel === "high" ? "destructive" :
                                  "secondary"
                                }>
                                  {threat.riskLevel}
                                </Badge>
                                <Badge variant="outline">
                                  AI: {Math.round(threat.aiConfidence * 100)}%
                                </Badge>
                              </div>
                            </div>
                          </CardHeader>
                          <CardContent className="space-y-4">
                            <div>
                              <div className="text-sm font-medium mb-2">Threat Scenario:</div>
                              <p className="text-sm text-muted-foreground">{threat.scenario}</p>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <div className="text-sm font-medium mb-1">Likelihood</div>
                                <div className="text-2xl font-bold">{threat.likelihood}/5</div>
                              </div>
                              <div>
                                <div className="text-sm font-medium mb-1">Impact</div>
                                <div className="text-2xl font-bold">{threat.impact}/5</div>
                              </div>
                            </div>

                            <div>
                              <div className="text-sm font-medium mb-2">Affected Systems:</div>
                              <div className="flex flex-wrap gap-2">
                                {threat.affectedSystems.map((system, idx) => (
                                  <Badge key={idx} variant="outline">{system}</Badge>
                                ))}
                              </div>
                            </div>

                            <div>
                              <div className="text-sm font-medium mb-2">Recommended Mitigations:</div>
                              <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside">
                                {threat.mitigations.map((mitigation, idx) => (
                                  <li key={idx}>{mitigation}</li>
                                ))}
                              </ul>
                            </div>

                            <div className="flex gap-2 pt-2">
                              {!threat.validated ? (
                                <>
                                  <Button 
                                    size="sm" 
                                    onClick={() => handleValidate(threat.id)}
                                    className="flex-1"
                                  >
                                    <CheckCircle2 className="mr-2 h-4 w-4" />
                                    Validate Threat
                                  </Button>
                                  <Button 
                                    size="sm" 
                                    variant="outline"
                                    onClick={() => setSelectedThreat(threat.id)}
                                    className="flex-1"
                                  >
                                    Modify
                                  </Button>
                                  <Button 
                                    size="sm" 
                                    variant="destructive"
                                    onClick={() => handleReject(threat.id)}
                                  >
                                    Reject
                                  </Button>
                                </>
                              ) : (
                                <Badge variant="secondary" className="w-full justify-center py-2">
                                  <CheckCircle2 className="mr-2 h-4 w-4" />
                                  Validated
                                </Badge>
                              )}
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </AccordionContent>
                </AccordionItem>
              );
            })}
          </Accordion>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>AI Security Engineer Assessment</CardTitle>
          <CardDescription>
            Provide an overall assessment of the agentic AI security posture
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Textarea
            placeholder="Summarize the key MAESTRO findings, agent architecture risks, and recommended security controls..."
            className="min-h-[120px]"
            value={data.maestroAssessment || ""}
            onChange={(e) => setData({ ...data, maestroAssessment: e.target.value })}
          />
          
          <Alert>
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>Security Review Required</AlertTitle>
            <AlertDescription>
              All agentic AI systems require security engineering review before deployment
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    </div>
  );
};
