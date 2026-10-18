# zerohours.store (static)

Plain HTML pages in `site/`, served by Netlify with no build step.

- Edit page content in `tools/build.py` (and `tools/legal/*.html` for legal pages), then run
  `python3 tools/build.py` and `tools/tailwind.sh` (needs the Tailwind v4 standalone CLI).
- Checkout: `site/assets/site.js` opens Paddle using `/api/checkout-config`
  (`netlify/functions/checkout-config.mjs`), which reads Netlify environment variables.
- Forms (`free-guide`, `support`) are Netlify Forms.
