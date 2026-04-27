# Formulary Lookup Block — Spec Alignment & Visual Fidelity Update

## Overview

The `formulary-lookup` block exists with 3 working variants (default state dropdown, dynamic state+county, ZIP code). This plan addresses the **gap between the current EDS implementation and the actual source site visuals** shown in the screenshots from SkyriziHCP, RinvoqHCP, and Mavyret HCP.

## Source Site Visual Analysis (from Screenshots)

### SkyriziHCP (`skyrizihcp.com/dermatology/coverage-access`) — ZIP variant
- **Heading**: "SEE WHICH PLANS IN YOUR AREA INCLUDE SKYRIZI ON THEIR PREFERRED DRUG FORMULARY" (uppercase, navy, centered)
- **Input**: Single text field with placeholder "Enter a Zip Code" — wide, light gray border
- **Submit button**: "LOOK UP STATUS" pill-shaped navy button with search icon — sits inline right of input
- **Validation**: Red "enter a valid zip code." text below input + "Please" link
- **reCAPTCHA badge**: "This site is protected by reCAPTCHA and the Google Privacy Policy and Terms of Service apply." text below form
- **Disclaimer**: Light gray text block below about coverage requirements
- **AEM classes**: `.abbv-formulary` (from inventory)

### RinvoqHCP (`rinvoqhcp.com/dermatology/access`) — ZIP + Filter + Indication variant
- **Container**: White card with shadow, centered, narrow max-width (~390px)
- **Icon**: Yellow lightbulb icon above heading
- **Heading**: "Check the Formulary Status for RINVOQ in Your Area" (bold, with yellow underline accent)
- **ZIP input**: "*Enter Zip Code" with floating label pattern (label above, value "00000")
- **Filter dropdown**: "Select a filter" dropdown with red clear icon
- **Indication radio**: "Choose Indication" with radio button "AD"
- **Submit button**: "Look Up Status" rounded button with search icon (brand purple)
- **reCAPTCHA text**: Same as SkyriziHCP
- **Disclaimer**: "Preferred means RINVOQ is on a preferred tier..."
- **AEM classes**: `.abbv-formulary.abbv-formulary-dynamic.css-wrapper` with `data-config`, `data-formulary-category="true"`, `tabular-layout="true"`
- **Inner structure**: `.abbv-formulary-zipcode` → `.formulary-dropdown-box` → `.formularyInput-wrapper`

### Mavyret HCP (`mavyret.com/hcp/access`) — State dropdown variant
- **Heading**: "Find MAVYRET Access by State With Our Formulary Lookup Tool" (centered)
- **State dropdown**: "Select State" standard `<select>` element, centered
- **Submit link**: "See Access and Formulary Considerations >" text link below
- **AEM classes**: `.abbv-formulary.mavy-formulary-lookup` with `data-config`, `data-json-data-id="formularyData0"`
- **Inner structure**: `.abbv-formulary-dropdown` → `.formulary-dropdown-box` → `.formularyInput-wrapper`

## Gap Analysis: Current EDS vs. Source Sites

| Feature | Current EDS | SkyriziHCP Source | RinvoqHCP Source | Mavyret Source | Action |
|---|---|---|---|---|---|
| **Icon above heading** | Missing | Not used | Yellow lightbulb | Not used | Add optional `icon` reference field |
| **Heading underline accent** | Missing | Not used | Yellow underline below heading | Not used | Add CSS for brand accent underline variant |
| **reCAPTCHA notice text** | Missing | Shown below form | Shown below form | Not shown | Add `recaptchaNotice` richtext field |
| **Disclaimer text** | Missing | Coverage disclaimer below | Preferred status disclaimer | Not shown | Add `disclaimer` richtext field |
| **Filter dropdown** | Missing | Not used | "Select a filter" dropdown | Not used | Add `filterLabel`/`filterOptions` for dynamic variant |
| **Indication radio** | Missing | Not used | "Choose Indication" radio (AD) | Not used | Add `indicationLabel`/`indications` model for dynamic variant |
| **Submit icon** | Missing | Search icon in button | Search icon in button | Arrow icon in link | Add icon support via CSS pseudo-element |
| **Card container style** | No card wrapper | Inline (no card) | White card with shadow | Inline (no card) | Add `card` variant class |
| **Submit as link** | Button only | Button | Button | Text link with arrow | Add `submitAsLink` boolean for Mavyret pattern |
| **Floating label input** | Standard label+input | Placeholder in input | Floating label pattern | Standard label+dropdown | CSS-only floating label enhancement |
| **Tabular results layout** | Table format | Tabular results | `tabular-layout="true"` | Not shown (link-based) | Already handled ✅ |
| **Centered layout** | Left-aligned | Centered | Centered (card) | Centered | Add CSS centering variant |

## Checklist

### Phase 1: UE Model Updates
- [ ] Add `icon` (reference) field — optional icon image above heading (RinvoqHCP lightbulb)
- [ ] Add `recaptchaNotice` (richtext) field — reCAPTCHA legal text shown below form
- [ ] Add `disclaimer` (richtext) field — coverage/formulary disclaimer text below results area
- [ ] Add `filterLabel` (text) field — filter dropdown label for dynamic variant ("Select a filter")
- [ ] Add `indicationLabel` (text) field — indication radio group label ("Choose Indication")
- [ ] Add `indications` (text) field — comma-separated indication options (e.g., "AD,PsA,Ps")
- [ ] Add `submitAsLink` (boolean) field — renders submit as text link instead of button (Mavyret pattern)
- [ ] Update `classes` select to add `card` and `centered` variant options
- [ ] Update `_formulary-lookup.json`, `component-models.json`

