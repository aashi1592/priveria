import { defineTool } from "@lovable.dev/mcp-js";
import { z } from "zod";
import { supabaseForUser } from "../supabase";

type Json = Record<string, unknown>;

interface PolicyMapping {
  source: string;
  sourceId: string;
  title: string;
  policyArea: string;
  safeguards: string[];
  controlRationale: string;
  regulatoryReferences: string[];
  riskLevel?: string;
  status: "planned" | "implemented" | "unmitigated";
}

const asArray = (v: unknown): Json[] => (Array.isArray(v) ? (v as Json[]) : []);
const asString = (v: unknown): string => (typeof v === "string" ? v : "");
const asStrings = (v: unknown): string[] =>
  Array.isArray(v) ? v.filter((x): x is string => typeof x === "string" && x.trim().length > 0) : [];

function mappingStatus(safeguards: string[]): PolicyMapping["status"] {
  return safeguards.length === 0 ? "unmitigated" : "planned";
}

function buildMappings(details: Json): PolicyMapping[] {
  const mappings: PolicyMapping[] = [];

  // Risk register entries (Step 3)
  asArray(details.risks).forEach((risk, i) => {
    const safeguards = asStrings(risk.mitigations).concat(
      asString(risk.mitigation) ? [asString(risk.mitigation)] : [],
    );
    mappings.push({
      source: "risk_register",
      sourceId: asString(risk.id) || `RISK-${i + 1}`,
      title: asString(risk.title) || asString(risk.name) || `Risk ${i + 1}`,
      policyArea: asString(risk.category) || "General processing risk",
      safeguards,
      controlRationale:
        asString(risk.description) ||
        "Mitigates a risk recorded in the DPIA risk register; controls must reduce residual risk to an acceptable tier.",
      regulatoryReferences: ["GDPR Art. 35(7)(d)", "GDPR Art. 32"],
      riskLevel: asString(risk.riskLevel) || asString(risk.level) || undefined,
      status: mappingStatus(safeguards),
    });
  });

  // LINDDUN privacy threats (Step 6)
  asArray(details.linddunThreats).forEach((threat, i) => {
    const safeguards = asStrings(threat.mitigations);
    mappings.push({
      source: "linddun",
      sourceId: `LINDDUN-${asString(threat.category) || i + 1}`,
      title: asString(threat.name) || `LINDDUN threat ${i + 1}`,
      policyArea: asString(threat.category) || "Privacy threat",
      safeguards,
      controlRationale:
        asString(threat.scenario) ||
        asString(threat.description) ||
        "LINDDUN-derived privacy threat requiring a technical or organisational safeguard.",
      regulatoryReferences: ["GDPR Art. 25", "GDPR Art. 32", "ISO/IEC 27701"],
      riskLevel: asString(threat.riskLevel) || undefined,
      status: mappingStatus(safeguards),
    });
  });

  // MAESTRO agentic AI threats (Step 7)
  asArray(details.maestroThreats).forEach((threat, i) => {
    const safeguards = asStrings(threat.mitigations);
    mappings.push({
      source: "maestro",
      sourceId: `MAESTRO-${asString(threat.category) || i + 1}`,
      title: asString(threat.name) || `MAESTRO threat ${i + 1}`,
      policyArea: asString(threat.category) || "Agentic AI layer",
      safeguards,
      controlRationale:
        asString(threat.scenario) ||
        asString(threat.description) ||
        "Agentic AI layer threat identified by the MAESTRO assessment; requires guardrails on autonomy, tool access, or memory.",
      regulatoryReferences: ["EU AI Act Art. 9", "EU AI Act Art. 15", "ISO/IEC 42005"],
      riskLevel: asString(threat.riskLevel) || undefined,
      status: mappingStatus(safeguards),
    });
  });

  // Cross-cutting safeguards captured on the assessment itself
  const retention = asString(details.retention);
  if (retention) {
    mappings.push({
      source: "processing_controls",
      sourceId: "CTRL-RETENTION",
      title: "Retention and deletion",
      policyArea: "Storage limitation",
      safeguards: [`Retain for ${retention}, then delete or anonymise`],
      controlRationale:
        "Retention limits enforce storage limitation and support erasure requests; encode as an automated expiry rule in policy-as-code.",
      regulatoryReferences: ["GDPR Art. 5(1)(e)", "GDPR Art. 17"],
      status: "planned",
    });
  }

  const legalBasis = asString(details.legalBasis);
  if (legalBasis) {
    mappings.push({
      source: "processing_controls",
      sourceId: "CTRL-LEGAL-BASIS",
      title: `Legal basis: ${legalBasis}`,
      policyArea: "Lawfulness of processing",
      safeguards: [`Validate ${legalBasis} before processing; block on missing or withdrawn basis`],
      controlRationale:
        "Every processing path must assert the recorded legal basis at runtime, including consent withdrawal handling.",
      regulatoryReferences: ["GDPR Art. 6", "GDPR Art. 7"],
      status: "planned",
    });
  }

  if (details.crossBorder === true) {
    mappings.push({
      source: "processing_controls",
      sourceId: "CTRL-TRANSFER",
      title: "Cross-border transfer safeguards",
      policyArea: "International transfers",
      safeguards: ["Transfer mechanism (SCCs/adequacy) verified", "Transfer impact assessment on file"],
      controlRationale:
        "Cross-border flows require a lawful transfer mechanism and supplementary measures before data leaves the EEA.",
      regulatoryReferences: ["GDPR Ch. V", "GDPR Art. 46"],
      status: "planned",
    });
  }

  const additional = asString(details.additionalSafeguards);
  if (additional) {
    mappings.push({
      source: "safeguards_step",
      sourceId: "CTRL-ADDITIONAL",
      title: "Additional safeguards",
      policyArea: "Residual risk treatment",
      safeguards: additional
        .split(/\n|;/)
        .map((s) => s.trim())
        .filter(Boolean),
      controlRationale:
        asString(details.residualRisk) ||
        "Supplementary safeguards recorded by the assessor to bring residual risk within tolerance.",
      regulatoryReferences: ["GDPR Art. 35(7)(d)"],
      status: "implemented",
    });
  }

  const monitoring = asString(details.monitoringPlan);
  if (monitoring) {
    mappings.push({
      source: "safeguards_step",
      sourceId: "CTRL-MONITORING",
      title: "Ongoing monitoring plan",
      policyArea: "Continuous governance",
      safeguards: [monitoring],
      controlRationale:
        "Continuous monitoring keeps the DPIA live as the system, model, or vendor set changes.",
      regulatoryReferences: ["GDPR Art. 35(11)", "ISO/IEC 42005"],
      status: "implemented",
    });
  }

  return mappings;
}

