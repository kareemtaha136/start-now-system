// Small Brevo helper shared by the Netlify functions. Reads BREVO_API_KEY from the environment.
export const BREVO = "https://api.brevo.com/v3";

export function brevoKey() {
  return (process.env.BREVO_API_KEY || "").trim();
}

export function listId() {
  return parseInt(process.env.BREVO_LIST_ID || "5", 10) || 5;
}

export async function brevo(method, path, body) {
  const res = await fetch(BREVO + path, {
    method,
    headers: { "api-key": brevoKey(), "Content-Type": "application/json", Accept: "application/json" },
    body: body === undefined ? undefined : JSON.stringify(body),
  });
  const text = await res.text();
  let data = null;
  try { data = text ? JSON.parse(text) : null; } catch { data = text; }
  if (!res.ok) {
    const err = new Error(`Brevo ${method} ${path} ${res.status}: ${String(text).slice(0, 300)}`);
    err.status = res.status;
    err.data = data;
    throw err;
  }
  return data;
}

// Text attributes the site writes on contacts. Created once; "already exists" is fine.
export const ATTRS = ["SOURCE", "GUIDE_SIGNUP_AT", "FOLLOWUP1_AT", "FOLLOWUP2_AT", "FOLLOWUP3_AT"];

export async function ensureAttributes() {
  for (const name of ATTRS) {
    try {
      await brevo("POST", `/contacts/attributes/normal/${name}`, { type: "text" });
    } catch (err) {
      if (err.status !== 400) console.error("attribute", name, err.message);
    }
  }
}
