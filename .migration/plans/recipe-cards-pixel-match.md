# Recipe Cards — Pixel-Match to Live Reference

> **Answer to "are you using cards?": Yes.** The recipe block on `5-holiday-low-fodmap-recipes` was migrated to the repo's purpose-built **`cards`** library block (rendered DOM: `<div class="cards recipe-cards block" data-block-name="cards">` → `<ul><li>` with `.cards-card-image` + `.cards-card-body`), replacing the earlier custom `columns (recipe-cards)` variant. This plan keeps that `cards` block and only adjusts its recipe-scoped CSS for pixel parity — no block swap.

## Reference vs. current state
The selected element is the `cards.recipe-cards` block. The provided reference screenshot shows the live design to match:

- **Layout:** vertical stack of rows, **square thumbnail left** (~227px) + text right, generous row spacing, left-aligned text vertically centered against the image. *(Current `cards` build already does this.)*
- **Title** ("Prosciutto Wrapped Scallops with Spinach"): **dark purple, mixed-case, normal-width, regular-ish weight** — NOT condensed all-caps. ⚠️ **Current build uses `--heading-font-family` = `Bebas Neue` (condensed, uppercase display)** → clear mismatch.
- **Description:** grey body text (`--linz-grey #4d4d4f`), ~14–16px. *(Matches.)*
- **"Get the recipe" link:** dark purple, bold-ish, **appears NOT underlined** in the reference. ⚠️ **Current build sets `text-decoration: underline`** → likely mismatch.
- **Card chrome:** transparent (no background/border), whitespace between rows. *(Matches — already removed.)*

## Goal
Adjust the `cards.recipe-cards` typography to pixel-match the live reference: correct the title font/size/weight/case and the link decoration, verified against the **live page's computed styles** (source of truth), scoped to `.cards.recipe-cards` so no other block/page is affected. The block remains the `cards` library block.

## Approach (scoped to the selected `cards` block only)

### A. Capture live computed styles (source of truth)
Playwright-load `https://www.linzess.com/starting-linzess/wellness-tips/5-holiday-low-fodmap-recipes`; read computed styles for one recipe row:
- Title `h2.c-linz-dark-purple`: `font-family`, `font-size`, `font-weight`, `line-height`, `text-transform`, `color`, margins.
- Description `p`: `font-size`, `line-height`, `color`, margins.
- "Get the recipe" link: `color`, `font-weight`, `font-size`, `text-decoration`, any icon/arrow.
- Image column width + gap + row spacing; vertical alignment.

### B. Apply scoped CSS fixes (`styles/linzess/styles.css`, `.cards.recipe-cards` only)
- **Title:** replace `--heading-font-family` (Bebas Neue) with the live-matched family (likely body `Lato` at the live size/weight; `text-transform: none`), dark purple `--linz-dark-purple`, exact px/line-height from step A.
- **Link:** match live decoration (remove underline if live has none; keep purple/weight; add arrow only if live shows one).
- **Description / spacing / image width:** nudge to live values from step A if any delta.
- Keep card transparent; preserve the existing file-level `stylelint-disable`; ensure **0 new** `no-descending-specificity` / `no-duplicate-selectors` warnings.

> CSS-only on the existing `cards` block — no `.plain.html` re-import, no shared `blocks/cards/*` edits. md2jcr unaffected.

### C. Verify
- Refresh preview; Playwright compare the migrated `cards` block vs the live reference at desktop + a mobile width: title font/case/size, link decoration, image size, row spacing, alignment.
- Confirm images still load (project-DAM optimized path), CTA links resolve, intro "Low FODMAP" link intact.
- `npm run lint:css` clean except the 3 pre-existing safety-bar errors; recipe rules add 0 new stylelint warnings.
- Regression: pantry + reference OTC pages render 200, unchanged.

## Risks / notes
- If the live title font is a brand display face not loaded in the project, fall back to the nearest loaded family (`Lato`/`--body-font-family`) at the matched size/weight rather than importing a new font (would need approval).
- Pixel-parity is bounded by font rendering/anti-aliasing differences between hosts; match to computed values, flag any residual.

## Checklist
- [ ] Confirm the block in use is the `cards` library block (it is — `data-block-name="cards"`); no block swap in this task
- [ ] Playwright-capture live computed styles for the recipe title, description, "Get the recipe" link, image column width, row gap, alignment
- [ ] Fix title CSS: correct font-family (non-Bebas, mixed-case `text-transform: none`), size, weight, line-height, dark-purple color to match live
- [ ] Fix "Get the recipe" link decoration (underline/none, color, weight, arrow) to match live
- [ ] Reconcile description font-size/spacing, image column width, row gap, and vertical alignment with live values
- [ ] Keep changes scoped to `.cards.recipe-cards`; preserve transparent card (no bg/border)
- [ ] Refresh preview; Playwright compare block vs reference at desktop + mobile; confirm images load, CTAs + intro link resolve
- [ ] `npm run lint:css` clean (only 3 pre-existing safety-bar errors); 0 new stylelint warnings in the recipe block
- [ ] Regression: pantry + reference OTC pages render unchanged; md2jcr unaffected (CSS-only)
- [ ] Report changes; hold for approval before any commit/push

> **Note:** Capturing live styles, editing CSS, refreshing preview, and lint all require **Execute mode**. This is the plan only; no commits/pushes without explicit approval.
