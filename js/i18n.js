(() => {
  "use strict";

  const LANG_KEY = "lang";
  const DEFAULT_LANG = "en";

  const MESSAGES = {
    en: {
      "meta.title": "Ziqian Mo (莫子谦) — Academic Homepage",
      "meta.description":
        "PhD student at HKUST-GZ. Exploring Embodied AI and Spatial Intelligence — computer vision, vision-language models, cross-view geo-localization.",
      "aria.nav": "Primary",
      "aria.nav.open": "Open menu",
      "aria.nav.close": "Close menu",
      "aria.hero": "Introduction",
      "aria.hero.focus": "Focus areas",
      "aria.hero.scholar": "Google Scholar profile and citation metrics",
      "aria.about.facts": "Quick facts",
      "aria.theme.dark": "Switch to dark mode",
      "aria.theme.light": "Switch to light mode",
      "aria.lang.toZh": "Switch to Chinese",
      "aria.lang.toEn": "Switch to English",
      "nav.about": "About",
      "nav.research": "Research",
      "nav.news": "News",
      "nav.publications": "Publications",
      "nav.honors": "Honors",
      "nav.education": "Education",
      "nav.contact": "Contact",
      "hero.eyebrow": "HKUST-GZ · DSA Thrust",
      "hero.tagline":
        'Exploring <em>Embodied AI</em> and <em>Spatial Intelligence</em>',
      "hero.chip.cv": "Computer Vision",
      "hero.chip.embodied": "Embodied AI",
      "hero.chip.geo": "Cross-View Geo-localization",
      "hero.chip.vlm": "Vision-Language Models",
      "hero.scholar.citations": "Citations",
      "hero.scholar.hindex": "h-index",
      "hero.scholar.i10": "i10-index",
      "hero.scholar.updating": "Updated …",
      "hero.scholar.updatedRecent": "Updated recently",
      "hero.scholar.updatedPrefix": "Updated",
      "hero.cta.email": "Email",
      "about.title": "About",
      "about.lead":
        'Greetings! I’m currently a PhD student in the Data Science and Analytics (DSA) Thrust at the Hong Kong University of Science and Technology (Guangzhou) (HKUST-GZ), supervised by Asst. Prof. <a href="https://sites.google.com/ucsc.edu/jiahengwei" target="_blank" rel="noopener">Jiaheng Wei (魏嘉珩)</a>. I received my master’s degree in Artificial Intelligence from Shenzhen University, where I was supervised by Assoc. Prof. <a href="https://csse.szu.edu.cn/pages/user/index?id=1025" target="_blank" rel="noopener">Meng Xu (徐萌)</a> and conducted research at the <a href="http://szu-hsilab.com/" target="_blank" rel="noopener">Hyperspectral Image Laboratory (HSI Lab)</a>. My research interests include computer vision, embodied AI, vision-language models, and spatial intelligence.',
      "about.fact.role.k": "Role",
      "about.fact.role.v": "PhD Student",
      "about.fact.affiliation.k": "Affiliation",
      "about.fact.advisor.k": "Advisor",
      "about.fact.advisor.v": "Jiaheng Wei",
      "about.fact.focus.k": "Focus",
      "about.fact.focus.v": "Embodied AI · Spatial Intelligence",
      "research.title": "Research Interests",
      "research.kicker":
        "Three directions that shape how agents see and locate themselves in the world.",
      "research.t1.title": "Embodied AI & Egocentric Vision",
      "research.t1.body":
        "Perception and reasoning for agents that see and act in the physical world from a first-person view.",
      "research.t2.title": "Spatial Intelligence & Multimodal Learning",
      "research.t2.body":
        "Vision-language models and multimodal systems that understand space, geometry, and scene structure.",
      "research.t3.title": "Cross-View Geo-localization",
      "research.t3.body":
        "Matching and aligning imagery across viewpoints — ground, aerial, and satellite — for robust localization.",
      "news.title": "News",
      "news.kicker": "Recent acceptances, talks, and competition results.",
      "news.tag.igarssOral": "IGARSS Oral",
      "news.tag.firstPlace": "1st Place",
      "news.n1":
        "<strong>STAR</strong>, our work on spatio-temporal alignment and refinement for cross-view geo-localization, was accepted by <strong>IEEE TGRS</strong>.",
      "news.n2":
        "<strong>S<sup>3</sup>Geo</strong> was accepted by <strong>ACM MM 2026</strong>. It explores structure-semantic synergy for cross-view geo-localization.",
      "news.n3":
        "<strong>ASTMNet</strong>, our work on adaptive spectral token mixing for pansharpening, was accepted by <strong>ICASSP 2026</strong>.",
      "news.n4":
        "<strong>ESFS</strong>, our work on spatial-frequency synergy for multispectral and hyperspectral image fusion, was accepted by <strong>IEEE TGRS</strong>.",
      "news.n5":
        "<strong>SIGN</strong> was accepted for an <strong>oral presentation at IGARSS 2025</strong>, featuring saliency-aware global-local learning for cross-view geo-localization.",
      "news.n6":
        "Our team won <strong>1st place</strong> in the <strong>Hyperspectral Object Tracking Challenge</strong> at the <strong>IEEE GRSS WHISPERS 2024 Competition</strong>.",
      "publications.title": "Publications",
      "publications.kicker":
        "Selected papers across geo-localization, spectral imaging, and multimodal vision.",
      "publications.project": "Project",
      "publications.citedBy": "Cited by",
      "honors.title": "Honors & Awards",
      "honors.h1":
        '<strong>National Scholarship for Graduate Students</strong> <span class="note">Top 2%</span>',
      "honors.h2":
        "First Prize in the Scholarship of Shenzhen University <span class=\"note\">Top 20%</span>",
      "honors.h3":
        "First Prize in the Scholarship of Shenzhen University <span class=\"note\">Top 20%</span>",
      "honors.h4":
        "Second Prize in the Scholarship of Hubei University of Technology <span class=\"note\">Top 6%</span>",
      "honors.h5":
        "Third Prize in the Scholarship of Hubei University of Technology <span class=\"note\">Top 30%</span>",
      "honors.h6":
        "Second Prize in the Scholarship of Hubei University of Technology <span class=\"note\">Top 6%</span>",
      "service.title": "Professional Service",
      "service.body":
        "<strong>Director</strong>, Power Low-Altitude Ecosystem Subcommittee, IEEE PES China Satellite Technical Committee on Power System Communications and Cybersecurity.",
      "education.title": "Education & Experience",
      "education.sub.edu": "Education",
      "education.sub.intern": "Internships",
      "education.phd":
        "PhD student in Data Science and Analytics (DSA), <strong>The Hong Kong University of Science and Technology (Guangzhou)</strong>, Guangzhou, China.",
      "education.master":
        "Master of Science in Artificial Intelligence, <strong>Shenzhen University</strong>, Shenzhen, China.",
      "education.bachelor":
        "Bachelor of Science in Computer Science and Technology, <strong>Hubei University of Technology</strong>, Wuhan, China.",
      "education.intern":
        "Research Assistant, <strong>HKUST-GZ</strong>, China.",
      "contact.title": "Let’s connect.",
      "contact.copy":
        "Open to research discussions on embodied AI, spatial intelligence, and cross-view geo-localization.",
      "footer.copy":
        '© <span id="year">2026</span> Ziqian Mo (莫子谦). Content from <a href="https://ziqianmo.github.io/" target="_blank" rel="noopener">ziqianmo.github.io</a>.',
    },
    zh: {
      "meta.title": "莫子谦 (Ziqian Mo) — 学术主页",
      "meta.description":
        "香港科技大学（广州）数据科学与分析学域博士研究生。研究方向：具身智能与空间智能、计算机视觉、视觉语言模型、跨视角地理定位。",
      "aria.nav": "主导航",
      "aria.nav.open": "打开菜单",
      "aria.nav.close": "关闭菜单",
      "aria.hero": "简介",
      "aria.hero.focus": "研究方向",
      "aria.hero.scholar": "Google Scholar 个人资料与引用指标",
      "aria.about.facts": "简要信息",
      "aria.theme.dark": "切换到深色模式",
      "aria.theme.light": "切换到浅色模式",
      "aria.lang.toZh": "切换到中文",
      "aria.lang.toEn": "切换到英文",
      "nav.about": "关于",
      "nav.research": "研究",
      "nav.news": "动态",
      "nav.publications": "论文",
      "nav.honors": "荣誉",
      "nav.education": "教育",
      "nav.contact": "联系",
      "hero.eyebrow": "香港科技大学（广州）· 数据科学与分析学域",
      "hero.tagline": "探索<em>具身智能</em>与<em>空间智能</em>",
      "hero.chip.cv": "计算机视觉",
      "hero.chip.embodied": "具身智能",
      "hero.chip.geo": "跨视角地理定位",
      "hero.chip.vlm": "视觉语言模型",
      "hero.scholar.citations": "引用",
      "hero.scholar.hindex": "h 指数",
      "hero.scholar.i10": "i10 指数",
      "hero.scholar.updating": "更新于 …",
      "hero.scholar.updatedRecent": "最近更新",
      "hero.scholar.updatedPrefix": "更新于",
      "hero.cta.email": "邮件",
      "about.title": "关于",
      "about.lead":
        '您好！我现任香港科技大学（广州）数据科学与分析学域（DSA）博士研究生，导师为助理教授 <a href="https://sites.google.com/ucsc.edu/jiahengwei" target="_blank" rel="noopener">魏嘉珩 (Jiaheng Wei)</a>。我于深圳大学获得人工智能硕士学位，导师为副教授 <a href="https://csse.szu.edu.cn/pages/user/index?id=1025" target="_blank" rel="noopener">徐萌 (Meng Xu)</a>，并在 <a href="http://szu-hsilab.com/" target="_blank" rel="noopener">高光谱图像实验室（HSI Lab）</a> 开展研究。研究方向包括计算机视觉、具身智能、视觉语言模型与空间智能。',
      "about.fact.role.k": "身份",
      "about.fact.role.v": "博士研究生",
      "about.fact.affiliation.k": "单位",
      "about.fact.advisor.k": "导师",
      "about.fact.advisor.v": "魏嘉珩",
      "about.fact.focus.k": "方向",
      "about.fact.focus.v": "具身智能 · 空间智能",
      "research.title": "研究兴趣",
      "research.kicker": "三个方向，塑造智能体如何观察世界并定位自身。",
      "research.t1.title": "具身智能与第一视角视觉",
      "research.t1.body":
        "面向在物理世界中以第一视角感知与行动的智能体，研究感知与推理能力。",
      "research.t2.title": "空间智能与多模态学习",
      "research.t2.body":
        "研究理解空间、几何与场景结构的视觉语言模型及多模态系统。",
      "research.t3.title": "跨视角地理定位",
      "research.t3.body":
        "在地面、航空与卫星等视角间匹配与对齐影像，实现鲁棒的地理定位。",
      "news.title": "动态",
      "news.kicker": "近期论文录用、报告与竞赛成绩。",
      "news.tag.igarssOral": "IGARSS Oral",
      "news.tag.firstPlace": "第一名",
      "news.n1":
        "我们关于跨视角地理定位时空对齐与精炼的工作 <strong>STAR</strong> 被 <strong>IEEE TGRS</strong> 录用。",
      "news.n2":
        "<strong>S<sup>3</sup>Geo</strong> 被 <strong>ACM MM 2026</strong> 录用，探索结构—语义协同的跨视角地理定位。",
      "news.n3":
        "我们关于全色锐化自适应光谱 token 混合的工作 <strong>ASTMNet</strong> 被 <strong>ICASSP 2026</strong> 录用。",
      "news.n4":
        "我们关于多光谱与高光谱融合空间—频率协同的工作 <strong>ESFS</strong> 被 <strong>IEEE TGRS</strong> 录用。",
      "news.n5":
        "<strong>SIGN</strong> 获 <strong>IGARSS 2025</strong> <strong>口头报告</strong> 录用，提出显著性感知的全局—局部跨视角地理定位学习。",
      "news.n6":
        "我们团队在 <strong>IEEE GRSS WHISPERS 2024</strong> 竞赛的 <strong>高光谱目标跟踪挑战赛</strong> 中获得 <strong>第一名</strong>。",
      "publications.title": "论文",
      "publications.kicker": "跨视角地理定位、光谱成像与多模态视觉的代表性工作。",
      "publications.project": "项目",
      "publications.citedBy": "被引",
      "honors.title": "荣誉与奖项",
      "honors.h1":
        '<strong>研究生国家奖学金</strong> <span class="note">前 2%</span>',
      "honors.h2": "深圳大学奖学金一等奖 <span class=\"note\">前 20%</span>",
      "honors.h3": "深圳大学奖学金一等奖 <span class=\"note\">前 20%</span>",
      "honors.h4": "湖北工业大学奖学金二等奖 <span class=\"note\">前 6%</span>",
      "honors.h5": "湖北工业大学奖学金三等奖 <span class=\"note\">前 30%</span>",
      "honors.h6": "湖北工业大学奖学金二等奖 <span class=\"note\">前 6%</span>",
      "service.title": "学术服务",
      "service.body":
        "<strong>主任</strong>，IEEE PES 中国卫星技术委员会电力系统通信与网络安全专委会低空电力生态子委员会。",
      "education.title": "教育与经历",
      "education.sub.edu": "教育背景",
      "education.sub.intern": "实习经历",
      "education.phd":
        "数据科学与分析学域（DSA）博士研究生，<strong>香港科技大学（广州）</strong>，广州，中国。",
      "education.master":
        "人工智能理学硕士，<strong>深圳大学</strong>，深圳，中国。",
      "education.bachelor":
        "计算机科学与技术学士，<strong>湖北工业大学</strong>，武汉，中国。",
      "education.intern": "研究助理，<strong>香港科技大学（广州）</strong>，中国。",
      "contact.title": "欢迎联系。",
      "contact.copy":
        "欢迎就具身智能、空间智能与跨视角地理定位等方向交流讨论。",
      "footer.copy":
        '© <span id="year">2026</span> 莫子谦 (Ziqian Mo)。内容来自 <a href="https://ziqianmo.github.io/" target="_blank" rel="noopener">ziqianmo.github.io</a>。',
    },
  };

  const getStoredLang = () => {
    try {
      const stored = localStorage.getItem(LANG_KEY);
      if (stored === "zh" || stored === "en") return stored;
    } catch {
      /* private mode */
    }
    return DEFAULT_LANG;
  };

  const setStoredLang = (lang) => {
    try {
      localStorage.setItem(LANG_KEY, lang);
    } catch {
      /* private mode */
    }
  };

  const t = (lang, key) => {
    const table = MESSAGES[lang] || MESSAGES.en;
    return table[key] ?? MESSAGES.en[key] ?? "";
  };

  const applyDocumentLang = (lang) => {
    document.documentElement.lang = lang === "zh" ? "zh-CN" : "en";
    document.documentElement.dataset.lang = lang;
  };

  const applyMessages = (lang) => {
    document.querySelectorAll("[data-i18n]").forEach((el) => {
      const key = el.getAttribute("data-i18n");
      if (!key) return;
      el.textContent = t(lang, key);
    });

    document.querySelectorAll("[data-i18n-html]").forEach((el) => {
      const key = el.getAttribute("data-i18n-html");
      if (!key) return;
      el.innerHTML = t(lang, key);
    });

    document.querySelectorAll("[data-i18n-aria]").forEach((el) => {
      const key = el.getAttribute("data-i18n-aria");
      if (!key) return;
      el.setAttribute("aria-label", t(lang, key));
    });

    const titleEl = document.querySelector("title");
    if (titleEl) titleEl.textContent = t(lang, "meta.title");

    const descEl = document.querySelector('meta[name="description"]');
    if (descEl) descEl.setAttribute("content", t(lang, "meta.description"));

    const langToggle = document.getElementById("lang-toggle");
    if (langToggle) {
      const isZh = lang === "zh";
      langToggle.classList.toggle("is-zh", isZh);
      langToggle.setAttribute("aria-label", t(lang, isZh ? "aria.lang.toEn" : "aria.lang.toZh"));
      langToggle.setAttribute("aria-pressed", isZh ? "true" : "false");
    }

    document.dispatchEvent(new CustomEvent("langchange", { detail: { lang } }));
  };

  let currentLang = getStoredLang();

  const applyLang = (lang) => {
    currentLang = lang === "zh" ? "zh" : "en";
    setStoredLang(currentLang);
    applyDocumentLang(currentLang);
    applyMessages(currentLang);
  };

  const initLangToggle = () => {
    const btn = document.getElementById("lang-toggle");
    if (!btn) return;
    btn.addEventListener("click", () => {
      applyLang(currentLang === "zh" ? "en" : "zh");
    });
  };

  window.siteI18n = {
    getLang: () => currentLang,
    applyLang,
    t: (key) => t(currentLang, key),
    formatUpdated: (iso) => {
      if (!iso) return t(currentLang, "hero.scholar.updatedRecent");
      const d = new Date(iso);
      if (Number.isNaN(d.getTime())) return t(currentLang, "hero.scholar.updatedRecent");
      const locale = currentLang === "zh" ? "zh-CN" : undefined;
      const dateStr = d.toLocaleDateString(locale, {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
      return `${t(currentLang, "hero.scholar.updatedPrefix")} ${dateStr}`;
    },
  };

  applyLang(currentLang);
  initLangToggle();
})();
