# Formulary-Lookup CSS: Replace Hardcoded Values with Brand Tokens

## Summary

The brand-level CSS files in `blocks/formulary-lookup/{brand}/formulary-lookup.css` use hardcoded color values (e.g., `rgb(130 0 67)`, `rgb(7 29 73)`) instead of referencing the design tokens already defined in `styles/{brand}/tokens.css`. This plan replaces all hardcoded values with existing brand token variables, and creates new token variables where no suitable match exists.

## Analysis: Hardcoded Values → Token Mappings

### Skyrizi-HCP (`blocks/formulary-lookup/skyrizi-hcp/formulary-lookup.css`)

| Hardcoded Value | Existing Token | Action |
|---|---|---|
| `rgb(33 64 109)` = `#21406d` | `--color-brand-primary: #21406d` (mavyret) / `--text-color: #071d49` (skyrizi) | Need `--color-text-heading` = `#21406d` — already not matching. Actually this is mavyret's color. Let me re-check. |
| `rgb(7 29 73)` = `#071d49` | `--color-text-black: #071d49` / `--color-brand-primary-dark` (skyrizi) | Use `--color-text-black` |
| `rgb(194 194 194)` = `#c2c2c2` | Close to `--color-border-default: #ccc` | Create `--color-border-input: #c2c2c2` |
| `rgb(235 60 54)` = `#eb3c36` | No exact match in skyrizi tokens | Create `--color-error: #eb3c36` |

### Rinvoq-HCP (`blocks/formulary-lookup/rinvoq-hcp/formulary-lookup.css`)

| Hardcoded Value | Existing Token | Action |
|---|---|---|
| `rgb(37 40 42)` = `#25282a` | `--color-charcoal: #25282a` | Use `--color-charcoal` |
| `rgb(130 0 67)` = `#820043` | `--color-brand-primary: #90124a` — close but not exact | Create `--color-brand-primary-deep: #820043` or use `--color-plum` |
| `rgb(218 170 0)` = `#daaa00` | `--color-brand-accent: #ffd100` — different | Create `--color-gold-dark: #daaa00` |
| `rgb(135 137 138)` = `#87898a` | `--color-steel: #87898a` | Use `--color-steel` |
| `rgb(70 72 74)` = `#46484a` | `--color-iron: #46484a` | Use `--color-iron` |
| `rgb(214 42 36)` = `#d62a24` | `--color-error: #d62a24` | Use `--color-error` |
| `rgb(100 0 52)` | No match | Create `--color-brand-primary-hover: rgb(100 0 52)` |
| `rgb(255 243 200)` | No match | Create `--color-accent-highlight: rgb(255 243 200)` |

### Mavyret (`blocks/formulary-lookup/mavyret/formulary-lookup.css`)

| Hardcoded Value | Existing Token | Action |
|---|---|---|
| `rgb(0 0 0)` = `#000` | Common black — no dedicated token | Use `--color-text-heading` or create `--color-black: #000` |
| `rgb(88 166 52)` = `#58a634` | `--color-green-flash: #76bd22` — close but not exact | Create `--color-green-cta: #58a634` |
| `rgb(170 170 170)` = `#aaa` | No match | Create `--color-border-input: #aaa` |
| `rgb(70 140 40)` | No match (hover variant of green) | Create `--color-green-cta-hover: rgb(70 140 40)` |

### Botox (`blocks/formulary-lookup/botox/formulary-lookup.css`)

| Hardcoded Value | Existing Token | Action |
|---|---|---|
| `rgb(0 0 0)` | Same as mavyret — generic black | Use a token |
| `rgb(170 170 170)` | No match | Create `--color-border-input: #aaa` |
| `rgb(88 166 52)` | No match in botox tokens (empty file) | Create `--color-green-cta: #58a634` |
| `rgb(70 140 40)` | No match | Create `--color-green-cta-hover: rgb(70 140 40)` |

## Checklist

- [ ] **Skyrizi-HCP tokens** — Add missing variables to `styles/skyrizi-hcp/tokens.css`: `--color-formulary-text`, `--color-formulary-submit-bg`, `--color-formulary-submit-border`, `--color-border-input`, `--color-error`
- [ ] **Skyrizi-HCP block CSS** — Replace all hardcoded values in `blocks/formulary-lookup/skyrizi-hcp/formulary-lookup.css` with token references
- [ ] **Rinvoq-HCP tokens** — Add missing variables to `styles/rinvoq-hcp/tokens.css`: `--color-formulary-submit-bg`, `--color-formulary-submit-hover`, `--color-formulary-accent`, `--color-formulary-highlight`
- [ ] **Rinvoq-HCP block CSS** — Replace all hardcoded values in `blocks/formulary-lookup/rinvoq-hcp/formulary-lookup.css` with token references
- [ ] **Mavyret tokens** — Add missing variables to `styles/mavyret/tokens.css`: `--color-formulary-submit-bg`, `--color-formulary-submit-hover`, `--color-border-input`, `--color-black`
- [ ] **Mavyret block CSS** — Replace all hardcoded values in `blocks/formulary-lookup/mavyret/formulary-lookup.css` with token references
- [ ] **Botox tokens** — Add missing variables to `styles/botox/tokens.css`: `--color-formulary-submit-bg`, `--color-formulary-submit-hover`, `--color-border-input`, `--color-black`
- [ ] **Botox block CSS** — Replace all hardcoded values in `blocks/formulary-lookup/botox/formulary-lookup.css` with token references
- [ ] **Verify preview** — Check that rendered pages still look the same after token replacement

## Approach

1. For each brand, identify every hardcoded color/size in the brand's `formulary-lookup.css`
2. Map to existing token variables where an exact match exists (e.g., `--color-plum`, `--color-steel`)
3. Where no exact token exists, add a new semantic variable (prefixed `--color-formulary-*`) to that brand's `tokens.css`
4. Replace hardcoded values in block CSS with `var(--token-name)`
5. Visually verify no regressions

## Notes

- Only CSS files are modified — no JS changes
- The base `blocks/formulary-lookup/formulary-lookup.css` already uses variables properly and needs no changes
- New tokens use the `--color-formulary-*` naming pattern for block-specific colors that don't map to existing brand palette tokens
- Execution requires switching to Execute mode
