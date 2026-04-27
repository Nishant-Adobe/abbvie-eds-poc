# Before-After-Gallery — Pixel-Perfect Migration Plan

## Overview

Migrate the `before-after-gallery` block to pixel-perfectly replicate the interactive before/after photo galleries on **RinvoqDTC** (`rinvoq.com/atopic-dermatitis/rinvoq-results/eczema-pictures`) and **SkyriziHCP** (`skyrizihcp.com/dermatology/psoriasis-efficacy/before-and-after`). The existing block has working JS (slider, tabs, thumbnails) and base CSS — needs brand-specific styling and minor JS/CSS refinements to match the source sites exactly.

## Source Site Analysis

### RinvoqDTC (rinvoq.com — image 1)
- **Layout**: Full-width slider with drag handle, "CLICK AND DRAG TO SEE RESULTS" prompt overlay with yellow arrows icon
- **Tabs**: "View Adult Results" / "View Adolescent (12-17) Results" — pill-style toggle with white active state
- **Thumbnails**: 4 per tab — "Legs 75% clearance", "Arms 75% clearance", "Back 90% clearance", "Ankles/Feet 90% clearance"
- **Prompt text**: "Click on an image to see RINVOQ in action" below slider
- **Labels**: "BEFORE" / "AFTER" overlays on image
- **Handle**: White circle with bidirectional arrows icon
- **Colors**: Brand yellow/gold accent on active elements

### SkyriziHCP (skyrizihcp.com — image 2)
- **Layout**: Dark blue background section, full-width slider
- **Header**: "WEEK 16" tab bar with expand (+) button
- **Handle**: White circle with arrows at center of slider divider
- **No thumbnails visible** in the screenshot — different structure, may use week-based tabs
- **Colors**: Navy/dark blue background, white text

## Existing Block State

The block **already has the core functionality**:
- ✅ Slider with `--compare-position` CSS variable and pointer/keyboard events
- ✅ Tab bar with toggle variant (pill buttons)
- ✅ Thumbnail grid with active state
- ✅ Before/After labels
- ✅ Drag prompt overlay
- ✅ Accessibility (ARIA roles, keyboard nav)
- ✅ Component model with 2 tabs × 4 image pairs each
- ✅ Brand override directory structure (abbvie, botox, rinvoq)

### Gaps to Fix

| Feature | Current EDS | RinvoqDTC Source | SkyriziHCP Source |
|---|---|---|---|
| Slider prompt | Text only "CLICK AND DRAG..." | Yellow arrows icon + text | Similar prompt |
| Tab styling | Generic gray/primary colors | White/transparent toggle pills | Dark blue with expand button |
| Thumbnail label position | Label at bottom, sublabel above | Label overlays at bottom-left corner with body part name + clearance% | Different layout |
| Instruction text below slider | Not present | "Click on an image to see RINVOQ in action" | Not visible |
| Brand colors | Generic tokens | Rinvoq gold/yellow accent | SkyriziHCP navy/blue |
| Card/background | None | Light background | Dark blue background |

## Checklist

### Phase 1: CSS refinements to base block
- [ ] **1.1** Add `--gallery-prompt-bg` token for prompt overlay background (allows brand-specific colors)
- [ ] **1.2** Add `--gallery-tab-active-bg`, `--gallery-tab-active-color`, `--gallery-tab-bg`, `--gallery-tab-color`, `--gallery-tab-border-color` tokens for tab button styling
- [ ] **1.3** Add `--gallery-thumb-active-border-color` token for thumbnail active state
- [ ] **1.4** Add `--gallery-thumb-label-bg` token for thumbnail label background
- [ ] **1.5** Add instruction text element support below slider (new `.before-after-gallery-instruction` class)
- [ ] **1.6** Refine thumbnail label/sublabel positioning to match source — label at bottom-left with body part name, sublabel as clearance %

### Phase 2: RinvoqDTC brand CSS overrides (rinvoq folder)
- [ ] **2.1** Set tab toggle styling — white bg on active, transparent on inactive, Rinvoq gold/yellow border
- [ ] **2.2** Set thumbnail active border to Rinvoq gold accent color
- [ ] **2.3** Set prompt overlay styling — semi-transparent dark bg with yellow arrows icon
- [ ] **2.4** Set slider handle color to white with shadow
- [ ] **2.5** Set instruction text styling below slider

### Phase 3: SkyriziHCP brand CSS overrides (abbvie folder)
- [ ] **3.1** Set dark blue/navy background for the gallery section
- [ ] **3.2** Set tab styling — "WEEK 16" style with dark navy bg, white text
- [ ] **3.3** Set handle and label colors for dark background contrast
- [ ] **3.4** Set any SkyriziHCP-specific layout adjustments

### Phase 4: JS enhancements
- [ ] **4.1** Add optional instruction text rendering from `instructionText` config field
- [ ] **4.2** Add support for `background` config to set section background color/class
- [ ] **4.3** Update component model (`_before-after-gallery.json` and `component-models.json`) with new fields: `instructionText`, `background`

### Phase 5: Deploy brand CSS to styles/ directory
- [ ] **5.1** Create `styles/rinvoq/blocks/before-after-gallery/before-after-gallery.css` with RinvoqDTC overrides
- [ ] **5.2** Create `styles/abbvie/blocks/before-after-gallery/before-after-gallery.css` with SkyriziHCP overrides
- [ ] **5.3** Sync to `blocks/` brand subdirectories

### Phase 6: Authoring values for UE
- [ ] **6.1** Document RinvoqDTC authoring: toggle variant, tab labels "View Adult Results" / "View Adolescent (12-17) Results", 4 image pairs per tab with body part labels + clearance%, instruction text
- [ ] **6.2** Document SkyriziHCP authoring: tab labels "WEEK 16" etc., image pairs, dark background setting
- [ ] **6.3** Provide exact field values for both brands

### Phase 7: Preview and validate
- [ ] **7.1** Preview RinvoqDTC gallery — compare slider, tabs, thumbnails, prompt against source
- [ ] **7.2** Preview SkyriziHCP gallery — compare dark bg, slider, tabs against source
- [ ] **7.3** Test drag interaction and keyboard navigation
- [ ] **7.4** Test mobile responsiveness at 600px

---

*This plan requires Execute mode for implementation. The block's core JS functionality is already solid — the main work is brand-specific CSS overrides and minor enhancements.*
