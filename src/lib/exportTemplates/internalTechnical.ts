import { ExportTemplate } from "./types";

export const internalTechnical: ExportTemplate = {
  id: "internal-technical",
  name: "Internal Technical Report",
  description: "Full threat register, controls and re-trigger events for engineering teams.",
  audience: "Engineering / Security / Privacy practitioners",
  render: ({ assessment, threats }) => {
    const d = (assessment.details ?? {}) as Record<string, unknown>;
    const byLens = threats.reduce<Record<string, typeof threats>>((acc, t) => {
      (acc[t.lens] ||= []).push(t);
      return acc;
    }, {});
    return `# Internal Technical Report — ${assessment.id}

## System
- Name: ${assessment.name}
- Category: ${assessment.category}
- Owner: ${assessment.owner}

## Processing summary
- Legal basis: ${d.legalBasis ?? "n/a"}
- Purpose: ${d.businessJustification ?? "n/a"}
- Safeguards: ${d.safeguards ?? "n/a"}
- Human oversight: ${d.oversight ?? "n/a"}

## Threat register
${Object.entries(byLens).map(([lens, items]) =>
  `### ${lens}\n${items.map((t) => `- **${t.id}** ${t.label} — ${t.detail}`).join("\n")}`
).join("\n\n") || "_Empty register._"}

## Re-trigger events
- Model version change (>= minor)
- Training data refresh introducing new categories
- New downstream tool integration
- Regulatory guidance update (EDPB / national DPA)
- Material change to vendor sub-processors

## Score
- Risk tier: ${assessment.tier}  |  Score: ${assessment.riskScore}  |  Level: ${assessment.riskLevel}
`;
  },
};
