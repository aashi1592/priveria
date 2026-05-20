import { ExportTemplate } from "./types";

export const threatRegisterShare: ExportTemplate = {
  id: "threat-register-share",
  name: "Threat Register — Stakeholder Share",
  description: "Shareable report section summarising the threat register for cross-functional stakeholders.",
  audience: "Privacy / Security / Engineering / Legal",
  render: ({ assessment, threats }) => {
    const byLens = threats.reduce<Record<string, typeof threats>>((acc, t) => {
      (acc[t.lens] ||= []).push(t);
      return acc;
    }, {});
    const lensSection = (lens: string) =>
      `### ${lens} (${byLens[lens]?.length ?? 0})\n` +
      ((byLens[lens] ?? [])
        .map((t) => `- **${t.id} — ${t.label}**\n  ${t.detail}`)
        .join("\n") || "_None recorded._");

    return `# Threat Register — ${assessment.name}

**Assessment:** ${assessment.id}  |  **Owner:** ${assessment.owner}  |  **Date:** ${assessment.date}
**Risk tier:** ${assessment.tier}  |  **Score:** ${assessment.riskScore}/100  |  **Level:** ${assessment.riskLevel.toUpperCase()}

> Shareable report section. Distribute to Privacy, Security, Engineering and Legal stakeholders for review ahead of the human-in-the-loop sign-off.

## Summary
- **Total threats:** ${threats.length}
${Object.keys(byLens).sort().map((l) => `- **${l}:** ${byLens[l].length}`).join("\n") || "- _No threats attached yet._"}

## Threats by lens
${lensSection("STRIDE")}

${lensSection("ATLAS")}

${Object.keys(byLens).filter((l) => l !== "STRIDE" && l !== "ATLAS").map(lensSection).join("\n\n")}

## Stakeholder actions
- **Privacy:** confirm DPIA risk tier reflects threats above.
- **Security:** map each threat to an existing control or open a mitigation ticket.
- **Engineering:** validate technical feasibility of proposed controls.
- **Legal:** flag any threat with regulator-notification implications.

_Generated ${new Date().toISOString()} from Priveria._
`;
  },
};
