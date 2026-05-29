---
name: abbvie-page-templates
description: Page-type composition recipes for the AbbVie commercial pharma EDS multi-brand project. Each recipe lists the canonical block sequence, section variants, fragment references, and metadata for a specific pharma page archetype — homepage, condition landing, dosing & lab monitoring, real patients, and head-to-head efficacy comparison. Use this skill when STARTING migration of a new page to decide which blocks to use and how to compose them, before invoking aemcoder-migration-orchestrator. Trigger phrases include "page template", "page recipe", "what blocks for {page-type}", "compose {page-type} page", "homepage recipe", "dosing page structure", "real patients page", "H2H comparison page", "condition landing page".
---

# AbbVie Page Templates — Composition Recipes

Per-page-type composition cookbook for commercial pharma brand sites. Tells
you WHICH blocks compose each page archetype, in WHAT ORDER, with WHAT
SECTION VARIANTS — but not block field details (those live in
`abbvie-block-analysis`) or compliance rules (those live in
`pharma-content-fidelity`).

Use this BEFORE invoking aemcoder. The recipe constrains aemcoder's block-fit
decisions and prevents ad-hoc composition mistakes.

## Related skills

- **abbvie-block-analysis** — per-block xwalk model fields and Row Mapping
- **abbvie-block-library** — brand × block usage matrix, Platform-C DOM selectors
- **aemcoder-migration-orchestrator** — invoke AFTER picking the template
- **pharma-content-fidelity** — content rules layered onto every regulated block
- **abbvie-design-tokens** — brand tokens consumed by template CSS
- **aemcoder-section-fix-loop** — per-section repair after template applied

## When to use this skill

Trigger this skill when:
- Starting migration of a NEW page (before aemcoder kickoff)
- Asking "what blocks should this page use?"
- Asking "how does the H2H comparison page typically compose?"
- Reviewing aemcoder's proposed section list and want to verify the
  composition matches an established template
- Designing a page that doesn't fit standard recipe — fall back to
  "Custom / Hybrid" guidance at the end

## How to use the recipes

For any new page:

1. **Identify which archetype it is** (homepage / condition landing /
   clinical / testimonial / comparison / hybrid).
2. **Read that recipe** for the canonical block sequence + section variants.
3. **Verify against live source** — does the actual page match the recipe?
   If yes, follow the recipe. If no, note deviations and either find a
   closer recipe or treat as "Custom / Hybrid".
4. **Hand the recipe + page-specific deltas to aemcoder** via
   `aemcoder-migration-orchestrator/templates/first-prompt.md` (paste the
   relevant recipe into the "Section 1 Mission" or "block-fit hypotheses"
   area).

---

# Page archetype 1: Homepage (brand entry)

**Examples:**
- rinvoqhcp.com (HCP brand homepage)
- skyrizihcp.com (HCP brand homepage)
- linzess.com (DTC brand homepage)

**Purpose:** Brand entry point. Multi-condition switcher (HCP sites), hero,
key indications, primary CTAs, support resources.

## Canonical section sequence

| # | Block | Section variant / classes | Purpose |
|---|---|---|---|
| 1 | brand-explorer (HCP only) | `abbv-container`-equivalent | Cross-condition switcher bar above header |
| 2 | header (fragment) | — | Site nav — fragment ref via `nav: /...` metadata |
| 3 | hero | full-width, brand-customized | LCP element, indication preview, primary CTA |
| 4 | cards-grid | `classes` = indication-link variant | 2–4 indication cards (text + chevron, NOT pill buttons) |
| 5 | cards-grid (or columns + cta) | brand variant for value props | 3-up value proposition cards |
| 6 | rich-text or text-container | brand variant `indication` | Indication paragraph (verbatim from live) |
| 7 | cards-grid (glacier / support variant) | `classes` = pill-button variant + `section-bg-brushstroke gradient--white-glacier` section style | Patient/HCP support resources with pill CTAs |
| 8 | footer (fragment) | — | Footer fragment ref via `footer: /...` metadata |
| 9 | safety-bar (fragment) | sticky bottom | ISI / safety information — shared across all pages |

