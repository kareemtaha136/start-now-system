import { createFileRoute, Link } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useState } from "react";
import { submitSupportRequest } from "@/lib/support.functions";

const title = "Support — ZeroHours";
const description = "Need help with ZeroHours? Send us a message and we'll get back to you by email.";

export const Route = createFileRoute("/support")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: SupportPage,
});

const topics = ["Can't unlock the app", "Didn't get my email", "Refund question", "Bug or problem", "Something else"];

function SupportPage() {
  const submit = useServerFn(submitSupportRequest);
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [error, setError] = useState("");

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    const message = String(f.get("message") ?? "").trim();
    if (message.length < 10) { setStatus("error"); setError("Please add a little more detail (at least 10 characters)."); return; }
    setStatus("sending");
    try {
      const res = await submit({ data: {
        name: String(f.get("name") ?? ""),
        email: String(f.get("email") ?? ""),
        topic: String(f.get("topic") ?? ""),
        message,
        website: String(f.get("website") ?? ""),
      } });
      if (res.ok) setStatus("sent");
      else { setStatus("error"); setError(res.reason === "rate_limited" ? "You've sent a few messages already — we'll reply soon." : "Something went wrong. Please try again."); }
    } catch {
      setStatus("error"); setError("Please check your email address and message, then try again.");
    }
  }

  const input = "w-full rounded-xl border border-border bg-card px-4 py-3 text-base text-foreground outline-none focus:border-primary focus:ring-2 focus:ring-primary/20";

  return (
    <main className="min-h-screen bg-background px-4 py-12 sm:px-6 sm:py-20">
      <div className="mx-auto max-w-xl">
        <Link to="/" className="text-sm font-semibold text-muted-foreground hover:text-foreground">← Back to ZeroHours</Link>
        <h1 className="mt-6 font-display text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">How can we help?</h1>
        <p className="mt-3 text-muted-foreground">Tell us what's going on and we'll reply to your email. If it's about a purchase, use the email you checked out with.</p>

        {status === "sent" ? (
          <div className="mt-8 rounded-2xl border border-border bg-card p-6">
            <h2 className="font-display text-xl font-bold text-foreground">Message sent.</h2>
            <p className="mt-2 text-muted-foreground">Thanks — we've got it and will reply by email. Check your spam or promotions folder if you don't see our reply.</p>
          </div>
        ) : (
          <form onSubmit={onSubmit} className="mt-8 grid gap-4 rounded-2xl border border-border bg-card p-5 sm:p-6">
            <label className="grid gap-1.5 text-sm font-semibold text-foreground">Name (optional)<input name="name" maxLength={100} className={input} /></label>
            <label className="grid gap-1.5 text-sm font-semibold text-foreground">Your email<input name="email" type="email" required maxLength={200} className={input} /></label>
            <label className="grid gap-1.5 text-sm font-semibold text-foreground">Topic
              <select name="topic" required className={input} defaultValue={topics[0]}>{topics.map((t) => <option key={t}>{t}</option>)}</select>
            </label>
            <label className="grid gap-1.5 text-sm font-semibold text-foreground">Message<textarea name="message" required minLength={10} maxLength={3000} rows={6} className={input} /></label>
            <input name="website" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden="true" />
            {status === "error" && <p className="text-sm font-semibold text-destructive">{error}</p>}
            <button type="submit" disabled={status === "sending"} className="rounded-xl bg-primary px-5 py-3.5 font-display font-bold text-primary-foreground transition hover:opacity-90 disabled:opacity-60">
              {status === "sending" ? "Sending…" : "Send message"}
            </button>
          </form>
        )}
      </div>
    </main>
  );
}
