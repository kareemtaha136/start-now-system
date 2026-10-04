import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

export const supportSchema = z.object({
  name: z.string().trim().max(100).optional().default(""),
  email: z.string().trim().email().max(200),
  topic: z.string().trim().min(1).max(100),
  message: z.string().trim().min(10).max(3000),
  website: z.string().max(0).optional(), // honeypot
});

export const submitSupportRequest = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => supportSchema.parse(data))
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const email = data.email.toLowerCase();

    // Basic rate limit: max 5 requests per email per hour.
    const since = new Date(Date.now() - 3600_000).toISOString();
    const { count } = await supabaseAdmin
      .from("support_requests")
      .select("id", { count: "exact", head: true })
      .eq("email", email)
      .gte("created_at", since);
    if ((count ?? 0) >= 5) return { ok: false as const, reason: "rate_limited" as const };

    const { data: row, error } = await supabaseAdmin
      .from("support_requests")
      .insert({ name: data.name || null, email, topic: data.topic, message: data.message })
      .select("id")
      .single();
    if (error || !row) {
      console.error("support insert failed", error);
      return { ok: false as const, reason: "failed" as const };
    }

    try {
      const { sendTemplateEmail } = await import("./email-templates/send-email");
      await sendTemplateEmail("support-request", "", {
        templateData: { name: data.name, email, topic: data.topic, message: data.message },
        idempotencyKey: `support-${row.id}`,
        replyTo: email,
      });
    } catch (e) {
      console.error("support email failed", e);
    }
    return { ok: true as const };
  });
