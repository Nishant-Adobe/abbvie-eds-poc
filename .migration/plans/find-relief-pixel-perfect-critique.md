# Find-Relief Pixel-Perfect Critique & Match Plan (vs live linzess.com/find-relief)

## Goal
Run a **block-by-block critique** plus a **complete-page critique** of the migrated page
`preview-aemcoder.adobe.io/content/linzess/dinesh-linzess/find-relief` against the live
`linzess.com/find-relief`, then drive each diverging block to a pixel-perfect match — reusing
existing blocks and brand CSS only (no new blocks). Desktop (1440) is primary; mobile (390) verified.

## Observed deltas from the supplied screenshots (to confirm with computed-style dumps)

| # | Block / section | Live | Migrated (preview) | Suspected root cause |
|---|---|---|---|---|
| 1 | **Checklist** ("What To Talk About") | Purple 4-quadrant card panel (Discuss / List Out / Have a Plan / Learn More) with orange bullet icons | Plain bulleted text list, no purple card | Authored as default-content `<ul>` instead of a styled block; brand CSS for `find-relief-checklist` not styling the list |
| 2 | **Hero** | Tall full-bleed band, big image | Shorter/cropped band on preview | Hero band min-height + image-swap not applying on preview (CSS not deployed) |
| 3 | **Gut Check tout** | Wide rounded off-white card, image left + CTA | Narrower, lighter styling | `columns` brand styling / section bg not applied on preview |
| 4 | **Cards-grid** (Already Prescribed / Savings) | 2-up & 3-up purple rounded cards, icon-in-circle | Stacked icon-circles + loose text, no card frame | `cards-grid icon-image-card` brand CSS not applied on preview |
| 5 | **Dosing icons** (tabs panels) | Small ~106px icons beside text | Giant full-width circles | `flexbox.column` icon cap — fixed locally, **not yet on preview** |
| 6 | **Tabs** | One panel at a time | Both panels visible / merged | Base `tabs.js` section-match bug (already escalated) |
| 7 | **Bottom CTA** | Full-width dark-purple band, 2 rounded pill buttons | Two small purple buttons on white | `find-relief-dark-purple` section band + CTA styling not applied on preview |
| 8 | **Savings tout** | Rounded off-white card, coupon image + CTA | Looser layout | `columns` brand styling on preview |
| 9 | **Section bands/spacing** | off-white / white / dark-purple bands | mostly flat white | section-metadata style classes not applied on preview |
| 10 | **Header / footer** | Branded, correct | Correct on preview | OK |

## Leading hypothesis
The migrated **content + section tags are already correct** (verified locally). Almost every visual
delta on the *preview* is because the **brand CSS, section-metadata block, and image assets are not
deployed/synced to `preview-aemcoder.adobe.io`** — the same fixes already render correctly on
`localhost:3000`. Two items are genuine code issues: the **checklist authored as plain `<ul>`**
(should be a styled block matching the live purple card) and the **tabs gating** (base-JS bug, escalated).

## Checklist

### Phase 0 — Capture baselines (read-only)
- [ ] Dump live `linzess.com/find-relief` computed styles + full-page screenshots at 1440 and 390 (Step-0 gate)
- [ ] Dump migrated preview computed styles + screenshots at 1440 and 390
- [ ] Dump migrated **local** (`localhost:3000`) render at 1440 and 390 to separate "CSS-not-deployed" from "real defect"

### Phase 1 — Per-block critique (build delta table per block)
- [ ] Hero — band height, image-swap, eyebrow, H1 font/size, arc, nav overlap
- [ ] Section-nav — pill bg, 30px hero overlap, links (already fixed; reconfirm)
- [ ] Checklist — confirm live is a styled 4-quadrant card; decide block (cards-grid vs columns vs text-container variant) to match
- [ ] Gut Check tout (`columns`) — card bg, radius, image/CTA layout
- [ ] Embed (videos ×2) — poster image, aspect ratio, transcript link
- [ ] Cards-grid ×2 (`icon-image-card`) — card frame, icon circle, 2-up/3-up grid, CTA buttons
- [ ] Tabs — panel gating (escalated base-JS) + tab pill styling
- [ ] Flexbox dosing panels — icon cap (fixed locally; confirm on preview after deploy)
- [ ] Savings tout (`columns`) — coupon image, card bg, CTA
- [ ] Bottom CTA (`columns` + `find-relief-dark-purple`) — full-width band, pill buttons
- [ ] ISI (`text-container`) — verbatim copy, job code US-LIN-250121, spacing
- [ ] Footer — confirm parity

### Phase 2 — Root-cause tagging (12-category)
- [ ] Tag each delta: **CSS-not-deployed** (sync), **asset-missing** (DAM), **authoring** (block choice), **brand-CSS** (fix), or **base-JS** (escalate)
- [ ] Confirm which deltas vanish once CSS/assets are synced to preview vs which need code changes

### Phase 3 — Fixes (Execute mode)
- [ ] Checklist: if live is a styled card, remap from default `<ul>` to the correct existing block (likely `cards-grid` 4-up or `columns`) — update parser/transformer + re-import; **post section→block remap for sign-off first**
- [ ] Any genuine brand-CSS gaps (checklist card, tout cards, CTA band) → fix in `blocks/*/linzess/_*.css` (tokens only, no `!important`, no base edits); rebuild with `scaffold:build:block`
- [ ] Confirm flexbox icon fix + section-nav overlap are included
- [ ] Re-bundle + re-import find-relief; ensure all DAM assets present
- [ ] Tabs gating remains escalated (base `tabs.js`) — do not patch in scope

### Phase 4 — Verify pixel match
- [ ] Re-diff each block vs live at 1440 + 390 (≥90% per block)
- [ ] Full-page diff vs live; no leaked metadata text; ISI verbatim intact
- [ ] No regression to header/footer/already-fixed sections
- [ ] Report per-block match table + remaining deploy-dependent items

## Constraints
- Reuse existing blocks + brand CSS only; **no new blocks** (escalate genuine gaps).
- Tokens only in CSS; no hardcoded values; no `!important`; no base-block edits (escalate).
- Content/ISI verbatim — styling task only.
- **Preview parity depends on deploying the rebuilt brand CSS + section-metadata block + DAM assets** to `preview-aemcoder.adobe.io`; several deltas will only disappear there after sync.
- **Execution requires Execute mode** — Phases 0–2 are read-only analysis; Phases 3–4 modify CSS/parsers and re-import.
