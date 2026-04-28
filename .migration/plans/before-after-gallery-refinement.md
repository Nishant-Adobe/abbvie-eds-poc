# RinvoqDTC Before-After Gallery — Pixel-Perfect Refinement Plan

## Source HTML Analysis (from provided markup)

The RinvoqDTC gallery at `rinvoq.com/atopic-dermatitis/rinvoq-results/eczema-pictures` has these specific structural details:

### Slider
- **Start position**: 66% (before image takes 2/3 width, after takes 1/3)
- **Max width**: 765px, centered with `margin: auto`
- **Image text overlay**: Clinical text ("Many patients saw 75% skin clearance at 16 weeks...") overlaid transparently on BOTH before and after images
- **BEFORE/AFTER labels**: At the TOP of the slider (not bottom), with semi-transparent green background
- **Handle**: Uses `abbv-icon-code` class (the `<>` arrows icon), positioned at 66%

### Instruction Bar
- Text "Click on an image to see RINVOQ in action" is a separate div below the slider within the same container — NOT overlaid on the image

### Thumbnails
- 4 thumbnails per tab (Legs, Arms, Back, Ankles/Feet)
- Each is ~110-152px wide with body part label + clearance % overlaid at bottom-left
- Active thumbnail gets `border-thumbnails-active` class (gold/yellow border)
- Clicking a thumbnail shows/hides the corresponding slider (show-one-hide-others pattern via `addClass|d-none` / `removeClass|d-none`)

### Toggle Tabs
- "View Adult Results" / "View Adolescent (12-17) Results"
- Magenta active (`rgb(144, 18, 74)`), white inactive with magenta text
- **Positioned BELOW the thumbnails**, not above
- Uses `toggle-pictures-slider` container with flex row layout

### Layout Order (top to bottom)
1. Slider (765px max-width, centered)
2. Instruction text bar
3. Thumbnails row (flex, 4 items)
4. Toggle tabs (Adult / Adolescent)

## Gaps vs Current EDS Implementation

| Feature | Current EDS | Source | Fix Needed |
|---|---|---|---|
| Slider start | 50% | 66% | Add `startPosition` config field, default 66% for Rinvoq |
| Labels position | Bottom of image | Top of image | Add `--gallery-label-position` token (top vs bottom) |
| Image text overlay | Not supported | Clinical text on both images | Add `imageOverlayText` config field + CSS |
| Tab position | Above slider | Below thumbnails | Add layout order variant or CSS reorder |
| Thumbnail max-width | 140px grid | ~110-152px flex | Already tokenized, adjust Rinvoq brand value |

## Checklist

### Phase 1: JS updates
- [ ] **1.1** Add `startPosition` config field — sets initial `--compare-position` (default "50", Rinvoq uses "66")
- [ ] **1.2** Add `imageOverlayText` config field — text rendered on both before/after images as transparent overlay
- [ ] **1.3** For default (non-split) variant: reorder DOM so tabs render AFTER thumbnails when `tabPosition` config is "bottom"

### Phase 2: CSS updates
- [ ] **2.1** Add `--gallery-label-top` / `--gallery-label-bottom` tokens for label vertical positioning
- [ ] **2.2** Add `.before-after-gallery-image-overlay` class for the clinical text overlay on images
- [ ] **2.3** Add `--gallery-slider-max-width` token to constrain slider width

### Phase 3: Rinvoq brand CSS refinements
- [ ] **3.1** Set `--gallery-label-top` to position labels at top instead of bottom
- [ ] **3.2** Set label background to semi-transparent green/teal matching source
- [ ] **3.3** Set `--gallery-slider-max-width: 765px`
- [ ] **3.4** Adjust thumbnail sizing and layout to match source flex row

### Phase 4: Test and verify
- [ ] **4.1** Update test page with `startPosition: 66` and image overlay text
- [ ] **4.2** Screenshot and compare against source
- [ ] **4.3** Verify tab position below thumbnails

---

*This plan requires Execute mode for implementation. The main fixes are: slider start position at 66%, label positioning at top, image overlay text support, and tab ordering.*
