-- Re-trigger (Level 1, time-based): send a completed DPIA back into review once
-- its next_review date passes, but only for DPIAs that opted in via
-- details.retrigger.timeBased = true. Change-based re-triggering (Level 2) is
-- handled client-side in AssessmentsContext.
--
-- SECURITY DEFINER + no RLS filter means this touches all users' rows, so it is
-- for the scheduler / service role only; EXECUTE is revoked from client roles.

CREATE OR REPLACE FUNCTION public.apply_time_retriggers()
RETURNS integer
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $fn$
DECLARE
  affected integer;
BEGIN
  UPDATE public.assessments
     SET status = 'in-review',
         details = jsonb_set(
           COALESCE(details, '{}'::jsonb),
           '{retrigger,lastFired}',
           jsonb_build_object(
             'at', to_char(now(), 'YYYY-MM-DD"T"HH24:MI:SS"Z"'),
             'reason', 'Re-review required: scheduled review date reached'
           ),
           true
         )
   WHERE next_review IS NOT NULL
     AND next_review <= CURRENT_DATE
     AND status = 'completed'
     AND COALESCE((details -> 'retrigger' ->> 'timeBased')::boolean, false) = true;

  GET DIAGNOSTICS affected = ROW_COUNT;
  RETURN affected;
END;
$fn$;

REVOKE EXECUTE ON FUNCTION public.apply_time_retriggers() FROM PUBLIC, anon, authenticated;
-- The retrigger-scan edge function invokes this with the service role, and
-- pg_cron runs it as the table owner; no client role may call it.
GRANT EXECUTE ON FUNCTION public.apply_time_retriggers() TO service_role;

-- Schedule a daily scan if pg_cron is available (hosted Supabase: enable the
-- pg_cron extension in the dashboard). Guarded so the migration never hard-fails
-- on instances without pg_cron — call apply_time_retriggers() from your own
-- scheduler in that case.
DO $do$
BEGIN
  BEGIN
    CREATE EXTENSION IF NOT EXISTS pg_cron;
  EXCEPTION WHEN OTHERS THEN
    RAISE NOTICE 'pg_cron unavailable; schedule public.apply_time_retriggers() externally';
  END;

  IF EXISTS (SELECT 1 FROM pg_extension WHERE extname = 'pg_cron') THEN
    PERFORM cron.schedule(
      'priveria-retrigger-scan',
      '0 2 * * *',
      'SELECT public.apply_time_retriggers();'
    );
  END IF;
END;
$do$;
