import { createFileRoute } from "@tanstack/react-router";
import { timingSafeEqual, createHash } from "node:crypto";

// Scheduled follow-up sender for the free-guide audience.
// Runs daily (pg_cron) and sends the Day 2 / 4 / 7 Brevo templates to
// consented leads who have not purchased yet. Each email is sent once per
// lead, tracked by a timestamp column.

const STEPS = [
  { templateId: 1, days: 2, column: "followup1_sent_at" },
  { templateId: 2, days: 4, column: "followup2_sent_at" },
  { templateId: 3, days: 7, column: "followup3_sent_at" },
] as const;

function keyMatches(provided: string | null, expected: string): boolean {
  if (!provided) return false;
  const a = createHash("sha256").update(provided).digest();
  const b = createHash("sha256").update(expected).digest();
  return timingSafeEqual(a, b);
}

export const Route = createFileRoute("/api/public/marketing/followups")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const expected = process.env["MARKETING_CRON_KEY"];
        if (!expected) return new Response("Not configured", { status: 500 });

        const url = new URL(request.url);
        const header = /^Bearer ([^\s,]+)$/.exec(
          request.headers.get("authorization") ?? "",
        )?.[1];
        if (!keyMatches(header ?? url.searchParams.get("key"), expected)) {
          return new Response("Unauthorized", { status: 401 });
        }

        const { supabaseAdmin } = await import(
          "@/integrations/supabase/client.server"
        );
        const { sendBrevoTemplate } = await import("@/lib/brevo.server");

        const results: Record<string, number> = {};

        for (const step of STEPS) {
          const cutoff = new Date(
            Date.now() - step.days * 24 * 60 * 60 * 1000,
          ).toISOString();

          const { data, error } = await supabaseAdmin
            .from("guide_leads")
            .select("id, email")
            .eq("marketing_consent", true)
            .is("purchased_at", null)
            .is(step.column, null)
            .lte("created_at", cutoff)
            .limit(200);

          if (error) {
            console.error("[followups] query failed", step.column, error);
            continue;
          }

          let sent = 0;
          for (const lead of data ?? []) {
            try {
              await sendBrevoTemplate(lead.email, step.templateId);
              await supabaseAdmin
                .from("guide_leads")
                .update(
                  step.column === "followup1_sent_at"
                    ? { followup1_sent_at: new Date().toISOString() }
                    : step.column === "followup2_sent_at"
                      ? { followup2_sent_at: new Date().toISOString() }
                      : { followup3_sent_at: new Date().toISOString() },
                )
                .eq("id", lead.id);
              sent++;
            } catch (err) {
              console.error("[followups] send failed", lead.email, err);
            }
          }
          results[step.column] = sent;
        }

        return Response.json({ ok: true, results });
      },
    },
  },
});
