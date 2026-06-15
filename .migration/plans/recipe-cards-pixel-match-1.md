# Recipe Cards — Switch to `cards-grid` Variation (Match Live Image-Left Rows)

## Direction change
Per your instruction, switch the recipe block from the `cards` library block to the **`cards-grid`** block (a variation of it), keeping the live image-left / text-right stacked-row design and pixel-matched typography.

## Current state
- The recipe block currently renders as `cards (recipe-cards)` → `<ul><li>` with `.cards-card-image` / `.cards-card-body`. Localhost matches live (image-left rows, Lato 24/700 purple title, grey desc, 800/underline CTA, image radius 0). The aemcoder preview snapshot still shows stock single-column because the recipe CSS hasn't been deployed there.
- We're now retargeting to **`cards-grid`** instead. The repo `cards-grid` block already ships brand variants (e.g. `cards-grid-icon-image-card`, `cards-grid-article-cards`, `cards-grid-cta-card`) used elsewhere on these pages (the "More Like This" and find-relief sections).

## What needs investigating before authoring (Execute mode)
- **`blocks/cards-grid/_cards-grid.json`** — model fields per `grid-card` (link, image, line1–line4) and parent `classes` variant options. Confirms how to author image + title + description + CTA per card.
- **`blocks/cards-grid/cards-grid.js`** + **`blocks/cards-grid/linzess/block-config.js`** — which variants have working decoration (earlier review found only `icon-image-card`, `article-cards`, and generic `cta-card` render; others are model-only). Determines whether an existing variant gives an image-left row or whether a new additive `recipe-cards` variant + recipe-scoped CSS is needed.
- **`blocks/cards-grid/cards-grid.css`** + linzess override — existing layouts to reuse for the image-left row.

## Approach

### A. Pick the cards-grid variant
- Inspect the cards-grid variants; choose the one whose decoration yields an **image + title + description + CTA** card. If an existing variant (e.g. `article-cards`) already renders image-left rows, reuse it. Otherwise author a new **additive** `cards-grid recipe-cards` variant (new class + recipe-scoped CSS), not editing shared block code.

### B. Import script (`tools/importer/import-wellness-tips.js`)
- Replace the `cards (recipe-cards)` block with a **`cards-grid (...variant)`** block authored to the `grid-card` row contract (link / image / line1=title / line2=description / line3=CTA, per the model). Keep verbatim titles/descriptions, project-DAM image paths (so optimized URLs resolve), PDF hrefs (`#page=N`, `?logActivity=true`), em-dashes, smart quotes. Keep the intro "Low FODMAP" inline link.

### C. CSS (`styles/linzess/styles.css`)
- Remove the now-unused `.cards.recipe-cards` rules.
- Add recipe-scoped `cards-grid` rules for the image-left stacked rows + live-matched typography (title Lato 24/700 `#422e83`; desc 16/400 `#4d4d4f`; CTA 16/800 purple underline; image radius 0, object-fit fill, ~227px column; mobile image-above-text). Scope to `.cards-grid.recipe-cards`; preserve the file-level `stylelint-disable`; 0 new stylelint warnings.

### D. Regenerate & validate
- Re-bundle the import script (esbuild IIFE, global `CustomImportScript`); re-run `run-bulk-import.js` for the recipes URL only.
- Confirm `.plain.html` now emits `cards-grid` with the grid-card rows; md2jcr round-trip SUCCESS (importer 1.2.x), no double-encoded entities.
- localhost render: image-left rows match live; 0 broken images; intro link + 5 PDF CTAs resolve.
- `npm run lint:css` clean except the 3 pre-existing safety-bar errors.
- Regression: pantry + reference OTC pages render 200, unchanged.

## Risks / notes
- **Variant decoration coverage:** only a subset of cards-grid variants have working JS. If the chosen variant forces unwanted chrome (e.g. `icon-image-card` injects a default "Sign up" CTA), prefer `cta-card`/`article-cards` or an additive `recipe-cards` variant. Confirm during Phase A.
- **Image optimization:** cards-grid (like cards) may run `createOptimizedPicture` and host-strip URLs — the project-DAM image paths already added handle this; confirm images still load.
- **CTA decoration:** a sole link in a paragraph auto-decorates as `.button`; recipe-scoped CSS must neutralize the button chrome to the live underlined text link.
- aemcoder preview parity still requires the CSS + DAM images to be **deployed** (push, approval-gated) — localhost is the verification surface here.

## Checklist
- [ ] Inspect `cards-grid` model (`_cards-grid.json`), `cards-grid.js`, linzess `block-config.js`, and `cards-grid.css` to pick the variant that yields image + title + description + CTA
- [ ] Choose existing cards-grid variant OR define an additive `cards-grid recipe-cards` variant (no shared block edits)
- [ ] Update import script: swap `cards (recipe-cards)` → `cards-grid (variant)`, author grid-card rows (image/title/description/CTA) with project-DAM images + verbatim copy + PDF hrefs; keep intro "Low FODMAP" link
- [ ] Remove retired `.cards.recipe-cards` CSS; add recipe-scoped `.cards-grid.recipe-cards` rules (image-left rows, live typography, CTA text link, image radius 0/fill, mobile stack)
- [ ] Re-bundle import script; re-run bulk import for the recipes URL; confirm `.plain.html` uses `cards-grid`
- [ ] md2jcr round-trip SUCCESS (importer 1.2.x); no double-encoded entities
- [ ] localhost: image-left rows match live; 0 broken images; intro link + 5 PDF CTAs resolve
- [ ] `npm run lint:css` clean (only 3 pre-existing safety-bar errors); 0 new stylelint warnings
- [ ] Regression: pantry + reference OTC pages unchanged; md2jcr unaffected
- [ ] Report variant chosen (reused vs new), changes, and that deployed-preview parity needs a push; hold for approval before any commit/push

> **Note:** Inspecting blocks is read-only; editing the import script/CSS, re-bundling, re-running the import, md2jcr validation, and lint require **Execute mode**. This is the plan only; no commits/pushes without explicit approval.
