# CTA Block: Fix Remaining Issues

## Problem Analysis

### 1. Don't merge iconType and iconPosition — keep them separate
**Current state:** The `iconType` field was removed and merged into `iconPosition` (None/i-b/i-a). This is wrong.
**Required:** Keep two separate fields:
- `iconType`: None / Icon Font / Image (controls what icon source is used)
- `iconPosition`: i-b / i-a (controls where the icon appears, shown only when iconType != none)

### 2. Toggle styles aren't applying
**Root cause:** The CSS uses `.cta.abbv-switch.abbv-round` but the multiselect value is `"abbv-switch abbv-round"` (space-separated string). When the xwalk plugin processes this, it becomes TWO classes on the block div: `abbv-switch` and `abbv-round`. The CSS selector `.cta.abbv-switch.abbv-round` should match — BUT the problem is that `isToggle()` in JS checks `block.classList.contains('abbv-switch')` which would be true. 

The actual issue: the multiselect `classes` field value `"abbv-switch abbv-round"` gets converted via `toClassName()` which may slugify the whole string as one class. Let me verify — in EDS/xwalk, space-separated values in the `classes` field are treated as multiple classes directly added to the block element. The toggle CSS selector `.cta.abbv-switch.abbv-round` should work.

However, looking more carefully: the toggle inner DOM uses classes like `cta-toggle`, `cta-toggle-input`, `cta-toggle-slider` — these are NOT prefixed with `.abbv-switch`. The CSS targets them via `.cta .cta-toggle` etc. which should still match since `.cta` is on the block wrapper. So the selectors are fine.

**Real issue:** The round/square variant selectors changed from `.cta.cta-toggle-round` (single class) to `.cta.abbv-switch.abbv-round` (two classes). If the EDS framework's `toClassName()` is converting `"abbv-switch abbv-round"` into a single slugified class like `abbv-switch-abbv-round`, the two-class selector won't match.

**Fix:** Use single-value class names for toggles: `abbv-switch-round` and `abbv-switch-square` (no space).

### 3. CSS loading — resolved
User confirmed: keep both base + brand CSS loading (current architecture is correct).

### 4. What is `abbv-cta` and why?
User confirmed: keep `abbv-cta` as the inner element class. It's an internal CSS hook to target the `<a>` or `<button>` element inside the CTA block, separate from the variant class on the wrapper. This is our EDS-specific implementation detail.

## Changes Required

### Files to modify:
- `component-models.json` — Restore `iconType` field, update `iconPosition` condition, fix toggle class values
- `blocks/cta/_cta.json` — Same: restore iconType, fix toggle values
- `blocks/cta/cta.css` — Fix toggle selectors to use single-class names
- `blocks/cta/cta.js` — Update toggle check to match new single-class names

## Checklist

- [ ] **component-models.json** — Restore `iconType` field (None/Icon Font/Image) before `iconPosition`
- [ ] **component-models.json** — Update `iconPosition` to show condition when `iconType !== "none"`, with values `i-b`/`i-a`
- [ ] **component-models.json** — Update `iconFont`/`iconImage` conditions back to reference `iconType`
- [ ] **component-models.json** — Fix toggle class values: `abbv-switch-round` and `abbv-switch-square` (no space)
- [ ] **blocks/cta/_cta.json** — Restore `iconType` field, update iconPosition condition, fix toggle values
- [ ] **blocks/cta/_cta.json** — Restore `iconType` in template defaults
- [ ] **blocks/cta/cta.css** — Fix toggle selectors: `.cta.abbv-switch-round` and `.cta.abbv-switch-square`
- [ ] **blocks/cta/cta.js** — Fix `isToggle()` to check for `abbv-switch-round` or `abbv-switch-square`
- [ ] **Verify** — Confirm all icon/toggle logic is consistent across files
