-- Extend the assessments table with the fields the application's Assessment
-- model carries, so DPIA records can persist server-side (owner-scoped via the
-- existing RLS policies) instead of in browser localStorage.
--
-- display_id preserves the human-readable "DPIA-YYYY-NNN" reference shown in the
-- UI and export templates; the UUID primary key remains the internal row id.

ALTER TABLE public.assessments
  ADD COLUMN IF NOT EXISTS display_id  TEXT,
  ADD COLUMN IF NOT EXISTS owner       TEXT,
  ADD COLUMN IF NOT EXISTS risk_score  INTEGER NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS tier        TEXT,
  ADD COLUMN IF NOT EXISTS next_review DATE,
  ADD COLUMN IF NOT EXISTS details     JSONB NOT NULL DEFAULT '{}'::jsonb;

-- The display reference must be unique per user (it is generated client-side as
-- an incrementing sequence scoped to the signed-in user's own assessments).
CREATE UNIQUE INDEX IF NOT EXISTS assessments_user_display_id_key
  ON public.assessments (user_id, display_id);
