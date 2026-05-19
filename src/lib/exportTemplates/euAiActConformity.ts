import { ExportTemplate } from "./types";

export const euAiActConformity: ExportTemplate = {
  id: "eu-ai-act",
  name: "EU AI Act Conformity Pack",
  description: "Maps assessment evidence to Articles 9, 10, 13 and 53.",
  audience: "Notified Body / internal AI governance",
  render: ({ assessment, threats }) => {
    const d = (assessment.details ?? {}) as Record<string, unknown>;
    return `# EU AI Act Conformity Pack — ${assessment.id}

**System:** ${assessment.name}
**Owner:** ${assessment.owner}
**Risk tier (internal):** ${assessment.tier} — score ${assessment.riskScore}

## Article 9 — Risk management system
- Continuous risk management documented via Priveria DPIA workflow.
- Identified risks: ${threats.length} structured entries (STRIDE/ATLAS/LINDDUN/MAESTRO).
- Residual risk acceptance: see §4 of the regulator template.

## Article 10 — Data and data governance
- Data categories: ${(Array.isArray(d.dataCategories) ? (d.dataCategories as string[]).join(", ") : "Not specified")}
- Relevance, representativeness, freedom from errors: controller attestation required.
- Bias examination: documented as part of safeguards.

## Article 13 — Transparency and provision of information to deployers
- Intended purpose: ${d.businessJustification ?? "Not specified"}
- Human oversight measures: ${d.oversight ?? "Not specified"}
- Known limitations: derived from threat register.

## Article 53 — Obligations for providers of GPAI models
- Technical documentation prepared.
- Training data summary maintained.
- Copyright policy in force.
- Downstream provider information made available.

## Threat coverage
${threats.map((t) => `- ${t.lens}/${t.id} — ${t.label}`).join("\n") || "- None attached."}
`;
  },
};
