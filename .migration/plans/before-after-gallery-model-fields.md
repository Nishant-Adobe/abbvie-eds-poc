# Before & After Pages — Full Migration Plan

## Scope

Migrate two complete pages pixel-perfect from source AEM sites to AEM Edge Delivery Services:

1. **SkyriziHCP Before & After** (`skyrizihcp.com/dermatology/psoriasis-efficacy/before-and-after`)
   - Page sections: Hero, Before-After Gallery (Week 16/52), Toggle, Accordion (Pivotal Trials), CTA Cards (2), Inline ISI, Floating ISI Bar

2. **RinvoqDTC Before & After** (`rinvoq.com/atopic-dermatitis/rinvoq-results/eczema-pictures`)
   - Page sections: Hero, Before-After Gallery, Image-Text v2, CTA Cards, Inline ISI, Floating ISI Bar

## Block Inventory — Available vs Needed

| Source Component | EDS Block Available | Status |
|---|---|---|
| Hero | `hero` ✅ | Exists — needs brand CSS |
| Before-After Gallery | `before-after-gallery` ✅ | Exists — JS/CSS done, **model sync needed** |
| Accordion | `accordion` ✅ | Exists — needs brand CSS |
| CTA Cards | `cards` or `story-card` ✅ | Exists — map to available block |
| Image-Text v2 | `columns` or `teaser` ✅ | Map to existing block |
| Inline ISI | Default content (rich text) | Section with styled text |
| Floating ISI Bar | `safety-bar` ✅ | Exists — needs brand CSS |
| Toggle (Week 16/52) | Part of `before-after-gallery` split variant | Already built |

## Before-After Gallery — Remaining Fixes

### Model Sync Gap
The JS supports `startPosition`, `imageOverlayText`, `tabPosition`, and `patientInfo` but these fields are **missing from `component-models.json`**. Only `ctaText`, `ctaLink`, `tab1Image1PatientInfo` through `tab1Image4PatientInfo`, and `split` variant were added. Need to add:
- `startPosition` (text field)
- `imageOverlayText` (richtext field)
- `tabPosition` (select: top/bottom)

## Checklist

### Phase 1: Before-After Gallery — Component Model Sync
- [ ] **1.1** Add `startPosition` text field to `component-models.json` (after `instructionText`, before `ctaText`)
- [ ] **1.2** Add `imageOverlayText` richtext field to `component-models.json`
- [ ] **1.3** Add `tabPosition` select field (options: "Top" = "", "Bottom" = "bottom") to `component-models.json`
- [ ] **1.4** Add `tab2Image1PatientInfo` through `tab2Image4PatientInfo` text fields (currently only Tab 1 has them)
- [ ] **1.5** Validate JSON syntax
- [ ] **1.6** Sync changes to `_before-after-gallery.json` local model

### Phase 2: SkyriziHCP Page Migration — Content Structure
- [ ] **2.1** Scrape `skyrizihcp.com/dermatology/psoriasis-efficacy/before-and-after` to analyze full page structure
- [ ] **2.2** Map page sections to EDS blocks: hero, before-after-gallery (split), accordion, cards, safety-bar
- [ ] **2.3** Create page template in UE with correct section order
- [ ] **2.4** Author hero block with SkyriziHCP brand styling
- [ ] **2.5** Author before-after-gallery (split variant) — Week 16 section with 4+ patient images
- [ ] **2.6** Author before-after-gallery (split variant) — Week 52 section (anchor `#week-52`)
- [ ] **2.7** Author accordion block for "Pivotal Trials" clinical data
- [ ] **2.8** Author 2 CTA card blocks
- [ ] **2.9** Author inline ISI section (default content)
- [ ] **2.10** Author safety-bar block for floating ISI
- [ ] **2.11** Set page metadata: `brand` = `abbvie`

### Phase 3: RinvoqDTC Page Migration — Content Structure
- [ ] **3.1** Analyze `rinvoq.com/atopic-dermatitis/rinvoq-results/eczema-pictures` full page structure (already scraped)
- [ ] **3.2** Map page sections to EDS blocks: hero, before-after-gallery (toggle), columns/teaser, cards, safety-bar
- [ ] **3.3** Create page template in UE with correct section order
- [ ] **3.4** Author hero block with RinvoqDTC brand styling
- [ ] **3.5** Author before-after-gallery (toggle variant) — Adult tab: 4 images (Legs, Arms, Back, Ankles), startPosition=66, tabPosition=bottom, imageOverlayText
- [ ] **3.6** Author before-after-gallery (toggle variant) — Adolescent tab: 2 images
- [ ] **3.7** Author Image-Text section (map to `columns` or `teaser` block)
- [ ] **3.8** Author CTA cards
- [ ] **3.9** Author inline ISI section
- [ ] **3.10** Author safety-bar for floating ISI
- [ ] **3.11** Set page metadata: `brand` = `rinvoq`

### Phase 4: Brand CSS Verification
- [ ] **4.1** Verify `hero` block has brand overrides for abbvie (dark blue) and rinvoq
- [ ] **4.2** Verify `accordion` block has brand overrides for abbvie
- [ ] **4.3** Verify `cards` block has brand overrides for both brands
- [ ] **4.4** Verify `safety-bar` block has brand overrides for both brands
- [ ] **4.5** Create any missing brand CSS override files in `styles/{brand}/blocks/`

### Phase 5: Preview and Pixel Comparison
- [ ] **5.1** Preview SkyriziHCP page — compare hero, gallery, accordion, cards, ISI against source
- [ ] **5.2** Preview RinvoqDTC page — compare hero, gallery, image-text, cards, ISI against source
- [ ] **5.3** Fix any remaining CSS gaps per block per brand
- [ ] **5.4** Test mobile responsiveness at 600px for both pages

---

*This plan requires Execute mode for implementation. Phase 1 (model sync) is the critical blocker — the UE won't show startPosition/imageOverlayText/tabPosition fields until they're added to component-models.json. Phases 2-3 involve UE authoring. Phases 4-5 are CSS verification and visual QA.*
