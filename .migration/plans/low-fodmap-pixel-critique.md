# Low FODMAP Diet — Mobile & Tablet Pixel-Match Plan

## Goal
Critique and pixel-match every block on `/linzess/starting-linzess/wellness-tips/your-map-to-a-low-fodmap-diet` against the live page **specifically at the tablet (768px) and mobile (390px) viewports**, aiming for a 100% responsive match. Desktop is already tuned this session; this pass focuses on the two smaller breakpoints. Verify each candidate difference by **direct measurement** (getComputedStyle / getBoundingClientRect) before changing anything — reject false positives. All fixes are CSS, scoped to this page's section classes so no sibling page regresses.

## Why this pass
Prior passes locked desktop parity (icon baseline, overlay anchors, periwinkle arc, 20px title gap, 332/387px columns). Responsive behavior at tablet/mobile was only spot-checked. This pass measures live's exact breakpoint behavior and matches it.

## Blocks to critique at tablet (768) + mobile (390)
1. **Hero** (`hero-container`) — H1 size/line-height/wrap at each breakpoint, photo crop, arc height (live keeps shallow arc < desktop).
2. **Breaking Down FODMAP** (`fodmap-categories-section`) — does the 4-icon grid stay 4-up, go 2×2, or stack? Icon cap (live widens to ~203px ≤985px), title/body sizes, the 209px icon-baseline box behavior at narrow widths.
3. **Mapping Out** (`fodmap-map-section`) — at <985px live serves the tall `-m-` infographic with steps stacked single-file; my build uses the `-d-` image + text-below fallback. Confirm/seek the closest match (image swap vs current fallback), band arc height, spacing.
4. **Sources** footnote — size/alignment/wrapping at small widths.
5. **More Like This** (`more-like-this-section`) — 3 cards: stack to 1-col? card width, gaps, image ratio.
6. **CTA cards** (`cta-cards-section`) — split→stacked, pill button sizing, divider behavior.
7. **Inline ISI** (`isi`) — heading/body sizes at mobile, padding, wrapping.
8. **Floating safety bar** — collapsed strip height, Expand toggle, abbreviated text at mobile width.
9. *(Header/footer shared fragments — excluded per prior direction.)*

## Properties to measure per block (at 768 and 390)
Grid column count + template, gaps, container max-width / side padding, heading & body font-size/line-height, image dimensions + which `<picture>` source is active, band background + arc height, section vertical padding, card stacking order, button/link sizing, and any overflow / horizontal-scroll.

## Approach (Execute mode)
- For each block at 768 then 390: measure live computed values, measure migrated, build a verified delta list (no false positives).
- Apply only genuine deltas in `styles/linzess/styles.css` inside `@media` blocks, scoped under each block's section class (`hero-container`, `fodmap-categories-section`, `fodmap-map-section`, `more-like-this-section`, `cta-cards-section`, `isi`). Reuse existing brand breakpoints/tokens; never edit shared block CSS or sibling-page rules.
- Preserve all desktop work and the existing `<985px` map fallback / `:has(ol)` footnote scoping.
- CSS-only expected. The one possible content/import change: if matching the Mapping Out section at mobile requires the tall `-m-` infographic `<source>` (not currently authored), flag it and get approval before touching the importer + re-import.

## Risks / notes
- **False positives:** verify every finding by measurement before editing; the comparator agent has misreported this session.
- **Map section at mobile:** live's `-m-` image is a tall vertical path (558×4705) with pins stacked single-file and text overlaid per pin; my current mobile uses the wide `-d-` image with text stacked below. A true match may need authoring the `-m-` `<source>` (content change) — decision point, flagged.
- **Shared `:is(...)-section` media rules:** scope every tablet/mobile override with the dedicated page class so recipes/pantry/game-plan/food-swaps don't regress at those breakpoints.
- **No horizontal scroll:** full-bleed bands + arcs must not introduce overflow at 390/768.
- Pixel parity bounded by font rendering/anti-aliasing; match to computed values.

## Validation
- Per block at 768 and 390: localhost computed values match live; grids stack as live does; 0 broken images; no horizontal scroll; ISI/job code verbatim; safety bar functions.
- Desktop (1280) regression: previously-matched values unchanged.
- `npm run lint:css` clean except the 3 known safety-bar errors; md2jcr unaffected (unless the flagged `-m-` map content change is approved).
- Regression: the 4 sibling wellness-tips pages render 200 at all three viewports, unchanged.
- Report a per-block × per-breakpoint scorecard; hold for explicit approval before any commit/push.

> Execution requires **Execute mode** — this plan makes no file changes yet. Expected output is scoped `@media` CSS in `styles/linzess/styles.css` (plus a flagged decision on the mobile map image).

## Checklist
- [ ] Capture live tablet (768) + mobile (390) computed values for all 8 blocks (grids, fonts, images, arcs, padding, active `<picture>` source)
- [ ] Capture migrated tablet + mobile computed values for the same; build verified delta list (no false positives)
- [ ] Hero: match H1 size/line-height/wrap, photo crop, arc height at 768 + 390
- [ ] Breaking Down FODMAP: match grid stacking (4-up vs 2×2 vs 1-col), icon cap (~203px ≤985px), title/body sizes, baseline box at small widths
- [ ] Mapping Out: match band arc + spacing; decide mobile image approach (keep `-d-` fallback vs author `-m-` source) — flag content change for approval if needed
- [ ] Sources footnote: size/alignment/wrapping at 768 + 390
- [ ] More Like This: match card stacking, width, gaps, image ratio at both breakpoints
- [ ] CTA cards: match split→stacked, pill button sizing, divider at both breakpoints
- [ ] Inline ISI: match heading/body sizes, padding, wrapping at mobile
- [ ] Floating safety bar: match collapsed strip + Expand toggle + abbreviated text at mobile
- [ ] Apply only genuine deltas as scoped `@media` rules; keep desktop + prior work intact; no horizontal scroll
- [ ] `npm run lint:css` clean (only 3 pre-existing safety-bar errors); md2jcr unaffected (unless approved `-m-` change)
- [ ] Desktop regression + 4 sibling pages render 200 at all viewports, unchanged
- [ ] Report per-block × per-breakpoint scorecard; hold for explicit approval before any commit/push
