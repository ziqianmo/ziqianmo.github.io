(() => {
  "use strict";

  const yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = String(new Date().getFullYear());

  const THEME_KEY = "theme";
  const root = document.documentElement;
  const themeToggle = document.getElementById("theme-toggle");
  const themeMeta = document.querySelector('meta[name="theme-color"]');

  const getTheme = () => (root.getAttribute("data-theme") === "dark" ? "dark" : "light");

  const applyTheme = (theme) => {
    if (theme === "dark") {
      root.setAttribute("data-theme", "dark");
    } else {
      root.removeAttribute("data-theme");
    }
    if (themeMeta) {
      themeMeta.setAttribute("content", theme === "dark" ? "#000000" : "#f5f5f7");
    }
    if (themeToggle) {
      const isDark = theme === "dark";
      themeToggle.setAttribute("aria-pressed", isDark ? "true" : "false");
      themeToggle.setAttribute(
        "aria-label",
        isDark ? "Switch to light mode" : "Switch to dark mode"
      );
    }
  };

  if (themeToggle) {
    applyTheme(getTheme());
    themeToggle.addEventListener("click", () => {
      const next = getTheme() === "dark" ? "light" : "dark";
      try {
        localStorage.setItem(THEME_KEY, next);
      } catch {
        /* private mode */
      }
      applyTheme(next);
    });
  }

  const nav = document.querySelector(".nav");
  const toggle = document.querySelector(".nav-toggle");
  const menu = document.getElementById("site-menu");
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const SCHOLAR_JSON_URL = "data/scholar.json";

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

  /* ---- Google Scholar metrics ---- */
  const normalizeTitle = (raw) =>
    String(raw || "")
      .replace(/<[^>]+>/g, "")
      .replace(/\u00b3/g, "3")
      .replace(/[^a-zA-Z0-9\s]/g, " ")
      .replace(/\s+/g, " ")
      .trim()
      .toLowerCase();

  const formatUpdated = (iso) => {
    if (!iso) return "Updated recently";
    const d = new Date(iso);
    if (Number.isNaN(d.getTime())) return "Updated recently";
    return `Updated ${d.toLocaleDateString(undefined, {
      year: "numeric",
      month: "short",
      day: "numeric",
    })}`;
  };

  const animateCount = (el, target) => {
    if (!el || typeof target !== "number") return;
    if (reduceMotion) {
      el.textContent = String(target);
      return;
    }
    const start = performance.now();
    const duration = 900;
    const from = 0;
    const step = (now) => {
      const t = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - t, 3);
      el.textContent = String(Math.round(from + (target - from) * eased));
      if (t < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  };

  const renderSparkline = (svg, yearGraph) => {
    if (!svg || !Array.isArray(yearGraph) || yearGraph.length < 2) return;
    const w = 96;
    const h = 32;
    const padX = 2;
    const padY = 4;
    const values = yearGraph.map((p) => p.citations);
    const max = Math.max(...values, 1);
    const coords = yearGraph.map((p, i) => {
      const x = padX + (i / (yearGraph.length - 1)) * (w - padX * 2);
      const y = h - padY - (p.citations / max) * (h - padY * 2);
      return { x, y };
    });
    const linePts = coords.map((c) => `${c.x.toFixed(1)},${c.y.toFixed(1)}`).join(" ");
    const areaPts = [
      `${padX},${h - padY}`,
      ...coords.map((c) => `${c.x.toFixed(1)},${c.y.toFixed(1)}`),
      `${w - padX},${h - padY}`,
    ].join(" ");
    svg.innerHTML = `<polygon class="hero-scholar-spark-fill" points="${areaPts}" /><polyline class="hero-scholar-spark-line" points="${linePts}" />`;
  };

  const titleMatchScore = (cardNorm, paperNorm) => {
    if (!cardNorm || !paperNorm) return 0;
    if (paperNorm.includes(cardNorm) || cardNorm.includes(paperNorm)) return 88;
    const cardWords = cardNorm.split(" ").filter((w) => w.length > 3);
    const paperWords = new Set(paperNorm.split(" ").filter((w) => w.length > 3));
    const overlap = cardWords.filter((w) => paperWords.has(w)).length;
    if (overlap >= 2) return 40 + overlap;
    return 0;
  };

  const keyHintScore = (keyNorm, paperNorm) => {
    if (!keyNorm || !paperNorm) return 0;
    if (keyNorm.length >= 4 && paperNorm.includes(keyNorm)) return 100;
    const keyLoose = keyNorm.replace(/\d/g, "");
    if (keyLoose.length >= 3 && paperNorm.includes(keyLoose)) return 96;
    return 0;
  };

  const findPaperCitations = (card, papers) => {
    if (!papers?.length) return null;
    const key = card.getAttribute("data-scholar-title");
    const h3 = card.querySelector(".pub-body h3");
    const fullNorm = normalizeTitle(h3 ? h3.textContent : "");
    const keyNorm = key ? normalizeTitle(key) : "";
    if (!fullNorm && !keyNorm) return null;

    let best = null;
    let bestScore = 0;

    for (const paper of papers) {
      const paperNorm = normalizeTitle(paper.title);
      if (!paperNorm) continue;

      let score = titleMatchScore(fullNorm, paperNorm);
      if (keyNorm) score = Math.max(score, keyHintScore(keyNorm, paperNorm));

      if (score > bestScore) {
        bestScore = score;
        best = paper;
      }
    }

    if (!best || bestScore < 40) return null;
    return typeof best.citations === "number" ? best.citations : null;
  };

  const applyScholarData = (data) => {
    document.querySelectorAll("[data-scholar-metric]").forEach((el) => {
      const key = el.getAttribute("data-scholar-metric");
      const val = data[key];
      if (typeof val === "number") animateCount(el, val);
    });

    const updatedText = formatUpdated(data.updated);
    const updatedEl = document.getElementById("scholar-updated");
    if (updatedEl) updatedEl.textContent = updatedText;

    const footerMeta = document.getElementById("scholar-footer-meta");
    if (footerMeta) {
      footerMeta.hidden = false;
      footerMeta.innerHTML = `${updatedText} · <a href="https://scholar.google.com/citations?user=${encodeURIComponent(
        data.scholar_id || "cuiFGOAAAAAJ"
      )}" target="_blank" rel="noopener">Google Scholar</a>`;
    }

    const spark = document.querySelector(".hero-scholar-spark");
    renderSparkline(spark, data.year_graph);

    document.querySelectorAll(".pub-card").forEach((card) => {
      const cites = findPaperCitations(card, data.papers);
      if (cites === null || cites <= 0) return;
      const links = card.querySelector(".pub-links");
      if (!links || card.querySelector(".pub-cited")) return;
      const span = document.createElement("span");
      span.className = "pub-cited";
      span.innerHTML = `Cited by&nbsp;<strong>${cites}</strong>`;
      links.appendChild(span);
    });
  };

  const loadScholarMetrics = async () => {
    try {
      const res = await fetch(SCHOLAR_JSON_URL, { cache: "default" });
      if (!res.ok) return;
      const data = await res.json();
      applyScholarData(data);
    } catch {
      /* keep placeholders */
    }
  };

  loadScholarMetrics();

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
      if (
        sel === ".feature-tile" ||
        sel === ".pub-card" ||
        sel === ".news-list li" ||
        sel === ".about-facts .fact"
      ) {
        el.classList.add(`reveal-delay-${(i % 4) + 1}`);
      }
      revealEls.push(el);
    });
  });

  if (reduceMotion) {
    revealEls.forEach((el) => el.classList.add("in-view"));
    return;
  }

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

  if (portrait && hero) {
    window.addEventListener("scroll", onScrollParallax, { passive: true });
    updateParallax();
  }
})();
