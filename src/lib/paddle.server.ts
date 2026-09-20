export type PaddleEnv = "sandbox" | "live";

const gatewayBaseUrl = "https://connector-gateway.lovable.dev/paddle";

function getRequiredEnv(key: string) {
  const value = process.env[key];
  if (!value) throw new Error(`${key} is not configured`);
  return value;
}

export async function gatewayFetch(env: PaddleEnv, path: string, init?: RequestInit) {
  const connectionApiKey = getRequiredEnv(env === "sandbox" ? "PADDLE_SANDBOX_API_KEY" : "PADDLE_LIVE_API_KEY");
  const lovableApiKey = getRequiredEnv("LOVABLE_API_KEY");
  return fetch(`${gatewayBaseUrl}${path}`, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      "X-Connection-Api-Key": connectionApiKey,
      "Lovable-API-Key": lovableApiKey,
      ...init?.headers,
    },
  });
}