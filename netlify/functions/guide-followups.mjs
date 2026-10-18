// Daily follow-up emails for free-guide signups who ticked the marketing box.
// Sends the Brevo templates 1, 2 and 3 on day 2, 4 and 7 after signup — each once per person.
// Runs every day at 15:00 UTC (11am New York). Needs BREVO_API_KEY.
//
// Optional env: BREVO_FOLLOWUP_TEMPLATES="1,2,3"  BREVO_FOLLOWUP_DAYS="2,4,7"

import { brevo, brevoKey, ensureAttributes, listId } from "../lib/brevo.mjs";

export const config = { schedule: "0 15 * * *" };

const DAY = 24 * 60 * 60 * 1000;
const nums = (v, d) => (v || d).split(",").map((x) => parseInt(x.trim(), 10)).filter((n) => !isNaN(n));

export default async () => {
  if (!brevoKey()) { console.error("followups: BREVO_API_KEY not set"); return; }
  const templates = nums(process.env.BREVO_FOLLOWUP_TEMPLATES, "1,2,3");
  const days = nums(process.env.BREVO_FOLLOWUP_DAYS, "2,4,7");
  const steps = templates.map((t, i) => ({ template: t, days: days[i], attr: `FOLLOWUP${i + 1}_AT` })).filter((s) => s.days);
  await ensureAttributes();

  const now = Date.now();
  const sent = {};
  let offset = 0;
  for (;;) {
    const page = await brevo("GET", `/contacts/lists/${listId()}/contacts?limit=500&offset=${offset}`);
    const contacts = page?.contacts || [];
    for (const c of contacts) {
      if (c.emailBlacklisted) continue;
      const a = c.attributes || {};
      const start = Date.parse(a.GUIDE_SIGNUP_AT || c.createdAt || "");
      if (isNaN(start)) continue;
      // Send at most one step per run, the earliest one that's due and not sent yet.
      const step = steps.find((s) => !a[s.attr] && now - start >= s.days * DAY);
      if (!step) continue;
      try {
        await brevo("POST", "/smtp/email", { to: [{ email: c.email }], templateId: step.template, tags: ["guide-followup"] });
        await brevo("PUT", `/contacts/${encodeURIComponent(c.email)}`, { attributes: { [step.attr]: new Date().toISOString() } });
        sent[step.attr] = (sent[step.attr] || 0) + 1;
      } catch (err) {
        console.error("followup send failed", c.email, step.attr, err.message);
      }
    }
    if (contacts.length < 500) break;
    offset += 500;
  }
  console.log("followups sent", JSON.stringify(sent));
};
