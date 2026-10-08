/* v5 — Lenis buttery scroll + calm premium motion (native fallback if CDN fails) */
(function () {
  const $ = (s, c) => (c || document).querySelector(s);
  const $$ = (s, c) => Array.from((c || document).querySelectorAll(s));
  const esc = s => String(s == null ? "" : s).replace(/[&<>"]/g, m => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[m]));
  function set(id, v) { const el = document.getElementById(id); if (el && v != null && v !== "") el.textContent = v; }
  let lenis = null; // buttery scroll engine (null = native fallback)
  const RM = window.matchMedia && matchMedia("(prefers-reduced-motion: reduce)").matches;
  let arrFast = false; // true when arriving from the other page: play a snappier intro
  try { arrFast = sessionStorage.getItem("void_nav") === "1"; sessionStorage.removeItem("void_nav"); } catch (e) {}

  function getContent() {
    const base = window.SITE_CONTENT || { profile: {}, works: [], projects: [], about: {} };
    try {
      const raw = localStorage.getItem("degen_portfolio_v1");
      if (!raw) return base;
      const over = JSON.parse(raw);
      const merged = Object.assign({}, base, over);
      if (over.profile) merged.profile = Object.assign({}, base.profile || {}, over.profile);
      if (over.about) merged.about = Object.assign({}, base.about || {}, over.about);
      if (over.works) merged.works = over.works;
      if (over.projects) merged.projects = over.projects;
      return merged;
    } catch (e) { return base; }
  }
  const C = getContent(), P = C.profile || {};
  const isWork = /\/(work)(\.html)?\/?$/.test(location.pathname.toLowerCase());
  document.title = isWork ? ("Highlighted Work — " + (P.alias || "")) : ((P.alias || "Portfolio") + " — Tester, Community, Artist");

  set("brandAlias", P.alias); set("footAlias", P.alias);
  set("helloText", P.hello); set("summaryText", P.summary);
  if (C.about) { set("aboutTitle", C.about.title); set("aboutBody", C.about.body); }
  set("xHandle", P.xHandle || "@yourhandle");
  set("discordHandle", P.discord || "yourhandle");
  set("discordNote", P.discordNote || "");
  const xb = $("#xBtn"); if (xb && P.x) xb.href = P.x;
  const yEl = $("#year"); if (yEl) yEl.textContent = new Date().getFullYear();

  const rr = $("#rolesRow"); if (rr) rr.innerHTML = (P.roles || []).map(r => `<span>${esc(r)}</span>`).join("");
  const ap = $("#aboutPoints"); if (ap) ap.innerHTML = ((C.about && C.about.points) || []).map(p => `<li>${esc(p)}</li>`).join("");
  const tl = $("#toolsList"); if (tl) tl.innerHTML = ((C.about && C.about.tools) || []).map(t => `<span>${esc(t)}</span>`).join("");

  // hero photo: assets/me.jpg style or any URL
  const hp = $("#heroPhoto");
  if (hp) {
    if (P.photo) { hp.src = P.photo; hp.classList.remove("hide"); hp.onerror = () => hp.classList.add("hide"); }
    else hp.classList.add("hide");
  }

  // ---- cards (image-first, gradient fallback) ----
  function visualInner(w) {
    if (w.img) return `<span class="pzoom"><img src="${esc(w.img)}" alt="${esc(w.title)}" loading="lazy" onerror="this.remove()"></span>`;
    return `<span class="letter">${esc(w.letter || (w.title || "X")[0])}</span>`;
  }
  function cardHTML(w) {
    const hasImg = w.img ? " has-img" : "";
    return `<article class="wcard ${w.tall ? "tall" : ""}" data-cat="${esc(w.cat)}" data-id="${esc(w.id)}" tabindex="0">
      <div class="wvisual look-${esc(w.look || "mint")}${hasImg}"><span class="lookbg"></span>
        ${visualInner(w)}
        <span class="cat">${esc(w.cat)}</span><span class="open">View →</span>
      </div>
      <div class="wbody"><h3>${esc(w.title)}</h3><p>${esc(w.note)}</p></div>
    </article>`;
  }
  function bindCards(scope) {
    $$(".wcard", scope).forEach(card => {
      card.addEventListener("click", () => openLB(card.dataset.id));
      card.addEventListener("keydown", e => { if (e.key === "Enter") openLB(card.dataset.id); });
    });
  }

  // page 1: projects worked with (name + X link)
  const plist = $("#projectList");
  if (plist) {
    const projs = C.projects || [];
    const pc = $("#projCount"); if (pc) pc.textContent = projs.length + (projs.length === 1 ? " project" : " projects");
    plist.innerHTML = projs.length ? projs.map(p => `
      <div class="prow">
        ${p.img ? `<img class="plogo" src="${esc(p.img)}" alt="${esc(p.name)} logo" loading="lazy" onerror="this.remove()">` : `<span class="pdot"></span><span class="pinit">${esc((p.name || "?")[0])}</span>`}
        <div><div class="pname">${esc(p.name)}</div>${p.role ? `<div class="prole">${esc(p.role)}</div>` : ""}</div>
        ${p.x ? `<a class="px" href="${esc(p.x)}" target="_blank" rel="noopener">X ↗</a>` : ""}
      </div>`).join("") : `<p style="color:var(--muted)">No projects yet — add them in admin.html → Projects.</p>`;
  }
  // home legacy: featured strip if present (older index)
  const strip = $("#featuredStrip");
  if (strip) {
    const feat = (C.works || []).filter(w => w.featured).concat((C.works || []).filter(w => !w.featured)).slice(0, 6);
    strip.innerHTML = feat.map(cardHTML).join("");
    bindCards(strip);
  }
  // archive: full grid + filters
  const grid = $("#workGrid");
  if (grid) {
    grid.innerHTML = (C.works || []).map(cardHTML).join("");
    bindCards(grid);
    const f = $("#filters");
    if (f) f.addEventListener("click", e => {
      const btn = e.target.closest("button"); if (!btn) return;
      $$("#filters button").forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      const fv = btn.dataset.filter;
      $$(".wcard", grid).forEach(c => {
        const show = fv === "all" || c.dataset.cat === fv;
        if (show) {
          c.classList.remove("hide");
          if (window.gsap) gsap.fromTo(c, { opacity: 0, y: 16, scale: .98 }, { opacity: 1, y: 0, scale: 1, duration: .4, ease: "power2.out" });
        } else c.classList.add("hide");
      });
      if (window.ScrollTrigger) setTimeout(() => ScrollTrigger.refresh(), 120);
    });
  }

  // ---- lightbox ----
  const lb = $("#lightbox");
  function openLB(id) {
    const w = (C.works || []).find(x => String(x.id) === String(id)); if (!w || !lb) return;
    const vis = $("#lbVisual");
    vis.className = "lb-visual look-" + (w.look || "mint");
    vis.innerHTML = w.img
      ? `<img src="${esc(w.img)}" alt="${esc(w.title)}" onerror="this.remove()">`
      : `<span id="lbLetter">${esc(w.letter || (w.title || "X")[0])}</span>`;
    set("lbCat", w.cat); set("lbTitle", w.title); set("lbDesc", w.desc || w.note || "");
    lb.classList.add("open"); lb.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
    if (lenis) lenis.stop();
  }
  function closeLB() { if (!lb) return; lb.classList.remove("open"); lb.setAttribute("aria-hidden", "true"); document.body.style.overflow = ""; if (lenis) lenis.start(); }
  $$("[data-lb-close]").forEach(el => el.addEventListener("click", closeLB));

  // ---- contact modal ----
  const cm = $("#contactModal");
  function openContact() { if (!cm) return; cm.classList.add("open"); cm.setAttribute("aria-hidden", "false"); document.body.style.overflow = "hidden"; if (lenis) lenis.stop(); }
  function closeContact() { if (!cm) return; cm.classList.remove("open"); cm.setAttribute("aria-hidden", "true"); document.body.style.overflow = ""; if (lenis) lenis.start(); }
  $$("[data-contact]").forEach(b => b.addEventListener("click", openContact));
  const co = $("#contactOpen"); if (co) co.addEventListener("click", openContact);
  const com = $("#contactOpenM"); if (com) com.addEventListener("click", () => { const m = $("#mobileMenu"); if (m) m.classList.remove("open"); openContact(); });
  $$("[data-close]").forEach(el => el.addEventListener("click", closeContact));
  document.addEventListener("keydown", e => { if (e.key === "Escape") { closeContact(); closeLB(); } });
  const cp = $("#copyDiscord");
  if (cp) cp.addEventListener("click", async e => {
    const h = ($("#discordHandle") || {}).textContent ? $("#discordHandle").textContent.trim() : "";
    try { await navigator.clipboard.writeText(h); e.target.textContent = "Copied ✓"; }
    catch (err) {
      const ta = document.createElement("textarea"); ta.value = h; document.body.appendChild(ta); ta.select();
      try { document.execCommand("copy"); e.target.textContent = "Copied ✓"; } catch (e2) {}
      ta.remove();
    }
    setTimeout(() => e.target.textContent = "Copy username", 1600);
  });

  // ---- buttery scroll engine (Lenis) with native fallback ----
  function initSmooth() {
    if (RM || !window.Lenis) return null;
    try {
      const l = new Lenis({ lerp: 0.09, smoothWheel: true });
      if (window.gsap && window.ScrollTrigger) {
        l.on("scroll", ScrollTrigger.update);
        gsap.ticker.add((time) => { l.raf(time * 1000); });
        gsap.ticker.lagSmoothing(0);
      } else {
        const raf = (t) => { l.raf(t); requestAnimationFrame(raf); };
        requestAnimationFrame(raf);
      }
      return l;
    } catch (e) { return null; }
  }
  lenis = initSmooth();

  // ---- anchor glide: only same-page #links, never hijack cross-page ----
  function goTo(target) {
    if (lenis) { try { lenis.scrollTo(target, { offset: -72, duration: 1.4 }); return; } catch (e) {} }
    const y = target.getBoundingClientRect().top + window.scrollY - 72;
    window.scrollTo({ top: y, behavior: "smooth" });
  }
  $$("[data-scroll]").forEach(a => a.addEventListener("click", e => {
    const href = a.getAttribute("href");
    if (!href || !href.startsWith("#")) return; // let /work and / links navigate normally
    const t = href === "#top" ? $("main") : document.querySelector(href);
    if (!t) return;
    e.preventDefault();
    const m = $("#mobileMenu"); if (m) m.classList.remove("open");
    goTo(t);
  }));

  // nav state + scroll progress + mobile
  const nav = $("#nav"), bar = $("#progressBar");
  function onScrollPos() {
    if (nav) nav.classList.toggle("scrolled", window.scrollY > 20);
    if (bar) {
      const h = document.documentElement.scrollHeight - window.innerHeight;
      const p = h > 0 ? Math.min(1, Math.max(0, window.scrollY / h)) : 0;
      bar.style.transform = "scaleX(" + p + ")";
    }
  }
  if (lenis) lenis.on("scroll", onScrollPos);
  else addEventListener("scroll", onScrollPos, { passive: true });
  onScrollPos();
  addEventListener("load", () => { onScrollPos(); if (window.ScrollTrigger) ScrollTrigger.refresh(); });
  const mb = $("#menuBtn"); if (mb) mb.onclick = () => $("#mobileMenu").classList.toggle("open");

  // ---- instant-feel page jumps: veil + prefetch + image warming ----
  // The other page + its images load quietly while you browse, so jumping
  // back and forth feels like one smooth app instead of cold reloads.
  const veil = document.getElementById("veil");
  $$('a[href="/"], a[href="/work"]').forEach(a => a.addEventListener("click", e => {
    e.preventDefault();
    const m = $("#mobileMenu"); if (m) m.classList.remove("open");
    const href = a.getAttribute("href");
    try { sessionStorage.setItem("void_nav", "1"); } catch (err) {}
    if (veil) veil.classList.add("leaving");
    setTimeout(() => { location.href = href; }, 260);
  }));
  try {
    const otherPage = isWork ? "/" : "/work";
    const warm = () => {
      try { const l = document.createElement("link"); l.rel = "prefetch"; l.href = otherPage; document.head.appendChild(l); } catch (e) {}
      const imgs = isWork ? (C.projects || []).map(p => p.img) : (C.works || []).map(w => w.img);
      imgs.forEach(src => { if (src && !String(src).startsWith("data:")) { try { const im = new Image(); im.src = src; } catch (e) {} } });
    };
    if ("requestIdleCallback" in window) requestIdleCallback(warm, { timeout: 3000 });
    else setTimeout(warm, 1500);
  } catch (e) {}

  // ---- calm premium motion (never blocks scroll/click) ----
  if (RM || !window.gsap || !window.ScrollTrigger) { document.body.classList.add("no-anim"); return; }
  try {
    gsap.registerPlugin(ScrollTrigger);
    // staged entrance for hero / page head
    const intro = $$(".hero [data-reveal], .page-head [data-reveal]");
    const spd = arrFast ? 0.45 : 1; // internal arrivals play a snappier intro
    if (intro.length) gsap.fromTo(intro, { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: .9 * spd, stagger: .09 * spd, ease: "power3.out", delay: arrFast ? 0 : .1 });
    gsap.fromTo("#nav", { y: -14, opacity: 0 }, { y: 0, opacity: 1, duration: .7 * spd, ease: "power3.out" });
    const hp2 = $("#heroPhoto");
    if (hp2 && !hp2.classList.contains("hide")) gsap.fromTo(hp2, { scale: .94, opacity: 0 }, { scale: 1, opacity: 1, duration: 1.1 * spd, ease: "power3.out", delay: arrFast ? 0 : .25 });
    // projects container stays visible; its rows stagger in below
    const pl = $("#projectList");
    if (pl) gsap.set(pl, { opacity: 1, y: 0 });
    // soft blur-fade reveals everywhere else
    $$("[data-reveal]").forEach(el => {
      if (el.closest(".hero,.page-head") || el.id === "projectList") return;
      gsap.fromTo(el, { opacity: 0, y: 28, filter: "blur(6px)" }, {
        opacity: 1, y: 0, filter: "blur(0px)", duration: .9, ease: "power3.out",
        scrollTrigger: { trigger: el, start: "top 88%", once: true }
      });
    });
    // staggered card + project-row entrances
    const cards = $$(".wcard");
    if (cards.length) {
      gsap.set(cards, { opacity: 0, y: 30 });
      ScrollTrigger.batch(cards, { start: "top 94%", once: true, onEnter: b => gsap.to(b, { opacity: 1, y: 0, duration: .7, stagger: .08, ease: "power3.out", overwrite: true }) });
    }
    const rows = $$(".prow");
    if (rows.length) {
      gsap.set(rows, { opacity: 0, y: 22 });
      ScrollTrigger.batch(rows, { start: "top 94%", once: true, onEnter: b => gsap.to(b, { opacity: 1, y: 0, duration: .6, stagger: .07, ease: "power3.out", overwrite: true }) });
    }
    // gentle parallax drift inside artwork
    $$(".pzoom img").forEach(img => {
      gsap.fromTo(img, { yPercent: -5 }, {
        yPercent: 5, ease: "none",
        scrollTrigger: { trigger: img.closest(".wcard") || img, start: "top bottom", end: "bottom top", scrub: true }
      });
    });
  } catch (e) { document.body.classList.add("no-anim"); }
})();
