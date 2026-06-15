I'll investigate the section-nav block's sticky behavior to find the flicker cause before drafting the plan.Now the CSS — base and the linzess override — to find what causes the flicker on sticky toggle.Now the linzess override CSS — this is where the find-relief sticky pill bar is styled and likely where the flicker originates.# Find-Relief Section-Nav — Sticky Flicker Fix Plan

## Goal
Eliminate the flicker/jitter on the `section-nav sticky mobile-menu` block (the "JUMP TO: …" pill) as it pins/unpins on scroll, and match the smooth sticky behavior of live linzess.com `/find-relief`. Scope: the selected `.section-nav` block (CSS in `blocks/section-nav/linzess/section-nav.css`; JS only if escalation-approved).

## How the block works today (from code review)
- **JS** (`blocks/section-nav/section-nav.js`) inserts a zero-height `.section-nav-sentinel` *before* the block, then an `IntersectionObserver` toggles `is-stuck` when the sentinel leaves the viewport. On stuck it sets `sentinel.style.height = block.offsetHeight` to reserve space; on unstuck it resets to `0`.
- The IO uses `rootMargin: -${headerHeight}px 0 0 0`, where `headerHeight = --header-height = 72px`.
- **Base CSS**: `.section-nav.sticky { top: var(--header-height) }` → pins 72px down.
- **Linzess override CSS**: `.section-nav.sticky { top: 0 }` and `.is-stuck { position: fixed; top: 0; left: 50%; transform: translateX(-50%) }`.

## Prime suspect — pin-point vs detection-point mismatch (→ sentinel-height thrash)
The Linzess nav **pins at `top: 0`**, but the IO detection line is offset **72px** (`rootMargin: -72px`, from `--header-height`). That 72px gap is the classic flicker trigger:
1. Nav sticky-pins at viewport-top 0 (is-stuck still false).
2. 72px later the sentinel crosses the rootMargin line → `is-stuck=true` → nav switches `sticky → fixed` and the sentinel jumps `0 → 50px`.
3. The flow-space swap (nav leaving flow vs sentinel reserving height) doesn't net to zero at the same instant → page shifts → sentinel re-crosses the threshold → `is-stuck` flips back → **IO threshold thrash = flicker**.

On live, the stuck element is the independent pill pinned at top 0 with the detection point also at 0 — no 72px gap, no thrash.

## ⚠️ Escalation flag (base JS is shared)
The `rootMargin`/sentinel logic lives in **base `blocks/section-nav/section-nav.js`**, used by rinvoq-hcp & skyrizi-hcp too. Changing it is a base-block JS edit → **STOP-and-ask before touching it**. I'll first attempt a **brand-CSS-only** fix; only if that can't fully resolve it will I propose the JS change for approval.

## Fix candidates (lowest-specificity-first)
1. **Brand CSS (preferred):** stabilize the stuck swap so the height reservation can't thrash — e.g. make the sentinel/nav transition not shift layout (the wrapper already uses `margin-top: -72px` and `position: relative; z-index: 3`, so the pill overlaps the hero and may not need flow reservation at all). Test removing the dependency on the JS height swap by giving the wrapper a fixed reserved height, or `contain: layout`, scoped to `.section-nav-container`.
2. **Brand CSS:** add `will-change: position` / promote the pill to its own compositor layer to remove paint flicker, if the jitter is paint-level not layout-level.
3. **Base JS (escalate):** align `rootMargin` to the actual pin point (0 for Linzess) and/or add an `is-stuck` hysteresis/dead-band so the IO can't flip-flop at the boundary. Only with approval.

## Constraints
- No HTML/content edit to `.plain.html` (structure stays).
- Brand CSS (`blocks/section-nav/linzess/section-nav.css`) is the default target; it's lint-exempt/served directly.
- No base-block JS/CSS edit without explicit approval (shared across brands).
- Verify mobile (390/425) and desktop (1440) — the pill pins on both.

## Checklist
- [ ] **Reproduce** the flicker on the local preview: scroll the hero boundary slowly at 390px and 1440px; instrument `is-stuck` toggles + `sentinel.style.height` over scroll to confirm thrash (count rapid on/off flips at the boundary).
- [ ] **Confirm root cause:** is it (a) sentinel-height layout thrash from the 72px pin/detection mismatch, (b) sticky+fixed double-application, or (c) paint-level jitter? Capture the exact toggle pattern.
- [ ] **Attempt brand-CSS fix first** in `blocks/section-nav/linzess/section-nav.css`, scoped to `.section-nav-container`/`.section-nav` — stabilize the stuck transition (reserve height via wrapper or `contain`, and/or layer-promote) so `is-stuck` can't oscillate.
- [ ] Re-test at the boundary: zero `is-stuck` oscillation, no visible jump, pill stays put — at 390px and 1440px.
- [ ] **If CSS alone can't fix it:** STOP and present the base-JS change (rootMargin align to pin point + hysteresis) for approval, noting rinvoq/skyrizi impact.
- [ ] **Regression:** confirm pill still pins correctly, active-section highlight still tracks, mobile dropdown open/close still works, and the hero-overlap position is unchanged.
- [ ] **Cross-brand check** (only if base JS touched): verify rinvoq-hcp / skyrizi-hcp section-nav still pin correctly at their `top: header-height`.
- [ ] Report root cause, the fix applied, and per-viewport before/after.

## Notes
- **Execution requires Execute mode.**
- Functionality to preserve (matches live): sticky pill pins to top on scroll, flattens top corners when stuck, stays content-width & centered (desktop) / full pill (mobile), active label updates, dropdown toggle works.
- Likely the fix is brand-CSS-only (stabilize the layout swap); the base-JS `rootMargin` mismatch is the documented prime suspect but is gated behind approval since it's shared.
