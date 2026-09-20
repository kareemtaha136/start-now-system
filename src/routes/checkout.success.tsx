import { createFileRoute, Link } from "@tanstack/react-router";
import { Check, Download, Mail } from "lucide-react";
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
        <div className="mt-6 flex items-start gap-3 rounded-lg bg-secondary p-4 text-left"><Mail className="mt-0.5 size-5 shrink-0 text-primary" /><p className="text-sm leading-6">A download link is on its way to the email you used at checkout — it usually arrives within a minute.</p></div>
        <a href={productConfig.appDownloadUrl} download className="btn-primary mt-4 flex w-full items-center justify-center gap-2"><Download className="size-5" />Download ZeroHours now</a>
        <Link to="/" className="btn-secondary mt-3 w-full">Return to ZeroHours</Link>
      </div>
    </main>
  );
}