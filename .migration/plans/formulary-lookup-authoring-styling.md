# Formulary Lookup — Authoring & Pixel-Perfect Styling Plan

## Objective
Create three separate branded test pages (one per brand) for the formulary-lookup block, each authored with the correct content values matching the original source sites. Then refine the CSS for pixel-perfect match against the provided screenshots.

---

## Brand → Page Mapping

| Brand | CSS Brand Key | Source Site | Variant | Page File |
|---|---|---|---|---|
| SkyriziHCP | `abbvie` | `skyrizihcp.com/dermatology/coverage-access` | `zip`, `centered` | `content/formulary-skyrizi.plain.html` |
| RinvoqHCP | `rinvoq` | `rinvoqhcp.com/dermatology/access` | `zip`, `card`, `centered` | `content/formulary-rinvoq.plain.html` |
| Mavyret HCP | `botox` | `mavyret.com/hcp/access` | (default state), `centered` | `content/formulary-mavyret.plain.html` |

Each page must include `<meta name="brand" content="{brand}">` in the metadata block so the brand CSS loads at runtime.

---

## Phase 1: Author Three Branded Test Pages

### 1A — SkyriziHCP (abbvie brand)

**Content from screenshot:**
- **Variant**: `zip`, `centered`
- **Heading**: `SEE WHICH PLANS IN YOUR AREA INCLUDE SKYRIZI ON THEIR PREFERRED DRUG FORMULARY` (word "FORMULARY" has highlighted/bold emphasis)
- **Zip Label**: `Enter a Zip Code`
- **Zip Placeholder**: `Enter a Zip Code`
- **Submit Label**: `LOOK UP STATUS`
- **reCAPTCHA Notice**: `This site is protected by reCAPTCHA and the Google Privacy Policy and Terms of Service apply.`
- **Disclaimer**: `Coverage requirements and benefits designs vary by payer and may change over time. Please consult with payers directly for the most current reimbursement policies. The health plans and/or pharmacy benefit managers listed here have not endorsed and are not affiliated with this material.` + second paragraph: `Local can include national, regional, state, State Medicaid, and Managed Medicaid plans within the given geography.`
- **Metadata**: `brand: abbvie`

### 1B — RinvoqHCP (rinvoq brand)

**Content from screenshot:**
- **Variant**: `zip`, `card`, `centered`
- **Icon**: clipboard/formulary icon image (if available, or empty)
- **Heading**: `Check the Formulary Status for RINVOQ in Your Area`
- **Zip Label**: `*Enter Zip Code`
- **Zip Placeholder**: `00000`
- **Submit Label**: `Look Up Status`
- **Filter Label**: `Select a filter`
- **Filter Options**: `Commercial,Medicare,State Medicaid,Health Exchange,Managed Medicaid`
- **Indication Label**: `Choose Indication`
- **Indications**: `AD`
- **reCAPTCHA Notice**: `This site is protected by reCAPTCHA and the Google Privacy Policy and Terms of Service apply.`
- **Disclaimer**: `Preferred means RINVOQ is on a preferred tier or otherwise has preferred status on the plan's formulary.`
- **Metadata**: `brand: rinvoq`

### 1C — Mavyret HCP (botox brand)

**Content from screenshot:**
- **Variant**: (default — state dropdown), `centered`
- **Heading**: `Find MAVYRET Access by State With Our <strong>Formulary Lookup Tool</strong>`
- **State Label**: `Select State`
- **Submit Label**: `See Access and Formulary Considerations`
- **Disclaimer**: `Data feed for formulary lookup tool refreshed monthly. Coverage requirements and benefit designs vary by payer and may change over time. Please consult with payers directly for the most current reimbursement policies. The health plans and/or pharmacy benefit managers listed here have not endorsed and are not affiliated with this material.` + definitions paragraph for *Exclusive*, **Preferred**, **Available**.
- **Metadata**: `brand: botox`

---

## Phase 2: CSS Gap Analysis & Fixes

### 2A — SkyriziHCP (`styles/abbvie/blocks/formulary-lookup/formulary-lookup.css`)

Current state vs. screenshot gaps:

