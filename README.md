# 0xVOID — Crypto Portfolio

Premium degen-zine portfolio. Dark, brutalist, sticker-style — NOT generic AI gradient.

## Run locally
Option 1 — just double-click `index.html` (works, but smooth-scroll CDN needs internet).

Option 2 — proper local server (recommended):
```powershell
cd "C:\Users\Admin\Desktop\crypto-portfolio"
python -m http.server 8080
# open http://localhost:8080
```

## Edit content (no code needed)
1. Open `admin.html` in browser
2. Change name, Telegram/X links, projects, skills
3. SAVE → open `index.html` to see live

Data is stored in `localStorage` key `degen_portfolio_v1`.
To make permanent / deploy: EXPORT JSON from admin → replace object in `content.js`.

## Deploy free (1-click)
- **Netlify:** drag this folder onto https://app.netlify.com/drop
- **Vercel:** `npx vercel` inside folder
- **GitHub Pages:** push folder, enable Pages

## Files
- `index.html` — site structure
- `styles.css` — all styling (acid lime #d7ff2e + orange + cream on near-black)
- `content.js` — ALL text/projects/skills (edit this or use admin)
- `app.js` — rendering + GSAP ScrollTrigger animations, Lenis smooth scroll, counters, tilt, marquee
- `admin.html` — visual CMS

## Replace placeholders
- Telegram/X: admin → Profile → paste `https://t.me/yourhandle`, `https://x.com/yourhandle`
- Projects: admin → JSON → `projects[]` (name, role, desc, metrics, tags)
- Art wall: swap `.art-tile` divs for `<img src="your1.png">` later — same grid works
- Name: alias + realName in admin

Built to animate on EVERY scroll: hero intro, dossier terminal typing, counters, skill bars, horizontal raid cards, timeline, art pop, vouches slider, big CTA.
