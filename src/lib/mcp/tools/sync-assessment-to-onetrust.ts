import { defineTool } from "@lovable.dev/mcp-js";
import { z } from "zod";
import { supabaseForUser } from "../supabase";

type RuntimeGlobals = typeof globalThis & {
  Deno?: { env?: { get?: (name: string) => string | undefined } };
  process?: { env?: Record<string, string | undefined> };
};

function env(name: string): string | undefined {
  const runtime = globalThis as RuntimeGlobals;
  return (runtime.Deno?.env?.get?.(name) ?? runtime.process?.env?.[name])?.trim() || undefined;
}

const RISK_MAP: Record<string, string> = {
  low: "Low",
  medium: "Medium",
  high: "High",
  critical: "Very High",
};

const STATUS_MAP: Record<string, string> = {
  draft: "In Progress",
  in_review: "In Review",
  "in-review": "In Review",
  review: "In Review",
  completed: "Completed",
  approved: "Approved",
  archived: "Archived",
};

/** Map a Priveria assessment row onto the OneTrust assessment/inventory shape. */
function mapToOneTrust(assessment: Record<string, unknown>) {
  const details = (assessment.details ?? {}) as Record<string, unknown>;
  const risks: Array<Record<string, unknown>> = Array.isArray(details.risks) ? details.risks : [];

  return {
    assessment: {
      name: assessment.name,
      externalId: assessment.display_id ?? assessment.id,
      templateType: "DPIA",
      status: STATUS_MAP[String(assessment.status).toLowerCase()] ?? "In Progress",
      residualRiskLevel: RISK_MAP[String(assessment.risk_level).toLowerCase()] ?? "Unknown",
      riskScore: assessment.risk_score ?? 0,
      owner: assessment.owner ?? null,
      nextReviewDate: assessment.next_review ?? null,
    },
    processingActivity: {
      purpose: assessment.processing_purpose ?? null,
      processingType: assessment.processing_type ?? null,
      lawfulBasis: assessment.legal_basis ?? null,
      retentionPeriod: assessment.retention_period ?? null,
      personalDataCategories: assessment.data_categories ?? [],
    },
    risks: risks.map((risk, index) => ({
      externalId: risk.id ?? `${String(assessment.display_id ?? assessment.id)}-R${index + 1}`,
      name: risk.title ?? risk.name ?? `Risk ${index + 1}`,
      description: risk.description ?? null,
      likelihood: risk.likelihood ?? null,
      impact: risk.impact ?? null,
      treatment: risk.mitigation ?? risk.treatment ?? null,
    })),
    fieldMappings: [
      { priveria: "name", oneTrust: "assessment.name" },
      { priveria: "display_id", oneTrust: "assessment.externalId" },
      { priveria: "status", oneTrust: "assessment.status" },
      { priveria: "risk_level", oneTrust: "assessment.residualRiskLevel" },
      { priveria: "risk_score", oneTrust: "assessment.riskScore" },
      { priveria: "processing_purpose", oneTrust: "processingActivity.purpose" },
      { priveria: "legal_basis", oneTrust: "processingActivity.lawfulBasis" },
      { priveria: "data_categories", oneTrust: "processingActivity.personalDataCategories" },
      { priveria: "retention_period", oneTrust: "processingActivity.retentionPeriod" },
      { priveria: "details.risks[]", oneTrust: "risks[]" },
    ],
  };
}

