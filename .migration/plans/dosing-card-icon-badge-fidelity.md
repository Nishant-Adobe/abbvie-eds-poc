# Dosing Card Icon Badge — Match Live Crispness/Appearance (425px)

## Goal
Make the find-relief dosing card icon badge (`.grid-card .card-grid-item-line-1` → `picture/img`) render like the live site at 425px. In the side-by-side screenshots the EDS badge looks **softer / lower-contrast / slightly oversized** versus live's **crisp, vivid light-purple circle with a sharp blue icon**. Identify and fix the real cause (most likely the EDS `<picture>` serving a **rasterized WebP of the SVG** instead of the crisp vector, and/or a size/spacing delta) so the badge matches live.

## Important caveats (read first)
- The pasted "live DOM" is the **`section-navigation` (JUMP TO) block**, not the dosing card — treat it as an accidental paste. The **screenshots** are the reference of record for the card.
- Prior task already verified badge geometry: 96px icon, badge seated 16px below card top, centered stack, heading 18px, body 14px, gap 50px. So layout is matched — this pass is about **icon rendering fidelity** (sharpness/color/size), not re-doing layout.
- Do **not** re-introduce a negative-offset "overlap" (confirmed last round that live keeps the badge inside the card).

## Suspected root cause (verify in Step 0 — do not assume)
- EDS `<img>` `currentSrc` resolves to `…media_*.svg?format=webply` (an SVG rasterized to WebP by the EDS pipeline) → blurry/soft badge. Live serves the raw `.svg` → crisp. Likely fix: prefer the SVG `<source>` (or the raster delta is just perceptual).
- Possible secondary deltas: rendered icon px vs live 96px; badge color/opacity; spacing between badge and heading.

## Verify-then-fix approach (Step 0 hard gate)
1. Capture EDS at 425px: the badge `img.currentSrc` (is it `.svg` or `format=webply`?), natural vs rendered size, computed `image-rendering`, badge bg/opacity, and a zoomed screenshot of one badge.
2. Capture live at 425px: same — `img` src (raw SVG), rendered size, badge color.
3. Build the delta table; tag the real diff (rasterization/sharpness vs size vs color vs spacing). Fix only what differs.
4. If rasterization: make the `.find-relief-dosing` icon use the crisp SVG (CSS can't swap `<picture>` source, so options: confirm whether the served `?format=webply` of an SVG is actually blurry at 96px; if so, the fix may belong in how the image is referenced — flag if it requires a JS/parser change rather than CSS, since the plan scope is CSS-only).
5. Re-verify at 425 + 390 + 768; desktop 1440 must stay icon-left, unchanged.

## Checklist
- [ ] Step 0: capture EDS badge at 425 — `img.currentSrc` (svg vs webply), naturalWidth, rendered px, `image-rendering`, badge bg/opacity + zoomed screenshot
- [ ] Step 0: capture LIVE badge at 425 — img src, rendered px, badge color + zoomed screenshot
- [ ] Build delta table; identify the true diff (sharpness/raster, size, color, or spacing)
- [ ] If size/color/spacing CSS delta: fix in `styles/linzess/styles.css` `@media (width < 985px)` scoped to `.cards-grid.find-relief-dosing` only
- [ ] If rasterization (blurry WebP-of-SVG): determine if fixable in CSS (e.g., it isn't — `<picture>` source order is markup); if so, STOP and report that it needs a parser/markup change, with recommendation — do not force a wrong CSS hack
- [ ] Re-verify badge at 425 + 390 + 768 vs live; no horizontal overflow
- [ ] Desktop 1440 regression: dosing cards stay icon-left, heading 24px, unchanged
- [ ] Verify both tab panels (Adults + Pediatric) + sibling how-to-take page
- [ ] Lint (note: `styles/linzess/*` is stylelint-ignored as generated — validate via computed styles)

## Risks / notes
- If the only difference is SVG-rasterized-to-WebP blur, that is **not CSS-fixable** (it's the `<picture>`/`<source>` order produced by the import pipeline). In that case the correct outcome is to report it and recommend the markup/parser fix, not to hack CSS — flag rather than guess (lesson from the prior "overlap" misread).
- Scope strictly to `.cards-grid.find-relief-dosing` within `@media (width < 985px)`; desktop and other cards-grid blocks untouched.
- Icon SVG carries its own circular `#D9D7F9` badge — control via the icon, no second CSS circle.
- `styles/linzess/styles.css` served directly (no real `_` partial); stylelint-ignored — validate via computed styles. CSS-only changes; going live needs commit + push to the branch (no content re-publish). No `.plain.html` change.

---
*Execution requires Execute mode. This plan diagnoses the dosing icon-badge appearance gap vs the live 425px screenshots and fixes only the measured delta in `styles/linzess/styles.css`; if the gap is SVG→WebP rasterization it will be reported as a markup/parser fix rather than forced in CSS.*
