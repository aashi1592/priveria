ALTER TABLE public.assessments
  ADD COLUMN IF NOT EXISTS display_id text,
  ADD COLUMN IF NOT EXISTS owner text,
  ADD COLUMN IF NOT EXISTS risk_score numeric NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS tier text,
  ADD COLUMN IF NOT EXISTS next_review date,
  ADD COLUMN IF NOT EXISTS details jsonb NOT NULL DEFAULT '{}'::jsonb;

CREATE UNIQUE INDEX IF NOT EXISTS assessments_user_display_id_key
  ON public.assessments (user_id, display_id)
  WHERE display_id IS NOT NULL;