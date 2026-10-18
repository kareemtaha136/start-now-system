#!/usr/bin/env python3
"""Builds the static zerohours.store site into ../site.

Run:  python3 tools/build.py      (then tools/tailwind.sh to rebuild CSS)
Pages are plain HTML so Netlify can serve them with no build step.
"""
import html, json, os, pathlib

ROOT = pathlib.Path(__file__).resolve().parent.parent
SITE = ROOT / "site"
APP_URL = "https://app.zerohours.store"
PRICE, WAS = "$19.99", "$29.99"
V = "4"  # cache-buster for css/js

# ---------- icons (lucide, MIT) ----------
ICONS = {
    "arrow-right": '<path d="M5 12h14"/><path d="m12 5 7 7-7 7"/>',
    "arrow-down": '<path d="M12 5v14"/><path d="m19 12-7 7-7-7"/>',
    "arrow-up-right": '<path d="M7 7h10v10"/><path d="M7 17 17 7"/>',
    "arrow-left": '<path d="m12 19-7-7 7-7"/><path d="M19 12H5"/>',
    "check": '<path d="M20 6 9 17l-5-5"/>',
    "chevron-down": '<path d="m6 9 6 6 6-6"/>',
    "monitor": '<rect width="20" height="14" x="2" y="3" rx="2"/><line x1="8" x2="16" y1="21" y2="21"/><line x1="12" x2="12" y1="17" y2="21"/>',
    "menu": '<line x1="4" x2="20" y1="12" y2="12"/><line x1="4" x2="20" y1="6" y2="6"/><line x1="4" x2="20" y1="18" y2="18"/>',
    "x": '<path d="M18 6 6 18"/><path d="m6 6 12 12"/>',
    "play": '<polygon points="6 3 20 12 6 21 6 3"/>',
    "pause": '<rect x="14" y="4" width="4" height="16" rx="1"/><rect x="6" y="4" width="4" height="16" rx="1"/>',
    "zap": '<path d="M4 14a1 1 0 0 1-.78-1.63l9.9-10.2a.5.5 0 0 1 .86.46l-1.92 6.02A1 1 0 0 0 13 10h7a1 1 0 0 1 .78 1.63l-9.9 10.2a.5.5 0 0 1-.86-.46l1.92-6.02A1 1 0 0 0 11 14z"/>',
    "target": '<circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/>',
    "clock": '<circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16.5 12"/>',
    "book-open": '<path d="M12 7v14"/><path d="M3 18a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h5a4 4 0 0 1 4 4 4 4 0 0 1 4-4h5a1 1 0 0 1 1 1v13a1 1 0 0 1-1 1h-6a3 3 0 0 0-3 3 3 3 0 0 0-3-3z"/>',
    "sparkles": '<path d="M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.936A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .963 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.581a.5.5 0 0 1 0 .964L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.963 0z"/><path d="M20 3v4"/><path d="M22 5h-4"/><path d="M4 17v2"/><path d="M5 18H3"/>',
    "mail": '<rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>',
    "download": '<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" x2="12" y1="15" y2="3"/>',
}


def icon(name, cls="", fill="none"):
    return (f'<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="{fill}" '
            f'stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" '
            f'class="{cls}" aria-hidden="true">{ICONS[name]}</svg>')


e = html.escape

# ---------- shared pieces ----------
def price_label():
    return f'Get ZeroHours — <s class="font-normal opacity-60">{WAS}</s> {PRICE}'


def buy_btn(cls="btn-primary", extra="", label=None, arrow=True, source=""):
    lab = label or price_label()
    src = f' data-source="{source}"' if source else ""
    return (f'<button type="button" class="{cls} {extra}" data-checkout{src}>'
            f'<span data-label>{lab}</span>{(" " + icon("arrow-right")) if arrow else ""}</button>')


def head(title, desc, path, extra="", noindex=False, og_type="website", card="summary_large_image"):
    canonical = f"https://zerohours.store{path}"
    robots = '<meta name="robots" content="noindex">' if noindex else ""
    return f"""<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>{e(title)}</title>
<meta name="description" content="{e(desc)}">
<meta property="og:title" content="{e(title)}">
<meta property="og:description" content="{e(desc)}">
<meta property="og:type" content="{og_type}">
<meta property="og:url" content="{canonical}">
<meta name="twitter:card" content="{card}">
{robots}
<link rel="canonical" href="{canonical}">
<link rel="icon" href="/favicon.png" type="image/png">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Sora:wght@500;600;700;800&family=Work+Sans:wght@400;500;600;700&display=swap">
<link rel="stylesheet" href="/assets/site.css?v={V}">
{extra}
</head>
"""


TEST_BANNER = ('<div data-test-banner hidden class="border-b border-coral bg-coral-soft px-4 py-2 text-center text-xs font-semibold text-coral-strong">'
               'Test checkout — no real payment will be taken.</div>')

MOBILE_NOTE = lambda width="max-w-7xl", px="px-4 sm:px-6": f"""<div class="border-b border-border/80 bg-ink text-ink-muted">
  <p class="mx-auto flex {width} items-center justify-center gap-2 {px} py-2.5 text-center text-xs font-semibold sm:text-sm">
    {icon("monitor", "size-3.5 shrink-0 text-coral sm:size-4")}
    <span>ZeroHours works on mobile and desktop — open it in your browser.</span>
  </p>
</div>"""

SCRIPTS = f'<script src="/assets/site.js?v={V}" defer></script>'


def write(path, content):
    out = SITE / path.strip("/") / "index.html" if not path.endswith(".html") else SITE / path.strip("/")
    out.parent.mkdir(parents=True, exist_ok=True)
    out.write_text(content)


# ---------- home page ----------
NAV = [("How It Works", "#how-it-works"), ("Features", "#features"), ("Pricing", "#pricing"), ("FAQ", "#faq")]

GROUPS = [
    ("Start", "zap", ["Next Action", "5-Minute Rescue", "I'm Stuck", "Emergency Procrastination Mode"], "When starting feels impossible, reduce the task to something you can actually begin."),
    ("Focus", "target", ["Lock-In Mode", "Focus Timer", "Study Sessions"], "Once you start, keep moving without losing the thread."),
    ("Catch up", "clock", ["Catch-Up Mode", "Deadline Rescue", "Exam Rescue"], "Falling behind doesn't have to become a spiral."),
    ("Manage school", "book-open", ["Courses", "Assignments", "Exams", "Schedule", "Notes", "Reading", "Grades"], "Keep your workload organized in the same system you use to act on it."),
    ("Understand yourself", "sparkles", ["Progress", "Weekly Review", "Behavior patterns", "Recovery"], "Notice how you work and the patterns that keep getting in the way."),
]

