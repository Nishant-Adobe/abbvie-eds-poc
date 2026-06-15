# Make a Game Plan for IBS-C — Migration Plan

## Goal
Migrate `https://www.linzess.com/starting-linzess/wellness-tips/make-a-game-plan-for-ibs-c` into the EDS project as a new `.plain.html` page at `/linzess/starting-linzess/wellness-tips/make-a-game-plan-for-ibs-c`, reusing the existing blocks and the deterministic `tools/importer/import-wellness-tips.js` script (same pipeline that produced the recipes and pantry pages). No new blocks unless strictly required.

## Source Page Structure (verified against live)
The page is a standard Linzess wellness-tips article. Section sequence:

1. **Hero** (editorial, behind-nav) — eyebrow `Resources / Wellness Tips`, H1 `Make a Game Plan for IBS-C` (renders uppercase Bebas via existing hero CSS). Images: `article-wellness-gameplan-desktop.jpg` / `article-wellness-gameplan-mobile.jpg`.
2. **Intro + 4 strategy rows** (white `otc-intro-section`):
   - Heading: `Your Game Plan Helps Put You in Control` + intro paragraph.
   - 4 image-left / text-right rows (live DOM = `abbv-image-text` rows → maps to the existing `cards-grid` `cards-grid-recipe-cards` variant), **each with a title + body but NO CTA link**:
     - `Don't Miss a Meal` — `4.2.5-d-make-a-game-plan-for-ibsc-meal@2x.png`
     - `A Night on the Town` — `4.2.5-d-make-a-game-plan-for-ibsc-night_on_the_town@2x.png`
     - `Stay on Track When You're on the Go-Go-Go` — `4.2.5-d-make-a-game-plan-for-ibsc-stay-on-track@2x.png`
     - `Manage Your Symptoms and Your Workload` — `4.2.5-d-make-a-game-plan-for-ibsc-workload@2x.png`
   - **Sources** footnote list (3 references) below the strategy rows.
3. **More Like This** (`columns more-like-this`) — 3 cards:
   - `Tackling IBS-C Triggers` → `/linzess/starting-linzess/healthy-routines/tackling-ibs-c-triggers` (img `Article-TacklingIBS-card.jpg`)
   - `Keeping in Touch with Your Doctor` → `/linzess/starting-linzess/healthy-routines/keeping-in-touch-with-your-doctor` (img `Article-KeepInTouch-card.jpg`)
   - `Good for Your Gut—Flavorful Food Swaps` → `/linzess/starting-linzess/wellness-tips/good-for-your-gut-flavorful-food-swaps` (img `Article-FoodSwap-card.jpg`)
4. **CTA cards** (`cta-cards`) — Check My Symptoms / Savings & Support (shared builder, identical to other pages).
5. **Inline ISI** (`isi`) — verbatim shared ISI (reuse `ISI_HTML` constant).
6. **Floating safety bar** (`safety-bar split`) — reuse `safetyBarSection`, blockId `sb-game-plan`.
7. **Metadata** — title `Make a Game Plan for IBS-C | LINZESS® (linaclotide)`, description (pull live meta description; fall back to a Game Plan summary with the required "See Important Risk Info and Boxed Warning." tail).

## Reusable Blocks (no new blocks needed)
| Block | Variant | Reuse source |
|---|---|---|
| `hero` | `no-padding text-left linzess-behind-nav-linzess-editorial-hero` | `heroSection()` helper |
| `cards-grid` | `cards-grid-recipe-cards` | recipe page decoration in `blocks/cards-grid/linzess/cards-grid.js` |
| `columns` | `more-like-this` | `moreLikeThis()` helper |
| `columns` | `cta-cards` | `ctaCards()` helper |
| ISI default-content | `isi` | `isiSection()` helper |
| `safety-bar` | `split` | `safetyBarSection()` helper |
| `metadata` | — | `metadataSection()` helper |

## Key Decisions / Open Risks
- **Strategy rows have no CTA link** (recipe variant emits a "Get the recipe" link as row 5). The `cards-grid-recipe-cards` decoration must render gracefully when the CTA cell is empty/absent. **Action:** emit the grid-card rows with an empty CTA cell and confirm the decoration skips the empty `<a>`; if it injects a stray link, add a minimal guard in the linzess `buildLinzessRecipeCardRow` (no new block — additive null-check only).
- **Image hosting:** recipe images were migrated into project DAM (`/content/dam/abbvie-eds-poc/...`) because `createOptimizedPicture` strips the host. **Action:** determine whether the 4 strategy PNGs + hero JPGs load from `linzess.com` host through the recipe-cards decoration (which appends `<picture>` directly) or must be downloaded to project DAM like the recipe images. Default to downloading the 4 strategy PNGs to project DAM if they 404 locally.
- **Sources placement:** live shows Sources inside the same strategy section. Mirror the pantry page's footnote treatment (`<p class="footnote">` + `<ol class="footnote">`).
- **Branch:** continue on the current `linzess-wellness-tips` branch (where recipes + pantry already live) unless told otherwise.

## Implementation Outline (Execute mode)
1. Add a `game-plan` template to `TEMPLATES` in `tools/importer/import-wellness-tips.js`, building sections 1–7 above; add `documentPath` and a `resolveTemplate` branch (`url.includes('make-a-game-plan')`).
2. Add the live URL to `tools/importer/wellness-urls.txt`.
3. If needed, download the 4 strategy PNGs (+ hero JPGs) into `content/content/dam/abbvie-eds-poc/linzess/images/` and point srcs at the host-relative project-DAM path.
4. Re-bundle the importer (esbuild IIFE, `--global-name=CustomImportScript`) and run `run-bulk-import.js` for the new URL → produces `.plain.html`.
5. If the strategy rows need a no-CTA guard, make the minimal additive edit in `blocks/cards-grid/linzess/cards-grid.js`.
6. Verify on localhost preview at the `/content/...` path; pixel-compare each section to live (hero H1, strategy image-left rows, More Like This, CTA, ISI, safety bar).
7. Validate: `npm run lint:css`, ESLint on touched JS, and the md2jcr harness (expect SUCCESS, lint clean except the 3 known safety-bar errors).
8. Regression-check the recipes + pantry pages still render 200.

> Execution requires **Execute mode** — this plan performs no file changes yet.

## Checklist
- [ ] Confirm branch (`linzess-wellness-tips`) and that the dev preview server is serving local content
- [ ] Add `game-plan` template (sections 1–7) to `import-wellness-tips.js` with correct `documentPath`
- [ ] Wire `resolveTemplate()` to match the `make-a-game-plan` URL
- [ ] Append the live URL to `wellness-urls.txt`
- [ ] Verify strategy/hero image hosting; download the 4 strategy PNGs (+ hero JPGs) to project DAM if they 404 locally
- [ ] Handle the no-CTA strategy rows (empty CTA cell; add a null-guard in `cards-grid/linzess/cards-grid.js` only if required)
- [ ] Re-bundle the importer and run `run-bulk-import.js` to generate the `.plain.html`
- [ ] Verify hero (uppercase Bebas H1, behind-nav, breadcrumb eyebrow) matches live
- [ ] Verify the 4 strategy image-left/text-right rows match live (image size, title 24px, body)
- [ ] Verify More Like This (3 equal-height cards, correct links/images)
- [ ] Verify CTA cards, inline ISI (verbatim copy + job code), and floating safety bar
- [ ] Run `npm run lint:css` + ESLint + md2jcr harness (SUCCESS, lint clean except 3 known safety-bar errors)
- [ ] Regression-check recipes + pantry pages still render
- [ ] Report results; hold for explicit approval before any commit/push
