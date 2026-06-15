I'll inspect how the savings-tout block stacks at mobile before drafting the plan.The base block is already mobile-first single-column (`grid-template-columns: 1fr`), with the 2-col layout gated to ≥744px. The user's screenshot shows the intended mobile result (image top, text bottom) — which this CSS appears to already produce. Let me verify the DOM source order so I know whether the image column actually renders first in the stack.I need to see how the image-text block JS arranges these rows into image-col vs content-col, and confirm whether at mobile the image actually ends up on top. Let me check the image-text JS.# Find-Relief Savings Tout — Mobile Stack (Image Top, Text Bottom)

## Goal
Ensure the `image-text find-relief-savings-tout` block stacks **image on top, text below** at the mobile viewport (≤599px / 425px), matching the live screenshot. Scope: the selected `.find-relief-savings-tout` block and its brand CSS/JS only.

## Code review finding — likely already correct (verify first)
Reading the block code, the desired mobile layout appears **already implemented**:

- **Base CSS** (`styles/linzess/styles.css:2082-2090`) is mobile-first single-column: `display: grid; grid-template-columns: 1fr;`. The 2-column layout is gated to **≥744px** (`:2195 grid-template-columns: minmax(0,44%) 1fr`). So below 744px the two columns stack.
- **DOM order** (`image-text.js:168-175`): this block is **not** `image-text-reverse`, so JS appends `image-col` **first**, then `content-col`. Stacked single-column → image renders on top, text below.
- The selected element's inner HTML confirms the image column (`<picture>`) is the first child.

So at 425px the block *should* already show image-top / text-bottom. This mirrors several recent cases where the reported issue was already satisfied — so the **first action is to verify**, not to blindly edit.

## What could still be wrong (the real candidates to check)
If the live preview doesn't match the screenshot, the cause is likely one of:
1. **Image column has zero/low height at mobile** — `img { object-fit: cover; height: 100% }` with no explicit mobile height could collapse the picture when the grid row has no defined height, so the image looks missing/clipped.
2. **2-col still active at 425px** — an unexpected earlier breakpoint or a stale cached stylesheet leaving columns side-by-side (text squished beside image).
3. **Image overflow/letterbox** — `object-fit: cover` on the 880×599 banner could crop the "90 DAYS FOR $30" art at mobile width instead of showing it whole (live shows the full banner on a light-purple field).

## Methodology
1. Render at 425px (and 390px) and measure: grid `grid-template-columns`, the image-col vs content-col `getBoundingClientRect().top` (image top must be < content top), image rendered height, and whether the banner art is fully visible (not cover-cropped).
2. If image-top/text-bottom is already true and the banner shows whole → **report as already-matching, make no edit** (per the don't-edit-when-correct rule).
3. If a real delta exists → apply the **lowest-specificity brand-CSS fix** scoped to `.find-relief-savings-tout`, mobile-only (`@media (max-width: 743px)` or the existing mobile-first base), e.g. set the image-col to natural aspect (`object-fit: contain` / `height: auto`) so the full banner shows on top.

## Constraints
- No HTML/content edit to `.plain.html`; brand CSS only (`styles/linzess/styles.css`, lint-exempt) — JS only if the stack order is genuinely wrong (escalate first).
- Don't disturb the ≥744px 2-column desktop/tablet layout.
- Don't fabricate a fix if measurement shows it already matches.

## Checklist
- [ ] Render the index page at **425px** and **390px**; measure the savings-tout `grid-template-columns` and confirm it's single-column (`1fr`) at mobile.
- [ ] Confirm **image-col top < content-col top** (image stacked above text) and capture both bounding rects.
- [ ] Check the banner image renders at **full natural aspect** (not zero-height, not `cover`-cropped) on the light-purple field, matching the screenshot.
- [ ] **If already correct:** report "already matches — no change" and stop (no edit).
- [ ] **If a delta exists:** apply a scoped mobile-only brand-CSS fix on `.find-relief-savings-tout` (image-col height/object-fit or breakpoint correction) so image sits on top showing the whole banner, text below.
- [ ] Re-verify at 425px/390px: image top, full banner, text + "Sign Up Now" CTA below.
- [ ] Regression: desktop **1440px** still shows the 2-column (image-left / text-right) layout; tablet **768px** unchanged; how-to-take page savings tout (shares this CSS) unaffected.
- [ ] Report measured before/after (grid columns, image/content tops, image height) per viewport.

## Notes
- **Execution requires Execute mode.** This artifact is the plan only.
- Strong prior expectation from code review: the block already stacks image-top/text-bottom at mobile. Execution will **verify before editing**; any change will be a single scoped mobile-only brand-CSS rule, no HTML/JS/token/base-block edits.