export default defineTool({
  name: "list_policy_mappings",
  title: "List policy mappings and safeguards",
  description:
    "List the policy mappings, safeguards, and control rationales derived for a DPIA assessment — from the risk register, LINDDUN and MAESTRO threats, and the processing/safeguard controls — with regulatory references and coverage gaps.",
  inputSchema: {
    id: z.string().describe("Assessment UUID or display id (e.g. DPIA-001)."),
    source: z
      .enum(["all", "risk_register", "linddun", "maestro", "processing_controls", "safeguards_step"])
      .optional()
      .describe("Filter mappings by origin. Defaults to all."),
    unmitigated_only: z
      .boolean()
      .optional()
      .describe("Return only mappings that currently have no safeguard recorded."),
  },
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: async ({ id, source, unmitigated_only }, ctx) => {
    if (!ctx.isAuthenticated()) {
      return { content: [{ type: "text", text: "Not authenticated" }], isError: true };
    }

    const supabase = supabaseForUser(ctx);
    const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id);

    const { data, error } = await supabase
      .from("assessments")
      .select("id, display_id, name, status, risk_level, risk_score, legal_basis, retention_period, details")
      .eq(isUuid ? "id" : "display_id", id)
      .maybeSingle();

    if (error) return { content: [{ type: "text", text: error.message }], isError: true };
    if (!data) {
      return { content: [{ type: "text", text: `No assessment found for "${id}".` }], isError: true };
    }

    const details = ((data.details as Json) ?? {}) as Json;
    let mappings = buildMappings({
      legalBasis: data.legal_basis ?? undefined,
      retention: data.retention_period ?? undefined,
      ...details,
    });

    if (source && source !== "all") mappings = mappings.filter((m) => m.source === source);
    if (unmitigated_only) mappings = mappings.filter((m) => m.status === "unmitigated");

    const summary = {
      assessmentId: data.id,
      displayId: data.display_id,
      name: data.name,
      status: data.status,
      riskLevel: data.risk_level,
      riskScore: data.risk_score,
      totalMappings: mappings.length,
      unmitigated: mappings.filter((m) => m.status === "unmitigated").length,
      safeguardCount: mappings.reduce((n, m) => n + m.safeguards.length, 0),
      bySource: mappings.reduce<Record<string, number>>((acc, m) => {
        acc[m.source] = (acc[m.source] ?? 0) + 1;
        return acc;
      }, {}),
    };

    if (mappings.length === 0) {
      return {
        content: [
          {
            type: "text",
            text: `No policy mappings recorded for ${data.display_id ?? data.id}. Complete the risk register, threat modelling, or safeguards steps first.`,
          },
        ],
        structuredContent: { summary, mappings: [] },
      };
    }

    const text = [
      `Policy mappings for ${data.display_id ?? data.id} — ${data.name}`,
      `${summary.totalMappings} mappings, ${summary.safeguardCount} safeguards, ${summary.unmitigated} unmitigated.`,
      "",
      ...mappings.map((m) =>
        [
          `- [${m.source}] ${m.sourceId}: ${m.title} (${m.policyArea}${m.riskLevel ? `, ${m.riskLevel} risk` : ""}) — ${m.status}`,
          `  Rationale: ${m.controlRationale}`,
          `  Safeguards: ${m.safeguards.length ? m.safeguards.join("; ") : "none recorded"}`,
          `  References: ${m.regulatoryReferences.join(", ")}`,
        ].join("\n"),
      ),
    ].join("\n");

    return {
      content: [{ type: "text", text }],
      structuredContent: { summary, mappings },
    };
  },
});