FAQS = [
    ("What is ZeroHours?", "An anti-procrastination and academic execution system that helps students identify what is blocking them, choose a smaller next action, and begin."),
    ("Who is ZeroHours for?", "Students who know what they need to do but regularly feel stuck, overwhelmed, distracted, or behind."),
    ("Is ZeroHours a planner?", "Not simply. It includes academic organization, but connects that workload directly to tools for starting and continuing the work."),
    ("How does it help with procrastination?", "It guides you from the reason you are avoiding a task to one useful next action, a five-minute start, and focused continuation."),
    ("Is it a subscription?", f"No. ZeroHours is a one-time purchase — {PRICE}, down from {WAS}."),
    ("How do I get access after buying?", "Open app.zerohours.store and enter the email you used at checkout. You only do it once per device."),
    ("Can I use it on my phone and laptop?", "Yes, on up to 3 devices with the same purchase email."),
    ("I got a new phone / it's asking me to unlock again", 'Just enter your purchase email again. If it says you\'ve hit the device limit, send us a message on the <a class="font-bold text-primary underline underline-offset-2" href="/support/">support page</a> and we\'ll reset it.'),
    ("Is my data private?", "ZeroHours uses local-first data storage, keeping your working data on your device. Import and export tools help you manage your own copy."),
    ("Do I need an account?", "No. You unlock ZeroHours with the email you used at checkout — no account or password."),
    ("Can I use it for different classes?", "Yes. Courses, assignments, exams, notes, reading, schedules, and grades can be organized across classes."),
    ("What if I'm already behind?", "Catch-Up Mode, Deadline Rescue, and Exam Rescue are designed to help you regain clarity and choose what to do next."),
]

SHOTS = [
    ("dashboard", "ZeroHours home dashboard showing the recommended next move and upcoming work", "Know what to do next", "See the work that matters now, the smallest next action, and what is coming up."),
    ("tasks", "ZeroHours task list ranked by urgency and priority", "Put every task in order", "Keep active schoolwork together and quickly start the task that needs attention first."),
    ("study-session", "ZeroHours Study Session Builder with selected tasks and energy level", "Build a realistic study session", "Choose your available time, energy level, and the work you want to move forward."),
    ("lock-in", "ZeroHours Lock-In Mode focused on one essay with a clear next action", "Lock in on one next action", "Give one task your attention with a clear action and a focused timer."),
    ("rescue", "ZeroHours Rescue screen with procrastination and catch-up options", "Recover when you are stuck", "Use Rescue or Catch-Up Mode to stop avoiding the work and restart with a concrete move."),
    ("courses", "ZeroHours courses overview with class progress, tasks, and exams", "Keep schoolwork connected", "Organize courses, tasks, exams, notes, and grades in the same academic workspace."),
]

PHONE = {
    "home": ("image", "/assets/media/phone-home.webp", "See your next move and start a lock-in session."),
    "video": ("video", "/assets/media/phone-walkthrough.mp4", "Watch ZeroHours in action on your phone."),
    "tasks": ("image", "/assets/media/phone-tasks.webp", "Keep your tasks in view."),
    "study": ("image", "/assets/media/phone-study.webp", "Plan a study session that fits your work."),
    "rescue": ("image", "/assets/media/phone-rescue.webp", "Find a way forward when you're stuck."),
    "courses": ("image", "/assets/media/phone-courses.webp", "Keep your courses together."),
}


def phone_mockup(kind, src, caption, eager=False):
    buttons = "".join(f'<span class="phone-side-button {c}" aria-hidden="true"></span>' for c in
                      ["phone-action-button", "phone-volume-up", "phone-volume-down", "phone-power-button", "phone-camera-button"])
    if kind == "video":
        media = (f'<video data-src="{src}" data-src-webm="{src[:-4]}.webm" poster="/assets/media/phone-walkthrough-poster.webp" muted loop playsinline preload="none" '
                 f'class="phone-media" aria-label="{e(caption)}"></video>'
                 f'<button type="button" class="phone-video-button" data-phone-play aria-label="Play phone walkthrough">'
                 f'{icon("play", "", "currentColor")}</button>')
    else:
        media = f'<img src="{src}" alt="{e(caption)}" loading="{"eager" if eager else "lazy"}" class="phone-media" width="390" height="844">'
    return f"""<figure class="phone-figure">
  <div class="phone-shell" aria-label="{e(caption)}">{buttons}
    <div class="phone-screen">{media}
      <span class="phone-island" aria-hidden="true"><span class="phone-camera-lens"></span></span>
      <span class="phone-home-indicator" aria-hidden="true"></span>
    </div>
  </div>
  <figcaption class="phone-caption">{e(caption)}</figcaption>
</figure>"""


def phone_showcase(keys):
    slides = "".join(f'<div class="phone-slide" data-active="{"true" if i == 0 else "false"}">{phone_mockup(*PHONE[k])}</div>' for i, k in enumerate(keys))
    dots = "".join(f'<button type="button" class="phone-dot-button" aria-label="Show phone preview {i+1}" data-dot="{i}"><span class="phone-dot{" phone-dot-active" if i == 0 else ""}"></span></button>' for i in range(len(keys)))
    return f'<div class="phone-showcase" data-phone-showcase aria-label="ZeroHours mobile screens and walkthrough"><div class="phone-track">{slides}</div><div class="phone-dots" aria-label="Choose a phone preview">{dots}</div></div>'


def media_card(src, alt, caption="", tone="light", mobile_src="", desktop_ratio="16 / 9", mobile_ratio=None, eager=False, media_cls="rounded-md", cls=""):
    tone_cls = {"light": "border-border bg-card shadow-soft", "dark": "border-ink-border bg-ink-soft shadow-strong"}[tone]
    cap_cls = {"light": "text-muted-foreground", "dark": "text-ink-muted"}[tone]
    has_m = bool(mobile_src)
    mr = (mobile_ratio or "4 / 5") if has_m else desktop_ratio
    source = f'<source media="(max-width: 639px)" srcset="{mobile_src}">' if has_m else ""
    fit = "object-cover sm:object-contain" if has_m else "object-contain"
    cap = f'<figcaption class="media-caption {cap_cls}">{e(caption)}</figcaption>' if caption else ""
    return (f'<figure class="media-card {tone_cls} {cls}"><div class="media-frame" style="--media-ratio-mobile: {mr}; --media-ratio-desktop: {desktop_ratio};">'
            f'<picture>{source}<img src="{src}" alt="{e(alt)}" loading="{"eager" if eager else "lazy"}" class="media-el {fit} {media_cls}"></picture></div>{cap}</figure>')


def check_item(text, cls="text-sm font-medium"):
    return (f'<li class="flex items-center gap-2 {cls}"><span class="grid size-5 shrink-0 place-items-center rounded-full bg-success-soft text-success">'
            f'{icon("check", "size-3")}</span>{e(text)}</li>')