### Phase 2: JavaScript Updates
- [ ] Render optional icon image above heading when `icon` field is provided
- [ ] Render reCAPTCHA notice text from `recaptchaNotice` field below the form
- [ ] Render disclaimer richtext from `disclaimer` field below the results area
- [ ] Add filter dropdown to dynamic variant when `filterLabel` is authored
- [ ] Add indication radio group to dynamic/zip variant when `indicationLabel` is authored
- [ ] Include filter and indication values in API query params
- [ ] Support `submitAsLink` — render `<a>` with arrow icon instead of `<button>` for Mavyret
- [ ] Add search icon SVG to submit button via CSS class (no hardcoded SVG in JS)
- [ ] Apply `card` and `centered` variant classes from `block.classList`

### Phase 3: CSS Updates
- [ ] Add `.formulary-lookup.centered` — centers form, max-width constraint, text-align center
- [ ] Add `.formulary-lookup.card` — white background, box-shadow, border-radius, padding (RinvoqHCP card)
- [ ] Add `.formulary-lookup-icon` — icon image above heading, centered
- [ ] Add heading accent underline via `::after` pseudo-element (brand-color, 3px, short width)
- [ ] Add `.formulary-lookup-submit::after` — search icon SVG via CSS background-image
- [ ] Add `.formulary-lookup-submit-link` — styled as text link with arrow for Mavyret variant
- [ ] Add `.formulary-lookup-recaptcha-notice` — small gray text with Privacy Policy/ToS links
- [ ] Add `.formulary-lookup-disclaimer` — light gray disclaimer text, smaller font
- [ ] Add `.formulary-lookup-filter` — filter dropdown matching brand styling
- [ ] Add `.formulary-lookup-indications` — radio button group with brand styling
- [ ] Style validation error message red (`.formulary-lookup-error`)
- [ ] Style floating label pattern for ZIP input (CSS-only, `:focus-within` + `:not(:placeholder-shown)`)

### Phase 4: Brand-Specific Overrides
- [ ] Verify SkyriziHCP: navy submit button, uppercase heading, inline layout, reCAPTCHA notice
- [ ] Verify RinvoqHCP: card container, lightbulb icon, yellow accent underline, filter dropdown, indication radio, purple submit
- [ ] Verify Mavyret: centered state dropdown, submit as text link with arrow, no reCAPTCHA
- [ ] Verify Venclexta: state dropdown on financial support page
- [ ] Update brand `_formulary-lookup.css` overrides if brand-specific token values needed

### Phase 5: Testing
- [ ] Test default variant (state dropdown) — Mavyret pattern with centered layout and link submit
- [ ] Test dynamic variant (state + county) — with filter dropdown and indication radio
- [ ] Test ZIP variant — with reCAPTCHA notice and validation error styling
- [ ] Test card variant — white card container with shadow
- [ ] Test centered variant — centered form layout
- [ ] Test submitAsLink — renders as text link with arrow icon
- [ ] Verify ARIA on new form controls (filter dropdown, indication radio group)
- [ ] Verify mobile responsiveness for new elements
- [ ] Run ESLint and Stylelint

## Updated Variant Matrix

| `classes` Value | CSS Class | Description | Brand Example |
|---|---|---|---|
| — | Default | State dropdown, left-aligned | Mavyret HCP (basic) |
| `dynamic` | `.formulary-dynamic` | State + county cascading, optional filter + indication | RinvoqHCP |
| `zip` | `.formulary-zip` | ZIP code input + submit button | SkyriziHCP, RinvoqHCP |
| `card` | `.formulary-card` | White card container with shadow | RinvoqHCP (combinable) |
| `centered` | `.formulary-centered` | Centered layout, max-width constraint | All brands (combinable) |

## Updated Component Model Fields

| Field | Type | Notes |
|---|---|---|
| `classes` | multiselect | `dynamic`, `zip`, `card`, `centered` (combinable) |
| `heading` | text | Heading text |
| `description` | richtext | Intro text below heading |
| `icon` | reference | Optional icon image above heading |
| `stateLabel` | text | State dropdown label |
| `countyLabel` | text | County dropdown label (dynamic) |
| `zipLabel` | text | ZIP input label (zip) |
| `submitLabel` | text | Submit button text |
| `submitAsLink` | boolean | Render submit as link instead of button |
| `filterLabel` | text | Filter dropdown label (dynamic) |
| `indicationLabel` | text | Indication radio group label |
| `indications` | text | Comma-separated indication values |
| `api` | text | API endpoint URL |
| `recaptchaKey` | text | reCAPTCHA v3 site key |
| `recaptchaNotice` | richtext | Legal text below form |
| `disclaimer` | richtext | Disclaimer text below results |
| `noResultsMsg` | text | No results message |
| `errorMsg` | text | Error message |
| `resultsPerPage` | text | Pagination count |
| `anchorId` | text | Deep-link ID |
| `analyticsId` | text | data-analytics value |

---

*This plan requires Execute mode for implementation.*
