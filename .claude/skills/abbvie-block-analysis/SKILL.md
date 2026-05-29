---
name: abbvie-block-analysis
description: Per-block xwalk model reference for the AbbVie commercial pharma EDS multi-brand project. Provides Row Mapping tables (plain.html row → field), applyCommonProps usage, field-level component/valueType, CSS variants, brand-override coverage, and authoring rules for the top 20 most-used blocks, plus lightweight pointers for the remaining 48 blocks. Use whenever migrating, authoring, or debugging a block — especially for md2jcr errors ("Cannot read properties of undefined (reading 'fields')"), row-count mismatches, plain.html structure questions, or aemcoder confusion about block field shapes. Trigger phrases include "block model", "row mapping", "plain.html structure", "{block-name} fields", "applyCommonProps", "md2jcr error", "block fields reference", "what fields does {block-name} have", "how many rows in {block-name} block table".
---

# AbbVie Block Analysis — xwalk Model Reference

Per-block xwalk model details for the 68 blocks in this multi-brand project.
Sister skill to `abbvie-block-library` (which is a brand-coverage matrix) —
this one is xwalk model depth.

## Related skills

- **abbvie-block-library** — brand × block usage matrix, Platform-C DOM selectors
- **ue-component-model** — UE `component-{models,definition,filters}.json` wiring
- **abbvie-page-migration** — general Platform-C → EDS migration patterns
- **aemcoder-section-fix-loop** — uses this skill for block fit decisions
- **building-brand-blocks** — block CSS development with brand cascade

## When to use this skill

