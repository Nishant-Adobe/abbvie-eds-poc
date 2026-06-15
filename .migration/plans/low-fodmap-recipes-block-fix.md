I'll inspect the current recipe-cards CSS and the columns block structure to build an accurate plan for matching the live stacked-row layout.# Recipe Cards — Match Live Stacked-Row Layout

## What the live DOM shows (vs. current build)

From the selected live DOM + screenshot, the recipes section on `5-holiday-low-fodmap-recipes` is **NOT a 3-up card grid**. It is a **vertical stack of full-width rows**, one per recipe, each laid out as **image-left + text-right**:

- **Image:** square thumbnail on the left (~227px), natural ratio, `desktop = -d-` / `mobile = -m-` source.
- **Text (right):** purple `h2`-style title → description paragraph → bold purple **"Get the recipe"** link (opens a PDF in a new tab).
- Recipes stack vertically (single column); on mobile the image sits above the text.

Two fidelity gaps in the current migrated page:
1. **Layout mismatch** — current `recipe-cards` renders a 3-up card grid (image-on-top). Live is stacked image-left rows.
2. **Intro link dropped** — live intro reads "These **Low FODMAP** recipes are soon-to-be favorites…" where **Low FODMAP** links to `/starting-linzess/wellness-tips/your-map-to-a-low-fodmap-diet`. The current build flattened this to plain text.

## Root cause

In the current import script each recipe is authored as **one combined cell** (picture + title + desc + link together), so `columns.js` tags the whole cell as `.columns-item-image`. To get a true image-left/text-right row (like the reference `what-is-linzess` 2-col variant), each recipe must be authored as **two cells** per item: an image cell and a content cell. The block must then render **one item per row** (stacked), each item a 2-column row.

## Scope (selected element only)

`content/linzess/starting-linzess/wellness-tips/5-holiday-low-fodmap-recipes.plain.html` — the `otc-intro-section` (intro + `columns.recipe-cards`). No other sections, pages, or blocks change. Pantry page untouched.

## Approach

### A. Import script (`tools/importer/import-wellness-tips.js`)
- **Intro paragraph:** restore the inline link — `These <a href="/linzess/starting-linzess/wellness-tips/your-map-to-a-low-fodmap-diet">Low FODMAP</a> recipes are soon-to-be favorites for you to share and enjoy.` (brand-prefixed `/linzess/...` path to match the other in-page links; em-dash preserved).
- **Recipe items:** author each recipe as a columns-item with **two cells** — cell 1 = `<picture>` image, cell 2 = content (`<p><strong>Title</strong></p>`, `<p>desc</p>`, `<p><a>Get the recipe</a></p>`). Keep the existing `recipe-cards` variant class and the verbatim copy, PDF hrefs (`#page=N`, preserving `?logActivity=true` where present), and `target="_blank"`.

### B. CSS (`styles/linzess/styles.css`, `recipe-cards` block only)
- `.columns.recipe-cards` → **single column** (`grid-template-columns: 1fr`), vertical gap between rows; remove the 2-up/3-up breakpoint grids.
- Each `.columns-item` → **2-col row**: image-left (fixed ~`22.7rem`/`auto`), content-right; `align-items: center`; gap.
- Image: natural ratio, rounded corners, capped width; no on-top stacking on desktop.
- Title (purple, `h2`-scale), description (grey body), **"Get the recipe"** bold purple link — reuse existing recipe-cards typography.
- **Mobile (`< 600px`):** stack image above text (single column within the item).
- Keep the file-level `stylelint-disable` for the two inherited stylistic rules; ensure the new rules add **0** new `no-descending-specificity` warnings.

### C. Regenerate & validate (Execute mode)
- Re-bundle the import script (esbuild IIFE, global `CustomImportScript`) and re-run `run-bulk-import.js` for the recipes URL only.
- Confirm the generated `.plain.html` shows each recipe as image-cell + content-cell, and the intro link is present.
- md2jcr round-trip (importer 1.2.x) → SUCCESS, no double-encoded entities.
- Preview render: stacked image-left rows, intro link works, "Get the recipe" links resolve to the correct PDFs.
- `npm run lint:css` clean except the 3 pre-existing safety-bar errors; recipe-cards block adds 0 new stylelint warnings.
- Pharma fidelity: copy verbatim, ISI/job code/safety-bar untouched.

## Checklist

- [ ] Update intro paragraph in the import script to restore the inline **Low FODMAP** link (`/linzess/starting-linzess/wellness-tips/your-map-to-a-low-fodmap-diet`), em-dash preserved
- [ ] Change recipe item authoring to two cells (image cell + content cell) per recipe, keeping verbatim titles/descriptions, PDF hrefs, and `target="_blank"`
- [ ] Rewrite `.columns.recipe-cards` CSS: single-column stacked rows; each item image-left + content-right (2-col), centered; remove 2-up/3-up grids
- [ ] Add mobile rule (`< 600px`): image stacks above text within each row
- [ ] Re-bundle import script; re-run bulk import for the recipes URL; confirm regenerated plain.html structure + intro link
- [ ] md2jcr round-trip SUCCESS (importer 1.2.x), no double-encoded entities
- [ ] Preview: stacked image-left rows match live; intro link + 5 "Get the recipe" PDF links resolve
- [ ] `npm run lint:css` clean (only 3 pre-existing safety-bar errors); recipe-cards adds 0 new stylelint warnings
- [ ] Regression: pantry page + reference OTC page render unchanged; ISI/safety-bar/job code intact
- [ ] Report changes; hold for approval before any commit/push

> **Note:** Editing the import script/CSS, re-bundling, re-running the import, md2jcr validation, and preview all require **Execute mode**. This is the plan only; no commits/pushes without explicit approval.
