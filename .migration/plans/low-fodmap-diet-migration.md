# Your Map to a Low FODMAP Diet — Migration Plan

## Goal
Migrate `https://www.linzess.com/starting-linzess/wellness-tips/your-map-to-a-low-fodmap-diet` into the EDS project as a new `.plain.html` page at `/linzess/starting-linzess/wellness-tips/your-map-to-a-low-fodmap-diet`, reusing the existing blocks and the deterministic `tools/importer/import-wellness-tips.js` pipeline — the same approach proven on the recipes, pantry, game-plan, and food-swaps pages. **No new block types**; add an additive variant only if a layout genuinely isn't covered. **Scope every CSS change so no other page is affected.**

This is the canonical FODMAP page that all four sibling wellness-tips pages already link to in their "More Like This" sections.

## Source Page Structure (verified against live)
Section sequence:

1. **Hero** (editorial, behind-nav) — eyebrow `Resources / Wellness Tips`, H1 `Your Map to a Low FODMAP Diet` (uppercase Bebas). Hero image `Low_Food_diet_Desktop.jpg` (+ mobile variant — confirm filename live).
2. **Breaking Down FODMAP** — intro paragraph defining a Low FODMAP diet + that FODMAP = "Fermentable Oligosaccharides, Disaccharides, Monosaccharides, and Polyols," then **4 icon cards**:
   - **Oligosaccharides** — wheat, rye, legumes, garlic, onions
   - **Disaccharides** — milk, yogurt, soft cheese (lactose)
   - **Monosaccharides** — apples, pears, fructose-heavy sweeteners
   - **Polyols** — peaches, blackberries, "-ol" sweeteners
   → maps to the existing **`columns (how-they-work)`** icon-card variant (icon + title + body), exactly like the pantry shopping-list and food-swaps diet cards.
3. **Mapping Out a Low FODMAP Diet** — heading + intro + a 6-step infographic (The FODMAP Swap · Read the Labels · Know Your Portions · Be Prepared · Be Patient · Identify Your Triggers). Live uses a single infographic PNG (`4.2.4-d-your-map-to-a-low-fodmap-diet-map-infographic-no-bkg@2x.png`). **See Open Risks for the mapping decision.**
4. **Sources** footnote `<ol>` (Monash University + American College of Gastroenterology citations) — footnote treatment already supported via the `:has(ol)` scoping.
5. **More Like This** (`columns more-like-this`) — 3 cards:
   - `Is Your Pantry FODMAP-Friendly?` → `/linzess/starting-linzess/wellness-tips/is-your-pantry-fodmap-friendly`
   - `Good for Your Gut—Flavorful Food Swaps` → `/linzess/starting-linzess/wellness-tips/good-for-your-gut-flavorful-food-swaps`
   - `Tackling IBS-C Triggers` → `/linzess/starting-linzess/healthy-routines/tackling-ibs-c-triggers`
6. **CTA cards** (`cta-cards`) — Check My Symptoms / Savings & Support (shared builder).
7. **Inline ISI** (`isi`) + **floating safety bar** (`safety-bar split`, blockId `sb-low-fodmap-diet`) + **metadata** (title `Your Map to a Low FODMAP Diet | LINZESS® (linaclotide)` + live meta description).

## Reusable Blocks (no new block types)
| Block | Variant | Reuse source |
|---|---|---|
| `hero` | editorial behind-nav | `heroSection()` |
| `columns` | `how-they-work` (4 FODMAP category cards) | pantry/food-swaps builder |
| infographic | default-content image (or additive variant — see risks) | `section()` + `img()` |
| `columns` | `more-like-this` | `moreLikeThis()` |
| `columns` | `cta-cards` | `ctaCards()` |
| ISI default-content | `isi` | `isiSection()` |
| `safety-bar` | `split` | `safetyBarSection()` |
| `metadata` | — | `metadataSection()` |

## Key Decisions / Open Risks
- **"Mapping Out" infographic (section 3) is the one uncertain mapping.** Two options, decided by inspecting the live DOM during execution:
  - **(a) Single infographic image** — if live renders it as one composed PNG, author it as a heading + intro + `img()` default-content section (simplest, no new variant). Image must be downloaded to project DAM.
  - **(b) 6 individual step cards** — if the steps are separate DOM nodes with their own icons/text, author them as a `columns (how-they-work)` grid (icon + title + body) or, if numbered-step styling is needed, an additive scoped variant (`fodmap-steps`).
  Default to **(a)** unless the live DOM shows discrete step cards. Either way, **no new block type**.
