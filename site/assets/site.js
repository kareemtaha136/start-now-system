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
