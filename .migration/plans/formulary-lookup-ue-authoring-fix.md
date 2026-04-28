# Formulary Lookup — UE Authoring Fix Plan

## Problem Analysis

The block renders correctly in **local preview** (`.plain.html` served via `--html-folder`) but breaks in the **Universal Editor** because the DOM structure differs:

### Local preview (`.plain.html`) — works
```html
<div class="formulary-lookup zip centered">
  <div><div>heading</div><div>SEE WHICH PLANS...</div></div>   <!-- 2 cells: key + value -->
  <div><div>zip-label</div><div>Enter a Zip Code</div></div>
  ...
</div>
```

### UE / xwalk rendering — broken
```html
<div class="formulary-lookup zip centered">
  <div><div></div></div>                          <!-- row 1: icon (empty, reference) -->
  <div><div data-richtext-prop="heading">...</div></div>  <!-- row 2: heading (1 cell, richtext) -->
  <div><div></div></div>                          <!-- row 3: description (empty) -->
  <div><div data-aue-prop="state-label">Select your state</div></div> <!-- row 4 -->
  ...
</div>
```

**Key differences:**
1. UE rows have **1 cell** (only the value), not 2 cells (key + value)
2. Field identity comes from `data-aue-prop` or `data-richtext-prop` attributes, not text content
3. Richtext fields have their content inside `<p>` tags with `data-richtext-prop` attributes
4. Empty fields render as `<div></div>` with no attributes
5. The `classes` field is applied as CSS classes on the block element (not a row) — this part works

### Current `parseConfig` behavior in UE
Since there's only 1 cell per row, `cells[0]` is the value cell. The key extraction `cells[0]?.textContent.trim().toLowerCase()` reads the **value text** as the key (e.g., "select your state" becomes the key instead of "state-label"). The value then falls back to `cells[0]` since `cells[1]` doesn't exist. This produces garbage config.

## Solution

Upgrade `parseConfig` to handle both DOM structures:
1. **Detect mode**: If `cells.length === 1` and the cell (or its children) has `data-aue-prop` or `data-richtext-prop`, use UE mode
2. **UE mode**: Extract key from `data-aue-prop` / `data-richtext-prop` attributes; value from innerHTML/textContent
3. **Fallback mode** (existing): Use `cells[0]` as key, `cells[1]` as value (`.plain.html` format)

Additionally, the model field order must be used to map positional rows when attributes are missing (empty fields in UE have no `data-aue-prop`).

### Model field order (from `_formulary-lookup.json`, excluding `tab` and `classes` fields):
| Position | Field Name | Type |
|---|---|---|
| 0 | icon | reference |
| 1 | heading | richtext |
| 2 | description | richtext |
| 3 | state-label | text |
| 4 | county-label | text |
| 5 | zip-label | text |
| 6 | zip-placeholder | text |
| 7 | submit-label | text |
| 8 | filter-label | text |
| 9 | filter-options | text |
| 10 | indication-label | text |
| 11 | indications | text |
| 12 | api | text |
| 13 | recaptcha-key | text |
| 14 | results-per-page | text |
| 15 | no-results | text |
| 16 | error | text |
| 17 | recaptcha-notice | richtext |
| 18 | disclaimer | richtext |
| 19 | analyticsId | text |

## Files to Change

### 1. `blocks/formulary-lookup/formulary-lookup.js`
- Rewrite `parseConfig` to detect UE vs plain mode
- In UE mode: walk rows positionally using `FIELD_ORDER` array, extract keys from `data-aue-prop` / `data-richtext-prop` attributes or fall back to positional index
- Preserve current plain-mode parsing for `.plain.html` content

### 2. No CSS changes needed
The block renders the same decorated DOM regardless of input mode — only `parseConfig` needs to change.

### 3. No model/definition changes needed
The `_formulary-lookup.json` and `component-models.json` already have the correct field definitions.

---

## Checklist

### JS Fix
- [ ] **1.1** Add `FIELD_ORDER` constant array listing all model field names in order (icon → analyticsId)
- [ ] **1.2** Rewrite `parseConfig` to detect UE mode (rows have 1 cell with `data-aue-prop` or `data-richtext-prop`, or rows match `FIELD_ORDER` length)
- [ ] **1.3** In UE mode: iterate rows, extract key from `data-aue-prop` / `data-richtext-prop` on the cell or its children; for empty cells with no attributes, use `FIELD_ORDER[index]` as the key
- [ ] **1.4** For richtext fields in UE mode (`data-richtext-prop`): read `innerHTML` of the cell
- [ ] **1.5** For text fields in UE mode (`data-aue-prop`): read `textContent` of the cell
- [ ] **1.6** Preserve existing plain-mode parsing (2-cell rows) as fallback
- [ ] **1.7** Ensure `unwrapSingleP` still works for heading/description in both modes

### Verification
- [ ] **2.1** Test in local preview (`--html-folder`) — all 3 brand pages still render correctly
- [ ] **2.2** Test UE rendering — block parses fields correctly from xwalk DOM
- [ ] **2.3** Verify richtext fields (heading bold, disclaimer links, recaptcha-notice links) render correctly in UE mode

---

## Notes
- The `editor-support.js` and `editor-support-rte.js` scripts handle UE instrumentation and richtext decoration — they run **after** `decorateMain()` but the richtext `<div>` wrapping via `decorateRichtext()` happens on the raw DOM. The `parseConfig` function runs inside `decorate(block)` which executes after these scripts.
- The `data-richtext-prop` elements get grouped into `<div data-aue-type="richtext">` wrappers by `decorateRichtext()` — but this happens on the original DOM before block decoration. When `decorate(block)` runs, the richtext `<p>` tags may already be wrapped.
- **Execution requires switching to Execute mode.**
