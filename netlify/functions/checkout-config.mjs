// Returns what the browser needs to open Paddle checkout.
//
// Netlify environment variables (Site configuration → Environment variables):
//   PADDLE_CLIENT_TOKEN  required. Paddle → Developer tools → Authentication → Client-side tokens.
//                        Starts with "live_" (real payments) or "test_" (sandbox).
//   PADDLE_PRICE_ID      the pri_… id of the $19.99 price. Optional if the two below are set.
//   PADDLE_API_KEY       optional. Used only to look the price up when PADDLE_PRICE_ID is empty.
//   PADDLE_PRODUCT_IDS   optional. pro_… id(s) of the ZeroHours product, comma separated.
//
// The client token and price id are public by design (they end up in the browser either way);
// the API key never leaves this function.

export const config = { path: "/api/checkout-config" };

const HEADERS = { "Content-Type": "application/json", "Cache-Control": "public, max-age=300" };

let cachedPriceId;

async function lookUpPrice(env, sandbox) {
  const key = env.PADDLE_API_KEY;
  const product = (env.PADDLE_PRODUCT_IDS || "").split(",").map((s) => s.trim()).filter(Boolean)[0];
  if (!key || !product) return undefined;
  const base = sandbox ? "https://sandbox-api.paddle.com" : "https://api.paddle.com";
  const res = await fetch(`${base}/prices?product_id=${encodeURIComponent(product)}&status=active&per_page=50`, {
    headers: { Authorization: `Bearer ${key}`, "Paddle-Version": "1", Accept: "application/json" },
  });
  if (!res.ok) throw new Error("Paddle price lookup failed: " + res.status);
  const prices = (await res.json()).data || [];
  // Prefer a one-time price (no billing cycle). If several, take the cheapest active one.
  const oneTime = prices.filter((p) => !p.billing_cycle);
  const pool = oneTime.length ? oneTime : prices;
  pool.sort((a, b) => Number(a.unit_price?.amount || 0) - Number(b.unit_price?.amount || 0));
  return pool[0]?.id;
}

export default async () => {
  const env = process.env;
  const clientToken = (env.PADDLE_CLIENT_TOKEN || "").trim();
  if (!clientToken) {
    return new Response(JSON.stringify({ ok: false, reason: "not_configured" }), { status: 500, headers: { ...HEADERS, "Cache-Control": "no-store" } });
  }
  const sandbox = clientToken.startsWith("test_");
  try {
    const priceId = (env.PADDLE_PRICE_ID || "").trim() || cachedPriceId || (cachedPriceId = await lookUpPrice(env, sandbox));
    if (!priceId) {
      return new Response(JSON.stringify({ ok: false, reason: "no_price" }), { status: 500, headers: { ...HEADERS, "Cache-Control": "no-store" } });
    }
    return new Response(JSON.stringify({ ok: true, clientToken, priceId, environment: sandbox ? "sandbox" : "live" }), { status: 200, headers: HEADERS });
  } catch (err) {
    console.error(err);
    return new Response(JSON.stringify({ ok: false, reason: "upstream" }), { status: 502, headers: { ...HEADERS, "Cache-Control": "no-store" } });
  }
};
