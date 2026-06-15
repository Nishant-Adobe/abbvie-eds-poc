# Find-Relief Per-Block Size & Spacing Parity Plan (Post Font-Family Pass)

## Status / Context
The font-family critique across all 3 find-relief pages (index, how-to-take-linzess, talk-to-a-doctor) is **complete**. Every heading resolves to its intended family (Bebas Neue display, Lato eyebrow/body, BasicCommercialLT legal), zero flags. One defect was found and fixed:
- **Safety-bar expanded H4** ("Before you take LINZESS…") was Lato 700; aligned to legal font (BasicCommercialLT-Black 400, purple) to match the identical in-flow ISI H4. Edited both `blocks/safety-bar/linzess/safety-bar.css` and `_safety-bar.css`. Verified both H4s now match. Shared fix → applies to all 3 pages.

**Two files changed, uncommitted.** This next phase moves from font-family (done) to per-block **size / spacing / alignment** parity vs live, starting with the talk-to-doctor image-text block.

## Decisions needed before execution
Two open questions (commit timing + first block) are being collected via AskUserQuestion. The artifact below assumes the broader critique continues; it will be finalized once answers return.

## Constraints
- Live linzess.com renders degraded in this environment → cannot read live computed values. Per-block live screenshots/exact values must come from the user.
- Brand CSS only (`styles/linzess/*`, `blocks/*/linzess/*`); keep served CSS + `_partial.css` in sync. No base-block/JS edits without STOP-and-ask. Token edits affect all pages → ASK first.
- Verbatim regulatory copy; style-only changes to ISI/safety/job-code.
- No HTML edits in content dir; no commit/push without explicit confirmation.
- Don't regress the already-matched tabs control, white instructions card, or dosing-panel seam.

## Verified baselines on hand (talk-to-doctor image-text, current build)
- Desktop 1440: grid `418px / 532px`, gap 48; H3 Bebas 40/lh36 purple center mb24; eyebrow Lato 12/800; lead 16px `#4d4d4f`; purple list panel radius 16, li headings 24/700 white, li mb40, marker 24px.
- Mobile 390: single-column stack (image top, list below), gap 24; H3 32/lh30; lead 14; li headings 18; panel padding `40 40 0`.

## Checklist
- [x] Pull authoritative font families from branch (`fonts.css` + `tokens.css`).
- [x] Inventory all 3 pages; font-family audit @ viewports (0 flags).
- [x] Fix safety-bar H4 legal-font mismatch (both CSS files); verify parity.
- [ ] Resolve open decisions (commit-now-vs-later; first block to size-critique) via AskUserQuestion.
- [ ] Get live reference (screenshot/exact values) for the chosen first block.
- [ ] Delta the block @ 390/768/1440: size, line-height, margins/gaps, alignment, column split, panel radius/padding.
- [ ] Apply lowest-specificity fix; regression-check white card / tabs / dosing seam / sibling pages after each.
- [ ] Repeat for remaining index blocks: hero+section-nav, dosing cards-grid, savings tout, bottom-nav, ISI body spacing.
- [ ] Repeat for how-to-take-linzess and talk-to-a-doctor unique blocks.
- [ ] Report before/after per block per viewport.
- [ ] Commit per user instruction (explicit confirmation required).

## Notes
- **Execution requires Execute mode.** Reads/measurements done so far are read-only; the safety-bar edit was made earlier while in execute mode.
- Bebas Neue is weight-400-only — ignore `font-weight` on Bebas headings when matching live.
- Size/spacing deltas can't be invented without live reference; each block is gated on user-supplied values.
