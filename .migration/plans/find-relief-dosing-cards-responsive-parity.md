# Find-Relief Dosing Cards — Tablet & Mobile Parity Plan

## Goal
Critique and fix the selected dosing cards block (`cards-grid.find-relief-dosing` inside the Instructions tab panel) at **tablet and mobile** widths so it matches the live site: a vertical stack of off-white rounded cards, each with a **blue icon on the left** and **heading + body text on the right** (`icon-image-card-left`), sitting inside the white dosing panel under the tabs.

## Selected element
- **Page:** `content/linzess/migration-dinesh/find-relief/index.plain.html`
- **Selector:** `#tab-panel-1-1 > .section.find-relief-dosing-panel.cards-grid-container > .cards-grid-wrapper:nth-of-type(2) > .cards-grid.cards-grid-cta-card.find-relief-dosing.block`
- **Items:** 4 dosing cards (Every Day / Once a Day / On an Empty Stomach / With Applesauce or Water) — each = icon (`icon-pill/calendar/stomach/glass-blue.svg`) + `heading-2` + body paragraph(s); the first card also has a `‡` footnote.
- **Scope:** CSS-only on the brand rules governing `.find-relief-dosing`. **No `.plain.html` content change** — structure stays intact.

## Live reference (target) — confirm in Step 0
- Each card: **off-white (#f4f6fb) rounded (16px)** panel; **icon left, text right**, vertically centered (`flexbox-items-center`).
- Cards **stacked in a single column** with consistent gap, full width of the dosing panel — on **both tablet and mobile** (live uses `flexbox-column`).
- Icon fixed size, not stretched; heading dark purple; body gray.
- Mobile: heading may wrap; icon stays left-aligned and top/center-aligned; comfortable padding; no overflow.

## Suspected deltas (verify in Step 0, do not assume)
- Card layout may collapse to icon-on-top / center-stacked on mobile instead of staying **icon-left**.
- Icon sizing/alignment, card padding, inter-card gap, or off-white bg / radius may differ at ≤744px.
- Heading/body font sizes may not follow the mobile type scale; possible text overflow or cramped spacing.
- Footnote (`‡`) treatment on the first card.

## Root-cause hypothesis
- **Brand block CSS** for `.cards-grid.find-relief-dosing` (in `styles/linzess/styles.css`) — likely missing or incorrect tablet/mobile rules for the icon-left row layout, card padding, and gap. Fix is scoped CSS in the brand stylesheet (and/or `blocks/cards-grid/linzess/cards-grid.css`).

## Approach (lowest-specificity, mobile-first)
1. **Step 0 dump first (HARD GATE):** capture live + EDS computed styles and screenshots for the dosing cards at **390 / 768** (and 1440 for regression) — card `display/flex-direction/align`, icon size, padding, gap, bg, radius, heading/body font-size. No edit before this.
2. Build a per-property delta table; root-cause-tag each diff (layout / icon / spacing / type).
3. Apply scoped CSS so each card stays **icon-left + text-right, vertically centered**, off-white rounded, full-width stacked, with live padding/gap at tablet and mobile.
4. Match icon dimensions and text sizes to live's mobile values (use the find-relief mobile type scale already in the stylesheet).
5. Confirm no horizontal overflow; footnote and headings render correctly; both tab panels (Adults / Pediatric) match.

## Checklist
- [ ] Step 0: capture LIVE dosing cards computed styles + screenshot at 390 / 768 / 1440 (card display/flex-direction/align-items, icon w/h, padding, gap, bg, radius, heading & body font-size)
- [ ] Step 0: capture current EDS `.find-relief-dosing` cards computed styles + screenshot at the same widths
- [ ] Build delta table and root-cause-tag each diff (layout / icon / spacing / type)
- [ ] Locate governing rules (`.cards-grid.find-relief-dosing` in `styles/linzess/styles.css`; check `blocks/cards-grid/linzess/cards-grid.css` + base `cards-grid.css`)
- [ ] Edit CSS: keep icon-left row layout + vertical centering at tablet & mobile (don't collapse to stacked/centered)
- [ ] Edit CSS: match card padding, inter-card gap, off-white bg, 16px radius, icon size to live
- [ ] Edit CSS: apply correct mobile heading/body font sizes; ensure footnote (‡) styled
- [ ] Verify at 390 & 768 against live; desktop 1440 regression check
- [ ] Verify both tab panels (Adults + Pediatric) render identically; no horizontal overflow
- [ ] Cross-page check: other pages using `find-relief-dosing` / cards-grid unaffected
- [ ] Lint edited CSS (note: `styles/linzess/*` is stylelint-ignored as generated — confirm validity via computed styles)

## Risks / notes
- Shared block: `blocks/cards-grid/linzess/cards-grid.css` affects all cards-grid instances — prefer scoping changes to `.find-relief-dosing`; regression-check other cards-grid blocks if the shared file is touched.
- `styles/linzess/styles.css` is served directly (no real `_` partial) — edit directly, no rebuild; it's stylelint-ignored, so validate via computed styles.
- Live `abbv-*` markup differs from EDS `cards-grid` markup — match the **visual/behavioral outcome only**, do not rename EDS classes.
- CSS-only change; on this xwalk project it needs commit + push to the branch to go live (no content re-publish).
- Match live px values from Step 0 — do not guess padding/gap/icon sizes.

---
*Execution requires Execute mode. This plan covers a tablet/mobile restyle of the `find-relief-dosing` cards in `styles/linzess/styles.css` (and brand cards-grid CSS if needed); no `.plain.html` content change is needed.*