export default defineTool({
  name: "sync_assessment_to_onetrust",
  title: "Sync assessment to OneTrust",
  description:
    "Trigger the OneTrust GRC integration for one DPIA assessment. Maps the Priveria assessment onto the OneTrust DPIA/processing-activity schema, pushes it when OneTrust credentials are configured, and returns sync status plus the field mapping results. Use dry_run to preview the mapping without calling OneTrust.",
  inputSchema: {
    assessment_id: z
      .string()
      .describe("Assessment UUID or human-readable display id (e.g. DPIA-001) to sync."),
    dry_run: z
      .boolean()
      .optional()
      .describe("When true, only compute and return the mapping without pushing to OneTrust."),
  },
  annotations: { readOnlyHint: false, destructiveHint: false, openWorldHint: true },
  handler: async ({ assessment_id, dry_run }, ctx) => {
    if (!ctx.isAuthenticated()) {
      return { content: [{ type: "text", text: "Not authenticated" }], isError: true };
    }

    const supabase = supabaseForUser(ctx);
    const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(
      assessment_id,
    );

    const { data: assessment, error } = await supabase
      .from("assessments")
      .select("*")
      .eq(isUuid ? "id" : "display_id", assessment_id)
      .maybeSingle();

    if (error) return { content: [{ type: "text", text: error.message }], isError: true };
    if (!assessment) {
      return {
        content: [{ type: "text", text: `No assessment found for "${assessment_id}".` }],
        isError: true,
      };
    }

    const mapping = mapToOneTrust(assessment as Record<string, unknown>);
    const syncedAt = new Date().toISOString();

    const apiKey = env("ONETRUST_API_KEY");
    const orgId = env("ONETRUST_ORG_ID");
    const baseUrl = (env("ONETRUST_BASE_URL") ?? "https://app.onetrust.com/api").replace(/\/+$/, "");

    // Preview path: no credentials needed, no outbound call.
    if (dry_run || !apiKey) {
      const result = {
        assessmentId: assessment.id,
        displayId: assessment.display_id,
        syncStatus: dry_run ? "dry_run" : "not_configured",
        syncedAt,
        message: dry_run
          ? "Mapping computed. No data was sent to OneTrust."
          : "OneTrust credentials are not configured for this workspace (ONETRUST_API_KEY missing). Returned the mapping that would be pushed.",
        target: { baseUrl, organizationId: orgId ?? null },
        mapping,
      };
      return {
        content: [{ type: "text", text: JSON.stringify(result, null, 2) }],
        structuredContent: result,
      };
    }

    // Live push to OneTrust.
    let syncStatus = "failed";
    let remoteId: string | null = null;
    let message = "";
    let httpStatus: number | null = null;

    try {
      const response = await fetch(`${baseUrl}/privacy/v2/assessments`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
          ...(orgId ? { "X-Organization-Id": orgId } : {}),
        },
        body: JSON.stringify(mapping),
      });

      httpStatus = response.status;
      const bodyText = await response.text();

      if (response.ok) {
        syncStatus = "synced";
        try {
          const parsed = JSON.parse(bodyText);
          remoteId = parsed?.id ?? parsed?.assessmentId ?? null;
        } catch {
          remoteId = null;
        }
        message = "Assessment pushed to OneTrust successfully.";
      } else {
        message = `OneTrust rejected the sync [${response.status}]: ${bodyText.slice(0, 500)}`;
      }
    } catch (fetchError) {
      message = `OneTrust request failed: ${
        fetchError instanceof Error ? fetchError.message : String(fetchError)
      }`;
    }

    // Persist the sync outcome on the assessment so the app UI reflects it.
    const details = (assessment.details ?? {}) as Record<string, unknown>;
    const nextDetails = {
      ...details,
      integrations: {
        ...((details.integrations as Record<string, unknown>) ?? {}),
        onetrust: {
          syncStatus,
          syncedAt,
          remoteId,
          message,
          httpStatus,
        },
      },
    };

    const { error: updateError } = await supabase
      .from("assessments")
      .update({ details: nextDetails })
      .eq("id", assessment.id);

    const result = {
      assessmentId: assessment.id,
      displayId: assessment.display_id,
      syncStatus,
      syncedAt,
      httpStatus,
      remoteId,
      message,
      persisted: !updateError,
      persistError: updateError?.message ?? null,
      target: { baseUrl, organizationId: orgId ?? null },
      mapping,
    };

    return {
      content: [{ type: "text", text: JSON.stringify(result, null, 2) }],
      structuredContent: result,
      isError: syncStatus === "failed",
    };
  },
});
