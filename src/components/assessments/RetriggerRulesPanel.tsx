/**
 * RetriggerRulesPanel — configure what makes a DPIA re-trigger review.
 *
 * Lets the owner opt into a time-based re-review (server scan on nextReview) and
 * pick which attributes, when changed, send the DPIA back to "in-review"
 * (evaluated client-side in AssessmentsContext via lib/retrigger). Also surfaces
 * the most recent automatic re-trigger.
 */
import { useState } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle } from "lucide-react";
import { RETRIGGER_ATTRIBUTES, getRetriggerConfig } from "@/lib/retrigger";
import type { Assessment } from "@/contexts/AssessmentsContext";
import { useAssessments } from "@/contexts/AssessmentsContext";
import { toast } from "sonner";

export const RetriggerRulesPanel = ({ assessment }: { assessment: Assessment }) => {
  const { updateAssessment } = useAssessments();
  const config = getRetriggerConfig(assessment);
  const [timeBased, setTimeBased] = useState<boolean>(config.timeBased ?? false);
  const [watch, setWatch] = useState<string[]>(config.watch ?? []);
  const [saving, setSaving] = useState(false);

  const toggle = (key: string) =>
    setWatch((prev) => (prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key]));

  const save = async () => {
    setSaving(true);
    try {
      const details = { ...(assessment.details ?? {}) } as Record<string, unknown>;
      details.retrigger = { ...config, timeBased, watch };
      await updateAssessment(assessment.id, { details });
      toast.success("Re-trigger rules saved.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h4 className="text-sm font-semibold text-foreground">Re-trigger rules</h4>
        {config.lastFired && (
          <Badge variant="destructive" className="gap-1">
            <AlertTriangle className="h-3 w-3" />
            Re-review required
          </Badge>
        )}
      </div>

      {config.lastFired && (
        <p className="text-xs text-muted-foreground">
          {config.lastFired.reason} · {new Date(config.lastFired.at).toLocaleString()}
        </p>
      )}

      <div className="flex items-center justify-between rounded-md border border-border p-3">
        <div>
          <p className="text-sm font-medium text-foreground">Time-based re-review</p>
          <p className="text-xs text-muted-foreground">
            Re-open this DPIA when its next review date passes (server scan).
          </p>
        </div>
        <Switch checked={timeBased} onCheckedChange={setTimeBased} />
      </div>

      <div>
        <p className="text-sm font-medium text-foreground mb-2">Re-trigger when these change</p>
        <div className="grid grid-cols-2 gap-2">
          {RETRIGGER_ATTRIBUTES.map((attr) => (
            <label key={attr.key} className="flex items-center gap-2 text-sm cursor-pointer">
              <Checkbox checked={watch.includes(attr.key)} onCheckedChange={() => toggle(attr.key)} />
              <span>{attr.label}</span>
            </label>
          ))}
        </div>
      </div>

      <Button size="sm" onClick={save} disabled={saving}>
        {saving ? "Saving…" : "Save re-trigger rules"}
      </Button>
    </div>
  );
};
