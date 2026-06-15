# Find-Relief Image-Text — md2jcr Row-Count Fix (Import Script)

## Goal
Fix the md2jcr publish failures on all three find-relief pages for the `image-text` blocks (`find-relief-gut-check`, `find-relief-savings-tout`) by correcting the **import script** so it emits **10 body rows** (the deployed md2jcr requirement), then re-run the import to regenerate the `.plain.html` files. No hand-editing of content.

## Root cause (confirmed)
- **Model** `blocks/image-text/_image-text.json` has a real `classes_imageSize` **select** field (drives `image-text-image-large/medium/small`). It is NOT the literal `classes` multiselect.
- **Deployed md2jcr** (what publish runs, and what threw these errors) uses the OLD FieldGroup filter `.filter(f => f.name !== 'classes')` — only the exact `classes` field is excluded. So `classes_imageSize` forms its **own group → its own row**. Total required = **10 rows**.
- **All three current blocks have only 9 rows** — the leading empty `classes_imageSize` row is missing; the image sits in row 1 instead of row 2. Every subsequent field maps one position early → "content isn't mapping to the model correctly."
- This is the documented version-skew trap (local md2jcr 1.4.1 wants 9 and would give a false PASS; deployed wants 10 and is authoritative). Confirmed against my prior session note for this exact block.

## Required 10-row order (image-text)
1. **empty** `classes_imageSize` row ← **currently missing**
2. image (`<picture>`)
3. mobileImage (empty unless swap)
4. content (richtext)
5. ctaLabel
6. ctaHref
7. ctaTarget
8. modalId (empty)
9. anchorId (empty)
10. analyticsId (empty)

## Fix approach (import script — user-selected)
1. **Locate the generator.** The `columns.js` parser emits `columns` blocks, not these field-per-row `image-text` blocks, so the image-text builder is elsewhere — most likely `tools/importer/transformers/linzess-sections.js` or `linzess-cleanup.js` (or a helper in `import-find-relief.js`). Grep for where the `image-text` cell array / `find-relief-gut-check` / `find-relief-savings-tout` classes are assembled.
2. **Add the leading empty row** to the image-text cell array in that generator — prepend one empty cell/row representing `classes_imageSize` so output is 10 rows, image in row 2. Apply to both gut-check and savings-tout code paths (and any shared image-text builder so it's a single fix point if possible).
3. **Rebuild the bundle** if the runtime uses `import-find-relief.bundle.js` (the `.js` source and the `.bundle.js` must stay in sync — confirm which the runner executes).
4. **Re-run the import** via the project's bundled import script + `run-bulk-import.js` (per project rules — never hand-write content) to regenerate index, how-to-take, and talk-to-a-doctor `.plain.html`.

## Validation (mirror the deployed service — don't trust raw local round-trip)
- Per the documented method: to validate locally, temporarily patch `node_modules/@adobe/helix-md2jcr/.../FieldGroup.js` from `.filter(f => !isClassesField(f.name))` to `.filter(f => f.name !== 'classes')`, run the html2md→md2jcr round-trip, then **restore** the file. Under the deployed-equivalent filter, 10 rows must pass with fields aligned.
- Confirm each regenerated block has exactly 10 `<div><div>…</div></div>` body rows with the empty `classes_imageSize` row first and the `<picture>` in row 2.

## Constraints & guardrails
- **No direct `.plain.html` edits** — fix the generator and re-run import (user's explicit choice).
- Keep `classes_imageSize` in the model — it's functional; do NOT "fix" by deleting the field.
- Don't break the local-1.4.1 vs deployed skew the other way — deployed (10 rows) is source of truth.
- Re-running import must not regress other already-correct blocks on these pages (dosing, tabs, cards, section-nav, hero) — diff the regenerated output.

## Checklist
- [ ] Grep `tools/importer/` (transformers + `import-find-relief.js` + bundle) to pinpoint the exact code that emits the `image-text` `find-relief-gut-check` / `find-relief-savings-tout` blocks and their row/cell array.
- [ ] Confirm whether the runner executes `import-find-relief.js` or `import-find-relief.bundle.js` (fix the source, rebuild the bundle if needed).
- [ ] In the generator, prepend the empty `classes_imageSize` row so each image-text block emits **10 rows** (image becomes row 2); cover both gut-check and savings-tout paths.
- [ ] Re-run the bundled import to regenerate all 3 `.plain.html` files (index, how-to-take, talk-to-a-doctor).
- [ ] Verify each regenerated image-text block = 10 body rows, empty row first, `<picture>` in row 2, content/CTA/anchor fields shifted to rows 4–10.
- [ ] Validate with the deployed-equivalent md2jcr filter (temp-patch FieldGroup.js → round-trip → restore): all 3 blocks map cleanly, no error.
- [ ] Diff regenerated pages against current to confirm no other block regressed.
- [ ] Confirm the rendered preview still shows the savings-tout/gut-check correctly (image-top stack at mobile, 2-col at desktop) — row addition is empty so visual is unchanged.
- [ ] Report: generator file/line changed, before/after row counts, validation result per page.

## Notes
- **Execution requires Execute mode.** This artifact is the plan only.
- The fix is additive (one empty leading row in the generator) — it changes neither the model nor the visual layout, only restores field alignment for the deployed md2jcr.
- If the generator is shared by other image-text instances on other pages/brands, the same +1-row fix benefits them too; check for unintended duplicates before re-running a broad import.
