# HOW TO EDIT (no code needed)

You now have **2 pages**:
- `index.html` = Page 1 / Home — intro + featured work (6) + about
- `work.html` = Page 2 / Archive — ALL work with filters

## Change text + links (30 sec)
1. Open `admin.html` in browser (double-click it).
2. Section 1: alias, headline, X link, Discord username, photo path.
3. Section 2: about paragraph.
4. Hit **Save** → open `index.html` + `work.html` to preview.

## Upload your art + photo (30 sec per piece)
**Option A — easy preview (this computer only):**
1. In `admin.html` → work piece → **Pick from computer** → Save. Done, you see it instantly.

**Option B — permanent (for hosting / other computers):**
1. Copy your file into `assets/` folder. Example: `assets/meme-1.png`
2. In `admin.html` → Image field type `assets/meme-1.png` → Save.
3. Hit **Download content.js** → replace the `content.js` file in the folder.
4. Your photo: save as `assets/me.jpg` → put `assets/me.jpg` in photo field.

Why two steps? Browsers preview instantly with Option A, but hosting needs real files in `assets/`.

## Choose what shows on home
- In admin, tick **Featured on home** on 6 pieces. Those 6 = horizontal strip on Page 1.
- Everything = Page 2 archive automatically.

## Add / delete work
- Admin → + Add piece / Delete → Save.
- Category must be `art`, `testing`, or `community` (filters depend on it).

## Publish free
1. Admin → **Download content.js** → replace file.
2. Make sure `assets/` has your real images (not just previews).
3. Drag the whole folder onto https://app.netlify.com/drop → you get a link.

## Files
- `content.js` = all text + image paths (the truth)
- `app.js` = gallery + popups + smooth scroll (don't touch)
- `styles.css` = look (don't touch unless you want colors)
- `admin.html` = your editor
- `assets/` = your images
