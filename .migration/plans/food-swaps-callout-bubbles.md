# Food Swaps — Restore Callout Bubbles & Match Dimensions

## Critique vs live (from the uploaded reference)
The selected `columns.food-swaps` block is **missing the colored callout bubbles** that live shows on 5 of the 10 food items:

| Item | Bubble color | Bubble text |
|---|---|---|
| Yogurt (Try These #1) | teal | "Yogurt contains good bacteria your gut loves." |
| Kiwi (Try These #2) | teal | "Kiwi acts as a natural laxative." |
| Brown rice (Try These #5) | teal | "Brown rice provides 4 grams of fiber per cup." |
| Honey (When Craving #3) | dark-purple | "Honey is high in fructose, which can cause flare-ups." |
| Chips (When Craving #4) | dark-purple | "Fatty foods slow digestion and can bring on the bloat." |

Earlier in the migration I assumed the callout bubble + text were **baked into the `-callout@2x.png` images**, and preserved the wording only in `alt` text. The uploaded reference + current render show the bubbles are **NOT** visible — so either the PNGs we downloaded don't contain the baked-in bubble, or live renders the bubble as a separate overlay. Result: the callout copy is invisible to users. This must be restored so the text shows like live.

Also in scope: confirm the panel/image **dimensions** match live (panels 422px, images 254px were just fixed — re-verify after the callout change doesn't disturb them).

## Investigation needed first (Execute mode, read-only checks)
1. **Inspect the downloaded `-callout` PNGs** (`content/content/dam/abbvie-eds-poc/linzess/images/4.2.2-d-...-yogurt-callout@2x.png` etc.) — do they visually contain the colored bubble + text, or just the food illustration? (Open/measure intrinsic content.)
2. **Inspect live** — is the bubble part of the image, an absolutely-positioned text element, or a separate small badge image? Measure bubble position, size, color (teal vs dark-purple), font size/weight/color, and offset relative to each food circle.
3. Decide implementation path based on findings (see Approach).

## Approach (decision branches)
**If the live bubbles are baked into different `-callout` PNGs than what we have** → re-download the correct callout PNGs (the ones with the bubble baked in) into project DAM; the existing `<img>` markup then shows them with no content change. Simplest if such assets exist.

**If live renders the bubble as an HTML/text overlay** (most likely, given they look like live text) → restore the callout copy into the content as an additional element per item (e.g. a `<span class="bubble">` or extra `<p>`), then position it as an absolute teal/dark-purple rounded badge over the top corner of the food circle via scoped CSS. This needs a **content/import change** (the importer currently drops the callout text) + re-bundle + re-import, plus scoped CSS for the two bubble colors (teal for the "Try These" column, dark-purple for "When Craving These").

**Dimensions:** keep the just-fixed block at 902px / two 422px panels / 254px food images; ensure the bubble overlay doesn't change image sizing or cause overflow.

## Scope & guardrails
- Changes limited to the selected `food-swaps` block: `tools/importer/import-wellness-tips.js` (food-swap builder, if content change needed), scoped CSS under `.food-swaps-section .columns.food-swaps`, and possibly project-DAM callout assets.
- If a content change is made, re-run md2jcr validation (not CSS-only).
- Preserve verbatim callout wording (pharma-content fidelity); teal vs dark-purple must match the correct column.
- No other page/section touched; mobile (single-column) must keep bubbles legible and avoid overflow.

## Risks / notes
- **md2jcr survives only semantic tags/classes** — if bubbles need text, the importer must emit an element that round-trips (the `bubble-text` class was stripped before; use a tag like `<em>`/`<sub>` or structural position, as done for other fixed labels).
- Bubble absolute-positioning over a circular PNG needs per-item anchors; calibrate to live and verify desktop + mobile.
- Re-import regenerates the `.plain.html` — confirm the rest of the food-swap block (labels, headers, panels) is unchanged.

## Validation
- All 5 callout bubbles render with correct text, color (teal/dark-purple), and position matching live; the other 5 items have no bubble.
- Panels 422px, images 254px, block 902px (desktop); mobile single-column, bubbles legible, no horizontal scroll.
- `npm run lint:css` clean except the 3 pre-existing safety-bar errors; ESLint clean if JS changed; md2jcr SUCCESS if content changed.
- Regression: 4 sibling wellness-tips pages render 200, unchanged.
- Hold for explicit approval before commit/push.

> Execution requires **Execute mode**. This pass likely involves a content/import change (restoring callout copy) + scoped CSS; the exact path is confirmed by the read-only investigation in step 1–2 first.

## Checklist
- [ ] Inspect downloaded `-callout` PNGs — determine if the colored bubble + text is baked in or absent
- [ ] Measure live bubbles: color (teal vs dark-purple), text size/weight/color, size, and position offset over each food circle
- [ ] Decide path: re-download baked-in callout PNGs **OR** restore callout text as an HTML overlay badge
- [ ] If content path: add callout copy to the food-swap builder in `import-wellness-tips.js` (md2jcr-safe markup), re-bundle, re-import this URL only
- [ ] Add scoped CSS: teal bubble for "Try These" column, dark-purple for "When Craving These", positioned over the food circle's top corner
- [ ] Verify all 5 bubbles match live (text, color, position); other 5 items have none
- [ ] Re-confirm dimensions: panels 422px, images 254px, block 902px (desktop); mobile single-column legible, no overflow
- [ ] Run `npm run lint:css` (+ ESLint/md2jcr if content changed); expect only the 3 known safety-bar errors
- [ ] Regression-check 4 sibling wellness-tips pages render 200, unchanged
- [ ] Report results and hold for explicit approval before commit/push