def build_home():
    nav_links = "".join(f'<a href="{h}" class="text-sm font-semibold text-muted-foreground transition-colors hover:text-foreground">{l}</a>' for l, h in NAV)
    mob_links = "".join(f'<a href="{h}" data-close-menu class="block border-b border-border py-3 font-semibold last:border-0">{l}</a>' for l, h in NAV)
    steps = ["Why am I avoiding this?", "What's the smallest next action?", "Start for 5 minutes.", "Lock in. Keep going."]
    steps_html = "".join(
        f'<div class="step-card {"border-coral bg-coral-soft" if i == 2 else ""}"><span class="step-number">0{i+1}</span>'
        f'<h3 class="mt-8 font-display text-xl font-bold">{e(t)}</h3>{icon("arrow-down", "mt-6 size-5 text-primary lg:rotate-[-90deg]") if i < 3 else ""}</div>'
        for i, t in enumerate(steps))
    how = [("Choose what you're avoiding", "History essay"), ("Name what's stopping you", "Too overwhelming. Don't know where to start."),
           ("Shrink the action", "Open the document and write the thesis."), ("Start", "5-Minute Rescue → Lock-In Mode → continue.")]
    how_html = "".join(
        f'<li class="relative"><span class="absolute -left-[2.55rem] grid size-8 place-items-center rounded-full bg-primary text-xs font-bold text-primary-foreground sm:-left-[3.3rem]">{i+1}</span>'
        f'<h3 class="font-display text-lg font-bold">{e(t)}</h3><p class="mt-2 leading-7 text-muted-foreground">{e(c)}</p></li>' for i, (t, c) in enumerate(how))
    chain = ["Assignment", "Overthinking", "Avoidance", "Phone", "Pressure"]
    chain_html = "".join(f'<span class="contents"><span class="rounded-full border border-ink-border px-3 py-2">{x}</span>{icon("arrow-right", "size-3") if i < 4 else ""}</span>' for i, x in enumerate(chain))
    shots_html = "".join(
        f'<figure class="showcase-card"><picture><img src="/assets/media/{s}.webp" alt="{e(a)}" loading="lazy" width="1920" height="1080" '
        f'class="w-full rounded-t-[inherit] bg-background sm:aspect-video sm:object-contain aspect-video object-contain"></picture>'
        f'<figcaption class="p-4 sm:p-5"><p class="font-display text-lg font-bold">{e(t)}</p><p class="mt-1 text-sm leading-6 text-muted-foreground">{e(d)}</p></figcaption></figure>'
        for s, a, t, d in SHOTS)
    groups_html = "".join(
        f'<article class="feature-card {"lg:col-span-3" if i < 2 else "lg:col-span-2"}">{icon(ic, "size-6 text-primary")}'
        f'<h3 class="mt-6 font-display text-2xl font-bold uppercase">{t}</h3><p class="mt-3 leading-7 text-muted-foreground">{e(c)}</p>'
        f'<ul class="mt-6 flex flex-wrap gap-2">{"".join(f"<li class=\"rounded-md bg-secondary px-3 py-2 text-xs font-semibold\">{e(x)}</li>" for x in fs)}</ul></article>'
        for i, (t, ic, fs, c) in enumerate(GROUPS))
    ws = ["Courses", "Assignments", "Exams", "Schedule", "Notes", "Reading", "Grades"]
    ws_html = "".join(f'<span class="rounded-md border border-primary-border px-3 py-2 text-sm font-semibold">{x}</span>' for x in ws)
    flow = ["Assignment", "Start", "Why am I avoiding this?", "Next action", "5-Minute Rescue"]
    flow_html = "".join(f'<div class="flex items-center gap-3"><span class="grid size-7 shrink-0 place-items-center rounded-full bg-coral-soft text-xs font-bold text-coral-strong">{i+1}</span><span class="font-semibold">{e(x)}</span></div>' for i, x in enumerate(flow))
    shift = ["Overwhelm", "Clarity", "Small action", "Momentum"]
    shift_html = "".join(f'<div class="rounded-lg border p-4 font-bold {"border-coral bg-coral-soft text-coral-strong" if i == 3 else "border-border bg-card"}">{i+1:02d}<span class="mt-7 block text-sm">{x}</span></div>' for i, x in enumerate(shift))
    beyond = ["Next Action", "5-Minute Rescue", "Lock-In", "Study Sessions", "Exam Rescue", "Catch-Up"]
    beyond_html = "".join(f'<div class="flex items-center gap-2">{icon("check", "size-4 text-primary")}{x}</div>' for x in beyond)
    quotes = ["I'll do it later.", "I'll start after I check my phone.", "I don't even know where to begin.", "I have too much to do.", "I work better under pressure.", "I'll do it tomorrow."]
    quotes_html = "".join(f'<div class="quote-card {"border-coral" if i in (2, 5) else ""}">“{e(q)}”</div>' for i, q in enumerate(quotes))
    plan = ["Anti-procrastination system", "Next-action workflow", "5-Minute Rescue", "Lock-In Mode", "Study Sessions", "Exam Rescue", "Catch-Up Mode", "Academic workspace", "Progress tracking", "Local-first app"]
    faq_html = "".join(
        f'<details class="group"><summary class="flex min-h-16 cursor-pointer list-none items-center justify-between gap-4 py-4 font-display font-bold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring [&::-webkit-details-marker]:hidden">'
        f'<span>{e(q)}</span>{icon("chevron-down", "size-5 shrink-0 transition-transform group-open:rotate-180")}</summary>'
        f'<p class="max-w-2xl pb-5 leading-7 text-muted-foreground">{a}</p></details>' for q, a in FAQS)
    ld = json.dumps({"@context": "https://schema.org", "@type": "SoftwareApplication", "name": "ZeroHours", "applicationCategory": "EducationalApplication",
                     "offers": {"@type": "Offer", "price": PRICE.strip("$"), "priceCurrency": "USD"}})
    footer_links = "".join(f'<a class="text-sm font-semibold text-muted-foreground hover:text-foreground" href="{h}">{l}</a>' for l, h in NAV)
    footer_links += "".join(f'<a class="text-sm font-semibold text-muted-foreground hover:text-foreground" href="{h}">{l}</a>' for l, h in
                            [("Privacy", "/privacy/"), ("Terms", "/terms/"), ("Refunds", "/refund-policy/"), ("Support", "/support/")])

    page = head("ZeroHours — Stop Procrastinating. Start Your Work.",
                "ZeroHours is an anti-procrastination and academic productivity app built to help students stop avoiding schoolwork and actually get started.",
                "/", extra=f'<script type="application/ld+json">{ld}</script>') + f"""<body>
<div class="min-h-screen overflow-x-clip bg-background pb-20 text-foreground md:pb-0">
{TEST_BANNER}
{MOBILE_NOTE()}
<header class="sticky top-0 z-50 border-b border-border/80 bg-background/95 backdrop-blur-md">
  <div class="mx-auto grid h-16 max-w-7xl grid-cols-[auto_auto_minmax(0,1fr)] items-center gap-2 px-4 sm:px-6 md:grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] md:px-8 lg:px-8">
    <a href="#top" class="flex min-w-0 items-center gap-2 justify-self-start focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
      <img src="/assets/brand/zerohours-symbol.png" alt="" aria-hidden="true" class="h-7 w-7 shrink-0 object-contain sm:h-8 sm:w-8">
      <img src="/assets/brand/zerohours-wordmark.png" alt="ZeroHours" class="h-6 w-auto sm:h-7" width="1511" height="222">
    </a>
    <nav class="hidden items-center gap-7 justify-self-center md:flex" aria-label="Primary navigation">{nav_links}</nav>
    <div class="hidden justify-self-end md:block">{buy_btn("btn-primary", arrow=False)}</div>
    <button type="button" class="icon-button justify-self-end md:hidden" aria-label="Open menu" aria-expanded="false" data-menu-toggle>
      <span data-icon-open>{icon("menu")}</span><span data-icon-close hidden>{icon("x")}</span>
    </button>
  </div>
  <nav class="border-t border-border bg-background px-4 py-4 md:hidden" aria-label="Mobile navigation" data-mobile-menu hidden>{mob_links}</nav>
</header>

<main id="top">
  <section class="section-shell pt-12 sm:pt-20 lg:pt-24">
    <div class="mx-auto max-w-7xl">
      <div class="max-w-4xl">
        <p class="eyebrow">The anti-procrastination system for students</p>
        <h1 class="mt-5 font-display text-[clamp(2.65rem,9vw,6.8rem)] font-extrabold uppercase leading-[0.93] tracking-normal">Stop staring at the assignment.<span class="mt-2 block text-primary">Start it.</span></h1>
        <p class="mt-6 max-w-2xl text-lg leading-8 text-muted-foreground sm:text-xl">ZeroHours helps you break through procrastination, figure out what to do next, and actually get moving.</p>
        <div class="mt-8 flex flex-col gap-3 sm:flex-row">
          {buy_btn("btn-primary", "w-full sm:w-auto")}
          <a href="#guide" class="btn-secondary w-full sm:w-auto">Get the free guide</a>
        </div>
        <p class="mt-3 text-sm font-medium text-muted-foreground">One-time purchase • No subscription • Works in your browser, no install needed</p>
      </div>
      <div class="mx-auto mt-10 w-full max-w-60 sm:hidden">{phone_mockup(*PHONE["home"], eager=True)}</div>
      <div class="mt-10 hidden sm:mt-14 sm:block">
        {media_card("/assets/media/student-hero-desktop-v3.webp", "Student using ZeroHours on a laptop at a clean study desk", "ZeroHours open and ready for the next move.", mobile_src="/assets/media/student-hero-mobile-v3.webp", desktop_ratio="8 / 5", mobile_ratio="4 / 5", eager=True, media_cls="rounded-lg object-cover", cls="sm:rounded-xl")}
      </div>
      <div class="mt-12 grid grid-cols-2 gap-px overflow-hidden rounded-lg border border-border bg-border sm:grid-cols-4">
        {"".join(f'<div class="flex min-h-20 items-center justify-center gap-2 bg-card px-3 text-center text-sm font-semibold">{icon("check", "size-4 shrink-0 text-primary")}{x}</div>' for x in ["One-time payment", "Instant digital access", "Local-first", "Built for students"])}
      </div>
    </div>
  </section>

  <section class="section-shell bg-ink text-ink-foreground">
    <div class="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[0.85fr_1.15fr] lg:items-center">
      <div><p class="eyebrow text-coral">The problem</p><h2 class="section-title mt-4">You know what you need to do.<span class="block text-coral">You just can't start.</span></h2><p class="mt-6 max-w-xl text-lg leading-8 text-ink-muted">Another list isn't the answer. You already know the assignment exists. The hard part is crossing the gap between “I should do this” and “I'm actually doing it.”</p></div>
      <div>
        <div class="mt-4 flex flex-wrap items-center justify-center gap-2 text-xs font-bold uppercase text-ink-muted">{chain_html}</div>
        <div class="mt-8 hidden sm:block">{media_card("/assets/media/tasks.webp", "ZeroHours task list showing schoolwork ordered by urgency and priority", "Every assignment in one ordered list.", tone="dark")}</div>
      </div>
    </div>
  </section>

  <section class="section-shell" id="how-it-works">
    <div class="mx-auto max-w-7xl">
      <div class="max-w-4xl"><p class="eyebrow">The ZeroHours method</p><h2 class="section-title mt-4">Built around the moment you want to quit.</h2><p class="mt-5 max-w-2xl text-lg leading-8 text-muted-foreground">Instead of dropping another giant dashboard in front of you, ZeroHours meets procrastination where it happens.</p></div>
      <div class="mt-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">{steps_html}</div>
      <div class="mt-16 grid gap-10 lg:grid-cols-2 lg:items-start">
        <div><p class="eyebrow">How it works</p><h2 class="section-title mt-4">Turn “write the essay” into one move.</h2></div>
        <ol class="space-y-8 border-l border-border pl-6 sm:pl-9">{how_html}</ol>
      </div>
      <div class="mt-10">{buy_btn("btn-primary", "w-full sm:w-auto", label="Start with ZeroHours")}</div>
    </div>
  </section>

  <section class="section-shell bg-surface" aria-labelledby="showcase-title" id="showcase">
    <div class="mx-auto max-w-7xl">
      <p class="eyebrow">See the system</p>
      <h2 id="showcase-title" class="section-title mt-4 max-w-4xl">A real workspace for the moments that stop you.</h2>
      <p class="mt-5 hidden max-w-2xl text-lg leading-8 text-muted-foreground sm:block">See the actual ZeroHours app on desktop and mobile.</p>
      <p class="mt-5 max-w-2xl text-lg leading-8 text-muted-foreground sm:hidden">A closer look at ZeroHours on your phone.</p>
      <div class="mt-8 sm:hidden">{phone_showcase(["video", "tasks", "study", "rescue", "courses"])}</div>
      <div class="-mx-2 mt-8 hidden gap-5 sm:mx-0 sm:mt-10 sm:grid sm:grid-cols-2 sm:gap-4 lg:grid-cols-3">{shots_html}</div>
      <div class="mt-14 hidden border-t border-border pt-10 sm:mt-16 sm:block sm:pt-12">
        <div class="mb-7 max-w-3xl">
          <p class="eyebrow">Watch the walkthrough</p>
          <h3 class="mt-3 font-display text-2xl font-extrabold uppercase sm:text-3xl">See ZeroHours in action.</h3>
          <p class="mt-3 leading-7 text-muted-foreground">A real walkthrough of the app, from choosing the next move to locking in.</p>
        </div>
        <figure class="media-card border-border bg-card shadow-soft sm:rounded-xl"><div class="media-frame" style="--media-ratio-mobile: 16 / 9; --media-ratio-desktop: 16 / 9;">
          <video class="media-el bg-ink object-contain rounded-lg" controls playsinline preload="none" poster="/assets/media/demo-poster.webp" aria-label="ZeroHours product demonstration"><source src="/assets/media/demo.webm" type="video/webm"><source src="/assets/media/demo.mp4" type="video/mp4">Your browser does not support this video.</video>
        </div></figure>
      </div>
      <div class="mt-14 hidden border-t border-border pt-10 sm:block sm:pt-12">
        <div class="mb-6 max-w-3xl"><p class="eyebrow">On your phone</p><h3 class="mt-3 font-display text-2xl font-extrabold uppercase sm:text-3xl">ZeroHours goes with you.</h3></div>
        {phone_showcase(["home", "video", "tasks", "study", "rescue", "courses"])}
      </div>
      <div class="mt-8">{buy_btn("btn-primary", "w-full sm:w-auto")}</div>
    </div>
  </section>

  <section class="section-shell" id="features">
    <div class="mx-auto max-w-7xl"><p class="eyebrow">Built for execution</p><h2 class="section-title mt-4 max-w-4xl">Not 30 disconnected tools. One system that moves with you.</h2>
      <div class="mt-10 grid gap-4 md:grid-cols-2 lg:grid-cols-6">{groups_html}</div>
    </div>
  </section>

  <section class="section-shell bg-primary text-primary-foreground">
    <div class="mx-auto grid max-w-7xl gap-10 lg:grid-cols-2 lg:items-center">
      <div><p class="eyebrow text-primary-muted">Academic workspace</p><h2 class="section-title mt-4">Your schoolwork. One place.</h2><p class="mt-5 max-w-xl text-lg leading-8 text-primary-muted">Academic organization connected directly to getting the work done—not another place to collect tasks and avoid them.</p><div class="mt-7 flex flex-wrap gap-2">{ws_html}</div></div>
      <div class="rounded-lg bg-primary-foreground p-5 text-foreground shadow-strong"><div class="space-y-3">{flow_html}</div></div>
    </div>
  </section>

  <section class="section-shell">
    <div class="mx-auto grid max-w-7xl gap-10 lg:grid-cols-2 lg:items-center"><div class="hidden sm:block">{media_card("/assets/media/lock-in.webp", "ZeroHours Lock-In Mode turning a difficult assignment into one focused next action", "Lock-In Mode turns the assignment into one move.")}</div><div><p class="eyebrow">The shift</p><h2 class="section-title mt-4"><span class="text-muted-foreground">From: “I'll do it later.”</span><span class="mt-3 block">To: “I'm already started.”</span></h2><div class="mt-8 grid grid-cols-2 gap-3">{shift_html}</div></div></div>
  </section>

  <section class="section-shell bg-surface">
    <div class="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[1.05fr_.95fr] lg:items-center"><div><p class="eyebrow">Beyond reminders</p><h2 class="section-title mt-4">More than a to-do list.</h2><p class="mt-5 max-w-xl text-lg leading-8 text-muted-foreground">ZeroHours doesn't just remind you that the work exists. It helps you move through the part that keeps you from starting.</p><div class="mt-7 grid grid-cols-2 gap-2 text-sm font-semibold">{beyond_html}</div><a href="#showcase-title" class="btn-secondary mt-8 w-full sm:w-auto">See ZeroHours in action {icon("play", "size-4")}</a></div><div class="hidden sm:block">{media_card("/assets/media/rescue.webp", "ZeroHours Rescue screen offering practical ways to restart when work feels stuck", "Rescue gets you moving again when you stall.")}</div></div>
  </section>

  <section class="section-shell">
    <div class="mx-auto max-w-7xl"><p class="eyebrow">Who it's for</p><h2 class="section-title mt-4">Built for students who keep saying...</h2><div class="mt-9 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">{quotes_html}</div><p class="mt-8 max-w-2xl text-lg font-semibold">If that sounds familiar, ZeroHours was built around that exact moment.</p></div>
  </section>

  <section id="guide" class="section-shell bg-ink text-ink-foreground">
    <div class="mx-auto grid max-w-7xl gap-10 lg:grid-cols-2 lg:items-center">
      <div><p class="eyebrow text-coral">Not ready for the full system?</p><h2 class="section-title mt-4 !text-[clamp(1.6rem,4.5vw,3.25rem)]">Get the free procrastination guide.</h2><p class="mt-5 max-w-xl text-lg leading-8 text-ink-muted">The guide teaches you how to make starting easier. ZeroHours gives you the tools to actually do it.</p></div>
      <form name="free-guide" method="POST" action="/guide/thank-you/" data-netlify="true" netlify-honeypot="website" class="rounded-lg border border-ink-border bg-ink-soft p-5 sm:p-7">
        <input type="hidden" name="form-name" value="free-guide">
        <p hidden><label>Leave this empty <input name="website" tabindex="-1" autocomplete="off"></label></p>
        <label for="guide-email" class="block text-sm font-bold">Email address</label>
        <input id="guide-email" name="email" type="email" required autocomplete="email" placeholder="you@example.com" class="mt-2 h-12 w-full rounded-md border border-ink-border bg-ink px-4 text-base outline-none placeholder:text-ink-muted focus:border-coral focus:ring-2 focus:ring-coral">
        <label for="guide-consent" class="mt-4 flex items-start gap-2.5 text-xs leading-5 text-ink-muted"><input id="guide-consent" name="marketingConsent" type="checkbox" class="mt-0.5 size-4 shrink-0 rounded border-ink-border bg-ink accent-coral"><span>Yes, email me occasional ZeroHours tips and offers. Unsubscribe any time.</span></label>
        <button class="btn-coral mt-3 w-full" type="submit">Get the free guide {icon("arrow-right")}</button>
        <p class="mt-3 text-xs leading-5 text-ink-muted">Download it instantly on the next page. No spam.</p>
      </form>
    </div>
  </section>

  <section id="pricing" class="section-shell">
    <div class="mx-auto max-w-5xl"><div class="text-center"><p class="eyebrow">Simple pricing</p><h2 class="section-title mt-4">Start getting your work moving.</h2></div>
      <div class="mx-auto mt-10 max-w-2xl overflow-hidden rounded-xl border border-primary bg-card shadow-strong">
        <div class="border-b border-border bg-primary px-6 py-4 text-center text-sm font-bold uppercase text-primary-foreground">ZeroHours — Complete system</div>
        <div class="p-6 sm:p-10">
          <div class="flex items-end gap-3"><span class="font-display text-5xl font-extrabold">{PRICE}</span><span class="pb-1.5 font-display text-xl font-bold text-muted-foreground line-through">{WAS}</span><span class="pb-1 text-sm font-semibold text-muted-foreground">one time</span></div>
          <ul class="mt-8 grid gap-3 sm:grid-cols-2">{"".join(check_item(x) for x in plan)}</ul>
          {buy_btn("btn-coral", "mt-9 w-full")}
          <p class="mt-4 flex items-center justify-center gap-1.5 rounded-md bg-surface px-3 py-2 text-center text-xs font-semibold text-foreground">{icon("monitor", "size-3.5 shrink-0")}Works on mobile and desktop in your browser. No install needed.</p>
          <p class="mt-3 text-center text-xs font-medium text-muted-foreground">You'll unlock the app with the email you use at checkout.</p>
          <p class="mt-3 text-center text-xs font-medium text-muted-foreground">One-time purchase. No monthly subscription.</p>
          <p role="alert" data-checkout-error hidden class="mt-5 rounded-md bg-coral-soft p-3 text-center text-sm text-coral-strong">Checkout couldn't open. Please try again.</p>
        </div>
      </div>
    </div>
  </section>

  <section id="faq" class="section-shell bg-surface">
    <div class="mx-auto max-w-4xl"><p class="eyebrow">Questions, answered</p><h2 class="section-title mt-4">Before you start.</h2><div class="mt-9 divide-y divide-border border-y border-border">{faq_html}</div></div>
  </section>

  <section class="section-shell bg-primary text-center text-primary-foreground">
    <div class="mx-auto max-w-5xl"><p class="eyebrow text-primary-muted">Your next move</p><h2 class="mt-4 font-display text-[clamp(2.5rem,8vw,6rem)] font-extrabold uppercase leading-[0.95]">You don't need to feel ready.<span class="mt-2 block text-coral-light">You just need to start.</span></h2><p class="mx-auto mt-6 max-w-2xl text-lg leading-8 text-primary-muted">ZeroHours helps you figure out what to do next, make the first step smaller, and get moving.</p><div class="mx-auto mt-8 flex max-w-md flex-col gap-3 sm:max-w-none sm:flex-row sm:justify-center">{buy_btn("btn-coral", "w-full sm:w-auto")}<a href="#guide" class="btn-on-primary w-full sm:w-auto">Get the free guide</a></div></div>
  </section>
</main>

<footer class="border-t border-border bg-background px-4 py-10 sm:px-6"><div class="mx-auto grid max-w-7xl gap-8 sm:grid-cols-2 sm:items-end"><div><div class="flex items-center gap-2 font-display font-extrabold uppercase"><img src="/assets/brand/zerohours-symbol.png" alt="" aria-hidden="true" class="size-8 w-auto object-contain">ZeroHours</div><p class="mt-3 max-w-sm text-sm text-muted-foreground">Stop staring at the assignment. Start it.</p></div><div class="sm:text-right"><div class="flex flex-wrap gap-x-4 gap-y-3 sm:justify-end">{footer_links}</div><p class="mt-4 text-xs text-muted-foreground">© 2026 ZeroHours. Sold by Arrow Wilder. Digital delivery after purchase.</p></div></div></footer>

<div class="sticky-cta fixed inset-x-0 bottom-0 z-50 border-t border-border bg-background/95 backdrop-blur-md md:hidden">{buy_btn("btn-primary", "w-full")}</div>
</div>
{SCRIPTS}
</body>
</html>
"""
    write("/", page)


