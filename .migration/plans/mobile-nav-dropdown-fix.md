I'll ask one targeted question to pin down the exact dropdown defect before finalizing the plan, since the two screenshots could indicate different problems.# Find-Relief Section-Nav — Mobile/Tablet Dropdown Fix

## Goal
Fix the open "JUMP TO" dropdown on mobile/tablet so it reads as **one container with the purple toggle pill**: white panel directly attached under the toggle (no gap/detachment), matching the pill's width and horizontal position, cleanly overlaying page content, with legible links. Scope: the selected `.section-nav.mobile-menu` block + its brand CSS (`blocks/section-nav/linzess/section-nav.css`).

User-confirmed defects (all four):
1. **Detached from pill** — white dropdown floats with a gap instead of joining the toggle.
2. **Overlaps page content** — open menu sits awkwardly over section text.
3. **Wrong width/position** — dropdown width/alignment doesn't match the toggle pill.
4. **Links hard to read** — link panel/contrast/spacing needs cleanup.

## Root cause (from CSS review)
The block is a **fixed `height: 50px`** pill (`.section-nav { width: 70vw; height: 50px; overflow: visible }`) with the dropdown `ul` rendered as a **normal-flow flex child** of `nav` (column direction), shown via `display:flex` when `.is-open`.

Because the `ul` is in-flow inside a 50px-tall, `overflow:visible` block:
- It spills **below** the fixed-height block but isn't anchored to the toggle's bottom edge → the rounded pill bottom + the block's own `border-radius` create the **visible gap/detachment** (defect 1).
- Its width derives from the flex/`nav` box, which can mismatch the pill's rounded width and centering → **width/position drift** (defect 3).
- In-flow (not positioned/overlay) means it participates in layout oddly against the negative-margin hero overlap and can **render over content without a clean overlay context** (defect 2).
- The link list lacks a firmly anchored white panel under the toggle → **readability** (defect 4).

The toggle already flattens its bottom corners when open (`:1009`), and the `ul` already rounds its bottom corners (`:1043`) — but with no absolute anchoring the two don't actually meet.

## Fix approach (brand CSS only, scoped, mobile/tablet)
Anchor the dropdown to the toggle so they form one seamless container:
1. **Position the dropdown** `ul` **absolutely** relative to the block: `position: absolute; top: 100%; left: 0; right: 0; width: 100%` so it sits flush under the toggle, full pill width, same horizontal position (kills detachment + width/position drift). Requires the block (`.section-nav`) to be `position: relative` (it's already `position: sticky`, which establishes a containing block — verify, else add relative on the toggle's parent).
2. **Seam:** keep toggle flat-bottom (already there); dropdown flat-top + rounded-bottom (already there) — once anchored at `top:100%` with matching width they join as one shape. Remove any gap from the block's own `border-radius`/padding at the seam.
3. **Overlay:** ensure dropdown `z-index` sits above following content (block is `z-index:3`/`100` when stuck; give the `ul` an explicit stacking above section content) so it cleanly overlays text (defect 2).
4. **White panel + links:** confirm `--section-nav-dropdown-bg` white panel spans full width with the purple bold centered links and adequate padding/contrast (defect 4); add a subtle shadow if needed to separate from page content.
5. **Stuck state:** verify the dropdown stays attached when the pill is `position: fixed` (`.is-stuck`) — absolute-to-block anchoring should follow the fixed pill; test both non-stuck and stuck.

## ⚠️ Constraints & watch-outs
- **Brand CSS only** (`blocks/section-nav/linzess/section-nav.css`, lint-exempt). No base-block JS/CSS edits without escalation (shared with rinvoq-hcp/skyrizi-hcp).
- Don't reintroduce the **sticky-flicker** fixed earlier (sentinel `height:0`, wrapper `min-height:50px`) — leave those intact.
- Absolute-positioning the dropdown removes it from flow; confirm the page **doesn't collapse/jump** when menu opens (block stays 50px; overlay floats — desired).
- Mobile (390/425) **and** tablet (768) both show this toggle layout (toggle hidden ≥744? — verify the breakpoint: base mobile shows toggle; desktop ≥744 hides it and goes horizontal). Confirm whether "tablet" here is still the dropdown layout or the horizontal pill, and fix accordingly.
- Keep desktop ≥744px horizontal pill untouched.

## Checklist
- [ ] Reproduce at 390/425px and 768px with menu open; capture computed `position`, `top`, `width`, `left/right`, and bounding rects of toggle vs dropdown `ul`; measure the gap and width mismatch.
- [ ] Confirm the containing block for absolute positioning (`.section-nav` sticky/relative) and that `top:100%` anchors the `ul` to the toggle bottom.
- [ ] Apply scoped brand CSS: dropdown `position:absolute; top:100%; left:0; right:0; width:100%`, flush seam with toggle, white panel, z-index overlay, optional shadow.
- [ ] Verify: dropdown joins pill (no gap), matches pill width + centering, overlays content cleanly, links legible (purple bold centered on white).
- [ ] Verify open/close toggle still works (chevron flips, aria-expanded), and clicking a link closes + scrolls.
- [ ] Test **stuck** state (scrolled, pill `position:fixed`): dropdown stays attached and correctly positioned.
- [ ] Regression: desktop ≥744px horizontal pill unchanged; sticky-flicker fix intact (no oscillation); how-to-take + talk-to-a-doctor pages (same block) behave identically.
- [ ] Report before/after geometry (gap, width, position) per viewport.

## Notes
- **Execution requires Execute mode.** This artifact is the plan only.
- Expected change: a focused set of scoped rules on `.section-nav.mobile-menu nav ul` (+ `.is-open`) in the linzess brand CSS — no HTML/JS/token/base-block edits.
- Clarify during execution whether 768px should show the dropdown menu or the horizontal pill (depends on the existing `@media (width >= 744px)` toggle-hide rule) and match live behavior.
