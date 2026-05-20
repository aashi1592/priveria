import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Share2, Download, Copy, Check } from "lucide-react";
import { toast } from "sonner";
import { threatRegisterShare } from "@/lib/exportTemplates/threatRegisterShare";
import type { Assessment } from "@/contexts/AssessmentsContext";

interface RegisterEntry {
  lens: string;
  id: string;
  label: string;
  detail: string;
  addedAt: string;
}

interface Props {
  assessment: Assessment | undefined;
  register: RegisterEntry[];
}

const triggerDownload = (filename: string, content: string, mime: string) => {
  const blob = new Blob([content], { type: mime });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
};

const toCSV = (rows: RegisterEntry[]) => {
  const esc = (v: string) => `"${String(v).replace(/"/g, '""')}"`;
  const head = "Lens,ID,Label,Detail,AddedAt";
  const body = rows.map((r) => [r.lens, r.id, r.label, r.detail, r.addedAt].map(esc).join(",")).join("\n");
  return `${head}\n${body}`;
};

export const ShareableRegisterSection = ({ assessment, register }: Props) => {
  const [copied, setCopied] = useState(false);
  const disabled = !assessment || register.length === 0;

  const markdown = assessment ? threatRegisterShare.render({ assessment, threats: register }) : "";

  const handleCopy = async () => {
    if (!markdown) return;
    await navigator.clipboard.writeText(markdown);
    setCopied(true);
    toast.success("Shareable report section copied to clipboard");
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between flex-wrap gap-3">
          <CardTitle className="flex items-center gap-2">
            <Share2 className="w-5 h-5 text-primary" />
            Shareable Report Section
          </CardTitle>
          <Badge variant="outline">{register.length} threats</Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-muted-foreground">
          Export the threat register as a stakeholder-ready report section. Use for Privacy, Security, Engineering and
          Legal review ahead of the human-in-the-loop sign-off.
        </p>

        <div className="flex flex-wrap gap-2">
          <Button size="sm" onClick={handleCopy} disabled={disabled} className="gap-2">
            {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
            {copied ? "Copied" : "Copy Markdown"}
          </Button>
          <Button
            size="sm"
            variant="outline"
            disabled={disabled}
            className="gap-2"
            onClick={() => triggerDownload(`${assessment!.id}-threat-register.md`, markdown, "text/markdown")}
          >
            <Download className="w-4 h-4" /> Markdown
          </Button>
          <Button
            size="sm"
            variant="outline"
            disabled={disabled}
            className="gap-2"
            onClick={() => triggerDownload(`${assessment!.id}-threat-register.csv`, toCSV(register), "text/csv")}
          >
            <Download className="w-4 h-4" /> CSV
          </Button>
          <Button
            size="sm"
            variant="outline"
            disabled={disabled}
            className="gap-2"
            onClick={() =>
              triggerDownload(
                `${assessment!.id}-threat-register.json`,
                JSON.stringify({ assessment, register }, null, 2),
                "application/json"
              )
            }
          >
            <Download className="w-4 h-4" /> JSON
          </Button>
        </div>

        {markdown && (
          <div className="rounded-md border border-border bg-muted/30 p-4 max-h-72 overflow-auto">
            <pre className="text-xs whitespace-pre-wrap font-mono">{markdown}</pre>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
