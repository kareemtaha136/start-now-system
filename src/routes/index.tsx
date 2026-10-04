import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import {
  ArrowDown,
  ArrowRight,
  BookOpen,
  Check,
  ChevronDown,
  Clock3,
  LockKeyhole,
  Menu,
  Monitor,

  Play,
  ShieldCheck,
  Sparkles,
  Target,
  X,
  Zap,
} from "lucide-react";
import { FormEvent, useEffect, useRef, useState } from "react";
import { trackEvent } from "../lib/analytics";
import { marketingAssets, productConfig, showcaseShots } from "../lib/zerohours-config";
import { MediaPlaceholder } from "../components/MediaPlaceholder";
import { ResponsiveMedia, ResponsiveVideo } from "../components/ResponsiveMedia";
import { PhoneMockup, PhoneShowcase, phoneMedia } from "../components/PhoneShowcase";
import { openPaymentCheckout } from "../lib/paddle";
import { sendFreeGuide } from "../lib/guide.functions";
import { PaymentTestModeBanner } from "../components/PaymentTestModeBanner";
import wordmark from "../assets/zerohours-wordmark.png";
import symbol from "../assets/zerohours-symbol.png";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "ZeroHours — Stop Procrastinating. Start Your Work." },
      { name: "description", content: "ZeroHours is an anti-procrastination and academic productivity app built to help students stop avoiding schoolwork and actually get started." },
      { property: "og:title", content: "ZeroHours — Stop Procrastinating. Start Your Work." },
      { property: "og:description", content: "Break through procrastination, find the next action, and start your schoolwork." },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "/" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: "/" }],
    scripts: [{ type: "application/ld+json", children: JSON.stringify({ "@context": "https://schema.org", "@type": "SoftwareApplication", name: "ZeroHours", applicationCategory: "EducationalApplication", offers: { "@type": "Offer", price: "29.99", priceCurrency: "USD" } }) }],
  }),
  component: Index,
});

const navItems = [
  ["How It Works", "#how-it-works"],
  ["Features", "#features"],
  ["Pricing", "#pricing"],
  ["FAQ", "#faq"],
] as const;

const groups = [
  { title: "Start", icon: Zap, features: ["Next Action", "5-Minute Rescue", "I'm Stuck", "Emergency Procrastination Mode"], copy: "When starting feels impossible, reduce the task to something you can actually begin." },
  { title: "Focus", icon: Target, features: ["Lock-In Mode", "Focus Timer", "Study Sessions"], copy: "Once you start, keep moving without losing the thread." },
  { title: "Catch up", icon: Clock3, features: ["Catch-Up Mode", "Deadline Rescue", "Exam Rescue"], copy: "Falling behind doesn't have to become a spiral." },
  { title: "Manage school", icon: BookOpen, features: ["Courses", "Assignments", "Exams", "Schedule", "Notes", "Reading", "Grades"], copy: "Keep your workload organized in the same system you use to act on it." },
  { title: "Understand yourself", icon: Sparkles, features: ["Progress", "Weekly Review", "Behavior patterns", "Recovery"], copy: "Notice how you work and the patterns that keep getting in the way." },
];

const faqs: ReadonlyArray<readonly [string, string]> = [
  ["What is ZeroHours?", "An anti-procrastination and academic execution system that helps students identify what is blocking them, choose a smaller next action, and begin."],
  ["Who is ZeroHours for?", "Students who know what they need to do but regularly feel stuck, overwhelmed, distracted, or behind."],
  ["Is ZeroHours a planner?", "Not simply. It includes academic organization, but connects that workload directly to tools for starting and continuing the work."],
  ["How does it help with procrastination?", "It guides you from the reason you are avoiding a task to one useful next action, a five-minute start, and focused continuation."],
  ["Is it a subscription?", "No. ZeroHours is a one-time $29.99 purchase."],
  ["How do I get access after buying?", "Open app.zerohours.store and enter the email you used at checkout. You only do it once per device."],
  ["Can I use it on my phone and laptop?", "Yes, on up to 3 devices with the same purchase email."],
  ["I got a new phone / it's asking me to unlock again", "Just enter your purchase email again. If it says you've hit the device limit, reply to your receipt email and we'll reset it."],
  ["Is my data private?", "ZeroHours uses local-first data storage, keeping your working data on your device. Import and export tools help you manage your own copy."],
  ["Do I need an account?", "No. You unlock ZeroHours with the email you used at checkout — no account or password."],
  ["Can I use it for different classes?", "Yes. Courses, assignments, exams, notes, reading, schedules, and grades can be organized across classes."],
  ["What if I'm already behind?", "Catch-Up Mode, Deadline Rescue, and Exam Rescue are designed to help you regain clarity and choose what to do next."],
];

