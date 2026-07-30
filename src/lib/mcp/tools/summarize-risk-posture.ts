import { defineTool } from "@lovable.dev/mcp-js";
import { z } from "zod";
import { supabaseForUser } from "../supabase";

export default defineTool({
  name: "summarize_risk_posture",
  title: "Summarize privacy risk posture",
  description:
    "Aggregate the signed-in user's assessments and vendors into a portfolio risk snapshot: counts by status, risk level, average risk score, and high-risk items needing attention.",
  inputSchema: {},
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: async (_input, ctx) => {
    if (!ctx.isAuthenticated()) {
      return { content: [{ type: "text", text: "Not authenticated" }], isError: true };
    }
    const supabase = supabaseForUser(ctx);

    const [assessmentsRes, vendorsRes] = await Promise.all([
      supabase.from("assessments").select("name, display_id, status, risk_level, risk_score, next_review"),
      supabase.from("vendors").select("name, risk_level, compliance_status"),
    ]);

    if (assessmentsRes.error) {
      return { content: [{ type: "text", text: assessmentsRes.error.message }], isError: true };
    }
    if (vendorsRes.error) {
      return { content: [{ type: "text", text: vendorsRes.error.message }], isError: true };
    }

    const assessments = assessmentsRes.data ?? [];
    const vendors = vendorsRes.data ?? [];

    const tally = (rows: Array<Record<string, unknown>>, key: string) =>
      rows.reduce<Record<string, number>>((acc, row) => {
        const value = String(row[key] ?? "unknown");
        acc[value] = (acc[value] ?? 0) + 1;
        return acc;
      }, {});

    const averageRiskScore = assessments.length
      ? Math.round(
          assessments.reduce((sum, a) => sum + (Number(a.risk_score) || 0), 0) / assessments.length,
        )
      : 0;

    const summary = {
      assessments: {
        total: assessments.length,
        byStatus: tally(assessments, "status"),
        byRiskLevel: tally(assessments, "risk_level"),
        averageRiskScore,
        highRisk: assessments
          .filter((a) => ["high", "critical"].includes(String(a.risk_level).toLowerCase()))
          .map((a) => ({
            name: a.name,
            displayId: a.display_id,
            riskLevel: a.risk_level,
            riskScore: a.risk_score,
            nextReview: a.next_review,
          })),
      },
      vendors: {
        total: vendors.length,
        byRiskLevel: tally(vendors, "risk_level"),
        byComplianceStatus: tally(vendors, "compliance_status"),
      },
    };

    return {
      content: [{ type: "text", text: JSON.stringify(summary, null, 2) }],
      structuredContent: summary,
    };
  },
});
