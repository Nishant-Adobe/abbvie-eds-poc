# Recipe Cards — Restructure Decorated DOM to Mirror Live AbbVie Class Structure

## Goal
Rebuild the `cards-grid-recipe-cards` decorated DOM so it uses the **live AbbVie node/class structure** (`abbv-image-text` / `abbv-image-content-container` / `abbv-image-text-content-container` / `abbv-image-text-display` / `abbv-rich-text-common`, etc.) instead of the custom `.recipe-card-*` classes — matching the live site's markup, the same way the existing `cards-grid-article-cards` linzess variant already builds `abbv-image-text-v2` structure.

## Live target DOM (from the provided live source)
Each recipe on live is:
```
<div class="abbv-image-text linzess-tips articleItem linzess-5holiday-text">
  <div class="abbv-image-content-container  i-b">
    <picture>…<img></picture>
  </div>
  <div class="abbv-image-text-content-container abbv-image-text-below abbv-image-text-desktop-out-mobile-out">
    <div class="abbv-image-text-content" style="background: rgba(0,0,0,0.0);">
      <div class="abbv-image-text-display abbv-rich-text-common">
        <h2 class="c-linz-dark-purple">{Title}</h2>
        <p>{Description}</p>
        <p><a … target="_blank"><b>Get the recipe</b></a></p>
      </div>
    </div>
  </div>
</div>
```
Wrapped on live in `.container.parbase > .abbv-container.module2` holding the stacked `.image-text.parbase` items. Title is an `<h2 class="c-linz-dark-purple">` (not a `<p><strong>`); CTA is `<a><b>Get the recipe</b></a>`.

## Current decorated DOM (to replace)
`.recipe-card-list > .recipe-card-row > (.recipe-card-image | .recipe-card-body > p.recipe-card-title>strong, p, p.recipe-card-cta>a)` — custom classes, image-left via CSS grid. Renders correctly but does **not** use live class names.

## Approach (Execute mode) — scoped to the `cards-grid-recipe-cards` variant only

### A. Rewrite the decoration builder (`blocks/cards-grid/linzess/cards-grid.js`)
- In `buildLinzessRecipeCardRow`, emit the **live AbbVie structure** instead of `.recipe-card-*`:
  - Outer `div.abbv-image-text.linzess-tips.articleItem.linzess-5holiday-text`
  - Image: `div.abbv-image-content-container.i-b` > `<picture>`/`<img>`
  - Content: `div.abbv-image-text-content-container.abbv-image-text-below.abbv-image-text-desktop-out-mobile-out` > `div.abbv-image-text-content` > `div.abbv-image-text-display.abbv-rich-text-common` containing `<h2 class="c-linz-dark-purple">{title}</h2>`, `<p>{desc}</p>`, `<p><a target="_blank"><b>Get the recipe</b></a></p>`.
- Container: replace `.recipe-card-list` with the live wrapper pattern (e.g. `.abbv-container.module2` holding the stacked items) so the structure mirrors live. Keep it inside the `cards-grid cards-grid-recipe-cards` block (still the same block/variant — no new block).
- Reuse existing helpers (`resolveLinzessArticleCta`, `fixLinzessEncodedBoldInParagraph`, `fixEncodedSupInParagraph`). Keep title via `<h2>`, CTA label "Get the recipe", `target="_blank"`. No edits to other variants.

### B. Retarget the variant CSS (`styles/linzess/styles.css`)
- Replace `.recipe-card-*` selectors with the live class targets under `.cards-grid.cards-grid-recipe-cards` (`.abbv-image-text`, `.abbv-image-content-container`, `.abbv-image-text-content-container`, `.abbv-image-text-display`, `h2.c-linz-dark-purple`, the CTA `a > b`).
- Preserve the already-matched live values: image column ~387px (`38.7rem`) image-left row, gap 40px, align center, image `object-fit: fill` radius 0; title Lato 24/700 `#422e83`; description 16px `#4d4d4f`; CTA 16/800 purple underline; mobile (<600px) image-above-text.
- Watch for collisions with the existing `cards-grid-icon-image-card`/`article-cards` `abbv-image-text-v2` rules in `blocks/cards-grid/linzess/_cards-grid.css` — scope recipe rules under `.cards-grid-recipe-cards` so they don't bleed and aren't overridden. Keep file-level `stylelint-disable`; 0 new stylelint warnings.

