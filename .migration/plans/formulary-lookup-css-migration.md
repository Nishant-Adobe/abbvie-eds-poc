# Formulary Lookup Block — Pixel-Perfect CSS Migration Plan

## Overview
Migrate the CSS styling of the `formulary-lookup` block to match the original AbbVie source sites pixel-perfectly across **3 brand variants**: SkyriziHCP (zip input, navy theme), RinvoqHCP (zip + filter + indication, card container, purple theme), and Mavyret HCP (state dropdown, orange/black theme). The existing JS and HTML structure are already in place — this plan focuses purely on CSS.

## Source Site Style Analysis

### SkyriziHCP (`skyrizihcp.com/dermatology/coverage-access`)
- **Variant**: ZIP code input + button inline
- **Font**: `"Univers LT W01_57 Condensed", "Arial Narrow", sans-serif` (14px)
- **Text color**: `rgb(33, 64, 109)` (navy)
- **Input**: 300px wide, 42px tall, 1px solid `rgb(194, 194, 194)`, border-radius 2px, padding `12px 35px 12px 15px`
- **Submit button**: `rgb(7, 29, 73)` navy background, pill-shaped (`border-radius: 30px`), 14px bold, 240px wide, 44px tall, padding `14px 66px 14px 46px`, search icon via CSS `::after` pseudo-element, 1px border same color
- **reCAPTCHA notice**: 11.2px, centered, `rgb(33, 64, 109)` color
- **Error message**: `rgb(235, 60, 54)` red, centered, display:none by default
- **Results container**: `border-radius: 4px`, `box-shadow: rgba(16, 164, 222, 0.2) 0px 5px 15px 0px`
- **Results header**: `font-weight: 700`, margin `10px 0px 0px 40px`, padding `5px`
- **Layout**: Centered text (`text-align: center`), no card wrapper

### RinvoqHCP (`rinvoqhcp.com/dermatology/access`)
- **Variant**: ZIP code + filter dropdown + indication radio + submit button
- **Font**: `Graphik, "Helvetica Neue", arial, helvetica, sans-serif` (16px)
- **Text color**: `rgb(70, 72, 74)` (dark gray)
- **Card container** (`.tool-box`): White bg, `border-radius: 10px`, `box-shadow: rgba(0,0,0,0.25) 2px 1px 8px`, padding 24px, centered
- **Heading**: 20px, font-weight 600, `"Graphik Bold"` family, color `rgb(37, 40, 42)`, centered, margin-bottom 32px
- **Heading underline accent**: `::after` pseudo-element — SVG yellow brushstroke background, 12px height, 536px wide, positioned absolute
- **ZIP form container** (`.abbv-formulary-zipcode`): flex column, 390px max-width, centered
- **ZIP input**: 388px wide, 45px tall, `border-radius: 10px`, `1px solid rgb(135, 137, 138)`, padding 12px, margin-bottom 31px
- **Floating label**: absolute positioned, 14px, white background, `rgb(70, 72, 74)` color
- **Filter dropdown** (`.abbv-plan-category .anchor`): 388px wide, 50px tall, `border-radius: 10px`, `1px solid rgb(135, 137, 138)`, padding 12px, text-align left
- **Indication radio** (`.abbv-pick-indication`): 388px max-width, heading 16px font-weight 600, text-align left
- **Submit button**: `rgb(144, 18, 74)` (Rinvoq purple/magenta), `border-radius: 100px` (pill), 16px bold, 49px tall, padding `15px 66px 15px 32px`, search icon `::after`
- **Error message**: `rgb(214, 42, 36)` red, 12px, absolute positioned, `"Graphik Medium"` font
- **reCAPTCHA notice**: 11.2px, centered, `rgb(70, 72, 74)` color
- **Disclaimer**: 16px, normal weight, `rgb(70, 72, 74)`

