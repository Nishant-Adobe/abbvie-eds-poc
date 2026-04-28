# SkyriziHCP Formulary Lookup — ZIP + Button Alignment Fix

## Problem

In the UE preview, the ZIP code input field and "LOOK UP STATUS" button are not aligned on the same horizontal row. The button appears offset/below the input instead of sitting directly beside it at the same vertical level.

### Root Cause

The abbvie brand CSS sets `.formulary-lookup-input-group` to `flex-direction: row` with `align-items: stretch` and `max-width: 600px`. This should work, but:

1. The input and button may have different intrinsic heights (input `42px` via `--formulary-input-height`, button `44px` via `--formulary-submit-height`)
2. `align-items: stretch` forces both to match the tallest element — but the button's padding/border may cause slight offset
3. The fix is to use `align-items: center` to vertically center both items on the same row

### Current Abbvie CSS (`styles/abbvie/blocks/formulary-lookup/formulary-lookup.css`)
```css
.formulary-lookup .formulary-lookup-input-group {
  display: flex;
  flex-direction: row;
  align-items: stretch;
  gap: 8px;
  max-width: 600px;
  margin-inline: auto;
}
```

### Target
Both the ZIP input and the submit button should be on the **exact same horizontal line**, vertically centered, with the input taking the remaining space and the button at fixed width.

## Files to Change

### 1. `styles/abbvie/blocks/formulary-lookup/formulary-lookup.css`
- Change `align-items: stretch` → `align-items: center` on `.formulary-lookup-input-group`
- Ensure both input and button have matching height (`--formulary-input-height: 44px` and `--formulary-submit-height: 44px`)

### 2. `blocks/formulary-lookup/abbvie/formulary-lookup.css` (sync copy)
- Same change to keep in sync

## Checklist

- [ ] **1.1** Update `styles/abbvie/blocks/formulary-lookup/formulary-lookup.css` — change `align-items: stretch` to `align-items: center` on `.formulary-lookup-input-group`
- [ ] **1.2** Ensure input height and button height match (`44px` both) in the abbvie token overrides
- [ ] **1.3** Sync the same change to `blocks/formulary-lookup/abbvie/formulary-lookup.css`
- [ ] **1.4** Preview SkyriziHCP page — verify ZIP input and button are perfectly aligned on the same row
- [ ] **1.5** Commit and push to `formulary-lookup` branch for UE to pick up

---

## Notes
- The base CSS `.formulary-lookup-input-group` already uses `display: flex` with `gap`. The abbvie override adds `flex-direction: row` explicitly and sets `max-width: 600px`.
- After the fix, the layout should match the source screenshot: input on the left taking remaining space, navy pill button on the right, both vertically centered.
- **Execution requires switching to Execute mode.**
