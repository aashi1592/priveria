import { useState } from "react";
import { PageHeader } from "@/components/layout/PageHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Target, Plus, Check } from "lucide-react";
import { strideEntries } from "@/data/strideLenses";
import { atlasTactics } from "@/data/mitreAtlas";
import { useAssessments } from "@/contexts/AssessmentsContext";
import { ShareableRegisterSection } from "@/components/threat-modeling/ShareableRegisterSection";
import { toast } from "sonner";

interface RegisterEntry {
  lens: "STRIDE" | "ATLAS";
  id: string;
  label: string;
  detail: string;
  addedAt: string;
}

const storageKey = (assessmentId: string) => `priveria.threatRegister.${assessmentId}`;

const loadRegister = (assessmentId: string): RegisterEntry[] => {
  try {
    return JSON.parse(localStorage.getItem(storageKey(assessmentId)) || "[]");
  } catch {
    return [];
  }
};

const saveRegister = (assessmentId: string, entries: RegisterEntry[]) => {
  localStorage.setItem(storageKey(assessmentId), JSON.stringify(entries));
};

const ThreatModeling = () => {
  const { assessments } = useAssessments();
  const [selectedAssessment, setSelectedAssessment] = useState<string>(assessments[0]?.id ?? "");
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [register, setRegister] = useState<RegisterEntry[]>(
    selectedAssessment ? loadRegister(selectedAssessment) : []
  );

  const onAssessmentChange = (id: string) => {
    setSelectedAssessment(id);
    setRegister(loadRegister(id));
    setSelected(new Set());
  };

  const toggle = (key: string) => {
    setSelected((s) => {
      const next = new Set(s);
      if (next.has(key)) {
        next.delete(key);
      } else {
        next.add(key);
      }
      return next;
    });
  };

  const addSelectedToRegister = () => {
    if (!selectedAssessment) {
      toast.error("Select an assessment first");
      return;
    }
    const additions: RegisterEntry[] = [];
    selected.forEach((key) => {
      const [lens, id] = key.split("::");
      if (lens === "STRIDE") {
        const e = strideEntries.find((x) => x.id === id);
        if (e) additions.push({ lens: "STRIDE", id: e.id, label: e.category, detail: e.aiExample, addedAt: new Date().toISOString() });
      } else {
        const e = atlasTactics.find((x) => x.id === id);
        if (e) additions.push({ lens: "ATLAS", id: e.id, label: e.tactic, detail: e.description, addedAt: new Date().toISOString() });
      }
    });
    const merged = [...register, ...additions.filter((a) => !register.some((r) => r.lens === a.lens && r.id === a.id))];
    setRegister(merged);
    saveRegister(selectedAssessment, merged);
    setSelected(new Set());
    toast.success(`Added ${additions.length} threats to register`);
  };

  const inRegister = (lens: string, id: string) => register.some((r) => r.lens === lens && r.id === id);

  return (
    <div className="min-h-screen bg-background">
      <PageHeader
        title="Threat Modeling"
        description="Apply STRIDE and MITRE ATLAS lenses to your AI/ML systems"
      />
      <div className="px-6 py-8 space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="w-5 h-5 text-primary" />
              Threat Register Target
            </CardTitle>
          </CardHeader>
          <CardContent className="flex items-end gap-4 flex-wrap">
            <div className="flex-1 min-w-[260px] space-y-2">
              <label className="text-sm font-medium">Attach selected threats to assessment</label>
              <Select value={selectedAssessment} onValueChange={onAssessmentChange}>
                <SelectTrigger>
                  <SelectValue placeholder="Choose assessment" />
                </SelectTrigger>
                <SelectContent>
                  {assessments.map((a) => (
                    <SelectItem key={a.id} value={a.id}>
                      {a.id} — {a.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <Button onClick={addSelectedToRegister} disabled={selected.size === 0} className="gap-2">
              <Plus className="w-4 h-4" /> Add {selected.size} to register
            </Button>
            <div className="text-sm text-muted-foreground">
              Register has <span className="font-semibold text-foreground">{register.length}</span> threats
            </div>
          </CardContent>
        </Card>

        <Tabs defaultValue="stride">
          <TabsList>
            <TabsTrigger value="stride">STRIDE (ML-adapted)</TabsTrigger>
            <TabsTrigger value="atlas">MITRE ATLAS</TabsTrigger>
            <TabsTrigger value="register">Draft Register</TabsTrigger>
          </TabsList>

          <TabsContent value="stride" className="space-y-4 mt-4">
            <p className="text-sm text-muted-foreground">
              STRIDE re-framed for AI/ML pipelines. Complements LINDDUN (privacy) and MAESTRO (agentic AI).
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {strideEntries.map((e) => {
                const key = `STRIDE::${e.id}`;
                const added = inRegister("STRIDE", e.id);
                return (
                  <Card key={e.id} className={added ? "border-primary" : ""}>
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-md bg-primary/10 text-primary flex items-center justify-center font-bold">
                            {e.id}
                          </div>
                          <CardTitle className="text-base">{e.category}</CardTitle>
                        </div>
                        {added ? (
                          <Badge variant="secondary" className="gap-1"><Check className="w-3 h-3" /> In register</Badge>
                        ) : (
                          <Checkbox checked={selected.has(key)} onCheckedChange={() => toggle(key)} />
                        )}
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-2 text-sm">
                      <p>{e.definition}</p>
                      <p><span className="font-medium text-foreground">AI example:</span> {e.aiExample}</p>
                      <p><span className="font-medium text-foreground">Control:</span> {e.control}</p>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </TabsContent>

          <TabsContent value="atlas" className="space-y-4 mt-4">
            <p className="text-sm text-muted-foreground">
              MITRE ATLAS adversarial ML tactics. Select tactics relevant to your model's threat surface.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {atlasTactics.map((t) => {
                const key = `ATLAS::${t.id}`;
                const added = inRegister("ATLAS", t.id);
                return (
                  <Card key={t.id} className={added ? "border-primary" : ""}>
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <Badge variant="outline" className="mb-2">{t.id}</Badge>
                          <CardTitle className="text-base">{t.tactic}</CardTitle>
                        </div>
                        {added ? (
                          <Badge variant="secondary" className="gap-1"><Check className="w-3 h-3" /> In register</Badge>
                        ) : (
                          <Checkbox checked={selected.has(key)} onCheckedChange={() => toggle(key)} />
                        )}
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-2 text-sm">
                      <p>{t.description}</p>
                      <div className="flex flex-wrap gap-1">
                        {t.techniques.map((tech) => (
                          <Badge key={tech} variant="outline" className="text-xs font-normal">{tech}</Badge>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </TabsContent>

          <TabsContent value="register" className="mt-4 space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Draft Threat Register{selectedAssessment ? ` — ${selectedAssessment}` : ""}</CardTitle>
              </CardHeader>
              <CardContent>
                {register.length === 0 ? (
                  <p className="text-sm text-muted-foreground">No threats added yet.</p>
                ) : (
                  <div className="space-y-2">
                    {register.map((r) => (
                      <div key={`${r.lens}-${r.id}`} className="flex items-start justify-between border border-border rounded-md p-3">
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <Badge>{r.lens}</Badge>
                            <Badge variant="outline">{r.id}</Badge>
                            <span className="font-medium">{r.label}</span>
                          </div>
                          <p className="text-sm text-muted-foreground">{r.detail}</p>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            const next = register.filter((x) => !(x.lens === r.lens && x.id === r.id));
                            setRegister(next);
                            saveRegister(selectedAssessment, next);
                          }}
                        >
                          Remove
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            <ShareableRegisterSection
              assessment={assessments.find((a) => a.id === selectedAssessment)}
              register={register}
            />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default ThreatModeling;
