I'll examine the spacing between the panel heading and the first dosing card to ground the critique.# Find-Relief Dosing — First-Card Badge Collides With Panel Heading (Mobile Fix)

## Goal
Fix the mobile defect shown in the screenshot: the **first dosing card's circular pill badge overlaps the "Take LINZESS" panel heading**, obscuring the middle of the word ("Tak‑[pill]‑ESS"). Match live, where the heading is fully visible and the badge sits cleanly below it on the first card. Scope: the selected `cards-grid-cta-card find-relief-dosing` block only.

## Root cause (measured at 390px)
The pixel-perfect overlap fix applied earlier pulls every dosing badge up with `margin-top: -110px` so it straddles the card's top edge (correct for cards 2–4, which have a 50px stacking gap above them). But the **first card** sits directly under the "Take LINZESS" panel heading with only the block's `margin-top: 24px` of clearance — and the heading's own `margin-bottom` is `24px`. Measured result:

| Metric | Value |
|---|---|
| "Take LINZESS" heading bottom | y = 4238 |
| First card badge top | y = 4212 |
| **Heading-bottom → badge-top** | **−26px (badge overlaps heading by 26px)** |
| Badge protrusion above card edge | 50px |
| Block `margin-top` | 24px |

The badge protrudes 50px above the card, but there's only ~24px of room between the heading and the card, so the badge punches up into the heading text. Cards 2–4 are fine (50px inter-card gap absorbs the protrusion).

## Root-cause tag
**#3 Custom class + brand global** — brand-scoped spacing in `styles/linzess/styles.css` under the existing `find-relief-dosing` mobile block (`@media (width < 985px)`). No base-block, token, or JS change. No content/HTML change.

## Fix approach (mobile only, ≤985px)
Add enough top clearance above the **first card** so its 50px-protruding badge clears the panel heading. Need ≥50px of gap between heading bottom and card top (vs current ~24px) → add ~50–60px.

Preferred (lowest-risk, first-card-only, no effect on cards 2–4 or desktop):
- Add `margin-top` to the **first** `.card-grid-item` of the dosing block at `<985px` (e.g. `:first-child { margin-top: ~56px }`), so the badge's upper half lands in clear space below the heading.

Alternative considered (rejected): increasing the whole block's `margin-top` also pushes the entire block down unnecessarily and shifts the heading-to-card relationship more than needed; first-child margin is the tighter, more surgical fix.

## ⚠️ Constraint
Live linzess.com renders **degraded** here (design CSS 404s), so I'll match the **intent from the screenshot** (heading fully visible, badge cleanly below it on the first card) and verify the exact clearance against the live mobile screenshot you provided.

## Checklist
- [ ] Re-confirm at 390px: first-card badge top vs "Take LINZESS" heading bottom (baseline −26px overlap).
- [ ] Add a scoped `:first-child` top-margin (~56px) to `.cards-grid.find-relief-dosing .card-grid-item:first-child` inside the existing `@media (width < 985px)` rule in `styles/linzess/styles.css`.
- [ ] Verify badge no longer overlaps the heading (heading-bottom → badge-top ≥ ~6px positive) and the "Take LINZESS" text is fully visible.
- [ ] Confirm cards 2–4 badge overlap (50px straddle) and 50px inter-card gap are **unchanged**.
- [ ] Confirm the Pediatric tab panel's first dosing card gets the same clearance.
- [ ] Regression: 425px and 360px mobile (badge clears heading at all three); desktop 1440px unchanged (icon-left, no first-card margin in ≥985px).
- [ ] Cross-page: how-to-take page dosing block (shares this CSS) — first card clears its heading, no new overlap.
- [ ] Report final per-viewport clearance values.

## Notes
- Execution requires **Execute mode**.
- Change is purely CSS in `styles/linzess/styles.css` (lint-exempt, served directly), scoped to `find-relief-dosing` — no HTML, JS, token, or base-block edits.
- The earlier badge-overlap behavior (straddling the card top) is intentional and stays; this only adds clearance so the first card's badge doesn't collide with the heading above it.
