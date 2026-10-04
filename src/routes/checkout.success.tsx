import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowUpRight, Check, ChevronDown, Mail } from "lucide-react";
import { productConfig } from "@/lib/zerohours-config";

export const Route = createFileRoute("/checkout/success")({
  head: () => ({
    meta: [
      { title: "Purchase received — ZeroHours" },
      { name: "description", content: "Your ZeroHours purchase has been received." },
      { property: "og:title", content: "Purchase received — ZeroHours" },
      { property: "og:description", content: "Your ZeroHours purchase has been received." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: CheckoutSuccess,
});

function CheckoutSuccess() {
  return (
    <main className="grid min-h-screen place-items-center bg-background px-4 py-16">
      <div className="w-full max-w-xl rounded-xl border border-border bg-card p-6 text-center shadow-strong sm:p-10">
        <span className="mx-auto grid size-14 place-items-center rounded-full bg-success-soft text-success"><Check className="size-7" /></span>
        <p className="eyebrow mt-6">Purchase received</p>
        <h1 className="mt-3 font-display text-3xl font-extrabold uppercase sm:text-4xl">You're in.</h1>
        <a href={productConfig.appAccessUrl} target="_blank" rel="noopener noreferrer" className="btn-primary mt-8 flex w-full items-center justify-center gap-2">Open ZeroHours <ArrowUpRight className="size-5" /></a>
        <p className="mt-3 text-sm font-medium">Unlock it with the email you just used at checkout.</p>
        <div className="mt-6 flex items-start gap-3 rounded-lg bg-secondary p-4 text-left"><Mail className="mt-0.5 size-5 shrink-0 text-primary" /><p className="text-sm leading-6">We've also emailed you the link so you can open it on your phone or laptop later.</p></div>
        <details className="group mt-4 rounded-lg border border-border bg-secondary p-4 text-left">
          <summary className="flex cursor-pointer list-none items-center justify-between gap-3 text-sm font-bold [&::-webkit-details-marker]:hidden">
            Didn't get the email?
            <ChevronDown className="size-4 shrink-0 text-muted-foreground transition-transform group-open:rotate-180" />
          </summary>
          <div className="mt-3 space-y-3 text-sm leading-6">
            <p>You don't actually need the email to get started — open <a href={productConfig.appAccessUrl} target="_blank" rel="noopener noreferrer" className="font-bold text-primary underline underline-offset-2">{productConfig.appAccessUrl.replace("https://", "")}</a> right now and unlock it with the email you just used at checkout.</p>
            <p>If you want the email for later, give it a few minutes, then check:</p>
            <ul className="list-disc space-y-1.5 pl-5">
              <li>Promotions tab (Gmail) — this is where it usually lands</li>
              <li>Spam or Junk</li>
              <li>Updates or Social tabs (Gmail), or "Other" (Outlook)</li>
              <li>Search your inbox for "ZeroHours" or "Paddle" — your receipt comes from Paddle, our payment provider</li>
            </ul>
            <p>Using a school email? Schools often filter outside emails or hold them in quarantine. Check there, or use a personal email next time.</p>
            <p>Found it in spam or promotions? Move it to your main inbox so future updates from us land there.</p>
            <p>Still nothing after 30 minutes? Double-check you typed your email right at checkout, then send us a message on our <Link to="/support" className="font-bold text-primary underline underline-offset-2">support page</Link> with the email you used, and we'll sort it out.</p>
          </div>
        </details>
        <Link to="/" className="btn-secondary mt-6 w-full">Return to ZeroHours</Link>
      </div>
    </main>
  );
}
