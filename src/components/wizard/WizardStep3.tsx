import { useEffect, useMemo, useState } from "react";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useEnterpriseConfig } from "@/contexts/EnterpriseConfigContext";
import { Shield, Brain, Plus, Trash2, ListPlus } from "lucide-react";

type RiskEntry = {
  id: string;
  title: string;
  category: string;
  likelihood: number;
  impact: number;
  mitigation: string;
};

const RISK_CATEGORIES = [
  "Confidentiality",
  "Integrity",
  "Availability",
  "Discrimination / Bias",
  "Unlawful Processing",
  "Data Subject Rights",
  "Third-Party / Vendor",
  "AI / Automated Decisioning",
  "Re-identification",
  "Regulatory / Compliance",
];

const newRisk = (): RiskEntry => ({
  id: crypto.randomUUID(),
  title: "",
  category: "Confidentiality",
  likelihood: 3,
  impact: 3,
  mitigation: "",
});

const scoreLabel = (s: number) => {
  if (s >= 20) return { label: "Critical", color: "destructive" as const };
  if (s >= 12) return { label: "High", color: "destructive" as const };
  if (s >= 6) return { label: "Medium", color: "secondary" as const };
  return { label: "Low", color: "secondary" as const };
};

export const WizardStep3 = ({ data, setData }: any) => {
  const { config } = useEnterpriseConfig();
  const [likelihood, setLikelihood] = useState(data.likelihood || 3);
  const [impact, setImpact] = useState(data.impact || 3);
  const [risks, setRisks] = useState<RiskEntry[]>(
    Array.isArray(data.risks) && data.risks.length > 0 ? data.risks : []
  );

  const volumeFactor = 1.2;
  const regulatoryMultiplier = 5;
  const baseScore = likelihood * impact * volumeFactor;

  // Aggregate user-defined risks: weighted contribution
  const risksAggregate = useMemo(() => {
    if (risks.length === 0) return { total: 0, max: 0, byLevel: { critical: 0, high: 0, medium: 0, low: 0 } };
    let total = 0;
    let max = 0;
    const byLevel = { critical: 0, high: 0, medium: 0, low: 0 };
    risks.forEach((r) => {
      const s = r.likelihood * r.impact;
      total += s;
      if (s > max) max = s;
      const lvl = scoreLabel(s).label.toLowerCase() as keyof typeof byLevel;
      byLevel[lvl]++;
    });
    return { total, max, byLevel };
  }, [risks]);

  let linddunAdjustment = 0;
  let linddunThreats = { critical: 0, high: 0, medium: 0, low: 0 };
  if (config.linddunEnabled && data.linddunThreats) {
    linddunThreats = data.linddunThreats.reduce((acc: any, threat: any) => {
      acc[threat.riskLevel.toLowerCase()]++;
      return acc;
    }, { critical: 0, high: 0, medium: 0, low: 0 });
    linddunAdjustment = (linddunThreats.critical * 8) + (linddunThreats.high * 4) + (linddunThreats.medium * 2) + (linddunThreats.low * 1);
  }

  let maestroAdjustment = 0;
  let maestroThreats = { critical: 0, high: 0, medium: 0, low: 0 };
  if (config.maestroEnabled && data.maestroThreats) {
    maestroThreats = data.maestroThreats.reduce((acc: any, threat: any) => {
      acc[threat.riskLevel.toLowerCase()]++;
      return acc;
    }, { critical: 0, high: 0, medium: 0, low: 0 });
    maestroAdjustment = (maestroThreats.critical * 8) + (maestroThreats.high * 4) + (maestroThreats.medium * 2) + (maestroThreats.low * 1);
  }

  // Risk register contribution (weighted so multiple risks meaningfully raise overall score)
  const registerAdjustment = Math.round(
    risksAggregate.byLevel.critical * 8 +
      risksAggregate.byLevel.high * 4 +
      risksAggregate.byLevel.medium * 2 +
      risksAggregate.byLevel.low * 1
  );

  const finalScore = Math.round(
    baseScore + regulatoryMultiplier + linddunAdjustment + maestroAdjustment + registerAdjustment
  );

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
      risks,
      calculatedRiskScore: finalScore,
      calculatedRiskLevel: riskLevel.level.toLowerCase(),
    }));
  }, [finalScore, impact, likelihood, riskLevel.level, risks, setData]);

  const updateRisk = (id: string, patch: Partial<RiskEntry>) => {
    setRisks((prev) => prev.map((r) => (r.id === id ? { ...r, ...patch } : r)));
  };
  const removeRisk = (id: string) => setRisks((prev) => prev.filter((r) => r.id !== id));
  const addRisk = () => setRisks((prev) => [...prev, newRisk()]);

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
              Base: {Math.round(baseScore)} + Regulatory: {regulatoryMultiplier}
              {registerAdjustment > 0 && <> + Register ({risks.length}): {registerAdjustment}</>}
              {config.linddunEnabled && linddunAdjustment > 0 && <> + LINDDUN: {linddunAdjustment}</>}
              {config.maestroEnabled && maestroAdjustment > 0 && <> + MAESTRO: {maestroAdjustment}</>}
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
              {(["critical","high","medium","low"] as const).map((lvl) => linddunThreats[lvl] > 0 && (
                <div key={lvl} className="text-center">
                  <p className={`text-2xl font-bold text-risk-${lvl === "medium" ? "high" : lvl}`}>{linddunThreats[lvl]}</p>
                  <p className="text-xs text-muted-foreground capitalize">{lvl}</p>
                </div>
              ))}
            </div>
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
              {(["critical","high","medium","low"] as const).map((lvl) => maestroThreats[lvl] > 0 && (
                <div key={lvl} className="text-center">
                  <p className={`text-2xl font-bold text-risk-${lvl === "medium" ? "high" : lvl}`}>{maestroThreats[lvl]}</p>
                  <p className="text-xs text-muted-foreground capitalize">{lvl}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      <div className="space-y-4">
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <Label>Overall Likelihood</Label>
            <Badge variant="outline">{likelihood} - {getLikelihoodLabel(likelihood)}</Badge>
          </div>
          <Slider value={[likelihood]} onValueChange={(v) => setLikelihood(v[0])} max={5} min={1} step={1} className="py-4" />
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <Label>Overall Impact</Label>
            <Badge variant="outline">{impact} - {getImpactLabel(impact)}</Badge>
          </div>
          <Slider value={[impact]} onValueChange={(v) => setImpact(v[0])} max={5} min={1} step={1} className="py-4" />
        </div>
      </div>

      {/* Multi-risk register */}
      <Card className="border-primary/30">
        <CardContent className="pt-5 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ListPlus className="w-4 h-4 text-primary" />
              <h4 className="font-semibold text-foreground">Risk Register</h4>
              <Badge variant="outline">{risks.length} risk{risks.length === 1 ? "" : "s"}</Badge>
            </div>
            <Button type="button" size="sm" onClick={addRisk} className="gap-2">
              <Plus className="w-4 h-4" /> Add Risk
            </Button>
          </div>
          <p className="text-xs text-muted-foreground">
            Add every distinct risk identified during the assessment. Each risk's likelihood × impact contributes to the overall DPIA score.
          </p>

          {risks.length === 0 ? (
            <div className="text-center py-8 border border-dashed rounded-lg">
              <p className="text-sm text-muted-foreground mb-3">No risks added yet.</p>
              <Button type="button" variant="outline" size="sm" onClick={addRisk} className="gap-2">
                <Plus className="w-4 h-4" /> Add your first risk
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {risks.map((r, idx) => {
                const score = r.likelihood * r.impact;
                const sl = scoreLabel(score);
                return (
                  <Card key={r.id} className="bg-muted/30">
                    <CardContent className="pt-4 space-y-3">
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <Badge variant="outline">#{idx + 1}</Badge>
                          <Badge variant={sl.color}>{sl.label} ({score})</Badge>
                        </div>
                        <Button type="button" size="icon" variant="ghost" onClick={() => removeRisk(r.id)}>
                          <Trash2 className="w-4 h-4 text-destructive" />
                        </Button>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <div className="space-y-1">
                          <Label className="text-xs">Risk title *</Label>
                          <Input
                            placeholder="e.g. Unauthorized access to training data"
                            value={r.title}
                            onChange={(e) => updateRisk(r.id, { title: e.target.value })}
                          />
                        </div>
                        <div className="space-y-1">
                          <Label className="text-xs">Category</Label>
                          <Select value={r.category} onValueChange={(v) => updateRisk(r.id, { category: v })}>
                            <SelectTrigger><SelectValue /></SelectTrigger>
                            <SelectContent>
                              {RISK_CATEGORIES.map((c) => (
                                <SelectItem key={c} value={c}>{c}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <Label className="text-xs">Likelihood</Label>
                            <Badge variant="outline">{r.likelihood} - {getLikelihoodLabel(r.likelihood)}</Badge>
                          </div>
                          <Slider value={[r.likelihood]} onValueChange={(v) => updateRisk(r.id, { likelihood: v[0] })} min={1} max={5} step={1} />
                        </div>
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <Label className="text-xs">Impact</Label>
                            <Badge variant="outline">{r.impact} - {getImpactLabel(r.impact)}</Badge>
                          </div>
                          <Slider value={[r.impact]} onValueChange={(v) => updateRisk(r.id, { impact: v[0] })} min={1} max={5} step={1} />
                        </div>
                      </div>

                      <div className="space-y-1">
                        <Label className="text-xs">Mitigation / Control</Label>
                        <Textarea
                          rows={2}
                          placeholder="Describe controls, owners, and target date..."
                          value={r.mitigation}
                          onChange={(e) => updateRisk(r.id, { mitigation: e.target.value })}
                        />
                      </div>
                    </CardContent>
                  </Card>
                );
              })}

              <Button type="button" variant="outline" onClick={addRisk} className="w-full gap-2">
                <Plus className="w-4 h-4" /> Add another risk
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

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
            setData((prev: any) => ({ ...prev, riskJustification: event.target.value }))
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
