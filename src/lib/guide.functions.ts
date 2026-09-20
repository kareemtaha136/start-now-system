import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const schema = z.object({ email: z.string().email().max(200) });

/**
 * Sends the free lead-magnet guide to one requested address.
 * One trigger, one recipient — never a list.
 */
export const sendFreeGuide = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => schema.parse(data))
  .handler(async ({ data }) => {
    const { sendTemplateEmail } = await import("./email-templates/send-email");
    const email = data.email.trim().toLowerCase();

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