# ---------- checkout success ----------
def build_success():
    a = f'<a href="{APP_URL}" target="_blank" rel="noopener noreferrer" class="font-bold text-primary underline underline-offset-2">app.zerohours.store</a>'
    page = head("Purchase received — ZeroHours", "Your ZeroHours purchase has been received.", "/checkout/success/", noindex=True, card="summary") + f"""<body>
<main class="grid min-h-screen place-items-center bg-background px-4 py-16">
  <div class="w-full max-w-xl rounded-xl border border-border bg-card p-6 text-center shadow-strong sm:p-10">
    <span class="mx-auto grid size-14 place-items-center rounded-full bg-success-soft text-success">{icon("check", "size-7")}</span>
    <p class="eyebrow mt-6">Purchase received</p>
    <h1 class="mt-3 font-display text-3xl font-extrabold uppercase sm:text-4xl">You're in.</h1>
    <a href="{APP_URL}" target="_blank" rel="noopener noreferrer" class="btn-primary mt-8 flex w-full items-center justify-center gap-2">Open ZeroHours {icon("arrow-up-right", "size-5")}</a>
    <p class="mt-3 text-sm font-medium">Unlock it with the email you just used at checkout.</p>
    <div class="mt-6 flex items-start gap-3 rounded-lg bg-secondary p-4 text-left">{icon("mail", "mt-0.5 size-5 shrink-0 text-primary")}<p class="text-sm leading-6">Your receipt is on its way to that email from Paddle, our payment provider. Bookmark <strong>app.zerohours.store</strong> so you can open ZeroHours on your phone or laptop any time.</p></div>
    <details class="group mt-4 rounded-lg border border-border bg-secondary p-4 text-left">
      <summary class="flex cursor-pointer list-none items-center justify-between gap-3 text-sm font-bold [&::-webkit-details-marker]:hidden">Can't find your receipt?{icon("chevron-down", "size-4 shrink-0 text-muted-foreground transition-transform group-open:rotate-180")}</summary>
      <div class="mt-3 space-y-3 text-sm leading-6">
        <p>You don't need the receipt to get started — open {a} right now and unlock it with the email you just used at checkout.</p>
        <p>If you want the receipt for your records, give it a few minutes, then check:</p>
        <ul class="list-disc space-y-1.5 pl-5">
          <li>Promotions tab (Gmail) — this is where it usually lands</li>
          <li>Spam or Junk</li>
          <li>Updates or Social tabs (Gmail), or "Other" (Outlook)</li>
          <li>Search your inbox for "Paddle" or "ZeroHours"</li>
        </ul>
        <p>Using a school email? Schools often filter outside emails or hold them in quarantine. Check there, or use a personal email next time.</p>
        <p>Still stuck? Double-check you typed your email right at checkout, then send us a message on our <a href="/support/" class="font-bold text-primary underline underline-offset-2">support page</a> with the email you used, and we'll sort it out.</p>
      </div>
    </details>
    <a href="/" class="btn-secondary mt-6 w-full">Return to ZeroHours</a>
  </div>
</main>
</body>
</html>
"""
    write("/checkout/success/", page)


