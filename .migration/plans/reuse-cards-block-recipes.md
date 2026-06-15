I'll investigate which existing repo blocks could replace the custom `recipe-cards` columns variant for this image-left/text-right repeating layout.Let me examine the candidate blocks — `cards`, `story-cards`, `story-card`, `teaser` — for an image+title+description+CTA repeating layout.The `cards` block is a strong match — each row becomes a card with an image div + body div (title/desc/CTA), exactly the two-cell shape I'm already authoring. Let me check its model and CSS layout.The `cards` block (image + richtext per card) matches the two-cell shape exactly and is a purpose-built library block. Let me check its CSS layout and the live DOM's actual component to pick the best fit.# Reuse the `cards` Block for the Recipe List

## Goal
Replace the bespoke `columns (recipe-cards)` variant on `5-holiday-low-fodmap-recipes` with the repo's purpose-built **`cards`** library block — reusing existing block JS/model/CSS instead of a custom columns variant — while keeping the live image-left/text-right stacked-row appearance.

## Why `cards` is the right reuse
- **Model match:** `blocks/cards/_cards.json` defines each card as **image (reference) + text (richtext)** — exactly the two-cell shape currently authored (image cell + title/desc/CTA cell). No new fields needed.
- **Decoration match:** `blocks/cards/cards.js` turns each block row into an `<li>` with `.cards-card-image` + `.cards-card-body`, auto-optimizes the picture, and renders the body richtext (title `<strong>`, description `<p>`, CTA link) — no custom JS required.
- **Layout precedent:** `blocks/cards/cards.css` already ships image-left/text-right stacked-row layouts (`.cards.story`, `.related-card-section`) with mobile stacking — the live recipe pattern. We reuse that approach via a recipe-scoped selector rather than inventing a columns variant.
- It is a standard EDS block (clean md2jcr round-trip: image + richtext, no positional row gotchas like image-text's 10-row rule).

## Scope (selected element only)
`content/linzess/starting-linzess/wellness-tips/5-holiday-low-fodmap-recipes.plain.html` → the `otc-intro-section` recipe block. Pantry page, other sections, hero/ISI/safety-bar/metadata all untouched. No edits to shared `blocks/cards/*` code (CSS additions are find-relief/recipe-scoped only).

## Approach

### A. Import script (`tools/importer/import-wellness-tips.js`)
- Swap the recipe block from `WebImporter.Blocks.createBlock({ name: 'columns (recipe-cards)', … })` to a **`cards`** block. The `cards` model has no anchorId/variant row, so drop the leading `['recipe-cards']` cell.
- Author each recipe as a **2-cell row**: cell 1 = `<picture>` image; cell 2 = body richtext (`<p><strong>Title</strong></p>`, `<p>desc</p>`, `<p><a target="_blank" href="…pdf#page=N">Get the recipe</a></p>`). Keep verbatim titles/descriptions, PDF hrefs (preserve `#page=N` / `?logActivity=true`), em-dashes, smart quotes.
- Keep the restored intro **Low FODMAP** inline link.
- Decide the block class: use base `cards` plus a recipe-scoped section hook (the section already carries `otc-intro-section`) so the layout CSS can target it without a new block variant. (If a class on the block itself is cleaner, use a single additive class — confirm during execution; prefer reusing the section scope.)

### B. CSS (`styles/linzess/styles.css`)
- **Remove** the now-unused `.columns.recipe-cards` rules (the custom variant being retired).
- **Add** recipe-scoped rules targeting the `cards` DOM (`.otc-intro-section .cards`): `ul` single-column stack; each `li` a 2-col row image-left (~`22.7rem`) + body-right, vertically centered; title purple `h2`-scale; description grey body; "Get the recipe" bold purple underlined text link (neutralize any `.button` chrome); mobile (`< 600px`) stacks image above text. Mirror the existing `.related-card-section`/`.story` patterns so it's consistent with shipped card layouts.
- Keep the file-level `stylelint-disable` already present; ensure new rules add **0** new `no-descending-specificity` / `no-duplicate-selectors` warnings.

### C. Regenerate & validate (Execute mode)
- Re-bundle the import script (esbuild IIFE, global `CustomImportScript`); re-run `run-bulk-import.js` for the recipes URL only.
- Confirm generated `.plain.html` now emits `class="cards…"` with `card`/image+body rows (not `columns recipe-cards`).
- md2jcr round-trip (importer 1.2.x) → SUCCESS, no double-encoded entities.
- Preview: stacked image-left rows match live; intro link + 5 "Get the recipe" PDF links resolve; CTA visible (not a filled button).
- `npm run lint:css` clean except the 3 pre-existing safety-bar errors.
- Regression: pantry page + reference OTC page render unchanged; ISI/job code/safety-bar intact.

## Risks / notes
- `cards.js` calls `createOptimizedPicture` (rewrites `<img>` to an optimized `<picture>`); confirm the live DAM image URLs still resolve after optimization (they did for the `more-like-this` columns images, which are remote too).
- `cards` default grid is a card grid; the image-left stacked row look comes from the recipe-scoped CSS (same technique already validated for the columns version) — not from a stock `cards` variant.
- Base `cards` styling brings a card background/border by default; the recipe-scoped rules will reset to the transparent stacked-row look to match live.

## Checklist
- [ ] Switch recipe block in the import script from `columns (recipe-cards)` to the `cards` block (drop the variant/anchorId leading cell)
- [ ] Author each recipe as image cell + body richtext cell (title `<strong>`, description, `Get the recipe` link with `target="_blank"`), verbatim copy + PDF hrefs preserved
- [ ] Keep the intro **Low FODMAP** inline link
- [ ] Remove the retired `.columns.recipe-cards` CSS rules
- [ ] Add recipe-scoped `cards` layout CSS: single-column stack, image-left + body-right rows, purple title, grey body, visible purple "Get the recipe" text link, mobile image-above-text
- [ ] Re-bundle import script; re-run bulk import for the recipes URL; confirm `.plain.html` now uses `cards`
- [ ] md2jcr round-trip SUCCESS (importer 1.2.x); no double-encoded entities
- [ ] Preview: stacked image-left rows match live; intro link + 5 PDF CTAs resolve; CTA renders as text link
- [ ] `npm run lint:css` clean (only 3 pre-existing safety-bar errors); cards rules add 0 new stylelint warnings
- [ ] Regression: pantry + reference OTC pages render unchanged; ISI/safety-bar/job code intact
- [ ] Report changes; hold for approval before any commit/push

> **Note:** Editing the import script/CSS, re-bundling, re-running the import, md2jcr validation, and preview all require **Execute mode**. This is the plan only; no commits/pushes without explicit approval.
