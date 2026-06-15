# Find-Relief — Full Page Layout, Block-Size & Text-Alignment Parity to Live (All Viewports)

## Goal
Use the supplied side-by-side comparison snapshots (EDS = **left**, live = **right**) to fix the EDS find-relief page so **layout, block sizes, and text alignment** match live `linzess.com/find-relief` across **all viewports — mobile 390, tablet 768, desktop 1440**. Numeric values sourced from the already-fetched live source CSS (`linzess-global.css` + clientlib) per selector; snapshots confirm layout/size/wrap/alignment deltas.

## ⚠️ Reconcile published vs local first
Snapshots are of the **published `.aem.live`** site. This session already committed + pushed fixes (`fa875939`) for several of these blocks (tabs, dosing, sign-up dark CTA, gut-check, section-nav). `.aem.live` may **lag** those commits. So **before re-editing any block, confirm the delta still exists in the current local build** (local dev server) — only fix blocks still wrong locally; for blocks already fixed locally but stale on `.aem.live`, the resolution is **deploy/publish**, not another edit.

## Reference precision note
- Live renders **unstyled** in this env (CSS 404s) → can't read live computed px live. Snapshots are **50% zoom** (good for layout/size/wrap/alignment deltas, not ±1px).
- **Primary numeric source:** explicit rule values in live `linzess-global.css`/clientlib per selector. **Secondary:** snapshots. Runtime-only values get **flagged**, not guessed.
- Brand CSS only (`styles/linzess/*`, `blocks/*/linzess/*`); keep served + `_partial.css` in sync. **Token edits = brand-wide → STOP-and-ask.** Verbatim regulatory copy. Bebas is weight-400-only. No commit/push without explicit confirmation.

## Deltas from the snapshots (EDS left vs live right)
| # | Block | Delta (EDS vs live) | Severity |
|---|---|---|---|
| 1 | **Hero headline** | EDS: 1 line, oversized, overflows wide. Live: wraps **2 lines**, narrower max-width, left-aligned. | **High** |
| 2 | **Prescribed cards** | EDS: headings too small / clipped near badge, body crowded. Live: headings larger/bold, clean spacing below badge, taller cards. | **High** |
| 3 | **Sign-up cards** | EDS: compressed, small headings. Live: larger headings, taller cards, more padding. | Med |
| 4 | **Text alignment (cross-block)** | Verify per live: section eyebrows/headings **centered**; card body **centered** in cards-grid but **left** in dosing/ISI; "What To Talk About" item text **left**; CTA labels alignment — confirm each block's text-align vs live at every viewport. | **High** |
| 5 | Bottom-nav | Heading scale + purple-wave placement differs. | Med |
| 6 | "Why Finding…" divider | Verify orange arc present + spacing. | Med |
| 7 | Header home icon | Live has home icon in nav; EDS missing (header fragment — confirm scope). | Low |
| 8 | Savings tout / wave curves / What-To-Talk card / Gut-Check / Videos / Dosing / Tabs / ISI / Footer | Close (prior work). Regression-verify only. | Low |

> Top-priority: Hero wrap/size (#1), Prescribed-card heading size+clipping (#2), and cross-block **text-alignment** audit (#4).

## Methodology (per block — fix-loop, all viewports)
1. Confirm delta still exists in current **local build** at 1440/768/390 (rule out already-fixed-but-unpublished).
2. Pull live selector rule values from `linzess-global.css`/clientlib (font/size/lh/weight/color/padding/margin/gap/width/radius/**text-align**) — note any responsive overrides.
3. Capture EDS computed values at 1440/768/390 for the same descendants, including `text-align`.
4. Build a per-block × per-viewport delta table; tag each real diff.
5. Apply lowest-specificity fix scoped to `find-relief-*`, mobile-first with explicit breakpoints where live differs by viewport.
6. Re-render at all three viewports; confirm vs snapshot/source-CSS. Regression-check siblings.

## Checklist
- [ ] Reconcile: load current local build at 1440/768/390; mark which snapshot deltas are still present locally vs stale-on-`.aem.live`.
- [ ] Extract live rule values (incl. `text-align` + responsive overrides) per block from `linzess-global.css` + clientlib.
- [ ] Capture EDS computed values (incl. `text-align`) at 1440/768/390 per block.
- [ ] **#1 Hero** — constrain headline max-width + size/line-height to wrap 2 lines, left-aligned, per viewport.
- [ ] **#2 Prescribed cards** — fix heading size + badge→heading→body spacing (no clip); match card height/padding, per viewport.
- [ ] **#3 Sign-up cards** — match heading scale, card height/padding, per viewport.
- [ ] **#4 Text-alignment audit** — for every block (eyebrow, heading, body, card text, list items, CTA, ISI, footer) verify `text-align` vs live at 1440/768/390; fix mismatches scoped to `find-relief-*`.
- [ ] **#5 Bottom-nav** — match heading scale + purple-wave placement, per viewport.
- [ ] **#6 "Why Finding" divider** — ensure orange arc + spacing match.
- [ ] **#7 Header home icon** — confirm in-scope (header fragment); restore if so, else report.
- [ ] Verify low-severity blocks (#8) vs live; fix only proven deltas.
- [ ] Per block: delta table → scoped fix → re-render 1440/768/390 → regression.
- [ ] Keep served CSS + `_partial.css` in sync for any `blocks/*/linzess/` edit.
- [ ] Cross-page regression: how-to-take-linzess, talk-to-a-doctor (shared blocks), all viewports.
- [ ] Report per-block × per-viewport before/after + files touched; flag publish-gap-only blocks and any runtime-only values not pixel-verifiable.

## Notes
- **Execution requires Execute mode.** This artifact is the plan only; steps so far were read-only.
- Text-alignment is now a first-class pass (#4) across **all viewports** — live mixes centered (section headings, cards-grid card copy) and left-aligned (dosing body, ISI, "What To Talk About" items, footer), so each block's `text-align` is verified individually rather than assumed.
- True ±1px is bounded by reference precision (50%-zoom snapshots + source-CSS rule values). Exact live DevTools computed values for the High items (Hero, Prescribed cards) would guarantee pixel-accuracy if you can supply them.
- Blocks matched earlier this session: if a snapshot delta is absent locally, flag as a **publish gap** rather than re-edit (avoids regressing correct code).
