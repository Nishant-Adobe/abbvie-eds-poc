# Wellness-Tips Migration Plan — 5 Linzess FODMAP Pages (Re-scrape & Re-import)

## Goal
Migrate the 5 Linzess "Wellness Tips" pages to EDS by **re-scraping the live www.linzess.com source**, regenerating each `.plain.html` through the deterministic import pipeline, and **reusing only the blocks already present on the approved develop reference pages**. Final output must pixel-match live www.linzess.com at **390 / 768 / 1024 / 1440**.

## Target Pages (live source = source of truth)
| # | Page | Live URL | Local content path |
|---|------|----------|--------------------|
| 1 | Low FODMAP Diet | /starting-linzess/wellness-tips/your-map-to-a-low-fodmap-diet | content/linzess/starting-linzess/wellness-tips/your-map-to-a-low-fodmap-diet.plain.html |
| 2 | Flavorful Food Swaps | /starting-linzess/wellness-tips/good-for-your-gut-flavorful-food-swaps | …/good-for-your-gut-flavorful-food-swaps.plain.html |
| 3 | Game Plan for IBS-C | /starting-linzess/wellness-tips/make-a-game-plan-for-ibs-c | …/make-a-game-plan-for-ibs-c.plain.html |
| 4 | 5 Holiday Low FODMAP Recipes | /starting-linzess/wellness-tips/5-holiday-low-fodmap-recipes | …/5-holiday-low-fodmap-recipes.plain.html |
| 5 | FODMAP-Friendly Pantry | /starting-linzess/wellness-tips/is-your-pantry-fodmap-friendly | …/is-your-pantry-fodmap-friendly.plain.html |

## Block Reuse Inventory (from approved develop reference pages — NO new blocks)
Reference pages: `/linzess/`, `/linzess/why-linzess/`, `/linzess/resources/`, `/linzess/healthy-routines/otc-and-prescription-treatments`, `/linzess/healthy-routines/tackling-ibs-c-triggers`, and the published `/linzess/find-relief`.

| Block (variant) | Purpose on these pages | Source of variant |
|---|---|---|
| `hero` (no-padding, text-left, **editorial-hero**) | Eyebrow + H1 article banner, per-viewport desktop/mobile image | reference editorial pages |
| `columns` (**how-they-work**) | 4-up FODMAP category cards (img + bold + copy) | existing authored page |
| `columns` (**fodmap-map**) | Infographic + 6 numbered steps | existing authored page |
| `columns` (**food-swaps**, **gut-diets**) | Food-swap / diet comparison rows | existing authored pages |
| `columns` (**more-like-this**) | 3 article teaser cards w/ links | reference |
| `columns` (**cta-cards**) | "Check My Symptoms" / "Savings & Support" tiles | reference |
| `cards-grid` (**cards-grid-recipe-cards**) | Recipe rows (image-left, title/desc/CTA) | reference recipe pages |
| `rich-text` / default content (**isi**) | Full ISI copy block (verbatim) | reference |
| `safety-bar` (**split**) | Floating safety bar (USES + IRI + full ISI) | reference |
| `metadata` | Page metadata (brand, nav, footer, title, description) | all pages |
| `Section Metadata` (`classes_customClass`) | Section style hooks (single semantic class each) | all pages |

> Existing infrastructure to reuse/repair: `tools/importer/import-wellness-tips.js` (all 5 templates already written), parsers (`hero`, `columns`, `cards`, `fragment`), transformers (`linzess-cleanup`, `linzess-sections`). The prior run **failed** with `CustomImportScript.default not found` — a bundling/registration defect to fix, not a content problem.

## Key Constraints (from migration super-prompt + project memory)
- **Content fidelity (zero tolerance):** all body copy, headings, sources, ISI, and job code **US-LIN-250121** verbatim from live DOM. Trademark `LINZESS®` exact.
- **md2jcr round-trip rules:** headings as `<h2>/<h3>` (not `<p class="heading-N">`); section classes via `classes_customClass`, **one single-word semantic class** each; no `<span>`/`<sup>` (Unicode superscripts); images in their own cells (not nested in richtext); `columns` anchorId trap (Issue, columns.js eats a content-leading first row).
- **Assets:** every image downloaded to `content/dam/abbvie-eds-poc/linzess/images/` and referenced host-relative so `cards.js` optimized URLs resolve. The tall mobile FODMAP map (`-m-`) 404s pipeline-wide — documented fallback (wide map + stacked steps). `content/dam/` is gitignored (DAM lives in AEM).
- **Scope ladder, no `!important`:** author field → section class + brand global → brand block partial (rebuild **block-scoped only**: `scaffold:build:block -- --block-name X --brand-name linzess`, never bare `scaffold:build`) → token → base (escalate).
- **`styles/linzess/styles.css` is edited directly** (its `_styles.css` has diverged); ~63 wellness rules already live there. A prior develop merge once clobbered these — re-verify after any merge.
- **Regression guard:** find-relief and other approved linzess pages are the baseline; snapshot before/after any shared-file edit. Editorial-hero shares a class with find-relief — keep wellness rules gated (e.g. `body:has(.section.cta-cards-section)`).
- **Approval gates:** no commit/push without explicit "commit"/"push". GitHub token never stored in git config; rotate after use.

