# Fix 5 Linzess Pages Across All Viewports

## Context
- Branch: `linzess-wellness-tips` (5 candidate pages = the `starting-linzess/wellness-tips/*` set).
- Prior incident on this branch: a `develop` merge silently clobbered ~99 lines of page-local wellness CSS from `styles/linzess/styles.css` (the `fodmap-map`, `fodmap-categories`, `food-swaps`, `gut-diets`, editorial-hero rules). Recovery source = `git show 57e0968d:styles/linzess/styles.css` (lines ~1224–1774). Restore by appending to `styles.css` directly — NOT `_styles.css` (the two have diverged; styles.css is the live source here).
- `styles/linzess/styles.css` is shared and direct-edited; any change risks find-relief and other approved pages.

## The 5 pages
1. `content/linzess/starting-linzess/wellness-tips/your-map-to-a-low-fodmap-diet.plain.html`
2. `content/linzess/starting-linzess/wellness-tips/good-for-your-gut-flavorful-food-swaps.plain.html`
3. `content/linzess/starting-linzess/wellness-tips/make-a-game-plan-for-ibs-c.plain.html`
4. `content/linzess/starting-linzess/wellness-tips/5-holiday-low-fodmap-recipes.plain.html`
5. `content/linzess/starting-linzess/wellness-tips/is-your-pantry-fodmap-friendly.plain.html`

## Open questions (to confirm before CSS work)
- Scope of "issues": match the live linzess.com source pixel-by-pixel, or fix the known mobile/tablet breakage only?
- Confirm the 5 pages are the wellness-tips set (not the find-relief set).

## Checklist
- [ ] **(Execute mode)** `git fetch origin` then `git pull --ff-only origin linzess-wellness-tips`; confirm clean tree and report what changed
- [ ] Re-check whether the wellness CSS is present/clobbered after pull (`grep fodmap-map-section styles/linzess/styles.css`)
- [ ] Confirm fix scope + page set with the user
- [ ] Capture baseline screenshots of find-relief + other approved pages (regression guard) at 1440 / 1200 / 768 / 390
- [ ] Render each of the 5 pages locally; audit at 1440 / 1200 / 768 / 390 vs live; build per-section delta tables
- [ ] Apply scoped CSS fixes (gated to wellness pages, e.g. `body:has(.section.cta-cards-section)`) — no `!important`, lowest specificity first
- [ ] Verify all 4 viewports per page; confirm find-relief and approved pages unchanged
- [ ] Lint (`lint:css`, `lint:js`); hold for explicit user approval before any commit/push

> Note: this plan requires Execute mode to run the `git pull` and all subsequent fixes. Approve to proceed.