- **Image hosting:** per the established precedent — hero JPGs stay on the linzess.com host; **content images** (4 FODMAP category icons + the infographic) that flow through block decoration get downloaded into project DAM (`/content/dam/abbvie-eds-poc/linzess/images/`) host-relative, since `createOptimizedPicture` strips the host. Verify each by `naturalWidth > 0` in preview.
- **FODMAP category cards with no white blob / band color:** verify the section background against live computed styles (white vs off-white vs periwinkle) and scope it with a dedicated section class + `:has(...)` if it must differ from the shared `how-they-work` rules — the same specificity discipline used for the pantry off-white band and the gut-diets periwinkle band (so recipes/pantry/game-plan/food-swaps are untouched).
- **Section heading collapse guard:** reuse the `:first-of-type` scoping + the `--font-size-article-heading, 40px` fallback already in place so the intro/section headings don't collapse on the deployed build.
- **Pharma fidelity:** ISI copy, job code `US-LIN-250121`, Boxed Warning / Prescribing Information / Medication Guide links reused verbatim from the shared `ISI_HTML`/`SB_*` constants (unchanged). FODMAP category text and Sources captured verbatim from live.
- **Branch:** continue on `linzess-wellness-tips`.

## Implementation Outline (Execute mode)
1. Capture verbatim copy from the live DOM for: the Breaking Down FODMAP intro + 4 category descriptions, the Mapping Out heading/intro/6 steps, and the Sources list. Confirm the section-3 DOM shape (single infographic vs. step cards).
2. Add a `low-fodmap-diet` template to `TEMPLATES` in `import-wellness-tips.js` (sections 1–7), plus `documentPath` and a `resolveTemplate` branch (`url.includes('your-map-to-a-low-fodmap')`).
3. Download the 4 FODMAP category icons + the infographic (and mobile hero if needed) into project DAM, host-relative; hero JPGs stay host-absolute.
4. Add scoped CSS in `styles/linzess/styles.css` only if section 3 needs an additive variant or a distinct band color — scoped via a dedicated section class so siblings are untouched.
5. Append the live URL to `tools/importer/wellness-urls.txt`.
6. Re-bundle the importer (esbuild IIFE, `--global-name=CustomImportScript`) and run the bulk import for **only** this URL (single-URL temp file, so sibling pages aren't regenerated) → produces `.plain.html`.
7. Verify on localhost at the `/content/...` path; pixel-compare each section to live across desktop / tablet / mobile (verify findings by direct measurement — the visual-comparator agent has produced false positives this session, so confirm before acting).
8. Validate: ESLint on touched JS, `npm run lint:css` (expect only the 3 known safety-bar errors), and md2jcr (well-formed XML, section `customClass` comma-round-trips, all images resolve to `image=` refs).
9. Regression-check recipes + pantry + game-plan + food-swaps pages still render 200, unchanged.
10. Report results; **hold for explicit approval before any commit/push.**

> Execution requires **Execute mode** — this plan performs no file changes yet.

## Checklist
- [ ] Confirm branch (`linzess-wellness-tips`) and dev preview serving local content
- [ ] Capture verbatim copy: Breaking Down FODMAP intro + 4 category descriptions, Mapping Out heading/intro/6 steps, Sources list
- [ ] Inspect section-3 live DOM and decide infographic mapping (single image vs. step cards) — no new block type
- [ ] Add `low-fodmap-diet` template (sections 1–7) to `import-wellness-tips.js` with correct `documentPath`
- [ ] Wire `resolveTemplate()` to match the `your-map-to-a-low-fodmap` URL
- [ ] Verify image hosting; download the 4 FODMAP icons + infographic (+ mobile hero if needed) into project DAM
- [ ] Build the FODMAP category cards via `columns (how-they-work)` (icon + title + body)
- [ ] Build the Mapping Out section (default-content infographic image, or scoped additive variant if discrete step cards) + Sources footnote
- [ ] Reuse `moreLikeThis`, `ctaCards`, `isiSection`, `safetyBarSection` (`sb-low-fodmap-diet`), `metadataSection`
- [ ] Add scoped CSS only if section 3 / band color needs it — dedicated section class, no sibling-page regression
- [ ] Append the live URL to `wellness-urls.txt`
- [ ] Re-bundle importer and run bulk import for this URL only (single-URL temp file)
- [ ] Verify hero (uppercase Bebas H1, behind-nav, breadcrumb eyebrow) vs live
- [ ] Verify Breaking Down FODMAP cards + Mapping Out section vs live across desktop/tablet/mobile (measure directly)
- [ ] Verify Sources footnote, More Like This, CTA cards, inline ISI (verbatim + job code), floating safety bar
- [ ] Run ESLint + `npm run lint:css` + md2jcr (SUCCESS, well-formed XML, `customClass` round-trips, images resolve; lint clean except 3 known safety-bar errors)
- [ ] Regression-check recipes + pantry + game-plan + food-swaps pages render 200, unchanged
- [ ] Report results and hold for explicit approval before any commit/push
