# Recipe Cards (cards-grid variant) — Deployed Preview Fix & Live Pixel-Match

## Root cause (from your answers)
You're viewing the **aemcoder / deployed preview**, where the recipe block shows **full-width stacked images (not image-left), wrong image proportions, spacing, and typography**. That's because the new `cards-grid-recipe-cards` variant's code — the decoration branch in `blocks/cards-grid/linzess/cards-grid.js`, the model option in `_cards-grid.json` (+ rebuilt `component-*.json`), and the scoped CSS in `styles/linzess/styles.css` — exists **only locally and has not been pushed/deployed**. On the deployed env the variant class has no decoration branch and no CSS, so the raw `grid-card` cells fall back to plain stacked content (image-on-top) — exactly the "not image-left at all" symptom. The other deltas (image size, spacing, typography) are the same missing-CSS fallback.

So the deployed preview cannot match live until the variant code is deployed. That's a **push/deploy action requiring explicit approval** (no git credentials in this environment).

## Secondary: real pixel deltas to reconcile (so it's correct once deployed)
Beyond the deploy gap, the captured live geometry shows deltas my current CSS should match precisely:
- **Image proportion/size:** live recipe thumbnail ≈ **387×199 (landscape ~1.94:1)**, `object-fit: fill`, no radius. Current variant uses a `22.7rem` (227px) image column — needs widening to the live ~387px (or live proportion) so the image isn't under/over-sized.
- **Row gap / vertical alignment:** match live row spacing and the text's vertical centering against the (taller landscape) image.
- **Typography/CTA:** title Lato 24/700 `#422e83` mixed-case; description 16/400 `#4d4d4f`; "Get the recipe" 16/800 purple underline — confirm exact px against live.

## Goal
1. Reconcile the variant's CSS to live computed geometry (image column ~387px, gap, alignment, typography) and harden the decoration so it renders robustly.
2. Surface that the deployed/aemcoder preview only matches **after the changed cards-grid block JS + model + rebuilt component JSON + CSS (and migrated DAM images) are pushed and Code Sync deploys** — approval-gated.

> Scope: the `cards-grid-recipe-cards` variant only (on top of `cards-grid`; no new block, no edits to other variants). Selected element: `.cards-grid.cards-grid-recipe-cards` on the recipes page.

## Approach (Execute mode)

### A. Re-confirm local render + capture exact live geometry
- localhost: verify `.recipe-card-row` is image-left (`grid-template-columns`), images load, title/CTA computed styles. (Last check: 227px/331px rows, Lato 24/700, 800/underline — confirm still good.)
- Live: re-read computed image width/height/ratio, row gap, content vertical-align, title/desc/CTA px to lock target values.

### B. Reconcile variant CSS (`styles/linzess/styles.css`, `.cards-grid.cards-grid-recipe-cards` only)
- Set the image column to the **live width (~387px / `24.2rem`)** (or `minmax`) so the thumbnail proportion matches; keep `object-fit: fill`, radius 0.
- Match row gap, content vertical alignment, and the desktop/mobile breakpoint (image-above-text < 600px).
- Confirm title (Lato 24/700 `#422e83`), description (16/400 `#4d4d4f`), CTA (16/800 purple underline).
- Keep file-level `stylelint-disable`; 0 new stylelint warnings.

### C. Harden decoration (only if needed)
- Ensure `buildLinzessRecipeCardRow` robustly handles the authored 5-cell grid-card (empty link / image / title / desc / CTA) and the picture optimization; no console errors. No changes to other variants.

### D. Regenerate & validate locally
- Re-bundle import script; re-run `run-bulk-import.js` for the recipes URL; confirm `.plain.html` still emits `cards-grid cards-grid-recipe-cards` with the 5-cell rows.
- md2jcr round-trip SUCCESS (importer 1.2.x); no double-encoded entities.
- localhost render matches live (image-left, image proportion, spacing, typography, CTA); 0 broken images; intro "Low FODMAP" link + 5 PDF CTAs resolve.
- `npm run lint:css` clean except the 3 pre-existing safety-bar errors; `npm run lint:js` clean.
- Regression: pantry + reference OTC pages render 200, unchanged.

### E. Deploy gap — surface & gate
- Confirm the changed files needed on the deployed env: `blocks/cards-grid/_cards-grid.json`, `blocks/cards-grid/linzess/cards-grid.js`, `component-models.json`, `component-definition.json`, `styles/linzess/styles.css`, plus the migrated recipe DAM images, plus the content `.plain.html`.
- Report that the aemcoder/deployed preview will only match **after these are committed + pushed and Code Sync deploys** — hold for explicit approval (no push without it).

## Risks / notes
- **Deploy dependency is the primary blocker:** no local code change will alter the aemcoder preview until pushed. localhost is the verification surface.
- **Brand JS deploy:** the variant relies on the linzess `cards-grid.js` decoration running on the deployed env; confirm it's in the push set so the deployed DOM gets the image-left rows (not the raw fallback).
- **Image optimization host-strip:** project-DAM paths already handle this; confirm images load locally and that the DAM assets are included in what gets deployed.
- Pixel parity bounded by font rendering/anti-aliasing across hosts.

## Checklist
- [ ] Re-verify localhost render of `.cards-grid.cards-grid-recipe-cards` (image-left rows, images load, computed title/CTA)
- [ ] Re-capture live computed geometry: image width/height/ratio, row gap, content vertical-align, title/desc/CTA px
- [ ] Reconcile variant CSS: image column to live ~387px proportion (object-fit fill, radius 0), row gap, alignment, mobile stack
- [ ] Confirm typography (title Lato 24/700 #422e83, desc 16/400 #4d4d4f, CTA 16/800 underline) matches live
- [ ] Harden `buildLinzessRecipeCardRow` only if a render/console issue surfaces (no other-variant edits)
- [ ] Re-bundle import script; re-run bulk import for recipes URL; confirm `.plain.html` uses `cards-grid cards-grid-recipe-cards`
- [ ] md2jcr round-trip SUCCESS (importer 1.2.x); no double-encoded entities
- [ ] localhost matches live (image-left, proportion, spacing, typography, CTA); 0 broken images; intro link + 5 PDF CTAs resolve
- [ ] `npm run lint:css` clean (only 3 pre-existing safety-bar errors), 0 new stylelint warnings; `npm run lint:js` clean
- [ ] Regression: pantry + reference OTC pages render 200, unchanged
- [ ] Report deploy-gap diagnosis + the exact file set that must be pushed for the aemcoder preview to match; hold for explicit approval before any commit/push

> **Note:** Local verification, live capture, CSS/JS edits, re-bundle, import, md2jcr, and lint require **Execute mode**. The deployed/aemcoder preview matching live requires a **commit + push + Code Sync deploy**, which is held for your explicit approval. This is the plan only.
