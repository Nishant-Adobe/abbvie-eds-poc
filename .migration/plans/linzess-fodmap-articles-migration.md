# Linzess Wellness-Tips Migration Plan — Two FODMAP Articles

## Goal
Migrate two LINZESS wellness-tips articles into the EDS project on a **new branch cut from `develop`**, authored as `.plain.html` under `/linzess/starting-linzess/wellness-tips/`, reusing the block palette and authoring conventions proven on the reference page `/linzess/healthy-routines/otc-and-prescription-treatments`.

**Source pages**
1. `https://www.linzess.com/starting-linzess/wellness-tips/5-holiday-low-fodmap-recipes` → `/linzess/starting-linzess/wellness-tips/5-holiday-low-fodmap-recipes`
2. `https://www.linzess.com/starting-linzess/wellness-tips/is-your-pantry-fodmap-friendly` → `/linzess/starting-linzess/wellness-tips/is-your-pantry-fodmap-friendly`

**Reference EDS page (block source)**: `https://linzess-bulk--abbvie-eds-poc--nishant-adobe.aem.page/linzess/healthy-routines/otc-and-prescription-treatments`

## Skills in play (migration workflow from prior session)
Loaded/sequenced for this migration:
- `abbvie-page-migration` / `abbvie-page-templates` → archetype + recipe (Resources/Wellness article)
- `scrape-webpage` → `identify-page-structure` → `page-decomposition` / `block-inventory` → `authoring-analysis` → `content-modeling` → `generate-import-html` → `preview-import`
- `abbvie-block-library` + `abbvie-block-analysis` → `columns`/`hero`/`safety-bar` Row Mapping & FieldGroup counts
- `abbvie-isi-migration` + `pharma-content-fidelity` → verbatim ISI, references round-trip, job code
- `eds-content-pipeline` + `excat:excat-xwalk-expert` → md2jcr/JCR conversion & the verified fixes
- `excat:excat-page-critique` / `excat:excat-block-critique` → pixel-perfect section comparison
- `code-review` → final self-review

## Branch setup (FIRST — requires Execute mode)
- Current branch is `linzess-find-relief`. Cut a fresh branch from `develop`:
  - `git fetch origin`
  - `git checkout -b linzess-wellness-tips origin/develop`
- Confirm the reference page's blocks (`columns` variants, `hero`, `safety-bar`) exist on `develop`; if any Linzess block CSS/variants the reference relies on live only on `linzess-bulk`/PR branches, cherry-pick **only** those files additively (no full-branch merge).

## Project type & critical authoring rules (carried from the find-relief migration)
This is an **xwalk project** — the importer generates JCR consumed by AEM Author/UE. These rules are non-negotiable and caused real publish failures before:

