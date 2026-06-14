I'll investigate how the live site renders these buttons in tablet view versus the EDS page so the plan targets the real visual gap.The live URL returned a 404, so I can't directly compare the live tablet rendering. Let me inspect how the EDS page currently renders these buttons at tablet width to diagnose the actual gap before planning.At 820px (tablet), my CSS stacks the buttons in a column. Let me measure their actual layout to see how they currently render at tablet width.I have the current tablet rendering measured: at 820px the two CTAs stack in a single column, each stretched full-width (748px) with **0 gap**, so they touch. I couldn't load the original linzess.com page (it 404'd), so I can't pixel-compare against it directly. Before finalizing the plan I need to confirm what the correct tablet appearance should be.# Fix Savings-Card CTA Buttons — Tablet Stacking & Spacing

## Goal

Match the savings-card CTA button container to the intended design at tablet width. Per the confirmed decisions:
- **Tablet (768–1023px):** keep the two buttons **stacked vertically**, but shrink each to its content width, **center** them horizontally, and add a **vertical gap** so they no longer touch.
- **Chevron:** leave the `>` in the labels as-is (no content change).
- **Style:** both buttons stay identical solid-purple pills (no primary/secondary split).

This is a **CSS-only** change to the existing structural button rule. No `plain.html` content edits, no JS, no HTML structure changes.

## Current state (verified at 820px viewport)

In `styles/styles.css`, the tablet rule (~line 3628) currently sets the button container to:
```css
@media (width >= 768px) {
  main > .section.white-arc > .default-content-wrapper > p:has(a[href$="/activate"]) {
    gap: 0;
    flex-direction: column;
  }
}
```
Because it's a column flexbox with the default `align-items: stretch`, each pill stretches to the **full container width (748px)** and, with `gap: 0`, the two buttons **touch** with no separation. The base rule (~line 3593) does set `gap: 2.4rem`, but the tablet rule overrides it to `0`.

Mobile (<768px) already shows them centered/full-width acceptably, and desktop (≥1024px, ~line 3637) already switches to a centered side-by-side row with `gap: 2.4rem` and `max-width: 32rem` pills — both of those breakpoints stay untouched.

## Root cause

The `gap: 0` plus default `align-items: stretch` in the tablet media query is what makes the stacked buttons full-width and flush against each other.

## Fix

Update **only** the `@media (width >= 768px)` button-container rule (~line 3628) to:
- `align-items: center` → each pill shrinks to its content width and centers horizontally
- replace `gap: 0` with a vertical gap (e.g. `gap: 1.6rem`) → adds spacing between the stacked buttons
- keep `flex-direction: column`

Nothing else in the button rules changes. The base rule, the pill-link styling (solid purple, padding, radius, chevron text), the desktop row layout, and the earlier generic-button resets all remain as-is.

## Verification

Re-check in the preview at tablet width (~768px and ~820px) that the two pills are content-width, centered, and separated by the gap — and confirm desktop (≥1024px row) and mobile (<768px) are unchanged.

## Checklist

- [ ] Read the current `@media (width >= 768px)` button-container rule in `styles/styles.css` (~line 3628) to confirm exact text before editing
- [ ] In that tablet rule, add `align-items: center` and change `gap: 0` to `gap: 1.6rem` (keep `flex-direction: column`)
- [ ] Confirm the desktop rule (`@media (width >= 1024px)`, ~line 3637) and its `max-width: 32rem` pill rule are left unchanged
- [ ] Confirm the base container rule (~line 3593) and the pill-link rule (~line 3602, including the generic-button resets) are left unchanged
- [ ] Preview at ~768px and ~820px: verify both pills are content-width, centered, and have a visible vertical gap (no longer touching)
- [ ] Preview at ~1024px+: verify buttons still render side-by-side, centered (no regression)
- [ ] Preview at <768px (mobile): verify no regression
- [ ] Run `npx stylelint styles/styles.css` to confirm no lint errors

> Note: This plan only edits `styles/styles.css`. Applying the edit requires switching to Execute mode.
