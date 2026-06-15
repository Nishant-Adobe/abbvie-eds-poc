# Mapping Out a Low FODMAP Diet — Pixel-Perfect Fine-Tuning Plan

## Status
The overlay structure already matches live: the full-width illustrated map (car, winding road, 6 purple pins, trees) with the 6 step texts overlaid at the pins in a 3-row × 2-col zig-zag. Earlier measurements confirmed the step anchors match live exactly (top 30.5/61.7/93.4%, center-X 28%/70.7%, width 40.5%, titles Lato 24px/700 dark-purple). This pass is **fine-tuning only** — close the small residual deltas between my render and the live snapshot. Scope stays limited to the selected block (`main > .section.fodmap-map-section .columns.fodmap-map`); CSS-only, no `.plain.html` / importer / md2jcr change unless a delta requires re-import.

## Candidate deltas to verify against live (then fix only the real ones)
Measured directly on live vs. localhost at desktop (≥985px), tablet (768px), mobile (390px) — verifying each before changing anything (per the no-false-positive discipline):

1. **Band top arc / shape** — live class is `background-light-purple-arc background-arc`: the periwinkle band has a shallow **curved top edge** (visible in the snapshot sweeping up at the top) and is **full-bleed** edge-to-edge. Confirm whether my `.fodmap-map-section` renders a flat top vs. the live curved arc, and whether it's full-width; add a scoped arc/full-bleed treatment if missing.
2. **Step body font-size** — live body copy looks small in the snapshot; confirm the exact px (my current is 16px). Adjust only if live differs.
3. **Title → body vertical gap** — verify the gap between each step title and its body matches live (currently `margin-bottom: 10px` on the title).
4. **Step block max-width / line wrapping** — confirm each step block wraps to the same number of lines as live (e.g. "Replace High FODMAPs with Low FODMAPs for 2–6 weeks…"); tune the `width: 40.5%` / add a `max-width` if wrapping differs.
5. **Text vertical position relative to pin** — confirm each text block sits the same distance *below* its pin as live (fine-nudge the `top%` anchors by a point or two if the text rides high/low on the pin).
6. **Image width cap at very wide viewports** — the provided snapshot is ultra-wide; confirm the map image is capped/centered (section `max-width` ~99.8rem) and not stretching, matching the centered scene in the snapshot.
7. **Section vertical padding** — confirm the band's top/bottom padding around the heading and Sources matches live spacing.

## Approach (Execute mode)
- Re-measure live + localhost computed values for items 1–7; build a precise delta list.
- Apply only the genuine deltas in `styles/linzess/styles.css`, all scoped under `main > .section.otc-intro-section.fodmap-map-section` (and the `.columns.fodmap-map` overlay rules already in place). Keep the `:has()` band scoping, the desktop overlay anchors, and the `<985px` text-below fallback intact.
- If the band arc requires a shape not expressible by background alone, reuse the existing brand arc technique (the hero/other sections' `background-arc` pattern) scoped to this section — no global change.
- Leave content/JS/importer untouched (the per-step `<p>` structure is already correct); md2jcr unaffected.

## Risks / notes
- **Overlay anchor drift:** any `top%`/`left%` nudge must be re-checked at desktop + the breakpoint where it switches to the text-below fallback (≥985px overlay only).
- **Arc full-bleed:** a full-bleed curved band must not introduce horizontal scroll or bleed into the adjacent white sections — verify section boundaries and the periwinkle-to-white transition above/below.
- Pixel parity is bounded by font rendering/anti-aliasing across hosts; match to live computed values, not just the screenshot.
- Mobile uses the wide `-d-` map scaled down (the authored picture carries only `-d-`); the text-below fallback stays — don't regress it.

## Validation
- localhost desktop screenshot matches the live snapshot: curved full-bleed band, pins, texts at pins, correct body size/wrapping, spacing.
- Verify desktop (≥985), tablet (768), mobile (390): overlay alignment, band arc, 0 broken images, Sources below.
- `npm run lint:css` clean except the 3 known safety-bar errors; md2jcr unaffected (CSS-only) — re-confirm if any content change is needed.
- Regression: the 4 sibling wellness-tips pages render 200, unchanged (`.fodmap-map-section` is unique to this page).
- Hold for explicit approval before any commit/push.

> Execution requires **Execute mode** — this plan makes no file changes yet. Expected change is CSS-only in `styles/linzess/styles.css`, scoped to `.fodmap-map-section`.

## Checklist
- [ ] Measure live vs localhost (desktop/tablet/mobile): band top arc + full-bleed, body font-size, title→body gap, step block width/wrapping, text-to-pin offset, image width cap, section padding
- [ ] Build the verified delta list (only real differences, no false positives)
- [ ] Add scoped band arc / full-bleed treatment to `.fodmap-map-section` if live has the curved top and mine doesn't
- [ ] Tune step body font-size / title→body gap to live values (if different)
- [ ] Tune step block width/max-width so line-wrapping matches live
- [ ] Fine-nudge overlay `top%`/`left%` anchors so text sits at the pins exactly like live (if off)
- [ ] Confirm image is capped/centered at wide viewports (section max-width) matching the snapshot
- [ ] Keep the `<985px` text-below fallback and the `:has()` band scoping intact
- [ ] Verify localhost desktop/tablet/mobile vs live; 0 broken images; Sources below
- [ ] `npm run lint:css` clean (only 3 pre-existing safety-bar errors); md2jcr unaffected
- [ ] Regression-check the 4 sibling wellness-tips pages render 200, unchanged
- [ ] Report results and hold for explicit approval before any commit/push
