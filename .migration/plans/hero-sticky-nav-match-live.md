# Hero & Sticky Section-Nav — Match Live Site + DAM Image Download (find-relief)

## Goal

Make the **hero** and **sticky section-nav** blocks on the migrated page
`preview-aemcoder.adobe.io/content/linzess/dinesh-linzess/find-relief`
visually match the live site (`linzess.com/find-relief`), using the
already-correct EDS reference page (`.../linzess/why-linzess/`) as the styling
source of truth — AND **download every viewport variant of the page's images
into the project DAM** so the hero (and other) images actually render on
preview instead of 404ing.

## Two parts to this task

1. **Section/style fix** — hero renders boxed/narrow (missing `find-relief-hero` section style); sticky nav not overlapping hero. (Carried over from prior analysis.)
2. **DAM image download** — all images are currently broken on preview because the rewritten paths (`/content/dam/abbvie-eds-poc/...`) have no assets behind them. Download each image at **all viewport variants** (desktop / tablet / mobile) from the live site and place them at the rewritten DAM paths.

## Image inventory to download (from live find-relief)

| Asset | Live source | Viewport variants | Target DAM path |
|---|---|---|---|
| Hero background | `FIndRelief-Hero-Desktop.jpg`, `FIndRelief-Hero-Mobile.jpg` | desktop (≥985px) + mobile/tablet | `/content/dam/abbvie-eds-poc/linzess/images/` |
| Gut Check tout | `FindRelief-GutCheck-Tout-Desktop.png`, `-Mobile.png` | desktop + mobile | same |
| Savings tout | `SavingsCard-Tout-Asterisk_Desktop.png`, `-Mobile.png` | desktop + mobile | same |
| Card icons | `icon-pill-bottle/-stethoscope/-text-msg/-daily-reminders/-web-click.svg` | single (SVG) | same |
| Dosing icons | `icon-pill-blue/-calendar-blue/-stomach-blue/-glass-blue.svg` | single (SVG) | same |
| Video posters | Brightcove `cf-images…/image.jpg` (×2) | single | `/content/dam/abbvie-eds-poc/v1/static/…` |

(Exact list to be re-confirmed against the current `.plain.html` `<img>`/`<source>` srcs during execution.)

## Open decision — confirmed with user

The user requested downloading **all viewport variants** into the DAM. Need to confirm the delivery mechanism for an xwalk project where `content/` is gitignored and served to preview.

## Checklist

### Phase 0 — Confirm DAM delivery mechanism (read-only / ask)
- [ ] Determine how assets reach the preview DAM for this xwalk project (manual upload to AEM author `/content/dam/abbvie-eds-poc`, a sync script, or local `content/content/dam` serving) — confirm with user if ambiguous
- [ ] Read `.migration/project.json` (`aemAssetsFolderPath`) and check for any existing `content/content/dam/abbvie-eds-poc/` local asset folder

### Phase 1 — Inventory & download images (all viewports)
- [ ] Extract every `<img src>` and `<source srcset>` (with their `media` breakpoints) from the current `find-relief.plain.html`
- [ ] Map each to its live source URL and its rewritten project DAM target path
- [ ] Download **desktop, tablet, and mobile** variants for each responsive image (hero, gut-check tout, savings tout); download single SVG/poster assets once
- [ ] Place downloaded files at the correct DAM paths (local `content/content/dam/abbvie-eds-poc/...` and/or upload to AEM author per Phase 0 outcome)
- [ ] Verify each asset resolves (no 404) at its rewritten path

### Phase 2 — Extract reference styling for hero + nav (read-only)
- [ ] Read reference `why-linzess/index.plain.html` hero + section-nav tables and the `find-relief-hero` section-metadata
- [ ] Read `blocks/hero/linzess/_hero.css` — rules gated on `.section.find-relief-hero` (full-bleed band, min-height, arc, eyebrow, H1, behind-nav overlay, image-swap breakpoints)
- [ ] Read `blocks/section-nav/linzess/_section-nav.css` — how the sticky pill overlaps the hero bottom + mobile collapse
- [ ] Step-0 dump: reference hero band + nav pill computed styles at 1440 and 390

### Phase 3 — Critique migrated blocks vs live
- [ ] Capture migrated find-relief hero + section-nav at 1440 and 390
- [ ] Delta table (hero: width / min-height / background-size / image-swap / eyebrow / H1; nav: position / overlap / pill bg / link spacing) — migrated vs reference vs live
- [ ] Confirm SEC0 (hero) is missing `find-relief-hero` section-metadata and that hero+nav grouping matches the reference

### Phase 4 — Root-cause (12-category tag)
- [ ] Hero "not full-bleed" → **section style missing** (`find-relief-hero` not emitted) + **asset** (images not in DAM)
- [ ] Nav "not overlapping hero" → dependent on hero section style / section ordering
- [ ] Confirm no base-block edit required (escalate if it is)

### Phase 5 — Fix (Execute mode)
- [ ] Update `tools/importer/transformers/linzess-sections.js` to emit `Section Metadata (find-relief-hero)` on the hero section; verify hero/section-nav grouping matches reference
- [ ] Any residual visual delta → lowest-level fix in brand block CSS partial (`blocks/hero/linzess/_hero.css` / `blocks/section-nav/linzess/_section-nav.css`); never base block, no `!important`, tokens only
- [ ] Re-bundle + re-import find-relief only; run `scaffold:build:block` if CSS partials touched

### Phase 6 — Verify
- [ ] Hero now full-bleed with arc, eyebrow + H1 bottom-left, **images visible at desktop / tablet / mobile** (correct image-swap per viewport)
- [ ] Section-nav pill overlaps hero bottom (desktop) and collapses (mobile `mobile-menu`)
- [ ] All other page images (touts, icons, posters) load — no 404s
- [ ] Diff hero & nav vs reference and live at 1440 + 390 (≥90% match); no regression to other sections
- [ ] Report; reload preview with a fresh token

## Constraints & notes
- Content is verbatim-correct already — styling/section-tagging + asset task only. Do not alter copy, ISI, or job code (`US-LIN-250121`).
- "All viewports" = download both desktop and mobile/tablet source variants the live site serves via `<picture><source media>`, so the EDS image-swap renders the right asset per breakpoint.
- Reuse existing blocks + linzess CSS; create no new blocks/variants.
- **Execution requires Execute mode** — Phases 1 (download/write) and 5 onward modify files / fetch assets / re-run the importer.
