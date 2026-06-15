I'll examine the CSS controlling the white instructions card and its corners before drafting the plan.Let me read the instructions-card and dosing-panel CSS regions to see how the card top/bottom corners are defined.# Find-Relief Dosing Panel — Boxy Card Bottom-Corner Fix

## Goal
Fix the white "Instructions for Adults & Children" container so its **bottom corners are rounded** (matching its rounded top and the live site's single rounded white card). Currently the dosing panel card under the tab bar renders with squared bottom corners → the container looks boxy. Scope: the selected `.section.find-relief-dosing-panel.cards-grid-container` panel and its brand CSS.

## Root cause (from CSS review)
The bottom-corner rounding exists but is **scoped to the wrong DOM shape**:

```
/* styles/linzess/styles.css ~line 2539-2547 */
main > .tabs-panel > .section.cards-grid-container {
  …
  border-radius: 0 0 16px 16px;   /* rounds bottom corners */
}
```

This selector requires the panel to be a **direct child of `main`** (`main > .tabs-panel > …`) — the *hoisted* tab-panel shape seen on the published/how-to-take pages.

But on the **index page** the tabs render **inline**: the selected element's path is `div#tab-panel-1-1 > div.section.…find-relief-dosing-panel.cards-grid-container`, i.e. the panel lives **inside the tabs block** (`#tab-panel-1-1`), not as a direct `main > .tabs-panel`. So the `main > .tabs-panel >` selector **never matches**, the bottom-rounding doesn't apply, and the card stays squared → boxy.

This is the same hoisted-vs-inline tab-panel skew noted previously (dosing tabs differ between local-inline and published-hoisted DOM).

## Fix approach (lowest-specificity, additive — brand CSS only)
Add a bottom-rounding rule that also matches the **inline** panel shape, scoped to the find-relief dosing panel so it can't leak:
- Target `.find-relief-dosing-panel.cards-grid-container` (the panel's own classes, present in both DOM shapes) and apply `border-radius: 0 0 16px 16px`.
- Keep the existing `main > .tabs-panel > .section.cards-grid-container` rule for the hoisted case (don't break published pages).
- Verify the **active** panel is the one that needs rounding; if both adult+pediatric panels exist, only the visible one shows, but rounding both is harmless since they stack identically.

Pairs cleanly with the already-correct rounded **top** of the instructions card (`…instructions … border-radius: 16px 16px 0 0`), so the two halves read as one white container with rounded top + bottom.

## ⚠️ Watch-outs
- **Don't double-round the join:** the instructions card (tabs + heading) must keep squared *bottom* corners and the dosing panel squared *top* corners so they butt together seamlessly; only the panel's **bottom** two corners get the radius.
- **Both DOM shapes:** confirm the fix works on the index (inline `#tab-panel-N`) without regressing how-to-take (hoisted `main > .tabs-panel`).
- No HTML/content edit; brand CSS only (`styles/linzess/styles.css`, lint-exempt).

## Checklist
- [ ] Measure the selected panel's computed `border-radius` on the index page at desktop + mobile to confirm bottom corners are currently `0` (boxy) and capture the exact selector that should match.
- [ ] Confirm the existing `main > .tabs-panel > .section.cards-grid-container` rule does NOT match the inline `#tab-panel-1-1 > .section.find-relief-dosing-panel` shape (explains the miss).
- [ ] Add a scoped bottom-rounding rule in `styles/linzess/styles.css` keyed on `.find-relief-dosing-panel.cards-grid-container` → `border-radius: 0 0 16px 16px`, covering the inline shape without disturbing the hoisted rule.
- [ ] Verify the white card now shows rounded bottom corners on the index page (desktop 1440 + mobile 390/425), with the tab bar/heading top corners still rounded and the mid-join still seamless (squared).
- [ ] Switch to the Pediatric tab and confirm its panel is rounded identically.
- [ ] Regression: how-to-take page dosing panel still rounded (hoisted shape unaffected); off-white band behind the card unchanged; no new gap/overlap at the heading↔panel join.
- [ ] Report before/after computed radius + per-viewport confirmation.

## Notes
- **Execution requires Execute mode.** This artifact is the plan only.
- Expected change: a single additive brand-CSS rule (no base-block, JS, token, or HTML edits).
- Design intent is unambiguous from the screenshot + live pattern (rounded-bottom white card), so no clarification needed — proceeding to fix the bottom corners only.
