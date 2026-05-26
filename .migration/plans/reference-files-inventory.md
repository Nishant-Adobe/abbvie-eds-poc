# Flexbox Layout Block — Development Plan

## Overview

The Flexbox Layout block is an advanced flex container with per-item sizing tokens. It replaces AEM's `flexbox`, `flexbox-v2`, and `flexboxitem-v2` components. Used across multiple brand sites for non-equal ratio layouts (60/30, 30/60, 20/80 splits) that the standard Columns block doesn't cover.

## Reference from Execution Plan

- **Priority:** P4 — Brand Reach (~8 pages)
- **Effort:** 2 days / 16 hours
- **DOM Evidence:** `abbv-flex-container-v2`, `abbv-flex-item-v2`, `flexbox-sixty-thirty`, `flexbox-thirty-sixty`, `flexbox-twenty-eighty` (RinvoqHCP)
- **Brands:** Rinvoq HCP, Skyrizi HCP, Linzess DTC
- **Dependencies:** Columns block (Day 3)
- **Key note:** Overlap with Columns block — define clear authoring guidance on when to use each

## EDS Block Specification (from Requirements Doc)

### Variants (classes field)

| Value | CSS Class | Description |
|---|---|---|
| `` | — | Row, wrap, justify start |
| `column` | `.flexbox-column` | flex-direction: column |
| `center` | `.flexbox-center` | justify-content + align-items: center |
| `space-between` | `.flexbox-space-between` | justify-content: space-between |
| `no-wrap` | `.flexbox-no-wrap` | flex-wrap: nowrap |
| `align-stretch` | `.flexbox-align-stretch` | align-items: stretch (equal-height items) |

### Additional Direction Variants (from Policy Classes gap analysis)

| Value | CSS Class | Description |
|---|---|---|
| `row-reverse` | `.flexbox-row-reverse` | Items flow right-to-left |
| `column-reverse` | `.flexbox-column-reverse` | Items stack bottom-to-top |
| `align-top` | `.flexbox-align-top` | align-items: flex-start |
| `align-bottom` | `.flexbox-align-bottom` | align-items: flex-end |
| `content-space-between` | `.flexbox-content-space-between` | Multi-row: equal space between rows |

### Component Model Fields

| Field | Type | Notes |
|---|---|---|
| `classes` | select | Layout variant |
| `anchorId` | text | Anchor ID |
| `items` | model | Flex items — each item is a content cell |
| ↳ `content` | richtext | Item body |
| ↳ `image` | reference | Item image |
| ↳ `imageAlt` | text | Image alt |
| ↳ `itemClasses` | select | Per-item width: `auto`, `full`, `half`, `third`, `quarter` |

### CSS Implementation (from Requirements Doc)

Key patterns from source `flexbox/ui/flexbox.css`:
- Container: `display: flex; flex-wrap: wrap;`
- Items: `flex: 1; padding: 5px; margin: 10px; min-width: 0;`
- Per-item grow via `data-grow="N"` attributes (1-12)
- Per-item order via `data-order="N"` attributes
- Per-item align-self via `data-align="start|end|center|baseline|stretch"`
- Responsive: stacks on mobile unless `no-wrap` variant
- **Never use inline `style=` attributes** — all layout via CSS and data attributes

## Approach

1. Create new `blocks/flexbox/` with base JS/CSS
2. Add brand override folders for rinvoq-hcp, skyrizi-hcp, linzess
3. Register in component-definition.json, component-models.json, component-filters.json
4. CSS-only layout — all flex properties driven by variant classes and data attributes
5. Mobile-first: base stacks vertically, desktop enables flex row

## Checklist

### Phase 1: Block Scaffold
- [ ] Create `blocks/flexbox/` directory with `flexbox.js`, `flexbox.css`, `block-config.js`
- [ ] Create brand overrides: `blocks/flexbox/rinvoq-hcp/`, `blocks/flexbox/skyrizi-hcp/`, `blocks/flexbox/linzess/`
- [ ] Add block to `component-definition.json` (flexbox + flexbox-item)
- [ ] Add component model to `component-models.json` (classes, anchorId, items with content/image/itemClasses)
- [ ] Add to `component-filters.json` section components list

