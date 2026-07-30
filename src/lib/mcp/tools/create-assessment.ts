import { defineTool } from "@lovable.dev/mcp-js";
import { z } from "zod";
import { supabaseForUser } from "../supabase";

export default defineTool({
  name: "create_assessment",
  title: "Create DPIA assessment",
  description:
    "Create a new DPIA / AI risk assessment for the signed-in user. Use for intake; refine details later in the Priveria wizard.",
  inputSchema: {
    name: z.string().trim().min(1).describe("Name of the system or processing activity."),
    category: z.string().trim().min(1).describe("Assessment category, e.g. AI System, Vendor, Product."),
    processing_purpose: z.string().optional().describe("Why the personal data is processed."),
    processing_type: z.string().optional().describe("Processing type, e.g. Product/Application."),
    legal_basis: z.string().optional().describe("GDPR legal basis, e.g. Consent, Legitimate Interests."),
    data_categories: z.array(z.string()).optional().describe("Categories of personal data processed."),
    retention_period: z.string().optional().describe("Retention period for the data."),
    owner: z.string().optional().describe("Accountable owner for this assessment."),
    risk_score: z.number().optional().describe("Initial risk score 0-100."),
    risk_level: z.string().optional().describe("Initial risk level: low, medium, high, or critical."),
    status: z.string().optional().describe("Initial status, defaults to draft."),
  },
  annotations: { readOnlyHint: false, destructiveHint: false, openWorldHint: false },
  handler: async (input, ctx) => {
    if (!ctx.isAuthenticated()) {
      return { content: [{ type: "text", text: "Not authenticated" }], isError: true };
    }
    const supabase = supabaseForUser(ctx);
    const { data, error } = await supabase
      .from("assessments")
      .insert({
        user_id: ctx.getUserId(),
        name: input.name,
        category: input.category,
        processing_purpose: input.processing_purpose ?? null,
        processing_type: input.processing_type ?? null,
        legal_basis: input.legal_basis ?? null,
        data_categories: input.data_categories ?? null,
        retention_period: input.retention_period ?? null,
        owner: input.owner ?? null,
        risk_score: input.risk_score ?? 0,
        risk_level: input.risk_level ?? "low",
        status: input.status ?? "draft",
        details: {},
      })
      .select()
      .maybeSingle();

    if (error) return { content: [{ type: "text", text: error.message }], isError: true };
    return {
      content: [{ type: "text", text: JSON.stringify(data, null, 2) }],
      structuredContent: { assessment: data },
    };
  },
});