## Page metadata required

| Key | Value | Notes |
|---|---|---|
| brand | `{brand-key}` | e.g. `rinvoq-hcp` |
| nav | `/rinvoq-hcp/nav` or similar | Homepage may use brand-default nav |
| footer | `/rinvoq-hcp/footer` | Usually shared across brand pages |
| title | from live `<title>` | Verbatim |
| description | from live meta description | Verbatim |
| og:image | hero image asset | Same image as hero block |
| job-code | from live footer / legal | e.g. `US-RNQ-XXXXXX` |

## Key composition rules

- **brand-explorer** is HCP only — DTC homepages skip it
- **Hero is the LCP** — keep it eager, don't lazy-load the image
- **Indication-link cards** (block 4) have text + chevron pattern; do NOT
  use pill-button variant (that's for support cards in block 7)
- **Glacier section** (block 7) needs `section-bg-brushstroke` +
  `gradient--white-glacier` section style classes + the brushstroke SVG
  asset downloaded to `/content/dam/abbvie-eds-poc/`
- **Single H1** — author it inside the hero `text` field
- **Safety-bar fragment** is shared across ALL pages in the brand section

## Common pitfalls (from chat history)

- Using `cards-grid-cta-card` variant for indication cards in block 4 →
  produces pill buttons where text+chevron is needed
- Simulating the brushstroke with CSS gradient instead of downloading SVG
- Treating brand-explorer as plain section (it has hoist logic — moves
  above header at runtime)
- Forgetting to set `nav` page metadata → defaults to homepage nav even
  on other pages

---

# Page archetype 2: Condition Landing

**Examples:**
- rinvoqhcp.com/dermatology
- rinvoqhcp.com/rheumatology
- skyrizihcp.com/psoriatic-arthritis

**Purpose:** Condition-specific entry. Different header than homepage
(condition nav), condition-focused hero, sub-section nav, condition-relevant
cards.

## Canonical section sequence

| # | Block | Section variant / classes | Purpose |
|---|---|---|---|
| 1 | brand-explorer (HCP only) | — | Cross-condition bar (same as homepage) |
| 2 | header (fragment) | **DIFFERENT fragment than homepage** | Per-condition nav — e.g. `nav: /rinvoq-hcp/header-dermatology` |
| 3 | hero | condition-themed, often with indication paragraph | Condition-specific hero copy |
| 4 | section-nav | (linzess, rinvoq-hcp, skyrizi-hcp brands) | Anchor nav for sub-sections |
| 5 | cards-grid | varied — efficacy / safety / dosing previews | 3–4 cards linking to condition sub-pages |
| 6 | rich-text | indication-statement variant | Condition indication paragraph (verbatim) |
| 7 | text-container | references variant | Footnote references for indication |
| 8 | cards-grid (support variant) | brush section style | Patient/HCP support resources |
| 9 | footer (fragment) | — | Shared brand footer |
| 10 | safety-bar (fragment) | sticky | Shared ISI fragment |

## Page metadata required

Same as Homepage, **except:**
- `nav` MUST point to the per-condition header fragment (not the homepage
  one)
- Active-state styling on the nav is brand-block-config driven, not
  authored content

## Key composition rules

- **Per-condition header** is the #1 difference from homepage — verify the
  live page uses a different nav than homepage before assuming
- **Active nav state** for the current condition is set via brand
  `block-config.js` reading URL path (`/dermatology/*` triggers active
  state for "Dermatology" nav item)
- **Indication block** (block 6 / 7) is condition-specific (e.g.
  Dermatology indication ≠ Rheumatology indication)
- **section-nav block** lets users jump within the long condition landing
  page; ensure target `id` attrs on each section

## Common pitfalls (from chat history)

- Reusing homepage header fragment → wrong nav items shown for condition
- Active nav state hardcoded in fragment content → breaks if user navigates
  to other condition pages
- Indication text not condition-specific → shows wrong indication

---

# Page archetype 3: Dosing & Lab Monitoring (clinical reference)

**Examples:**
- rinvoqhcp.com/dermatology/dosing-lab-monitoring
- skyrizihcp.com/psoriatic-arthritis/dosing

**Purpose:** Clinical reference page. Dosing schedules, lab monitoring
guidance, dose adjustments, contraindications detail. Information-dense,
table-heavy, footnote-heavy.

## Canonical section sequence

| # | Block | Section variant / classes | Purpose |
|---|---|---|---|
| 1 | brand-explorer (HCP only) | — | Same as homepage |
| 2 | header (fragment) | Per-condition | Same as condition landing |
| 3 | hero | smaller / banner variant | Often a banner-style hero, not full-page |
| 4 | section-nav | — | Anchor nav for clinical sub-sections |
| 5 | text-container (boxed-warning variant) | brand `boxed-warning` style | Boxed Warning if applicable (top of clinical content) |
| 6 | clinical-data-panel | (mavyret, skyrizi-hcp brands) | Structured dosing presentation |
| 7 | table | brand variant for clinical tables | Dosing schedule table with `<th scope>` semantics |
| 8 | accordion | brand variant | Adjustments / special populations grouped |
| 9 | tabs | brand variant | If page has multiple dose regimens |
| 10 | fact-card or info-tree | — | Key dosing/lab thresholds |
| 11 | tooltip (inline) | — | Footnote markers (¹, ², †) on dosing numbers |
| 12 | text-container (references variant) | `<ol>` numbered list | Reference list, MUST round-trip with body markers |
| 13 | footer (fragment) | — | Shared |
| 14 | safety-bar (fragment) | sticky | Shared |

## Page metadata required

Same as Condition Landing.

## Key composition rules

- **Clinical accuracy is paramount** — every dose number, lab threshold,
  adverse event percent must be byte-for-byte verbatim from live source.
  See `pharma-content-fidelity`.
- **Tables** need semantic `<th scope="row">` / `<th scope="col">` — base
  `table` block handles this; verify in rendered DOM
- **Footnotes round-trip mandatory** — every superscript in dosing/lab
  values must have a matching reference entry in block 12
- **Boxed Warning at top** (block 5) — must be visually distinct, not just
  text-distinct (regulatory)
- **Anchor IDs on each section** — for the section-nav block's links to
  jump correctly

## Common pitfalls (predicted from chat history patterns)

- Dosing numbers paraphrased / typo-fixed → compliance defect
- Footnote markers stripped to "fix" wrapping on mobile → references
  orphaned
- Boxed Warning treated as plain rich-text → loses regulatory visual
  treatment
- Clinical tables rendered as `<div>` grids → loses screen-reader semantics

---

# Page archetype 4: Real Patients (testimonial)

**Examples:**
- rinvoqhcp.com/atopic-dermatitis/real-patients
- skyrizihcp.com/psoriatic-arthritis/patient-stories

**Purpose:** Patient testimonial showcase. Video-heavy, story-card-heavy,
consent disclaimer prominent.

## Canonical section sequence

| # | Block | Section variant / classes | Purpose |
|---|---|---|---|
| 1 | brand-explorer (HCP only) | — | Same |
| 2 | header (fragment) | Per-condition | Atopic-dermatitis nav (may differ from /dermatology) |
| 3 | hero | testimonial banner variant | Patient-introduction hero |
| 4 | text-container (disclaimer variant) | — | Consent / model-release disclaimer (verbatim) |
| 5 | story-cards | grid layout | Patient testimonial cards (3-up or 4-up) |
| 6 | brightcove-video OR carousel-video-playlist | brand variant | Patient testimonial videos (Brightcove) |
| 7 | quote | brand variant | Pull quote from featured patient |
| 8 | cards-grid (support variant) | brush section style | "Hear from real patients" support resources |
| 9 | text-container (legal/disclaimer) | — | Patient ID, paid testimonial disclosure (verbatim) |
| 10 | footer (fragment) | — | Shared |
| 11 | safety-bar (fragment) | sticky | Shared |

## Page metadata required

Same as Condition Landing. Plus:
- **`og:image`** should be a patient testimonial still (with consent)

## Key composition rules

- **Brightcove integration** — use `brightcove-video` block (single video)
  or `carousel-video-playlist` (multiple videos). Account ID + video ID
  pulled verbatim from live source DOM. Do NOT fabricate.
- **Delayed loading** for Brightcove — third-party script loads in
  `delayed.js`, not eager. Don't preload.
- **Transcripts mandatory** for all patient videos (WCAG / Section 508 +
  pharma compliance)
- **Consent disclaimer** (block 4) is regulated copy — verbatim from live
- **"Actor portrayal" vs "Real patient"** labels preserved verbatim where
  source uses them
- **Image alt text** describes patient context, not "person smiling"

## Common pitfalls (predicted)

- Fabricating Brightcove video IDs → broken player
- Dropping consent disclaimer → compliance defect
- Missing transcripts → a11y + Section 508 violation
- Eager-loading Brightcove → LCP regression

---

# Page archetype 5: H2H Comparison (head-to-head efficacy)

**Examples:**
- rinvoqhcp.com/atopic-dermatitis/efficacy/rinvoq-vs-dupixent/level-up
- skyrizihcp.com/psoriatic-arthritis/efficacy/skyrizi-vs-cosentyx

**Purpose:** Head-to-head efficacy comparison. Chart-heavy, table-heavy,
footnote-heavy, statistical-significance markers, study design references.

## Canonical section sequence

| # | Block | Section variant / classes | Purpose |
|---|---|---|---|
| 1 | brand-explorer (HCP only) | — | Same |
| 2 | header (fragment) | Per-condition | Same as condition landing |
| 3 | hero | comparison banner | "X vs Y" hero with drug name comparison |
| 4 | section-nav | — | Anchor nav: Primary endpoint / Secondary / Safety / Study design |
| 5 | text-container (disclaimer / study limitations) | — | Verbatim limitations / "non-superiority not tested" / etc. |
| 6 | chart | brand variant | Primary endpoint comparison (bar / forest plot) |
| 7 | clinical-data-panel | — | Statistical detail (p-value, CI, n) |
| 8 | tabs | brand variant | Subgroup breakdowns (week 4 / week 12 / week 24) |
| 9 | chart (repeat) | — | Secondary endpoints visualization |
| 10 | table | brand variant for AE table | Adverse events comparison |
| 11 | tooltip (inline) | — | Footnote markers on every chart axis / data point |
| 12 | accordion | brand variant | Study design / methodology grouped |
| 13 | text-container (references variant) | `<ol>` | Reference list — round-trip with ALL chart/table footnote markers |
| 14 | footer (fragment) | — | Shared |
| 15 | safety-bar (fragment) | sticky | Shared |

## Page metadata required

Same as Condition Landing. Plus consider:
- **Comparator-drug name** in title (e.g. "RINVOQ® vs DUPIXENT®")
- **Job code** unique to this comparison piece

## Key composition rules

- **Chart fidelity is paramount** — axis labels, legends, error bars,
  statistical-significance markers (* p<0.05, ** p<0.01, etc.), endpoint
  labels. ALL verbatim from live source.
- **Footnote markers everywhere** — chart axes, table cells, body copy.
  Every marker MUST round-trip in the references block.
- **Static SVG/PNG vs inline chart** — verify how live source renders the
  chart. If SVG/PNG export, download to DAM and reference. If inline
  chart-data, use `chart` block with verbatim data values.
- **Comparator drug name** uses registered trademark — preserve `®` / `™`
  verbatim
- **Study limitations / non-inferiority disclaimers** are regulated copy
- **Mobile chart fallback** — charts often illegible at <600px; may need
  alternative table presentation. Check live source.

## Common pitfalls (predicted)

- Chart data approximated / rounded → compliance issue
- Footnote markers stripped to "clean up" the chart axis → references
  orphaned
- Trademark symbols dropped → regulatory issue
- Forest plot rendered as bar chart → misrepresents confidence intervals

---

# Page archetype 6: Custom / Hybrid

For pages that don't match any of the 5 above (e.g. site-map page, contact
page, MOA animation page, copay/savings page):