## Open Items (resolve at start of execution)
- [ ] Confirm local dev server (`aem up`) is running and serves the wellness-tips paths.
- [ ] Confirm git `safe.directory` + `HOME` env are set so git/build commands run (this shell needed `export HOME=/home/node`).

## Checklist

### Phase 0 — Branch & Sync Preflight (Execute mode)
- [ ] On `linzess-wellness-tips`; confirm the develop merge (commit `ec40ad01`) is intact and `project.json` points at the wellness-tips base URL.
- [ ] Verify the ~63 wellness rules in `styles/linzess/styles.css` survived the merge (no clobber); if missing, recover from the known-good commit before proceeding.
- [ ] Snapshot find-relief baseline render (regression reference) at 390/768/1024/1440.

### Phase 1 — Re-scrape Live Source (Execute mode)
- [ ] Scrape all 5 live www.linzess.com pages → cleaned HTML + metadata + screenshots into `import-work/`.
- [ ] Per page, build a per-viewport image manifest (desktop vs mobile `<source media>`); capture exact copy, headings, sources, ISI, job code for fidelity diffing.

### Phase 2 — Asset Acquisition (Execute mode)
- [ ] Download every referenced image (hero desktop+mobile, category icons, infographics, recipe photos, teaser thumbnails) to `content/dam/abbvie-eds-poc/linzess/images/` (and recipe PDFs to the dam pdf path).
- [ ] Note any live asset that 404s; record the documented fallback (e.g. mobile FODMAP map).

### Phase 3 — Repair & Run the Importer (Execute mode)
- [ ] Fix the `CustomImportScript.default not found` bundling failure in the `import-wellness-tips` build (verify `export default { transform }` is correctly bundled into `import-wellness-tips.bundle.js`).
- [ ] Reconcile each template's verbatim content against the Phase-1 scrape (correct any drift; keep reused-block structure identical to the reference pages).
- [ ] Run the bulk importer (html2md → md2jcr/md2da) for all 5 URLs; confirm **0 md2jcr errors** and `status: ok` in each report.
- [ ] Verify generated `.plain.html` for all 5: section order, single H1, `classes_customClass` single-word classes intact, headings as `h2/h3`, ISI + `US-LIN-250121` verbatim, `safety-bar (split)` rows correct.

### Phase 4 — Render & Pixel-Match vs Live (Execute mode)
- [ ] Render each page in local preview; confirm all reused blocks decorate with no JS/console errors.
- [ ] For each page + each section, screenshot live www.linzess.com and local at **390 / 768 / 1024 / 1440**; build delta tables (selector | property | live | local | ✓/✗), focused on `hero`, `columns` variants, `cards-grid` recipe cards.
- [ ] Tag each delta to a root cause (Issue #8 tablet gutter, #9 columns 2-wide at 768, #26 dropped icon cells, flex wrap/gap, hero breakpoint #36).

### Phase 5 — Brand-Scoped Styling Fixes (Execute mode)
- [ ] Apply lowest-specificity, brand-scoped fixes in `styles/linzess/styles.css` (under wellness section classes) and, only if needed, `blocks/columns/linzess/` + `blocks/cards-grid/linzess/` partials.
- [ ] Rebuild only touched blocks: `scaffold:build:block -- --block-name {columns|cards-grid} --brand-name linzess`. No bare `scaffold:build`. No `!important`.
- [ ] Keep editorial-hero rules gated to wellness-only; re-confirm find-relief hero unchanged after each hero edit.
- [ ] Re-render all 5 + find-relief baseline after each fix; confirm shared fixes help every page and regress none.

### Phase 6 — Validate & Report (Execute mode)
- [ ] All 5 pages pixel-match live at 390/768/1024/1440 (hero, columns, cards-grid sections specifically).
- [ ] `npm run lint:css` and `npm run lint:js` pass; `styles/linzess/styles.css` parses cleanly.
- [ ] Content-fidelity gate: ISI/sources/job code verbatim verified per page; single H1; no `<sup>`/`<span>` regressions.
- [ ] Regression check: find-relief + other approved pages unchanged.
- [ ] Confirm `content/dam/` and `import-work/` scrape artifacts are gitignored / excluded from any PR.
- [ ] Summarize per-page result; **hold for explicit approval before any commit/push.**

> **Execution requires Execute mode.** Phases 0–6 perform scraping, asset downloads, importer runs, file writes, and block-scoped builds. This artifact is the plan only — switch to Execute mode to begin, starting with Phase 0.
