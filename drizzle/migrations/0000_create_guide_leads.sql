CREATE TABLE public.guide_leads (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text NOT NULL UNIQUE,
  marketing_consent boolean NOT NULL DEFAULT false,
  consented_at timestamptz,
  purchased_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now()
);

GRANT ALL ON public.guide_leads TO service_role;

ALTER TABLE public.guide_leads ENABLE ROW LEVEL SECURITY;