1. **image-text = 10 rows.** The importer's **md2jcr 1.2.16** computes a 10-group FieldGroup for `image-text` (leading empty `classes` row required). Local md2jcr 1.4.1 wants 9 — version skew; **the importer (10 rows) is authoritative.** *(Grids authored as `columns` per the reference, but any `image-text` block must be 10 rows.)*
2. **Section custom class** via plain `<div class="section-metadata">` + a `classes_customClass` row (comma-separated, no spaces). Never a `style` key, never a wrapper-class variant. **Every** `main >` section gets a custom class.
3. **Preserve every required field row, even empty** — md2jcr maps rows to FieldGroups positionally.
4. **Superscripts = Unicode (¹²³ / † ‡)**, never `<sup>` (converts to `<strong>` / splits paragraphs in Author).
5. **Special characters = literal UTF-8 glyphs**, not HTML entities (`&#8209;`, `&dagger;`, `&deg;`, `&ndash;`, `&mdash;`, `&rsquo;`, `&ldquo;`, `&rdquo;`, `&reg;`) — entities double-encode in JCR.
6. **Safety-bar trailing rows** = `split` / `id:<unique>` / `lang:none` (unique blockId forces a fresh JCR node).
7. **Page-metadata block wrapped in its own section `<div>`.**
8. **Images:** remote raster images base64-inlined; any **CSS `background:url()`** must use a base64 data URI (the `/icons/divider.svg` and live-CDN paths don't resolve from the AEM Author origin).
9. **Content generated via the bundled import script + `run-bulk-import.js`** — never hand-write into `/content`.
10. **md2jcr validation must run against the importer's 1.2.16**, not just local 1.4.1.

## Approach
- Reuse the existing importer framework (`tools/importer/import-find-relief.js` pattern): parser registry + page-template config + transformers. Add two new page-template entries.
- Both source pages share the reference archetype: hero → intro default content → item grid (`columns`) → "Pro Tip"/"What Is LINZESS" image-text-style `columns` → sources/footnotes → "More Like This" `columns more-like-this` → CTA `columns cta-cards` → ISI default-content (`isi`) → `safety-bar split` → metadata.

## Block palette (from reference page)
| Content | Block | Variant/class |
|---|---|---|
| Hero banner | `hero` | section class `hero-container` |
| Recipe / pantry item grid | `columns` | grid variant |
| Pro-tip / "What Is" image+text | `columns` | image-text variant |
| Sources / footnotes | default content | `.footnote` ol/p |
| Related articles | `columns` | `more-like-this` |
| Bottom CTAs | `columns` | `cta-cards` |
| ISI text | default content | section class `isi`, `language: none` |
| Safety bar | `safety-bar` | `split` / `id:<unique>` / `lang:none` |

## Pharma content-fidelity guardrails
- ISI "USES" + "IMPORTANT RISK INFORMATION" + Side Effects copy and job code (`US-LIN-250121`) copied **verbatim** from the reference page — no paraphrasing.
- Boxed-warning / Prescribing-Information / Medication-Guide links preserved exactly.
- Pantry page's numbered Sources/references preserved as a footnote list (round-trip intact).
- Recipe ingredient/method copy preserved verbatim.

## Checklist

### Phase 0 — Branch & infra
- [ ] `git fetch origin`; create `linzess-wellness-tips` from `origin/develop`
- [ ] Confirm reference blocks (`columns` variants, `hero`, `safety-bar`) exist on `develop`; cherry-pick only missing block files additively (no full merge)
- [ ] Verify importer md2jcr **1.2.16** is available for version-accurate validation

### Phase 1 — Scrape both source pages
- [ ] Scrape both URLs (hero desktop/mobile images, headings, recipe/pantry item content + images, "More Like This" cards, CTA targets, meta title/description)
- [ ] Capture verbatim ISI + job code from the reference page; capture pantry-page Sources verbatim

### Phase 2 — Structure & block mapping
- [ ] Identify section boundaries per page; confirm mapping against the reference page's `columns` variants
- [ ] Confirm `columns`/`column` FieldGroup row counts; (if any `image-text` used → 10 rows)

### Phase 3 — Importer config
- [ ] Add two page-template entries (`wellness-fodmap-recipes`, `wellness-pantry-friendly`) with correct `documentPath`, block instances, section definitions
- [ ] Reuse/extend `columns` + `hero` parsers; add selector handling for recipe-card & 4-column pantry-grid layouts

### Phase 4 — Author & generate content
- [ ] Run the bundled import script + `run-bulk-import.js` to generate both `.plain.html` files under `/linzess/starting-linzess/wellness-tips/`
- [ ] Every section carries a `classes_customClass`; metadata block wrapped in its section `<div>`
- [ ] ISI + safety-bar authored verbatim; safety-bar trailing rows `split`/`id:<unique>`/`lang:none`
- [ ] Special chars → literal UTF-8; no `<sup>` (Unicode ¹²³); base64-inline remote raster images
- [ ] Per-page metadata: brand=linzess, nav=/linzess/nav, footer=/linzess/footer, title, description

### Phase 5 — Validate (xwalk-correct)
- [ ] md2jcr round-trip against importer **1.2.16** → SUCCESS for both pages (no "content isn't mapping" errors)
- [ ] Confirm no double-encoded entities; safety-bar emits a unique JCR node
- [ ] Any CSS `background:url()` introduced uses base64 (no `/icons/` or live-CDN paths)

### Phase 6 — Preview & pixel critique
- [ ] Restart preview; render both pages; verify hero, grids, more-like-this, cta-cards, ISI, safety-bar
- [ ] Section-by-section compare each page vs its live source; apply additive, scoped CSS fixes (no regressions to other Linzess pages)

### Phase 7 — Verify & wrap up
- [ ] `npm run lint` clean except the 3 pre-existing safety-bar errors
- [ ] Regression: reference page + other Linzess pages render 200, unchanged
- [ ] Validate pharma fidelity (verbatim ISI, job code, references round-trip)
- [ ] Report section→block mapping (reused vs new), per-page custom classes, md2jcr result
- [ ] **Hold for explicit approval before any commit/push** (no push without confirmation)

> **Note:** Branch creation, scraping, importer edits, running the import, base64 conversion, md2jcr validation, and preview all require **Execute mode**. No commits or pushes without your explicit confirmation.
