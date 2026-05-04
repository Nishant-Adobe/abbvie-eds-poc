# CTA Block Brand Color Fix Plan

## Research Findings — Actual Button Styles from Live Sites

### Skyrizi HCP (skyrizihcp.com/dermatology)
| Type | Background | Text Color | Border | Radius | Font | Size | Weight | Padding |
|------|-----------|-----------|--------|--------|------|------|--------|---------|
| **Primary** | `#071d49` (navy) | `#fff` | none | `30px` | Univers LT W01_67 Bold_1476016 | 14px | 400 | `14px 56px 14px 30px` |
| **Plain** | transparent | `#baecff` (light cyan) | none | 0 | Univers LT W01_67 Bold_1476016 | 14.4px | 400 | `12px 26px 12px 0` |

### Rinvoq HCP (rinvoqhcp.com/rheumatoid-arthritis)
| Type | Background | Text Color | Border | Radius | Font | Size | Weight | Padding |
|------|-----------|-----------|--------|--------|------|------|--------|---------|
| **Primary** | `#90124a` (plum) | `#fff` | `1px solid transparent` | `100px` | Graphik Medium | 16px | 700 | `16px 54px 16px 32px` |

### Linzess (linzess.com)
| Type | Background | Text Color | Border | Radius | Font | Size | Weight | Padding |
|------|-----------|-----------|--------|--------|------|------|--------|---------|
| **Primary** | `#faa633` (orange) | `#422e83` (purple) | none | `16px` | Lato | 14.4px | 800 | `16px 32px` |
| **Secondary** | `#422e83` (purple) | `#fff` | none | `16px` | Lato | 14.4px | 800 | `16px 59px 16px 24px` |
| **Tertiary** | `#d9d7f9` (light purple) | `#422e83` (purple) | none | `16px` | Lato | 12px | 800 | `12px 42px 12px 24px` |

### Mavyret (mavyret.com)
| Type | Background | Text Color | Border | Radius | Font | Size | Weight | Padding |
|------|-----------|-----------|--------|--------|------|------|--------|---------|
| **Primary** | `#508118` (green) | `#fff` | `0px solid #555` | `0px` | trade-gothic-next | 19px | 700 | `14px` |
| **Plain** | transparent | `#e65400` (orange) | none | 0 | trade-gothic-next | 16px | 700 | `0` |

## Approach: Tokens Only — No Fallbacks in Base CSS

Per user instruction: define ALL button variables in each brand's `tokens.css` and use them directly in brand CSS overrides. The base `cta.css` will use `var()` with NO fallback values — if a token isn't defined, the property won't apply (making issues visible immediately).

## Token Corrections Needed

### `styles/skyrizi-hcp/tokens.css`
- `--button-primary-bg`: keep `#071d49` ❌ currently `#ffce00` → fix to `#071d49`
- `--button-primary-color`: `#fff`
- `--button-primary-border`: `transparent`
- `--button-primary-padding`: `14px 56px 14px 30px`
- `--border-radius-button-primary`: `30px` (currently `6px`)
- `--button-primary-font`: var(--heading-font-family-bold)
- `--button-primary-font-size`: `14px`
- `--button-plain-color`: `#baecff`

### `styles/rinvoq-hcp/tokens.css`
- Already correct: `--button-primary-bg: #90124a`, `--border-radius-button-primary: 100px`, `--button-primary-padding: 16px 54px 16px 32px`
- Add: `--button-primary-font-weight: 700`

### `styles/linzess/tokens.css`
- `--button-primary-bg`: keep `#faa633` ✅
- `--button-primary-color`: keep `#422e83` ✅
- `--button-primary-padding`: keep `16px 32px` ✅
- `--button-secondary-bg`: change to `#422e83` (currently `transparent`)
- `--button-secondary-color`: change to `#fff` (currently `#422e83`)
- `--button-secondary-border`: `transparent`
- `--button-secondary-padding`: `16px 59px 16px 24px`
- `--button-tertiary-bg`: change to `#d9d7f9` (currently `transparent`)
- `--button-tertiary-color`: keep `#422e83`
- `--button-tertiary-border`: `transparent`
- `--button-tertiary-padding`: `12px 42px 12px 24px`

### `styles/mavyret/tokens.css`
- `--button-primary-bg`: change from `#071d49` to `#508118` (green)
- `--button-primary-color`: `#fff` ✅
- `--button-primary-border`: `#555`
- `--button-primary-padding`: `14px`
- `--border-radius-button-primary`: change from `30px` to `0px`
- `--button-primary-font-size`: `19px`
- `--button-secondary-bg`: change from `#071d49` to `#508118`
- `--button-secondary-color`: `#fff`
- `--button-secondary-border`: `#555`
- `--button-plain-color`: `#e65400` (orange)

## Base CTA CSS Changes

Remove ALL fallback values from `var()` calls in `blocks/cta/cta.css`. Example:
- Before: `background-color: var(--button-primary-bg, #003087)`
- After: `background-color: var(--button-primary-bg)`

## Checklist

- [ ] Update `styles/skyrizi-hcp/tokens.css` — fix `--button-primary-bg` to `#071d49`, radius to `30px`, padding to `14px 56px 14px 30px`, add `--button-plain-color: #baecff`
- [ ] Update `styles/rinvoq-hcp/tokens.css` — add `--button-primary-font-weight: 700` (rest already correct)
- [ ] Update `styles/linzess/tokens.css` — fix secondary (`bg: #422e83`, `color: #fff`, `border: transparent`), fix tertiary (`bg: #d9d7f9`, `border: transparent`)
- [ ] Update `styles/mavyret/tokens.css` — fix primary (`bg: #508118`, `border: #555`, `padding: 14px`, `radius: 0`), fix secondary (`bg: #508118`)
- [ ] Update `blocks/cta/cta.css` — remove ALL fallback values from `var()` references
- [ ] Update `blocks/cta/skyrizi-hcp/cta.css` — adjust for navy primary, add plain light-cyan color
- [ ] Update `blocks/cta/linzess/cta.css` — update secondary/tertiary to match live styles
- [ ] Update `blocks/cta/mavyret/cta.css` — update for green primary, 0px radius, trade-gothic font
- [ ] Push and verify all 4 brand pages render with correct colors

## Notes
- Skyrizi HCP primary is navy `#071d49` (NOT yellow `#ffce00`). Yellow is used for non-button accent elements only.
- Mavyret primary is green `#508118` (NOT navy `#071d49`). The navy was from the HCP site header, not the DTC buttons.
- Linzess has a secondary style that is purple-filled (the inverse of primary orange).
- All brands use icon-after arrow pattern via CSS pseudo-element (`abbv-icon-keyboard_arrow_right`).
- The `<span class="cta-wrapper">` fix (preventing `decorateButtons` from hijacking) must be included in this push.

---

*Execution requires switching to Execute mode.*
