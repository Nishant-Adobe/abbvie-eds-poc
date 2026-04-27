# Formulary Lookup — Pixel-Perfect Authoring & CSS Refinement Plan

## Current State Analysis

Comparing the current EDS rendering (image 1) against the 3 source sites reveals that **the block code and CSS tokens are working correctly** — the visual gaps are primarily due to:

1. **All 3 blocks on the test page use the same `abbvie` brand CSS** — but they should each be on separate pages with different `brand` metadata (`abbvie`, `rinvoq`, `botox`)
2. **Authoring field values don't match source sites** — headings, labels, placeholders, reCAPTCHA text, and disclaimer text need exact values from source
3. **Minor CSS refinements needed** — some spacing, font sizes, and the Mavyret heading needs partial bold support

### Side-by-Side Comparison

| Element | SkyriziHCP Source (image 7) | Current EDS (image 1, block 1) | Gap |
|---|---|---|---|
| Heading | "SEE WHICH PLANS IN YOUR AREA INCLUDE SKYRIZI ON THEIR PREFERRED DRUG FORMULARY" (navy, 16px) | Missing — no heading authored | **Authoring: add heading** |
| ZIP Label | No visible label — uses placeholder "Enter a Zip Code" | "Enter your ZIP code" (visible label) | **Authoring: change label, add placeholder** |
| Submit | "LOOK UP STATUS" + search icon, navy pill | "Search" + search icon, navy pill | **Authoring: change submit-label** |
| reCAPTCHA | "This site is protected by reCAPTCHA..." | Missing | **Authoring: add recaptcha-notice** |
| Disclaimer | Bold coverage disclaimer paragraph | Missing | **Authoring: add disclaimer** |
| Error text | "enter a valid zip code." + "Please" link | "Please enter a valid 5-digit ZIP code." | OK — close enough |

| Element | RinvoqHCP Source (image 7) | Current EDS (image 1, block 2) | Gap |
|---|---|---|---|
| Card | White, rounded, shadow | White card visible ✓ | **OK** |
| Icon | Lightbulb/pin icon | Missing | **Authoring: add icon image** |
| Heading | "Check the Formulary Status for RINVOQ in Your Area" bold + yellow underline | Missing | **Authoring: add heading** |
| Floating label | "*Enter Zip Code" (12px, absolute, white bg) | "Enter your ZIP code" (standard label) | **Authoring: change label text; CSS needs `rinvoq` brand loaded** |
| Filter | "Select a filter" dropdown | Missing | **Authoring: add filter-label + filter-options** |
| Indication | "Choose Indication" with "AD" radio | Missing | **Authoring: add indication-label + indications** |
| Submit | "Look Up Status" magenta pill + search icon | "Search" navy pill (wrong brand CSS) | **Brand CSS: page needs `brand=rinvoq`** |

| Element | Mavyret Source (image 8) | Current EDS (image 1, block 3) | Gap |
|---|---|---|---|
| Heading | "Find MAVYRET Access by State With Our **Formulary Lookup Tool**" | Missing | **Authoring: add heading** |
| Label | "Select State" | "Select your state" | **Authoring: change label** |
| Dropdown | Native select, ~200px, centered | Select "Indiana", full-width at 600px | **Brand CSS: page needs `brand=botox`** |
| Submit | "See Access and Formulary Considerations >" bordered link | Not visible (default variant has no submit) | **CSS: default variant needs no submit shown** |

## Checklist

### Phase 1: Separate into 3 brand-specific test pages (content authoring)
- [ ] **1.1** Create a SkyriziHCP test page with `brand` metadata = `abbvie`
- [ ] **1.2** Create a RinvoqHCP test page with `brand` metadata = `rinvoq`
- [ ] **1.3** Create a Mavyret test page with `brand` metadata = `botox`

