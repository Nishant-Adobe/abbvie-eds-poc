# Formulary Lookup Block — Complete Implementation & Authoring Plan

## Block Status: COMPLETE

The formulary-lookup block is fully implemented with all three brand variants. Here is the complete inventory of files, what they do, and how to author each variant.

## File Inventory

### Core Files
| File | Purpose |
|---|---|
| `blocks/formulary-lookup/formulary-lookup.js` | Main JS — 537 lines, 3 variants (default/dynamic/zip), filter, indication, reCAPTCHA, pagination, richtext heading, icon |
| `blocks/formulary-lookup/formulary-lookup.css` | Base CSS — 422 lines, 40+ brand-overridable tokens, card/centered variants, responsive |
| `blocks/formulary-lookup/_formulary-lookup.json` | Local UE component definition + model |
| `blocks/formulary-lookup/block-config.js` | Empty config stub |

### Brand CSS (loaded by aem.js)
| File | Brand | Key Styles |
|---|---|---|
| `styles/abbvie/blocks/formulary-lookup/formulary-lookup.css` | SkyriziHCP | Navy text, inline ZIP+button at 600px, pill submit, uppercase heading, search icon |
| `styles/rinvoq/blocks/formulary-lookup/formulary-lookup.css` | RinvoqHCP | Card+shadow, floating label, magenta pill, yellow underline, 390px stacked form |
| `styles/botox/blocks/formulary-lookup/formulary-lookup.css` | Mavyret | Centered dropdown, link-style submit with arrow, 400px form |

### Global Config (UE reads from these)
| File | What Changed |
|---|---|
| `component-models.json` (lines 9314-9492) | 24 fields: multiselect variant, icon, richtext heading/description, zip-placeholder, filter, indication, recaptcha-notice, disclaimer |
| `component-definition.json` (line 1231) | Block definition with xwalk template |
| `component-filters.json` (lines 53, 98) | Listed in section + grid-section filters |

## JS Variants & DOM Output

### Default Variant (no class — Mavyret)
```
label → select (state dropdown) → status → results
```
Auto-submits on state change. No submit button rendered.

### Dynamic Variant (`dynamic` class)
```
label → select (state) → county-wrapper [label → select (county)] → status → results
```
State change fetches counties, county change fetches results.

### ZIP Variant (`zip` class — SkyriziHCP, RinvoqHCP)
```
form [label → input-group [input + button]] → [filter?] → [indication?] → status → results
```
When filter/indication present: button moves below them (stacked layout for Rinvoq).

### Common Elements (all variants)
- Icon (optional, above heading)
- Heading (richtext, supports `<strong>` for partial bold)
- Description (richtext)
- reCAPTCHA notice (below form)
- Disclaimer (below results)

## Checklist

### Phase 1: Push to Remote (BLOCKER)
- [ ] **1.1** Commit all changes on `formulary-lookup` branch
- [ ] **1.2** Push branch to remote origin
- [ ] **1.3** Wait for AEM Cloud sync (~30 seconds)
- [ ] **1.4** Refresh UE — confirm "Formulary Lookup" appears in block picker when searching

### Phase 2: Author SkyriziHCP (brand=abbvie page)

**Content Tab:**
- [ ] **2.1** Variant & Layout: select `ZIP Code` only
- [ ] **2.2** Icon: leave empty
- [ ] **2.3** Heading: `SEE WHICH PLANS IN YOUR AREA INCLUDE SKYRIZI ON THEIR PREFERRED DRUG FORMULARY`
- [ ] **2.4** Description: leave empty
- [ ] **2.5** State/County labels: defaults
- [ ] **2.6** ZIP Code Input Label: `Enter a Zip Code`
- [ ] **2.7** ZIP Code Placeholder: `Enter a Zip Code`
- [ ] **2.8** Submit Button Label: `LOOK UP STATUS`
- [ ] **2.9** Filter/Indication: all empty

