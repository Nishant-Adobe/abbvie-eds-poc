# Block Row Mapping Rules for md2jcr (xwalk)

**Source:** PR #83 (`abbvie-block-analysis` skill) + lessons from Linzess migration

---

## Critical Rule: Which fields become rows in `.plain.html`

For xwalk projects, md2jcr maps `.plain.html` block table rows to model fields. The rules are:

### Fields that ARE rows (in declared order):
- `text` → `<div><div>value</div></div>`
- `richtext` → `<div><div><p>rich content</p></div></div>`
- `reference` → `<div><div><picture><img src="..."></picture></div></div>` (when set) or `<div><div></div></div>` (when empty)
- `aem-content` → `<div><div><a href="path">path</a></div></div>`
- `boolean` → `<div><div>true</div></div>` or `<div><div>false</div></div>`
- `number` → `<div><div>0</div></div>`
- `select` (NON-classes_*) → `<div><div>value</div></div>`

### Fields that are NOT rows:
- `tab` → UI section markers in UE only, not content
- `classes` (multiselect) → goes in the block element's `class` attribute
- `classes_*` (any field with `classes_` prefix) → goes in class attribute
- Example: `classes_textAlign`, `classes_textColor`, `classes_customClass`, `classes_variant`, `classes_theme`, `classes_margin`, `classes_alignment`

### Special fields:
- `blockId` → emitted as row with value `id:VALUE`
- `language` → emitted as row with value `lang:VALUE`

### Empty fields still need their row!
Skipping an empty row shifts every subsequent row's meaning. Always emit `<div><div></div></div>` for empty fields.

---

## Hero Block (compiled model: 14 fields)

| # | Field | Component | Row? | Notes |
|---|---|---|---|---|
| 1 | classes | multiselect | ❌ NO | Goes in class attr: `<div class="hero landing full">` |
| 2 | image | reference | ✅ YES | `<picture><img>` or empty |
| 3 | imageAlt | text | ✅ YES | |
| 4 | mobileImage | reference | ✅ YES | `<picture><img>` or empty |
| 5 | mobileImageAlt | text | ✅ YES | |
| 6 | eyebrow | text | ✅ YES | |
| 7 | indication | richtext | ✅ YES | |
| 8 | text | richtext | ✅ YES | H1 + body + CTA |
| 9 | layers | richtext | ✅ YES | |
| 10 | video | reference | ✅ YES | |
| 11 | imageCaption | text | ✅ YES | |
| 12 | classes_textAlign | select | ❌ NO | Goes in class attr |
| 13 | classes_textColor | select | ❌ NO | Goes in class attr |
| 14 | classes_customClass | text | ❌ NO | Goes in class attr |

**Result: 9 content rows** (fields 2-10 + 11 caption = 10, but layers/video usually empty)

**UE output format (from working /linzess/hero.plain.html):** 8 rows
- Row 1: image (`<picture><img>`)
- Row 2: imageAlt (empty)
- Row 3: mobileImage (empty or `<picture><img>`)
- Row 4: mobileImageAlt (empty)
- Row 5: text (richtext with eyebrow as first `<p>`, then `<h1>`, body, CTA)
- Row 6: indication (empty)
- Row 7: video (empty)
- Row 8: imageCaption (text or empty)

**Note:** The UE-authored hero combines eyebrow INTO the `text` richtext field and skips `layers`. This is 8 rows. The `classes_*` values go in the block class: `<div class="hero no-padding text-left linzess-behind-nav-linzess-cta-hero">`.

---

## Accordion Block (compiled model: 24 parent fields + 9 item fields)

### Parent fields:
| # | Field | Component | Row? |
|---|---|---|---|
| 1 | blockHeading | text | ✅ YES |
| 2 | classes_allowMultipleOpen | boolean | ❌ NO (classes_*) |
| 3 | classes_showExpandCollapseAll | boolean | ❌ NO (classes_*) |
| 4 | expandAllLabel | text | ✅ YES |
| 5 | collapseAllLabel | text | ✅ YES |
| 6 | classes_iconType | select | ❌ NO (classes_*) |
| 7 | expandAllIcon | text | ✅ YES |
| 8 | collapseAllIcon | text | ✅ YES |
| 9 | expandIcon | text | ✅ YES |
| 10 | collapseIcon | text | ✅ YES |
| 11 | expandAllIconImage | reference | ✅ YES |
| 12 | collapseAllIconImage | reference | ✅ YES |
| 13 | expandIconImage | reference | ✅ YES |
| 14 | collapseIconImage | reference | ✅ YES |
| 15 | ariaExpandAllLabel | text | ✅ YES |
| 16 | ariaCollapseAllLabel | text | ✅ YES |
| 17 | analyticsId | text | ✅ YES |
| 18 | classes_desktopWidth | select | ❌ NO (classes_*) |
| 19 | classes_alignment | select | ❌ NO (classes_*) |
| 20 | classes_theme | select | ❌ NO (classes_*) |
| 21 | classes_margin | select | ❌ NO (classes_*) |
| 22 | blockId | text | ✅ YES (as `id:VALUE`) |
| 23 | classes_commonCustomClass | text | ❌ NO (classes_*) |
| 24 | language | select | ✅ YES (as `lang:VALUE`) |

**Result: 16 parent rows** (after excluding 8 classes_* fields)

### Item fields (accordion-item, 9 compiled):
| # | Field | Component | Row cell? |
|---|---|---|---|
| 1 | summary | text | ✅ YES |
| 2 | text | richtext | ✅ YES |
| 3 | fragmentPath | text | ✅ YES |
| 4 | classes_defaultOpen | boolean | ❌ NO (classes_*) |
| 5 | ariaExpandLabel | text | ✅ YES |
| 6 | ariaCollapseLabel | text | ✅ YES |
| 7 | anchorId | text | ✅ YES |
| 8 | image | reference | ✅ YES |
| 9 | imageAlt | text | ✅ YES |

**Result: 8 cells per item row** (1 classes_* excluded)

---

## CTA Block (compiled: 14+ fields with spreads)

After excluding tabs and classes_*:
- label (text) ✅
- href (aem-content) ✅
- ariaLabel (text) ✅
- ctaTarget (select) ✅
- modalId (text) ✅
- iconType (select, but NOT classes_*) ✅
- iconFont (text) ✅
- iconImage (reference) ✅
- iconPosition (select, but NOT classes_*) ✅
- ariaHidden (boolean) ✅
- classes (multiselect) ❌ → class attr
- anchorId (text) ✅
- analyticsInteractionId (text) ✅
- blockId (text) ✅ (as `id:VALUE`)
- classes_commonCustomClass (text) ❌
- language (select) ✅ (as `lang:VALUE`)

**Result: ~12 rows** (need to verify against actual UE output)

---

## Validation Formula

```
parent row count = total_fields
  - tab_fields
  - classes_*_fields
  + (1 if blockId present → emit "id:VALUE")
  + (1 if language present → emit "lang:VALUE")

item cell count = total_item_fields
  - tab_fields
  - classes_*_fields
```

---

## Key Findings from Linzess Migration

1. `classes_*` fields do NOT get rows — they go in the `class=""` attribute of the block div
2. The UE-authored hero uses 8 rows (not 14) because 4 `classes_*` + 2 others are excluded
3. `blockId` emits as `id:VALUE` and `language` emits as `lang:VALUE` — special row format
4. Empty reference fields still need `<div><div></div></div>` to maintain order
5. Image references in rows use `<picture><img src="...">` format (not plain text paths)
6. Variant classes go on the block div: `<div class="hero no-padding text-left linzess-behind-nav-linzess-cta-hero">`