### Mavyret HCP (`mavyret.com/hcp/access`)
- **Variant**: State dropdown (text input with arrow toggle + list)
- **Font**: `Arial, "Helvetica Neue", Helvetica, sans-serif` (16px)
- **Text color**: `rgb(0, 0, 0)` (black)
- **Container** (`.abbv-formulary-dropdown`): 388px max-width, centered via `margin: 0 180px`, text-align left
- **Input** (`.formulary-dropdown-input`): 388px, 47px tall, `2px solid rgb(0, 0, 0)`, `border-radius: 2px`, padding `12px 35px 12px 15px`
- **Toggle arrow** (`.abbv-formulary-toggle-options`): absolute, 42px wide, 51px tall, 32px font, cursor pointer
- **Dropdown list** (`.formulary-dropdown-values`): absolute, 388px wide, white bg, `1px solid rgb(241, 241, 241)`
- **List items** (`.formulary-list-item`): padding `15px 10px`, `rgb(7, 29, 73)` navy text, cursor pointer
- **Submit button** (`.abbv-button-primary`): display:none (hidden), when shown: white bg, `2px solid rgb(230, 84, 0)` orange border, `box-shadow: rgb(230, 84, 0) -2px 2px 8px`, 18px `"Barlow Semi Condensed"`, font-weight 600
- **Label**: `Roboto, sans-serif` (16px), inline display
- **Layout**: text-align center (parent), left-aligned content

## Current EDS Implementation Gap

The current CSS uses generic EDS design tokens (`--formulary-border`, `--formulary-submit-bg`, etc.) with no brand-specific overrides. The DOM structure uses EDS class names (`formulary-lookup-*`) not the legacy AbbVie classes. CSS changes need to map to the **existing EDS DOM** produced by `formulary-lookup.js`.

### CSS Selector Mapping (Source → EDS)

| Source Selector | EDS Equivalent |
|---|---|
| `.abbv-formulary` | `.formulary-lookup` (block wrapper) |
| `.abbv-formulary-zipcode` | `.formulary-lookup-zip-form`, `.formulary-lookup-input-group` |
| `.abbv-formulary-zipcode input` | `.formulary-lookup-zip-input` |
| `.abbv-button-secondary` / `.abbv-button-primary` | `.formulary-lookup-submit` |
| `.abbv-error-msg` | `.formulary-lookup-status` (status/error area) |
| `.abbv-badgeless-captcha` | N/A (reCAPTCHA notice — needs JS addition) |
| `.abbv-formulary-results` | `.formulary-lookup-results` |
| `.abbv-formulary-results-header` | `.formulary-results-table thead` |
| `.abbv-formulary-results-container` | `.formulary-results-table-wrapper` |
| `.abbv-formulary-error` | `.formulary-lookup-status` |
| `.abbv-formulary-dropdown` | `.formulary-lookup-form` (for state variant) |
| `.formulary-dropdown-input` / `.abbv-state-input` | `.formulary-lookup-select` |
| `.abbv-formulary-toggle-options` | N/A (EDS uses native `<select>`) |
| `.formulary-dropdown-values` / `.abbv-state-list` | N/A (EDS uses native `<select>`) |
| `.abbv-plan-category` | N/A (filter dropdown — needs JS addition) |
| `.abbv-pick-indication` | N/A (indication radio — needs JS addition) |

## Checklist

### Phase 1: Base CSS Enhancements (formulary-lookup.css)
- [ ] **1.1** Add CSS custom properties block at top with all brand-overridable tokens: `--formulary-text-color`, `--formulary-heading-color`, `--formulary-heading-font-size`, `--formulary-heading-font-weight`, `--formulary-heading-margin-bottom`, `--formulary-input-height`, `--formulary-input-border-radius`, `--formulary-input-border-color`, `--formulary-input-padding`, `--formulary-input-max-width`, `--formulary-submit-border-radius`, `--formulary-submit-padding`, `--formulary-submit-height`, `--formulary-submit-width`, `--formulary-submit-border`, `--formulary-submit-font-size`, `--formulary-results-border-radius`, `--formulary-results-box-shadow`, `--formulary-error-color`, `--formulary-captcha-font-size`
- [ ] **1.2** Update `.formulary-lookup` base to use `position: relative`, add `text-align: var(--formulary-text-align, start)`
- [ ] **1.3** Update `.formulary-lookup-heading` to use `--formulary-heading-*` tokens for font-size, font-weight, color, margin-bottom, text-align
- [ ] **1.4** Update `.formulary-lookup-zip-input` to use `--formulary-input-*` tokens for height, border-radius, border-color, padding, max-width
- [ ] **1.5** Update `.formulary-lookup-submit` to use `--formulary-submit-*` tokens for border-radius, padding, height, width, border, font-size
- [ ] **1.6** Add search icon support on `.formulary-lookup-submit` via `::after` pseudo-element (hidden by default, enabled via `--formulary-submit-icon: block`)
- [ ] **1.7** Update `.formulary-results-table-wrapper` to use `--formulary-results-*` tokens for border-radius, box-shadow
- [ ] **1.8** Add `.formulary-lookup-status[data-error]` or status error state styling with `--formulary-error-color` token
- [ ] **1.9** Update `.formulary-lookup-select` to use `--formulary-input-*` tokens

