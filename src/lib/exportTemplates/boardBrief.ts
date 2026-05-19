import { ExportTemplate } from "./types";

export const boardBrief: ExportTemplate = {
  id: "board-brief",
  name: "Board Brief (1-pager)",
  description: "Executive snapshot for board / leadership decision.",
  audience: "Board / Executive sponsor",
  render: ({ assessment, threats }) => `# Board Brief — ${assessment.name}

**Reference:** ${assessment.id}  |  **Owner:** ${assessment.owner}  |  **Date:** ${assessment.date}

## Risk position
- **Tier:** ${assessment.tier}
- **Score:** ${assessment.riskScore} / 100
- **Level:** ${assessment.riskLevel.toUpperCase()}

## Top threats (from register)
${threats.slice(0, 5).map((t, i) => `${i + 1}. ${t.label} (${t.lens}/${t.id})`).join("\n") || "_No threats attached._"}

## Decision required
- Approve residual risk acceptance
- Approve mitigation budget
- Approve go-live / continued operation

## Re-trigger events
- Material change to model, data scope, vendor, or processing purpose.
`,
};
