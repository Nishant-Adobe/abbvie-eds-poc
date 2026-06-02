# Canonical first-prompt — internal migration guidance

This is your internal reference when starting migration of any new page.
Read it as your own instructions — you ARE the migration agent executing
this workflow directly. Fill in `{{...}}` placeholders mentally based on
the user's request. Remove sections that don't apply.

---

```markdown
You are helping migrate the **{{BRAND_NAME}}** brand site
({{LIVE_HOMEPAGE_URL}}) into the multi-brand AEM Edge Delivery Services
project at https://github.com/Nishant-Adobe/abbvie-eds-poc.

The block library and brand foundation already exist. Your job is to
author the page end-to-end in Universal Editor using existing blocks
with ≥90% pixel-perfect fidelity. NO new blocks, NO base block edits.

## 0. Warm-up — read these first, then summarize back

Before doing anything, read and acknowledge:

1. **Repo:** https://github.com/Nishant-Adobe/abbvie-eds-poc
   (default: `develop`)
2. **Key docs (root):** README.md, CLAUDE.md, PROMPTS.md, DOCUMENTATION.md,
   agents.md
3. **Existing brand assets to reuse — do NOT recreate:**
   - `brand-config.json` — `{{BRAND_KEY}}` is registered
   - `styles/{{BRAND_KEY}}/_tokens.css` — brand colors, named palette
   - `styles/{{BRAND_KEY}}/_fonts.css` — brand font family
   - `styles/{{BRAND_KEY}}/_styles.css`, `_themes.css` — brand globals
4. **Block library (65 blocks under `/blocks/`):** {{BLOCK_LIST_OR_REFER_TO_REPO}}.
   Blocks with `{{BRAND_KEY}}` brand override CSS already in place:
   {{BRAND_CUSTOMIZED_BLOCKS}}.
   Other blocks inherit base styling — **that is by design** (loader
   silently falls back; missing `blocks/{block}/{{BRAND_KEY}}/` is
   intentional inheritance, NOT a gap).
5. **UE component models:** Each block has `_{block-name}.json` partial.
   Compiled to root `component-{models,definition,filters}.json` via
   `npm run scaffold:build`.

After reading, summarize: (a) multi-brand cascade in 2–3 sentences,
(b) likely block fit per page section, (c) any gaps you anticipate.

---

## 1. Mission

Migrate the page {{TARGET_URL}} into the project, authored end-to-end
in UE using existing blocks and brand assets. ≥90% pixel-perfect at
1440px desktop AND 390px mobile.

{{FULL_SCOPE_TABLE_IF_PART_OF_A_LARGER_BATCH}}

Execute order: 1 → 2 → ... → N. Do not begin page N until page N-1 is
approved. Today's scope is page {{N}}: {{TARGET_URL}}.

---

## 2. HARD RULES (apply to every section, every viewport, every commit)

### A. Content fidelity
1. **Verbatim copy from live source DOM.** Zero paraphrase, zero
   reorder, zero spelling fix, zero punctuation "improvement."
   Especially for indication, contraindication, Boxed Warning, dosing,
   lab values, adverse reactions, references, footnotes, job codes.
2. **Class names diverge** between Platform-C `abbv-*` and our EDS
   naming. Do NOT rename our classes to match. Match the *visual and
   behavioral* outcome only.
3. **A11y:** single H1 per page, alt text on every content image,
   `aria-label` on every icon-only control, individual links per
   indication card (not one link wrapping the whole card), touch
   targets ≥44×44 px.

### B. Scope / where to edit (lowest specificity first, never skip levels)
1. **Author content field** — fix in UE / `.plain.html` row.
2. **Custom class on section/block + brand global rule** —
   `styles/{{BRAND_KEY}}/_styles.css`. One-off variants live here.
3. **Brand block CSS partial** —
   `blocks/{block}/{{BRAND_KEY}}/_{block}.css`, then
   `npm run scaffold:build:block --block-name X --brand-name {{BRAND_KEY}}`.
   Never edit compiled `*.css`.
4. **Token edit** — `_tokens.css`. Only if brand-wide effect intended.
   **Requires explicit user approval.**
5. **Base block CSS or JS** — ESCALATE, do not patch. Affects all 9 brands.
6. **No `!important` ever.**
7. **Brand override is OPT-IN** — missing `blocks/{block}/{{BRAND_KEY}}/`
   means inheritance is intentional. Don't auto-create.

### C. Regression protection (MECHANICAL — AEMCODER-013)

**The canonical list of approved pages is in
`.claude/skills/aemcoder-migration-orchestrator/approved-pages.json`.**
Read it. Don't rely on memory.

**Shared-File Inventory** — these files trigger cross-page regression
risk. Editing any of them MUST follow the pre-edit gate below.

| File pattern | Affects |
|---|---|
| `styles/{brand}/_tokens.css` | ALL pages w/ `brand: {brand}` |
| `styles/{brand}/_fonts.css` | ALL pages w/ `brand: {brand}` |
| `styles/{brand}/_styles.css` | ALL pages w/ `brand: {brand}` |
| `blocks/{block}/{brand}/_{block}.css` | All pages using that block + brand |
| `blocks/{block}/block-config.js` (base OR brand) | All pages using that block |
| Fragment docs (`/nav`, `/footer`, `/safety-bar`, etc.) | All pages referencing |
| `models/_*.json` partials | All pages using affected block |
| `component-{models,definition,filters}.json` | NEVER edit manually |

**PRE-EDIT GATE — mandatory:**
1. Identify if the file you're about to edit is in the Shared-File Inventory.
2. If YES: BEFORE editing, snapshot EACH page in `approved-pages.json`
   `pages[]` at 1440px AND 390px. Save as baseline.
3. Apply the edit. Run `npm run scaffold:build:block --block-name X
   --brand-name {{BRAND_KEY}}` if CSS partials touched.
4. AFTER editing, re-snapshot EACH page at 1440 + 390.
5. Diff against the pre-edit baseline. ANY unintended visual change on
   ANY approved page = REGRESSION.

**On regression:**
- REVERT the edit immediately.
- Narrow scope: prefer `classes_commonCustomClass` value on the section
  + a tightly-scoped rule in `styles/{{BRAND_KEY}}/_styles.css` over
  brand-wide changes.
- Re-attempt with the narrower fix; repeat the gate.

**On approval gate (before declaring "done"):**
- Re-snapshot every page in `approved-pages.json` `pages[]` at 1440 + 390.
- Confirm zero unintended changes.
- Then ask for user approval.

**When the user approves the current in-progress page:**
- Move the entry from `inProgress` to `pages` in `approved-pages.json`.
- Set `approvedDate`.
- All future edits will then guard regression against this page too.

### D. Page structure / metadata / fragments
1. First, identify header fragment, footer fragment, safety-bar
   fragment, nav fragment. Pharma sites often have *per-condition* nav
   and indication text — **verify whether shared or sectioned** before
   assuming.
2. Page metadata required: `brand: {{BRAND_KEY}}`, `nav: /...`,
   `footer: /...`, title, description, OG image.
3. `.plain.html` in `content/` is **gitignored local-only preview**.
   AEM / UE / JCR is separate. Never confuse the two.

### E. Responsive
1. **Mobile-first.** Use `@media (min-width: 600px)` and
   `@media (min-width: 900px)` for progressive enhancement. Avoid
   `max-width` overrides unless mobile-first restructure requires
   base-block edits.
2. **Project root font-size is 10px** — `0.9rem` = 9px. Use absolute
   px when matching live's `14px`, `16px`, etc.
3. Hide images on mobile via `picture/srcset` or `display: none` on the
   container that holds the `<img>`. Don't leave empty divs adding height.
4. Touch targets ≥44×44 px.

### F. Assets
1. When live site uses an SVG/PNG, **download once** to
   `content/content/dam/abbvie-eds-poc/{filename}` and reference at
   `/content/dam/abbvie-eds-poc/{filename}`. **Never simulate with CSS
   gradients.**
2. Fonts: live `font-family: "Graphik Medium"` ≠ regular Graphik +
   `font-weight: 500`. Match the *family name* the live site declares.

### G. Pixel diff workflow (per section)
1. **Inspect live DOM and computed styles at desktop AND mobile in
   DevTools BEFORE writing any CSS.** Paste live values into proposal.
2. Tag every delta with one of: Author content / Token / Brand CSS /
   Custom class / Variant / Asset / Base block CSS / Base block JS /
   A11y / Fragment / Fragment-not-referenced.
3. Apply fix at lowest level; re-measure; report deltas.
4. Stop at ≥90% per viewport OR after 3 rounds (escalate).

### H. Approval gates (CRITICAL)
1. **Never `git add` / `commit` / `push` without explicit user approval.**
2. **Never declare "done" or "≥90% match" without** (a) per-viewport
   screenshots at 1440 / 768 / 390, (b) regression check on other
   approved pages.

### I. xwalk / md2jcr content format
1. Parent block: one `<div><div>value</div></div>` row per non-tab,
   non-`classes_*` model field, in model order. Empty rows for empty fields.
2. Item rows: one `<div>` with one `<div>` cell per non-tab,
   non-`classes_*` item-model field, in model order.
3. `classes_*` fields (including `classes`, `classes_commonCustomClass`,
   `classes_iconType`, etc.) are NEVER rows/cells — they live in the
   block element's class attribute.
4. `blockId` → row with value `id:value`. `language` → row with value
   `lang:value`. These ARE rows (they're not `classes_*` prefixed).
5. Alt text fields (`logoAlt`, `imageAlt`, etc.) ARE regular rows/cells
   for blocks with a `commonProperties` tab. Validate against working
   test content (accordion-test.plain.html, cta-button-test.plain.html).
6. Before publishing, validate: parent row count = non-tab non-classes_*
   field count; item cell count = non-tab non-classes_* item-field count.

### J. Analytics & tracking attribute preservation
1. **Preserve verbatim** any of these attributes from live source DOM:
   - `data-cmp-data-layer` (Adobe Experience Cloud data layer payloads)
   - `data-track-*` (e.g. `data-track-pageload`, `data-track-link`,
     `data-track-cta`) — used by AbbVie marketing analytics
   - `data-analytics-*` (generic analytics tagging)
   - `data-gtm-*` (Google Tag Manager hooks)
   - `data-cmp-*` (Adobe Component data attributes beyond data-layer)
2. **Where they live:** in the block's authored content (`.plain.html` row
   values can include attributes when inline HTML is used) OR added at the
   block-decoration JS layer (brand `block-config.js`, not base).
3. **Do NOT silently drop** these attributes when migrating. They are
   invisible to pixel diff but business-critical — marketing teams
   instrument conversion funnels, A/B tests, and attribution against them.
4. **Validation:** for any migrated section, grep the rendered DOM for
   `data-cmp-`, `data-track-`, `data-analytics-`, `data-gtm-` and compare
   counts vs live source. Counts must match. Any missing attribute is a
   defect (silent but high-impact).
5. **JSON payloads in `data-cmp-data-layer`** must be byte-for-byte
   identical — even whitespace and key ordering can break downstream
   parsers. Copy verbatim.

---

## 3. Workflow — follow phases in order, do not skip or combine

### Phase A — Site-wide design audit (skip if previously done for this brand)
1. Scrape live homepage + 1 deeper page to extract design system
   (colors, type scale, spacing, shadows, radii, breakpoints, footnote
   styles, table/chart conventions).
2. **Diff against `styles/{{BRAND_KEY}}/_tokens.css`.** Report any
   mismatches. Do NOT modify tokens unless I approve each delta.
3. Confirm `_fonts.css` covers all weights/styles used by live.
4. **Output:** design audit report. Wait for approval.

### Phase B — Page migration (single-page)
1. Scrape live page; extract sections in document order; identify
   content sequence per section.
2. For each section, map to best-fit block. **Prefer reuse.** No new
   blocks. If block is missing, STOP and ask.
3. Generate UE authoring tree: per-block field values matching
   `_{block-name}.json` model.
4. Apply `brand: {{BRAND_KEY}}` page metadata.
5. Render locally (`aem up`); pixel diff vs live at 1440 + 390. Report
   % match per section.
6. Iterate on author content (not block code) until ≥90% match.
7. **Output:** page authored + diff report. Wait for approval.

### Phase C — Cross-page reuse (for pages 2..N of a batch)
{{ONLY_IF_BATCH_MIGRATION}}
Per page, FIRST produce a section-by-section comparison vs already-approved
pages. Categorize each section: **REUSE** (1:1 author swap) /
**VARIATION** (same block, different config or custom class) /
**NEW** (full block-fit analysis). Default to REUSE.

### Phase D — Cross-viewport + cross-page QA
- Per-section pixel match table at 1440 / 768 / 390.
- Confirm previously approved pages unregressed.
- Verify safety-bar fragment unchanged across all pages.
- Verify shared assets (`_styles.css`, `_tokens.css`, fragments) unchanged
  unless explicitly approved.

---

## 4. Before you start

Ask me clarifying questions about anything ambiguous:
- AEM author URL / org / repo binding for UE
- Pixel-diff tolerance per breakpoint (default: 10% per section, 5% overall)
- Brightcove credentials / account IDs (if video blocks present)
- How references / footnotes should be authored (inline tooltip vs end-of-section list)
- Whether header / nav differs per section path
- Anything in the live source that doesn't obviously map to a library block

Do not begin Phase A until I confirm the answers.
```

