import { useEffect, useState } from "react";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { useEnterpriseConfig } from "@/contexts/EnterpriseConfigContext";
import { Shield, Brain } from "lucide-react";

export const WizardStep3 = ({ data, setData }: any) => {
  const { config } = useEnterpriseConfig();
  const [likelihood, setLikelihood] = useState(data.likelihood || 3);
  const [impact, setImpact] = useState(data.impact || 3);

  const volumeFactor = 1.2;
  const regulatoryMultiplier = 5;
  const baseScore = likelihood * impact * volumeFactor;
  
  // LINDDUN Enhancement: Calculate privacy threat impact when enabled
  let linddunAdjustment = 0;
  let linddunThreats = { critical: 0, high: 0, medium: 0, low: 0 };
  
  if (config.linddunEnabled && data.linddunThreats) {
    linddunThreats = data.linddunThreats.reduce((acc: any, threat: any) => {
      acc[threat.riskLevel.toLowerCase()]++;
      return acc;
    }, { critical: 0, high: 0, medium: 0, low: 0 });
    
    // Weight critical threats more heavily
    linddunAdjustment = (linddunThreats.critical * 8) + (linddunThreats.high * 4) + (linddunThreats.medium * 2) + (linddunThreats.low * 1);
  }

  // MAESTRO Enhancement: Calculate agentic AI threat impact when enabled
  let maestroAdjustment = 0;
  let maestroThreats = { critical: 0, high: 0, medium: 0, low: 0 };
  
  if (config.maestroEnabled && data.maestroThreats) {
    maestroThreats = data.maestroThreats.reduce((acc: any, threat: any) => {
      acc[threat.riskLevel.toLowerCase()]++;
      return acc;
    }, { critical: 0, high: 0, medium: 0, low: 0 });
    
    // Weight critical threats more heavily for agentic AI systems
    maestroAdjustment = (maestroThreats.critical * 8) + (maestroThreats.high * 4) + (maestroThreats.medium * 2) + (maestroThreats.low * 1);
  }
  
  const finalScore = Math.round(baseScore + regulatoryMultiplier + linddunAdjustment + maestroAdjustment);

  const getRiskLevel = (score: number) => {
    if (score >= 36) return { level: "Critical", color: "destructive" };
    if (score >= 21) return { level: "High", color: "destructive" };
    if (score >= 11) return { level: "Medium", color: "secondary" };
    return { level: "Low", color: "secondary" };
  };

  const riskLevel = getRiskLevel(finalScore);

  useEffect(() => {
    setData((prev: any) => ({
      ...prev,
      likelihood,
      impact,
      calculatedRiskScore: finalScore,
      calculatedRiskLevel: riskLevel.level.toLowerCase(),
    }));
  }, [finalScore, impact, likelihood, riskLevel.level, setData]);

  return (
    <div className="space-y-6">
      <Card className="bg-gradient-to-br from-primary/5 to-accent/5">
        <CardContent className="pt-6">
          <div className="text-center space-y-2">
            <p className="text-sm text-muted-foreground">Calculated Risk Score</p>
            <p className="text-5xl font-bold text-foreground">{finalScore}</p>
            <Badge variant={riskLevel.color as any} className="text-lg px-4 py-1">
              {riskLevel.level} Risk
            </Badge>
            <p className="text-xs text-muted-foreground mt-2">
              Base Score: {Math.round(baseScore)} + Regulatory: {regulatoryMultiplier}
              {config.linddunEnabled && linddunAdjustment > 0 && (
                <> + LINDDUN Threats: {linddunAdjustment}</>
              )}
              {config.maestroEnabled && maestroAdjustment > 0 && (
                <> + MAESTRO Threats: {maestroAdjustment}</>
              )}
            </p>
          </div>
        </CardContent>
      </Card>

      {config.linddunEnabled && linddunAdjustment > 0 && (
        <Card className="border-purple-500/50 bg-purple-500/5">
          <CardContent className="pt-4">
            <div className="flex items-center gap-2 mb-3">
              <Shield className="w-4 h-4 text-purple-600" />
              <h4 className="font-semibold text-foreground">LINDDUN Privacy Threat Impact</h4>
            </div>
            <div className="grid grid-cols-4 gap-2 text-sm">
              {linddunThreats.critical > 0 && (
                <div className="text-center">
                  <p className="text-2xl font-bold text-risk-critical">{linddunThreats.critical}</p>
                  <p className="text-xs text-muted-foreground">Critical</p>
                </div>
              )}
              {linddunThreats.high > 0 && (
                <div className="text-center">
                  <p className="text-2xl font-bold text-risk-high">{linddunThreats.high}</p>
                  <p className="text-xs text-muted-foreground">High</p>
                </div>
              )}
              {linddunThreats.medium > 0 && (
                <div className="text-center">
                  <p className="text-2xl font-bold text-status-warning">{linddunThreats.medium}</p>
                  <p className="text-xs text-muted-foreground">Medium</p>
                </div>
              )}
              {linddunThreats.low > 0 && (
                <div className="text-center">
                  <p className="text-2xl font-bold text-status-info">{linddunThreats.low}</p>
                  <p className="text-xs text-muted-foreground">Low</p>
                </div>
              )}
            </div>
            <p className="text-xs text-muted-foreground mt-3">
              Privacy threats identified by LINDDUN analysis increase risk score to ensure comprehensive mitigation.
            </p>
          </CardContent>
        </Card>
      )}

      {config.maestroEnabled && maestroAdjustment > 0 && (
        <Card className="border-blue-500/50 bg-blue-500/5">
          <CardContent className="pt-4">
            <div className="flex items-center gap-2 mb-3">
              <Brain className="w-4 h-4 text-blue-600" />
              <h4 className="font-semibold text-foreground">MAESTRO Agentic AI Threat Impact</h4>
            </div>
            <div className="grid grid-cols-4 gap-2 text-sm">
              {maestroThreats.critical > 0 && (
                <div className="text-center">
                  <p className="text-2xl font-bold text-risk-critical">{maestroThreats.critical}</p>
                  <p className="text-xs text-muted-foreground">Critical</p>
                </div>
              )}
              {maestroThreats.high > 0 && (
                <div className="text-center">
                  <p className="text-2xl font-bold text-risk-high">{maestroThreats.high}</p>
                  <p className="text-xs text-muted-foreground">High</p>
                </div>
              )}
              {maestroThreats.medium > 0 && (
                <div className="text-center">
                  <p className="text-2xl font-bold text-status-warning">{maestroThreats.medium}</p>
                  <p className="text-xs text-muted-foreground">Medium</p>
                </div>
              )}
              {maestroThreats.low > 0 && (
                <div className="text-center">
                  <p className="text-2xl font-bold text-status-info">{maestroThreats.low}</p>
                  <p className="text-xs text-muted-foreground">Low</p>
                </div>
              )}
            </div>
            <p className="text-xs text-muted-foreground mt-3">
              Agentic AI threats identified by MAESTRO framework increase risk score for multi-agent system security.
            </p>
          </CardContent>
        </Card>
      )}

      <div className="space-y-4">
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <Label>Likelihood Score</Label>
            <Badge variant="outline">{likelihood} - {getLikelihoodLabel(likelihood)}</Badge>
          </div>
          <Slider
            value={[likelihood]}
            onValueChange={(value) => setLikelihood(value[0])}
            max={5}
            min={1}
            step={1}
            className="py-4"
          />
          <p className="text-sm text-muted-foreground">
            Rate the probability of an incident occurring (1=Rare to 5=Almost Certain)
          </p>
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <Label>Impact Score</Label>
            <Badge variant="outline">{impact} - {getImpactLabel(impact)}</Badge>
          </div>
          <Slider
            value={[impact]}
            onValueChange={(value) => setImpact(value[0])}
            max={5}
            min={1}
            step={1}
            className="py-4"
          />
          <p className="text-sm text-muted-foreground">
            Rate the potential impact on data subjects (1=Minimal to 5=Critical)
          </p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Card>
          <CardContent className="pt-4">
            <p className="text-sm font-medium text-muted-foreground mb-1">Volume Factor</p>
            <p className="text-2xl font-bold text-foreground">{volumeFactor}x</p>
            <p className="text-xs text-muted-foreground mt-1">Based on 1,000-10,000 subjects</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-4">
            <p className="text-sm font-medium text-muted-foreground mb-1">Regulatory Multiplier</p>
            <p className="text-2xl font-bold text-foreground">+{regulatoryMultiplier}</p>
            <p className="text-xs text-muted-foreground mt-1">GDPR Art. 35 mandatory DPIA</p>
          </CardContent>
        </Card>
      </div>

      <div className="space-y-2">
        <Label htmlFor="risk-justification">Risk Justification *</Label>
        <Textarea
          id="risk-justification"
          placeholder="Provide detailed justification for the likelihood and impact scores..."
          rows={4}
          value={data.riskJustification ?? ""}
          onChange={(event) =>
            setData((prev: any) => ({
              ...prev,
              riskJustification: event.target.value,
            }))
          }
        />
      </div>

      <div className="p-4 bg-muted rounded-lg space-y-2">
        <h4 className="font-semibold text-foreground">Risk Classification Thresholds</h4>
        <div className="space-y-1 text-sm">
          <p className="text-muted-foreground">• Low (0-10): Document only, annual review</p>
          <p className="text-muted-foreground">• Medium (11-20): DPIA required, semi-annual review</p>
          <p className="text-muted-foreground">• High (21-35): Full DPIA, mitigation plan, quarterly review</p>
          <p className="text-muted-foreground">• Critical (36+): Executive approval, monthly monitoring</p>
        </div>
      </div>
    </div>
  );
};

function getLikelihoodLabel(score: number) {
  const labels = ["", "Rare", "Unlikely", "Possible", "Likely", "Almost Certain"];
  return labels[score];
}

function getImpactLabel(score: number) {
  const labels = ["", "Minimal", "Low", "Medium", "High", "Critical"];
  return labels[score];
}
