I'll inspect the published EDS pages to understand exactly what content, blocks, and images they contain, then compare against the current local state.Plan mode blocks Bash. Let me inspect the published pages via WebFetch and compare against local files using read-only tools.I'll fetch the published page structure and inspect the current local files in parallel to map exactly what's published vs what's broken locally.I've confirmed the published EDS page (`your-map-to-a-low-fodmap-diet`) renders with **all blocks present and all images as working `media_` renditions** — and its block structure is byte-identical to the local content file. The difference is: published images are baked-in `media_` renditions (work), while local content uses `/content/dam/abbvie-eds-poc/…` paths (404 on delivery), and the develop merge clobbered the wellness CSS (which I began restoring). Before I finalize the restore plan, I need to pin down a few things that change the approach materially.# Wellness-Tips Content + Styling Restore Plan (5 Linzess Pages)

## Goal
Restore the 5 wellness-tips pages on the `linzess-wellness-tips` branch so they match what is **already published and correct** on the `.aem.live` EDS site. After the develop pull, the local/branch state lost styling (clobbered CSS) and renders broken images/blocks. Restore content byte-faithfully from the published pages, recover the clobbered CSS, and pixel-match the live **www.linzess.com** site at **390 / 768 / 1024 / 1440**.

## Reference & Source of Truth
- **Published EDS pages (`.aem.live`) = the good reference** for content/blocks/images (confirmed correct; only the local branch is broken).
- **Original www.linzess.com = the pixel-match target** for styling at all four viewports.
- Restore method chosen: **capture each published `.plain.html`** into local `content/` so it matches the live EDS pages exactly (with their working `media_` image renditions), instead of regenerating via the import script.

## Target Pages
| # | Page | Path |
|---|------|------|
| 1 | Low FODMAP Diet | /linzess/starting-linzess/wellness-tips/your-map-to-a-low-fodmap-diet |
| 2 | Flavorful Food Swaps | /linzess/starting-linzess/wellness-tips/good-for-your-gut-flavorful-food-swaps |
| 3 | Game Plan for IBS-C | /linzess/starting-linzess/wellness-tips/make-a-game-plan-for-ibs-c |
| 4 | 5 Holiday Low FODMAP Recipes | /linzess/starting-linzess/wellness-tips/5-holiday-low-fodmap-recipes |
| 5 | FODMAP-Friendly Pantry | /linzess/starting-linzess/wellness-tips/is-your-pantry-fodmap-friendly |

## Key Findings (already confirmed)
- **Root cause of broken styling:** a prior develop merge (`a08d5120`) clobbered ~99 lines of page-local wellness CSS in `styles/linzess/styles.css` (the `fodmap-map`, `fodmap-categories`, `food-swaps`, `gut-diets`, and editorial-hero rules). Recovery source = `git show 57e0968d:styles/linzess/styles.css`. **Partially restored already** this session (columns variants + gated editorial-hero); needs verification + completion against live.
- **Image path divergence:** published pages reference images as baked-in `media_…` renditions (work on delivery). Local content files reference `/content/dam/abbvie-eds-poc/…` paths that **404 on delivery**. Capturing the published `.plain.html` brings the working `media_` references local.
- **Page-1 block structure verified identical** between published and local (hero → fodmap-categories → fodmap-map → more-like-this → cta-cards → ISI → safety-bar → metadata). The other 4 still need the same published-vs-local diff.
- `.plain.html` is gitignored, so a develop pull never altered content — confirming the visible breakage is **CSS/code + image-path**, and content restoration is about getting the working published HTML back locally.
- `styles/linzess/styles.css` is edited **directly** here (not rebuilt from `_styles.css`, which has diverged) — the established pattern; do not run un-targeted `scaffold:build`.

## Open Risks / Watch-outs
- Captured `media_` references resolve against the published media bus; when served by the local `aem up` (which proxies missing files from the `aem.page` upstream), some renditions may not resolve locally even though they are correct for the published site. Verification must distinguish "correct vs published" from "renders in local proxy."
- The tall mobile FODMAP map (`-m-` infographic) 404s everywhere in the EDS pipeline (pre-existing). Mobile fodmap-map uses a documented fallback (wide `-d-` map + stacked steps).
- Editorial-hero CSS shares a class with find-relief; restored rules are gated with `body:has(.section.cta-cards-section)` (wellness-only) — must re-verify find-relief hero is untouched after any further hero edits.

## Checklist

### Phase 0 — Inspect & Diff (read-only)
- [ ] Capture the published `.plain.html` for all 5 pages and record exact block order, section classes, and image references per page.
- [ ] Diff each published page against the current local `content/…plain.html` to list precisely what differs (image refs `media_` vs `/content/dam`, any missing blocks/sections).
- [ ] Confirm whether each page's local file is already structurally identical (page 1 is) or needs replacement.

### Phase 1 — Restore Content from Published (Execute mode)
- [ ] Save each published page's `.plain.html` into the correct local `content/linzess/starting-linzess/wellness-tips/` path, preserving the working `media_` image references verbatim.
- [ ] Render all 5 locally; confirm blocks present and no JS errors. Note any `media_` renditions that don't resolve through the local proxy (expected for some; they are correct for publish).

### Phase 2 — Restore / Verify Clobbered CSS (Execute mode)
- [ ] Confirm the already-restored wellness CSS block (columns variants + gated editorial-hero) is present and valid in `styles/linzess/styles.css`; complete any still-missing rules from `57e0968d`.
- [ ] Verify scoping: every restored rule is anchored to a wellness-only section class; re-confirm find-relief hero/baseline is unchanged (regression guard).

### Phase 3 — Pixel-Match vs Live www.linzess.com (Execute mode)
- [ ] For each page, screenshot original www.linzess.com at **390 / 768 / 1024 / 1440** and the local preview at the same widths; build per-section delta tables (focus: hero, fodmap-map, fodmap-categories, food-swaps, gut-diets, more-like-this, cta-cards).
- [ ] Fix residual viewport breaks (mobile/tablet stacking, gaps, image sizing) with lowest-specificity brand-scoped CSS; no `!important`.
- [ ] Re-verify all 5 pages across all 4 viewports after each fix.

### Phase 4 — Validate & Report (Execute mode)
- [ ] `npm run lint:js` passes; confirm `styles/linzess/styles.css` parses cleanly (it's stylelint-ignored by design).
- [ ] Regression check: find-relief + other approved pages unchanged.
- [ ] Summarize per-page restoration + fixes; **hold for explicit approval before any commit/push.**

> Execution requires **Execute mode** — Phases 1–4 write files (content + CSS) and restart/inspect the preview. This plan is currently in plan mode; switch to Execute mode to proceed.
