import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.76.0";

/**
 * retrigger-scan — time-based re-trigger scan (Level 1), independent of pg_cron.
 *
 * Calls the SECURITY DEFINER function public.apply_time_retriggers(), which
 * sends any completed, opted-in DPIA back to "in-review" once its next_review
 * date has passed. Intended to be invoked on a schedule (a Supabase Scheduled
 * Function, an external cron hitting this URL, or a GitHub Action) for
 * deployments where pg_cron is not enabled.
 *
 * Protected by a shared secret (RETRIGGER_SCAN_SECRET) rather than a user JWT,
 * since it runs unattended and affects all users' rows via the service role.
 */
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-scan-secret",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  const expected = Deno.env.get("RETRIGGER_SCAN_SECRET");
  const provided = req.headers.get("x-scan-secret");
  if (!expected || provided !== expected) {
    return new Response(
      JSON.stringify({ error: "Unauthorized" }),
      { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const admin = createClient(supabaseUrl, serviceRoleKey);

    const { data, error } = await admin.rpc("apply_time_retriggers");
    if (error) {
      return new Response(
        JSON.stringify({ error: "Scan failed" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    return new Response(
      JSON.stringify({ ok: true, reReviewed: data ?? 0 }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  } catch {
    return new Response(
      JSON.stringify({ error: "Scan failed" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  }
});
