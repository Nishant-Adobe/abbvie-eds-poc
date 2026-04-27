# Formulary Lookup — Pixel-Perfect Migration Fix Plan

## Problem Statement

The formulary-lookup block has been updated locally (`_formulary-lookup.json`) with new fields but the **global `component-models.json`** still contains the OLD model. This is why the Universal Editor only shows the original 8 content fields and 6 config fields — it reads from the global file. Additionally, the rendered output (image 1) shows generic unstyled blocks because brand CSS isn't loading in the authoring environment.

### Issues Identified

1. **Global `component-models.json` not updated** — still has old model at lines 9314–9434 (no icon, zip-placeholder, filter, indication, recaptcha-notice, disclaimer fields; old single-select variant)
2. **Variant field is single `select`** in global model — needs to be `multiselect` to support `card` + `centered` combos for RinvoqHCP
3. **Rendered output uses base CSS only** — brand CSS from `styles/{brand}/blocks/...` needs the page `brand` metadata to load
4. **Visual gaps vs source sites** — current rendering (image 1) doesn't match SkyriziHCP navy pill, RinvoqHCP card/floating-label/magenta, or Mavyret orange-bordered styles

### Target Visual Fidelity

| Brand | Source Reference | Key Visual Elements |
|---|---|---|
| SkyriziHCP (abbvie) | Image 5 | Centered ZIP input + navy pill "LOOK UP STATUS" with search icon, reCAPTCHA notice, bold disclaimer |
| RinvoqHCP (rinvoq) | Image 3 | White card with shadow, lightbulb icon, yellow brushstroke underline, floating label, filter dropdown, indication radio, magenta pill "Look Up Status" |
| Mavyret (botox) | Image 2 | Centered state dropdown, 2px black border, orange-bordered submit button, simple clean layout |

## Checklist

### Phase 1: Merge updated model into global component-models.json
- [ ] **1.1** Replace old formulary-lookup model (lines 9314–9434) in `component-models.json` with the updated model from `_formulary-lookup.json` — adds: icon, zip-placeholder, filter-label, filter-options, indication-label, indications, recaptcha-notice, disclaimer fields; changes variant to multiselect with card/centered options
- [ ] **1.2** Validate the merged JSON is syntactically correct (`node -e "require('./component-models.json')"`)
- [ ] **1.3** Verify the field count matches local model (24 fields)

### Phase 2: Verify brand CSS is loading in authoring preview
- [ ] **2.1** Confirm `styles/abbvie/blocks/formulary-lookup/formulary-lookup.css` exists and contains SkyriziHCP token overrides (navy submit bg, 30px border-radius, 300px input, centered)
- [ ] **2.2** Confirm `styles/rinvoq/blocks/formulary-lookup/formulary-lookup.css` exists and contains RinvoqHCP token overrides (magenta submit, card tokens, floating labels, heading accent)
- [ ] **2.3** Confirm `styles/botox/blocks/formulary-lookup/formulary-lookup.css` exists and contains Mavyret token overrides (black border, orange submit shadow, 388px centered form)
- [ ] **2.4** Check that page `brand` metadata is set correctly so `aem.js getBrandPath()` resolves the right brand CSS file

### Phase 3: CSS pixel-perfect adjustments
- [ ] **3.1** SkyriziHCP (abbvie): Verify submit button renders as navy pill with search icon (`--formulary-submit-icon-display: inline-block`), ZIP input is 300px, centered layout via `--formulary-text-align: center`
- [ ] **3.2** RinvoqHCP (rinvoq): Verify card container renders with white bg + shadow + 10px radius, heading has yellow underline accent, floating label sits above input border, filter dropdown + indication radio render, magenta pill button with search icon
- [ ] **3.3** Mavyret (botox): Verify state dropdown has 2px solid black border, centered form at 388px max-width, submit button has white bg with orange border + shadow
- [ ] **3.4** Fix any remaining visual discrepancies vs source screenshots after preview testing

### Phase 4: Preview and validate all 3 brands
- [ ] **4.1** Navigate to SkyriziHCP formulary page in preview, compare against source image 5 — check submit pill, input sizing, reCAPTCHA notice, disclaimer
- [ ] **4.2** Navigate to RinvoqHCP formulary page in preview, compare against source image 3 — check card, icon, yellow underline, floating label, filter, indication, magenta pill
- [ ] **4.3** Navigate to Mavyret formulary page in preview, compare against source image 2 — check state dropdown, orange submit, centered layout
- [ ] **4.4** Test mobile responsiveness at 600px breakpoint for all 3 brands

---

*This plan requires Execute mode for implementation. The critical fix is Phase 1 — merging the updated model into component-models.json so the UE shows all new fields.*
