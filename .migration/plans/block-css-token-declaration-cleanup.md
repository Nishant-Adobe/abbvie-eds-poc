# Fix Token Declarations in Compiled Block CSS

## Confirmed: UE Loads Brand Tokens Globally ✅

Tested in UE — `var(--body-font-family)` resolves to `'Univers LT W01_57 Condensed', 'Arial Narrow', sans-serif`. This confirms `aem.js` loads `styles/mavyret/tokens.css` globally in UE author mode.

**Safe to remove `@import` from block CSS.** No inlining needed.

## Plan

1. Remove `@import '../../../styles/mavyret/tokens.css'` from `blocks/clinical-data-panel/mavyret/_clinical-data-panel.css`
2. Remove `@import '../../../styles/skyrizi-hcp/tokens.css'` from `blocks/clinical-data-panel/skyrizi-hcp/_clinical-data-panel.css`
3. Rebuild with gulp — compiled output will be clean (no `:root{}`)
4. Verify no undefined vars

## Files Changed (CSS only)

| File | Action |
|------|--------|
| `blocks/clinical-data-panel/mavyret/_clinical-data-panel.css` | Remove `@import` of tokens |
| `blocks/clinical-data-panel/skyrizi-hcp/_clinical-data-panel.css` | Remove `@import` of tokens |
| `blocks/clinical-data-panel/mavyret/clinical-data-panel.css` | Auto-rebuilt by gulp (no `:root{}`) |
| `blocks/clinical-data-panel/skyrizi-hcp/clinical-data-panel.css` | Auto-rebuilt by gulp (no `:root{}`) |

## Checklist

- [x] Test in UE: `var(--body-font-family)` resolves for mavyret page
- [ ] Remove `@import '../../../styles/mavyret/tokens.css'` from mavyret `_clinical-data-panel.css`
- [ ] Remove `@import '../../../styles/skyrizi-hcp/tokens.css'` from skyrizi-hcp `_clinical-data-panel.css`
- [ ] Rebuild with gulp
- [ ] Verify compiled CSS has no `:root{}` blocks
- [ ] Lint all files
- [ ] Verify tokens resolve (no "not defined" in UE, localhost, aem.live)

## Status

Ready for execution. Implementation requires Execute mode.