# ---------- guide thank-you ----------
def build_guide():
    reasons = [
        ("The guide explains it. ZeroHours does it with you.", "Reading why you procrastinate is the easy part. ZeroHours walks you through the actual start — every time you get stuck."),
        ("It picks the next action for you.", "No more staring at a list. You get one task, one first step, and a timer that makes it small enough to begin."),
        ("It catches you when you fall behind.", "Catch-Up Mode, Deadline Rescue, and Exam Rescue turn a pile of late work into a plan you can follow today."),
        ("Your whole semester in one place.", "Courses, assignments, exams, notes, reading, schedule, and grades — connected to the tools that get them done."),
    ]
    reasons_html = "".join(f'<div class="rounded-lg border border-border bg-card p-5 shadow-soft sm:p-6"><p class="font-display text-lg font-bold leading-snug">{e(t)}</p><p class="mt-2 text-sm leading-6 text-muted-foreground">{e(c)}</p></div>' for t, c in reasons)
    shots_html = "".join(
        f'<figure class="showcase-card"><img src="/assets/media/{s}.webp" alt="{e(a)}" loading="lazy" class="aspect-video w-full rounded-t-[inherit] bg-background object-contain">'
        f'<figcaption class="p-4 sm:p-5"><p class="font-display font-bold">{e(t)}</p><p class="mt-1 text-sm leading-6 text-muted-foreground">{e(d)}</p></figcaption></figure>' for s, a, t, d in SHOTS[:3])
    short = ["Next-action workflow", "5-Minute Rescue", "Lock-In Mode", "Exam Rescue", "Catch-Up Mode", "Full academic workspace"]
    full = ["Anti-procrastination system", "Next-action workflow", "5-Minute Rescue", "Lock-In Mode", "Study Sessions", "Exam Rescue", "Catch-Up Mode", "Academic workspace", "Progress tracking", "The ZeroHours Guide (PDF)"]
    note = f'<p class="mt-4 flex items-center justify-center gap-1.5 rounded-md bg-surface px-3 py-2 text-center text-xs font-semibold text-foreground">{icon("monitor", "size-3.5 shrink-0")}Works on mobile and desktop in your browser. No install needed.</p><p class="mt-2 text-center text-xs font-medium text-muted-foreground">You\'ll unlock the app with the email you use at checkout.</p>'
    err = '<p role="alert" data-checkout-error hidden class="mt-4 rounded-md bg-coral-soft p-3 text-center text-sm text-coral-strong">Checkout couldn\'t open. Please try again.</p>'
    page = head("Your free guide is ready — ZeroHours", "Download your free ZeroHours procrastination guide, and see the full system that helps you actually start.",
                "/guide/thank-you/", noindex=True, card="summary") + f"""<body>
{TEST_BANNER}
<main class="min-h-screen bg-background pb-24 text-foreground md:pb-0">
  <section class="section-shell bg-ink text-ink-foreground">
    <div class="mx-auto max-w-3xl text-center">
      <div class="flex items-start gap-3 rounded-lg border border-ink-border bg-ink-soft p-4 text-left">
        <span class="grid size-9 shrink-0 place-items-center rounded-full bg-success-soft text-success">{icon("check", "size-5")}</span>
        <div>
          <p class="text-sm font-bold text-ink-foreground">Your guide is ready.</p>
          <p class="mt-1 text-sm leading-6 text-ink-muted"><strong class="text-ink-foreground">ZeroHours — Just Start</strong> is a short PDF you can read on your phone in a few minutes.</p>
          <a href="/assets/docs/zerohours-just-start-free-guide.pdf" download class="btn-coral mt-3 !min-h-11 !text-xs">{icon("download")}Download the free guide (PDF)</a>
        </div>
      </div>
      <p class="eyebrow mt-10 text-coral">Before you go</p>
      <h1 class="section-title mt-4">The guide tells you why.<span class="block text-coral">ZeroHours makes you start.</span></h1>
      <p class="mx-auto mt-6 max-w-2xl text-lg leading-8 text-ink-muted">You grabbed the guide because starting is the hard part. ZeroHours is the system built for exactly that moment — and it pairs with everything in the guide.</p>
      <div class="mt-8 overflow-hidden rounded-xl border border-coral bg-card text-left text-foreground shadow-strong">
        <div class="border-b border-border bg-coral px-6 py-3 text-center text-sm font-bold uppercase text-white">Guide readers — get the full system</div>
        <div class="p-6 sm:p-8">
          <div class="flex items-end gap-3"><span class="font-display text-5xl font-extrabold">{PRICE}</span><span class="pb-1.5 font-display text-xl font-bold text-muted-foreground line-through">{WAS}</span><span class="pb-1 text-sm font-semibold text-muted-foreground">one time</span></div>
          <ul class="mt-6 grid gap-3 sm:grid-cols-2">{"".join(check_item(x) for x in short)}</ul>
          {buy_btn("btn-coral", "mt-7 w-full", source="guide_upsell_page")}
          {note}
          <p class="mt-3 text-center text-xs font-medium text-muted-foreground">One-time purchase. No subscription. Instant access.</p>
          {err}
        </div>
      </div>
    </div>
  </section>
  <section class="section-shell">
    <div class="mx-auto max-w-5xl text-center">
      <p class="eyebrow">One more thing</p>
      <h2 class="section-title mt-4">The guide tells you why.<span class="block text-primary">ZeroHours makes you start.</span></h2>
      <p class="mx-auto mt-6 max-w-2xl text-lg leading-8 text-muted-foreground">Most students read a guide like this, nod along, and still don't open the assignment. ZeroHours is the system that closes that gap — it sits with you at the moment you'd normally avoid the work.</p>
    </div>
    <div class="mx-auto mt-10 grid max-w-5xl gap-4 sm:grid-cols-2">{reasons_html}</div>
    <div class="mx-auto mt-10 grid max-w-5xl gap-5 sm:grid-cols-2 lg:grid-cols-3">{shots_html}</div>
  </section>
  <section class="section-shell bg-surface">
    <div class="mx-auto max-w-2xl overflow-hidden rounded-xl border border-primary bg-card shadow-strong">
      <div class="border-b border-border bg-primary px-6 py-4 text-center text-sm font-bold uppercase text-primary-foreground">ZeroHours — Complete system</div>
      <div class="p-6 sm:p-10">
        <div class="flex items-end gap-3"><span class="font-display text-5xl font-extrabold">{PRICE}</span><span class="pb-1.5 font-display text-xl font-bold text-muted-foreground line-through">{WAS}</span><span class="pb-1 text-sm font-semibold text-muted-foreground">one time</span></div>
        <ul class="mt-8 grid gap-3 sm:grid-cols-2">{"".join(check_item(x) for x in full)}</ul>
        {buy_btn("btn-coral", "mt-9 w-full", source="guide_upsell_page")}
        {note}
        <p class="mt-3 text-center text-xs font-medium text-muted-foreground">One-time purchase. No monthly subscription. Instant access.</p>
        {err}
        <a href="/" class="mt-4 block text-center text-sm font-semibold text-muted-foreground underline underline-offset-4 hover:text-foreground">No thanks — just the free guide</a>
      </div>
    </div>
  </section>
  <div class="sticky-cta fixed inset-x-0 bottom-0 z-50 border-t border-border bg-background/95 backdrop-blur-md md:hidden">{buy_btn("btn-primary", "w-full", source="guide_upsell_page")}</div>
</main>
{SCRIPTS}
</body>
</html>
"""
    write("/guide/thank-you/", page)


