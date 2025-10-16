import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Shield, AlertTriangle, Sparkles, CheckCircle, XCircle, Edit } from "lucide-react";
import { Label } from "@/components/ui/label";

const LINDDUN_CATEGORIES = [
  {
    id: "linkability",
    name: "Linkability",
    icon: "🔗",
    description: "Linking data across contexts without authorization",
    color: "bg-blue-100 dark:bg-blue-900/20 border-blue-300 dark:border-blue-800",
  },
  {
    id: "identifiability",
    name: "Identifiability",
    icon: "👤",
    description: "Identifying individuals from data or actions",
    color: "bg-purple-100 dark:bg-purple-900/20 border-purple-300 dark:border-purple-800",
  },
  {
    id: "nonrepudiation",
    name: "Non-repudiation",
    icon: "✍️",
    description: "Inability to deny having performed actions",
    color: "bg-green-100 dark:bg-green-900/20 border-green-300 dark:border-green-800",
  },
  {
    id: "detectability",
    name: "Detectability",
    icon: "🔍",
    description: "Revealing data existence or presence",
    color: "bg-yellow-100 dark:bg-yellow-900/20 border-yellow-300 dark:border-yellow-800",
  },
  {
    id: "disclosure",
    name: "Disclosure",
    icon: "🔓",
    description: "Unauthorized information disclosure",
    color: "bg-red-100 dark:bg-red-900/20 border-red-300 dark:border-red-800",
  },
  {
    id: "unawareness",
    name: "Unawareness",
    icon: "❓",
    description: "Lack of transparency and user control",
    color: "bg-orange-100 dark:bg-orange-900/20 border-orange-300 dark:border-orange-800",
  },
  {
    id: "noncompliance",
    name: "Non-compliance",
    icon: "⚖️",
    description: "Violating regulations or policies",
    color: "bg-gray-100 dark:bg-gray-900/20 border-gray-300 dark:border-gray-800",
  },
];

// Mock AI-detected threats for demonstration
const MOCK_THREATS = [
  {
    id: 1,
    category: "linkability",
    name: "Cross-Service User Tracking",
    description: "User behavior can be linked across multiple services through persistent identifiers",
    scenario: "Marketing analytics combines user activity from web app, mobile app, and third-party integrations using email as common identifier, creating comprehensive behavioral profiles.",
    likelihood: "High",
    impact: "Medium",
    riskLevel: "High",
    aiConfidence: 87,
    validated: false,
    affectedData: ["Email", "Device ID", "Session logs", "Behavioral data"],
    mitigations: [
      "Use service-specific pseudonymous user IDs instead of email",
      "Implement data minimization for analytics",
      "Add user consent for cross-service tracking",
    ],
  },
  {
    id: 2,
    category: "identifiability",
    name: "User Re-identification Risk",
    description: "Anonymous usage data contains quasi-identifiers enabling re-identification",
    scenario: "Analytics logs contain ZIP code, age, and device type. Research shows 87% of US population uniquely identifiable with these three attributes.",
    likelihood: "Medium",
    impact: "High",
    riskLevel: "High",
    aiConfidence: 92,
    validated: false,
    affectedData: ["Location data", "Age", "Device information"],
    mitigations: [
      "Generalize ZIP codes to 3-digit prefixes",
      "Use age ranges instead of exact ages",
      "Apply k-anonymity (k≥5) before analysis",
      "Implement differential privacy for aggregates",
    ],
  },
  {
    id: 3,
    category: "disclosure",
    name: "API Data Over-exposure",
    description: "REST API endpoints return excessive user data to clients",
    scenario: "GET /api/users/{id} endpoint returns full user object including internal fields, role permissions, and metadata not needed by frontend, visible in browser network tab.",
    likelihood: "High",
    impact: "Medium",
    riskLevel: "High",
    aiConfidence: 95,
    validated: false,
    affectedData: ["User profiles", "Internal metadata", "System information"],
    mitigations: [
      "Implement field-level response filtering",
      "Use GraphQL with explicit field selection",
      "Apply principle of least privilege to API responses",
      "Regular API security audits",
    ],
  },
  {
    id: 4,
    category: "unawareness",
    name: "Insufficient Privacy Notice Visibility",
    description: "Users lack clear understanding of data collection and processing",
    scenario: "Privacy policy is hidden in footer with legal jargon. No just-in-time notices when sensitive permissions requested. Users unknowingly consent to extensive data collection.",
    likelihood: "High",
    impact: "Medium",
    riskLevel: "Medium",
    aiConfidence: 89,
    validated: false,
    affectedData: ["All personal data"],
    mitigations: [
      "Implement just-in-time privacy notices",
      "Add layered privacy information (short + detailed)",
      "Privacy dashboard for user data visibility",
      "Clear consent mechanisms with granular controls",
    ],
  },
  {
    id: 5,
    category: "noncompliance",
    name: "Inadequate Data Retention Controls",
    description: "Personal data retained longer than necessary without documented justification",
    scenario: "User activity logs, session data, and analytics retained indefinitely. No automated deletion. Violates GDPR storage limitation principle (Art. 5(1)(e)).",
    likelihood: "High",
    impact: "Medium",
    riskLevel: "Medium",
    aiConfidence: 91,
    validated: false,
    affectedData: ["Activity logs", "Session data", "Analytics data"],
    mitigations: [
      "Define retention periods per data category",
      "Implement automated data expiration",
      "Regular data deletion audits",
      "Document retention justifications in ROPA",
    ],
  },
];

