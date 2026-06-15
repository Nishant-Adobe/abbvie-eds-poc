# Recipe Cards (cards-grid-recipe-cards) — Critique & Live Pixel-Match

## Critique: current variant vs. the live screenshot
The selected block is `.cards-grid.cards-grid-recipe-cards` on the recipes page. Reviewing the current scoped CSS against the live design:

| Aspect | Current CSS | Live screenshot | Verdict |
|---|---|---|---|
| Layout | image-left + text-right rows (`grid-template-columns: 38.7rem 1fr` ≥600px), single-column stack | image-left rows, ~387px landscape image | ✅ matches |
| Row gap | `40px` (`--spacing-40`) between rows; `40px` image↔text gap | rows visibly separated; ~40px image↔text | ✅ matches |
| Vertical alignment | `align-items: center` | text vertically centered against image | ✅ matches |
| Image | `object-fit: fill`, radius 0, 387px col | landscape thumbnail, square corners | ✅ matches |
| Title | Lato 24/700, `text-transform: none`, `#422e83`, margin-bottom 10px | dark-purple mixed-case bold | ✅ matches |
| Description | Lato 16/400 `#4d4d4f`, margin-bottom 20px | grey body | ✅ matches |
| "Get the recipe" | Lato 16/800, `#422e83`, underline, no button chrome | bold purple underlined text link | ✅ matches |

**Conclusion:** the variant CSS already encodes the live design, and the last localhost verification matched (387px image col, 40px gap, center align, Lato 24/700 title, 800/underline CTA, 0 broken images). The live screenshot you provided is consistent with that. So there is **no obvious remaining CSS defect on localhost** — this needs a fresh side-by-side pixel re-verification to either confirm parity or surface a residual delta.

> **Key caveat (likely the real issue):** if you're judging against the **aemcoder/deployed preview** (`preview-aemcoder.adobe.io`), it will still look wrong because the variant's JS branch, model option, rebuilt `component-*.json`, scoped CSS, and the migrated DAM images **haven't been pushed/deployed**. No further local edit changes the deployed preview until a commit + push + Code Sync deploy (approval-gated, no credentials here).

## Goal
Run a fresh pixel-by-pixel re-critique of the block on **localhost** against the live screenshot; fix any genuine residual delta (scoped to the variant only); and restate the deploy gap if the mismatch is on the deployed preview.

## Approach (Execute mode)

### A. Side-by-side pixel re-verification (localhost vs live)
- Capture live computed values for one recipe row (already have: image 387×199 ratio 1.94, row gap 40, align center, title Lato 24/700 `#422e83`, desc 16/400 `#4d4d4f`, CTA 16/800 underline) and re-confirm against localhost computed values + a screenshot.
- Check at desktop (≥600px) and mobile (<600px) breakpoints for: image column width/ratio, row gap, image↔text gap, vertical alignment, title/desc/CTA px, and the inter-row spacing.

### B. Fix only genuine deltas (scoped to `.cards-grid.cards-grid-recipe-cards`)
- If any measured delta exists (e.g. image height/ratio, row gap, text vertical position, CTA spacing), nudge the variant CSS to the live value. No edits to other cards-grid variants or shared block code; preserve the file-level `stylelint-disable`; 0 new stylelint warnings.
- If localhost already matches at both breakpoints → no code change; report parity.

### C. Verify
- localhost render matches live at desktop + mobile; 0 broken images; intro "Low FODMAP" link + 5 PDF CTAs resolve.
- md2jcr unaffected (CSS-only) — re-confirm SUCCESS if touched.
- `npm run lint:css` clean except the 3 pre-existing safety-bar errors; 0 new warnings.
- Regression: pantry + reference OTC pages render 200, unchanged.

### D. Deploy-gap restatement
- If the mismatch is on the aemcoder/deployed preview, report the exact push set (`blocks/cards-grid/_cards-grid.json`, `blocks/cards-grid/linzess/cards-grid.js`, `component-models.json`, `component-definition.json`, `styles/linzess/styles.css`, migrated recipe DAM images, content `.plain.html`) and that it requires commit + push + Code Sync deploy — hold for explicit approval.

## Risks / notes
- Most likely there is no localhost defect; the perceived mismatch is the deployed-preview deploy gap.
- Pixel parity bounded by font rendering / anti-aliasing across hosts and by Save-Data/throttling in the DevTools device bar.
- The transient "imgWidth 998" reading seen earlier is a pre-layout measurement artifact; the resolved grid column is 387px — verify after full load.

## Checklist
- [ ] Confirm where the mismatch is observed (localhost vs aemcoder/deployed) — if deployed, it's the deploy gap, not a local fix
- [ ] Re-capture live computed geometry/typography for a recipe row (image ratio, gaps, align, title/desc/CTA px)
- [ ] Re-capture localhost computed values + screenshot at desktop (≥600px) and mobile (<600px)
- [ ] Diff localhost vs live; list any genuine deltas (image size/ratio, gaps, alignment, typography, inter-row spacing)
- [ ] If deltas exist: nudge `.cards-grid.cards-grid-recipe-cards` CSS to live values (scoped only; 0 new stylelint warnings)
- [ ] If no delta: report localhost parity; no code change
- [ ] Verify localhost matches live at both breakpoints; 0 broken images; intro link + 5 PDF CTAs resolve
- [ ] `npm run lint:css` clean (only 3 pre-existing safety-bar errors); md2jcr unaffected (CSS-only)
- [ ] Regression: pantry + reference OTC pages render 200, unchanged
- [ ] Restate deploy gap + exact push set if the mismatch is on the deployed preview; hold for approval before any commit/push

> **Note:** Live capture, localhost verification, any CSS edit, and lint require **Execute mode**. The aemcoder/deployed preview matching live requires a commit + push + Code Sync deploy, held for explicit approval. This is the plan only.
