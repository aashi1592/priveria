import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.76.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const MAX_INPUT_BYTES = 100_000; // 100KB

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // ---- Authentication ----
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: "Authentication required" }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseAnonKey = Deno.env.get("SUPABASE_ANON_KEY")!;
    const supabaseClient = createClient(supabaseUrl, supabaseAnonKey);

    const { data: { user }, error: authError } = await supabaseClient.auth.getUser(
      authHeader.replace("Bearer ", "")
    );

    if (authError || !user) {
      return new Response(
        JSON.stringify({ error: "Invalid authentication" }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // ---- Input validation ----
    const { dpiaJson, outputFormat } = await req.json();

    if (!dpiaJson) {
      return new Response(
        JSON.stringify({ error: "DPIA JSON is required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const jsonString = typeof dpiaJson === "string" ? dpiaJson : JSON.stringify(dpiaJson);
    if (jsonString.length > MAX_INPUT_BYTES) {
      return new Response(
        JSON.stringify({ error: "DPIA JSON too large. Maximum size is 100KB." }),
        { status: 413, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const safeFormat = outputFormat === "typescript" ? "typescript" : "rego";

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      console.error("LOVABLE_API_KEY is not configured");
      return new Response(
        JSON.stringify({ error: "Service unavailable" }),
        { status: 503, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const systemPrompt = `You are an expert at converting Data Protection Impact Assessment (DPIA) documents into Policy-as-Code for product and engineering teams.

Your task is to analyze the provided DPIA JSON and generate executable policy rules that can be integrated into software systems.

Output format should be ${safeFormat} (Open Policy Agent Rego by default).

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

${jsonString}

Generate comprehensive policy rules covering:
- Data access controls
- Retention periods
- Consent requirements
- Data subject rights enforcement
- Risk mitigations identified in the DPIA`;

    console.log(`Calling Lovable AI for DPIA-to-Policy conversion (user ${user.id})`);

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
        return new Response(
          JSON.stringify({ error: "Rate limit exceeded. Please try again later." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: "AI credits exhausted. Please add funds to continue." }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      return new Response(
        JSON.stringify({ error: "Failed to generate policy code" }),
        { status: 502, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const data = await response.json();
    const policyCode = data.choices?.[0]?.message?.content;

    if (!policyCode) {
      return new Response(
        JSON.stringify({ error: "Failed to generate policy code" }),
        { status: 502, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    return new Response(
      JSON.stringify({ policyCode, format: safeFormat }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error in dpia-to-policy function:", error);
    return new Response(
      JSON.stringify({ error: "Request failed" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
