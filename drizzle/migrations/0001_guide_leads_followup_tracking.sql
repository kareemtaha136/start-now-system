ALTER TABLE public.guide_leads
  ADD COLUMN IF NOT EXISTS followup1_sent_at timestamptz,
  ADD COLUMN IF NOT EXISTS followup2_sent_at timestamptz,
  ADD COLUMN IF NOT EXISTS followup3_sent_at timestamptz;