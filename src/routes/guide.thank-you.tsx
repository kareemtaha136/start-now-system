import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Check, Download, Mail } from "lucide-react";
import { useEffect, useState } from "react";
import { productConfig, showcaseShots } from "@/lib/zerohours-config";
import { openPaymentCheckout } from "@/lib/paddle";
import { trackEvent } from "@/lib/analytics";

export const Route = createFileRoute("/guide/thank-you")({
  head: () => ({
    meta: [
      { title: "Your free guide is ready — ZeroHours" },
      { name: "description", content: "Download your free ZeroHours procrastination guide, and see the full system that helps you actually start." },
      { property: "og:title", content: "Your free guide is ready — ZeroHours" },
      { property: "og:description", content: "Download the free guide and see the full ZeroHours system." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: GuideThankYou,
});

const reasons = [
  ["The guide explains it. ZeroHours does it with you.", "Reading why you procrastinate is the easy part. ZeroHours walks you through the actual start — every time you get stuck."],
  ["It picks the next action for you.", "No more staring at a list. You get one task, one first step, and a timer that makes it small enough to begin."],
  ["It catches you when you fall behind.", "Catch-Up Mode, Deadline Rescue, and Exam Rescue turn a pile of late work into a plan you can follow today."],
  ["Your whole semester in one place.", "Courses, assignments, exams, notes, reading, schedule, and grades — connected to the tools that get them done."],
] as const;

function GuideThankYou() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    trackEvent("guide_thank_you_view");
  }, []);

  const buy = async () => {
    trackEvent("checkout_click", { source: "guide_upsell_page" });
    setLoading(true);
    setError("");
    try {
      await openPaymentCheckout(productConfig.checkoutPriceId);
    } catch {
      setError("Checkout couldn't open. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-background pb-24 text-foreground md:pb-0">
      <section className="section-shell bg-ink text-ink-foreground">
        <div className="mx-auto max-w-3xl text-center">
          <span className="mx-auto grid size-14 place-items-center rounded-full bg-success-soft text-success"><Check className="size-7" /></span>
          <p className="eyebrow mt-6 text-coral">Your guide is ready</p>
          <h1 className="section-title mt-4">Check your inbox.</h1>
          <div className="mt-6 flex items-start gap-3 rounded-lg border border-ink-border bg-ink-soft p-4 text-left">
            <Mail className="mt-0.5 size-5 shrink-0 text-coral" />
            <p className="text-sm leading-6 text-ink-muted">We just emailed your copy of <strong className="text-ink-foreground">ZeroHours — Just Start</strong>. It usually arrives within a minute. You can also download it right here.</p>
          </div>
          <a href={productConfig.freeGuideUrl} download onClick={() => trackEvent("free_guide_download")} className="btn-coral mt-4 flex w-full items-center justify-center gap-2"><Download className="size-5" />Download the free guide (PDF)</a>
        </div>
      </section>

      <section className="section-shell">
        <div className="mx-auto max-w-5xl text-center">
          <p className="eyebrow">One more thing</p>
          <h2 className="section-title mt-4">The guide tells you why.<span className="block text-primary">ZeroHours makes you start.</span></h2>
          <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-muted-foreground">Most students read a guide like this, nod along, and still don't open the assignment. ZeroHours is the system that closes that gap — it sits with you at the moment you'd normally avoid the work.</p>
        </div>

        <div className="mx-auto mt-10 grid max-w-5xl gap-4 sm:grid-cols-2">
          {reasons.map(([title, copy]) => (
            <div key={title} className="rounded-lg border border-border bg-card p-5 shadow-soft sm:p-6">
              <p className="font-display text-lg font-bold leading-snug">{title}</p>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">{copy}</p>
            </div>
          ))}
        </div>

        <div className="mx-auto mt-10 grid max-w-5xl gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {showcaseShots.slice(0, 3).map((shot) => (
            <figure key={shot.title} className="showcase-card">
              <img src={shot.src} alt={shot.alt} loading="lazy" className="aspect-video w-full rounded-t-[inherit] bg-background object-contain" />
              <figcaption className="p-4 sm:p-5">
                <p className="font-display font-bold">{shot.title}</p>
                <p className="mt-1 text-sm leading-6 text-muted-foreground">{shot.description}</p>
              </figcaption>
            </figure>
          ))}
        </div>
      </section>

      <section className="section-shell bg-surface">
        <div className="mx-auto max-w-2xl overflow-hidden rounded-xl border border-primary bg-card shadow-strong">
          <div className="border-b border-border bg-primary px-6 py-4 text-center text-sm font-bold uppercase text-primary-foreground">ZeroHours — Complete system</div>
          <div className="p-6 sm:p-10">
            <div className="flex items-end gap-3">
              <span className="font-display text-5xl font-extrabold">$29.99</span>
              <span className="pb-1.5 font-display text-xl font-bold text-muted-foreground line-through">$30.99</span>
              <span className="pb-1 text-sm font-semibold text-muted-foreground">one time</span>
            </div>
            <ul className="mt-8 grid gap-3 sm:grid-cols-2">
              {["Anti-procrastination system", "Next-action workflow", "5-Minute Rescue", "Lock-In Mode", "Study Sessions", "Exam Rescue", "Catch-Up Mode", "Academic workspace", "Progress tracking", "The ZeroHours Guide (PDF)"].map((x) => (
                <li key={x} className="flex items-center gap-2 text-sm font-medium"><span className="grid size-5 shrink-0 place-items-center rounded-full bg-success-soft text-success"><Check className="size-3" /></span>{x}</li>
              ))}
            </ul>
            <button onClick={buy} disabled={loading} className="btn-coral mt-9 w-full">{loading ? "Opening checkout…" : "Get ZeroHours — $29.99"} <ArrowRight /></button>
            <p className="mt-3 text-center text-xs font-medium text-muted-foreground">One-time purchase. No monthly subscription. Delivered by email.</p>
            {error && <p role="alert" className="mt-5 rounded-md bg-coral-soft p-3 text-center text-sm text-coral-strong">{error}</p>}
            <Link to="/" className="mt-4 block text-center text-sm font-semibold text-muted-foreground underline underline-offset-4 hover:text-foreground">No thanks — just the free guide</Link>
          </div>
        </div>
      </section>

      <div className="sticky-cta fixed inset-x-0 bottom-0 z-50 border-t border-border bg-background/95 backdrop-blur-md md:hidden">
        <button className="btn-primary w-full" disabled={loading} onClick={buy}>{loading ? "Opening checkout…" : "Get ZeroHours — $29.99"} <ArrowRight /></button>
      </div>
    </main>
  );
}