export const WizardStep6 = ({ data, setData }: any) => {
  const [threats, setThreats] = useState(MOCK_THREATS);
  const [selectedThreat, setSelectedThreat] = useState<number | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const handleValidate = (threatId: number) => {
    setThreats(prev => prev.map(t => 
      t.id === threatId ? { ...t, validated: true } : t
    ));
  };

  const handleReject = (threatId: number) => {
    setThreats(prev => prev.filter(t => t.id !== threatId));
  };

  const runAIAnalysis = () => {
    setIsAnalyzing(true);
    // Simulate AI analysis
    setTimeout(() => {
      setIsAnalyzing(false);
    }, 2000);
  };

  const threatsByCategory = LINDDUN_CATEGORIES.map(category => ({
    ...category,
    threats: threats.filter(t => t.category === category.id),
  }));

  const stats = {
    total: threats.length,
    critical: threats.filter(t => t.riskLevel === "Critical").length,
    high: threats.filter(t => t.riskLevel === "High").length,
    medium: threats.filter(t => t.riskLevel === "Medium").length,
    validated: threats.filter(t => t.validated).length,
  };

  return (
    <div className="space-y-6">
      <Alert className="border-primary/50 bg-primary/5">
        <Shield className="h-4 w-4" />
        <AlertDescription>
          <strong>LINDDUN Privacy Threat Modeling</strong> - This systematic analysis identifies
          privacy threats across 7 categories to enrich your DPIA. All threats require human validation.
        </AlertDescription>
      </Alert>

      {/* Threat Statistics */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <Card>
          <CardContent className="pt-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-foreground">{stats.total}</p>
              <p className="text-xs text-muted-foreground">Total Threats</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-red-600 dark:text-red-400">{stats.critical}</p>
              <p className="text-xs text-muted-foreground">Critical</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-orange-600 dark:text-orange-400">{stats.high}</p>
              <p className="text-xs text-muted-foreground">High</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">{stats.medium}</p>
              <p className="text-xs text-muted-foreground">Medium</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-green-600 dark:text-green-400">{stats.validated}</p>
              <p className="text-xs text-muted-foreground">Validated</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* AI Analysis Button */}
      <div className="flex justify-center">
        <Button 
          onClick={runAIAnalysis} 
          disabled={isAnalyzing}
          className="gap-2"
        >
          <Sparkles className="w-4 h-4" />
          {isAnalyzing ? "Analyzing..." : "Run AI Threat Analysis"}
        </Button>
      </div>

      {/* Threats by Category */}
      <Accordion type="single" collapsible className="space-y-4">
        {threatsByCategory.map(category => (
          <AccordionItem 
            key={category.id} 
            value={category.id}
            className="border rounded-lg"
          >
            <AccordionTrigger className="px-4 hover:no-underline">
              <div className="flex items-center justify-between w-full pr-4">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{category.icon}</span>
                  <div className="text-left">
                    <p className="font-semibold">{category.name}</p>
                    <p className="text-sm text-muted-foreground">{category.description}</p>
                  </div>
                </div>
                <Badge variant="outline">
                  {category.threats.length} threats
                </Badge>
              </div>
            </AccordionTrigger>
            <AccordionContent className="px-4 pb-4">
              <div className="space-y-3 mt-2">
                {category.threats.length === 0 ? (
                  <p className="text-sm text-muted-foreground text-center py-4">
                    No threats detected in this category
                  </p>
                ) : (
                  category.threats.map(threat => (
                    <Card 
                      key={threat.id} 
                      className={`border-2 ${threat.validated ? 'border-green-500' : 'border-orange-400'}`}
                    >
                      <CardHeader className="pb-3">
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex-1">
                            <CardTitle className="text-base flex items-center gap-2">
                              {threat.name}
                              {threat.validated && (
                                <CheckCircle className="w-4 h-4 text-green-600" />
                              )}
                            </CardTitle>
                          </div>
                          <div className="flex flex-wrap gap-2 justify-end">
                            <Badge 
                              variant={threat.riskLevel === "High" ? "destructive" : "secondary"}
                            >
                              {threat.riskLevel}
                            </Badge>
                            <Badge variant="outline" className="gap-1">
                              <Sparkles className="w-3 h-3" />
                              AI {threat.aiConfidence}%
                            </Badge>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <div>
                          <p className="text-sm font-medium mb-1">Description:</p>
                          <p className="text-sm text-muted-foreground">{threat.description}</p>
                        </div>
                        
                        <div>
                          <p className="text-sm font-medium mb-1">Threat Scenario:</p>
                          <div className="p-3 bg-muted rounded-md">
                            <p className="text-sm">{threat.scenario}</p>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-2">
                          <div>
                            <p className="text-xs text-muted-foreground">Likelihood</p>
                            <p className="text-sm font-semibold">{threat.likelihood}</p>
                          </div>
                          <div>
                            <p className="text-xs text-muted-foreground">Impact</p>
                            <p className="text-sm font-semibold">{threat.impact}</p>
                          </div>
                        </div>

                        <div>
                          <p className="text-sm font-medium mb-2">Affected Data:</p>
                          <div className="flex flex-wrap gap-2">
                            {threat.affectedData.map((data, idx) => (
                              <Badge key={idx} variant="secondary">{data}</Badge>
                            ))}
                          </div>
                        </div>

                        <div>
                          <p className="text-sm font-medium mb-2">Proposed Mitigations:</p>
                          <ul className="space-y-1">
                            {threat.mitigations.map((mitigation, idx) => (
                              <li key={idx} className="text-sm text-muted-foreground flex items-start gap-2">
                                <span className="text-green-600">✓</span>
                                <span>{mitigation}</span>
                              </li>
                            ))}
                          </ul>
                        </div>

                        {!threat.validated && (
                          <div className="flex gap-2 pt-2 border-t">
                            <Button 
                              size="sm" 
                              variant="default"
                              onClick={() => handleValidate(threat.id)}
                              className="gap-1"
                            >
                              <CheckCircle className="w-4 h-4" />
                              Validate
                            </Button>
                            <Button 
                              size="sm" 
                              variant="outline"
                              className="gap-1"
                            >
                              <Edit className="w-4 h-4" />
                              Modify
                            </Button>
                            <Button 
                              size="sm" 
                              variant="destructive"
                              onClick={() => handleReject(threat.id)}
                              className="gap-1"
                            >
                              <XCircle className="w-4 h-4" />
                              Reject
                            </Button>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  ))
                )}
              </div>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>

      {/* Overall Assessment */}
      <Card>
        <CardHeader>
          <CardTitle>Privacy Engineer Assessment</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="threat-summary">Overall Threat Assessment Summary</Label>
            <Textarea
              id="threat-summary"
              placeholder="Provide your overall assessment of the identified privacy threats, validation decisions, and recommended priority actions..."
              rows={4}
              defaultValue={data.threatSummary}
            />
          </div>

          <Alert>
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              <strong>DPO Approval Required:</strong> All LINDDUN threat models must be reviewed
              and approved by the Data Protection Officer before finalizing the DPIA.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    </div>
  );
};
