# Skyrizi HCP Plain Button Verification

## Your CSS:
```css
.cta.plain a, .cta.plain button {
  position: relative;
  display: inline-block;
  padding: 12px;
  border: 0;
  background: transparent;
  color: #071d49;
  font-size: 0.9rem;
  text-decoration: none;
  cursor: pointer;
}
```

## Live site computed styles (`.abbv-button-plain` links):

| Property | Your CSS | Live Site | Match? |
|----------|----------|-----------|--------|
| `position` | `relative` | `relative` | ✅ |
| `display` | `inline-block` | `inline-block` | ✅ |
| `padding` | `12px` | `12px 0px` (base) / `12px 12px 16px 0px` (indications) / `12px 42px 12px 0px` (with icon) | ⚠️ Partial |
| `border` | `0` | `0px none` | ✅ |
| `background` | `transparent` | `rgba(0, 0, 0, 0)` | ✅ |
| `color` | `#071d49` | `rgb(7, 29, 73)` = `#071d49` ✅ (in body) / `rgb(255, 255, 255)` (in header/dark bg) | ⚠️ Context-dependent |
| `font-size` | `0.9rem` (~14.4px) | `14px` - `14.4px` (varies) | ✅ Close |
| `text-decoration` | `none` | `none` | ✅ |
| `cursor` | `pointer` | `pointer` | ✅ |
| `font-weight` | Not set (inherits) | `400` (base) / `700` (bold links like "View patient case study") | ⚠️ Missing |
| `font-family` | Not set | `"Univers LT W01_67 Bold_1476016"` (Univers Bold) for CTA links | ⚠️ Missing |

## Key findings:

1. **Padding** — Your `12px` all-around is slightly off. The live site uses `12px 0px` for base plain buttons (no icon) and `12px 42px 12px 0px` for icon-after buttons. A uniform `12px` padding is a reasonable simplification, but the right padding is typically `0` unless there's an icon.

2. **Font-family** — The live site plain CTA links use **Univers Bold** font-family. Your CSS doesn't set it. Should add `font-family: var(--heading-font-family-bold)`.

3. **Font-weight** — Many plain buttons have `font-weight: 700` (bold). Should be explicitly declared.

4. **Color is context-dependent** — `#071d49` is correct for body context. On dark backgrounds (header, safety bar), plain buttons become white (`#fff`).

5. **Hover** — Your `:hover` only removes text-decoration, which matches (the live site also has `text-decoration: none` on hover for plain buttons).

## Checklist

- [x] `position: relative` — correct
- [x] `display: inline-block` — correct
- [ ] `padding: 12px` — should be `12px 0px` for base (no icon)
- [x] `border: 0` — correct
- [x] `background: transparent` — correct
- [x] `color: #071d49` — correct for light context
- [x] `font-size: 0.9rem` — close enough (14.4px vs 14px)
- [ ] `font-family` — missing, should be `var(--heading-font-family-bold)`
- [ ] `font-weight` — missing, should be `700`
- [x] `text-decoration: none` — correct
- [x] `cursor: pointer` — correct

**Verdict**: The styles are ~80% correct. The missing pieces are `font-family`, `font-weight: 700`, and padding should be `12px 0` instead of `12px` all around. To switch to Execute mode and apply these fixes, let me know.
