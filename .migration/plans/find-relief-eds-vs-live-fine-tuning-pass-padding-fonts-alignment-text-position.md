# Find-Relief — EDS vs Live Fine-Tuning Pass (Padding, Fonts, Alignment, Text Position — All Viewports)

## Goal
Compare the published EDS page (`linzess-find-relief--abbvie-eds-poc--nishant-adobe.aem.live/linzess/migration-dinesh/find-relief/`) against live `linzess.com/find-relief` and apply **minor refinements only** — padding, font size/weight/line-height, text alignment, and text positioning — across every block at **all viewports: mobile 390, tablet 768, desktop 1440**. All blocks already exist and structurally match; this is a polish pass, not a layout rebuild.

## ⚠️ Reconcile published vs local first
The just-pushed commit `e6b8e86f` (hero 2-line wrap + card-title 24/18px) may not be deployed to `.aem.live` yet, so the published page likely still shows the **pre-fix** state. Before flagging any delta as new, confirm it still exists in the **current local build** (dev server) at the given viewport — if local is already correct, it's **deploy/publish lag**, not a fix.

## Reference precision note
- Live `linzess.com` renders **unstyled** here (CSS 404s) → can't read live computed px live. Authoritative numbers come from the already-fetched live source CSS (`linzess-global.css` + clientlib) per selector, **including its `@media` breakpoints** (live steps tokens at min-width:900px; note where live's breakpoints differ from EDS's 744/900/985px).
- **10px-root rem trap:** live rem values assume a 16px root; this project uses a 10px root, so `1.125rem`/`1.5rem` must map to explicit px per viewport (caused the 11.25px card-title bug already fixed).
- Brand CSS only (`styles/linzess/*`, `blocks/*/linzess/*`); keep served + `_partial.css` in sync. **Token edits = brand-wide → STOP-and-ask.** Verbatim regulatory copy. Bebas is weight-400-only. No commit/push without explicit confirmation.

## Per-block fine-tuning audit (padding / font / alignment / text position — per viewport)
| # | Block | Verify vs live @ 390 / 768 / 1440 |
|---|---|---|
| 1 | Hero | eyebrow size/letter-spacing, H1 size/lh/left-align + wrap, text-block position, section padding |
| 2 | Section-nav (JUMP TO) | pill padding, label font, seam position; mobile collapsed vs desktop pill |
| 3 | What-To-Talk card | heading + item-heading sizes, body lh, checkmark↔text gap, item left-align, card padding, 2×2→stack |
| 4 | Gut-Check image-text | heading/body, caption position, CTA padding; 2-col→stack breakpoint |
| 5 | Video ×2 | caption-bar padding, title font, transcript-link position |
| 6 | "Why Finding" | heading size, body width/centering, arc spacing |
| 7 | Prescribed cards | title 24/18px, body 16px, padding, badge↔title gap, center-align, 2-up→stack |
| 8 | Sign-up cards | title 24/18px, body lh, CTA + card padding, center-align, 3-up→stack |
| 9 | Tabs | label size, padding, active-pill (prior work — regression only, all viewports) |
| 10 | Dosing cards | heading/body size, badge position, footnote (prior work — regression only) |
| 11 | Savings tout | heading/lh, body, CTA padding, footnote size/align; 2-col→image-top stack |
| 12 | Bottom-nav | heading size, "Learn More" CTA padding, label position on band |
| 13 | ISI / Safety bar | heading hierarchy size, body lh, letter-spacing, left-align (content verbatim) |
| 14 | Footer | column-heading size, link font/lh, legal text size; 6-col→stack |

## Methodology (per block × per viewport — fine-tune loop)
1. Confirm the delta exists in the **current local build** at 390/768/1440 (not just stale on `.aem.live`).
2. Pull the live selector's exact values + responsive overrides from `linzess-global.css`/clientlib.
3. Capture EDS computed values for the same descendant at each viewport; map rem→px against the 10px-root trap.
4. Apply the **smallest** scoped change to `find-relief-*`, mobile-first with explicit breakpoints where live differs by viewport. No structural/layout rebuilds.
5. Re-render at 390 + 768 + 1440; regression-check siblings; confirm no horizontal overflow at mobile/tablet.

## Checklist
- [ ] Reconcile `.aem.live` vs current local build at 390/768/1440; list real-local deltas vs deploy-lag (esp. `e6b8e86f` hero + card titles).
- [ ] Extract live per-selector values + `@media` overrides from `linzess-global.css` + clientlib for all blocks.
- [ ] Capture EDS computed values at 390 + 768 + 1440 per block; flag rem→px mismatches.
- [ ] **Hero** — eyebrow + H1 size/lh/align/wrap + text-block position + padding, per viewport.
- [ ] **Section-nav** — pill padding, label font, seam position; mobile-collapsed vs desktop.
- [ ] **What-To-Talk card** — heading/item/body sizes, checkmark gap, padding, alignment, 2×2→stack.
- [ ] **Gut-Check** — heading/body, caption position, CTA padding, stack breakpoint.
- [ ] **Videos** — caption padding, title font, transcript-link position.
- [ ] **Why Finding** — heading size, body centering/width, arc spacing.
- [ ] **Prescribed cards** — title/body sizes, padding, badge↔title gap, alignment, 2-up→stack.
- [ ] **Sign-up cards** — title/body, CTA + card padding, alignment, 3-up→stack.
- [ ] **Savings tout** — heading/body/CTA/footnote sizes + alignment, 2-col→image-top.
- [ ] **Bottom-nav** — heading size, CTA padding, label position.
- [ ] **ISI / Safety bar** — heading hierarchy + body lh/letter-spacing/align (content untouched).
- [ ] **Footer** — column-heading + link + legal text sizing, 6-col→stack.
- [ ] **Tabs / Dosing** — regression-only confirm at all viewports (prior work).
- [ ] Per block: smallest scoped fix → re-render 390 + 768 + 1440 → regression; no mobile/tablet overflow.
- [ ] Keep served + `_partial.css` in sync for any `blocks/*/linzess/` edit.
- [ ] Cross-page regression: how-to-take-linzess, talk-to-a-doctor (shared blocks), all viewports.
- [ ] Report per-block × per-viewport before/after + files touched; flag deploy-lag-only items and runtime-only values not verifiable.

## Notes
- **Execution requires Execute mode.** This artifact is the plan only.
- Scope is explicitly **minor**: padding, fonts, alignment, text positioning — across **all three viewports**. No structural/layout rebuilds; if a block looks structurally off, re-confirm it isn't deploy lag before treating it as a fix.
- Tablet (768) is an explicit tier here since column-count transitions (cards 2-up/3-up, image-text 2-col→stack) are the most common cross-viewport divergence.
- The header (home icon, utility nav) is a **shared global fragment**, not a find-relief block — out of scope; report rather than edit.
- Precision is bounded by the degraded live render; live source-CSS rule values + the 10px-root rem mapping are the authoritative reference. Exact live DevTools values per block/viewport would tighten matching if supplied.
