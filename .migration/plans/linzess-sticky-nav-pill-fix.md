# Find-Relief — Section-Nav Sticky + Hero Arc/Bleed Fidelity Plan

## Objective
Make the section-nav and hero on the Find Relief page (`/content/linzess/migration-dinesh/find-relief/`) behave and render exactly like the references:

1. **Section-nav pill is independent** — when the page scrolls and the nav becomes stuck, the rounded-corner purple pill floats on its own. **No full-width white lines/bars** appear to the left and right of the pill (the artifact currently visible on the migrated preview).
2. **Sticky behaves like reference** — the pill sits over the hero (overlapping its bottom), and on scroll it pins to the top / under the header the same way the references do.
3. **Hero bleed + bottom arc** — the hero image bleeds full-bleed and has the white curved arc at the bottom.

## Reference truth
- **Primary EDS reference (working sibling page, same project — preferred source of truth):**
  `https://linzess-migration--abbvie-eds-poc--nishant-adobe.aem.page/linzess/why-linzess/`
  → use this for the **hero** treatment (bleed + bottom arc) and the **nav pill** (independent rounded pill, stuck behavior, no side white-lines). Because it is already an EDS build in this repo, its block CSS is directly comparable to ours and is the authoritative target for the migrated page.
- **Live AEM site (behavioral cross-check):** `https://www.linzess.com/find-relief`
  - Wrapper rule: `.image-text-v2:has(.hero-container) + .section-navigation { margin-top: -230px; position: relative; z-index: 10; min-height: 100px; }`
  - Sticky mechanism: `.abbv-sticky-anchor` sentinel + `.abbv-section-navigation.abbv-sticky` (`data-stick-anchor-pos="top"` / `data-stick-tracked="top"`).
  - Pill markup: `ul.section-navigation-list`; mobile `.mobile-section-navigation` (`current-pos` + prev/next/menu chevrons).
  - Hero: `image-text-v2` + `hero-container` + `abbv-image-swap`; eyebrow + orange divider + H1.
- **Tokens:** `--linz-dark-purple #422e83`, `--linz-rounded-corner 16px`, `--linz-rounded-corner-sm 8px`.

## Current-state findings (from migrated CSS)
- `blocks/section-nav/linzess/_section-nav.css`:
  - Wrapper overlaps hero via `.section-nav-wrapper { margin-top: -72px; z-index: 3 }` (live uses `-230px` / `min-height:100px` / `z-index:10`).
  - Desktop stuck (lines ~255-277): `.section-nav.sticky.is-stuck` is `position: fixed; left:0; right:0; width:100%` **with `box-shadow` on the full-width transparent container**, and the inner `nav` pill gets **flattened top corners**.
- **Leading white-line hypothesis:** the `box-shadow: var(--shadow-section-nav-stuck)` is applied to the **full-width transparent `.section-nav` strip** (not the pill), so it paints a faint line spanning the whole viewport beside the pill; combined with the flattened-corner pill connecting to the top edge, this reads as "white lines passing the ends." The EDS reference page presumably scopes the shadow + radius to the **pill only**, so it stays independent. Confirm in-browser against both the migrated page and the EDS reference before editing.

## Approach
Keep the existing `hero` + `section-nav` blocks (no block swap); correct the **brand CSS only** so the stuck state matches the EDS reference page. Compare our compiled `section-nav.css`/`hero.css` against the EDS reference's served CSS, then move all "stuck" visual treatment (shadow, corners) from the full-width container onto the inner pill, and make the full-width fixed container fully transparent with no shadow so nothing renders beside the pill.

## Checklist
- [ ] **Load all three references:** dev server up; open the migrated `/content/linzess/migration-dinesh/find-relief/`, the **EDS reference** `…/linzess/why-linzess/`, and live `linzess.com/find-relief` (desktop 1280–1440px + mobile 390px). *(Execute mode required.)*
- [ ] **Diff our nav-pill CSS vs the EDS reference:** inspect the EDS `why-linzess` section-nav stuck state — which element carries `box-shadow`/`border-radius`/`background` (container vs inner pill), and the pinned `top` offset — and treat that as the target.
- [ ] **Diff our hero CSS vs the EDS reference:** inspect the EDS `why-linzess` hero for full-bleed image + bottom arc geometry (`::before` curve radius/height, overlap) and capture the target values.
- [ ] **Reproduce the white-line artifact:** scroll the migrated page until stuck; identify the exact element painting the line beside the pill (`.section-nav` strip vs inner `nav`, plus any sentinel/placeholder).
- [ ] **Fix container vs pill split (desktop):** remove `box-shadow`/background from the full-width `.section-nav.sticky.is-stuck`; move shadow + corner treatment onto `.section-nav.sticky.is-stuck nav` (pill) only, matching the EDS reference.
- [ ] **Match corner treatment:** set the pill's stuck corners per the EDS reference (full radius vs flattened-top) so the pill reads as independent and the side white-lines disappear.
- [ ] **Align overlap:** reconcile `.section-nav-wrapper` overlap (`margin-top`, `z-index`, `min-height`) toward the EDS reference / live (`-230px`, `z-index:10`, `min-height:100px`) so the pill sits over the hero arc when not stuck.
- [ ] **Mobile stuck parity:** confirm centered mobile pill pins with no side bars and the "JUMP TO: / current label" + chevron match the references.
- [ ] **Hero bleed + arc:** verify full-bleed image and white bottom arc render at the EDS reference's radius/height; fix curve geometry/overlap if it diverges.
- [ ] **Active-tracking + smooth-scroll regression:** re-confirm active highlight per section and click smooth-scroll lands just below the pinned pill (no content hidden).
- [ ] **Cross-page regression:** confirm the canonical `/content/linzess/find-relief/` still pins correctly with the new container/pill split.
- [ ] **Sync compiled CSS:** apply identical edits to source `_section-nav.css`/`_hero.css` **and** compiled `section-nav.css`/`hero.css` (compiled file is what the server serves).
- [ ] **Lint:** run stylelint on changed files; expect clean except the 3 known pre-existing `safety-bar.css` errors.
- [ ] **Report pass/fail per check and HOLD for approval before any commit/push** (standing rule: never push without explicit approval).

## Notes / Risks
- The local preview strips images, so hero bleed must be verified against served picture/`background` behavior, not a blank cell — pixel arc verification leans on the EDS reference + live comparison for geometry.
- The EDS reference (`why-linzess`) may use a slightly different hero variant than find-relief; treat shared pill/arc patterns as the target but confirm the find-relief variant classes still apply.
- Edits confined to Linzess brand CSS (`blocks/section-nav/linzess/*`, `blocks/hero/linzess/*`, possibly `styles/linzess/styles.css`); no content HTML generated or edited.
- **Execution requires Execute mode** — this plan is read-only analysis; browser inspection and CSS edits run once approved.
