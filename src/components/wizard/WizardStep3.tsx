import { useState } from "react";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";

export const WizardStep3 = ({ data, setData }: any) => {
  const [likelihood, setLikelihood] = useState(data.likelihood || 3);
  const [impact, setImpact] = useState(data.impact || 3);

  const volumeFactor = 1.2;
  const regulatoryMultiplier = 5;
  const baseScore = likelihood * impact * volumeFactor;
  const finalScore = Math.round(baseScore + regulatoryMultiplier);

  const getRiskLevel = (score: number) => {
    if (score >= 36) return { level: "Critical", color: "destructive" };
    if (score >= 21) return { level: "High", color: "destructive" };
    if (score >= 11) return { level: "Medium", color: "secondary" };
    return { level: "Low", color: "secondary" };
  };

  const riskLevel = getRiskLevel(finalScore);

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
            </p>
          </div>
        </CardContent>
      </Card>

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
          defaultValue={data.riskJustification}
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
