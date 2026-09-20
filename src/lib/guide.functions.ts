import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const schema = z.object({
  email: z.string().email().max(200),
  marketingConsent: z.boolean(),
});

/**
 * Sends the free lead-magnet guide to one requested address.
 * One trigger, one recipient — never a list.
 * Also records the subscriber and their marketing consent so the list can be
 * exported to a dedicated marketing email service later.
 */
export const sendFreeGuide = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => schema.parse(data))
  .handler(async ({ data }) => {
    const { sendTemplateEmail } = await import("./email-templates/send-email");
    const email = data.email.trim().toLowerCase();

    try {
      const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
      await supabaseAdmin.from("guide_leads").upsert(
        {
          email,
          marketing_consent: data.marketingConsent,
          consented_at: data.marketingConsent ? new Date().toISOString() : null,
        },
        { onConflict: "email" },
      );
    } catch (error) {
      console.error("guide lead capture failed", error);
    }

    try {
      const result = await sendTemplateEmail("free-guide", email, {
        idempotencyKey: `free-guide-${email}`,
      });
      if (!result.sent) return { sent: false as const, reason: result.reason };
      return { sent: true as const };
    } catch (error) {
      console.error("free-guide send failed", error);
      return { sent: false as const, reason: "send_failed" as const };
    }
  });
