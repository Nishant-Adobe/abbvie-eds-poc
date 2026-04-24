# Formulary Lookup Block — Enhancement Plan

## Overview
The `formulary-lookup` block exists with a basic state-dropdown implementation. It needs to be enhanced to match the AEM Block Requirements spec — supporting 3 variants (state dropdown, dynamic state+county, ZIP code), reCAPTCHA integration, paginated results table, and multi-brand usage across SkyriziHCP, RinvoqHCP, Venclexta, and Mavyret (4 brands / 4 pages).

## Current State Analysis

### What Exists
- **JS** (`blocks/formulary-lookup/formulary-lookup.js`): Basic state dropdown → API fetch → plan cards display. Single variant only, no pagination, no ZIP input, no county cascading, no reCAPTCHA.
- **CSS** (`blocks/formulary-lookup/formulary-lookup.css`): 58 lines. Plan cards as grid. No table layout, no pagination styles, no variant-specific styles.
- **UE Model** (`_formulary-lookup.json`): 3 content fields (heading, description, state-label) + 3 config fields (api, no-results, error). No `classes` variant select, no county/ZIP fields, no reCAPTCHA site key, no pagination config.
- **Brand overrides**: Scaffolded for `abbvie`, `botox`, `rinvoq` — all CSS-only placeholders with no actual overrides. No overrides for the 4 target brands (skyrizihcp, rinvoqhcp, venclexta, mavyret).
- **Component filters**: `formulary-lookup` is **not listed** in the section/grid-section filter — needs to be added for authors to place it.
- **reCAPTCHA**: A reusable module exists at `blocks/eds-form/recaptcha.js` with `loadRecaptcha()` and `getRecaptchaToken()` functions.

### Gap Analysis (Current vs. Spec Requirements)

| Requirement | Current | Gap |
|---|---|---|
| **3 variants**: default (static state), `dynamic` (state+county API), `zip` | State dropdown only | Missing `classes` select in model; no variant branching in JS |
| **ZIP code input mode** | Not implemented | Need ZIP input UI, validation, API call with `?zip=` |
| **County cascading dropdown** | Not implemented | Need county fetch after state selection, second dropdown |
| **reCAPTCHA integration** | Not in this block | Need `recaptcha-key` field; import from eds-form/recaptcha.js |
| **Paginated results table** | Plan cards, no pagination | Need `<table>` layout + pagination controls + results-per-page config |
| **API endpoint select (prod/stage/int)** | Freetext URL | Spec says `select` resolved from brand metadata; current freetext is more flexible — keep freetext but add guidance |
| **All strings authorable** | Yes for existing strings | Need additional labels: county-label, zip-label, submit-label, plus pagination labels |
| **Loading state** | Text "Loading…" | Need CSS skeleton/spinner |
| **Error via aria-live** | Yes | ✓ Already present |
| **Visible labels (no placeholder-only)** | Yes | ✓ Already present |
| **Component filter** | Not in section filter | Must add to section + grid-section filters |
| **Brand overrides** | abbvie/botox/rinvoq scaffolded | Need overrides for 4 target brands or use existing brand tokens |
| **Analytics** | None | Need `analyticsId` field → `data-analytics` attribute on submit |

## Checklist

### Phase 1: UE Component Model Updates
- [ ] **1.1** Add `classes` select field to formulary-lookup model with 3 options: Default (empty), Dynamic (`dynamic`), ZIP Code (`zip`)
- [ ] **1.2** Add new content fields: `county-label` (text, "Select your county"), `zip-label` (text, "Enter your ZIP code"), `submit-label` (text, "Search")
- [ ] **1.3** Add configuration fields: `recaptcha-key` (text, reCAPTCHA v3 site key), `results-per-page` (text, default "10"), `pagination-label` (text, default "Showing {start}–{end} of {total}")
- [ ] **1.4** Add `analyticsId` text field for tracking
- [ ] **1.5** Update `_formulary-lookup.json` with all new fields
- [ ] **1.6** Merge updated model into global `component-models.json`
- [ ] **1.7** Add `formulary-lookup` to the section and grid-section filters in `component-filters.json`

### Phase 2: JavaScript Enhancement
- [ ] **2.1** Refactor `decorate()` to detect variant from `block.classList.contains('dynamic')` / `block.classList.contains('zip')`
- [ ] **2.2** Implement **default variant** (current state-dropdown behavior) — keep existing logic, add pagination + table rendering
- [ ] **2.3** Implement **`dynamic` variant** — state dropdown triggers county list fetch from API; county dropdown triggers results fetch; two-step cascading form
- [ ] **2.4** Implement **`zip` variant** — ZIP code `<input>` (pattern `[0-9]{5}`, inputmode `numeric`) + submit button; fetches `${api}?zip=${zip}`
- [ ] **2.5** Integrate reCAPTCHA — import `getRecaptchaToken` from `../eds-form/recaptcha.js`; if `config['recaptcha-key']` is set, obtain token before API call, pass as `recaptcha-token` header or query param
- [ ] **2.6** Build **paginated results table** — render results as `<table>` with `<thead>` (Name, Tier, Details columns) + `<tbody>` rows; show `config['results-per-page']` at a time; add Prev/Next pagination controls
- [ ] **2.7** Add **loading spinner** — CSS-only spinner during API fetch; replace "Loading…" text
- [ ] **2.8** Add `data-analytics` attribute on submit/select action from `config.analyticsId`
- [ ] **2.9** Ensure ARIA compliance: `aria-live="polite"` on status, visible `<label>` for all inputs, `aria-label` on pagination buttons

