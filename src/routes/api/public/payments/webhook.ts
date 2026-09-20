import { createFileRoute } from "@tanstack/react-router";
import { createHmac, timingSafeEqual } from "node:crypto";

// Purchase delivery webhook. Paddle (the payment provider) posts payment
// events here; on a completed purchase we email the buyer their download.
// Lives under /api/public — the caller is verified by Paddle's webhook
// signature before anything is processed.

type PaddleEnv = "sandbox" | "live";

function verifyPaddleSignature(
  rawBody: string,
  signatureHeader: string | null,
  secret: string,
): boolean {
  if (!signatureHeader) return false;
  const parts = Object.fromEntries(
    signatureHeader.split(";").map((p) => p.split("=") as [string, string]),
  );
  const ts = parts["ts"];
  const h1 = parts["h1"];
  if (!ts || !h1) return false;
  const expected = createHmac("sha256", secret)
    .update(`${ts}:${rawBody}`)
    .digest("hex");
  const a = Buffer.from(h1, "hex");
  const b = Buffer.from(expected, "hex");
  if (a.length !== b.length) return false;
  return timingSafeEqual(a, b);
}

export const Route = createFileRoute("/api/public/payments/webhook")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const url = new URL(request.url);
        const env: PaddleEnv =
          url.searchParams.get("env") === "live" ? "live" : "sandbox";
        const secret = process.env[
          env === "live" ? "PADDLE_WEBHOOK_SECRET_LIVE" : "PADDLE_WEBHOOK_SECRET"
        ];
        if (!secret) {
          console.error("[payments webhook] missing webhook secret for", env);
          return new Response("Webhook not configured", { status: 500 });
        }

        const rawBody = await request.text();
        if (
          !verifyPaddleSignature(
            rawBody,
            request.headers.get("Paddle-Signature"),
            secret,
          )
        ) {
          return new Response("Invalid signature", { status: 401 });
        }

        let payload: {
          event_type?: string;
          event_id?: string;
          data?: { id?: string; status?: string; custom_data?: { email?: string } };
        };
        try {
          payload = JSON.parse(rawBody);
        } catch {
          return new Response("Invalid payload", { status: 400 });
        }

        if (
          payload.event_type !== "transaction.completed" ||
          !payload.data?.id ||
          payload.data.status !== "completed"
        ) {
          return Response.json({ ok: true, skipped: true });
        }

        // Look up the buyer's email. The webhook payload does not include it,
        // so fetch the transaction with the customer expanded.
        const { gatewayFetch } = await import("@/lib/paddle.server");
        const txnRes = await gatewayFetch(
          env,
          `/transactions/${payload.data.id}?include=customer`,
        );
        if (!txnRes.ok) {
          console.error(
            "[payments webhook] failed to load transaction",
            txnRes.status,
          );
          return new Response("Upstream error", { status: 502 });
        }
        const txn = (await txnRes.json())?.data;
        const email: string | undefined =
          txn?.customer?.email ?? payload.data.custom_data?.email;
        if (!email) {
          console.error(
            "[payments webhook] no customer email for transaction",
            payload.data.id,
          );
          return new Response("Missing customer email", { status: 422 });
        }

        const { sendTemplateEmail } = await import(
          "@/lib/email-templates/send-email"
        );
        try {
          await sendTemplateEmail("purchase-delivery", email, {
            templateData: { orderId: payload.data.id },
            // Same event retried by the provider dedupes to a single email.
            idempotencyKey: `purchase-delivery-${payload.event_id ?? payload.data.id}`,
          });
        } catch (err) {
          console.error("[payments webhook] delivery email failed", err);
          // Non-2xx makes the provider retry the event; the idempotency key
          // prevents duplicate emails on retry.
          return new Response("Delivery failed", { status: 500 });
        }

        // Buyer is no longer a marketing lead: record the purchase and pull
        // them out of the Brevo "Guide leads" audience.
        const buyerEmail = email.toLowerCase();
        try {
          const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
          await supabaseAdmin
            .from("guide_leads")
            .update({ purchased_at: new Date().toISOString() })
            .eq("email", buyerEmail);
        } catch (err) {
          console.error("[payments webhook] failed to mark lead purchased", err);
        }
        try {
          const { removeGuideLeadFromBrevo } = await import("@/lib/brevo.server");
          await removeGuideLeadFromBrevo(buyerEmail);
        } catch (err) {
          console.error("[payments webhook] failed to remove buyer from Brevo list", err);
        }

        return Response.json({ ok: true });
      },
    },
  },
});
          console.error("[payments webhook] delivery email failed", err);
          // Non-2xx makes the provider retry the event; the idempotency key
          // prevents duplicate emails on retry.
          return new Response("Delivery failed", { status: 500 });
        }

        return Response.json({ ok: true });
      },
    },
  },
});
