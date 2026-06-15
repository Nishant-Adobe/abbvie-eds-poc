Let me inspect the unique food-swap comparison section and gather image assets before drafting the plan.Let me inspect the food-swap section structure and the diet-cards layout more closely to map them to existing blocks.# Good for Your Gut — Flavorful Food Swaps — Migration Plan

## Goal
Migrate `https://www.linzess.com/starting-linzess/wellness-tips/good-for-your-gut-flavorful-food-swaps` into the EDS project as a new `.plain.html` page at `/linzess/starting-linzess/wellness-tips/good-for-your-gut-flavorful-food-swaps`, reusing the existing blocks and the deterministic `tools/importer/import-wellness-tips.js` pipeline (same approach as the recipes, pantry, and game-plan pages). No new block *types* — only additive variant CSS where a layout isn't yet covered.

## Source Page Structure (verified against live)
Page title (meta): "Helpful Foods for Constipation | LINZESS® (linaclotide)". Section sequence:

1. **Hero** (editorial, behind-nav) — eyebrow `Resources / Wellness Tips`, H1 `Good for Your Gut—Flavorful Food Swaps` (uppercase Bebas). Images: `article-wellness-goodgut-desktop.jpg` / `article-wellness-goodgut-mobile.jpg` (stay on linzess.com host).
2. **Intro** (white `otc-intro-section`) — intro paragraph only (no heading-1): "The taste buds want what the taste buds want…appetizing alternatives to some possible trigger foods you should avoid."
3. **Food Swaps comparison** (the page's signature block) — a two-column table:
   - Left column header **"Try These:"** — 5 healthy swaps (Almond milk/yogurt/brie…, Bananas/berries/citrus…, Treats with molasses/maple syrup, Baked chips/rice cakes/popcorn, Whole-grain bread/oats/brown rice/quinoa). Some rows carry a small callout (e.g. "Yogurt contains good bacteria your gut loves.", "Kiwi acts as a natural laxative.", "Brown rice provides 4 grams of fiber per cup.").
   - Right column header **"When Craving These:"** — 5 trigger foods (Milk/cream cheese/sour cream, Apples/pears/watermelon/dried fruit, Treats with honey/-ol sweeteners, Potato chips/fried foods, Pasta/crackers/white rice/rye bread) — also with callouts ("Honey is high in fructose…", "Fatty foods slow digestion…").
   - Live DOM: `.abbv-container.module3` → `.abbv-row` with two columns. **No existing variant matches this** — see Open Risks.
4. **Some Common Gut-Friendly Diets** (`otc-intro-section`-style or its own) — heading `Some Common Gut-Friendly Diets` + intro paragraph (with a "seek your doctor's advice" link), then **4 icon cards** (Low FODMAP, Gluten-free, High fiber, Low fat) each = icon + description, then a **Sources** footnote `<ol>` (4 refs). The 4-icon row maps to the pantry **`how-they-work`** columns variant; Sources maps to the footnote treatment (`:has(ol)` scoping already in place).
   - Icons: `4.2.2-d-good-for-your-gut-flavorful-food-swaps-{low-fodmap,gluten-free,high-fiber,low-fat}-diet@2x.png`.
5. **More Like This** (`columns more-like-this`) — 3 cards:
   - `Your Map to a Low FODMAP Diet` → `/linzess/starting-linzess/wellness-tips/your-map-to-a-low-fodmap-diet`
   - `Is Your Pantry FODMAP-Friendly?` → `/linzess/starting-linzess/wellness-tips/is-your-pantry-fodmap-friendly`
   - `5 Holiday Low FODMAP Recipes` → `/linzess/starting-linzess/wellness-tips/5-holiday-low-fodmap-recipes`
6. **CTA cards** (`cta-cards`) — Check My Symptoms / Savings & Support (shared builder).
7. **Inline ISI** (`isi`) + **floating safety bar** (`safety-bar split`, blockId `sb-food-swaps`) + **metadata**.

## Reusable Blocks (no new block types)
| Block | Variant | Reuse source |
|---|---|---|
| `hero` | editorial behind-nav | `heroSection()` |
| `columns` | **`food-swaps`** (NEW variant class, additive CSS) | new — see Open Risks |
| `columns` | `how-they-work` (4 diet-icon cards) | pantry page builder |
| `columns` | `more-like-this` | `moreLikeThis()` |
| `columns` | `cta-cards` | `ctaCards()` |
| ISI default-content | `isi` | `isiSection()` |
| `safety-bar` | `split` | `safetyBarSection()` |
| `metadata` | — | `metadataSection()` |

## Key Decisions / Open Risks
- **Food Swaps comparison (section 3) has no existing variant.** It's a 2-column "Try These / When Craving These" list with per-item callouts — visually distinct from `what-is-linzess` (image+text) and `how-they-work` (icon grid). **Recommended approach:** add an additive `cards-grid` or `columns` variant `food-swaps` (new variant class only, decorated/styled to match live — same precedent as `cards-grid-recipe-cards`). This keeps "no new block type." Needs confirmation on the exact authoring shape (how callouts attach to items).
- **Diet-icon cards (section 4):** the live cards are icon + description (the title is encoded only in the image `alt`). The `how-they-work` variant emits `<strong>` title + body; here there's no visible title, so the builder must emit icon + body only (and the existing decoration must render gracefully without a title — verify, add a null-guard if needed, same pattern as the game-plan no-CTA guard).
- **Off-white band:** check whether the diet-cards / food-swap section sits on an off-white band on live (like game-plan/pantry) and scope via `:has(ol)` or a dedicated class if so.
- **Image hosting:** hero JPGs stay on linzess.com host; the 4 diet-icon PNGs (content images through the decoration) likely need downloading to project DAM (`/content/dam/abbvie-eds-poc/linzess/images/`) if they 404 locally — confirm per the recipe/pantry precedent.
- **Metadata title:** live uses "Helpful Foods for Constipation | LINZESS® (linaclotide)" (not the H1 text) — preserve verbatim.
- **Branch:** continue on `linzess-wellness-tips`.

## Implementation Outline (Execute mode)
1. Add a `food-swaps` template to `TEMPLATES` in `tools/importer/import-wellness-tips.js` (sections 1–7) + `documentPath` + `resolveTemplate` branch (`url.includes('good-for-your-gut')`).
2. Build the Food Swaps comparison via a new additive `columns`/`cards-grid` variant; build the 4 diet-icon cards via the `how-they-work` builder (icon + description, no title).
3. Append the URL to `tools/importer/wellness-urls.txt`.
4. Download the 4 diet-icon PNGs to project DAM if they 404 locally; hero JPGs stay host-absolute.
5. Add scoped CSS in `styles/linzess/styles.css` for the `food-swaps` variant (2-column layout, "Try These/When Craving These" headers, item + callout typography) and any diet-card/off-white-band adjustments — scope to this page (e.g. `:has(ol)` or a section class) so recipes/pantry/game-plan are untouched.
6. Re-bundle the importer (esbuild IIFE, `--global-name=CustomImportScript`) and run `run-bulk-import.js` for the new URL → `.plain.html`.
7. Verify on localhost at the `/content/...` path; pixel-compare each section to live across desktop/tablet/mobile.
8. Validate: `npm run lint:css`, ESLint on touched JS, md2jcr harness (SUCCESS, lint clean except the 3 known safety-bar errors). Regression-check recipes/pantry/game-plan still render.

> Execution requires **Execute mode** — this plan performs no file changes yet.

## Checklist
- [ ] Confirm branch (`linzess-wellness-tips`) and dev preview serving local content
- [ ] Decide/confirm the Food Swaps comparison approach (additive `food-swaps` variant — authoring shape for items + callouts)
- [ ] Capture verbatim copy for both swap columns (all 10 items + callouts) and the 4 diet-card descriptions
- [ ] Add `food-swaps` template (sections 1–7) to `import-wellness-tips.js` with correct `documentPath`
- [ ] Wire `resolveTemplate()` to match the `good-for-your-gut` URL
- [ ] Append the live URL to `wellness-urls.txt`
- [ ] Verify image hosting; download the 4 diet-icon PNGs to project DAM if they 404 locally
- [ ] Handle diet-icon cards with no visible title (icon + body only; guard the `how-they-work` decoration if needed)
- [ ] Add scoped `food-swaps` CSS (2-col layout, headers, item + callout typography) without regressing sibling pages
- [ ] Re-bundle the importer and run `run-bulk-import.js` to generate the `.plain.html`
- [ ] Verify hero (uppercase Bebas H1, behind-nav, breadcrumb eyebrow) vs live
- [ ] Verify Food Swaps comparison (two columns, headers, items, callouts) vs live across viewports
- [ ] Verify diet-icon cards + Sources footnote, More Like This, CTA, inline ISI, floating safety bar
- [ ] Run `npm run lint:css` + ESLint + md2jcr harness (SUCCESS, lint clean except 3 known safety-bar errors)
- [ ] Regression-check recipes + pantry + game-plan pages still render
- [ ] Report results; hold for explicit approval before any commit/push
