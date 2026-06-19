# Wellness-Tips Migration Fix Plan (5 Linzess Pages)

## Goal
Pull latest `develop` into `linzess-wellness-tips`, resolve conflicts, then fix the broken **columns** and **flexbox** layouts (reported breaking in **mobile** and **tablet** viewports) across all 5 wellness-tips pages so they pixel-match the original **www.linzess.com** pages at every viewport.

## Target Pages (source of truth = original www.linzess.com)
| # | Page | Live URL (match target) | Reported state |
|---|------|------------------------|----------------|
| 1 | Low FODMAP Diet | /starting-linzess/wellness-tips/your-map-to-a-low-fodmap-diet | mobile 60% / desktop 90% |
| 2 | Flavorful Food Swaps | /starting-linzess/wellness-tips/good-for-your-gut-flavorful-food-swaps | mobile 60% / desktop 90% |
| 3 | Game Plan for IBS-C | /starting-linzess/wellness-tips/make-a-game-plan-for-ibs-c | mobile 90% / desktop 90% |
| 4 | 5 Holiday Low FODMAP Recipes | /starting-linzess/wellness-tips/5-holiday-low-fodmap-recipes | mobile 90% / desktop 90% |
| 5 | FODMAP-Friendly Pantry | /starting-linzess/wellness-tips/is-your-pantry-fodmap-friendly | mobile 90% / desktop 90% |

Pages 1 & 2 are the worst (mobile 60%) → highest priority. Primary symptom class: **broken columns and flex-box layouts on mobile/tablet** (consistent with Super-Prompt Issues #8, #9, #26 and Patterns C/D).

## Key Constraints & Findings
- **Content not in local tree:** `.plain.html` is gitignored; the 5 pages were authored/published to `.aem.live`, so they don't render in local preview yet. **You will provide the `.plain.html` files** (per your choice) — I'll wait for them before any rendering/diff work.
- **Source of truth:** original **www.linzess.com** pages, compared at viewports **390 (mobile), 768 (tablet), 1024/1200 (desktop), 1440**.
- **Blocks in scope:** `blocks/columns/` (has `linzess/` override) and `blocks/flexbox/` (has `linzess/` override). Shared base CSS/JS affects all brands → changes must be brand-scoped.
- **Scope ladder (hard rule):** author field → section custom class + brand global → brand block CSS partial → token → base (escalate). **No `!important`.** Brand block rebuilds use `scaffold:build:block -- --block-name X --brand-name linzess` only — never bare `scaffold:build`.
- **Regression protection:** any edit to shared `styles/linzess/*` or `blocks/*/linzess/*` requires before/after snapshots of the find-relief pages (already-approved baseline) to confirm no regression.
- **Git state:** repo had a "dubious ownership" warning; a `safe.directory` exception (or equivalent) must be set in Execute mode before git operations run.
- **Stashed work:** your AEMCODER skill-doc edit is preserved in `stash@{0}` (untouched by this plan).

## Open Items Before Execution
- [ ] **Receive the 5 `.plain.html` files** from you (and any page-specific DAM assets) and confirm where to place them under `content/linzess/starting-linzess/wellness-tips/`.
- [ ] Confirm the local dev server is running for preview at the wellness-tips paths.

## Checklist

### Phase 0 — Sync & Conflict Resolution (requires Execute mode)
- [ ] Set git `safe.directory` exception for the repo path so git commands run.
- [ ] Fetch `origin/develop`; report ahead/behind counts vs `linzess-wellness-tips`.
- [ ] Merge `origin/develop` into `linzess-wellness-tips`.
- [ ] Resolve each conflict by understanding both sides (no blind `--ours`/`--theirs`); prefer integrating develop's changes while preserving wellness-tips fixes.
- [ ] After merge: verify working tree builds, lint passes, and find-relief baseline pages still render unchanged. Do **not** commit until you approve.

### Phase 1 — Stand Up the 5 Pages Locally
- [ ] Place the provided `.plain.html` files at the correct content paths; wire any required DAM assets.
- [ ] Render each page in local preview; confirm all sections load with no JS/console errors.

### Phase 2 — Diff All 5 Pages (parallel, per your choice)
- [ ] For each page, capture original www.linzess.com screenshots at 390 / 768 / 1024 / 1440 and crop per section.
- [ ] Capture local preview at the same viewports; build a per-section delta table (selector | property | live | local | ✓/✗), focusing on `.columns` and `.flexbox` blocks.
- [ ] Classify each delta as **shared** (common across pages) vs **page-specific**, and tag root cause (e.g. Issue #9 columns 2-wide at 768, Issue #8 tablet gutter, Issue #26 dropped icon cells, flex wrap/gap).

### Phase 3 — Fix Shared columns/flexbox Breakage (brand-scoped)
- [ ] Snapshot find-relief baseline (regression guard) before touching shared files.
- [ ] Apply lowest-specificity brand-scoped fixes in `blocks/columns/linzess/` and `blocks/flexbox/linzess/` (and/or `styles/linzess/styles.css` under section classes) for mobile/tablet stacking, gap, width, and column-count.
- [ ] Rebuild only the touched block(s): `scaffold:build:block -- --block-name columns --brand-name linzess` and likewise for flexbox.
- [ ] Re-render all 5 pages + find-relief baseline; confirm shared fix helps every page and regresses none.

### Phase 4 — Per-Page Cleanup (pages 1 & 2 first)
- [ ] Page 1 (Low FODMAP) — close remaining mobile/tablet deltas; verify all viewports.
- [ ] Page 2 (Flavorful Food Swaps) — same.
- [ ] Page 3 (Game Plan IBS-C) — same.
- [ ] Page 4 (5 Holiday Recipes) — same.
- [ ] Page 5 (FODMAP Pantry) — same.
- [ ] Use section custom classes (single semantic word, `classes_customClass`) for any page-specific scoping; no bare block selectors, no `!important`.

### Phase 5 — Verify & Report
- [ ] All 5 pages match original www.linzess.com at 390 / 768 / 1024 / 1440 (columns + flexbox sections specifically).
- [ ] `npm run lint:css` and `npm run lint:js` pass.
- [ ] Regression check: find-relief + other approved pages unchanged.
- [ ] Summarize fixes per page; **hold for your explicit approval before any commit/push.**

> Execution requires Execute mode — Phase 0 onward performs merges, file writes, and builds. I'll wait for the `.plain.html` files and your switch to Execute mode before starting.
