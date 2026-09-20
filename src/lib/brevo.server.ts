// Server-only Brevo marketing helper. Calls go through the Lovable connector
// gateway using the linked Brevo connection key. Never import from client code.

const GATEWAY_URL = "https://connector-gateway.lovable.dev/brevo";

// Brevo contact list that receives free-guide signups who consented to marketing.
export const GUIDE_LEADS_LIST_ID = 5;

async function brevoFetch(path: string, init: RequestInit = {}): Promise<Response> {
  const lovableKey = process.env["LOVABLE_API_KEY"];
  const connectionKey = process.env["BREVO_API_KEY"];
  if (!lovableKey || !connectionKey) {
    throw new Error("Brevo connection is not configured");
  }
  const res = await fetch(`${GATEWAY_URL}${path}`, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${lovableKey}`,
      "X-Connection-Api-Key": connectionKey,
      ...(init.headers ?? {}),
    },
  });
  if (!res.ok) {
    const body = await res.text();
    throw new Error(`Brevo request failed [${res.status}]: ${body}`);
  }
  return res;
}

/** Add (or update) a consented guide lead in the Brevo "Guide leads" list. */
export async function addGuideLeadToBrevo(email: string): Promise<void> {
  await brevoFetch("/contacts", {
    method: "POST",
    body: JSON.stringify({
      email,
      listIds: [GUIDE_LEADS_LIST_ID],
      updateEnabled: true,
      attributes: { SOURCE: "free-guide" },
    }),
  });
}

/** Remove a lead from marketing once they've bought — they should stop getting "come back and buy" emails. */
export async function removeGuideLeadFromBrevo(email: string): Promise<void> {
  await brevoFetch(`/contacts/lists/${GUIDE_LEADS_LIST_ID}/contacts/remove`, {
    method: "POST",
    body: JSON.stringify({ emails: [email] }),
  });
}
