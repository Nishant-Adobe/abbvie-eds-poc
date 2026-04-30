# Mavyret Formulary-Lookup Pixel-Perfect CSS Plan

## Summary

Restyle the `blocks/formulary-lookup/mavyret/formulary-lookup.css` to match the original mavyret.com/hcp/access page using brand-level tokens from `styles/mavyret/tokens.css`.

## Visual Analysis (from screenshots)

### Key Design Elements

| Element | Original Styling |
|---|---|
| **Background** | Light gray diagonal chevron/zigzag pattern (section background, not block itself) |
| **Layout** | Full-width centered, no card wrapper |
| **Heading** | Large, light weight font. "Find MAVYRET Access by State With Our" in regular + "**Formulary Lookup Tool**" in bold italic. Mavyret brand font (Univers LT Condensed) |
| **State label** | "Select State" — bold, standard size, above the dropdown |
| **State select** | Wide (≈500px), tall (≈56px), 1px black border, 4px border-radius, dropdown chevron on right |
| **Submit button** | Full-width (same as select), 2px solid black border, transparent background, bold text "See Access and Formulary Considerations ›", green shadow offset (-3px 3px) |
| **Disclaimer modal** | White rounded card overlay with bold text paragraphs, green "✕" close button (circle, top-right) |
| **No card** | Block is NOT in a card — it sits directly on the page background |

### Color/Token Mapping

| Value | Token |
|---|---|
| Black text/borders `#000` | `--color-black` (already in mavyret tokens) |
| Green shadow `rgb(88 166 52)` | `--color-formulary-submit-bg` (already in mavyret tokens) |
| Green hover `rgb(70 140 40)` | `--color-formulary-submit-hover` (already in mavyret tokens) |
| Green close button bg | `--color-formulary-submit-bg` |
| Body font | `--body-font-family` (Univers LT Condensed) |
| Heading font | `--heading-font-family` (Univers LT Condensed) |

### Differences from Current Implementation

The current `mavyret/formulary-lookup.css` was written for a stacked column form with narrow width. The original site shows:
1. **Wider layout** — select and button are ~500-600px wide
2. **No card variant** — content uses `centered` class, not `card`
3. **Button has `>` arrow** — already implemented with `::after` pseudo-element
4. **Disclaimer is a modal** — `disclaimerModal: true` flag is set in block-config.js ✓
5. **Green shadow on button** — `-3px 3px 0 green` offset shadow ✓ (already set)
6. **Select has strong black border** — 2px solid black
7. **Heading uses mixed weight** — part normal, part bold (needs HTML with `<strong>`)

## Checklist

- [ ] **Update mavyret block CSS** — Widen form (max-width 600px), increase select/button height (56px), use 2px black border, match heading size (~28-32px), use brand fonts via tokens
- [ ] **Fix disclaimer modal styling** — Green circle close button, rounded card (16px radius), large shadow, proper padding and typography
- [ ] **Fix heading** — Support mixed-weight heading (normal + bold portions) via CSS for `strong` inside heading
- [ ] **Fix select dropdown** — Wider, taller, proper chevron, 2px black border
- [ ] **Fix submit button** — Full width matching select, 2px black border, transparent bg, green offset shadow, `>` arrow
- [ ] **Update content** — Fix heading text to use proper `<strong>` for "Formulary Lookup Tool", add state-label "Select State", add brand metadata
- [ ] **Verify on preview** — Check local rendering matches the original screenshots

## Files to Modify

1. `blocks/formulary-lookup/mavyret/formulary-lookup.css` — Full restyle
2. `styles/mavyret/tokens.css` — Add any missing tokens (if needed)
3. `content/formulary-lookup-mavyret.plain.html` — Fix content/metadata

## Notes

- Only CSS changes (and minimal content fixes for proper rendering)
- The JS block-config already has `disclaimerModal: true` and `autoSubmitOnStateChange: false` — correct for Mavyret
- The block uses the `centered` class (no `card` class) which is correct
- Execution requires switching to Execute mode
