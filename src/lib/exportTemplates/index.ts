import { edpbRegulator } from "./edpbRegulator";
import { euAiActConformity } from "./euAiActConformity";
import { boardBrief } from "./boardBrief";
import { internalTechnical } from "./internalTechnical";
import { threatRegisterShare } from "./threatRegisterShare";
export type { ExportTemplate, TemplateContext, ThreatRegisterEntry } from "./types";

export const exportTemplates = [edpbRegulator, euAiActConformity, boardBrief, internalTechnical, threatRegisterShare];