# ---------- support ----------
def build_support():
    topics = ["Can't unlock the app", "Didn't get my receipt", "Refund question", "Bug or problem", "Something else"]
    inp = "w-full rounded-xl border border-border bg-card px-4 py-3 text-base text-foreground outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
    page = head("Support — ZeroHours", "Need help with ZeroHours? Send us a message and we'll get back to you by email.", "/support/", card="summary") + f"""<body>
<main class="min-h-screen bg-background px-4 py-12 sm:px-6 sm:py-20">
  <div class="mx-auto max-w-xl">
    <a href="/" class="text-sm font-semibold text-muted-foreground hover:text-foreground">← Back to ZeroHours</a>
    <h1 class="mt-6 font-display text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">How can we help?</h1>
    <p class="mt-3 text-muted-foreground">Tell us what's going on and we'll reply to your email. If it's about a purchase, use the email you checked out with.</p>
    <form name="support" method="POST" action="/support/sent/" data-netlify="true" netlify-honeypot="website" class="mt-8 grid gap-4 rounded-2xl border border-border bg-card p-5 sm:p-6">
      <input type="hidden" name="form-name" value="support">
      <label class="grid gap-1.5 text-sm font-semibold text-foreground">Name (optional)<input name="name" maxlength="100" class="{inp}"></label>
      <label class="grid gap-1.5 text-sm font-semibold text-foreground">Your email<input name="email" type="email" required maxlength="200" class="{inp}"></label>
      <label class="grid gap-1.5 text-sm font-semibold text-foreground">Topic
        <select name="topic" required class="{inp}">{"".join(f"<option>{e(t)}</option>" for t in topics)}</select>
      </label>
      <label class="grid gap-1.5 text-sm font-semibold text-foreground">Message<textarea name="message" required minlength="10" maxlength="3000" rows="6" class="{inp}"></textarea></label>
      <p hidden><label>Leave this empty <input name="website" tabindex="-1" autocomplete="off"></label></p>
      <button type="submit" class="rounded-xl bg-primary px-5 py-3.5 font-display font-bold text-primary-foreground transition hover:opacity-90 disabled:opacity-60">Send message</button>
    </form>
  </div>
</main>
</body>
</html>
"""
    write("/support/", page)
    sent = head("Message sent — ZeroHours", "Your message has been sent.", "/support/sent/", noindex=True, card="summary") + """<body>
<main class="min-h-screen bg-background px-4 py-12 sm:px-6 sm:py-20">
  <div class="mx-auto max-w-xl">
    <a href="/" class="text-sm font-semibold text-muted-foreground hover:text-foreground">← Back to ZeroHours</a>
    <div class="mt-8 rounded-2xl border border-border bg-card p-6">
      <h1 class="font-display text-xl font-bold text-foreground">Message sent.</h1>
      <p class="mt-2 text-muted-foreground">Thanks — we've got it and will reply by email. Check your spam or promotions folder if you don't see our reply.</p>
    </div>
  </div>
</main>
</body>
</html>
"""
    write("/support/sent/", sent)


