import type { Assessment } from "@/contexts/AssessmentsContext";

export interface ThreatRegisterEntry {
  lens: string;
  id: string;
  label: string;
  detail: string;
  addedAt: string;
}

export interface TemplateContext {
  assessment: Assessment;
  threats: ThreatRegisterEntry[];
}

export interface ExportTemplate {
  id: string;
  name: string;
  description: string;
  audience: string;
  render: (ctx: TemplateContext) => string;
}
