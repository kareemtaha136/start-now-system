import { createFileRoute } from "@tanstack/react-router";
import { timingSafeEqual } from "crypto";

// Private CSV export of consented guide leads for the site owner.
// Access: /api/public/export/guide-leads?key=<GUIDE_EXPORT_KEY>
export const Route = createFileRoute("/api/public/export/guide-leads")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        const url = new URL(request.url);
        const key = url.searchParams.get("key") ?? "";
        const expected = process.env["GUIDE_EXPORT_KEY"] ?? "";
        const a = Buffer.from(key);
        const b = Buffer.from(expected);
        if (!expected || a.length !== b.length || !timingSafeEqual(a, b)) {
          return new Response("Unauthorized", { status: 401 });
        }

        const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
        const { data, error } = await supabaseAdmin
          .from("guide_leads")
          .select("email, marketing_consent, consented_at, purchased_at, created_at")
          .order("created_at", { ascending: false });
        if (error) return new Response("Export failed", { status: 500 });

        const esc = (v: unknown) => {
          const s = v == null ? "" : String(v);
          return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
        };
        const header = "email,marketing_consent,consented_at,purchased_at,created_at";
        const rows = (data ?? []).map((r) =>
          [r.email, r.marketing_consent, r.consented_at, r.purchased_at, r.created_at].map(esc).join(","),
        );
        const csv = [header, ...rows].join("\n");
        return new Response(csv, {
          headers: {
            "Content-Type": "text/csv; charset=utf-8",
            "Content-Disposition": 'attachment; filename="zerohours-guide-leads.csv"',
            "Cache-Control": "no-store",
          },
        });
      },
    },
  },
});