function Index() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [guideMessage, setGuideMessage] = useState("");
  const [checkoutError, setCheckoutError] = useState("");
  const [checkoutLoading, setCheckoutLoading] = useState(false);
  const [guideSending, setGuideSending] = useState(false);
  const navigate = useNavigate();
  const sendGuide = sendFreeGuide;
  const pricingRef = useRef<HTMLElement>(null);

  useEffect(() => {
    trackEvent("page_view");
    const target = pricingRef.current;
    if (!target) return;
    const observer = new IntersectionObserver(([entry]) => {
      if (entry?.isIntersecting) {
        trackEvent("pricing_view");
        observer.disconnect();
      }
    }, { threshold: 0.4 });
    observer.observe(target);
    return () => observer.disconnect();
  }, []);

  const checkout = async () => {
    trackEvent("checkout_click");
    setCheckoutLoading(true);
    setCheckoutError("");
    try {
      await openPaymentCheckout(productConfig.checkoutPriceId);
    } catch {
      setCheckoutError("Checkout couldn't open. Please try again.");
      document.querySelector("#pricing")?.scrollIntoView({ behavior: "smooth" });
    } finally {
      setCheckoutLoading(false);
    }
  };

  const submitGuide = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);
    const email = data.get("email");
    const marketingConsent = data.get("marketingConsent") === "on";
    if (typeof email !== "string" || !email) return;
    trackEvent("free_guide_submit");
    setGuideSending(true);
    setGuideMessage("");
    try {
      await sendGuide({ data: { email, marketingConsent } });
    } catch {
      // The guide is still delivered on the next page; email may retry later.
      setGuideMessage("We couldn't email your copy, but you can download it on the next page.");
    } finally {
      setGuideSending(false);
    }
    await navigate({ to: "/guide/thank-you" });
  };

  return (
    <div className="min-h-screen overflow-x-clip bg-background pb-20 text-foreground md:pb-0">
      <PaymentTestModeBanner />
      <div className="border-b border-border/80 bg-ink text-ink-muted">
        <p className="mx-auto flex max-w-7xl items-center justify-center gap-2 px-4 py-2.5 text-center text-xs font-semibold sm:px-6 sm:text-sm">
          <Monitor className="size-3.5 shrink-0 text-coral sm:size-4" aria-hidden="true" />
          <span>ZeroHours works on mobile and desktop — open it in your browser.</span>
        </p>
      </div>
      <header className="sticky top-0 z-50 border-b border-border/80 bg-background/95 backdrop-blur-md">
        <div className="mx-auto grid h-16 max-w-7xl grid-cols-[auto_auto_minmax(0,1fr)] items-center gap-2 px-4 sm:px-6 md:grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] md:px-8 lg:px-8">
          <a href="#top" className="flex min-w-0 items-center gap-2 justify-self-start font-display text-base font-extrabold uppercase tracking-normal focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
            <img src={symbol} alt="" aria-hidden="true" className="h-7 w-7 shrink-0 sm:h-8 sm:w-8" />
            <img src={wordmark} alt="ZeroHours" className="h-6 w-auto sm:h-7" width={1511} height={222} />
          </a>
          <nav className="hidden items-center gap-7 justify-self-center md:flex" aria-label="Primary navigation">
            {navItems.map(([label, href]) => <a key={href} href={href} className="text-sm font-semibold text-muted-foreground transition-colors hover:text-foreground">{label}</a>)}
          </nav>
          <div className="hidden justify-self-end md:block"><button className="btn-primary" disabled={checkoutLoading} onClick={checkout}>{checkoutLoading ? "Opening checkout…" : "Get ZeroHours — $29.99"}</button></div>
          <button className="icon-button justify-self-end md:hidden" aria-label={menuOpen ? "Close menu" : "Open menu"} aria-expanded={menuOpen} onClick={() => setMenuOpen(!menuOpen)}>{menuOpen ? <X /> : <Menu />}</button>
        </div>
        {menuOpen && <nav className="border-t border-border bg-background px-4 py-4 md:hidden" aria-label="Mobile navigation">{navItems.map(([label, href]) => <a key={href} href={href} onClick={() => setMenuOpen(false)} className="block border-b border-border py-3 font-semibold last:border-0">{label}</a>)}</nav>}
      </header>

      <main id="top">
        <section className="section-shell pt-12 sm:pt-20 lg:pt-24">
          <div className="mx-auto max-w-7xl">
            <div className="max-w-4xl">
              <p className="eyebrow">The anti-procrastination system for students</p>
              <h1 className="mt-5 font-display text-[clamp(2.65rem,9vw,6.8rem)] font-extrabold uppercase leading-[0.93] tracking-normal">Stop staring at the assignment.<span className="mt-2 block text-primary">Start it.</span></h1>
              <p className="mt-6 max-w-2xl text-lg leading-8 text-muted-foreground sm:text-xl">ZeroHours helps you break through procrastination, figure out what to do next, and actually get moving.</p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <button onClick={checkout} disabled={checkoutLoading} className="btn-primary w-full sm:w-auto">{checkoutLoading ? "Opening checkout…" : "Get ZeroHours — $29.99"} <ArrowRight aria-hidden="true" /></button>
                <a href="#guide" onClick={() => trackEvent("free_guide_click")} className="btn-secondary w-full sm:w-auto">Get the free guide</a>
              </div>
              <p className="mt-3 text-sm font-medium text-muted-foreground">One-time purchase • No subscription • Works in your browser, no install needed</p>
            </div>
            <div className="mx-auto mt-10 w-full max-w-60 sm:hidden"><PhoneMockup {...phoneMedia.home} index={0} /></div>
            <div className="mt-10 hidden sm:mt-14 sm:block">
              <ResponsiveMedia
                desktopSrc={marketingAssets.hero.src}
                mobileSrc={marketingAssets.hero.mobileSrc}
                desktopRatio={marketingAssets.hero.desktopRatio}
                mobileRatio={marketingAssets.hero.mobileRatio}
                alt={marketingAssets.hero.alt}
                caption={marketingAssets.hero.caption}
                loading="eager"
                mediaClassName="rounded-lg object-cover"
                className="sm:rounded-xl"
              />
            </div>
            <div className="mt-12 grid grid-cols-2 gap-px overflow-hidden rounded-lg border border-border bg-border sm:grid-cols-4">
              {["One-time payment", "Instant digital access", "Local-first", "Built for students"].map((item) => <div key={item} className="flex min-h-20 items-center justify-center gap-2 bg-card px-3 text-center text-sm font-semibold"><Check className="size-4 shrink-0 text-primary" />{item}</div>)}
            </div>
          </div>
        </section>

        <section className="section-shell bg-ink text-ink-foreground">
          <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[0.85fr_1.15fr] lg:items-center">
            <div><p className="eyebrow text-coral">The problem</p><h2 className="section-title mt-4">You know what you need to do.<span className="block text-coral">You just can't start.</span></h2><p className="mt-6 max-w-xl text-lg leading-8 text-ink-muted">Another list isn't the answer. You already know the assignment exists. The hard part is crossing the gap between “I should do this” and “I'm actually doing it.”</p></div>
             <div>
              <div className="mt-4 flex flex-wrap items-center justify-center gap-2 text-xs font-bold uppercase text-ink-muted">{["Assignment", "Overthinking", "Avoidance", "Phone", "Pressure"].map((item, index) => <span key={item} className="contents"><span className="rounded-full border border-ink-border px-3 py-2">{item}</span>{index < 4 && <ArrowRight className="size-3" />}</span>)}</div>
               <div className="mt-8 hidden sm:block"><ResponsiveMedia desktopSrc={marketingAssets.problem.src} alt={marketingAssets.problem.alt} caption={marketingAssets.problem.caption} tone="dark" /></div>
            </div>
          </div>
        </section>

        <section className="section-shell" id="how-it-works">
          <div className="mx-auto max-w-7xl">
            <div className="max-w-4xl"><p className="eyebrow">The ZeroHours method</p><h2 className="section-title mt-4">Built around the moment you want to quit.</h2><p className="mt-5 max-w-2xl text-lg leading-8 text-muted-foreground">Instead of dropping another giant dashboard in front of you, ZeroHours meets procrastination where it happens.</p></div>
            <div className="mt-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {["Why am I avoiding this?", "What's the smallest next action?", "Start for 5 minutes.", "Lock in. Keep going."].map((text, index) => <div key={text} className={`step-card ${index === 2 ? "border-coral bg-coral-soft" : ""}`}><span className="step-number">0{index + 1}</span><h3 className="mt-8 font-display text-xl font-bold">{text}</h3>{index < 3 && <ArrowDown className="mt-6 size-5 text-primary lg:rotate-[-90deg]" aria-hidden="true" />}</div>)}
            </div>
            <div className="mt-16 grid gap-10 lg:grid-cols-2 lg:items-start">
              <div><p className="eyebrow">How it works</p><h2 className="section-title mt-4">Turn “write the essay” into one move.</h2></div>
              <ol className="space-y-8 border-l border-border pl-6 sm:pl-9">
                {[["Choose what you're avoiding", "History essay"], ["Name what's stopping you", "Too overwhelming. Don't know where to start."], ["Shrink the action", "Open the document and write the thesis."], ["Start", "5-Minute Rescue → Lock-In Mode → continue."]].map(([title, copy], i) => <li key={title} className="relative"><span className="absolute -left-[2.55rem] grid size-8 place-items-center rounded-full bg-primary text-xs font-bold text-primary-foreground sm:-left-[3.3rem]">{i + 1}</span><h3 className="font-display text-lg font-bold">{title}</h3><p className="mt-2 leading-7 text-muted-foreground">{copy}</p></li>)}
              </ol>
            </div>
            <div className="mt-10"><button className="btn-primary w-full sm:w-auto" disabled={checkoutLoading} onClick={checkout}>Start with ZeroHours <ArrowRight /></button></div>
          </div>
        </section>

        <section className="section-shell bg-surface" aria-labelledby="showcase-title" id="showcase">
          <div className="mx-auto max-w-7xl">
            <p className="eyebrow">See the system</p>
            <h2 id="showcase-title" className="section-title mt-4 max-w-4xl">A real workspace for the moments that stop you.</h2>
              <p className="mt-5 hidden max-w-2xl text-lg leading-8 text-muted-foreground sm:block">See the actual ZeroHours app on desktop and mobile.</p>
             <p className="mt-5 max-w-2xl text-lg leading-8 text-muted-foreground sm:hidden">A closer look at ZeroHours on your phone.</p>
             <div className="mt-8 sm:hidden"><PhoneShowcase mobileGallery /></div>
             <div className="-mx-2 mt-8 hidden gap-5 sm:mx-0 sm:mt-10 sm:grid sm:grid-cols-2 sm:gap-4 lg:grid-cols-3">
              {showcaseShots.map((shot) => (
                <figure key={shot.title} className="showcase-card">

                  {shot.src ? (
                    <picture>
                      {shot.mobileSrc && <source media="(max-width: 639px)" srcSet={shot.mobileSrc} />}
                      <img
                        src={shot.src}
                        alt={shot.alt}
                        loading="lazy"
                        className={`w-full rounded-t-[inherit] bg-background sm:aspect-video sm:object-contain ${shot.mobileSrc ? "aspect-[4/5] object-cover" : "aspect-video object-contain"}`}
                      />
                    </picture>
                  ) : (
                    <MediaPlaceholder label={shot.alt} className="aspect-[4/3] min-h-0" />
                  )}
                  <figcaption className="p-4 sm:p-5">
                    <p className="font-display text-lg font-bold">{shot.title}</p>
                    <p className="mt-1 text-sm leading-6 text-muted-foreground">{shot.description}</p>
                  </figcaption>
                </figure>
              ))}
            </div>
             <div className="mt-14 hidden border-t border-border pt-10 sm:mt-16 sm:block sm:pt-12">
              <div className="mb-7 max-w-3xl">
                <p className="eyebrow">Watch the walkthrough</p>
                <h3 className="mt-3 font-display text-2xl font-extrabold uppercase sm:text-3xl">See ZeroHours in action.</h3>
                <p className="mt-3 leading-7 text-muted-foreground">A real walkthrough of the app, from choosing the next move to locking in.</p>
              </div>
              <ResponsiveVideo
                desktopSrc={productConfig.demoVideoUrl}
                mobileSrc={productConfig.demoVideoMobileUrl}
                poster={productConfig.demoPosterUrl}
                ariaLabel="ZeroHours product demonstration"
                className="sm:rounded-xl"
               />
            </div>
             <div className="mt-14 hidden border-t border-border pt-10 sm:block sm:pt-12">
               <div className="mb-6 max-w-3xl">
                 <p className="eyebrow">On your phone</p>
                 <h3 className="mt-3 font-display text-2xl font-extrabold uppercase sm:text-3xl">ZeroHours goes with you.</h3>
               </div>
               <PhoneShowcase />
             </div>
            <div className="mt-8"><button className="btn-primary w-full sm:w-auto" disabled={checkoutLoading} onClick={checkout}>Get ZeroHours — $29.99 <ArrowRight aria-hidden="true" /></button></div>
          </div>
        </section>

        <section className="section-shell" id="features">
          <div className="mx-auto max-w-7xl"><p className="eyebrow">Built for execution</p><h2 className="section-title mt-4 max-w-4xl">Not 30 disconnected tools. One system that moves with you.</h2>
            <div className="mt-10 grid gap-4 md:grid-cols-2 lg:grid-cols-6">{groups.map((group, index) => { const Icon = group.icon; return <article key={group.title} className={`feature-card ${index < 2 ? "lg:col-span-3" : "lg:col-span-2"}`} onPointerEnter={() => trackEvent("feature_interaction", { group: group.title })}><Icon className="size-6 text-primary" /><h3 className="mt-6 font-display text-2xl font-bold uppercase">{group.title}</h3><p className="mt-3 leading-7 text-muted-foreground">{group.copy}</p><ul className="mt-6 flex flex-wrap gap-2">{group.features.map(feature => <li key={feature} className="rounded-md bg-secondary px-3 py-2 text-xs font-semibold">{feature}</li>)}</ul></article> })}</div>
          </div>
        </section>

        <section className="section-shell bg-primary text-primary-foreground">
          <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-2 lg:items-center">
            <div><p className="eyebrow text-primary-muted">Academic workspace</p><h2 className="section-title mt-4">Your schoolwork. One place.</h2><p className="mt-5 max-w-xl text-lg leading-8 text-primary-muted">Academic organization connected directly to getting the work done—not another place to collect tasks and avoid them.</p><div className="mt-7 flex flex-wrap gap-2">{["Courses", "Assignments", "Exams", "Schedule", "Notes", "Reading", "Grades"].map(x => <span className="rounded-md border border-primary-border px-3 py-2 text-sm font-semibold" key={x}>{x}</span>)}</div></div>
            <div className="rounded-lg bg-primary-foreground p-5 text-foreground shadow-strong"><div className="space-y-3">{["Assignment", "Start", "Why am I avoiding this?", "Next action", "5-Minute Rescue"].map((x, i) => <div key={x} className="flex items-center gap-3"><span className="grid size-7 shrink-0 place-items-center rounded-full bg-coral-soft text-xs font-bold text-coral-strong">{i + 1}</span><span className="font-semibold">{x}</span></div>)}</div></div>
          </div>
        </section>

        <section className="section-shell">
          <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-2 lg:items-center"><div className="hidden sm:block"><ResponsiveMedia desktopSrc={marketingAssets.transformation.src} alt={marketingAssets.transformation.alt} caption={marketingAssets.transformation.caption} /></div><div><p className="eyebrow">The shift</p><h2 className="section-title mt-4"><span className="text-muted-foreground">From: “I'll do it later.”</span><span className="mt-3 block">To: “I'm already started.”</span></h2><div className="mt-8 grid grid-cols-2 gap-3">{["Overwhelm", "Clarity", "Small action", "Momentum"].map((x,i) => <div key={x} className={`rounded-lg border p-4 font-bold ${i === 3 ? "border-coral bg-coral-soft text-coral-strong" : "border-border bg-card"}`}>{String(i+1).padStart(2,"0")}<span className="mt-7 block text-sm">{x}</span></div>)}</div></div></div>
        </section>

        <section className="section-shell bg-surface">
          <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[1.05fr_.95fr] lg:items-center"><div><p className="eyebrow">Beyond reminders</p><h2 className="section-title mt-4">More than a to-do list.</h2><p className="mt-5 max-w-xl text-lg leading-8 text-muted-foreground">ZeroHours doesn't just remind you that the work exists. It helps you move through the part that keeps you from starting.</p><div className="mt-7 grid grid-cols-2 gap-2 text-sm font-semibold">{["Next Action", "5-Minute Rescue", "Lock-In", "Study Sessions", "Exam Rescue", "Catch-Up"].map(x => <div className="flex items-center gap-2" key={x}><Check className="size-4 text-primary" />{x}</div>)}</div><a href="#showcase-title" className="btn-secondary mt-8 w-full sm:w-auto">See ZeroHours in action <Play className="size-4" /></a></div><div className="hidden sm:block"><ResponsiveMedia desktopSrc={marketingAssets.features.src} alt={marketingAssets.features.alt} caption={marketingAssets.features.caption} /></div></div>
        </section>

        <section className="section-shell">
          <div className="mx-auto max-w-7xl"><p className="eyebrow">Who it's for</p><h2 className="section-title mt-4">Built for students who keep saying...</h2><div className="mt-9 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">{["I'll do it later.", "I'll start after I check my phone.", "I don't even know where to begin.", "I have too much to do.", "I work better under pressure.", "I'll do it tomorrow."].map((x,i) => <div key={x} className={`quote-card ${i === 2 || i === 5 ? "border-coral" : ""}`}>“{x}”</div>)}</div><p className="mt-8 max-w-2xl text-lg font-semibold">If that sounds familiar, ZeroHours was built around that exact moment.</p></div>
        </section>

        <section id="guide" className="section-shell bg-ink text-ink-foreground">
          <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-2 lg:items-center"><div><p className="eyebrow text-coral">Not ready for the full system?</p><h2 className="section-title mt-4 !text-[clamp(1.6rem,4.5vw,3.25rem)]">Get the free procrastination guide.</h2><p className="mt-5 max-w-xl text-lg leading-8 text-ink-muted">The guide teaches you how to make starting easier. ZeroHours gives you the tools to actually do it.</p></div><form onSubmit={submitGuide} className="rounded-lg border border-ink-border bg-ink-soft p-5 sm:p-7"><label htmlFor="guide-email" className="block text-sm font-bold">Email address</label><input id="guide-email" name="email" type="email" required autoComplete="email" placeholder="you@example.com" className="mt-2 h-12 w-full rounded-md border border-ink-border bg-ink px-4 text-base outline-none placeholder:text-ink-muted focus:border-coral focus:ring-2 focus:ring-coral" /><label htmlFor="guide-consent" className="mt-4 flex items-start gap-2.5 text-xs leading-5 text-ink-muted"><input id="guide-consent" name="marketingConsent" type="checkbox" required className="mt-0.5 size-4 shrink-0 rounded border-ink-border bg-ink accent-coral" /><span>Yes, email me the free guide and occasional ZeroHours tips and offers. Unsubscribe any time.</span></label><button className="btn-coral mt-3 w-full" type="submit" disabled={guideSending}>{guideSending ? "Sending your guide…" : "Get the free guide"} <ArrowRight /></button><p className="mt-3 text-xs leading-5 text-ink-muted">We email your copy straight away. No spam, unsubscribe any time.</p>{guideMessage && <p role="status" className="mt-3 rounded-md border border-coral/50 bg-coral/10 p-3 text-sm">{guideMessage}</p>}</form></div>
        </section>

        <section id="pricing" ref={pricingRef} className="section-shell">
          <div className="mx-auto max-w-5xl"><div className="text-center"><p className="eyebrow">Simple pricing</p><h2 className="section-title mt-4">Start getting your work moving.</h2></div><div className="mx-auto mt-10 max-w-2xl overflow-hidden rounded-xl border border-primary bg-card shadow-strong"><div className="border-b border-border bg-primary px-6 py-4 text-center text-sm font-bold uppercase text-primary-foreground">ZeroHours — Complete system</div><div className="p-6 sm:p-10"><div className="flex items-end gap-3"><span className="font-display text-5xl font-extrabold">$29.99</span><span className="pb-1.5 font-display text-xl font-bold text-muted-foreground line-through">$39.99</span><span className="pb-1 text-sm font-semibold text-muted-foreground">one time</span></div><ul className="mt-8 grid gap-3 sm:grid-cols-2">{["Anti-procrastination system", "Next-action workflow", "5-Minute Rescue", "Lock-In Mode", "Study Sessions", "Exam Rescue", "Catch-Up Mode", "Academic workspace", "Progress tracking", "Local-first app"].map(x => <li key={x} className="flex items-center gap-2 text-sm font-medium"><span className="grid size-5 shrink-0 place-items-center rounded-full bg-success-soft text-success"><Check className="size-3" /></span>{x}</li>)}</ul><button onClick={checkout} disabled={checkoutLoading} className="btn-coral mt-9 w-full">{checkoutLoading ? "Opening checkout…" : "Get ZeroHours — $29.99"} <ArrowRight /></button><p className="mt-4 flex items-center justify-center gap-1.5 rounded-md bg-surface px-3 py-2 text-center text-xs font-semibold text-foreground"><Monitor className="size-3.5 shrink-0" aria-hidden="true" />Works on mobile and desktop in your browser. No install needed.</p><p className="mt-3 text-center text-xs font-medium text-muted-foreground">You'll unlock the app with the email you use at checkout.</p><p className="mt-3 text-center text-xs font-medium text-muted-foreground">One-time purchase. No monthly subscription.</p>{checkoutError && <p role="alert" className="mt-5 rounded-md bg-coral-soft p-3 text-center text-sm text-coral-strong">{checkoutError}</p>}</div></div></div>
        </section>

        <section id="faq" className="section-shell bg-surface">
          <div className="mx-auto max-w-4xl"><p className="eyebrow">Questions, answered</p><h2 className="section-title mt-4">Before you start.</h2><div className="mt-9 divide-y divide-border border-y border-border">{faqs.map(([question, answer]) => <details key={question} className="group" onToggle={e => { if (e.currentTarget.open) trackEvent("faq_open", { question }); }}><summary className="flex min-h-16 cursor-pointer list-none items-center justify-between gap-4 py-4 font-display font-bold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"><span>{question}</span><ChevronDown className="size-5 shrink-0 transition-transform group-open:rotate-180" /></summary><p className="max-w-2xl pb-5 leading-7 text-muted-foreground">{answer}</p></details>)}</div></div>
        </section>

        <section className="section-shell bg-primary text-center text-primary-foreground">
          <div className="mx-auto max-w-5xl"><p className="eyebrow text-primary-muted">Your next move</p><h2 className="mt-4 font-display text-[clamp(2.5rem,8vw,6rem)] font-extrabold uppercase leading-[0.95]">You don't need to feel ready.<span className="mt-2 block text-coral-light">You just need to start.</span></h2><p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-primary-muted">ZeroHours helps you figure out what to do next, make the first step smaller, and get moving.</p><div className="mx-auto mt-8 flex max-w-md flex-col gap-3 sm:max-w-none sm:flex-row sm:justify-center"><button className="btn-coral w-full sm:w-auto" onClick={checkout}>Get ZeroHours — $29.99 <ArrowRight /></button><a href="#guide" className="btn-on-primary w-full sm:w-auto">Get the free guide</a></div></div>
        </section>
      </main>

      <footer className="border-t border-border bg-background px-4 py-10 sm:px-6"><div className="mx-auto grid max-w-7xl gap-8 sm:grid-cols-2 sm:items-end"><div><div className="flex items-center gap-2 font-display font-extrabold uppercase"><img src={symbol} alt="" aria-hidden="true" className="size-8 w-auto" />ZeroHours</div><p className="mt-3 max-w-sm text-sm text-muted-foreground">Stop staring at the assignment. Start it.</p></div><div className="sm:text-right"><div className="flex flex-wrap gap-x-4 gap-y-3 sm:justify-end">{navItems.map(([label, href]) => <a key={href} className="text-sm font-semibold text-muted-foreground hover:text-foreground" href={href}>{label}</a>)}<Link to="/privacy" className="text-sm font-semibold text-muted-foreground hover:text-foreground">Privacy</Link><Link to="/terms" className="text-sm font-semibold text-muted-foreground hover:text-foreground">Terms</Link><Link to="/refund-policy" className="text-sm font-semibold text-muted-foreground hover:text-foreground">Refunds</Link></div><p className="mt-4 text-xs text-muted-foreground">© 2026 ZeroHours. Sold by Arrow Wilder. Digital delivery after purchase.</p></div></div></footer>

      <div className="sticky-cta fixed inset-x-0 bottom-0 z-50 border-t border-border bg-background/95 backdrop-blur-md md:hidden"><button className="btn-primary w-full" disabled={checkoutLoading} onClick={checkout}>{checkoutLoading ? "Opening checkout…" : "Get ZeroHours — $29.99"} <ArrowRight /></button></div>
    </div>
  );
}