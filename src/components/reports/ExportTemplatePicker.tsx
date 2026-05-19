import { useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Download, Eye, FileType } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useAssessments } from "@/contexts/AssessmentsContext";
import { exportTemplates, type ThreatRegisterEntry } from "@/lib/exportTemplates";

const loadThreats = (id: string): ThreatRegisterEntry[] => {
  try {
    return JSON.parse(localStorage.getItem(`priveria.threatRegister.${id}`) || "[]");
  } catch {
    return [];
  }
};

export const ExportTemplatePicker = () => {
  const { assessments } = useAssessments();
  const [assessmentId, setAssessmentId] = useState(assessments[0]?.id ?? "");
  const [previewId, setPreviewId] = useState<string | null>(null);

  const assessment = useMemo(
    () => assessments.find((a) => a.id === assessmentId),
    [assessments, assessmentId]
  );
  const threats = assessmentId ? loadThreats(assessmentId) : [];

  const download = (templateId: string) => {
    const tpl = exportTemplates.find((t) => t.id === templateId);
    if (!tpl || !assessment) return;
    const content = tpl.render({ assessment, threats });
    const blob = new Blob([content], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${assessment.id}-${tpl.id}.md`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const previewTpl = previewId ? exportTemplates.find((t) => t.id === previewId) : null;
  const previewContent = previewTpl && assessment ? previewTpl.render({ assessment, threats }) : "";

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between flex-wrap gap-3">
          <CardTitle className="flex items-center gap-2">
            <FileType className="w-5 h-5 text-primary" />
            Export Templates
          </CardTitle>
          <div className="w-[320px]">
            <Select value={assessmentId} onValueChange={setAssessmentId}>
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
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {exportTemplates.map((tpl) => (
            <Card key={tpl.id} className="hover:shadow-md transition-shadow">
              <CardContent className="pt-6 space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h3 className="font-semibold">{tpl.name}</h3>
                    <p className="text-sm text-muted-foreground mt-1">{tpl.description}</p>
                  </div>
                  <Badge variant="outline">{tpl.audience}</Badge>
                </div>
                <div className="flex gap-2">
                  <Button size="sm" variant="outline" className="gap-2" onClick={() => setPreviewId(tpl.id)} disabled={!assessment}>
                    <Eye className="w-4 h-4" /> Preview
                  </Button>
                  <Button size="sm" className="gap-2" onClick={() => download(tpl.id)} disabled={!assessment}>
                    <Download className="w-4 h-4" /> Download .md
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </CardContent>

      <Dialog open={!!previewId} onOpenChange={(o) => !o && setPreviewId(null)}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>{previewTpl?.name}</DialogTitle>
          </DialogHeader>
          <ScrollArea className="h-[60vh] rounded-md border border-border p-4 bg-muted/30">
            <pre className="text-xs whitespace-pre-wrap font-mono">{previewContent}</pre>
          </ScrollArea>
        </DialogContent>
      </Dialog>
    </Card>
  );
};