### Phase 2: Brand Override — SkyriziHCP (skyrizi brand CSS)
- [ ] **2.1** Create/update `blocks/formulary-lookup/skyrizi/formulary-lookup.css` (or use existing abbvie brand if that maps to Skyrizi)
- [ ] **2.2** Set `--formulary-text-color: rgb(33, 64, 109)` (navy)
- [ ] **2.3** Set `--formulary-input-max-width: 300px`, `--formulary-input-height: 42px`, `--formulary-input-border-radius: 2px`, `--formulary-input-border-color: rgb(194, 194, 194)`, `--formulary-input-padding: 12px 35px 12px 15px`
- [ ] **2.4** Set `--formulary-submit-bg: rgb(7, 29, 73)`, `--formulary-submit-border-radius: 30px`, `--formulary-submit-width: 240px`, `--formulary-submit-height: 44px`, `--formulary-submit-padding: 14px 66px 14px 46px`, `--formulary-submit-font-size: 14px`, `--formulary-submit-border: 1px solid rgb(7, 29, 73)`, `--formulary-submit-icon: block`
- [ ] **2.5** Set `--formulary-text-align: center`
- [ ] **2.6** Set `--formulary-error-color: rgb(235, 60, 54)`
- [ ] **2.7** Set `--formulary-captcha-font-size: 11.2px`
- [ ] **2.8** Set `--formulary-results-border-radius: 4px`, `--formulary-results-box-shadow: rgba(16, 164, 222, 0.2) 0px 5px 15px 0px`
- [ ] **2.9** Set `--formulary-results-header-font-weight: 700`

### Phase 3: Brand Override — RinvoqHCP (rinvoq brand CSS)
- [ ] **3.1** Update `blocks/formulary-lookup/rinvoq/formulary-lookup.css` with overrides
- [ ] **3.2** Set `--formulary-text-color: rgb(70, 72, 74)`, `--formulary-heading-color: rgb(37, 40, 42)`, `--formulary-heading-font-size: 20px`, `--formulary-heading-font-weight: 600`, `--formulary-heading-margin-bottom: 32px`
- [ ] **3.3** Add `.formulary-lookup.card` variant: white bg, `border-radius: 10px`, `box-shadow: rgba(0,0,0,0.25) 2px 1px 8px`, `padding: 24px`, centered
- [ ] **3.4** Add heading underline accent via `.formulary-lookup-heading::after`: block, 12px height, yellow/gold gradient or solid color bar, full-width, positioned relative/absolute
- [ ] **3.5** Set `--formulary-input-max-width: 388px`, `--formulary-input-height: 45px`, `--formulary-input-border-radius: 10px`, `--formulary-input-border-color: rgb(135, 137, 138)`, `--formulary-input-padding: 12px`, margin-bottom 31px
- [ ] **3.6** Add floating label style: `.formulary-lookup-label` as `position: absolute`, 14px, white bg, padding `0 3px 0 2px`
- [ ] **3.7** Set `--formulary-submit-bg: rgb(144, 18, 74)`, `--formulary-submit-border-radius: 100px`, `--formulary-submit-height: 49px`, `--formulary-submit-padding: 15px 66px 15px 32px`, `--formulary-submit-font-size: 16px`, `--formulary-submit-font-weight: 700`, `--formulary-submit-border: none`, `--formulary-submit-icon: block`
- [ ] **3.8** Set `--formulary-error-color: rgb(214, 42, 36)`, error font-size 12px, error position absolute
- [ ] **3.9** Set `--formulary-captcha-font-size: 11.2px`
- [ ] **3.10** Set `--formulary-text-align: center`

