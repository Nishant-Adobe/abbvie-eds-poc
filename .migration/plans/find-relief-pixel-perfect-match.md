# Find-Relief — Pixel-Perfect Match to Live (Full-Res Screenshots, All Viewports)

## Goal
Achieve a true pixel-perfect (±1px) match between the EDS find-relief page (`linzess-find-relief--abbvie-eds-poc--nishant-adobe.aem.live/linzess/migration-dinesh/find-relief/index`) and live `linzess.com/find-relief` across **all viewports — mobile 390, tablet 768, desktop 1440** — working block-by-block from **full-resolution (100%-zoom) screenshots you provide** as the authoritative reference.

## ⚠️ Two URLs supplied — confirm which renders the EDS reference
You gave the EDS `.aem.live` URL and the live URL. Important: in this environment **both render degraded** — live `linzess.com` 404s its design CSS, and `.aem.live` reflects the **last deployed commit**, which may trail the local fixes (`e6b8e86f`: hero 2-line wrap + card titles 24/18px; `e6b8e86f` already pushed). So:
- I will do real measurement against the **local dev server** (current code) and your **full-res screenshots** (live truth), not the two degraded live renders.
- Any gap seen only on `.aem.live` but already correct locally = **deploy lag**, reported not re-fixed.

## Reference method (confirmed: full-res screenshots per block)
- Per-block **100%-zoom screenshots at each viewport** are the reference of record (50% snapshots and the unstyled live render aren't ±1px reliable).
- For each block: measure exact px off your full-res screenshot, cross-check cached live `linzess-global.css` rule values + `@media` overrides, then match EDS computed values to ±1–2px.
- **Screenshot-gated:** request the screenshot for the block **and viewport** about to be tuned; pause until it arrives — never guess pixel targets.

## Baseline already established this session
At 1440/768/390 the **current local build already matches live source-CSS** for every block measured (hero wrap, card titles 24/18px, body 16/14px, eyebrows 12px/800, content max-width 998px, prescribed 2-up @768, sign-up stacked @768, no overflow). Screenshots will surface the **fine residual gaps** (sub-pixel padding, exact line-heights, letter-spacing, offsets, breakpoint column counts).

## Constraints
- Brand CSS only (`styles/linzess/*`, `blocks/*/linzess/*`); keep served + `_partial.css` in sync. **Token edits = brand-wide → STOP-and-ask.** Verbatim regulatory copy. Bebas is weight-400-only. 10px-root rem trap (map live 16px-root rems → px). No commit/push without explicit confirmation. Header = shared global fragment → out of scope.

## Per-block × per-viewport pixel loop (run at 390, 768, 1440)
1. Receive full-res screenshot for the block at each target viewport.
2. Measure exact px from the screenshot + cross-check live source-CSS rule values + responsive overrides.
3. Capture EDS computed values (local dev server) at the matching viewport.
4. Build a ±1px delta table per viewport; tag each gap (font / line-height / letter-spacing / padding / margin / gap / position / alignment / column-count).
5. Apply the smallest scoped fix to `find-relief-*`, mobile-first with explicit breakpoints where viewports differ.
6. Re-render, overlay vs screenshot until ±1–2px at all three viewports; regression-check siblings + no overflow.

## Checklist
- [ ] Confirm dev server up; re-baseline current local computed values at 390/768/1440 (already near-parity).
- [ ] Clarify EDS reference: measure against **local dev build** (current code); treat `.aem.live`-only gaps as deploy lag.
- [ ] **Receive full-res screenshots per block at 390 / 768 / 1440** (gated; request as each block is reached).
- [ ] **Hero** — eyebrow, H1 size/lh/letter-spacing/position/wrap, image crop, bottom-arc seam, padding @ all 3.
- [ ] **Section-nav (JUMP TO)** — pill size/padding/seam position, label font; mobile-collapsed vs desktop pill.
- [ ] **What-To-Talk card** — card padding, heading/item/body px, checkmark size+gap, item left-align, 2×2→stack.
- [ ] **Gut-Check image-text** — heading/body px, image cut-out offset, caption position, CTA size/padding, 2-col→stack.
- [ ] **Videos ×2** — poster aspect, play-button size, caption-bar padding, transcript-link position @ all 3.
- [ ] **Why Finding** — heading px, body width/centering, orange-arc size/position/spacing @ all 3.
- [ ] **Prescribed cards** — title/body px, card padding, badge size+overlap offset, gap, 2-up→stack.
- [ ] **Sign-up cards** — title/body px, CTA size/padding, card padding/gap, 3-up→stack.
- [ ] **Tabs** — track/pill size, label px, active-pill radius/position (prior work — pixel-confirm @ all 3).
- [ ] **Dosing cards** — badge size/offset, heading/body px, footnote, gap (prior work — pixel-confirm @ all 3).
- [ ] **Savings tout** — banner size, heading/body px, CTA padding, footnote size/align, 2-col→image-top.
- [ ] **Bottom-nav** — band/wave height, heading px, "Learn More" CTA size/padding, label position @ all 3.
- [ ] **ISI / Safety bar** — heading hierarchy px, body line-height/letter-spacing, left-align (content verbatim) @ all 3.
- [ ] **Footer** — column-heading px, link font/line-height, legal text size, 6-col→stack gaps @ all 3.
- [ ] Per block: delta table → scoped fix → overlay-verify ±1px @ 390/768/1440 → regression.
- [ ] Keep served + `_partial.css` in sync for any `blocks/*/linzess/` edit.
- [ ] Cross-page regression: how-to-take-linzess, talk-to-a-doctor (shared blocks), all viewports.
- [ ] Report per-block × per-viewport pixel deltas closed + files touched; flag deploy-lag items + any block blocked on a missing screenshot.

## Notes
- **Execution requires Execute mode.** This artifact is the plan only.
- Scope is **all three viewports** for every block; tablet (768) is explicit because column-count transitions (cards 2-up/3-up, image-text 2-col→stack, footer 6-col→stack) are the most common cross-viewport divergence.
- Both supplied URLs render degraded here, so live truth comes from your **full-res screenshots**; EDS truth comes from the **local dev server** (current code), with `.aem.live` used only to gauge what's deployed.
- Pixel accuracy is bounded by screenshot resolution: 100%-zoom gets ±1–2px; exact sub-pixel values (line-height, letter-spacing) for a block would need its DevTools computed values to fully close.
- Blocks already matched this session are **pixel-confirm/refine only** unless a screenshot shows a real residual gap. No commit/push without explicit confirmation.
