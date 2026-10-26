(() => {
  "use strict";

  const yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = String(new Date().getFullYear());

  const nav = document.querySelector(".nav");
  const toggle = document.querySelector(".nav-toggle");
  const menu = document.getElementById("site-menu");
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---- Mobile nav ---- */
  if (toggle && nav && menu) {
    toggle.addEventListener("click", () => {
      const open = nav.classList.toggle("is-open");
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
      toggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
    });

    menu.querySelectorAll("a").forEach((a) => {
      a.addEventListener("click", () => {
        nav.classList.remove("is-open");
        toggle.setAttribute("aria-expanded", "false");
        toggle.setAttribute("aria-label", "Open menu");
      });
    });
  }

  /* ---- Nav shadow on scroll ---- */
  const onScrollNav = () => {
    if (!nav) return;
    nav.classList.toggle("is-scrolled", window.scrollY > 8);
  };
  onScrollNav();
  window.addEventListener("scroll", onScrollNav, { passive: true });

  /* ---- Hero entrance ---- */
  const hero = document.querySelector(".hero");
  if (hero) {
    requestAnimationFrame(() => {
      hero.classList.add("is-ready");
    });
  }

  /* ---- Mark reveal targets ---- */
  const revealSelectors = [
    "#about .section-label",
    "#about .lead",
    ".about-facts .fact",
    "#research .section-label",
    "#research .section-kicker",
    ".feature-tile",
    "#news .section-label",
    "#news .section-kicker",
    ".news-list li",
    "#publications .section-label",
    "#publications .section-kicker",
    ".pub-card",
    "#honors .section-label",
    ".honor-list li",
    "#service .section-label",
    ".service-card",
    "#education .section-label",
    ".edu-grid > div",
    ".contact-title",
    ".contact-copy",
    "#contact .hero-cta",
    ".contact-quiet",
  ];

  const revealEls = [];
  revealSelectors.forEach((sel) => {
    document.querySelectorAll(sel).forEach((el, i) => {
      el.classList.add("reveal");
      if (sel === ".news-list li") {
        el.style.setProperty("--news-reveal-delay", `${Math.min(i, 5) * 0.08}s`);
      } else if (
        sel === ".feature-tile" ||
        sel === ".pub-card" ||
        sel === ".about-facts .fact"
      ) {
        el.classList.add(`reveal-delay-${(i % 4) + 1}`);
      }
      revealEls.push(el);
    });
  });

  if (reduceMotion) {
    revealEls.forEach((el) => el.classList.add("in-view"));
  } else {
    /* ---- IntersectionObserver fade/scale reveals ---- */
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("in-view");
            io.unobserve(entry.target);
          }
        });
      },
      { root: null, rootMargin: "0px 0px -6% 0px", threshold: 0.1 }
    );

    revealEls.forEach((el) => io.observe(el));

    window.setTimeout(() => {
      revealEls.forEach((el) => el.classList.add("in-view"));
    }, 2500);
  }

  /* ---- News timeline: highlight item nearest viewport center ---- */
  const newsItems = document.querySelectorAll(".news-list li");
  if (newsItems.length && !reduceMotion) {
    const visibility = new Map();
    const pickActiveNewsItem = () => {
      let best = null;
      let bestRatio = 0;
      newsItems.forEach((li) => {
        const ratio = visibility.get(li) || 0;
        if (ratio > bestRatio) {
          bestRatio = ratio;
          best = li;
        }
      });
      newsItems.forEach((li) => {
        li.classList.toggle("is-timeline-active", li === best && bestRatio > 0.08);
      });
    };

    const newsIo = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          visibility.set(entry.target, entry.intersectionRatio);
        });
        pickActiveNewsItem();
      },
      {
        root: null,
        rootMargin: "-32% 0px -32% 0px",
        threshold: [0, 0.08, 0.16, 0.24, 0.32, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1],
      }
    );

    newsItems.forEach((li) => newsIo.observe(li));
  }

  /* ---- Parallax on hero portrait (rAF) ---- */
  const portrait = document.querySelector(".hero-portrait");
  let ticking = false;

  const updateParallax = () => {
    ticking = false;
    if (!portrait || !hero) return;
    // Skip aggressive parallax on narrow screens (portrait stacks below)
    if (window.matchMedia("(max-width: 960px)").matches) {
      portrait.style.transform = "";
      portrait.style.opacity = "";
      return;
    }
    const rect = hero.getBoundingClientRect();
    const heroH = hero.offsetHeight || 1;
    const progress = Math.min(1, Math.max(0, -rect.top / (heroH * 0.9)));
    const y = progress * 40;
    const scale = 1 - progress * 0.035;
    const opacity = 1 - progress * 0.28;
    portrait.style.transform = `translate3d(0, ${y.toFixed(2)}px, 0) scale(${scale.toFixed(4)})`;
    portrait.style.opacity = String(Math.max(0.55, opacity));
  };

  const onScrollParallax = () => {
    if (!ticking) {
      ticking = true;
      requestAnimationFrame(updateParallax);
    }
  };

  if (portrait && hero && !reduceMotion) {
    window.addEventListener("scroll", onScrollParallax, { passive: true });
    updateParallax();
  }
})();