## Recipe

1. **Identify which archetype(s) it's closest to.** Most pages are hybrids.
2. **Walk through Phase B** of `aemcoder-migration-orchestrator` —
   scrape, section-by-section block-fit, no recipe shortcut.
3. **Always include** these "constant" sections regardless of page type:
   - `brand-explorer` (HCP brand pages only)
   - `header` fragment (per-condition or default)
   - `footer` fragment (shared)
   - `safety-bar` fragment (shared)
   - `brand: {brand-key}` page metadata
4. **Document the custom composition** in your prompt to aemcoder — be
   explicit about which archetype's recipe (if any) inspired the structure.
5. **After completing the migration, consider whether the new page type
   warrants its own recipe** — if you'll migrate 3+ pages of the same
   custom type, write the recipe back into this skill for reuse.

## Hybrid example: Coverage & Access page

`rinvoqhcp.com/access` doesn't fit cleanly. Likely composition:
- Condition Landing recipe sections 1–4 (brand-explorer, header, hero,
  section-nav)
- Insert `formulary-lookup` (block 14 in block-analysis) — coverage tool
- `accordion` for plan-by-plan breakdown
- `info-tree` for support program tiers
- `cards-grid` (support variant) for patient resources
- Standard footer + safety-bar

---

# Cross-template constants

