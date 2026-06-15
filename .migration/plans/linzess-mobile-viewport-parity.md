# Linzess Migration — Mobile Viewport Parity Critique & Fix Plan

## Goal

Critique every block on the migrated Linzess pages at mobile widths, compare against the **real production site** (`https://www.linzess.com/...`), identify where **fonts, images, text, and layout/spacing** diverge, and apply CSS/asset fixes so the EDS mobile rendering matches production.

## Reference & Scope (confirmed)

- **Source of truth:** real `linzess.com` production pages (brand fonts, image assets, copy, spacing).
- **Mobile viewports:** **360px (Android), 375px (iPhone SE), 390px (iPhone 12+)** — critique all three to catch breakpoint edges.
- **Pages:** **whole Linzess migration** (all migrated pages, not just find-relief).
- **Fix categories:** **Fonts, Images, Text, Layout/spacing.**

## Pages in scope (to be confirmed during inventory)

| EDS path | Production counterpart |
|---|---|
| `/linzess/migration-dinesh/find-relief/` | `linzess.com/find-relief` |
| `/linzess/migration-dinesh/find-relief/how-to-take-linzess` | `linzess.com/find-relief` (How to Take section/page) |
| `/linzess/migration-dinesh/find-relief/talk-to-a-doctor` | `linzess.com/find-relief` (Talk to a Doctor section/page) |
| `/linzess/find-relief/*` (older copies) | same as above — confirm which set is canonical |
| `/linzess/starting-linzess/wellness-tips/*` (5 articles) | `linzess.com/starting-linzess/wellness-tips/*` |

> Note: this is a **crosswalk (xwalk) project** — live pages render from AEM author, not repo files. **Text/content** differences are authored in AEM and cannot be edited from this repo; only **CSS (fonts, spacing, image styling) in `blocks/**/{linzess}/*.css` and `styles/linzess/*`** are fixable here. Text gaps will be **reported** for authoring, not silently changed.

## Workflow per block (Step 0 hard gate — section-fix-loop)

For each block at each viewport: dump **live + EDS computed styles and screenshots first**, build one delta table, root-cause-tag every diff, then write ONE consolidated lowest-specificity CSS fix. No edit before the dump. Mobile-first cascade, no `!important`, project root font-size is 10px (use px for matching live's 14/16px).

## Checklist

### Phase 1 — Inventory & baseline
- [ ] Enumerate all migrated Linzess pages and the block types each uses (Glob/Grep over `content/linzess/**`)
- [ ] List the production URLs that correspond to each EDS page
- [ ] Confirm canonical page set (resolve `migration-dinesh/find-relief` vs `linzess/find-relief` duplication) — **AskUserQuestion if ambiguous**
- [ ] Confirm local dev server renders all in-scope pages

### Phase 2 — Capture (Step 0 gate, per page × 360/375/390)
- [ ] Capture **production** linzess.com screenshots + computed styles per block (fonts, image src/size, spacing)
- [ ] Capture **EDS** screenshots + computed styles per block at the same widths
- [ ] Record production webfont families/weights and image asset URLs/dimensions

### Phase 3 — Delta analysis
- [ ] Build per-block delta tables (selector | property | live | EDS | match/diff)
- [ ] Root-cause-tag each delta: Font / Image / Text(author) / Layout-spacing
- [ ] Separate **CSS-fixable** deltas from **AEM-authored text/content** deltas (latter → report only)
- [ ] Produce a prioritized fix list (brand-token vs block-CSS vs custom-class scope)

### Phase 4 — Apply fixes (CSS only, one block at a time)
- [ ] Fonts: correct family/size/weight/line-height/letter-spacing in `blocks/*/linzess/*.css` or `styles/linzess/tokens.css`
- [ ] Images: fix sizing/aspect/object-fit; download + wire any missing mobile art into DAM if required
- [ ] Layout/spacing: mobile-first padding/margin/stacking/overflow fixes
- [ ] Rebuild scoped CSS (`npm run scaffold:build:block`) where partials change
- [ ] Re-verify each fixed block at 360/375/390 against production; desktop regression check at 1440/1200

### Phase 5 — Regression & validation
- [ ] Cross-page sweep: confirm shared CSS changes don't regress other Linzess pages (any viewport)
- [ ] Run `npm run lint:css` / `lint:js` clean on touched files
- [ ] Final mobile screenshot diff per page vs production (≥90% match target)

### Phase 6 — Report & handoff
- [ ] Summarize fixed-vs-remaining deltas
- [ ] List **AEM-authored text/content** gaps that need authoring (cannot fix from repo)
- [ ] Note deploy step: changes are block CSS → must be committed & **pushed** to `linzess-find-relief` to go live (push currently blocked — no git creds in this env)

## Open risks / dependencies
- **Text differences are not repo-fixable** (xwalk content lives in AEM author) — will be reported, not changed.
- **Production webfonts** may be license-restricted; if a font file is missing locally, flag rather than substitute.
- **Deploy/push** requires authenticated git (currently unavailable here) — fixes land in the working tree/commit and need your push.
- Several `blocks/*/linzess/*.css` are shared across pages → every edit triggers a cross-page regression check.

---
*Execution requires switching to Execute mode. This plan covers CSS-level mobile parity (fonts, images, layout/spacing); authored-text gaps will be reported for AEM authoring.*
