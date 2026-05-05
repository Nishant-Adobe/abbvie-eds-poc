# CTA Block: Align Class Names with Original Site Convention

## Summary
Rename all CTA block classes to match the original AbbVie Platform C naming convention. This is a class-name-only change — the DOM structure (span-based icons), JavaScript logic, and token-driven CSS approach remain the same. The UI labels in Universal Editor stay human-readable (e.g., "Primary", "Before") while the applied CSS class values change.

## Class Rename Mapping

### Variant Classes (on block wrapper via `classes` field)
| UE Label | Old class | New class |
|----------|-----------|-----------|
| Primary (default) | `cta-primary` | `abbv-button-primary` |
| Secondary | `cta-secondary` | `abbv-button-secondary` |
| Tertiary | `cta-tertiary` | `abbv-button-tertiary` |
| Plain link | `cta-plain` | `abbv-button-plain` |
| Toggle (round) | `cta-toggle-round` | `abbv-switch abbv-round` |
| Toggle (square) | `cta-toggle-square` | `abbv-switch abbv-square` |

### Icon Position Classes (on block wrapper)
| UE Label | Old class | New class |
|----------|-----------|-----------|
| None | (no class — via iconType=none) | (merged into iconPosition=none) |
| Before | `icon-before` | `i-b` |
| After | `icon-after` | `i-a` |

### Inner Element Class
| Old class | New class |
|-----------|-----------|
| `cta-button` | `abbv-cta` |

### Icon Span Class
| Old class | New class |
|-----------|-----------|
| `cta-icon` | `cta-icon` (keep — it's internal DOM, not a site-level convention) |

## UE Model Changes

### 1. Merge iconType + iconPosition into single field
Replace the separate `iconType` (None/Icon Font/Image) and `iconPosition` (Before/After) fields with a **single** `iconPosition` field:

**New iconPosition options (UI labels → class values):**
| UE Label | Value (applied as class) |
|----------|--------------------------|
| None | `none` |
| Before (left) | `i-b` |
| After (right) | `i-a` |

The `iconFont` and `iconImage` fields remain, with conditions updated to show when `iconPosition != none`.

### 2. Add Click Behavior options
Expand `ctaTarget` from 2 to 6 options:
| UE Label | Value |
|----------|-------|
| Same Tab | `_self` |
| New Tab | `_blank` |
| Modal | `new-modal` |
| Hidden Panel | `new-hidden-panel` |
| Switch View | `switch-view` |
| Indication Selection | `indicationSelection` |

### 3. CSS Approach — Padding + Absolute Positioning for Icon
Switch from flexbox `order` to padding + absolute positioning:
- `.i-b .abbv-cta`: `padding-left: 42px; position: relative`
- `.i-b .cta-icon`: `position: absolute; left: 10px; top: 9px; font-size: 1.3rem`
- `.i-a .abbv-cta`: `padding-right: 42px; position: relative`
- `.i-a .cta-icon`: `position: absolute; right: 10px; top: 9px; font-size: 1.3rem`
- `.i-b:empty` / `.i-a:empty`: icon-only treatment (no text, icon centered)

## Files Affected

### JavaScript
- `blocks/cta/cta.js` — rename all class references

### Base CSS
- `blocks/cta/cta.css` — rename all selectors, rewrite icon positioning section

### Brand override CSS (all files)
- `blocks/cta/rinvoq/cta.css`
- `blocks/cta/rinvoq-hcp/cta.css`
- `blocks/cta/rinvoq-dtc/cta.css`
- `blocks/cta/skyrizi-hcp/cta.css`
- `blocks/cta/linzess/cta.css`
- `blocks/cta/mavyret/cta.css`

### UE Model Files
- `component-models.json` (~lines 3380–3530) — CTA model section
- `blocks/cta/_cta.json` — source model + template
- `component-definition.json` (line 365, 540) — template defaults

## Checklist

- [ ] **component-models.json** — Rename variant `classes` option values to `abbv-button-*` and `abbv-switch abbv-*`
- [ ] **component-models.json** — Merge iconType+iconPosition into single `iconPosition` field (none/i-b/i-a)
- [ ] **component-models.json** — Update `iconFont`/`iconImage` conditions to reference `iconPosition` instead of `iconType`
- [ ] **component-models.json** — Add extra `ctaTarget` options (new-modal, new-hidden-panel, switch-view, indicationSelection)
- [ ] **blocks/cta/_cta.json** — Mirror all model/template changes (variant values, iconPosition merge, ctaTarget options)
- [ ] **component-definition.json** — Update template defaults (`classes`, `iconPosition`)
- [ ] **blocks/cta/cta.js** — Rename `cta-button` → `abbv-cta` in element creation
- [ ] **blocks/cta/cta.js** — Rename variant array (`abbv-button-primary`, etc.) and toggle checks (`abbv-switch`)
- [ ] **blocks/cta/cta.js** — Change `icon-before` check to `i-b`
- [ ] **blocks/cta/cta.js** — Remove separate iconType handling, use iconPosition field directly
- [ ] **blocks/cta/cta.css** — Rename all `.cta-primary` → `.abbv-button-primary` (and secondary, tertiary, plain)
- [ ] **blocks/cta/cta.css** — Rename `.cta-button` → `.abbv-cta`
- [ ] **blocks/cta/cta.css** — Rename `.cta-toggle-round` → `.abbv-switch.abbv-round` and `.cta-toggle-square` → `.abbv-switch.abbv-square`
- [ ] **blocks/cta/cta.css** — Rewrite icon section: remove flexbox order, add padding + absolute positioning for `.i-b` / `.i-a`
- [ ] **blocks/cta/cta.css** — Add `:empty` icon-only button styles
- [ ] **blocks/cta/rinvoq/cta.css** — Rename selectors (`abbv-button-*`, `.i-a`)
- [ ] **blocks/cta/rinvoq-hcp/cta.css** — Rename selectors
- [ ] **blocks/cta/rinvoq-dtc/cta.css** — Rename selectors
- [ ] **blocks/cta/skyrizi-hcp/cta.css** — Rename selectors
- [ ] **blocks/cta/linzess/cta.css** — Rename selectors
- [ ] **blocks/cta/mavyret/cta.css** — Rename selectors
- [ ] **Verify** — grep entire workspace for old class names to confirm no leftover references