### Phase 2: Author SkyriziHCP block (abbvie brand page)
- [ ] **2.1** Variant: `ZIP Code` only (no card, no centered — brand CSS handles centering)
- [ ] **2.2** Heading: `SEE WHICH PLANS IN YOUR AREA INCLUDE SKYRIZI ON THEIR PREFERRED DRUG FORMULARY`
- [ ] **2.3** ZIP Code Input Label: `Enter a Zip Code`
- [ ] **2.4** ZIP Code Placeholder: `Enter a Zip Code`
- [ ] **2.5** Submit Button Label: `LOOK UP STATUS`
- [ ] **2.6** reCAPTCHA Notice Text: `This site is protected by reCAPTCHA and the Google Privacy Policy and Terms of Service apply.` (with links)
- [ ] **2.7** Disclaimer Text: bold coverage requirements paragraph
- [ ] **2.8** All other content fields: leave empty or default
- [ ] **2.9** Configuration: set API endpoint, reCAPTCHA key, results-per-page=10

### Phase 3: Author RinvoqHCP block (rinvoq brand page)
- [ ] **3.1** Variant: `ZIP Code` + `Card Container` + `Centered Layout` (all three)
- [ ] **3.2** Icon: upload lightbulb/location pin icon image
- [ ] **3.3** Heading: `Check the Formulary Status for RINVOQ in Your Area`
- [ ] **3.4** ZIP Code Input Label: `*Enter Zip Code`
- [ ] **3.5** ZIP Code Placeholder: `00000`
- [ ] **3.6** Submit Button Label: `Look Up Status`
- [ ] **3.7** Filter Dropdown Label: `Select a filter`
- [ ] **3.8** Filter Options: `Commercial,Medicare,State Medicaid,Health Exchange,Managed Medicaid`
- [ ] **3.9** Indication Label: `Choose Indication`
- [ ] **3.10** Indications: `AD`
- [ ] **3.11** reCAPTCHA Notice Text: same as SkyriziHCP
- [ ] **3.12** Disclaimer Text: `Preferred means RINVOQ is on a preferred tier or otherwise has preferred status on the plan's formulary.`

### Phase 4: Author Mavyret block (botox brand page)
- [ ] **4.1** Variant: empty (Default — state dropdown)
- [ ] **4.2** Heading: `Find MAVYRET Access by State With Our Formulary Lookup Tool` (use richtext to bold "Formulary Lookup Tool")
- [ ] **4.3** State Dropdown Label: `Select State`
- [ ] **4.4** Submit Button Label: `See Access and Formulary Considerations`
- [ ] **4.5** All filter/indication/reCAPTCHA/disclaimer: leave empty
- [ ] **4.6** Configuration: set API endpoint, results-per-page=10

### Phase 5: CSS refinements for remaining visual gaps
- [ ] **5.1** SkyriziHCP: heading should use `text-transform: uppercase` since source shows all-caps heading — add `--formulary-heading-text-transform` token to base CSS and set to `uppercase` in abbvie override
- [ ] **5.2** RinvoqHCP: verify the floating label visually sits on top of the input border (may need `top` adjustment)
- [ ] **5.3** Mavyret: the default variant (state dropdown) should NOT show a submit button — the source uses a separate CTA link below, not the form submit. Add CSS to hide submit in default variant: `.formulary-lookup:not(.zip) .formulary-lookup-submit { display: none }`
- [ ] **5.4** Mavyret: heading needs richtext support for partial bold — the `description` field (richtext) should be used for this, or the heading should render as `innerHTML` to support `<strong>` tags
- [ ] **5.5** Base CSS: add `--formulary-heading-text-transform` token with `none` default

### Phase 6: Preview verification on each brand page
- [ ] **6.1** Preview SkyriziHCP page — compare against source image 7: navy heading uppercase, ZIP + LOOK UP STATUS pill inline, reCAPTCHA, disclaimer
- [ ] **6.2** Preview RinvoqHCP page — compare against source image 7: card, icon, yellow underline heading, floating label, filter, indication, magenta pill
- [ ] **6.3** Preview Mavyret page — compare against source image 8: centered heading with partial bold, state dropdown, link-style submit with arrow
- [ ] **6.4** Test mobile at 600px breakpoint for each brand

---

*This plan requires Execute mode for implementation. The key insight: each brand variant MUST be on its own page with correct `brand` metadata so the right brand CSS loads. The current test page has all blocks using `abbvie` brand CSS, which is why RinvoqHCP and Mavyret blocks don't match their sources.*