| Property | Current | Target (Screenshot) | Fix |
|---|---|---|---|
| Heading color | `rgb(33 64 109)` navy | Light blue / teal on light-blue section background | Verify — section background may come from parent section styling, not block |
| Heading `text-transform` | `uppercase` ✓ | `uppercase` ✓ | OK |
| Input + button layout | Inline flex row ✓ | Inline row, input wider, button right ✓ | OK — verify widths |
| Submit button | Navy pill `rgb(7 29 73)`, search icon ✓ | Navy pill with search icon ✓ | OK |
| Submit `text-transform` | Not set | `LOOK UP STATUS` (uppercase in content) | Author content in uppercase — no CSS change |
| reCAPTCHA notice | 11px, centered ✓ | Small centered text ✓ | OK |
| Disclaimer | 13px, max-width 700px | Multi-paragraph, smaller text, centered | May need multi-paragraph support in disclaimer |
| Section background | Not block-level | Light blue gradient section background | **Section-level styling** — outside block scope |

**CSS changes needed:** Minimal — mostly authoring. May need to support line breaks in disclaimer via `white-space` or allow `<br>` in richtext.

### 2B — RinvoqHCP (`styles/rinvoq/blocks/formulary-lookup/formulary-lookup.css`)

| Property | Current | Target (Screenshot) | Fix |
|---|---|---|---|
| Card container | White, 10px radius, shadow ✓ | White card with shadow ✓ | OK |
| Heading accent underline | Yellow `rgb(218 170 0)`, 4px, 80% width | Yellow-gold bar under heading ✓ | OK |
| Floating label | Absolute positioned, 12px, white bg ✓ | `*Enter Zip Code` floated above input ✓ | OK |
| Filter dropdown | 390px, 10px radius ✓ | Filter with checkbox panel ✓ | OK |
| Filter selected state | `rgb(200 220 255)` | Blue highlight on "Commercial" ✓ | OK |
| Indication radio | Left-aligned, "Choose Indication" heading ✓ | Left-aligned with radio buttons ✓ | OK |
| Submit button | Magenta `rgb(144 18 74)`, pill, search icon ✓ | Dark magenta pill with search icon ✓ | OK |
| Submit margin | `margin: 16px auto` | Centered below indications | OK |
| Card padding | 24px | May need more top/bottom | Check if 24px matches |
| Icon | Not rendered (no src) | Clipboard icon to left of heading | Need icon image asset + heading flex layout for icon+text side-by-side |

**CSS changes needed:**
- [ ] **Icon + heading side-by-side layout**: The screenshot shows icon to the *left* of the heading text, not above. Need flex layout for `.formulary-lookup-icon` + `.formulary-lookup-heading` when both present. Currently icon is `display: block` above heading. Need a wrapper or flex on `.formulary-lookup-form` first children.
- [ ] Verify card padding matches (current 24px may need `24px 20px` per screenshot DevTools showing `padding: 24px 20px`)

### 2C — Mavyret HCP (`styles/botox/blocks/formulary-lookup/formulary-lookup.css`)

| Property | Current | Target (Screenshot) | Fix |
|---|---|---|---|
| Heading | 22px, normal weight, black | Normal weight with bold `<strong>` on "Formulary Lookup Tool" ✓ | OK via authored `<strong>` |
| State dropdown | 300px, 1px solid `#aaa`, 4px radius | Native select, centered | OK |
| Submit button | Transparent bg, `1px solid #aaa`, `>` arrow | **Green bg `rgb(88 166 52)` or similar**, white text, `>` arrow | **MAJOR GAP** — screenshot shows green solid button, current is transparent bordered |
| Submit hover | `bg: rgb(51 51 51)`, white text | Unknown | Keep as-is or match green hover |
| Disclaimer modal | Not supported | Screenshot shows a modal overlay with definitions | **Not block responsibility** — modal is separate UI. Block disclaimer could show inline text. |
| Form centering | `max-width: 400px`, `margin-inline: auto` ✓ | Centered ✓ | OK |
| Section background | Not block-level | White section on dark outer background | Section-level styling |

