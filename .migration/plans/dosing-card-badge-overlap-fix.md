# Dosing Card Badge Overlap — Match Live 425px Reference

## Goal
Refine the find-relief dosing cards (`.cards-grid.find-relief-dosing` → `.grid-card`) so the circular icon badge **overlaps the top edge of the off-white card** exactly as the supplied live `linzess.com/find-relief#howtotake` screenshots at 425px show — the badge sits centered with its lower portion inside the card and its upper portion rising above the card's top edge (a "pop-out" medallion), with the heading/body centered below. This is a targeted refinement of the already-centered-stack mobile layout.

## Reference (from supplied images @ 425px)
- Each card = off-white (#f4f6fb) rounded panel; **circular light-purple icon badge straddles the card's top edge** (≈half above / half inside), horizontally centered.
- Clear vertical gap between the badge of one card and the bottom of the previous card.
- Heading (e.g. "Once a Day", "On an Empty Stomach", "With Applesauce or Water, if Necessary") — dark-purple bold centered, ~18px, below the badge.
- Body centered gray; first card `‡` footnote centered, upright, smaller.

## Suspected delta vs current EDS (verify in Step 0)
- Prior task placed the badge **inside** the card (icon as grid row 1 with `margin-bottom`). Live instead has the badge **overlapping above** the card top — likely a **negative top margin / translate on the icon** plus card top padding to seat the heading, and the card needs `overflow: visible` so the badge isn't clipped.
- Confirm: overlap amount (px the badge rises above card top), card top padding, badge centering, inter-card spacing already at 50px.

## Verify-then-fix approach (Step 0 hard gate)
1. **Capture live at 425px**: badge box top position relative to its card's top edge (overlap px), badge diameter, card padding-top, heading offset, inter-card gap. Screenshot.
2. **Capture current EDS at 425px** (How to Take tab): same metrics + screenshot.
3. Delta table; only adjust what differs. Likely change: pull the icon up with a negative top offset so it overlaps the card edge, ensure `.grid-card` (and any clipping ancestor) is `overflow: visible`, and adjust card top padding so the heading sits correctly below the half-inside badge.
4. Re-verify at 425 + 390 + 768; desktop 1440 must stay icon-left, unchanged.

## Checklist
- [ ] Step 0: capture LIVE dosing card at 425px — badge overlap-above-card px, badge diameter, card padding-top, heading position, inter-card gap, `overflow` on card/wrappers — + screenshot
- [ ] Step 0: capture current EDS dosing card at 425px (How to Take tab) — same metrics + screenshot
- [ ] Build delta table; tag diffs (badge overlap / card padding / overflow / spacing)
- [ ] Edit `styles/linzess/styles.css` (`@media (width < 985px)`, scoped to `.cards-grid.find-relief-dosing`): set card/wrappers `overflow: visible`; pull icon badge up (negative top margin/translate) so it straddles the card top by the live amount
- [ ] Adjust card `padding-top` so the heading seats correctly under the half-overlapping badge; keep inter-card gap matching live (≈50px incl. the overlap)
- [ ] Confirm badge stays horizontally centered; icon remains 96px (SVG's own circle, no double-ring)
- [ ] Re-verify at 425 + 390 + 768 against the images; no clipping of the badge; no horizontal overflow
- [ ] Desktop 1440 regression: dosing cards stay icon-left, badge inline, heading 24px — unchanged
- [ ] Verify both tab panels (Adults + Pediatric) + sibling how-to-take page render the overlap correctly
- [ ] Lint (note: `styles/linzess/*` is stylelint-ignored as generated — validate via computed styles)

## Risks / notes
- `overflow: visible` on the card lets the badge pop above, but must not expose other clipped decorations — regression-check the surrounding dosing panel and tab-panel container at mobile.
- Negative-offset badge reduces effective gap to the previous card; re-balance card `margin-top`/gap so the rhythm still matches live (~50px visible).
- Scope strictly to `.cards-grid.find-relief-dosing` within `@media (width < 985px)` — desktop icon-left layout and other cards-grid blocks untouched.
- Icon SVG carries its own circular `#D9D7F9` badge — control size via the icon; do **not** add a second CSS circle.
- `styles/linzess/styles.css` served directly (no real `_` partial) — edit directly, no rebuild; stylelint-ignored, so validate via computed styles.
- CSS-only; on this xwalk project it needs commit + push to the branch to go live (no content re-publish). No `.plain.html` change.

---
*Execution requires Execute mode. This plan refines the `find-relief-dosing` badge to overlap the card top per the supplied 425px live screenshots, in `styles/linzess/styles.css`; no `.plain.html` content change is needed.*
