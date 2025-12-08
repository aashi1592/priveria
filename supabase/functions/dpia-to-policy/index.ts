import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { dpiaJson, outputFormat } = await req.json();
    
    if (!dpiaJson) {
      return new Response(
        JSON.stringify({ error: "DPIA JSON is required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      console.error("LOVABLE_API_KEY is not configured");
      throw new Error("AI service is not configured");
    }

    const systemPrompt = `You are an expert at converting Data Protection Impact Assessment (DPIA) documents into Policy-as-Code for product and engineering teams.

Your task is to analyze the provided DPIA JSON and generate executable policy rules that can be integrated into software systems.

Output format should be ${outputFormat || "rego"} (Open Policy Agent Rego by default).

For each data processing activity in the DPIA, generate:
1. Access control policies based on data categories and sensitivity
2. Retention policies with automated expiration rules
3. Consent validation rules
4. Data minimization checks
5. Cross-border transfer validations if applicable
6. Audit logging requirements

Include comments explaining the GDPR/privacy rationale for each rule.
Structure the output as production-ready policy code with clear namespacing.`;

    const userPrompt = `Convert this DPIA JSON into Policy-as-Code:

${typeof dpiaJson === 'string' ? dpiaJson : JSON.stringify(dpiaJson, null, 2)}

Generate comprehensive policy rules covering:
- Data access controls
- Retention periods
- Consent requirements
- Data subject rights enforcement
- Risk mitigations identified in the DPIA`;

    console.log("Calling Lovable AI for DPIA-to-Policy conversion");

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt },
        ],
        stream: false,
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        console.error("Rate limit exceeded");
        return new Response(
          JSON.stringify({ error: "Rate limit exceeded. Please try again later." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      if (response.status === 402) {
        console.error("Payment required");
        return new Response(
          JSON.stringify({ error: "AI credits exhausted. Please add funds to continue." }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      throw new Error("Failed to generate policy code");
    }

    const data = await response.json();
    const policyCode = data.choices?.[0]?.message?.content;

    if (!policyCode) {
      throw new Error("No policy code generated");
    }

    console.log("Successfully generated policy code");

    return new Response(
      JSON.stringify({ policyCode, format: outputFormat || "rego" }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error in dpia-to-policy function:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
