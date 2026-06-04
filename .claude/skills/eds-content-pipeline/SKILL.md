# EDS Content Pipeline — plain.html Authoring & md2jcr Fix Rules

Guide for authoring `.plain.html` content files that correctly pass through
the `html2md → md2jcr` conversion pipeline. Use BEFORE creating any
`.plain.html` file. Also documents verified fixes for md2jcr errors.

## When to use

- Creating/fixing `.plain.html` files
- md2jcr errors: "Cannot read properties of undefined", "content isn't mapping"
- Counting rows/cells for a block table
- Debugging silent content loss after import

---

## Pipeline: `plain.html → html2md → markdown → md2jcr → JCR XML`

## The FieldGroup Algorithm (from md2jcr source code)

Located at: `node_modules/@adobe/helix-md2jcr/src/mdast2jcr/domain/FieldGroup.js`

```javascript
// 1. Filter out tabs and literal "classes" field
fields.filter(f => f.component !== 'tab').filter(f => f.name !== 'classes')

// 2. If field.name contains "_", group ALL by prefix before first "_"
//    → classes_textAlign + classes_textColor + classes_customClass = ONE group "classes"

// 3. Suffix collapsing: Alt, MimeType, Type, Text, Title
//    → if base field exists, collapse into it (1 row)
//    → if base field MISSING, field is DROPPED (orphan = 0 rows)
```

---

## Verified Fix 1: Underscore grouping = ONE row per prefix

ALL `classes_*` fields → ONE group "classes" → ONE row (even if empty).

```html
<div><div></div></div>   <!-- ONE row for ALL classes_* fields -->
```

## Verified Fix 2: Row ORDER must match model declaration order

Model: text(richtext), blockId(text), classes_*(text), language(select)
→ Rows: content, id:value, empty, lang:value

**WRONG:** `id:` first, `lang:` second, content last
**CORRECT:** content FIRST, `id:` second, empty third, `lang:` last

## Verified Fix 3: Multiline content in grid-table cell breaks md2jcr

Heading + image in one cell → md2jcr can't parse.
Split into separate rows (text field + layers field).

## Verified Fix 4: Orphan suffix fields are DROPPED

Fields ending in Alt/Text/Title/Type/MimeType without matching base → dropped.

**Fixed in this project:**
- `logoAlt` → `logoAccessibleName`
- `navLink1Text` → `navLink1Label` (and 2, 3)
- `safetyText` → `safetyContent`

## Verified Fix 5: text-container flat model (4 rows)

Restructured from parent+child to flat:
1. `text` (richtext content)
2. `blockId` (id:value)
3. `classes` group (empty row)
4. `language` (lang:value)

```html
<div class="text-container legal">
    <div><div>RICHTEXT CONTENT</div></div>
    <div><div>id:abbv_use_statement</div></div>
    <div><div></div></div>
    <div><div>lang:none</div></div>
</div>
```

## Verified Fix 6: brand-explorer (12 parent rows, 8 item cells)

Parent rows (in order): anchorId, barLabel, projectNumber, navLink1Label,
navLink1Url, navLink2Label, navLink2Url, navLink3Label, navLink3Url,
blockId, classes(empty), language

Item cells: logo(img+alt), logoAccessibleName, brandName, therapeuticArea,
description, brandUrl, safetyContent, indications

---

## Local Validation Script

```bash
node -e "
const { html2md } = require('@adobe/helix-html2md');
const { md2jcr } = require('@adobe/helix-md2jcr');
const fs = require('fs');
const html = fs.readFileSync('content/PAGE.plain.html', 'utf8');
const fullHtml = '<html><body><header></header><main>' + html + '</main><footer></footer></body></html>';
const log = { info:()=>{}, warn:console.warn, error:console.error, debug:()=>{} };
async function run() {
  const md = await html2md(fullHtml, { log, url: 'https://example.com/' });
  const opts = { log, models: JSON.parse(fs.readFileSync('component-models.json','utf8')), definition: JSON.parse(fs.readFileSync('component-definition.json','utf8')), filters: JSON.parse(fs.readFileSync('component-filters.json','utf8')) };
  try { const xml = await md2jcr(md, opts); console.log('SUCCESS: ' + xml.length + ' chars'); }
  catch(e) { console.log('FAIL: ' + e.message); }
}
run();
"
```
