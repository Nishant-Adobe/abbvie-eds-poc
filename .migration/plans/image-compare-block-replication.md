# Pixel-Perfect Image Compare Block — Live Site Replication Plan

## Objective

Make the `image-compare` block on both the Rinvoq and Skyrizi HCP preview pages render identically to the live AEM 6.5 sites. The images are already uploaded to DAM. The JS and CSS framework is in place — this plan focuses on fixing remaining visual/behavioral gaps to achieve pixel-perfect rendering.

---

## Current State

### What's Working
- JS detects 3 content formats (model, keyvalue, legacy) 
- JS builds correct DOM with `.image-compare-*` class names matching CSS
- Brand tokens defined in `styles/rinvoq-hcp/tokens.css` and `styles/skyrizi-hcp/tokens.css`
- Brand CSS overrides in `rinvoq/_image-compare.css` and `skyrizi-hcp/_image-compare.css`
- `_image-compare.json` model with all fields inlined (md2jcr fixed)

### What's Broken (from Screenshots)
1. **Rinvoq page** — shows "BEFORE", "AFTER", prompt text, and description as raw text with broken image icon. The slider is not rendering visually (no background, no positioning, no overlay styling).
2. **Skyrizi page** — shows text labels and broken image. Same issue — CSS isn't being applied properly.

### Root Cause Analysis

The brand CSS files reference `var(--ic-*)` tokens, but these tokens are defined in `styles/rinvoq-hcp/tokens.css` — the brand token file is loaded via `head.html` only when page metadata has `brand: rinvoq-hcp`. However, the Rinvoq DTC page uses `brand: rinvoq` (or `rinvoq-dtc`), which loads `styles/rinvoq/tokens.css` or `styles/rinvoq-dtc/tokens.css` — NOT `styles/rinvoq-hcp/tokens.css`.

Additionally, the block CSS is loaded from `blocks/image-compare/rinvoq/image-compare.css` (the brand path matching the page's `brand` metadata). But the tokens are in a DIFFERENT brand token path.

**Key issue: brand mismatch between CSS loading paths and where tokens are defined.**

| Page | Brand Metadata | Block CSS Loaded | Token File Loaded | Tokens Defined In |
|------|---------------|-----------------|-------------------|-------------------|
| `image-compare-rinvoq` | `rinvoq` (or `rinvoq-dtc`) | `blocks/image-compare/rinvoq/` | `styles/rinvoq/tokens.css` | `styles/rinvoq-hcp/tokens.css` ❌ |
| `image-compare-skyrizi` | `skyrizi-hcp` | `blocks/image-compare/skyrizi-hcp/` | `styles/skyrizi-hcp/tokens.css` | `styles/skyrizi-hcp/tokens.css` ✓ |

The Skyrizi path is correct. The Rinvoq path has a mismatch — tokens are in `rinvoq-hcp` but block CSS loads from `rinvoq`.

---

## Files to Investigate & Fix

| # | File | Issue |
|---|------|-------|
| 1 | `styles/rinvoq/tokens.css` OR `styles/rinvoq-dtc/tokens.css` | Missing `--ic-*` tokens — need to add them here (matching where the page's brand metadata points) |
| 2 | `blocks/image-compare/image-compare.js` | Verify the prompt text rendering correctly for model-format content |
| 3 | `blocks/image-compare/rinvoq/_image-compare.css` | Verify CSS selectors work with generated DOM structure |
| 4 | `blocks/image-compare/image-compare.css` | May need `.image-compare` scoping on some rules |

---

## Implementation Steps

### Step 1: Determine correct token location for Rinvoq pages
- Check what `brand` metadata the authored Rinvoq page uses
- Check if `styles/rinvoq/tokens.css` or `styles/rinvoq-dtc/tokens.css` is what loads
- Add `--ic-*` tokens to the correct file (or copy from rinvoq-hcp)

### Step 2: Verify the CSS cascade is working
- Check that the base CSS + brand override CSS apply to the DOM structure built by JS
- The base CSS uses `.image-compare-container` etc. without `.image-compare` parent scope — verify this matches EDS block wrapper behavior

### Step 3: Fix any remaining visual gaps
- Compare live site computed styles with what the token values produce
- Ensure the `--compare-position` custom property is being set correctly by JS
- Verify the prompt/handle positioning

---

## Checklist

- [ ] Check which brand metadata the Rinvoq preview page uses (`rinvoq` vs `rinvoq-dtc` vs `rinvoq-hcp`)
- [ ] Check `styles/rinvoq/tokens.css` for `--ic-*` tokens (likely missing)
- [ ] Add `--ic-*` tokens to the correct Rinvoq token file that loads for the preview page
- [ ] Verify Skyrizi HCP token path is correct (should already work since `brand: skyrizi-hcp`)
- [ ] Preview Rinvoq page — verify slider renders with correct styling
- [ ] Preview Skyrizi page — verify slider renders with correct styling
- [ ] Compare rendering against live AEM 6.5 screenshots for pixel accuracy
- [ ] Fix any remaining CSS gaps found during comparison
- [ ] Commit fixes to `image-compare` branch

---

## Key Constraints

1. **DO NOT TOUCH** `abbvie/` or `botox/` directories
2. CSS files use `var(--ic-*)` tokens — tokens must be in the file that actually loads for the page
3. JS produces `.image-compare-*` class names — CSS must target these
4. The live site DOM from screenshots is the source of truth for pixel accuracy
5. **Execution requires Execute mode**
