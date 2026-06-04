# EDS Content Pipeline — plain.html Authoring Rules

Guide for authoring `.plain.html` content files that correctly pass through
the `html2md → md2jcr` conversion pipeline. Use this skill BEFORE creating
any `.plain.html` file for page migration or content import.

## Related skills

- **abbvie-block-analysis** — per-block Row Mapping + field details
- **ue-component-model** — Universal Editor JSON model structure
- **aemcoder-migration-orchestrator** — full migration workflow
- **pharma-content-fidelity** — regulated content rules

## When to use this skill

Trigger this skill when:
- Creating a new `.plain.html` file for any page
- Debugging md2jcr errors ("Cannot read properties of undefined")
- Counting rows for a block table
- Verifying field alignment before publishing
- Encountering silent content loss during import
- Asking "how many rows should this block have?"
- Asking "why is my field value missing after import?"

---

## Pipeline Overview

```
plain.html → helix-html2md → markdown (.md) → helix-md2jcr → JCR XML (.xml)
```

### Stage 1: HTML to Markdown (helix-html2md)

Converts EDS-style HTML into markdown format.

**Critical requirements:**
- Content MUST be inside `<main>` tags (or output is empty)
- Each top-level `<div>` in `<main>` becomes a section
- Sections separated by being separate `<div>` children of `<main>`
- Blocks detected by: CSS class name + child `<div>` rows + nested `<div>` cells
- `<picture>/<img>` → markdown reference-style images
- Block tables become grid-tables in markdown (NOT pipe tables)
- CSS classes convert to Title Case for block names
- Multiple classes → variants in parentheses
- Max 200 images per page; data URIs are discarded
- HTML size must be under 1MB

### Stage 2: Markdown to JCR (helix-md2jcr)

Converts markdown into JCR XML by mapping content cells to Universal Editor
component model fields.

**Critical behavior:**
- Thematic breaks (`---`) create section boundaries
- Content cells map SEQUENTIALLY to model fields
- Images first, then links, headings, then richtext
- **Richtext fields are GREEDY** — consume all remaining content in a cell
- Field hints (`<!-- field:fieldName -->`) override automatic resolution

---

## The #1 Rule: Count Field GROUPS, Not Fields

Each table row maps to one **field group**, not individual fields.

A block model with 14 declared fields may only need 10 rows because:
- `tab` fields are UI markers only — no row
- `classes` (multiselect) → class attribute — no row
- `classes_*` prefixed fields → class attribute — no row
- Suffix fields (`Alt`, `MimeType`, `Type`, `Text`, `Title`) collapse into
  their base field — no separate row

### Row Count Formula

```
Rows = (total model fields)
     − (tab fields)
     − (classes multiselect field)
     − (classes_* prefixed fields)
     − (suffix-collapsed fields: *Alt, *MimeType, *Type, *Text, *Title)
```

### Example: Hero Block (14 model fields → 8 rows)

| Model Field | Component | Row? | Reason |
|---|---|---|---|
| classes | multiselect | NO | → class attribute |
| image | reference | YES (Row 1) | |
| imageAlt | text | NO | collapses into `image` |
| mobileImage | reference | YES (Row 2) | |
| mobileImageAlt | text | NO | collapses into `mobileImage` |
| eyebrow | text | YES (Row 3) | |
| indication | richtext | YES (Row 4) | |
| text | richtext | YES (Row 5) | |
| layers | richtext | YES (Row 6) | |
| video | reference | YES (Row 7) | |
| imageCaption | text | YES (Row 8) | |
| classes_textAlign | select | NO | → class attribute |
| classes_textColor | select | NO | → class attribute |
| classes_customClass | text | NO | → class attribute |

---

## Field Grouping Rules (4 rules)

### Rule 1: Prefix Grouping (`classes_*`)

Fields sharing the `classes_` prefix form ONE group. They all go to the
block element's `class` attribute and NEVER consume rows.

```
classes_textAlign    → class attr
classes_textColor    → class attr  } = 0 rows total
classes_customClass  → class attr
```

### Rule 2: Suffix Collapsing

