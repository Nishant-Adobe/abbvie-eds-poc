# SkyriziHCP Before-After Gallery — Pixel-Perfect Migration Plan

## Source Site Analysis (from HTML and screenshots)

The SkyriziHCP before-after gallery on `skyrizihcp.com/dermatology/psoriasis-efficacy/before-and-after` has a fundamentally different layout from the RinvoqDTC version:

### Week 16 Section Structure
- **Container**: Dark navy/blue gradient background (`risa-box-housing--grad`), full-width
- **Layout**: Two-column flex (`abbv-flex-container`) — text on LEFT, slider on RIGHT
- **Left column**: Week label ("WEEK 16"), heading ("Patient results after 2 doses at Week 16"), description text (clinical notes, photo credits), CTA button ("VIEW WEEK 52 RESULTS")
- **Right column**: Image comparison slider with before/after images, "BEFORE | WEEK 0" and "AFTER | WEEK 16" labels below slider, patient location text
- **Thumbnail navigation**: Horizontal scrollable row of 9 thumbnail images below the main content — clicking swaps the slider images. Active thumbnail has highlighted border
- **Handle**: Cyan/light blue circular drag handle with swap arrows icon

### Week 52 Section Structure
- Same two-column flex but **reversed** — slider on LEFT, text on RIGHT
- Only 1 patient image (no thumbnail row)
- CTA button links back to "VIEW WEEK 16 RESULTS"

### Key Visual Differences vs Current EDS Block

| Feature | Current EDS Block | SkyriziHCP Source | Required Change |
|---|---|---|---|
| **Layout** | Single column: tabs → slider → thumbnails | Two-column flex: text beside slider | Add `split` variant with flex layout |
| **Background** | Transparent/white | Dark navy gradient | CSS token `--gallery-bg` |
| **Text position** | Heading above slider | Rich description beside slider | JS: render description in flex column |
| **Labels** | "BEFORE" / "AFTER" overlays on image | "BEFORE \| WEEK 0" / "AFTER \| WEEK 16" below slider | Support configurable label format + below-slider positioning |
| **Patient info** | Not present | "Patient from Illinois" below slider | Add `patientInfo` per image in model |
| **CTA button** | Not present | "VIEW WEEK 52 RESULTS" jump link | Add `ctaText` + `ctaLink` per tab |
| **Thumbnails** | 4 per tab in grid | Up to 9 in horizontal scrollable row | CSS: horizontal scroll, more images |
| **Tab switching** | Tab bar buttons | Thumbnails ARE the tab switchers (no separate tab bar for Week 16) | Thumbnails navigate between patients within same week |
| **Heading style** | Simple h2 | "WEEK 16" as label + large heading + hr + description paragraphs | Richtext description field handles this |
| **Handle color** | White | Cyan/light blue | CSS token `--gallery-handle-color` |

## Checklist

### Phase 1: Add `split` variant to JS (two-column layout)
- [ ] **1.1** Detect `split` class on block element (`block.classList.contains('split')`)
- [ ] **1.2** When `split` variant: render wrapper as flex row — left column (description) + right column (slider + labels + patient info)
- [ ] **1.3** Support `beforeLabelPrefix` and `afterLabelPrefix` rendered BELOW the slider (not overlaid on image) when `split` variant
- [ ] **1.4** Add `patientInfo` text per image (rendered below slider labels when thumbnail is clicked)
- [ ] **1.5** Add `ctaText` and `ctaLink` config fields — rendered as a button/link inside the description column
- [ ] **1.6** Move thumbnails below the entire two-column layout as a horizontal scrollable row

### Phase 2: Update base CSS for `split` variant
- [ ] **2.1** Add `.before-after-gallery.split .before-after-gallery-wrapper` as flex row with gap
- [ ] **2.2** Left column (`.before-after-gallery-description`) takes ~45% width
- [ ] **2.3** Right column (`.before-after-gallery-content`) takes ~55% width with slider
- [ ] **2.4** Add `.before-after-gallery-below-labels` for "BEFORE | WEEK 0" / "AFTER | WEEK 16" text below slider
- [ ] **2.5** Add `.before-after-gallery-patient-info` for patient location text
- [ ] **2.6** Add `.before-after-gallery-cta` for the CTA jump link button
- [ ] **2.7** Thumbnails in split mode: horizontal scroll, smaller, no grid

### Phase 3: SkyriziHCP brand CSS overrides (abbvie)
- [ ] **3.1** Dark navy background: `--gallery-bg: linear-gradient(135deg, rgb(0 80 150), rgb(0 51 102))`
- [ ] **3.2** White text: `--gallery-text-color: #fff`
- [ ] **3.3** Cyan handle: `--gallery-handle-color: rgb(0 190 230)`
- [ ] **3.4** CTA button styling: outlined white button with play icon
- [ ] **3.5** Heading "WEEK 16" as label style (small, uppercase, light blue)
- [ ] **3.6** Thumbnail row: horizontal scroll with smaller thumbnails, active cyan border
- [ ] **3.7** Below-slider labels: flex row with "BEFORE | WEEK 0" left, "AFTER | WEEK 16" right

### Phase 4: Update component model
- [ ] **4.1** Add `split` to variant select options
- [ ] **4.2** Add `ctaText` and `ctaLink` text fields to Content tab
- [ ] **4.3** Add `tab1Image1PatientInfo` through `tab1Image4PatientInfo` text fields (patient location)
- [ ] **4.4** Update `_before-after-gallery.json` and `component-models.json`

### Phase 5: Deploy and sync
- [ ] **5.1** Update `styles/abbvie/blocks/before-after-gallery/before-after-gallery.css`
- [ ] **5.2** Sync to `blocks/before-after-gallery/abbvie/before-after-gallery.css`
- [ ] **5.3** Validate JS syntax and JSON

### Phase 6: Test and preview
- [ ] **6.1** Update test HTML page with SkyriziHCP `split` variant content
- [ ] **6.2** Preview and compare against source screenshots
- [ ] **6.3** Verify two-column layout, dark bg, cyan handle, thumbnail nav
- [ ] **6.4** Test mobile responsiveness (should stack to single column at 600px)

### Phase 7: Authoring values for SkyriziHCP in UE
- [ ] **7.1** Document exact field values for Week 16 section
- [ ] **7.2** Document exact field values for Week 52 section
- [ ] **7.3** Provide image reference paths from source DAM

---

*This plan requires Execute mode for implementation. The main work is adding the `split` variant to the JS/CSS that renders a two-column layout with description text beside the slider — matching the SkyriziHCP source structure.*
