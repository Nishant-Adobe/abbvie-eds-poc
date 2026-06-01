# md2jcr Block Mapping Gap Report

**Project:** AbbVie EDS Multi-Brand POC  
**Date:** 2026-06-01  
**Reporter:** Linzess Migration Team  
**Severity:** Blocker for content import via `.plain.html`

---

## Summary

When importing content via `.plain.html` files (the xwalk content pipeline), md2jcr rejects block tables that don't provide **exactly** the number of rows/cells matching the compiled component model. This makes it impossible to import content for blocks with complex models (many optional fields) without manually providing empty rows for every single field — even fields that are irrelevant to the current brand or page.

---

## Affected Blocks

| Block | Config Fields | Item Fields | Status |
|-------|--------------|-------------|--------|
| Hero | 14 | N/A (single instance) | ❌ Fails — tried 14 rows, 14 cols, 13 rows — all rejected |
| Accordion | 24 | 9 per item | ❌ Fails — existing test page has 16 rows, needs 24 |
| CTA | 14+ (with spread) | N/A | ❌ Fails |
| Cards Grid | 1 + spread | 6 per item | ❌ Fails |
| Columns | 2 + spread | 3 per item | ⚠️ Partially works |
| Carousel Video Playlist | 8 | 7 per item | ✅ Works (manually matched) |
| Safety Bar | 3 | N/A | ✅ Works |

**Pattern:** Blocks with ≤8 config fields and clear item structure work. Blocks with 14+ fields or complex spreads fail regardless of format attempted.

---

## Error Message

```
[block-name] has errors! The content isn't mapping to the model correctly,
likely due to the import script generating incompatible markdown. Review the
model file and ensure the import script meets all column and row requirements,
every field must align with a column, even if empty.
```

---

## Root Cause

md2jcr performs strict field-count validation when converting `.plain.html` block tables to JCR nodes. It requires:

1. **Exact row count** matching the number of non-tab fields in the compiled model (including spreads from `_common-properties.json` and `_language.json`)
2. **Exact cell count** per item row matching the child model's field count
3. **No tolerance** for missing optional fields — every field must have a corresponding row/cell, even if empty

This strict validation does NOT account for:
- Fields that have default values in the model template
- Fields that are brand-specific and irrelevant to the current migration
- Optional fields (aria labels, analytics IDs, icon configurations)
- Fields added via spreads (`_common-properties.json`, `_language.json`) that the content author may not know about

---

## Impact

### Migration Workflow
- Content import via `.plain.html` → md2jcr → JCR is broken for most blocks
- Only 2 out of 7 blocks tested work (carousel-video-playlist, safety-bar)
- The workaround (output as default content) loses block structure entirely
- Authors must manually re-create blocks in Universal Editor after import

### Developer Experience
- No documentation of exact row/cell requirements per block
- The compiled model (component-models.json) must be reverse-engineered to determine field count
- Spread references (`"...": "../../models/_common-properties.json#/common-prop"`) add hidden fields not visible in the block's own `_block.json`
- Field count can change when common-properties or language fields are updated — silently breaking all existing `.plain.html` content

### Multi-Brand Impact
- Models are designed with ALL brand options (24 accordion fields serve different brands)
- A Linzess migration only needs ~5 of those 24 fields
- But md2jcr forces all 24 to be present, making simple content overly complex

---

## Attempted Fixes

| Attempt | Format | Result |
|---------|--------|--------|
| 14 single-cell rows | `<div><div>value</div></div>` per field | ❌ Rejected |
| 1 row with 14 cells | `<div><div>v1</div><div>v2</div>...</div>` | ❌ Rejected |
| 13 rows (exclude classes) | Assumed classes handled by block class attr | ❌ Rejected |
| All fields empty | 14 empty rows | ❌ Rejected |
| Reference fields as text paths | `/content/dam/...` as text | ❌ Rejected |
| Reference fields as `<picture><img>` | Standard EDS image format | ❌ Rejected |
| Reference fields empty | `<div></div>` | ❌ Still rejected |

---

## Proposed Solutions

### Option A: Make md2jcr lenient with optional fields (Recommended)

md2jcr should:
1. Accept partial row content — map provided rows to fields in order, default the rest
2. Use model `"value"` defaults for missing fields
3. Not require rows for fields that have defaults in the template definition
4. Log a warning (not an error) for missing optional fields

**Impact:** Low risk — existing full-row content still works. Partial content now also works.

### Option B: Add a "required" flag to model fields

Allow `_block.json` model fields to be marked as `"required": true`:
```json
{
  "component": "richtext",
  "name": "text",
  "required": true,  // md2jcr errors if missing
  "label": "Content"
}
```

Only required fields would need rows. Optional fields default when absent.

**Impact:** Requires model schema update + md2jcr logic change.

### Option C: Support a "minimal" block format

Allow `.plain.html` to use a simplified format for blocks:
```html
<div class="accordion" data-model="minimal">
  <!-- Only essential fields, rest use defaults -->
  <div><div>Item 1 title</div><div>Item 1 content</div></div>
  <div><div>Item 2 title</div><div>Item 2 content</div></div>
</div>
```

md2jcr maps the provided cells to the first N fields and defaults the rest.

**Impact:** New feature — backward compatible since `data-model="minimal"` is opt-in.

### Option D: Field-name header row (explicit mapping)

Allow the first row to name which fields are being provided:
```html
<div class="accordion">
  <div><div>summary</div><div>text</div></div>  <!-- header row = field names -->
  <div><div>FAQ Title</div><div>FAQ Content</div></div>  <!-- data rows -->
</div>
```

md2jcr uses the header to map cells to fields by name, not position.

**Impact:** Most flexible but requires md2jcr parser change.

---

## Workaround (Current)

For the Linzess migration, we use this approach:
1. **Simple blocks** (carousel-video-playlist, safety-bar): Output as block tables with exact field counts
2. **Complex blocks** (hero, accordion, cta, cards-grid): Output as default content, then convert to blocks manually in Universal Editor after upload
3. **Overall match: ~65%** due to this limitation

---

## Recommendation

**Option A (lenient parsing)** is the lowest-effort fix that unblocks all migrations immediately. The current strict validation serves no user value — authors don't manually write `.plain.html` files with exact field counts. The strictness only blocks automated import workflows.

---

## References

- Compiled model: `component-models.json` (generated by `npm run scaffold:build`)
- Block models: `blocks/{name}/_{name}.json`
- Common properties: `models/_common-properties.json`
- Language field: `models/_language.json`
- md2jcr source: AEM Coder internal pipeline