These hold for EVERY page archetype:

## Always present
- `brand: {brand-key}` page metadata
- `header` fragment reference via `nav: /...` (per-section if applicable)
- `footer` fragment reference via `footer: /...`
- `safety-bar` fragment (shared across all pages in a brand section)
- `og:image`, `description`, `title` metadata
- Job code in footer / legal

## Always inherit (don't override per-page)
- Footer content (single shared fragment)
- Safety-bar content (single shared fragment per brand section)
- Brand tokens (`styles/{brand}/_tokens.css`)
- Brand fonts (`styles/{brand}/_fonts.css`)

## Often varied per page
- `nav` metadata path (per-condition headers)
- Hero variant / image
- Section-nav presence and anchor IDs
- Mid-page CTAs and resource cards

## Always verify against live source
- Whether per-condition nav exists (`/dermatology` may have different nav
  than `/atopic-dermatitis`)
- Whether safety-bar content differs by indication (rarely does, but verify)
- Whether the page has a Boxed Warning section (regulatory — must match
  live)

---

# How to extend this skill

When you migrate a page that doesn't match the 5 templates AND you'll
migrate 3+ similar pages:

1. Document the composition in a new archetype section (numbered 7+).
2. Use the same section structure (canonical sequence + metadata + rules +
   pitfalls).
3. Update the description / trigger phrases at top.
4. Add a one-line example URL.

When a known archetype evolves (e.g. discover a 6th canonical section in
homepage that we missed):

1. Update the archetype in place.
2. If the change breaks already-migrated pages, document in fix-registry
   (`aemcoder-migration-orchestrator/fix-registry.json`).

---

# Quick lookup table

| If page is... | Archetype | Section count | Key blocks |
|---|---|---|---|
| Brand homepage | 1 — Homepage | 9 | brand-explorer, hero, cards-grid, footer, safety-bar |
| `/{condition}` landing | 2 — Condition Landing | 10 | per-section header, hero, section-nav, indication |
| `/{condition}/dosing*` | 3 — Dosing & Lab | 14 | clinical-data-panel, table, accordion, references |
| `/{condition}/*/real-patients` | 4 — Real Patients | 11 | story-cards, brightcove-video, quote |
| `/{condition}/*/efficacy/X-vs-Y*` | 5 — H2H Comparison | 15 | chart, clinical-data-panel, table, references |
| Coverage / contact / sitemap | 6 — Custom / Hybrid | varies | Walk Phase B fresh |

For each: pair the recipe with `pharma-content-fidelity` always, and invoke
`aemcoder-migration-orchestrator` to drive the migration.
