# Mapping Out — Tablet/Mobile Per-Pin Overlay on the Tall `-m-` Infographic

## Goal
Make the **Mapping Out a Low FODMAP Diet** block (`#fodmap-map` on `your-map-to-a-low-fodmap-diet`) pixel-match live at **tablet (768) and mobile (390/425)**: serve the tall vertical `-m-` infographic (558×4705 — all 6 pins stacked single-file down a winding road) and position each step's **title + description directly below its pin**, exactly like live. Desktop's wide `-d-` overlay (already matched) must be preserved unchanged. Verify every value by direct measurement; reject false positives.

## Chosen approach (confirmed): author `-m-` source + per-pin overlay
This requires a **content/import change** (the authored `<picture>` currently carries only the `-d-` source), then scoped tablet/mobile overlay CSS.

### A. Import script (`tools/importer/import-wellness-tips.js`) — map image
- In the `low-fodmap-diet` template's map block, change the infographic `img()` into a true `<picture>` with two sources, mirroring live's breakpoints:
  - `(min-width: 985px)` → `-d-` desktop map (`...map-infographic-no-bkg@2x.png`)
  - `(max-width: 984px)` → `-m-` tall map (`...4.2.4-m-your-map-to-a-low-fodmap-diet-map-infographic-no-bkg@2x.png`)
- Both already downloaded to project DAM (`/content/dam/abbvie-eds-poc/linzess/images/`), so `createOptimizedPicture`/host-stripping resolves locally + on delivery.
- Confirm `img()`/the columns builder preserves a multi-source `<picture>` through html2md→md2da (it may flatten to a single `<img>`; if so, author the `<picture>` markup so it survives, or add a transformer step). **Flag if the pipeline strips the extra `<source>`** — decision point during execution.
- Re-bundle (esbuild IIFE, `--global-name=CustomImportScript`), re-run `run-bulk-import.js` for this URL only.

### B. CSS (`styles/linzess/styles.css`, scoped to `.fodmap-map-section`, `@media (width <= 984px)`)
- **Image:** tall `-m-` shows full-width-capped (live image ~311px wide centered); set the map column to the live width and let height follow the 558:4705 ratio.
- **Overlay re-calibration:** the desktop overlay anchors (3×2 zig-zag at 30.5/61.7/93.4%) are wrong for the tall single-column image. Measure live's 6 pin Y-positions on the `-m-` image (as % of image height) and the X (single column, centered ~text below pin), then position each step `<p>` at its pin via absolute % anchors — title + body centered just under each pin.
- Keep step typography matched (title Lato/700 dark-purple, body 16px gray, centered).
- Preserve the periwinkle band + arc; ensure no horizontal scroll at 768/425/390.
- Desktop (≥985px) rules untouched (the existing overlay stays).

### C. Fallback safety
- If the multi-source `<picture>` cannot survive the import pipeline (or per-pin overlay calibration proves fragile on the 4705px-tall image at small widths), fall back to **interleaved text below image** (option 2) for mobile only — still authoring `-m-`, but steps in normal flow in pin order. Flag before switching.

## Properties to measure (live `-m-`, at 768 + 425 + 390)
Active `<picture>` source, image rendered width/height + natural ratio, each of the 6 pins' center Y (% of image height) and the step text's top offset below each pin, step block max-width, title/body font-size/line-height/color, band arc height, section padding, and horizontal-scroll check.

## Risks / notes
- **Pipeline may flatten `<picture>`** to one `<img>` — primary risk; verify the generated `.plain.html` keeps both sources or the `-m-` swap won't happen. (md2jcr/EDS often rebuilds images via `createOptimizedPicture`, which can drop authored `<source>`s.)
- **Overlay drift on a 4705px-tall image:** % anchors must track the image as it scales; re-verify at 768/425/390. Mobile fallback (interleave) is the safety valve.
- **Scope:** all new rules under `.fodmap-map-section` + `@media (width <= 984px)`; never touch desktop rules or sibling pages.
- **Content/import + re-import** means md2jcr must be re-validated (not CSS-only this time).
- Pixel parity bounded by font rendering/anti-aliasing.

## Validation
- localhost tablet (768) + mobile (425, 390): `-m-` image active, each step title+body sits directly below its pin like live; 0 broken images; no horizontal scroll.
- Desktop (1280) regression: `-d-` overlay unchanged (anchors 30.5/61.7/93.4%, 998px image).
- md2jcr round-trip SUCCESS (content changed); section `customClass` intact.
- `npm run lint:css` clean except the 3 known safety-bar errors; ESLint clean on the import script.
- Regression: 4 sibling wellness-tips pages render 200 at all viewports, unchanged.
- Report a per-breakpoint scorecard; hold for explicit approval before any commit/push.

> Execution requires **Execute mode** — this plan makes no file changes yet. This pass involves a content/import change (authoring the `-m-` source + re-import) plus scoped `@media` overlay CSS; md2jcr will be re-validated.

## Checklist
- [ ] Capture live `-m-` geometry at 768 + 425 + 390: active source, image width/height/ratio, 6 pin Y% + step-text offset below each pin, step max-width, title/body type, band arc, padding
- [ ] Edit import script: map infographic → `<picture>` with `-d-` (≥985px) + `-m-` (≤984px) sources from project DAM
- [ ] Re-bundle + re-import the recipes URL only; **verify the generated `.plain.html` keeps BOTH `<source>`s** (flag if pipeline flattens to single `<img>`)
- [ ] Add scoped `@media (width <= 984px)` CSS: tall `-m-` image sizing + per-pin overlay anchors (title+body below each pin), matched typography
- [ ] If `<picture>` flattens or overlay is fragile at 390 → fall back to interleaved text-below-image (option 2), flag the change
- [ ] Verify tablet/mobile: each step text below its pin like live; 0 broken images; no horizontal scroll
- [ ] Desktop (1280) regression: `-d-` overlay + anchors unchanged
- [ ] md2jcr round-trip SUCCESS; section `customClass` intact; ESLint clean
- [ ] `npm run lint:css` clean (only 3 pre-existing safety-bar errors)
- [ ] Regression: 4 sibling wellness-tips pages render 200 at all viewports, unchanged
- [ ] Report per-breakpoint scorecard; hold for explicit approval before any commit/push