Fields ending in these suffixes collapse into their "base field" as one group:

| Suffix | Base Example | Combined |
|---|---|---|
| `Alt` | `image` + `imageAlt` | 1 row (image) |
| `MimeType` | `video` + `videoMimeType` | 1 row (video) |
| `Type` | `link` + `linkType` | 1 row (link) |
| `Text` | `link` + `linkText` | 1 row (link) |
| `Title` | `link` + `linkTitle` | 1 row (link) |

**In plain.html:** The suffix field's value goes as an HTML attribute on
the base field's element:
```html
<!-- image + imageAlt = 1 row -->
<div><div><picture><img src="/path/image.jpg" alt="Alt text here"></picture></div></div>
```

### Rule 3: `classes` Exclusion

A literal field named `classes` (the variant multiselect) is handled
separately — it goes to the block element's class attribute in the
block table header, NOT as a row.

```html
<!-- classes values go here, in the block div's class attr -->
<div class="hero no-padding">
```

### Rule 4: Field Hints Override

When automatic field resolution fails (richtext greedily consuming
content, ambiguous field types), use HTML comments:

```html
<div>
  <div><!-- field:barLabel -->Immunology Therapies</div>
</div>
```

This directs md2jcr to map the cell content to the named field,
bypassing sequential resolution.

---

## Suffix Field Naming Dangers

The md2jcr `_fixFieldOrder()` method **silently drops** fields ending
with dangerous suffixes when no matching base field exists in the data.

### Dangerous Suffixes

| Suffix | Dropped when... | Safe alternative |
|---|---|---|
| `Alt` | No base field `image` exists for `imageAlt` | `altLabel`, `accessibleName` |
| `MimeType` | No base field `video` exists for `videoMimeType` | Keep base or rename |
| `Type` | No base field `link` exists for `linkType` | `linkKind` |
| `Text` | No base field `overlay` exists for `overlayText` | `overlayLabel`, `overlayContent` |
| `Title` | No base field `overlay` exists for `overlayTitle` | `overlayHeading`, `overlayCaption` |

**Impact:** Values silently disappear during import — NO error message,
just missing content in the published page.

**Prevention:** When naming custom fields in `_{block-name}.json`, avoid
these suffixes unless a corresponding base field exists.

---

## plain.html Structure Rules

### Section Structure

```html
<div>                          <!-- section 1 -->

<div class="block-name variant1 variant2">  <!-- block -->
    <div><div>Row 1 cell</div></div>
    <div><div>Row 2 cell</div></div>
</div>

<div class="section-metadata">
    <div><div>style</div><div>my-section-class</div></div>
</div>

</div>                         <!-- end section 1 -->

<div>                          <!-- section 2 -->
...
</div>
```

### Block Table Structure

Three-level nesting required: block div → row divs → cell divs

```html
<div class="block-name">           <!-- block container with class -->
    <div>                          <!-- row 1 -->
        <div>cell content</div>    <!-- cell 1 -->
        <div>cell content</div>    <!-- cell 2 (for item blocks) -->
    </div>
    <div>                          <!-- row 2 -->
        <div>cell content</div>
    </div>
</div>
```

### Empty Fields Still Need Rows

To maintain field alignment, empty fields MUST have empty row markup:

```html
<div><div></div></div>    <!-- empty field — preserves row order -->
```

Skipping an empty row shifts ALL subsequent field mappings.

### Image Fields

```html
<!-- Single image (reference component) -->
<div><div><picture><img src="/path/to/image.jpg" alt="Description"></picture></div></div>

<!-- Empty image field -->
<div><div></div></div>
```

### Link Fields (aem-content component)

```html
<div><div><a href="/path/to/page">Link text</a></div></div>
```

### Richtext Fields

```html
<div><div><h2>Heading</h2>
<p>Paragraph with <strong>bold</strong> and <em>italic</em>.</p>
<ul><li>List item</li></ul></div></div>
```

### blockId and language Fields

These special fields use prefix format:

```html
<div><div>id:my-block-id</div></div>      <!-- blockId field -->
<div><div>lang:none</div></div>            <!-- language field -->
```