---

## Placeholder filling guide

| Placeholder | Example |
|---|---|
| `{{BRAND_NAME}}` | Rinvoq HCP, Skyrizi HCP, Linzess, Mavyret, Venclexta, Botox |
| `{{BRAND_KEY}}` | `rinvoq-hcp`, `skyrizi-hcp`, `linzess`, `mavyret`, `venclexta`, `botox`, `abbvie`, `rinvoq`, `rinvoq-dtc` |
| `{{LIVE_HOMEPAGE_URL}}` | https://www.rinvoqhcp.com |
| `{{TARGET_URL}}` | https://www.rinvoqhcp.com/dermatology/dosing-lab-monitoring |
| `{{N}}` | 3 (page sequence number in batch) |
| `{{FULL_SCOPE_TABLE_IF_PART_OF_A_LARGER_BATCH}}` | Markdown table of all pages with execution order |
| `{{BRAND_CUSTOMIZED_BLOCKS}}` | Run `ls -d blocks/*/{{BRAND_KEY}}/ \| sed 's\|blocks/\|\|;s\|/{{BRAND_KEY}}/\|\|'` to enumerate (substitute actual brand key) |
| `{{BLOCK_LIST_OR_REFER_TO_REPO}}` | Inline list of 65 blocks OR "see `/blocks/` directory" |
| `{{ONLY_IF_BATCH_MIGRATION}}` | Remove section entirely if migrating one standalone page |

## How to use this template

1. Read the fenced block above as your internal instructions.
2. Fill in `{{...}}` placeholders from the user's request context.
3. Skip sections that don't apply (Phase A if already done for the brand,
   Phase C if standalone page, batch table if standalone).
4. Execute the workflow directly — present your summary + clarifying
   questions to the user before beginning.
5. After user answers, begin Phase A (or Phase B if A was previously done).

For per-section repairs after the initial scaffolding, follow the
companion `aemcoder-section-fix-loop` skill workflow.
