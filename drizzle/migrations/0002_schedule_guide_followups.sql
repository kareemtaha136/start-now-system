CREATE EXTENSION IF NOT EXISTS pg_cron WITH SCHEMA extensions;
CREATE EXTENSION IF NOT EXISTS pg_net WITH SCHEMA extensions;

SELECT cron.schedule(
  'zerohours-guide-followups',
  '0 15 * * *',
  $$
  SELECT net.http_post(
    url := 'https://project--8bdcf2c0-cd83-44f5-956b-6e817c0f0074.lovable.app/api/public/marketing/followups',
    headers := '{"Content-Type":"application/json","Authorization":"Bearer 2be1f342962d9c93eb09d885ac40c6637807c75544f025be"}'::jsonb,
    body := '{}'::jsonb
  );
  $$
);