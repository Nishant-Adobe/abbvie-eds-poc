# Match `more-like-this` Card Text Alignment to Live — All Wellness-Tips Pages

Branch: `linzess-wellness-tips` · Brand: `linzess` · Block: `columns.more-like-this`
Selected element: `main > … .more-like-this-section … > .columns-wrapper > .columns.more-like-this`

> Plan-mode artifact. The actual CSS edit, preview reload, and pixel verification require **Execute mode**.

---

## Goal

Make the `more-like-this` article cards pixel-match the live linzess.com cards across **all viewports** (desktop / tablet / mobile), and apply the fix uniformly so **all five** wellness-tips pages render identically. The block is shared (one `.more-like-this-section` rule set), so a single scoped CSS change covers every page with no sibling-page risk.

---

## What the live screenshots show (5 reference snaps provided)

Confirmed live treatment of the purple card body (`.columns-item` content area):

1. **Title — LEFT-aligned**, not centered. Sits flush at the card's inner-left padding (~28–30px from the card's left edge).
2. **Title color** — dark navy/indigo (brand heading color), **not** the lighter body grey.
3. **Title font** — brand heading family, ~20px desktop, regular weight; wraps to 2 lines on longer titles ("Good for Your Gut—Flavorful Food Swaps") with the second line also left-aligned.
4. **"Read the article" link — LEFT-aligned**, bold, underlined, dark navy, sitting below the title with a clear vertical gap.
5. **Generous vertical space** between the title block and the link (the gap grows when the title is single-line so the link baseline stays consistent across the 3 cards in a row).
6. Image fills the full card width flush to top/sides; purple body has rounded bottom corners; all 3 cards share equal height in a row.

**Primary delta to fix:** migrated build currently has **no `text-align`** on the card title/link, so they inherit the section's centered treatment → they render **centered**. Live is **left-aligned**. Possible secondary deltas: title color (should be dark navy heading color) and title→link vertical gap.

---

## Pages affected (all use `columns more-like-this`)

| # | Page | EDS preview URL |
|---|------|-----------------|
| 1 | Your Map to a Low FODMAP Diet | `…/wellness-tips/your-map-to-a-low-fodmap-diet` |
| 2 | Is Your Pantry FODMAP-Friendly? | `…/wellness-tips/is-your-pantry-fodmap-friendly` |
| 3 | 5 Holiday Low FODMAP Recipes | `…/wellness-tips/5-holiday-low-fodmap-recipes` |
| 4 | Make a Game Plan for IBS-C | `…/wellness-tips/make-a-game-plan-for-ibs-c` |
| 5 | Good for Your Gut—Flavorful Food Swaps | `…/wellness-tips/good-for-your-gut-flavorful-food-swaps` |

Preview host: `https://linzess-wellness-tips--abbvie-eds-poc--nishant-adobe.aem.page` (or local `/content/linzess/…` route).

---

## Current state (`styles/linzess/styles.css`, lines 1811–1892)

- `.columns-item` — `display:flex; flex-direction:column`, purple `--color-brand-primary-lighter` bg, rounded.
- Title rule `…columns-item p:not(:has(picture), :has(a))` (line 1852): sets font/size/color, `padding-top:20px`, `padding:0 16px` — **no `text-align`**, color is `--color-text-heading`.
- Link rules `…columns-item a, a.button` (line 1879): inline, underlined, bold, `--color-text-heading` — **no `text-align`**; `.button-container` margin reset (line 1875).

So the cascade leaves both title and link centered (inherited from section centering), which is the mismatch.

---

## Approach (lowest-specificity, scoped, measure-first)

1. **Measure live first (Execute mode).** Load a live page (page 1 reference) at desktop/tablet/mobile and read on the card title + link: `text-align`, `padding-left`, computed `color`, `font-family/size/weight`, and the title→link vertical gap. Record the title's left-edge offset from the card. Do **not** assume values — the screenshots indicate `left` + dark navy, but confirm exact px/color tokens.
2. **Add `text-align: left`** to the existing shared card-text rule(s) under `.more-like-this-section .columns.more-like-this .columns-item` (title paragraph + `.button-container`/link). No new selectors beyond those already present.
3. If measurement shows a **color** or **gap** delta, adjust the existing title/link rules to the matched token (e.g. correct heading color, title→link margin) — still scoped, still on existing rules.
4. Verify the existing `padding:0 16px` matches live's inner inset; nudge only if measurement proves a difference.
5. **No `.plain.html` change** — alignment/style only; block HTML structure untouched.

---

## Verification (Execute mode)

- Reload all 5 preview URLs (CSS auto-reload) and compare each card's title + link **left-edge, color, and link position** to the matching live snap within ~1px, at **desktop (≥768px)**, **tablet (768px)**, and **mobile (<768px)**.
- Confirm 2-line titles wrap left-aligned (food-swaps card) and the link baseline stays aligned across the 3-card row.
- Confirm no regression to: image flush-fill, equal card heights, purple rounded body, underline link style, section heading centering.
- Confirm sibling sections (cta-cards, how-they-work, food-swaps, what-is-linzess) are untouched (rule scoped to `.more-like-this-section`).

---

## Checklist

- [x] Locate shared `more-like-this` card CSS in `styles/linzess/styles.css`
- [x] Confirm no explicit `text-align` currently set on card title/link
- [x] Confirm one scoped rule set covers all 5 pages
- [x] Review live screenshots → confirm left-aligned title + link, dark navy title, title→link gap
- [ ] *(Execute)* Measure live card `text-align`, color, font, padding-left, title→link gap (desktop/tablet/mobile)
- [ ] *(Execute)* Add `text-align:left` (+ any matched color/gap) to existing card title/link rules, scoped to `.more-like-this-section`
- [ ] *(Execute)* Reload all 5 preview URLs; verify title/link left-edge + color + position vs live snaps (desktop/tablet/mobile)
- [ ] *(Execute)* Verify 2-line title (food-swaps) wraps left-aligned; link baseline consistent across row
- [ ] *(Execute)* Confirm no regression to image fill, card stretch, link style, heading centering
- [ ] *(Execute)* Confirm sibling sections (cta-cards, how-they-work, food-swaps, what-is-linzess) unaffected
- [ ] *(Execute)* Report deltas resolved; hold for explicit "commit and push" before any git action

> Execution (CSS edit, preview reload, pixel measurement, commit) requires **Execute mode**. No file changes have been made in plan mode.
