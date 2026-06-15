Let me inspect the current diet-cards authoring, CSS, and the actual diet PNG to ground the critique.Now let me check how the diet section actually renders vs the live screenshot — heading, grid columns, icon image, and the live PNG content.Let me check the diet section's computed styles and what the diet PNGs actually contain (live shows the diet name baked into a purple circle).Let me verify the band-color discrepancy and the caption text styling, since the live band is clearly more periwinkle than what's rendering.The rendered band is `#f4f6fb` (cold near-white) but the live band is a warmer periwinkle. My `gut-diets-section` background rule isn't winning. Let me find what's overriding it.The `how-they-work` columns variant likely paints its own off-white band that overrides my section rule. Let me check.The rendered band is cold off-white `#f4f6fb`, but the live band is warm periwinkle/lavender. My `.gut-diets-section` rule is being overridden. Let me confirm specificity and check the heading's orange accent.# Gut-Friendly Diets Section — Pixel-Match to Live Plan

## Critique: current diet-cards block vs. live screenshot

The diet section is **structurally correct** (heading + 4 dark-purple circle icons with diet names baked in + gray captions + Sources) but has one clear pixel mismatch plus a couple of finer gaps:

| Aspect | Live screenshot | Current EDS render | Verdict |
|---|---|---|---|
| **Band background** | Warm **periwinkle / lavender** band (~`#d9d7f9`, same hue as the food-swap panels) | Cold blue-gray **off-white `#f4f6fb`** (`--linz-off-white`) | ❌ **Wrong color** |
| **Heading** | "SOME COMMON GUT-FRIENDLY DIETS" — dark-purple Bebas, centered, ~40px, small orange arc divider above | Dark-purple Bebas 40px centered, divider above | ✅ Matches (verify divider art) |
| **Intro copy** | Gray, centered, ~16px, capped width | Gray `#4d4d4f`, centered, 16px, 920px cap | ✅ Matches |
| **Diet icons** | 4 solid dark-purple circles, diet name baked in white text, ~210px, evenly spaced 4-across | PNGs (323×321) rendered at 210px, grid 4×231.5px | ✅ Matches (purple circle + name in PNG) |
| **Captions** | Gray, centered, below each circle | Gray `#4d4d4f`, 16px, centered | ✅ Matches |
| **Sources** | Small gray numbered list, left-aligned below the grid | Present | ✅ Matches |

### Root cause of the band-color mismatch
The intended rule already exists:

```css
main > .section.otc-intro-section.gut-diets-section { background-color: var(--color-brand-primary-lighter); } /* #d9d7f9 */
```

…but it is **out-specified** by the shared pantry rule at `styles.css:835`:

```css
main > .section.otc-intro-section:has(.columns.how-they-work) { background-color: var(--linz-off-white); } /* #f4f6fb */
```

`:has(.columns.how-they-work)` contributes the specificity of its argument (2 classes), so that selector scores **4 classes** vs. the gut-diets rule's **3 classes** — the cold off-white wins, leaving the diet band the wrong color. (The pantry page legitimately needs off-white; the food-swaps page's diet band needs periwinkle.)

## Fix approach (CSS only — no re-author, no re-import)

This is a pure CSS specificity fix scoped to `.gut-diets-section`; the authored content, images, and JCR are already correct, so **no importer change or re-import is required**.

1. **Raise the gut-diets background rule above the `:has` pantry rule.** Match the off-white rule's specificity by adding `:has(.columns.how-they-work)` to the gut-diets selector (now 4 classes + scoped by the unique `.gut-diets-section` class, so it wins and stays page-local):
   ```css
   main > .section.otc-intro-section.gut-diets-section:has(.columns.how-they-work) {
     background-color: var(--color-brand-primary-lighter); /* #d9d7f9 periwinkle */
   }
   ```
   Keep the existing 210px icon cap rule as-is.
2. **Verify the heading divider** renders as the live orange arc (currently `divider.svg`); only adjust if it visibly differs.
3. **Confirm the off-white pantry rule still wins on the pantry page** (its `:has` selector is unchanged) — the new rule only adds the `.gut-diets-section` class, which the pantry page doesn't have, so no regression.

## Validation
- Reload preview; confirm `.gut-diets-section` computed `background-color` = `rgb(217, 215, 249)` (#d9d7f9), not `#f4f6fb`.
- Visual check desktop + mobile vs. the live screenshot (periwinkle band, 4 purple circles, gray captions, Sources).
- `npm run lint:css` style of check on the brand stylesheet scoping.
- Regression-check the **pantry** page: its `how-they-work` band must remain off-white `#f4f6fb`.
- Hold for explicit approval before commit/push.

## Checklist
- [ ] Update `styles/linzess/styles.css` `.gut-diets-section` background rule to add `:has(.columns.how-they-work)` so it out-specifies the pantry off-white rule, keeping `--color-brand-primary-lighter` (#d9d7f9)
- [ ] Reload preview and confirm computed band color = `rgb(217, 215, 249)`
- [ ] Verify heading divider/arc matches live (adjust only if it visibly differs)
- [ ] Visual-check the diet section desktop + mobile vs. the live screenshot (band, 4 purple circles, captions, Sources)
- [ ] Regression-check the pantry page — its `how-they-work` band stays off-white `#f4f6fb`
- [ ] Confirm CSS scoping unchanged elsewhere (no broadened selectors); lint the brand stylesheet
- [ ] Report results and hold for explicit approval before any commit/push

_Execution requires Execute mode — this plan only describes the change; no files have been modified. Note: this is a CSS-only fix, so no importer re-bundle or re-import is needed._
