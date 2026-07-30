import { defineTool } from "@lovable.dev/mcp-js";
import { z } from "zod";
import { supabaseForUser } from "../supabase";

export default defineTool({
  name: "get_assessment",
  title: "Get DPIA assessment",
  description:
    "Fetch one DPIA assessment in full, including processing details, data categories, legal basis, and the stored risk/threat details payload.",
  inputSchema: {
    id: z.string().describe("Assessment UUID, or the human-readable display id (e.g. DPIA-001)."),
  },
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: async ({ id }, ctx) => {
    if (!ctx.isAuthenticated()) {
      return { content: [{ type: "text", text: "Not authenticated" }], isError: true };
    }
    const supabase = supabaseForUser(ctx);
    const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id);

    const { data, error } = await supabase
      .from("assessments")
      .select("*")
      .eq(isUuid ? "id" : "display_id", id)
      .maybeSingle();

    if (error) return { content: [{ type: "text", text: error.message }], isError: true };
    if (!data) return { content: [{ type: "text", text: `No assessment found for "${id}".` }], isError: true };

    return {
      content: [{ type: "text", text: JSON.stringify(data, null, 2) }],
      structuredContent: { assessment: data },
    };
  },
});