Trigger this skill when:
- Constructing a `.plain.html` block table for any block — need Row Mapping
- Debugging md2jcr errors ("Cannot read properties of undefined (reading 'fields')")
- Counting rows vs model fields (the #1 cause of aemcoder failure AEMCODER-010)
- Identifying which fields are `classes_*` (don't go in rows — go in class attr)
- Deciding block fit during migration — need full field list, variants, brand coverage
- Asking "how many cells per item row?" / "what's the order?"
- Aemcoder authoring is producing wrong structure

## Cross-block conventions (apply to ALL 68 blocks)

### Row Mapping rules (CRITICAL — md2jcr will fail without these)

For `.plain.html` content files (xwalk content format):

1. **Parent block fields:** one `<div><div>VALUE</div></div>` row per field in
   the model's `fields` array, in declared order, EXCEPT:
   - `tab` fields are NOT rows (they're UI section markers in UE only)
   - `classes_*` fields are NOT rows (they go in the block element's `class` attr)
   - `blockId` field → emitted as `id:VALUE` row
   - `language` field → emitted as `lang:VALUE` row
2. **Empty fields still need their row** to maintain order alignment. Skipping
   an empty row shifts every subsequent row's meaning.
3. **Item rows (for blocks with child items):** ONE `<div>` containing ONE
   `<div>` cell per item-model field, in declared order. Same `tab` / `classes_*`
   exclusions apply at the item level.
4. **Validation before publish:** parent row count = (model field count − tab
   fields − classes_* fields + (1 if blockId) + (1 if language)). Item cell
   count = (item-model field count − tab fields − classes_* fields).

### `classes_*` field placement

Fields prefixed `classes_` (e.g. `classes_textAlign`, `classes_iconType`,
`classes_allowMultipleOpen`) get appended to the block element's `class`
attribute. Authors see them as picklist/boolean controls in UE. They DO NOT
emit rows in `.plain.html`.

Boolean `classes_*` fields: present in class list when `true`, absent when
`false`. So `classes_showExpandCollapseAll: true` → class `show-expand-collapse-all`.

### `applyCommonProps` blocks

Five top-20 blocks call `applyCommonProps(block)` from `scripts/utils.js`:
`accordion`, `cta`, `text-container`, `brand-explorer`, `fact-card`. This
utility reads common-properties rows from the block table and applies them
to the block element (custom class, blockId, language).

For these blocks, the LAST rows of the block table are the common-properties
rows. The exact `startIndex` (i.e. where common-props rows begin) is the
number of model-data rows BEFORE the common-properties tab.

### `renderBlock` (multi-theme loader) blocks

Five top-20 blocks use `renderBlock` from `scripts/multi-theme.js` instead of
direct `decorate()`: `cards-grid`, `header`, `footer`, `carousel-video-playlist`.
These support brand-aware decoration via `block-config.js` overrides (see
`reference_eds_multibrand` memory + `building-brand-blocks` skill).

### Brand override discovery

Before assuming brand styling exists or is needed:
```sh
ls blocks/{block-name}/{brand-key}/ 2>/dev/null
```
Missing folder = intentional inheritance from base, NOT a gap. The loader
silently falls back via `.catch(() => {})` in `scripts/aem.js` `loadBlock`.

### Variant registration

Variants (block-element CSS classes like `.cards-grid.brush`,
`.accordion.icon-font`) are EITHER:
- Pure CSS variants — just style with the class selector, no registration needed
- JS-augmented variants — register in `blocks/{block}/block-config.js`
  `variations` array; trigger conditional module import

### Header / Footer special case

`header` and `footer` have NO `_header.json` / `_footer.json` model file —
they are built blocks loaded via the Fragment system. Their content is
authored as a Fragment document at a path like `/nav` or `/footer` and
referenced from page metadata (`nav: /...`, `footer: /...`).

---

# Top 20 blocks — full reference

## 1. Hero (`hero`)

Most-customized block in the project. Front-and-center on every brand homepage.

- **Model:** `blocks/hero/_hero.json`
- **JS:** `blocks/hero/hero.js` (async decorate, no applyCommonProps, no renderBlock)
- **CSS:** `blocks/hero/hero.css`
- **Block-config:** `blocks/hero/block-config.js` (variations: none)
- **Brand overrides:** abbvie, botox, linzess, mavyret, rinvoq, rinvoq-hcp, skyrizi-hcp, venclexta (8 brands)
- **Filter children:** none (no child items)

### Block-level model fields (in order)

| # | Field | Component | valueType | Notes |
|---|---|---|---|---|
| 1 | classes | multiselect | string | layout/variant picklist; appended to class attr |
| 2 | image | reference | string | desktop hero image |
| 3 | imageAlt | text | string | alt text — REQUIRED for a11y |
| 4 | mobileImage | reference | string | optional mobile-specific image |
| 5 | mobileImageAlt | text | string | mobile alt |
| 6 | eyebrow | text | string | small text above heading |
| 7 | indication | richtext | string | optional indication paragraph (HCP) |
| 8 | text | richtext | string | hero body (h1, paragraphs) |
| 9 | layers | richtext | string | overlay text/SVG layers |
| 10 | video | reference | string | optional hero video |
| 11 | imageCaption | text | string | caption text |
| 12 | classes_textAlign | select | string | class attr only — NOT a row |
| 13 | classes_textColor | select | string | class attr only — NOT a row |
| 14 | classes_customClass | text | string | class attr only — NOT a row |

### Row Mapping (`.plain.html`)

11 rows (fields 2–11; field 1 is `classes` multiselect → class attr, fields 12–14 are `classes_*`).

```
Row 1: <div><div>image-reference-or-img-tag</div></div>
Row 2: <div><div>imageAlt-text</div></div>
Row 3: <div><div>mobileImage-reference</div></div>
Row 4: <div><div>mobileImageAlt-text</div></div>
Row 5: <div><div>eyebrow-text</div></div>
Row 6: <div><div>indication-richtext</div></div>
Row 7: <div><div>text-richtext</div></div>
Row 8: <div><div>layers-richtext</div></div>
Row 9: <div><div>video-reference</div></div>
Row 10: <div><div>imageCaption-text</div></div>
```

### Authoring rules

- **Single H1 per page.** Hero is the natural H1 location — author it inside
  `text` field. Don't repeat in other blocks.
- **`imageAlt` is mandatory** for a11y. Empty alt only acceptable for
  decorative-only images (rare in hero).
- **Mobile image:** if live source uses different aspect ratio mobile-vs-desktop,
  set `mobileImage` separately. Don't CSS-crop a desktop image — it loads
  full bytes on mobile.
- **LCP candidate:** the hero `image` is the LCP candidate. Keep it in the
  first section, don't lazy-load it.

## 2. Cards Grid (`cards-grid`)

Highly variant — used for indication links, support cards, resource cards,
brush-stroke decorated cards. Variant selection is critical (see
AEMCODER-001).

- **Model:** `blocks/cards-grid/_cards-grid.json`
- **JS:** `blocks/cards-grid/cards-grid.js` (calls `renderBlock` — supports brand block-config)
- **Brand overrides:** linzess, mavyret, rinvoq, rinvoq-hcp, skyrizi-hcp, venclexta (6 brands)
- **Filter children:** `grid-card` (item type)

### Block-level model fields

| # | Field | Component | Notes |
|---|---|---|---|
| 1 | classes | multiselect | layout/variant picklist (class attr) |

### Item-level model fields (`grid-card`)

| # | Field | Component | Notes |
|---|---|---|---|
| 1 | link | aem-content | link target |
| 2 | image | reference | card image |
| 3 | line1 | richtext | typically heading |
| 4 | line2 | richtext | body |
| 5 | line3 | richtext | optional |
| 6 | line4 | richtext | optional (CTA label often) |

### Row Mapping

Parent: NO rows (only `classes` which is class attr).
Item rows: one `<div>` per card, each containing **6 cells** in order:
`link`, `image`, `line1`, `line2`, `line3`, `line4`.

```
<div class="cards-grid {classes-picklist-values}">
  <div>
    <div>link</div><div>image</div><div>line1</div><div>line2</div><div>line3</div><div>line4</div>
  </div>
  <div>... next card ...</div>
</div>
```

### Variants observed in chat history

- `cards-grid-cta-card` — pill-button variant; NOT for indication-link cards (text+chevron). Distinguish.
- "brush card" — gold brush-stroke decoration; use custom class + brand global CSS, NOT a new brand override.

### Authoring rules

- Use **single `<a>` per card** would defeat screen readers — make line4 an
  inline CTA link with explicit href.
- For indication-link cards on homepage: line1 = indication name, no pill button.
- For glacier support cards: pill CTA in line4.

## 3. Accordion (`accordion`)

8-brand coverage. Uses `applyCommonProps`. Variants: `variation-name`.

- **Model:** `blocks/accordion/_accordion.json`
- **JS:** `blocks/accordion/accordion.js` (calls `applyCommonProps`)
- **Brand overrides:** abbvie, botox, linzess, mavyret, rinvoq, rinvoq-hcp, skyrizi-hcp, venclexta (8)
- **Filter children:** `accordion-item`

### Block-level fields (selected — full list has 20)

`overview` (tab, skip), `blockHeading` (text), `classes_allowMultipleOpen`
(boolean class attr), `classes_showExpandCollapseAll` (boolean class attr),
`expandAllLabel`, `collapseAllLabel`, `classes_iconType` (select class attr),
`expandAllIcon`, `collapseAllIcon`, `expandIcon`, `collapseIcon`,
`expandAllIconImage` (reference), `collapseAllIconImage`, `expandIconImage`,
`collapseIconImage`, `accessibility` (tab, skip), `ariaExpandAllLabel`,
`ariaCollapseAllLabel`, `analyticsId`, `styles` (tab, skip).

### Item-level fields (`accordion-item`)

`overview` (tab, skip), `summary` (text), `text` (richtext),
`classes_defaultOpen` (boolean class attr), `accessibility` (tab, skip),
`ariaExpandLabel`, `ariaCollapseLabel`, `anchorId`, `image` (reference),
`imageAlt`.

### Row Mapping

Parent: exclude 3 tab fields + 3 `classes_*` fields. ~14 rows for non-classes
block fields, in declared order. Plus item rows (one per accordion item),
each with ~8 cells (excluding tabs and `classes_*`).

### Authoring rules

- **`ariaExpandLabel` / `ariaCollapseLabel` mandatory** for a11y.
- Boolean `classes_*` fields: `true` → class present on block element.
  E.g. `classes_allowMultipleOpen: true` adds `allow-multiple-open` class.
- For Boxed Warning content inside an accordion: use the `text` richtext
  field with verbatim live-source HTML. Don't paraphrase.

## 4. Safety Bar (`safety-bar`)

The MOST regulated block. Always invoke `pharma-content-fidelity` skill
alongside this one.

- **Model:** `blocks/safety-bar/_safety-bar.json`
- **JS:** `blocks/safety-bar/safety-bar.js` (no applyCommonProps, no renderBlock)
- **Brand overrides:** abbvie, botox, linzess, mavyret, rinvoq, rinvoq-hcp, skyrizi-hcp, venclexta (8)

### Block-level fields

Check `_safety-bar.json` — typically: `blockHeading`, `collapsedContent` (richtext), `expandedContent` (richtext), `referencesContent` (richtext), `jobCode`, plus `classes_*` for state styling, plus accessibility tab fields.

### Authoring rules

- **Verbatim copy from live source DOM.** ZERO paraphrase of any safety subsection.
- **Boxed Warning visual treatment is regulatory** — must be visually distinct,
  not just text-distinct.
- **Source of truth is the Fragment**, NOT the page. Safety-bar is typically a
  Fragment shared across all pages in a brand section. Edit the Fragment doc,
  it propagates to all pages.
- **References round-trip**: every body-copy superscript (¹, ², †) MUST have a
  matching reference entry; every reference entry must have a body citation.
- **Job code** (e.g. `US-RNQ-250017`) is mandatory metadata — preserve verbatim.
- **Expanded state content** is SEPARATE from collapsed — both states need
  full content (don't ship expanded with partial subsections).

See **pharma-content-fidelity** skill for the full compliance checklist.

## 5. Header (`header`) — fragment-loaded special

NO model JSON file. Loaded as a Fragment.

- **JS:** `blocks/header/header.js` (calls `renderBlock` — supports brand block-config)
- **Brand overrides:** abbvie, botox, linzess, mavyret, rinvoq, rinvoq-hcp, skyrizi-hcp, venclexta (8)
- **Loading mechanism:** `getMetadata('nav')` reads the fragment path from page metadata; falls back to `/nav` or `/header` if unset

### Authoring

- Author header content as a Fragment document at `/nav` (default) or any path.
- Set page metadata `nav: /path/to/header-fragment` on each page.
- **Pharma sites often use per-section nav** (e.g. `/rinvoq-hcp/header` for
  homepage, `/rinvoq-hcp/header-dermatology` for `/dermatology/*` pages).
- For brand-specific behavior (active-state, indication text injection):
  edit `blocks/header/rinvoq-hcp/block-config.js`, not base `header.js`.

### Authoring rules

- **Verbatim nav labels** from live source. Don't shorten mobile labels unless
  live source shows shorter mobile labels.
- **Touch targets ≥44×44px** on hamburger, drawer items, close, chevrons.
- **Single H1 not applicable** — header is non-content; main page heading is H1.

## 6. Footer (`footer`) — fragment-loaded special

Mirror of header. NO model JSON. Loaded as Fragment.

- **JS:** `blocks/footer/footer.js` (calls `renderBlock`)
- **Brand overrides:** abbvie, botox, linzess, mavyret, rinvoq, rinvoq-hcp, skyrizi-hcp, venclexta (8)
- **Loading:** `getMetadata('footer')` for fragment path

### Authoring

- Author footer as Fragment at `/footer` (default) or any path.
- Set page metadata `footer: /path/to/footer-fragment`.
- Footer is typically SHARED across all brand pages — verify before forking.

### Authoring rules

- Job code, copyright year, link disclosures preserved verbatim from live.
- Legal text often includes the brand's drug name in italic per FDA convention.

## 7. Tabs (`tabs`)

8-brand coverage. Uses no applyCommonProps.

- **Model:** `blocks/tabs/_tabs.json`
- **Brand overrides:** abbvie, botox, linzess, mavyret, rinvoq, rinvoq-hcp, skyrizi-hcp, venclexta (8)
- **Filter children:** `tab` item type

### Fields

Block: `blockHeading`, `classes_*` for orientation/style, accessibility fields.
Item (`tab`): `tabLabel` (text), `tabContent` (richtext), `anchorId`.

### Authoring rules

- Each tab item = one row with cells in item-model order.
- Tab labels verbatim from live.
- ARIA: `aria-selected`, `aria-controls`, `role="tab"` / `role="tabpanel"` —
  base block handles these; don't override.

## 8. Modal (`modal`)

8-brand coverage.

- **Model:** `blocks/modal/_modal.json`
- **Brand overrides:** abbvie, botox, linzess, mavyret, rinvoq, rinvoq-hcp, skyrizi-hcp, venclexta (8)

### Fields

Typically: `modalTitle`, `modalContent` (richtext), `triggerLabel`,
`triggerType`, `classes_size`, accessibility fields, `closeButtonLabel`.

### Authoring rules

- **Exit / interstitial modals** often have regulated copy ("You are now leaving
  rinvoqhcp.com" + drug disclaimer) — verbatim.
- **Focus trap on open, restore focus on close** — base block handles; don't override.
- **`aria-label` mandatory** on close button.

## 9. Columns (`columns`)

9-brand coverage (every brand customized). Universal layout primitive.

- **Model:** `blocks/columns/_columns.json`
- **Brand overrides:** all 9 brands
- **Filter children:** typically allows any block; check filter

### Fields

Block: `classes` (column count and layout picklist), `classes_*` for alignment.
No item-level model — children are arbitrary blocks placed inside the columns
container.

### Authoring rules

- For 2-col / 3-col layouts, set `classes` to the right preset.
- Mobile stacking: base CSS stacks below 600px by default.

## 10. CTA (`cta`)

9-brand coverage. Uses `applyCommonProps`.

- **Model:** `blocks/cta/_cta.json`
- **JS:** calls `applyCommonProps`
- **Brand overrides:** all 9 brands

### Fields

Block: `ctaLabel` (text), `link` (aem-content), `classes_style` (primary/secondary/text-link),
`classes_iconAfter` (boolean — `::after` arrow icon), `ariaLabel`, then common-properties tab.

### Row Mapping

Order: `ctaLabel`, `link`, `ariaLabel`, common-properties (id, language, custom class).
`classes_*` go in class attr.

### Authoring rules

- Live source CTAs often use `display: inline-flex` with `::after` SVG arrow —
  enable via `classes_iconAfter: true` not by adding the SVG to the label.
- `ariaLabel` only needed if visual label is icon-only or ambiguous.

## 11. Rich Text (`rich-text`)

9-brand coverage. Most ubiquitous content block. No applyCommonProps.

- **Model:** `blocks/rich-text/_rich-text.json`
- **Brand overrides:** all 9 brands

### Fields

Typically just: `content` (richtext), plus `classes_*` for alignment / size.

### Row Mapping

Trivial — 1 row with the richtext content. Plus `classes_*` on the block element.

### Authoring rules

- For ISI body content, use **text-container** (block 12) instead — it has
  more semantic structure for Boxed Warning, indication, contraindications.
- `rich-text` is for general body copy.

## 12. Text Container (`text-container`)

Critical for ISI / Boxed Warning / regulated copy authoring. Uses `applyCommonProps`.

- **Model:** `blocks/text-container/_text-container.json`
- **JS:** calls `applyCommonProps`
- **Brand overrides:** abbvie, botox, rinvoq (3 brands — base inheritance handles others)
- **Variants:** `variation-name` (boxed-warning, indication, references, legal, etc.)

### Fields

Typically: `blockHeading`, `content` (richtext), `classes` (multiselect for
variant — `boxed-warning`, `indication`, `references`, `legal`, etc.), then
common-properties tab.

### Variant: Boxed Warning

`classes` includes `boxed-warning` → class `text-container-boxed-warning` →
brand CSS applies regulatory visual treatment (border, background, weight).
Live source may use `rinvoq-isi-black-bg`; map to our `boxed-warning` variant.

### Variant: References

`classes` includes `references` → renders as `<ol>` with numbered list.

### Authoring rules

- **Verbatim copy from live source.** Especially for Boxed Warning.
- Use semantic markup: `<sup>` for footnote markers, `<ol>/<li>` for references.
- See **pharma-content-fidelity** for full compliance ruleset.

## 13. Brand Explorer (`brand-explorer`)

HCP sites only. Uses `applyCommonProps`. Has hoist logic in JS to move the bar
above the header.

- **Model:** `blocks/brand-explorer/_brand-explorer.json`
- **JS:** calls `applyCommonProps`; hoists `<section>` to be `header.before(section)`
- **Brand overrides:** abbvie, botox, rinvoq-hcp, skyrizi-hcp (4)

### Block-level fields

`overview` (tab, skip), `classes` (select for variant), `anchorId`, `barLabel`
(text — the cross-condition switcher label), `projectNumber`, `navTab` (tab, skip),
plus item rows for each nav link.

### Item-level fields

Typically: `label`, `link`, `target` per nav item.

### Authoring rules

- `barLabel` is critical — paraphrase failure mode (AEMCODER-001) used wrong
  label. Get verbatim from live source.
- The bar background color must match the header bar — typically a brand-token
  value, not a hardcoded color.

## 14. Formulary Lookup (`formulary-lookup`)

Brand-aware via `getMetadata('brand')` in JS. 6-brand coverage.

- **Model:** `blocks/formulary-lookup/_formulary-lookup.json`
- **JS:** reads `brand` metadata to route to brand-specific data
- **Brand overrides:** linzess, mavyret, rinvoq, rinvoq-dtc, rinvoq-hcp, skyrizi-hcp (6)

### Fields

`blockHeading`, `helpText`, `searchInputLabel`, `submitButtonLabel`, plus item
rows for default plan results.

### Authoring rules

- Brand-specific results table is data-driven from a sheet/endpoint;
  authoring controls only the UI text.
- HCP-specific disclaimer copy must be verbatim.

## 15. Carousel Video Playlist (`carousel-video-playlist`)

8-brand coverage. Uses `renderBlock`.

- **Model:** `blocks/carousel-video-playlist/_carousel-video-playlist.json`
- **JS:** calls `renderBlock` (brand block-config supported)
- **Brand overrides:** abbvie, botox, linzess, mavyret, rinvoq, rinvoq-hcp, skyrizi-hcp, venclexta (8)
- **Filter children:** video item

### Fields

Block: `blockHeading`, `classes` for layout.
Item: `videoTitle`, `videoId` (Brightcove account+video IDs), `posterImage`,
`description`, `transcript` (richtext, often conditional).

### Authoring rules

- **Brightcove credentials** (account ID + video ID) come from live source DOM
  — copy verbatim, don't fabricate.
- **Delayed loading** for Brightcove (third-party). Don't preload.
- **Transcripts mandatory** for video content on pharma sites (WCAG / Section 508).

## 16. Fact Card (`fact-card`)

Used in dosing / clinical pages. Uses `applyCommonProps`.

- **Model:** `blocks/fact-card/_fact-card.json`
- **JS:** calls `applyCommonProps`

### Fields

`overview` (tab, skip), `factNumber` (text — large display number),
`factUnit`, `factDescription` (richtext), `classes` for color variant,
accessibility fields, common-properties tab.

### Authoring rules

- For clinical efficacy numbers: verbatim from live, including footnote markers.
- `factDescription` should include the asterisk/dagger annotation that links
  to the references list.

## 17. Info Tree (`info-tree`)

Hierarchical info presentation. No applyCommonProps, no renderBlock — direct
decorate.

- **Model:** `blocks/info-tree/_info-tree.json`

### Fields

Usually: `blockHeading`, plus nested item rows for tree branches/leaves.

### Authoring rules

- Used for mechanism-of-action and clinical-data hierarchical content.
- Heading order matters for screen readers — start at the page's next-available
  heading level.

## 18. Image Compare (`image-compare`)

Before/after slider. 4-brand coverage.

- **Model:** `blocks/image-compare/_image-compare.json`
- **Brand overrides:** abbvie, botox, rinvoq, rinvoq-hcp (4)

### Fields

`beforeImage` (reference), `beforeImageAlt`, `beforeLabel`, `afterImage`,
`afterImageAlt`, `afterLabel`, `classes_*` for slider position.

### Authoring rules

- **Both alt texts mandatory.** Pharma efficacy comparisons MUST describe
  what the image shows (skin clearance, joint inflammation, etc.).
- Don't fabricate before/after pairings — match exactly from live source.

## 19. Story Cards (`story-cards`)

Used for Real Patients pages. 3-brand coverage.

- **Model:** `blocks/story-cards/_story-cards.json`
- **JS:** async decorate, no applyCommonProps/renderBlock
- **Brand overrides:** abbvie, botox, rinvoq (3 — base inheritance for others)
- **Filter children:** story-card item

### Fields

Block: `blockHeading`, `classes` for grid layout.
Item: `patientName` (or pseudonym), `patientImage`, `quote` (richtext), `link`
(aem-content for detail page), `consentDisclaimer`.

### Authoring rules

- **Patient consent disclaimer** must be present and verbatim — regulatory.
- **Model release notice** ("Actor portrayal" or "Real patient") preserved
  verbatim.
- Image alt must describe the patient context, not just "person smiling".

## 20. Brightcove Video (`brightcove-video`)

Direct video embed (single video, not playlist). No applyCommonProps.

- **Model:** `blocks/brightcove-video/_brightcove-video.json`
- **Brand overrides:** abbvie, botox, rinvoq (3)

### Fields

`videoTitle`, `accountId` (Brightcove account), `playerId`, `videoId`,
`posterImage`, `transcript` (richtext), `classes_autoplay` (boolean class attr),
`classes_*` for player skin.

### Authoring rules

- **Delayed loading** — Brightcove script loads in `delayed.js`, not eager.
- **`transcript` mandatory** for HCP/regulated content.
- **No autoplay** in pharma context unless live source has it explicitly.

---

# Remaining 48 blocks — lightweight pointers

For full details, read the model file directly: `blocks/{block-name}/_{block-name}.json`.

### anchor-nav
- Purpose: in-page anchor navigation bar
- Brands: abbvie, botox, rinvoq
- Variants: none
- Filter children: anchor-nav-item

### banner-ad
- Purpose: GPT ad-unit OR embed code rendering
- Brands: abbvie, botox, rinvoq
- Variants: none

### breadcrumb
- Purpose: breadcrumb trail navigation
- Brands: abbvie, botox, rinvoq, skyrizi-hcp
- Variants: variation-name

### brightcove-podcast-player
- Purpose: Brightcove podcast embed
- Brands: abbvie, botox, rinvoq
- Variants: variation-name

### cards
- Purpose: generic card grid (lighter than cards-grid)
- Brands: abbvie, botox, rinvoq
- Variants: none

### carousel
- Purpose: generic image/content carousel
- Brands: abbvie, botox, rinvoq, rinvoq-hcp
- Variants: variation-name

### chart
- Purpose: data visualization (efficacy charts, forest plots)
- Brands: abbvie, botox, rinvoq
- Variants: variation-name
- Notes: critical for H2H comparison pages

### clinical-data-panel
- Purpose: structured clinical data presentation
- Brands: mavyret, skyrizi-hcp
- Variants: none
- Notes: used for dosing schedules, lab monitoring

### custom-image
- Purpose: image with custom positioning/sizing options
- Brands: abbvie, botox, rinvoq
- Variants: variation-name

### custom-title
- Purpose: heading with custom styling options
- Brands: abbvie, botox, rinvoq
- Variants: variation-name

### dismiss
- Purpose: dismissable banner/notification
- Brands: rinvoq (only)
- Variants: none

### dismissible
- Purpose: similar to dismiss with different DOM hooks
- Brands: abbvie, botox, rinvoq
- Variants: none

### doctor-locator
- Purpose: HCP locator widget
- Brands: abbvie, botox, rinvoq
- Variants: none

### drcom-widget
- Purpose: Doctor.com integration widget
- Brands: abbvie, botox, rinvoq
- Variants: none

### eds-form
- Purpose: EDS-native form builder
- Brands: abbvie, botox, rinvoq
- Variants: variation-name

### embed
- Purpose: generic iframe / script embed
- Brands: abbvie, botox, rinvoq
- Variants: variation-name

### embed-form
- Purpose: third-party form embed (Marketo, Salesforce)
- Brands: abbvie, botox, rinvoq
- Variants: variation-name

### find-provider
- Purpose: provider lookup widget
- Brands: all 9 (most-customized after rich-text)
- Variants: none

### flexbox
- Purpose: flex layout container
- Brands: linzess, rinvoq-hcp, skyrizi-hcp
- Variants: none

### form
- Purpose: legacy form block
- Brands: abbvie, botox, rinvoq
- Variants: variation-name

### fragment
- Purpose: include another fragment document
- Brands: abbvie, botox, rinvoq
- Variants: none

### hotspot
- Purpose: image with interactive hotspots
- Brands: abbvie, botox, rinvoq
- Variants: none

### image-text
- Purpose: side-by-side image + text
- Brands: none (base only — inherited everywhere)
- Variants: none

### linklist
- Purpose: list of links with optional headings
- Brands: abbvie, botox, rinvoq
- Variants: variation-name

### navigation-content
- Purpose: secondary nav block (in-page nav, related links)
- Brands: abbvie, botox, rinvoq
- Variants: variation-name

### news-feed
- Purpose: news article feed
- Brands: abbvie, botox, rinvoq
- Variants: variation-name

### parallax
- Purpose: parallax background scroll
- Brands: mavyret, skyrizi-hcp
- Variants: none

### pipeline-utility-nav
- Purpose: pipeline-page utility bar
- Brands: abbvie, botox, rinvoq
- Variants: variation-name

### press-releases
- Purpose: press release listing
- Brands: abbvie, botox, rinvoq
- Variants: variation-name

### promo-drawer
- Purpose: promotional drawer/banner
- Brands: abbvie, botox, rinvoq
- Variants: none

### quick-poll
- Purpose: interactive poll/quiz
- Brands: abbvie, botox, rinvoq
- Variants: none

### quote
- Purpose: pull quote / testimonial
- Brands: abbvie, botox, rinvoq
- Variants: variation-name

### search
- Purpose: search results display
- Brands: abbvie, botox, rinvoq
- Variants: variation-name

### search-input
- Purpose: search input control
- Brands: none (base only)
- Variants: none

### section-nav
- Purpose: section-level secondary navigation
- Brands: linzess, rinvoq-hcp, skyrizi-hcp
- Variants: none
- Notes: used for sub-section nav within condition pages

### send-mail
- Purpose: email-this-page sharing
- Brands: abbvie, botox, rinvoq
- Variants: none

### separator
- Purpose: section divider / horizontal rule
- Brands: abbvie, botox, rinvoq
- Variants: variation-name

### social-media
- Purpose: social media icon links
- Brands: abbvie, botox, rinvoq
- Variants: variation-name

### social-share
- Purpose: share-this-page widget
- Brands: none (base only)
- Variants: variation-name

### sticky-sidebar
- Purpose: sidebar that sticks during scroll
- Brands: abbvie, botox, rinvoq
- Variants: variation-name

### stock-ticker
- Purpose: ABBV stock price widget
- Brands: abbvie, botox, rinvoq
- Variants: variation-name

### story-card
- Purpose: single story card (used standalone, not in story-cards grid)
- Brands: abbvie, botox, rinvoq
- Variants: variation-name

### table
- Purpose: data table with sorting/filtering
- Brands: abbvie, botox, rinvoq
- Variants: variation-name
- Notes: use for dosing schedules — needs `<th scope>` semantics

### tag-utility-nav
- Purpose: tag-based utility navigation
- Brands: abbvie, botox, rinvoq
- Variants: variation-name

### teaser
- Purpose: teaser card (image + heading + CTA)
- Brands: abbvie, botox, rinvoq
- Variants: variation-name

### tooltip
- Purpose: inline tooltip for footnote/reference markers
- Brands: abbvie, botox, rinvoq
- Variants: none

### ugc-detail
- Purpose: user-generated content detail page
- Brands: abbvie, botox, rinvoq
- Variants: none

### video
- Purpose: generic HTML5 video player
- Brands: abbvie, botox, rinvoq
- Variants: variation-name
- Notes: for non-Brightcove video; otherwise use `brightcove-video`

---

# Anti-patterns from chat history

These have caused real failures during aemcoder migration of rinvoqhcp.com
and /dermatology (May 21–29, 2026):

### "13 rows vs 10 rows" confusion (AEMCODER-010)
**Problem:** Aemcoder counted model fields including tabs and `classes_*`,
giving wrong row count for `.plain.html`.
**Fix:** Always exclude `tab` and `classes_*` fields when counting. Use the
Row Mapping section above per block.

### Brand Explorer "Cannot read properties of undefined (reading 'fields')"
**Problem:** Item row had wrong cell count (8 cells instead of 7, or
vice versa).
**Fix:** Item row cell count = item-model field count (excluding tabs and
`classes_*`). For brand-explorer, count items in `models[1].fields` in the
JSON.

### Picking wrong variant for cards-grid (AEMCODER-001)
**Problem:** Used `cards-grid-cta-card` variant for BOTH indication-link cards
(plain text + chevron) AND glacier patient-support cards (pill buttons).
**Fix:** Indication cards = no pill variant; glacier cards = pill variant.
Different `classes` selections per usage.

### Treating header as universally shared (AEMCODER-004)
**Problem:** Assumed homepage header fragment serves /dermatology too.
**Fix:** Pharma sites use per-section headers. Author distinct fragments;
set `nav: /path` page metadata per page. Header block reads metadata.

### Verbatim safety copy violations (AEMCODER-005)
**Problem:** Dropped "Limitations of Use", abbreviated indications, missing
8+ ISI subsections in expanded state.
**Fix:** ALWAYS edit the safety-bar Fragment doc with verbatim source. Use
`pharma-content-fidelity` skill.

### Creating brand override folders for one-offs
**Problem:** Added `blocks/cards-grid/rinvoq-hcp/_cards-grid.css` rules for
a one-off homepage decoration.
**Fix:** Use `classes_commonCustomClass` value + scoped rule in
`styles/{brand}/_styles.css`. Brand block override is for RECURRING patterns,
not one-offs.

### `applyCommonProps` startIndex miscounted
**Problem:** Block table missing rows before the common-properties block.
**Fix:** For `accordion`, `cta`, `text-container`, `brand-explorer`, `fact-card`:
the last 1–3 rows of the table are common-properties (id, lang, customClass).
Count model fields BEFORE the `accessibility` / `styles` tab to get
startIndex.

### Conflating `_block.json` with compiled `component-models.json`
**Problem:** Edited root `component-models.json` directly; was overwritten
by next build.
**Fix:** Always edit per-block `_{block-name}.json`. The root files compile
from these via `npm run scaffold:build`.

---

## Validation checklist before publishing a block table

- [ ] Counted model fields excluding `tab` and `classes_*`
- [ ] Parent row count matches that exclusion-adjusted count
- [ ] Item row cell count matches item-model exclusion-adjusted count
- [ ] `blockId` row formatted as `id:VALUE`
- [ ] `language` row formatted as `lang:VALUE`
- [ ] `classes_*` boolean values reflected in block element class attr (not as rows)
- [ ] `classes` multiselect picklist values reflected in block element class attr
- [ ] Empty fields still emit `<div><div></div></div>` row to preserve order
- [ ] For Boxed Warning / ISI content: verbatim from live source DOM
- [ ] For Brightcove videos: accountId + videoId from live source
- [ ] For images: alt text on every content image

If all checked: ready to publish. If any unchecked: do not publish; md2jcr will fail.
