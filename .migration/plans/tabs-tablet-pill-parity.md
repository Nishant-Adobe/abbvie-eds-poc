# Tabs Block — Tablet Pill Design Parity Plan

## Goal
Restyle the find-relief "Instructions For Adults & Children" tabs nav so the **active tab renders as a fully-rounded dark-purple pill nested inside the light-purple bar**, matching the provided live-site reference. Scope is limited to the selected `tabs` block and its brand CSS.

## Selected element
- **Page:** `content/linzess/migration-dinesh/find-relief/index.plain.html`
- **Selector:** `main > .section.find-relief-instructions.tabs-container:nth-of-type(4) > .tabs-wrapper:nth-of-type(2)`
- **Block:** `.tabs.block` → `.tabs-list[role="tablist"]` with two `button.tabs-tab` (Adults / Pediatric)
- This is a **CSS-only** change — HTML/content structure stays intact (no `.plain.html` content edit required).

## Reference (live) vs current

| Aspect | Live reference (target) | Current EDS CSS | Delta |
|---|---|---|---|
| Active tab shape | **Fully-rounded pill — all 4 corners** | Rounded **right side only** (`0 r r 0`) | ✗ corner radius |
| Active tab seating | **Inset inside** the light-purple bar (light purple visible around top/bottom/left of pill) | Flush, fills bar edge-to-edge | ✗ inset / padding |
| Bar (tablist) | Light purple, rounded ends, acts as a track | Light purple, rounded ends | ✓ (keep) |
| Active fill | Dark purple `--linz-dark-purple` | Dark purple | ✓ |
| Inactive | Light purple, purple bold text | Light purple, purple bold text | ✓ (verify text size) |
| Active text | White, bold | White, bold | ✓ |

**Root cause (tag):** Brand block CSS — the active-tab radius rule (lines 86–103 of `blocks/tabs/linzess/tabs.css`) was authored as a single-side radius; the live design is a free-floating rounded pill with the bar padded around it.

## Approach (lowest-specificity, mobile-first)
1. **Pad the tablist track** so the active pill can inset (small uniform padding on `.tabs-list`, e.g. token-based ~4–6px), keeping the light-purple bar visible around the active pill.
2. **Give the active tab a full radius** (`--linz-rounded-corner` on all four corners) and remove the one-side overrides for first/last active states.
3. Ensure **inactive tabs stay transparent/light** (no individual corner radius needed once the track is padded) and the **bar corners** remain rounded.
4. Keep the existing dark-purple fill, white bold active text, and the responsive font/padding steps at 600px and 900px.
5. Confirm the pill height still fills the padded track cleanly at all three relevant widths (mobile 390, tablet ~768, desktop 1440) without clipping or overflow.

> No `!important` additions beyond what already exists in the file's container rule; scope stays under `.tabs-container .tabs .tabs-list …` so other tabs blocks are unaffected.

## Checklist
- [ ] Capture live computed styles for `.abbv-tabs-controls` active pill (border-radius, margin/inset, padding, bar padding, gap) at tablet + desktop — Step 0 dump before editing
- [ ] Capture current EDS tabs computed styles at 390 / 768 / 1440 for the same nodes
- [ ] Build the delta table (radius, inset, padding, font-size) and confirm root-cause = brand block CSS
- [ ] Edit `blocks/tabs/linzess/tabs.css`: add inset padding to `.tabs-list` track
- [ ] Edit active-tab rule → full 4-corner `--linz-rounded-corner`; remove/loosen the first-child/last-child single-side active overrides (lines 95–103)
- [ ] Verify inactive tab + bar corners still correct after track padding change
- [ ] Rebuild scoped block CSS if a `_tabs.css` partial drives the output (`npm run scaffold:build:block --block-name tabs --brand-name linzess`); otherwise confirm `tabs/linzess/tabs.css` is served directly
- [ ] Verify active pill renders fully-rounded + inset at 390 / 768 / 1440 against the reference
- [ ] Toggle to the Pediatric tab and confirm the pill animates/seats correctly when the second tab is active (no broken single-side radius)
- [ ] Desktop regression: confirm tabs on any other page using this block are unchanged (cross-page sweep)
- [ ] Lint `blocks/tabs/linzess/tabs.css`

## Risks / notes
- Shared block CSS: `blocks/tabs/linzess/tabs.css` applies to **every** linzess tabs instance — must regression-check other pages that use tabs.
- If a `blocks/tabs/linzess/_tabs.css` partial exists, edit the partial and rebuild; the non-underscore file may be generated.
- Live `.abbv-tab-*` markup differs from EDS `.tabs-tab` markup (Platform-C vs EDS) — match the **visual outcome only**, do not rename EDS classes.
- Change is CSS-only; on this xwalk project it needs commit + push to the branch to go live (content re-publish not required).

---
*Execution requires Execute mode. This plan covers the active-tab pill restyle in `blocks/tabs/linzess/tabs.css`; no `.plain.html` content change is needed.*