**CSS changes needed:**
- [ ] **Submit button color**: Change from transparent/bordered to green solid background `rgb(88 166 52)` (or exact color from Mavyret brand), white text, maintain `>` arrow
- [ ] **Submit button padding**: Adjust for green button visual weight
- [ ] May need `font-weight: 600` on submit for the green button style

---

## Phase 3: JS Changes

### 3A — Icon + Heading Layout Fix
The RinvoqHCP screenshot shows the clipboard icon **beside** the heading (flex row), not above it. The current JS creates them as separate block-level elements. Options:
- **Option A (CSS-only)**: Add flex row to `.formulary-lookup-form` when icon is present. Use `:has(.formulary-lookup-icon)` selector on the form or heading area.
- **Option B (JS change)**: Wrap icon + heading in a `div.formulary-lookup-header` flex container.

**Recommendation**: Option B (JS change) — more reliable cross-browser, cleaner semantics.

### 3B — Submit Button in Default Variant
The Mavyret screenshot shows a submit button below the state dropdown. Current `buildDefaultVariant` only renders a `<select>` with auto-submit on `change`. Need to add an optional submit button when `submit-label` is configured and variant is default.

---

## Phase 4: Verification

Each branded page must be previewed individually with the local dev server and compared against the corresponding screenshot.

---

## Checklist

### Authoring
- [ ] **1.1** Create `content/formulary-skyrizi.plain.html` with SkyriziHCP content + `brand: abbvie` metadata
- [ ] **1.2** Create `content/formulary-rinvoq.plain.html` with RinvoqHCP content + `brand: rinvoq` metadata
- [ ] **1.3** Create `content/formulary-mavyret.plain.html` with Mavyret content + `brand: botox` metadata

### JS Fixes
- [ ] **2.1** Add `div.formulary-lookup-header` wrapper around icon + heading in `decorate()` for flex row layout
- [ ] **2.2** Add optional submit button to `buildDefaultVariant` when `submit-label` is configured (for Mavyret pattern)

### CSS — Base (`formulary-lookup.css`)
- [ ] **3.1** Add `.formulary-lookup-header` flex row styles (icon left, heading right, centered vertically)

### CSS — SkyriziHCP (`styles/abbvie/blocks/formulary-lookup/formulary-lookup.css`)
- [ ] **3.2** Verify input + button widths match screenshot (input ~300px, button ~240px)
- [ ] **3.3** Add multi-line disclaimer support if needed

### CSS — RinvoqHCP (`styles/rinvoq/blocks/formulary-lookup/formulary-lookup.css`)
- [ ] **3.4** Adjust card padding to `24px 20px` if needed per DevTools
- [ ] **3.5** Add `.formulary-lookup-header` flex styling for icon beside heading

### CSS — Mavyret (`styles/botox/blocks/formulary-lookup/formulary-lookup.css`)
- [ ] **3.6** Change submit button from transparent/bordered to green solid: `--formulary-submit-bg: rgb(88 166 52)`, `--formulary-submit-color: #fff`, `--formulary-submit-border: none`
- [ ] **3.7** Adjust submit button padding and font-weight for green button style
- [ ] **3.8** Keep `>` arrow on submit via `::after` content

### Verification
- [ ] **4.1** Preview SkyriziHCP page — compare against screenshot (navy theme, zip+button inline, uppercase heading)
- [ ] **4.2** Preview RinvoqHCP page — compare against screenshot (card, icon+heading, filter, radio, magenta pill)
- [ ] **4.3** Preview Mavyret page — compare against screenshot (state dropdown, green submit button, bold heading partial)
- [ ] **4.4** Test mobile responsiveness at 600px breakpoint for all 3 variants

---

## Notes

- **Brand CSS loading**: Page-level `<meta name="brand" content="rinvoq">` triggers `styles/rinvoq/blocks/formulary-lookup/formulary-lookup.css` loading via `aem.js` `getBrandPath()`.
- **Section backgrounds**: The light-blue background on SkyriziHCP and dark background on Mavyret are section-level styles, not formulary-lookup block responsibility. They are out of scope for this plan unless explicitly requested.
- **Disclaimer modal** (Mavyret): The overlay with definitions shown in the screenshot is a separate modal component, not part of the formulary-lookup block.
- **Execution requires switching to Execute mode.**