---

## Item Blocks (Parent + Children)

For blocks with child items (cards-grid, accordion, brand-explorer):

- **Parent rows:** One row per parent-model field group (excluding tabs/classes)
- **Item rows:** One row per item, containing multiple cells (one per
  item-model field group)

### Item Cell Count Formula

```
Cells per item row = (item model fields)
                   − (tab fields in item model)
                   − (classes_* fields in item model)
                   − (suffix-collapsed fields in item model)
```

### Example: Brand Explorer Item (8 cells per item row)

```html
<div>
    <div><picture><img src="logo.png" alt="Logo"></picture></div>  <!-- logo + logoAlt collapsed -->
    <div>Brand Name</div>                                           <!-- brandName -->
    <div>Immunology</div>                                           <!-- therapeuticArea -->
    <div>Description text</div>                                     <!-- description -->
    <div><a href="https://example.com">URL</a></div>               <!-- brandUrl -->
    <div><strong>Safety text</strong></div>                         <!-- safetyText -->
    <div>Indication1|/url1|severity\nIndication2|/url2|severity</div> <!-- indications -->
</div>
```

---

## Section Metadata

Section metadata is authored as the LAST block in a section:

```html
<div class="section-metadata">
    <div><div>style</div><div>my-custom-class</div></div>
    <div><div>section-id</div><div>my-section-id</div></div>
</div>
```

**Key names recognized by `aem.js`:**
- `style` → adds CSS class(es) to the section div
- `section-id` or `sectionid` → sets the DOM `id` attribute
- `background` → sets background image

**Important:** Use `section-id` (not `id`) for the key — only `section-id`
and `sectionid` are recognized by the section metadata parser.

### Section Class Property — `style_` vs `classes_` (CRITICAL for md2jcr)

For section classes to be properly emitted in the md2jcr pipeline, the
field name in `component-models.json` (section model) MUST use `style`
or `style_` prefix — NOT `classes_`.

**Why:** The md2jcr converter recognizes `style` and `style_*` as the
section class property. Using `classes_customClass` produces a `classes`
row in the markdown that md2jcr doesn't map to the section's style
attribute — causing classes to NOT be applied.

**Correct field naming in section model:**

| Field name | Produces in markdown | Result |
|---|---|---|
| `style` | `style \| my-class` | Classes applied to section |
| `style_customDynamicClass` | `style_customDynamicClass \| my-class,other-class` | Classes applied |
| `classes_customClass` | `classes_customClass \| my-class` | NOT applied (wrong prefix) |

**Markdown output for section metadata (correct):**

```
+--------------------------------------------------------+
| Section Metadata                                       |
+---------------------------+----------------------------+
| style_customDynamicClass | content-wide,medium-radius |
+---------------------------+----------------------------+
```

**For custom section models (e.g., grid-container):**

```
+-----------------------------------------------------------------------+
| Section Metadata                                                      |
+---------------------------+-------------------------------------------+
| blockModelId              | grid-container                            |
+---------------------------+-------------------------------------------+
| style_container           | grid-container                            |
+---------------------------+-------------------------------------------+
| name                      | Grid Container                            |
+---------------------------+-------------------------------------------+
| style_customDynamicClass  | grid-container,content-regular,light-grey |
+---------------------------+-------------------------------------------+
| language                  | none                                      |
+---------------------------+-------------------------------------------+
```

**Action required in codebase:** In `models/_section.json` and
`component-models.json`, rename `classes_customClass` to
`style_customDynamicClass` (or just `style` if only one class field is
needed). This ensures the md2jcr pipeline correctly emits section classes.

**In plain.html content:** Use the corresponding key name:
```html
<div class="section-metadata">
    <div><div>style_customDynamicClass</div><div>content-wide,medium-radius</div></div>
</div>
```

Or if using simple `style`:
```html
<div class="section-metadata">
    <div><div>style</div><div>my-section-class</div></div>
</div>
```

---

## Page Metadata

Page metadata is the LAST section in the document:

```html
<div class="metadata">
    <div><div>brand</div><div>rinvoq-hcp</div></div>
    <div><div>nav</div><div>/rinvoq-hcp/dermatology-nav</div></div>
    <div><div>footer</div><div>/rinvoq-hcp/footer</div></div>
    <div><div>title</div><div>Page Title</div></div>
    <div><div>description</div><div>Meta description</div></div>
</div>
```

---

## Validation Checklist (Before Publishing)

Run this checklist for EVERY `.plain.html` before publishing:

- [ ] Content is wrapped in top-level `<div>` sections
- [ ] Each block has correct three-level nesting (class div → rows → cells)
- [ ] Row count matches field GROUP count (not raw field count)
- [ ] Empty fields have `<div><div></div></div>` rows to preserve order
- [ ] Item rows have correct cell count per item model
- [ ] `classes` and `classes_*` values are in block element class attr, NOT rows
- [ ] `blockId` formatted as `id:VALUE`
- [ ] `language` formatted as `lang:VALUE`
- [ ] Images use real URLs (not data URIs or blob URLs)
- [ ] Image fields use `<picture><img>` with `alt` attribute
- [ ] Link fields use `<a href="...">` elements
- [ ] No HTML `<table>` inside block cells (use EDS table block instead)
- [ ] Suffix fields (`*Alt`, `*Text`, `*Title`) have matching base fields
- [ ] Block name in class attr matches component title exactly
- [ ] Section metadata uses `section-id` (not bare `id`) for IDs
- [ ] Section class fields use `style_` prefix (not `classes_`)
- [ ] Page metadata is the last section
- [ ] Total HTML < 1MB, < 200 images

---

## Common Failures and Fixes

### "Cannot read properties of undefined (reading 'fields')"

**Cause:** Row count mismatch or item cell count mismatch.
**Fix:** Recount field groups. Verify suffix collapsing. Check item model.

### Silent content loss (field value missing after import)

**Cause:** Orphan suffix field (`overlayTitle` without `overlay` base).
**Fix:** Rename the field to avoid dangerous suffixes.

### Content appears in wrong field

**Cause:** Richtext field consumed content meant for next field.
**Fix:** Add `<!-- field:fieldName -->` hint to direct content.

### Block not recognized (renders as plain text)

**Cause:** Missing class on block div, or wrong nesting level.
**Fix:** Ensure `<div class="block-name">` with child `<div>` rows.

### Section metadata class not applied

**Cause:** Using `classes_*` instead of `style_*` in section model, or
using bare `id` instead of `section-id` for IDs, or section-metadata
not being the last element in the section.
**Fix:** Use `style_` prefix for section class fields. Use `section-id`
key. Ensure section-metadata is the final block in the section.

---

## Quick Reference: Field Group Count for Top Blocks

| Block | Model Fields | Tab Fields | classes/classes_* | Suffix Collapsed | **Row Count** |
|---|---|---|---|---|---|
| Hero | 14 | 0 | 4 (classes + 3 classes_*) | 2 (imageAlt, mobileImageAlt) | **8** |
| CTA | 16 | 0 | 2 (classes + classes_common) | 0 | **12** |
| Accordion | 20+ | 3 | 3+ | 0 | **~14** |
| Cards-Grid | 1 | 0 | 1 (classes) | 0 | **0 parent rows** |
| Brand-Explorer | 13 | 2 | 2 | 0 | **9 parent rows** |
| Text-Container | varies | 1+ | 1+ | 0 | **3** (id + lang + content) |
| Safety-Bar | varies | 1+ | 1+ | 0 | **5** |

Always verify against the actual `_{block-name}.json` model file.

---

## Integration with Project Workflow

1. **Before authoring:** Read the block model (`blocks/{name}/_{name}.json`)
2. **Count field groups:** Apply the 4 rules above
3. **Author plain.html:** Follow structure rules exactly
4. **Validate:** Run the checklist above
5. **Test locally:** Preview at `localhost:3000` if possible
6. **Publish:** md2jcr will convert correctly if rules are followed

For block-specific Row Mapping tables, always refer to the
`abbvie-block-analysis` skill which documents the exact row structure
for all 68 blocks in this project.
