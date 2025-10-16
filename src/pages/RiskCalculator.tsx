import { useState } from "react";
import { PageHeader } from "@/components/layout/PageHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calculator, Download } from "lucide-react";

const RiskCalculator = () => {
  const [likelihood, setLikelihood] = useState(3);
  const [impact, setImpact] = useState(3);
  const [volumeFactor, setVolumeFactor] = useState(1.2);
  const [regulatoryPoints, setRegulatoryPoints] = useState(0);

  const baseScore = likelihood * impact * volumeFactor;
  const finalScore = Math.round(baseScore + regulatoryPoints);

  const getRiskLevel = (score: number) => {
    if (score >= 50) return { level: "Catastrophic", color: "destructive", bg: "bg-risk-catastrophic", description: "CA SB-53 Level" };
    if (score >= 36) return { level: "Critical", color: "destructive", bg: "bg-risk-critical", description: "Severe Impact" };
    if (score >= 21) return { level: "High", color: "destructive", bg: "bg-risk-high", description: "Significant Risk" };
    if (score >= 11) return { level: "Medium", color: "secondary", bg: "bg-risk-medium", description: "Moderate Risk" };
    return { level: "Low", color: "secondary", bg: "bg-risk-low", description: "Minimal Risk" };
  };

  const riskLevel = getRiskLevel(finalScore);

  const regulatoryTriggers = [
    { label: "GDPR Art. 35(3) mandatory DPIA", points: 5 },
    { label: "CPRA sensitive personal information", points: 3 },
    { label: "EU AI Act High-Risk System", points: 8 },
    { label: "CA SB-53 Catastrophic Harm Risk", points: 15 },
    { label: "Special category data (GDPR Art. 9)", points: 6 },
    { label: "Children's data", points: 4 },
    { label: "Cross-border transfer (non-adequate)", points: 3 },
    { label: "Biometric processing", points: 7 },
  ];

  return (
    <div className="min-h-screen bg-background">
      <PageHeader
        title="Advanced Risk Calculator"
        description="Multi-framework risk scoring tool"
        action={{
          label: "Export Results",
          onClick: () => {},
          icon: <Download className="w-4 h-4" />,
        }}
      />

      <div className="px-6 py-8 max-w-6xl mx-auto space-y-6">
        <Card className="bg-risk-catastrophic/10 border-risk-catastrophic/20">
          <CardContent className="pt-6">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-risk-catastrophic rounded-full flex items-center justify-center flex-shrink-0">
                <Calculator className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="font-bold text-lg text-foreground mb-2">California SB-53 Catastrophic Risk Level</h3>
                <p className="text-sm text-muted-foreground">
                  This calculator now includes the <strong>Catastrophic</strong> risk level (50+ score) as defined by California's SB-53 legislation. 
                  This level addresses scenarios with potential for mass harm, critical infrastructure impact, or systemic societal risks requiring 
                  continuous monitoring and immediate regulatory notification.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-primary/10 to-accent/10">
          <CardContent className="pt-8 pb-8">
            <div className="flex items-center justify-center gap-8">
              <div className="text-center">
                <Calculator className="w-12 h-12 text-primary mx-auto mb-2" />
                <p className="text-sm text-muted-foreground mb-2">Final Risk Score</p>
                <p className="text-6xl font-bold text-foreground">{finalScore}</p>
                <Badge variant={riskLevel.color as any} className="text-lg px-6 py-2 mt-3">
                  {riskLevel.level} Risk
                </Badge>
                <p className="text-xs text-muted-foreground mt-2">{riskLevel.description}</p>
              </div>

              <div className="h-32 w-px bg-border" />

              <div className="space-y-3">
                <div className="text-center">
                  <p className="text-sm text-muted-foreground">Base Score</p>
                  <p className="text-3xl font-bold text-foreground">{Math.round(baseScore)}</p>
                </div>
                <div className="text-center">
                  <p className="text-sm text-muted-foreground">Regulatory Add-on</p>
                  <p className="text-3xl font-bold text-accent">+{regulatoryPoints}</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Base Risk Factors</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label>Likelihood Score</Label>
                  <Badge variant="outline">
                    {likelihood} - {["", "Rare", "Unlikely", "Possible", "Likely", "Almost Certain"][likelihood]}
                  </Badge>
                </div>
                <Slider
                  value={[likelihood]}
                  onValueChange={(v) => setLikelihood(v[0])}
                  max={5}
                  min={1}
                  step={1}
                  className="py-4"
                />
                <p className="text-sm text-muted-foreground">
                  Rate the probability of an incident occurring
                </p>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label>Impact Score</Label>
                  <Badge variant="outline">
                    {impact} - {["", "Minimal", "Low", "Medium", "High", "Critical"][impact]}
                  </Badge>
                </div>
                <Slider
                  value={[impact]}
                  onValueChange={(v) => setImpact(v[0])}
                  max={5}
                  min={1}
                  step={1}
                  className="py-4"
                />
                <p className="text-sm text-muted-foreground">
                  Rate the potential impact on data subjects
                </p>
              </div>

              <div className="space-y-2">
                <Label>Volume Factor</Label>
                <Select
                  value={volumeFactor.toString()}
                  onValueChange={(v) => setVolumeFactor(parseFloat(v))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1.0">&lt;100 subjects (1.0x)</SelectItem>
                    <SelectItem value="1.1">100-1,000 subjects (1.1x)</SelectItem>
                    <SelectItem value="1.2">1,000-10,000 subjects (1.2x)</SelectItem>
                    <SelectItem value="1.3">10,000-100,000 subjects (1.3x)</SelectItem>
                    <SelectItem value="1.4">100,000-1M subjects (1.4x)</SelectItem>
                    <SelectItem value="1.5">&gt;1M subjects (1.5x)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Regulatory Multipliers</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {regulatoryTriggers.map((trigger) => (
                  <div
                    key={trigger.label}
                    className="flex items-center justify-between p-3 border border-border rounded-lg hover:bg-muted/50"
                  >
                    <div className="flex items-center space-x-3 flex-1">
                      <Checkbox
                        id={trigger.label}
                        onCheckedChange={(checked) => {
                          if (checked) {
                            setRegulatoryPoints(regulatoryPoints + trigger.points);
                          } else {
                            setRegulatoryPoints(regulatoryPoints - trigger.points);
                          }
                        }}
                      />
                      <label
                        htmlFor={trigger.label}
                        className="text-sm font-medium cursor-pointer"
                      >
                        {trigger.label}
                      </label>
                    </div>
                    <Badge variant="outline">+{trigger.points}</Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Risk Classification & Requirements</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-5 gap-4">
              {[
                { level: "Low", range: "0-10", frequency: "Annual", authority: "Data Owner", bg: "bg-risk-low" },
                { level: "Medium", range: "11-20", frequency: "Semi-annual", authority: "DPO + Owner", bg: "bg-risk-medium" },
                { level: "High", range: "21-35", frequency: "Quarterly", authority: "DPO + CISO + Legal", bg: "bg-risk-high" },
                { level: "Critical", range: "36-49", frequency: "Monthly", authority: "C-Suite + Board", bg: "bg-risk-critical" },
                { level: "Catastrophic", range: "50+", frequency: "Continuous", authority: "Board + Regulators", bg: "bg-risk-catastrophic", note: "CA SB-53" },
              ].map((level) => (
                <Card
                  key={level.level}
                  className={`${
                    riskLevel.level === level.level ? "ring-2 ring-primary" : ""
                  }`}
                >
                  <CardContent className="pt-4 text-center">
                    <div className={`w-12 h-12 ${level.bg} rounded-full mx-auto mb-3`} />
                    <h4 className="font-bold text-lg text-foreground mb-1">{level.level}</h4>
                    {level.note && (
                      <Badge variant="outline" className="text-xs mb-2">{level.note}</Badge>
                    )}
                    <p className="text-sm text-muted-foreground mb-3">Score: {level.range}</p>
                    <div className="space-y-1 text-xs text-muted-foreground">
                      <p>Review: {level.frequency}</p>
                      <p className="font-medium">{level.authority}</p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-center gap-4">
          <Button size="lg" className="gap-2">
            <Calculator className="w-4 h-4" />
            Create DPIA from Calculation
          </Button>
          <Button variant="outline" size="lg" className="gap-2">
            Reset Calculator
          </Button>
        </div>
      </div>
    </div>
  );
};

export default RiskCalculator;
