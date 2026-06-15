# Dosing Cards — Match Live Reference Images (Mobile 425px)

## Goal
Make the find-relief dosing cards (`.cards-grid.find-relief-dosing`) on EDS exactly match the two supplied live screenshots of `linzess.com/find-relief#howtotake` at the **425px responsive width**: each card a full-width off-white rounded panel with a **large circular light-purple icon badge centered on top**, a **dark-purple bold centered heading**, and **centered gray body copy** (footnote italic on the first card). This is a refinement/verification pass on the centered-stack layout already implemented in the prior task.

## Reference (from supplied images @ 425px)
- Card: off-white (#f4f6fb), rounded 16px, generous internal padding, comfortable gap between cards.
- **Icon badge:** prominent circular light-purple disc (the blue icon — stomach / glass / calendar / pill — centered inside), sitting on top, horizontally centered, overlapping/above the card body.
- **Heading:** e.g. "On an Empty Stomach", "Once a Day", "With Applesauce or Water, if Necessary" — dark purple (#422e83), bold, centered, large (appears ~24px), can wrap to 2 lines.
- **Body:** centered, gray, comfortable line-height; first card's `‡` footnote centered + italic + smaller.
- Single column, full width of the white instructions panel.

## Verify-then-fix approach (Step 0 hard gate)
1. **Capture both sides at 425px** (the exact reference width) — live `find-relief#howtotake` and EDS `/migration-dinesh/find-relief/` (How to Take tab): badge diameter, icon size, heading font-size/weight/color/align, body font-size/align/line-height, card padding, inter-card gap, footnote style. Screenshot both.
2. Build a per-property delta table; only change properties that actually differ from the reference. Do **not** assume — measure (prior task already set centered stack at `<985px`, 96px icon showing the SVG's own badge, body 14px; this pass confirms heading size, badge prominence, spacing against the 425px reference specifically).
3. Apply the minimal scoped CSS deltas in `styles/linzess/styles.css` under the existing `@media (width < 985px)` block for `.cards-grid.find-relief-dosing` (badge size, heading size/weight, padding/gap, footnote) — match live px exactly.
4. Re-verify at 425 plus 390 (and 768 tablet) against the images; desktop 1440 must stay icon-left (no regression).

## Checklist
- [ ] Step 0: capture LIVE dosing cards at 425px — badge diameter, icon px, heading font-size/weight/color/align, body font-size/align/line-height, card padding, inter-card gap, footnote — + screenshot
- [ ] Step 0: capture current EDS dosing cards at 425px (How to Take tab) — same properties + screenshot
- [ ] Build delta table vs the reference images; tag each diff (badge size / heading type / body type / spacing / footnote)
- [ ] Fix badge: match live circular badge diameter + icon size (centered, light-purple)
- [ ] Fix heading: dark-purple bold centered at the live size (confirm 18 vs 24px from measurement, don't guess)
- [ ] Fix body + footnote: centered, correct size/line-height; first-card `‡` italic + smaller
- [ ] Fix card padding + inter-card gap to match the reference rhythm
- [ ] Re-verify at 425 + 390 + 768 against images; confirm no horizontal overflow
- [ ] Desktop 1440 regression: dosing cards stay icon-left, no badge change
- [ ] Verify both tab panels (Adults + Pediatric) match; sibling how-to-take page unaffected adversely
- [ ] Lint (note: `styles/linzess/*` is stylelint-ignored as generated — validate via computed styles)

## Risks / notes
- Scope strictly to `.cards-grid.find-relief-dosing` within `@media (width < 985px)` so other cards-grid blocks and the desktop icon-left layout are untouched.
- The icon SVG carries its own baked circular `#D9D7F9` badge — size the icon to control badge size; do **not** add a second CSS circle (avoids double-ring).
- `styles/linzess/styles.css` is served directly (no real `_` partial) — edit directly, no rebuild.
- CSS-only; on this xwalk project it needs commit + push to the branch to go live (no content re-publish).
- Match live px from Step 0 at the 425px reference width — do not eyeball.

---
*Execution requires Execute mode. This plan refines the `find-relief-dosing` mobile cards in `styles/linzess/styles.css` to match the supplied 425px live screenshots; no `.plain.html` content change is needed.*
