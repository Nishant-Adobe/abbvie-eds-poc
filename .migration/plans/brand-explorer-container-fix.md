# Brand-Explorer Overflow Fix Plan

## Problem
The brand-explorer block overflows horizontally on narrow viewports. The container wrapping the block (`.brand-explorer-container`) applies padding/margin/max-width that causes the content to exceed the viewport width.

## Root Cause
The EDS framework (`scripts/aem.js` lines 644-646) automatically generates:
- `.brand-explorer-wrapper` — wraps the block div
- `.brand-explorer-container` — the parent `<section>` element

These inherit default section styles (max-width, padding, margin) that constrain content and cause the full-width brand-explorer bar to overflow.

## Applying CSS to wrapper/container — Is it OK?
**Yes, absolutely.** This is standard EDS practice. The framework generates these classes specifically so block CSS can target them. The existing file already styles `.brand-explorer-section .brand-explorer-wrapper` (line 15-19), confirming this pattern is already in use.

## Merge Conflict Risk Analysis

| Action | Conflict Risk |
|--------|---------------|
| **Reverting lines 4-35** back to original | ✅ **No conflict** — matches develop exactly |
| **Appending new rules at end of file** | ✅ **No conflict** — git handles clean appends |

**Verdict: NO merge conflicts.**

## Solution
1. Revert lines 4-35 to their original state (matching develop)
2. Append container/wrapper override at the **end** of the file

## CSS to Append
```css
/* ── container overflow fix ─────────────────────────────────── */
.brand-explorer-container,
.brand-explorer-container .default-content-wrapper,
.brand-explorer-container .brand-explorer-wrapper {
  max-width: 100%;
  padding-left: 0;
  padding-right: 0;
  margin-left: 0;
  margin-right: 0;
}

.brand-explorer-container .brand-explorer {
  margin: 0;
  width: 100%;
}

.brand-explorer-container .brand-explorer-bar {
  width: 100%;
}
```

## Files to Change
- `blocks/brand-explorer/brand-explorer.css` — revert lines 4-35, append fix at end

## Checklist
- [ ] Revert `.brand-explorer-section` back to original (remove `max-width: 100vw` and `overflow: hidden`)
- [ ] Revert `.brand-explorer-section .default-content-wrapper/.brand-explorer-wrapper` back to original (`max-width: none`, `overflow: visible`)
- [ ] Revert `.brand-explorer` back to original (remove `overflow: hidden` and `max-width: 100vw`)
- [ ] Append the container-level fix at the end of the file (no `!important`, no conflict)

**Ready for execution — switch to Execute mode to implement.**
