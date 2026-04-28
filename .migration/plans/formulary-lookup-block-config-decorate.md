# Formulary Lookup — Wire Block Config into Decorate

## Problem

The `decorate(block)` function in `formulary-lookup.js` ignores the `block-config.js` system entirely. The project has a `multi-theme.js` infrastructure with `renderBlock(ctx)` that loads and merges global + brand block-config files, then calls `beforeDecorate` / `decorate` / `afterDecorate` hooks — but this pipeline is **never invoked** at runtime. The `aem.js` `loadBlock` calls `mod.default(block)` directly, bypassing block-config.

All `block-config.js` files (global + 3 brand overrides) are currently empty stubs returning `{ flags: {}, variations: [], decorations: {} }`.

## Goal

Wire the block-config system into the formulary-lookup block so that:
1. `decorate` loads and merges the global + brand block-config at runtime
2. Brand-specific `block-config.js` files can supply `flags` that control HTML generation
3. The decorated HTML output reflects block-config settings (e.g., show/hide features, brand-specific DOM tweaks)

## Architecture Decision

Two approaches exist:

**Option A — Wire `multi-theme.js` `renderBlock` into `aem.js` `loadBlock`**
This would fix all blocks globally but is a large, risky change affecting every block in the project.

**Option B — Self-contained: `formulary-lookup.js` loads its own block-config** (Recommended)
The `decorate` function imports and merges block-config internally. No changes to `aem.js` or `multi-theme.js`. Other blocks remain unaffected. Uses the same `loadBlockConfig` pattern from `multi-theme.js` but scoped to this block only.

**Recommended: Option B** — scoped, safe, no regression risk.

## Brand Config Flags

Define useful flags that each brand's `block-config.js` can set to control the generated HTML:

| Flag | Type | Default | Effect |
|---|---|---|---|
| `showIcon` | boolean | `true` | Show/hide the icon element |
| `showRecaptchaNotice` | boolean | `true` | Show/hide reCAPTCHA notice |
| `showDisclaimer` | boolean | `true` | Show/hide disclaimer section |
| `submitIconEnabled` | boolean | `false` | Add search icon class to submit button |
| `headingTag` | string | `'h2'` | Heading element tag (h2, h3, etc.) |
| `autoSubmitOnStateChange` | boolean | `true` | Default variant auto-submits on state select change (when no submit button) |

## Files to Change

### 1. `blocks/formulary-lookup/formulary-lookup.js`
- Add `loadFormularyConfig()` helper that imports global + brand `block-config.js` and merges them
- Modify `decorate(block)` to call `loadFormularyConfig()` and pass merged flags to all builder functions
- Apply flags to control HTML generation (icon, recaptcha, disclaimer, heading tag)

### 2. `blocks/formulary-lookup/block-config.js` (global)
- Add default flag values

### 3. `blocks/formulary-lookup/abbvie/block-config.js`
- Add SkyriziHCP-specific flags (e.g., `submitIconEnabled: true`)

### 4. `blocks/formulary-lookup/rinvoq/block-config.js`
- Add RinvoqHCP-specific flags (e.g., `submitIconEnabled: true`)

### 5. `blocks/formulary-lookup/botox/block-config.js`
- Add Mavyret-specific flags

---

## Checklist

### JS — Config Loader
- [ ] **1.1** Add `loadFormularyConfig()` function to `formulary-lookup.js` that dynamically imports global `block-config.js` and brand-specific `block-config.js` (using `getMetadata('brand')` to resolve the brand path), then merges `flags` objects with brand overriding global
- [ ] **1.2** Add `DEFAULT_FLAGS` constant with default flag values as fallback

### JS — Decorate Integration
- [ ] **1.3** Modify `decorate(block)` to `await loadFormularyConfig()` and extract `flags`
- [ ] **1.4** Apply `flags.showIcon` — skip icon creation when `false`
- [ ] **1.5** Apply `flags.showRecaptchaNotice` — skip reCAPTCHA notice when `false`
- [ ] **1.6** Apply `flags.showDisclaimer` — skip disclaimer when `false`
- [ ] **1.7** Apply `flags.headingTag` — use configurable tag instead of hardcoded `h2`
- [ ] **1.8** Apply `flags.submitIconEnabled` — add `has-icon` class to submit button for CSS icon display
- [ ] **1.9** Pass `flags` to `buildDefaultVariant`, `buildZipVariant`, `buildDynamicVariant` so they can use `autoSubmitOnStateChange` flag

### Block Config Files
- [ ] **2.1** Update `blocks/formulary-lookup/block-config.js` with default flags
- [ ] **2.2** Update `blocks/formulary-lookup/abbvie/block-config.js` with SkyriziHCP flags (`submitIconEnabled: true`)
- [ ] **2.3** Update `blocks/formulary-lookup/rinvoq/block-config.js` with RinvoqHCP flags (`submitIconEnabled: true`)
- [ ] **2.4** Update `blocks/formulary-lookup/botox/block-config.js` with Mavyret flags

### Verification
- [ ] **3.1** Preview SkyriziHCP — verify block-config flags applied, submit icon visible
- [ ] **3.2** Preview RinvoqHCP — verify card + filter + indication + submit icon
- [ ] **3.3** Preview Mavyret — verify state dropdown + green button
- [ ] **3.4** Preview with no brand metadata — verify default flags apply

---

## Notes
- The `getMetadata('brand')` call in the config loader depends on the `processLocalMetadata()` fix already in `scripts.js` for local preview.
- Brand `block-config.js` files live at `blocks/formulary-lookup/{brand}/block-config.js`. The dynamic import path uses the same `brand` metadata value used for CSS loading.
- The merged config pattern follows `multi-theme.js` `mergeConfig()` logic: brand flags override global flags via object spread.
- **Execution requires switching to Execute mode.**
