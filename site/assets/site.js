// ZeroHours site behaviour: mobile menu, phone carousel, phone video, Paddle checkout.
(function () {
  "use strict";

  // ---------- mobile menu ----------
  const toggle = document.querySelector("[data-menu-toggle]");
  const menu = document.querySelector("[data-mobile-menu]");
  if (toggle && menu) {
    const set = (open) => {
      menu.hidden = !open;
      toggle.setAttribute("aria-expanded", String(open));
      toggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
      toggle.querySelector("[data-icon-open]").hidden = open;
      toggle.querySelector("[data-icon-close]").hidden = !open;
    };
    toggle.addEventListener("click", () => set(menu.hidden));
    menu.querySelectorAll("[data-close-menu]").forEach((a) => a.addEventListener("click", () => set(false)));
  }

  // ---------- phone carousel (mobile) ----------
  document.querySelectorAll("[data-phone-showcase]").forEach((root) => {
    const track = root.querySelector(".phone-track");
    const slides = Array.from(root.querySelectorAll(".phone-slide"));
    const dots = Array.from(root.querySelectorAll("[data-dot]"));
    const setActive = (i) => {
      slides.forEach((s, j) => (s.dataset.active = String(i === j)));
      dots.forEach((d, j) => {
        d.querySelector(".phone-dot").classList.toggle("phone-dot-active", i === j);
        if (i === j) d.setAttribute("aria-current", "true"); else d.removeAttribute("aria-current");
      });
    };
    let ticking = false;
    track.addEventListener("scroll", () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        ticking = false;
        const mid = track.getBoundingClientRect().left + track.clientWidth / 2;
        let best = 0, dist = Infinity;
        slides.forEach((s, i) => {
          const r = s.getBoundingClientRect();
          const d = Math.abs(r.left + r.width / 2 - mid);
          if (d < dist) { dist = d; best = i; }
        });
        setActive(best);
      });
    }, { passive: true });
    dots.forEach((d, i) => d.addEventListener("click", () => {
      const s = slides[i];
      track.scrollTo({ left: s.offsetLeft - track.offsetLeft - (track.clientWidth - s.clientWidth) / 2 });
      setActive(i);
    }));
  });

  // ---------- phone walkthrough video ----------
  const PLAY = '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polygon points="6 3 20 12 6 21 6 3"/></svg>';
  const PAUSE = '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="14" y="4" width="4" height="16" rx="1"/><rect x="6" y="4" width="4" height="16" rx="1"/></svg>';
  document.querySelectorAll("[data-phone-play]").forEach((btn) => {
    const video = btn.parentElement.querySelector("video");
    if (!video) return;
    const sync = (playing) => {
      btn.classList.toggle("phone-video-button-playing", playing);
      btn.innerHTML = playing ? PAUSE : PLAY;
      btn.setAttribute("aria-label", playing ? "Pause phone walkthrough" : "Play phone walkthrough");
    };
    video.addEventListener("play", () => sync(true));
    video.addEventListener("pause", () => sync(false));
    video.addEventListener("error", () => {
      btn.outerHTML = '<span class="phone-video-error" role="status">Video unavailable</span>';
    });
    btn.addEventListener("click", () => {
      if (!video.paused) { video.pause(); return; }
      if (!video.getAttribute("src")) {
        const webm = video.dataset.srcWebm && video.canPlayType('video/webm; codecs="vp9"');
        video.src = webm ? video.dataset.srcWebm : video.dataset.src;
      }
      video.play().catch(() => {});
    });
    if ("IntersectionObserver" in window) {
      new IntersectionObserver(([en]) => { if (!en.isIntersecting) video.pause(); }, { threshold: 0.55 }).observe(video);
    }
  });

  // ---------- screenshot popup: click an app screenshot to see it big ----------
  (function () {
    const shots = Array.from(document.querySelectorAll(".showcase-card img, .media-card img"))
      .filter((img) => /\/assets\/media\//.test(img.getAttribute("src") || "") && !/student-hero/.test(img.getAttribute("src")));
    if (!shots.length) return;

    const ICON_EXPAND = '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.25" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M15 3h6v6"/><path d="M9 21H3v-6"/><path d="M21 3l-7 7"/><path d="M3 21l7-7"/></svg>';
    const ICON_CLOSE = '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.25" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>';
    const ICON_PREV = '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.25" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m15 18-6-6 6-6"/></svg>';
    const ICON_NEXT = '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.25" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m9 18 6-6-6-6"/></svg>';

    // The six "See the system" cards browse as one set; every other screenshot opens on its own.
    const captionFor = (img) => {
      const fig = img.closest("figure");
      const title = fig && fig.querySelector(".showcase-card figcaption p, .media-caption");
      return (title && title.textContent.trim()) || img.getAttribute("alt") || "";
    };
    const items = shots.map((img) => ({
      img,
      src: img.currentSrc || img.getAttribute("src"),
      alt: img.getAttribute("alt") || "",
      caption: captionFor(img),
      group: img.closest(".showcase-card") ? img.closest(".showcase-card").parentElement : img,
    }));

    const box = document.createElement("div");
    box.className = "zoom-lb";
    box.hidden = true;
    box.setAttribute("role", "dialog");
    box.setAttribute("aria-modal", "true");
    box.setAttribute("aria-label", "Screenshot preview");
    box.innerHTML =
      '<figure class="zoom-lb-figure"><img class="zoom-lb-img" alt="" decoding="async">' +
      '<figcaption class="zoom-lb-caption"><span class="zoom-lb-title"></span><span class="zoom-lb-count"></span></figcaption></figure>' +
      '<button type="button" class="zoom-lb-btn zoom-lb-close" aria-label="Close preview">' + ICON_CLOSE + "</button>" +
      '<button type="button" class="zoom-lb-btn zoom-lb-prev" aria-label="Previous screenshot">' + ICON_PREV + "</button>" +
      '<button type="button" class="zoom-lb-btn zoom-lb-next" aria-label="Next screenshot">' + ICON_NEXT + "</button>";
    document.body.appendChild(box);
    const bigImg = box.querySelector(".zoom-lb-img");
    const titleEl = box.querySelector(".zoom-lb-title");
    const countEl = box.querySelector(".zoom-lb-count");
    const closeBtn = box.querySelector(".zoom-lb-close");
    const prevBtn = box.querySelector(".zoom-lb-prev");
    const nextBtn = box.querySelector(".zoom-lb-next");

    let set = [], pos = 0, opener = null, closeTimer = 0;

    const show = (i) => {
      pos = (i + set.length) % set.length;
      const it = set[pos];
      bigImg.src = it.src;
      bigImg.alt = it.alt;
      titleEl.textContent = it.caption;
      countEl.textContent = set.length > 1 ? (pos + 1) + " / " + set.length : "";
      if (set.length > 1) {
        [set[(pos + 1) % set.length], set[(pos - 1 + set.length) % set.length]].forEach((n) => { new Image().src = n.src; });
      }
    };

    const open = (item) => {
      clearTimeout(closeTimer);
      set = items.filter((it) => it.group === item.group);
      opener = item.img;
      const multi = set.length > 1;
      prevBtn.hidden = nextBtn.hidden = !multi;
      box.classList.toggle("zoom-lb-single", !multi);
      show(set.indexOf(item));
      const bar = window.innerWidth - document.documentElement.clientWidth;
      document.documentElement.classList.add("zoom-lb-lock");
      if (bar > 0) document.documentElement.style.paddingRight = bar + "px";
      box.hidden = false;
      requestAnimationFrame(() => requestAnimationFrame(() => box.classList.add("zoom-lb-open")));
      closeBtn.focus({ preventScroll: true });
    };

    const close = () => {
      if (box.hidden) return;
      box.classList.remove("zoom-lb-open");
      document.documentElement.classList.remove("zoom-lb-lock");
      document.documentElement.style.paddingRight = "";
      const reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      closeTimer = setTimeout(() => { box.hidden = true; bigImg.removeAttribute("src"); }, reduce ? 0 : 180);
      if (opener) opener.focus({ preventScroll: true });
    };

    items.forEach((item) => {
      const img = item.img;
      img.classList.add("zoom-trigger");
      img.setAttribute("tabindex", "0");
      img.setAttribute("role", "button");
      img.setAttribute("aria-haspopup", "dialog");
      img.setAttribute("aria-label", "View larger: " + item.caption);
      const host = img.closest(".media-frame") || img.parentElement;
      host.classList.add("zoom-host");
      const badge = document.createElement("span");
      badge.className = "zoom-badge";
      badge.setAttribute("aria-hidden", "true");
      badge.innerHTML = ICON_EXPAND;
      host.appendChild(badge);
      const go = () => { item.src = img.currentSrc || item.src; open(item); };
      img.addEventListener("click", go);
      badge.addEventListener("click", go);
      img.addEventListener("keydown", (e) => {
        if (e.key === "Enter" || e.key === " ") { e.preventDefault(); go(); }
      });
    });

    closeBtn.addEventListener("click", close);
    prevBtn.addEventListener("click", () => show(pos - 1));
    nextBtn.addEventListener("click", () => show(pos + 1));
    // Clicking anywhere outside the picture and the buttons closes it.
    box.addEventListener("click", (e) => {
      if (e.target === bigImg || e.target.closest(".zoom-lb-btn")) return;
      close();
    });
    document.addEventListener("keydown", (e) => {
      if (box.hidden) return;
      if (e.key === "Escape") { e.preventDefault(); close(); }
      else if (e.key === "ArrowRight" && set.length > 1) { e.preventDefault(); show(pos + 1); }
      else if (e.key === "ArrowLeft" && set.length > 1) { e.preventDefault(); show(pos - 1); }
      else if (e.key === "Tab") {
        const f = [closeBtn, prevBtn, nextBtn].filter((b) => !b.hidden);
        const at = f.indexOf(document.activeElement);
        e.preventDefault();
        f[(at + (e.shiftKey ? -1 : 1) + f.length) % f.length].focus();
      }
    });
    // Swipe left or right on a touch screen to flip through the set.
    let sx = 0, sy = 0;
    box.addEventListener("touchstart", (e) => { sx = e.touches[0].clientX; sy = e.touches[0].clientY; }, { passive: true });
    box.addEventListener("touchend", (e) => {
      if (set.length < 2 || e.touches.length) return;
      const dx = e.changedTouches[0].clientX - sx, dy = e.changedTouches[0].clientY - sy;
      if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy) * 1.5) show(pos + (dx < 0 ? 1 : -1));
    }, { passive: true });
  })();

  // ---------- free guide form: email the guide (Brevo) + keep a copy in Netlify Forms ----------
  const guideForm = document.querySelector('form[name="free-guide"]');
  if (guideForm && window.fetch) {
    guideForm.addEventListener("submit", async (ev) => {
      ev.preventDefault();
      const btn = guideForm.querySelector('button[type="submit"]');
      const orig = btn ? btn.innerHTML : "";
      if (btn) { btn.disabled = true; btn.textContent = "Sending your guide…"; }
      const fd = new FormData(guideForm);
      const withTimeout = (p) => Promise.race([p, new Promise((r) => setTimeout(r, 6000))]);
      await Promise.allSettled([
        withTimeout(fetch("/api/guide", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: fd.get("email"),
            marketingConsent: fd.get("marketingConsent") === "on",
            website: fd.get("website") || "",
          }),
        })),
        withTimeout(fetch("/", {
          method: "POST",
          headers: { "Content-Type": "application/x-www-form-urlencoded" },
          body: new URLSearchParams(fd).toString(),
        })),
      ]);
      if (btn) { btn.disabled = false; btn.innerHTML = orig; }
      window.location.href = "/guide/thank-you/";
    });
  }

  // ---------- checkout (Paddle, straight from the browser) ----------
  let configPromise;
  const getConfig = () => {
    configPromise = configPromise || fetch("/api/checkout-config", { headers: { Accept: "application/json" } })
      .then((r) => (r.ok ? r.json() : Promise.reject(new Error("config " + r.status))))
      .catch((err) => { configPromise = undefined; throw err; });
    return configPromise;
  };

  let paddlePromise;
  const loadPaddle = (cfg) => {
    paddlePromise = paddlePromise || new Promise((resolve, reject) => {
      const ready = () => {
        const P = window.Paddle;
        if (!P) return reject(new Error("Paddle missing"));
        if (cfg.environment === "sandbox") P.Environment.set("sandbox");
        P.Initialize({ token: cfg.clientToken });
        resolve(P);
      };
      if (window.Paddle) return ready();
      const s = document.createElement("script");
      s.src = "https://cdn.paddle.com/paddle/v2/paddle.js";
      s.onload = ready;
      s.onerror = () => { paddlePromise = undefined; reject(new Error("Paddle failed to load")); };
      document.head.appendChild(s);
    });
    return paddlePromise;
  };

  const buttons = Array.from(document.querySelectorAll("[data-checkout]"));
  const errors = Array.from(document.querySelectorAll("[data-checkout-error]"));

  const setLoading = (on) => buttons.forEach((b) => {
    b.disabled = on;
    const lab = b.querySelector("[data-label]");
    if (!lab) return;
    if (on) { lab.dataset.orig = lab.innerHTML; lab.textContent = "Opening checkout…"; }
    else if (lab.dataset.orig) { lab.innerHTML = lab.dataset.orig; }
  });

  async function openCheckout() {
    errors.forEach((el) => (el.hidden = true));
    setLoading(true);
    try {
      const cfg = await getConfig();
      const P = await loadPaddle(cfg);
      P.Checkout.open({
        items: [{ priceId: cfg.priceId, quantity: 1 }],
        settings: {
          displayMode: "overlay",
          successUrl: window.location.origin + "/checkout/success/",
          allowLogout: false,
          variant: "one-page",
        },
      });
    } catch (err) {
      console.error(err);
      errors.forEach((el) => (el.hidden = false));
      const pricing = document.querySelector("#pricing");
      if (pricing) pricing.scrollIntoView({ behavior: "smooth" });
    } finally {
      setLoading(false);
    }
  }

  buttons.forEach((b) => b.addEventListener("click", openCheckout));

  // Show the test banner when the site is wired to Paddle's sandbox, and warm up the checkout.
  if (buttons.length) {
    getConfig().then((cfg) => {
      if (cfg.environment === "sandbox") document.querySelectorAll("[data-test-banner]").forEach((el) => (el.hidden = false));
    }).catch(() => {});
  }
})();
