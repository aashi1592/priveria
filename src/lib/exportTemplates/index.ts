/**
 * Export templates registry.
 * Each template targets a different audience (EDPB regulators, EU AI Act auditors,
 * board-level briefs, internal engineers, threat register sharing).
 * Pass a template's `render(ctx)` method a TemplateContext to get the formatted string.
 */
import { edpbRegulator } from "./edpbRegulator";
import { euAiActConformity } from "./euAiActConformity";
import { boardBrief } from "./boardBrief";
import { internalTechnical } from "./internalTechnical";
import { threatRegisterShare } from "./threatRegisterShare";
export type { ExportTemplate, TemplateContext, ThreatRegisterEntry } from "./types";

export const exportTemplates = [edpbRegulator, euAiActConformity, boardBrief, internalTechnical, threatRegisterShare];
