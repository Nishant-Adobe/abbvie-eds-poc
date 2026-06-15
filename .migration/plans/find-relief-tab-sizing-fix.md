I'll inspect the current find-relief tabs CSS to ground the fix before planning.Let me read the base and brand tabs CSS to understand the width/click behavior before planning.# Find-Relief Tabs — Equal-Width Fix (Size Shifts on Click)

## Problem (from the 4 screenshots)
On the migrated page the two instruction tabs **change width depending on which one is active** — the active (deep-purple) tab grows to fit its label and the inactive shrinks, so clicking between "Adults with IBS-C or CIC" and "Pediatric Functional Constipation…" makes the whole control resize/jump.

Live `linzess.com/find-relief` (screenshots 3 & 4) shows the opposite: **each tab is a fixed 50% of the track regardless of which is selected.** The long Pediatric label simply wraps to 2 lines inside its fixed half; the control never resizes on click.

## Root cause
The base block rule `blocks/tabs/tabs.css:28` sets:
```css
.tabs .tabs-list button { flex: 0 0 max-content; }
```
`max-content` = size-to-content, so each tab is as wide as its text. The Pediatric label is much longer than Adults, so whichever tab is active dominates the width. The find-relief override (`styles/linzess/styles.css:2239`) styles padding/font/radius but **never overrides `flex`**, so the content-sizing leaks through.

## Fix (scoped to find-relief-instructions only — no base edit)
Add a `flex` + `min-width` rule in the existing find-relief tabs block in `styles/linzess/styles.css` (~line 2239), so each tab is an equal half and text wraps inside it:
```css
main > .section.find-relief-instructions .tabs .tabs-list button.tabs-tab {
  flex: 1 1 0;          /* equal 50% halves, ignore content width */
  min-width: 0;         /* allow the long label to wrap, not overflow */
  text-align: center;   /* live centers the label (already centered, confirm) */
  white-space: normal;  /* allow 2-line wrap (base sets unset → normal already) */
}
```
This makes both tabs exactly 50% at every viewport; switching active state no longer resizes anything (only bg/weight/inner-radius change, which are already handled at 2247–2259). The existing `max-width:902px` + `overflow:hidden` track and the active inner-edge radius stay as-is.

## Per-viewport expectations to verify after fix (live)
| Viewport | Track | Each tab | Font | Active radius |
|---|---|---|---|---|
| 1440 | ≤902px wide, centered | 50% (~451px) | 16px | inner edge `16px` only |
| 1024 | ~817px | 50% (~408px) | 16px | inner edge |
| 768 | ~689px | 50% (~344px), Pediatric wraps 2 lines | 14px | inner edge |
| 390 | full width | 50% (~155px), both may wrap | 14px | inner edge |
- Active=left ("Adults") → rounds inner-right `0 16 16 0`; active=right ("Pediatric") → rounds inner-left `16 0 0 16`. Outer corners clipped by track `overflow:hidden`.
- Heights of the two tabs must be **equal** even when one wraps and the other doesn't (flex stretch handles this; confirm `align-items`/stretch on `.tabs-list`).

## Constraints
- Brand CSS only (`styles/linzess/styles.css`); **no base `blocks/tabs/tabs.css` edit** (affects all brands).
- No `!important`.
- This is the same selected block from the element context — scope strictly to `main > .section.find-relief-instructions .tabs`.
- Don't regress the white instructions card, the H3 heading, or the dosing-panel seam below.
- No commit without explicit confirmation.

## Checklist
- [ ] Re-read current find-relief tabs rules (`styles/linzess/styles.css` ~2229–2265) to confirm no existing `flex` override.
- [ ] Add `flex: 1 1 0; min-width: 0;` (+ confirm center/ wrap) to the find-relief tabs `button.tabs-tab` rule.
- [ ] Ensure tab heights stay equal when Pediatric wraps (verify `.tabs-list` stretches items; add `align-items: stretch` only if needed).
- [ ] Verify @1440: both tabs 50%, no resize when toggling Adults↔Pediatric; active inner-radius swaps correctly.
- [ ] Verify @768: Pediatric wraps to 2 lines, tabs still 50/50 equal height, font 14px.
- [ ] Verify @390: no horizontal overflow, both halves equal, control doesn't jump on click.
- [ ] Click each tab at every viewport → confirm width is constant (the core bug) and bg/weight/radius swap.
- [ ] Regression: instructions card, H3, dosing seam, and the how-to-take page's identical tabs.
- [ ] Report before/after widths per viewport.

## Notes
- **Execution requires Execute mode.** This artifact is the plan only; the diagnosis above is from read-only inspection of `tabs.css` + the find-relief override.
- The earlier session already matched the tabs' colors/radius/font/height; the one remaining defect is purely the **content-based width** (`flex: 0 0 max-content`) causing the resize-on-click. `flex: 1 1 0` is the minimal correct fix.
- Uncommitted changes already in tree (prior steps): safety-bar H4, Call-card heading, `fonts.css` 2 new faces + 4 font binaries. This tabs fix adds one more scoped rule to `styles/linzess/styles.css`.
