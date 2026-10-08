/* v4 — 2 pages (home + archive), image support, native smooth scroll */
(function () {
  const $ = (s, c) => (c || document).querySelector(s);
  const $$ = (s, c) => Array.from((c || document).querySelectorAll(s));
  const esc = s => String(s == null ? "" : s).replace(/[&<>"]/g, m => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[m]));
  function set(id, v) { const el = document.getElementById(id); if (el && v != null && v !== "") el.textContent = v; }

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
    if (w.img) return `<img src="${esc(w.img)}" alt="${esc(w.title)}" loading="lazy" onerror="this.remove()">`;
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
  }
  function closeLB() { if (!lb) return; lb.classList.remove("open"); lb.setAttribute("aria-hidden", "true"); document.body.style.overflow = ""; }
  $$("[data-lb-close]").forEach(el => el.addEventListener("click", closeLB));

  // ---- contact modal ----
  const cm = $("#contactModal");
  function openContact() { if (!cm) return; cm.classList.add("open"); cm.setAttribute("aria-hidden", "false"); document.body.style.overflow = "hidden"; }
  function closeContact() { if (!cm) return; cm.classList.remove("open"); cm.setAttribute("aria-hidden", "true"); document.body.style.overflow = ""; }
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

  // ---- smooth scroll: only same-page #links, never hijack cross-page ----
  function smoothTo(target) {
    const y = target.getBoundingClientRect().top + window.scrollY - 72;
    window.scrollTo({ top: y, behavior: "smooth" });
  }
  $$("[data-scroll]").forEach(a => a.addEventListener("click", e => {
    const href = a.getAttribute("href");
    if (!href || !href.startsWith("#")) return; // let work.html / index.html links navigate normally
    const t = href === "#top" ? $("main") : document.querySelector(href);
    if (!t) return;
    e.preventDefault();
    const m = $("#mobileMenu"); if (m) m.classList.remove("open");
    smoothTo(t);
  }));

  // nav state + mobile
  const nav = $("#nav");
  if (nav) addEventListener("scroll", () => nav.classList.toggle("scrolled", scrollY > 20), { passive: true });
  const mb = $("#menuBtn"); if (mb) mb.onclick = () => $("#mobileMenu").classList.toggle("open");

  // ---- reveal animation (never blocks scroll/click) ----
  if (!window.gsap) { document.body.classList.add("no-anim"); return; }
  try {
    gsap.registerPlugin(ScrollTrigger);
    $$("[data-reveal]").forEach(el => {
      gsap.fromTo(el, { opacity: 0, y: 24 }, {
        opacity: 1, y: 0, duration: .85, ease: "power3.out",
        scrollTrigger: { trigger: el, start: "top 90%", once: true }
      });
    });
    $$(".wcard").forEach((card, i) => {
      gsap.fromTo(card, { opacity: 0, y: 26 }, {
        opacity: 1, y: 0, duration: .65, ease: "power3.out", delay: (i % 3) * .05,
        scrollTrigger: { trigger: card, start: "top 94%", once: true }
      });
    });
  } catch (e) { document.body.classList.add("no-anim"); }
})();