### C. Content/import — verify no change needed
- The import script authors grid-card cells (link/image/title/desc/CTA); the DOM transformation is in the decoration JS, so `.plain.html` and md2jcr are unaffected. Re-run import only if cell mapping must change (not expected).

### D. Validate
- localhost render: live class names present (`abbv-image-text`, `abbv-image-text-display`, `h2.c-linz-dark-purple`, CTA `a>b`), image-left rows, image 387px/ratio 1.94, title 24/700 purple, desc 16, CTA 16/800 underline; 0 broken images; intro link + 5 PDF CTAs resolve.
- md2jcr SUCCESS (content unchanged); `npm run lint:css` + `lint:js` clean (only 3 pre-existing safety-bar errors).
- Regression: pantry + reference OTC pages render 200, unchanged; other cards-grid variants (icon-image-card/article-cards) unaffected.

### E. Deploy gap
- Restate: the deployed/aemcoder preview reflects this only after the changed `blocks/cards-grid/linzess/cards-grid.js` + `styles/linzess/styles.css` (+ existing model/JSON, DAM images, content) are committed, pushed, and Code Sync deploys — approval-gated.

## Risks / notes
- **CSS collision:** live `abbv-image-text*` classes are already styled by the icon-image-card/article-cards variants; recipe rules must be tightly scoped under `.cards-grid-recipe-cards` to avoid inheriting card chrome (light-purple bg, button CTA) or being overridden.
- **`abbv-rich-text-common` global styles** may impose unexpected typography; verify computed values after the swap and override within the recipe scope as needed.
- Pure JS+CSS restructure; content/md2jcr untouched. The `<h2>` title (vs current `<p><strong>`) changes heading semantics — matches live, but confirm no doc-outline/regression concern on the page.
- Visual result should be identical to the current (already live-matching) render; this is a class-name/structure alignment, not a visual change.

## Checklist
- [ ] Read `buildLinzessRecipeCardRow` + the article-cards builder to reuse the `abbv-image-text` construction pattern
- [ ] Rewrite the recipe builder to emit live AbbVie DOM (`abbv-image-text` / `abbv-image-content-container.i-b` / `abbv-image-text-content-container.abbv-image-text-below…` / `abbv-image-text-content` / `abbv-image-text-display.abbv-rich-text-common` > `h2.c-linz-dark-purple`, `p` desc, `p > a[target=_blank] > b` CTA)
- [ ] Use the live container wrapper (e.g. `.abbv-container.module2` stacked items) in place of `.recipe-card-list`/`.recipe-card-row`; keep within the `cards-grid-recipe-cards` block
- [ ] Reuse existing CTA/bold/sup helpers; CTA label "Get the recipe", `target="_blank"`; no edits to other variants
- [ ] Retarget `.cards-grid.cards-grid-recipe-cards` CSS from `.recipe-card-*` to the live class selectors; preserve matched values (387px image, gap 40, align center, fill/radius 0, title 24/700 #422e83, desc 16/#4d4d4f, CTA 16/800 underline, mobile stack)
- [ ] Ensure recipe CSS is scoped so it doesn't collide with icon-image-card/article-cards `abbv-image-text-v2` rules; 0 new stylelint warnings
- [ ] Re-bundle import script only if cell mapping changed (likely no content/import change)
- [ ] localhost: confirm live class names render + image-left rows + computed title/desc/CTA/image match live; 0 broken images; intro link + 5 PDF CTAs resolve
- [ ] md2jcr SUCCESS (content unchanged); `npm run lint:css` + `lint:js` clean (only 3 pre-existing safety-bar errors)
- [ ] Regression: pantry + reference OTC pages render 200; icon-image-card/article-cards variants unaffected
- [ ] Restate deploy gap + push set; hold for explicit approval before any commit/push

> **Note:** Reading code is read-only; editing the decoration JS/CSS, re-bundling/import (if needed), live capture, render verification, and lint require **Execute mode**. The deployed/aemcoder preview matching live requires a commit + push + Code Sync deploy, held for explicit approval. This is the plan only.
