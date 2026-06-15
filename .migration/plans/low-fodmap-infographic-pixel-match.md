# Mapping Out a Low FODMAP Diet — Pixel-Match Infographic Overlay Plan

## Critique: current block vs. live (reference DOM)
The selected block (`main > .section.fodmap-map-section .columns.fodmap-map`) currently renders as a **2-column split**: a narrow vertical infographic (left, ~300px) + the 6 step texts stacked in a single right column. The **live** design is fundamentally different:

- The whole section is a **single full-width illustrated scene** — a periwinkle band (`#d9d7f9`) with a red car, a winding white road, **6 dark-purple map pins**, and decorative trees/plants — baked into one PNG.
- The **6 step texts are positioned over/around the pins** in a **zig-zag 2-column path**: row 1 = The FODMAP Swap (left) / Read the Labels (right); row 2 = Know Your Portions (left) / Be Prepared (right); row 3 = Be Patient (left) / Identify Your Triggers (right). Each step = a **dark-purple title** + a **small gray body** sitting *below* its pin.
- Step title typography: dark-purple, centered, ~bold; body: gray, centered, ~12–14px.
- **Sources** footnote sits below the whole scene (already correct in the migration).

So the current block diverges in: image size (narrow vs full-width scene), text placement (stacked column vs overlaid at pins), and text alignment (left vs centered). **Chosen fix: overlay the 6 step texts on the full-width map image** (per your selection).

## Approach (chosen: "Overlay text on full map")
Keep the existing `columns (fodmap-map)` block and its authored content (image cell + 6 step paragraphs) — **no content/structure change to the `.plain.html`, no re-import, no new block type.** This is a **CSS-only** change scoped to `.fodmap-map-section`.

### Image
- Render the infographic at **full section width** (the whole car/road/pins scene) instead of the 30rem left column. Desktop uses the wide `-d-` image; tablet/mobile swap to the tall vertical `-m-` image via the already-authored `<picture>` sources (the live page does the same: `-d-` ≥985px, `-m-` below).
- The `.columns.fodmap-map` becomes a single positioned container (`position: relative`); the image cell spans full width as the backdrop; the content cell is overlaid (`position: absolute; inset: 0`).

### Text overlay (desktop ≥985px)
- Position the 6 step paragraphs absolutely over the image at calibrated **percentage** coordinates matching each pin (3 rows × 2 columns zig-zag), so they track the image as it scales. Each step block: centered text, fixed max-width (~16–18rem), dark-purple title + gray body.
- Calibrate the 6 (top%, left%) anchor pairs by measuring the live pin positions relative to the image box (via the live page geometry already captured this session), then verify against the live screenshot.

### Tablet / mobile (<985px)
- The `-m-` image is a **tall vertical** path (558×4705) with the pins stacked single-file. Re-calibrate the 6 overlay positions for that vertical layout (single column, 6 stacked rows), or — if overlay calibration on the very tall image proves fragile at small widths — fall back to the image-with-text-below stacking for mobile only (still no structure change). Decide during execution by measuring the live mobile pin positions.

### Guardrails
- Scope every rule under `main > .section.fodmap-map-section` (and the `.columns.fodmap-map` block) so no other page/section is touched. The periwinkle band, Sources footnote, and section heading already match live and stay unchanged.
- Neutralize the global `.abbvie-container div { grid-column }` as already done for this section.
- Keep the `:first-of-type`/`--font-size-article-heading, 40px` heading guards intact.

## Risks / notes
- **Overlay calibration drift:** absolute % positions are tuned to the image's intrinsic aspect ratio. They hold while the image scales proportionally, but any letterboxing or aspect change can shift text off the pins — must verify at desktop, tablet, and mobile and adjust.
- **Text overflow on small widths:** step bodies are fixed copy; at narrow widths the overlay boxes may crowd. The mobile fallback (text-below) is the safety valve if overlay becomes unreadable.
- **No live per-step icons needed** — the pins/icons are baked into the PNG; we only overlay the text. (This is why the "overlay" approach is lower-effort than rebuilding pins in HTML.)
- Pixel parity is bounded by font rendering across hosts; match to the live screenshot + computed step typography.

## Validation
- Re-render localhost; confirm the full map scene shows with all 6 step texts sitting at their pins in the live zig-zag, centered, dark-purple titles + gray bodies; Sources below.
- Verify desktop (≥985px), tablet (768px), mobile (390px): overlay alignment, image swap (`-d-`/`-m-`), no text overflow, 0 broken images.
- `npm run lint:css` clean except the 3 known safety-bar errors; md2jcr unaffected (CSS-only, content unchanged).
- Regression: the 4 sibling wellness-tips pages render 200, unchanged (scoping verified — no other page has `.fodmap-map-section`).
- Hold for explicit approval before any commit/push.

> Execution requires **Execute mode** — this plan performs no file changes yet. The fix is CSS-only in `styles/linzess/styles.css`, scoped to `.fodmap-map-section`; the `.plain.html` and importer are unchanged.

## Checklist
- [ ] Measure live pin coordinates (desktop `-d-` image): capture the 6 (top%, left%) anchors relative to the image box for the zig-zag overlay
- [ ] Capture live step typography (title color/size/weight, body size/color, max-width per step block) to match exactly
- [ ] Make `.fodmap-map-section .columns.fodmap-map` a full-width positioned container; image cell = full-width backdrop, content cell = absolute overlay
- [ ] Position the 6 step paragraphs at the calibrated desktop anchors (3 rows × 2 cols zig-zag), centered, dark-purple titles + gray bodies
- [ ] Re-calibrate overlay for tablet/mobile on the tall `-m-` image (single-column stack), or apply the text-below fallback for mobile if overlay is fragile
- [ ] Confirm the authored `<picture>` swaps `-d-`/`-m-` at the live breakpoints; no `.plain.html` or importer change
- [ ] Verify localhost desktop/tablet/mobile: text sits on pins, image scene full-width, 0 broken images, Sources below
- [ ] `npm run lint:css` clean (only the 3 pre-existing safety-bar errors); md2jcr unaffected (CSS-only)
- [ ] Regression: 4 sibling wellness-tips pages render 200, unchanged
- [ ] Report results and hold for explicit approval before any commit/push