### Phase 4: Brand Override — Mavyret (mavyret brand CSS — currently missing, need to create or use botox brand)
- [ ] **4.1** Create `blocks/formulary-lookup/mavyret/formulary-lookup.css` (or update botox if it maps to Mavyret)
- [ ] **4.2** Set `--formulary-text-color: rgb(0, 0, 0)`, `--formulary-text-align: center`
- [ ] **4.3** Set select/input styles: `--formulary-input-max-width: 388px`, `--formulary-input-height: 47px`, `--formulary-input-border: 2px solid rgb(0, 0, 0)`, `--formulary-input-border-radius: 2px`, `--formulary-input-padding: 12px 35px 12px 15px`
- [ ] **4.4** Style `.formulary-lookup-form` centered via margin auto, max-width 388px, text-align left
- [ ] **4.5** Set `--formulary-submit-bg: rgb(255, 255, 255)`, `--formulary-submit-color: rgb(83, 87, 88)`, `--formulary-submit-border: 2px solid rgb(230, 84, 0)`, `--formulary-submit-border-radius: 0`, `--formulary-submit-font-size: 18px`, `--formulary-submit-font-weight: 600`, `box-shadow: rgb(230, 84, 0) -2px 2px 8px`
- [ ] **4.6** Style dropdown list items: color `rgb(7, 29, 73)`, padding `15px 10px`, cursor pointer

### Phase 5: JS Enhancements (for missing features visible in source sites)
- [ ] **5.1** Add reCAPTCHA notice text rendering from `recaptchaNotice` config field (text below form with Privacy Policy/Terms links)
- [ ] **5.2** Add disclaimer text rendering from `disclaimer` config field (text below results area)
- [ ] **5.3** Add filter dropdown support for dynamic variant (`.formulary-lookup-filter`) when `filterLabel` config is provided
- [ ] **5.4** Add indication radio group support (`.formulary-lookup-indications`) when `indicationLabel` and `indications` config fields are provided
- [ ] **5.5** Add `card` and `centered` variant class support from `block.classList`
- [ ] **5.6** Add icon image rendering above heading when `icon` config field is provided

### Phase 6: UE Component Model Updates
- [ ] **6.1** Add `icon` (reference) field to model
- [ ] **6.2** Add `recaptchaNotice` (richtext) field
- [ ] **6.3** Add `disclaimer` (richtext) field
- [ ] **6.4** Add `filterLabel` (text) field
- [ ] **6.5** Add `indicationLabel` (text) and `indications` (text, comma-separated) fields
- [ ] **6.6** Update `classes` to include `card` and `centered` options
- [ ] **6.7** Update `_formulary-lookup.json` and merge into `component-models.json`

### Phase 7: Verification
- [ ] **7.1** Preview SkyriziHCP formulary variant — verify navy submit pill, centered layout, input sizing, reCAPTCHA text
- [ ] **7.2** Preview RinvoqHCP formulary variant — verify card container with shadow, yellow underline accent, floating label, purple pill submit, filter dropdown, indication radio
- [ ] **7.3** Preview Mavyret formulary variant — verify centered state dropdown, black border input, orange-bordered submit button
- [ ] **7.4** Test mobile responsiveness for all 3 brand variants (600px breakpoint)
- [ ] **7.5** Verify no regressions in base (un-branded) formulary block

## Architecture Notes

- **Token-driven approach**: All brand visual differences are expressed via CSS custom property overrides, keeping the base CSS generic and maintainable
- **No legacy class names**: The EDS block uses its own `formulary-lookup-*` naming convention — we do not replicate the legacy `.abbv-*` classes
- **Card variant**: Implemented as a composable `card` class on the block element (set via UE `classes` field), not a separate variant
- **Floating label**: CSS-only implementation using absolute positioning + `:not(:placeholder-shown)` for RinvoqHCP pattern
- **Search icon**: CSS `::after` pseudo-element on submit button, toggled via `--formulary-submit-icon` token per brand

---

*This plan requires Execute mode for implementation.*
