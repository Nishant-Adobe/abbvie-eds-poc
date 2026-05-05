# Fix Image Compare Block — CSS/JS Class Name Mismatch

## Problem

The image-compare block renders as raw text/broken images instead of an interactive slider because:

1. **CSS class mismatch**: The JS creates DOM elements with `ic-*` class names (`ic-container`, `ic-before-layer`, `ic-after`, etc.) but all CSS files target `.image-compare-*` selectors (`image-compare-container`, `image-compare-before`, `image-compare-after`, etc.)
2. **No CSS rules apply** → the slider renders unstyled as plain text/images

### Evidence from Screenshots
- Rinvoq page shows: "BEFORE", "AFTER", "CLICK AND DRAG TO SEE RESULTS«««↔»»»" as raw text — meaning `buildRinvoq` executed but CSS doesn't match the generated class names
- Skyrizi page shows: "BEFORE | WEEK 0AFTER | WEEK 52", "Patient from Illinois" — meaning `buildSkyrizi` executed but CSS doesn't match

### Root Cause
The JS uses short `ic-*` prefixed classes but the CSS (base + all brand overrides) uses `.image-compare-*` selectors. These never matched.

---

## Solution

**Update `image-compare.js`** to generate DOM with class names matching the CSS selectors. Map from current JS classes to what CSS expects:

| JS Currently Creates | CSS Expects | Fix |
|---------------------|-------------|-----|
| `ic-container` | `image-compare-container` | Rename |
| `ic-before-layer` | `image-compare-before` | Rename |
| `ic-img ic-before` | (img inside `.image-compare-before`) | Remove class from img |
| `ic-img ic-after` | (img inside `.image-compare-after`) | Wrap in `.image-compare-after` |
| `ic-divider` | `image-compare-handle` (the vertical line IS the handle) | Rename |
| `ic-label ic-label-before` | `image-compare-label image-compare-label-before` | Rename |
| `ic-label ic-label-after` | `image-compare-label image-compare-label-after` | Rename |
| `ic-handle` | `image-compare-prompt` (the drag tooltip) | Rename |
| `ic-handle-hidden` | `is-hidden` | Rename |
| `ic-caption` | `image-compare-gallery-content` | Rename |
| `ic-wrapper` | `image-compare-wrapper` | Rename |
| `ic-top-bar` | (no direct match — needs custom or use heading) | Keep or add CSS |
| `ic-bottom-bar` | `image-compare-gallery-content` with `::after` | Align |
| `ic-patient` | (no direct match) | Keep or add CSS |
| `ic-thumb*` | `image-compare-thumb*` | Rename |

The CSS structure expects:
```
.image-compare (block wrapper — already applied by EDS)
  .image-compare-wrapper (optional outer wrapper)
    .image-compare-container (slider area — position:relative, overflow:hidden)
      .image-compare-after (contains the "after" image)
        img
      .image-compare-before (clip layer for "before" image)
        img
      .image-compare-handle (the vertical divider line + drag circle)
      .image-compare-label.image-compare-label-before
      .image-compare-label.image-compare-label-after
      .image-compare-prompt (the "CLICK AND DRAG" tooltip)
```

---

## Files to Modify

| # | File | Change |
|---|------|--------|
| 1 | `blocks/image-compare/image-compare.js` | Update all class names in `buildRinvoq`, `buildSkyrizi`, and `setupSlider` to match CSS selectors |

---

## Checklist

- [ ] Update `buildRinvoq` — replace all `ic-*` classes with `image-compare-*` equivalents
- [ ] Update `buildSkyrizi` — replace all `ic-*` classes with `image-compare-*` equivalents
- [ ] Update `setupSlider` — fix querySelector and class references
- [ ] Update `decorateLegacy` — fix `ic-handle-hidden` → `is-hidden`
- [ ] Verify class names match base `image-compare.css` selectors exactly
- [ ] Verify class names match `rinvoq/_image-compare.css` overrides
- [ ] Verify class names match `skyrizi-hcp/_image-compare.css` overrides
- [ ] Lint check passes
- [ ] Commit fix to `image-compare` branch

---

## Key Constraints

1. CSS files stay unchanged — only JS class name output changes
2. The generated DOM must use class names that exactly match existing CSS selectors
3. Backward compatible — all three content formats must still work
4. **Execution requires Execute mode**
