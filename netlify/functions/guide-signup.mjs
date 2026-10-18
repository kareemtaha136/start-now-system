// Free-guide signup: emails the guide and (with consent) adds the person to the Brevo list.
//
// Netlify environment variables:
//   BREVO_API_KEY       required. Brevo → SMTP & API → API keys. Mark it "secret" in Netlify.
//   BREVO_LIST_ID       optional, default 5 (the "Guide leads" list the old site used).
//   BREVO_SENDER_EMAIL  optional, default noreply@zerohours.store (domain must be authenticated in Brevo).
//   BREVO_SENDER_NAME   optional, default ZeroHours.
//
// Follow-up emails (day 2/4/7) are run by a Brevo Automation triggered by "contact added to list".

export const config = { path: "/api/guide" };

const SITE = "https://zerohours.store";
const GUIDE_URL = `${SITE}/assets/docs/zerohours-just-start-free-guide.pdf`;
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const JSON_HEADERS = { "Content-Type": "application/json", "Cache-Control": "no-store" };

const reply = (status, body) => new Response(JSON.stringify(body), { status, headers: JSON_HEADERS });

function guideEmailHtml() {
  const btn = "display:block;background:#4338ca;border-radius:8px;color:#ffffff;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;font-size:15px;font-weight:700;text-align:center;text-decoration:none;padding:14px 24px;";
  const p = "font-size:15px;line-height:24px;margin:0 0 16px;color:#4b5160;";
  return `<!doctype html><html lang="en"><body style="background:#ffffff;margin:0;padding:24px 0;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;color:#20242e;">
<div style="display:none;max-height:0;overflow:hidden;">Your free ZeroHours guide is ready to download</div>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0"><tr><td align="center">
<table role="presentation" cellpadding="0" cellspacing="0" style="max-width:520px;width:100%;border:1px solid #e8e5df;border-radius:12px;"><tr><td style="padding:40px 32px;">
<h1 style="font-size:26px;font-weight:700;letter-spacing:-0.02em;margin:0 0 12px;color:#20242e;">Here's your guide.</h1>
<p style="${p}">Thanks for grabbing <strong>ZeroHours — Just Start</strong>. It walks through why starting feels so hard and how to make the first step small enough to actually take.</p>
<a href="${GUIDE_URL}" style="${btn}">Download the free guide</a>
<hr style="border:none;border-top:1px solid #e8e5df;margin:28px 0;">
<p style="${p}">When you want the full system that walks you through starting — next action, 5-minute start, Lock-In Mode, and your whole academic workload in one place — ZeroHours is a one-time purchase.</p>
<a href="${SITE}/#pricing" style="${btn}">Get ZeroHours — $19.99</a>
<hr style="border:none;border-top:1px solid #e8e5df;margin:28px 0;">
<p style="font-size:12px;line-height:18px;color:#8a8f9c;margin:0;">You received this because you requested the free guide at zerohours.store.</p>
</td></tr></table></td></tr></table></body></html>`;
}

const guideEmailText = () =>
  `Here's your guide.\n\nThanks for grabbing ZeroHours — Just Start.\nDownload it here: ${GUIDE_URL}\n\nWhen you want the full system, ZeroHours is a one-time purchase: ${SITE}/#pricing\n\nYou received this because you requested the free guide at zerohours.store.`;

async function brevo(path, apiKey, body) {
  const res = await fetch(`https://api.brevo.com/v3${path}`, {
    method: "POST",
    headers: { "api-key": apiKey, "Content-Type": "application/json", Accept: "application/json" },
    body: JSON.stringify(body),
  });
  if (!res.ok && res.status !== 204) {
    throw new Error(`Brevo ${path} ${res.status}: ${(await res.text()).slice(0, 300)}`);
  }
}

export default async (req) => {
  if (req.method !== "POST") return reply(405, { ok: false, reason: "method" });
  let input;
  try { input = await req.json(); } catch { return reply(400, { ok: false, reason: "bad_request" }); }

  // Honeypot: bots fill hidden fields. Pretend success, do nothing.
  if (input && typeof input.website === "string" && input.website.trim()) return reply(200, { ok: true });

  const email = String(input?.email || "").trim().toLowerCase();
  const consent = input?.marketingConsent === true || input?.marketingConsent === "on";
  if (!EMAIL_RE.test(email) || email.length > 200) return reply(400, { ok: false, reason: "invalid_email" });

  const apiKey = (process.env.BREVO_API_KEY || "").trim();
  if (!apiKey) return reply(500, { ok: false, reason: "not_configured" });

  const listId = parseInt(process.env.BREVO_LIST_ID || "5", 10) || 5;
  const sender = {
    email: process.env.BREVO_SENDER_EMAIL || "noreply@zerohours.store",
    name: process.env.BREVO_SENDER_NAME || "ZeroHours",
  };

  const result = { ok: true, emailed: false, listed: false };

  if (consent) {
    try {
      await brevo("/contacts", apiKey, { email, listIds: [listId], updateEnabled: true, attributes: { SOURCE: "free-guide" } });
      result.listed = true;
    } catch (err) {
      console.error("brevo contact failed", err);
    }
  }

  try {
    await brevo("/smtp/email", apiKey, {
      sender,
      to: [{ email }],
      subject: "Your free ZeroHours guide",
      htmlContent: guideEmailHtml(),
      textContent: guideEmailText(),
      tags: ["free-guide"],
    });
    result.emailed = true;
  } catch (err) {
    console.error("brevo send failed", err);
  }

  if (!result.emailed && !result.listed) return reply(502, { ok: false, reason: "upstream" });
  return reply(200, result);
};
