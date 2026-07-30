import { defineTool } from "@lovable.dev/mcp-js";
import { z } from "zod";
import { supabaseForUser } from "../supabase";

export default defineTool({
  name: "list_vendors",
  title: "List third-party vendors",
  description:
    "List the signed-in user's third-party vendors with risk level, compliance status, jurisdiction, and certifications.",
  inputSchema: {
    risk_level: z.string().optional().describe("Optional risk level filter: low, medium, high, critical."),
    limit: z.number().int().optional().describe("Maximum number of vendors to return (default 25)."),
  },
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: async ({ risk_level, limit }, ctx) => {
    if (!ctx.isAuthenticated()) {
      return { content: [{ type: "text", text: "Not authenticated" }], isError: true };
    }
    const supabase = supabaseForUser(ctx);
    let query = supabase
      .from("vendors")
      .select("id, name, category, risk_level, compliance_status, jurisdiction, data_processing, certifications, updated_at")
      .order("updated_at", { ascending: false })
      .limit(Math.min(Math.max(limit ?? 25, 1), 100));

    if (risk_level) query = query.eq("risk_level", risk_level);

    const { data, error } = await query;
    if (error) return { content: [{ type: "text", text: error.message }], isError: true };

    return {
      content: [{ type: "text", text: JSON.stringify(data ?? [], null, 2) }],
      structuredContent: { vendors: data ?? [] },
    };
  },
});
