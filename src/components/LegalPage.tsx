import { Link } from "@tanstack/react-router";
import { ArrowLeft, Monitor } from "lucide-react";
import type { ReactNode } from "react";
import symbol from "../assets/zerohours-symbol.png";
import wordmark from "../assets/zerohours-wordmark.png";

type LegalPageProps = {
  eyebrow: string;
  title: string;
  summary: string;
  children: ReactNode;
};

export function LegalPage({ eyebrow, title, summary, children }: LegalPageProps) {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="border-b border-border bg-ink text-ink-muted">
        <p className="mx-auto flex max-w-5xl items-center justify-center gap-2 px-4 py-2.5 text-center text-xs font-semibold sm:text-sm">
          <Monitor className="size-3.5 shrink-0 text-coral sm:size-4" aria-hidden="true" />
          <span>ZeroHours works on mobile and desktop — open it in your browser.</span>
        </p>
      </div>
      <header className="border-b border-border bg-background">
        <div className="mx-auto flex h-16 max-w-5xl items-center justify-between gap-4 px-4 sm:px-6">
          <Link to="/" className="flex min-w-0 items-center gap-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
            <img src={symbol} alt="" aria-hidden="true" className="size-7 shrink-0" />
            <img src={wordmark} alt="ZeroHours" className="h-6 w-auto" width={1511} height={222} />
          </Link>
          <Link to="/" className="inline-flex items-center gap-2 text-sm font-bold text-muted-foreground hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
            <ArrowLeft className="size-4" aria-hidden="true" />
            Home
          </Link>
        </div>
      </header>

      <main>
        <div className="border-b border-border bg-surface">
          <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6 sm:py-16">
            <p className="eyebrow">{eyebrow}</p>
            <h1 className="mt-4 max-w-4xl font-display text-4xl font-extrabold uppercase leading-tight sm:text-6xl">{title}</h1>
            <p className="mt-5 max-w-2xl text-base leading-7 text-muted-foreground sm:text-lg">{summary}</p>
            <p className="mt-4 text-sm font-semibold text-muted-foreground">Effective September 20, 2026</p>
          </div>
        </div>
        <article className="legal-copy mx-auto max-w-5xl px-4 py-12 sm:px-6 sm:py-16">{children}</article>
      </main>

      <footer className="border-t border-border px-4 py-8 sm:px-6">
        <div className="mx-auto flex max-w-5xl flex-col gap-5 text-sm sm:flex-row sm:items-center sm:justify-between">
          <p className="text-muted-foreground">© 2026 ZeroHours. Sold by Arrow Wilder.</p>
          <nav className="flex flex-wrap gap-x-5 gap-y-3" aria-label="Legal pages">
            <Link to="/privacy" className="font-semibold hover:text-primary">Privacy</Link>
            <Link to="/terms" className="font-semibold hover:text-primary">Terms</Link>
            <Link to="/refund-policy" className="font-semibold hover:text-primary">Refunds</Link>
          </nav>
        </div>
      </footer>
    </div>
  );
}