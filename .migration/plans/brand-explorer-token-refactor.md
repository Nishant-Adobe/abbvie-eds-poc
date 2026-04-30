# Apply Token-Based Styling to Brand Explorer Block

## Current State Analysis

| Item | Status |
|------|--------|
| `--be-*` defaults in `styles/tokens.css` | ✅ Already there (lines 352-372) |
| `--be-*` overrides in `styles/skyrizi-hcp/tokens.css` | ✅ Already there (lines 106-112) |
| `--be-*` overrides in `styles/rinvoq-hcp/tokens.css` | ✅ Already there (lines 114-121) |
| Base `brand-explorer.css` uses only `var(--be-*)` | ✅ No declarations in block CSS |
| Brand partials have `@import` of tokens | ⚠️ Still importing tokens → causes `:root{}` inlining |
| Compiled files have `:root{}` | ❌ 4 occurrences each — needs fix |

## Problem

Same issue as clinical-data-panel: the `@import '../../../styles/{brand}/tokens.css'` in brand partials causes Gulp to inline the entire token chain into compiled output, producing `:root{}` blocks.

## Solution

Same fix as clinical-data-panel: **remove the `@import` of tokens** from brand partials. Since `head.html` loads `styles/{brand}/tokens.css` globally (confirmed working in UE), the `--be-*` tokens will resolve without inlining.

## Checklist

- [ ] Remove `@import '../../../styles/skyrizi-hcp/tokens.css'` from `blocks/brand-explorer/skyrizi-hcp/_brand-explorer.css`
- [ ] Remove `@import '../../../styles/rinvoq-hcp/tokens.css'` from `blocks/brand-explorer/rinvoq/_brand-explorer.css`
- [ ] Rebuild with gulp
- [ ] Verify compiled CSS has no `:root{}` blocks
- [ ] Lint all files
- [ ] Verify no other token declarations exist in block CSS

## Status

Ready for execution. Requires Execute mode.