**Configuration Tab:**
- [ ] **2.10** API Endpoint: your Skyrizi API URL
- [ ] **2.11** reCAPTCHA Site Key: your v3 key
- [ ] **2.12** Results Per Page: `10`
- [ ] **2.13** No Results: `No results were found, please try another selection`
- [ ] **2.14** Error: `The data was not able to be loaded. Please try again.`
- [ ] **2.15** reCAPTCHA Notice: `This site is protected by reCAPTCHA and the Google <a href="https://policies.google.com/privacy" target="_blank">Privacy Policy</a> and <a href="https://policies.google.com/terms" target="_blank">Terms of Service</a> apply.`
- [ ] **2.16** Disclaimer: `<p><strong>Coverage requirements and benefits designs vary by payer and may change over time. Please consult with payers directly for the most current reimbursement policies. The health plans and/or pharmacy benefit managers listed here have not endorsed and are not affiliated with this material.</strong></p><p>Local can include national, regional, state, State Medicaid, and Managed Medicaid plans within the given geography.</p>`
- [ ] **2.17** Page metadata: `brand` = `abbvie`

### Phase 3: Author RinvoqHCP (brand=rinvoq page)

**Content Tab:**
- [ ] **3.1** Variant & Layout: select `ZIP Code` + `Card Container` + `Centered Layout`
- [ ] **3.2** Icon: upload lightbulb/pin icon from DAM
- [ ] **3.3** Heading: `Check the Formulary Status for RINVOQ in Your Area`
- [ ] **3.4** Description: leave empty
- [ ] **3.5** ZIP Code Input Label: `*Enter Zip Code`
- [ ] **3.6** ZIP Code Placeholder: `00000`
- [ ] **3.7** Submit Button Label: `Look Up Status`
- [ ] **3.8** Filter Dropdown Label: `Select a filter`
- [ ] **3.9** Filter Options: `Commercial,Medicare,State Medicaid,Health Exchange,Managed Medicaid`
- [ ] **3.10** Indication Label: `Choose Indication`
- [ ] **3.11** Indications: `AD`

**Configuration Tab:**
- [ ] **3.12** API Endpoint: your Rinvoq API URL
- [ ] **3.13** reCAPTCHA Site Key: your v3 key
- [ ] **3.14** Results Per Page: `10`
- [ ] **3.15** No Results: `No results were found, please try another selection`
- [ ] **3.16** Error: `The data was not able to be loaded. Please try again.`
- [ ] **3.17** reCAPTCHA Notice: same as SkyriziHCP
- [ ] **3.18** Disclaimer: `<strong>Preferred means RINVOQ is on a preferred tier or otherwise has preferred status on the plan's formulary.</strong>`
- [ ] **3.19** Page metadata: `brand` = `rinvoq`

### Phase 4: Author Mavyret (brand=botox page)

**Content Tab:**
- [ ] **4.1** Variant & Layout: leave empty (Default — state dropdown)
- [ ] **4.2** Icon: leave empty
- [ ] **4.3** Heading (richtext): `Find MAVYRET Access by State With Our <strong>Formulary Lookup Tool</strong>`
- [ ] **4.4** Description: leave empty
- [ ] **4.5** State Dropdown Label: `Select State`
- [ ] **4.6** ZIP/Filter/Indication: all empty
- [ ] **4.7** Submit Button Label: leave empty or default

**Configuration Tab:**
- [ ] **4.8** API Endpoint: your Mavyret API URL (or JSON path)
- [ ] **4.9** reCAPTCHA: leave empty
- [ ] **4.10** Results Per Page: `10`
- [ ] **4.11** No Results: `Please select a state`
- [ ] **4.12** Error: `No results`
- [ ] **4.13** reCAPTCHA Notice: leave empty
- [ ] **4.14** Disclaimer: leave empty
- [ ] **4.15** Page metadata: `brand` = `botox`
- [ ] **4.16** Add a **separate CTA block** below the formulary with text "See Access and Formulary Considerations" (this is a distinct component in the source, not part of formulary-lookup)

### Phase 5: Visual QA
- [ ] **5.1** Preview SkyriziHCP — navy heading, inline ZIP+button, reCAPTCHA, disclaimer
- [ ] **5.2** Preview RinvoqHCP — white card, icon+heading+yellow underline, floating label, filter, indication, magenta pill
- [ ] **5.3** Preview Mavyret — centered heading with partial bold, state dropdown, no submit button
- [ ] **5.4** Mobile test at 600px all three brands
- [ ] **5.5** Fix any CSS discrepancies (Execute mode)

---

*Phase 1 (push to remote) is the critical blocker — without it, the UE cannot see the block. Phases 2-4 are manual UE authoring using the exact values above. Phase 5 may require Execute mode for CSS fixes.*
