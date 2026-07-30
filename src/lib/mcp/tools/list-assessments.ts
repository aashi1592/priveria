import { defineTool } from "@lovable.dev/mcp-js";
import { z } from "zod";
import { supabaseForUser } from "../supabase";

export default defineTool({
  name: "list_assessments",
  title: "List DPIA assessments",
  description:
    "List the signed-in user's DPIA / AI risk assessments with status, risk score, and risk level.",
  inputSchema: {
    status: z.string().optional().describe("Optional status filter, e.g. draft, in_review, completed."),
    limit: z.number().int().optional().describe("Maximum number of assessments to return (default 25)."),
  },
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: async ({ status, limit }, ctx) => {
    if (!ctx.isAuthenticated()) {
      return { content: [{ type: "text", text: "Not authenticated" }], isError: true };
    }
    const supabase = supabaseForUser(ctx);
    let query = supabase
      .from("assessments")
      .select("id, display_id, name, category, status, risk_level, risk_score, tier, owner, next_review, updated_at")
      .order("updated_at", { ascending: false })
      .limit(Math.min(Math.max(limit ?? 25, 1), 100));

    if (status) query = query.eq("status", status);

    const { data, error } = await query;
    if (error) return { content: [{ type: "text", text: error.message }], isError: true };

    return {
      content: [{ type: "text", text: JSON.stringify(data ?? [], null, 2) }],
      structuredContent: { assessments: data ?? [] },
    };
  },
});
