I'll attempt a clean reload of the live reference, since pixel-perfect matching requires trustworthy live values.The live LINZESS stylesheet is reproducibly 404ing on every load, so the rendered live page can't serve as a pixel reference right now. To do true pixel matching I need a trustworthy source of the live design values.# Find-Relief Dosing Cards — Pixel-Perfect Mobile Match Plan (390px)

## Goal
Match the `cards-grid.find-relief-dosing` block **pixel-for-pixel** at the mobile viewport (≤390px) to the live linzess.com `/find-relief` dosing cards. **Confirmed design intent (locked):** light off-white rounded card, circular pill icon seated *inside* the card's top padding.

## ⚠️ Blocker — live reference unavailable, screenshot required
Pixel matching requires trustworthy target values. On every load, linzess.com's primary design stylesheet **404s** (`/content/dam/linzess/css/preview3/...`) and the AbbVie framework JS fails to decrypt, so the live page renders **unstyled** in this environment. The surface, border-radius, icon offset, and exact spacing therefore **cannot be read from the live DOM**.

**You chose to provide a screenshot.** I'll measure the pixel-accurate target (spacing, colors, sizes, icon offset, card padding, inter-paragraph rhythm) from your mobile screenshot of the live dosing cards and align the local preview to it. **This plan cannot proceed to execution until that screenshot is supplied.**

## What's already trusted (survived the degraded live load + prior approval)
| Element | Property | Value | Status |
|---|---|---|---|
| Heading (line-2) | font-size / weight / color / align | `18px` / `700` / `rgb(66,46,131)` / center | ✅ matched |
| Body (line-3) | font-size / weight / color / align | `14px` / `400` / `rgb(77,77,79)` / center | ✅ matched |
| Icon | size / source | `96px` / crisp `icon-pill-blue.svg` | ✅ matched |
| Card surface | background / radius | `#F4F6FB` / `16px` | ✅ locked |
| Icon position | within top padding | inside card | ✅ locked |
| Stack | single-column gap | `50px` | ✅ current |

## To be pixel-verified from your screenshot (currently unknown vs live)
- Icon → heading vertical gap (local currently ~16px)
- Card inner padding (local `16px 16px 24px`)
- Inter-paragraph spacing inside the multi-paragraph "Every Day" body
- Heading → body gap (local 8px)
- Exact card width / horizontal page margins
- Icon top inset from card edge
- Any heading letter-spacing / line-height nuance

## Root-cause taxonomy (anticipated)
All expected fixes are **#3 Custom class + brand global** — brand-scoped CSS in `styles/linzess/styles.css` under the existing `find-relief-dosing` mobile media block. No base-block, token, or JS changes anticipated. (Icon crispness already resolved via prior brand-JS fix.)

## Checklist
- [ ] **BLOCKER:** Receive the live mobile screenshot of the dosing cards from you (design intact).
- [ ] Measure target values from the screenshot: icon offset, card padding, icon→heading gap, heading→body gap, inter-paragraph rhythm, card width, page margins.
- [ ] Capture local EDS computed values at **390px** for the same metrics (baseline already gathered; refresh post-measurement).
- [ ] Build a pixel delta table: screenshot target vs local, one row per metric, px-level.
- [ ] Apply fixes in `styles/linzess/styles.css`, scoped to `.find-relief-dosing` within the existing `@media (width < 985px)` block — one delta at a time, lowest-specificity first.
- [ ] **Do NOT change** locked items (card background, 16px radius, icon size, fonts, colors) unless the screenshot proves a delta.
- [ ] Re-render at **390px**; overlay/compare against the screenshot until each metric is within ±1–2px.
- [ ] **Regression:** re-check **425px**, **360px**, and **desktop 1440px** (icon-left layout must stay intact) against current approved state.
- [ ] **Cross-page:** re-check the sibling **how-to-take** page dosing cards (Adults + Pediatric tabs share this block + CSS).
- [ ] Lint changed CSS; report final per-viewport px-match status.

## Note
This artifact is the plan only. **Execution requires Execute mode**, and is additionally gated on receiving your live screenshot — without it there is no reliable pixel target to match against.