# ---------- legal ----------
def legal(path, title_tag, desc, eyebrow, title, summary, body):
    page = head(title_tag, desc, path, card="summary") + f"""<body>
<div class="min-h-screen bg-background text-foreground">
  {MOBILE_NOTE("max-w-5xl", "px-4")}
  <header class="border-b border-border bg-background">
    <div class="mx-auto flex h-16 max-w-5xl items-center justify-between gap-4 px-4 sm:px-6">
      <a href="/" class="flex min-w-0 items-center gap-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
        <img src="/assets/brand/zerohours-symbol.png" alt="" aria-hidden="true" class="size-7 shrink-0 object-contain">
        <img src="/assets/brand/zerohours-wordmark.png" alt="ZeroHours" class="h-6 w-auto" width="1511" height="222">
      </a>
      <a href="/" class="inline-flex items-center gap-2 text-sm font-bold text-muted-foreground hover:text-foreground">{icon("arrow-left", "size-4")}Home</a>
    </div>
  </header>
  <main>
    <div class="border-b border-border bg-surface">
      <div class="mx-auto max-w-5xl px-4 py-12 sm:px-6 sm:py-16">
        <p class="eyebrow">{eyebrow}</p>
        <h1 class="mt-4 max-w-4xl font-display text-4xl font-extrabold uppercase leading-tight sm:text-6xl">{title}</h1>
        <p class="mt-5 max-w-2xl text-base leading-7 text-muted-foreground sm:text-lg">{summary}</p>
        <p class="mt-4 text-sm font-semibold text-muted-foreground">Effective October 18, 2026</p>
      </div>
    </div>
    <article class="legal-copy mx-auto max-w-5xl px-4 py-12 sm:px-6 sm:py-16">{body}</article>
  </main>
  <footer class="border-t border-border px-4 py-8 sm:px-6">
    <div class="mx-auto flex max-w-5xl flex-col gap-5 text-sm sm:flex-row sm:items-center sm:justify-between">
      <p class="text-muted-foreground">© 2026 ZeroHours. Sold by Arrow Wilder.</p>
      <nav class="flex flex-wrap gap-x-5 gap-y-3" aria-label="Legal pages">
        <a href="/privacy/" class="font-semibold hover:text-primary">Privacy</a>
        <a href="/terms/" class="font-semibold hover:text-primary">Terms</a>
        <a href="/refund-policy/" class="font-semibold hover:text-primary">Refunds</a>
        <a href="/support/" class="font-semibold hover:text-primary">Support</a>
      </nav>
    </div>
  </footer>
</div>
</body>
</html>
"""
    write(path, page)


def build_legal():
    for name in ["privacy", "terms", "refund-policy"]:
        meta = json.loads((ROOT / "tools" / "legal" / f"{name}.json").read_text())
        body = (ROOT / "tools" / "legal" / f"{name}.html").read_text()
        legal(f"/{name}/", meta["titleTag"], meta["description"], meta["eyebrow"], meta["title"], meta["summary"], body)


def build_404():
    page = head("Page not found — ZeroHours", "This page doesn't exist.", "/404", noindex=True, card="summary") + """<body>
<div class="flex min-h-screen items-center justify-center bg-background px-4">
  <div class="max-w-md text-center">
    <h1 class="text-7xl font-bold text-foreground">404</h1>
    <h2 class="mt-4 text-xl font-semibold text-foreground">Page not found</h2>
    <p class="mt-2 text-sm text-muted-foreground">The page you're looking for doesn't exist or has been moved.</p>
    <div class="mt-6"><a href="/" class="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90">Go home</a></div>
  </div>
</div>
</body>
</html>
"""
    write("/404.html", page)


if __name__ == "__main__":
    build_home(); build_success(); build_guide(); build_support(); build_legal(); build_404()
    print("built", sorted(str(p.relative_to(SITE)) for p in SITE.rglob("*.html")))