### Phase 3: CSS Enhancement
- [ ] **3.1** Add styles for ZIP input form layout (input + submit button in flex row)
- [ ] **3.2** Add styles for county cascading dropdown (second dropdown below state)
- [ ] **3.3** Add results table styles — `.formulary-results-table`, `.formulary-results-thead`, `.formulary-results-row`, responsive horizontal scroll on mobile
- [ ] **3.4** Add pagination control styles — `.formulary-pagination`, prev/next buttons, page info text
- [ ] **3.5** Add loading spinner CSS — `.formulary-loading` keyframe animation
- [ ] **3.6** Add mobile responsiveness — stack form elements vertically below 600px, table horizontal scroll
- [ ] **3.7** Ensure all colors/spacing use CSS custom properties with fallbacks (existing pattern)

### Phase 4: Brand Overrides
- [ ] **4.1** Verify existing brand token variables (`--brand-primary`, `--link-color`, etc.) are sufficient for formulary visual branding across SkyriziHCP, RinvoqHCP, Venclexta, Mavyret
- [ ] **4.2** Add brand-specific token overrides if needed (e.g., `--formulary-tier-bg` per brand)
- [ ] **4.3** Ensure brand `block-config.js` files remain empty (no JS-level brand customization needed)

### Phase 5: Testing & Validation
- [ ] **5.1** Create test content page with all 3 variants (default, dynamic, zip)
- [ ] **5.2** Verify default variant: state select → API fetch → table results with pagination
- [ ] **5.3** Verify dynamic variant: state select → county dropdown populates → county select → results
- [ ] **5.4** Verify zip variant: ZIP input → submit → results table
- [ ] **5.5** Verify reCAPTCHA integration (when key provided) — token obtained and sent with request
- [ ] **5.6** Verify pagination: forward/back navigation, page count display, edge cases (0 results, 1 page, many pages)
- [ ] **5.7** Verify accessibility: keyboard navigation, screen reader announcements, visible labels
- [ ] **5.8** Verify mobile responsiveness: form layout, table scroll
- [ ] **5.9** Verify no-API fallback: error message shown gracefully when API not configured
- [ ] **5.10** Run linting and verify no regressions in existing blocks

## Architecture Decisions

### Variant Detection
Use `block.classList.contains()` pattern (same as accordion block) to branch behavior based on authored `classes` field:
```js
const isDynamic = block.classList.contains('dynamic');
const isZip = block.classList.contains('zip');
```

### reCAPTCHA Module Reuse
Import the existing `recaptcha.js` from `eds-form` block rather than duplicating:
```js
import { getRecaptchaToken } from '../eds-form/recaptcha.js';
```

### Pagination Strategy
Client-side pagination on the full result set returned by the API. The API may return all results for a state/county/ZIP; JS paginates locally based on `results-per-page` config. This avoids multiple API calls for page changes and matches the AEM source behavior.

### Results Rendering
Switch from plan cards (current) to accessible `<table>` with column headers. This matches the spec's "paginated results table" requirement and improves screen reader UX for tabular data.

### File Structure After Changes
```
blocks/formulary-lookup/
├── formulary-lookup.js          # Enhanced with 3 variants, reCAPTCHA, pagination
├── formulary-lookup.css          # Enhanced with table, pagination, loading, ZIP styles
├── _formulary-lookup.json        # Updated UE model with classes, new fields
├── block-config.js               # Unchanged (empty)
├── abbvie/                       # Existing scaffold — may add token overrides
├── botox/                        # Existing scaffold
└── rinvoq/                       # Existing scaffold
```

### Key CSS Classes (JS-produced)
```
formulary-lookup              (block wrapper — existing)
formulary-lookup-form          (form container — existing)
formulary-lookup-heading       (h2 heading — existing)
formulary-lookup-description   (intro text — existing)
formulary-lookup-label         (input label — existing)
formulary-lookup-select        (state/county dropdown — existing)
formulary-lookup-zip-input     (ZIP input — NEW)
formulary-lookup-submit        (submit button — NEW)
formulary-lookup-status        (status message — existing)
formulary-lookup-loading       (spinner wrapper — NEW)
formulary-lookup-results       (results container — existing, now table)
formulary-results-table        (results table — NEW)
formulary-pagination           (pagination controls — NEW)
formulary-pagination-btn       (prev/next buttons — NEW)
formulary-pagination-info      (page info text — NEW)
```

## Risk & Complexity Notes
- **HIGH complexity** per the spec — API integration, reCAPTCHA, multiple variants, pagination
- The existing `recaptcha.js` module is proven and can be imported directly
- Brand-specific API endpoints are authored per block instance, not hardcoded — this simplifies multi-brand support
- No existing tests for this block; testing will be manual via preview server
- The `formulary-lookup` must be added to component filters before authors can place it in pages

---

*This plan requires Execute mode for implementation.*