### Phase 2: JavaScript Decoration
- [ ] Read authored items from block DOM table rows
- [ ] Build rendered DOM: flex container + flex items
- [ ] Set `data-grow`, `data-order`, `data-align` attributes from authored fields
- [ ] Set `anchorId` as `id` on wrapper (with normalization)
- [ ] Handle per-item image + content rendering
- [ ] Call `renderBlock(block)` for brand config execution

### Phase 3: CSS Implementation
- [ ] Base styles: `display: flex; flex-wrap: wrap;` (mobile-first — column on mobile)
- [ ] Direction variants: row, row-reverse, column, column-reverse
- [ ] Justify variants: center, space-between, space-around, space-evenly
- [ ] Align-items variants: stretch, start, end, center, baseline
- [ ] Per-item width classes: auto, full (100%), half (50%), third (33%), quarter (25%)
- [ ] Per-item data-grow (1-12) → `flex-grow: N`
- [ ] Per-item data-order (1-12) → `order: N`
- [ ] Per-item data-align → `align-self`
- [ ] Responsive: `@media (width < 768px)` stacks items unless `no-wrap`
- [ ] All values via CSS tokens (no hardcoded px/colors)
- [ ] Document `768px` breakpoint exception in comment

### Phase 4: Accessibility & Quality
- [ ] Semantic structure: items as list or divs with proper flow
- [ ] Ensure tab order follows visual order (warn if `data-order` breaks this)
- [ ] Lint passes (both CSS and JS)
- [ ] No inline style= attributes — data attributes only

### Phase 5: Testing & PR
- [ ] Test with rinvoq-hcp brand tokens
- [ ] Test with skyrizi-hcp brand tokens
- [ ] Test with linzess brand tokens
- [ ] Test mobile responsive (stacking)
- [ ] Test all variants (direction, justify, align)
- [ ] Commit and push to `flexbox-block` branch
- [ ] Create PR against develop

## Files to Create/Modify

| File | Purpose |
|---|---|
| `blocks/flexbox/flexbox.js` | Block decoration JS |
| `blocks/flexbox/flexbox.css` | Base CSS with all flex variants |
| `blocks/flexbox/block-config.js` | Empty default config |
| `blocks/flexbox/rinvoq-hcp/_flexbox.css` | Brand source (imports base) |
| `blocks/flexbox/rinvoq-hcp/flexbox.css` | Brand compiled CSS |
| `blocks/flexbox/skyrizi-hcp/_flexbox.css` | Brand source |
| `blocks/flexbox/skyrizi-hcp/flexbox.css` | Brand compiled CSS |
| `blocks/flexbox/linzess/_flexbox.css` | Brand source |
| `blocks/flexbox/linzess/flexbox.css` | Brand compiled CSS |
| `component-definition.json` | Register flexbox + flexbox-item |
| `component-models.json` | Add flexbox model with items sub-model |
| `component-filters.json` | Allow in section |

## Implementation Notes

- **Difference from Columns block:** Columns uses CSS Grid with equal/offset splits. Flexbox uses CSS Flex with per-item grow ratios and ordering — used when items need unequal dynamic sizing or reordering.
- **No JS layout library** — pure CSS flex with class/attribute selectors
- **Per-item fields** are rendered as data attributes by the block JS, CSS reads them
- The `flexbox-sixty-thirty` / `flexbox-twenty-eighty` patterns from AEM map to per-item `grow` values (e.g., grow=6 + grow=3 for 60/30 split)
- Brand CSS overrides are minimal — mainly gap/padding tokens

## Execution

Implementation requires Execute mode. Create a new branch `flexbox-block` off `develop` and implement following the checklist above.
