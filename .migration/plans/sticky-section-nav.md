I have enough context on hero and section-nav. Let me check the header block state before finalizing, since the header is now in scope.The page metadata sets `nav: /linzess/nav` — the header loads from that fragment. Let me confirm the nav fragment exists locally to know if the header renders or 404s in preview.# Verify Header + Hero + Sticky Section-Nav (PR #90) on Find-Relief

Confirm the **header**, **hero**, and **sticky section-nav** — all present in the working tree from PR #90 — render and behave correctly on the find-relief page, matching live linzess.com/find-relief (header overlaying the hero, hero overlay text, section-nav pill overlapping the hero bottom and sticking on scroll). Fix only if something is actually broken.

> **Execution requires Execute mode.** This plan is read-only. Starting the dev server, Playwright navigation/scroll/screenshot, computed-style checks, and any CSS/JS fix are write/exec operations blocked in plan mode.

## Context (verified read-only)

All three are **already present** — no fetch/port needed:

**Header**
- `blocks/header/linzess/` has `header.css`, `_header.css`, `block-config.js` (PR #90 Linzess header: logo, utility nav, behind-hero overlay treatment).
- Page metadata `content/.../find-relief/index.plain.html:497-498` sets `nav: /linzess/nav`; the fragment `content/linzess/nav.plain.html` **exists locally**, so the header should render in preview (not 404).
- The hero's `linzess-behind-nav-*` class makes the header overlay the hero (transparent over hero → solid on scroll, per the brand header CSS).

**Hero**
- Content `:3` declares `<div class="hero no-padding text-left linzess-behind-nav-linzess-editorial-hero">` (PR #90 header-overlap hero: eyebrow "Find Relief", H1, white overlay, image swap).
- Recovered `styles/linzess/styles.css` carries the hero overlay + the **next-section white arc** (arc is the following section's `::before`, not the hero's — avoid double-arc).

**Sticky section-nav**
- `blocks/section-nav/section-nav.js` — sentinel + IntersectionObserver sticky, `is-stuck` toggle (position:fixed + sentinel height reservation), smooth-scroll offset, active-section IO, teardown.
- `blocks/section-nav/linzess/section-nav.css` — dark-purple pill, `JUMP TO:` chevron toggle, mobile dropdown, hero-bottom overlap (`.section-nav-wrapper { margin-top: -72px; z-index: 3 }`), `.sticky`/`.sticky.is-stuck`, desktop ≥744px centered pill.
- Content `:30` declares `<div class="section-nav sticky mobile-menu">` (Talk to a Doctor, How to Take LINZESS).

These three are visually coupled (header over hero, nav pill straddling the hero bottom), so they're verified together. Task is **verification**; fix only on failure.

## Verification approach

1. **Start the dev server** (`aem up`, content folder) if not running; load `/linzess/migration-dinesh/find-relief/` in Playwright.
2. **Header render** — header present from `/linzess/nav` fragment (logo, utility links: Prescribing Information / Medication Guide); overlays the hero at top (transparent/behind-nav); on scroll it transitions per the brand pattern (solid bg or scrolls away — match whatever live does).
3. **Hero render** — full-bleed image (desktop/mobile swap), white overlay eyebrow "Find Relief" + H1 "Chronic Constipation Calls for a Conversation"; single clean white arc at the hero/next-section seam (no double-arc).
4. **Section-nav initial** — dark-purple pill, JUMP TO links (desktop)/toggle (mobile), pill overlapping the hero bottom (negative margin, above arc via z-index).
5. **Sticky-on-scroll (desktop ≥744px)** — scroll past nav; `.is-stuck` toggles, computed `position` sticky/fixed pinned at top, corners flatten + shadow, no layout shift; confirm header/nav stacking order is correct while stuck.
6. **Active-section tracking** — scroll through Talk-to-a-Doctor / How-to-Take; matching link gets `.is-active` (weight 800); click smooth-scrolls with correct header+nav offset.
7. **Mobile (≤743px)** — header hamburger/drawer behaves; hero H1 32px + mobile image swap; nav collapses to `JUMP TO: [current]` + chevron, dropdown opens/closes, chevron flips, link click closes + updates current-label.
8. **Compare vs live** — spot-check live linzess.com/find-relief for header-over-hero, hero overlay, nav pill overlap + stuck-shadow parity at desktop and mobile.
9. **Fix only if broken** — lowest-specificity, find-relief/brand-scoped fix (no changes to shared blocks beyond what PR #90 already has); re-verify.

## Checklist

- [ ] Start/confirm dev server; load find-relief page in Playwright
- [ ] Header: renders from `/linzess/nav` fragment (logo + utility links), overlays hero at top, scroll transition matches live
- [ ] Hero: full-bleed image, white eyebrow + H1 overlay, single clean white arc (no double-arc)
- [ ] Section-nav renders: dark-purple pill, JUMP TO links, overlapping hero bottom (above arc)
- [ ] Desktop scroll: `is-stuck` toggles, nav pins at top, corners flatten + shadow, no layout shift, correct header/nav stacking
- [ ] Active tracking: correct link `.is-active` per section; click smooth-scrolls with proper offset
- [ ] Mobile: header hamburger/drawer; hero H1 32px + mobile image swap; nav toggle/chevron/dropdown + current-label
- [ ] Compare header + hero + nav against live linzess.com/find-relief (desktop + mobile) for visual parity
- [ ] If a check fails: apply minimal scoped fix and re-verify (else no changes)
- [ ] Report pass/fail per check; lint only if a fix was made (expect clean except 3 known safety-bar errors)
- [ ] Hold for approval before any commit/push

## Risks / notes
- **Header is a shared brand block** (`blocks/header/linzess/`, used by all Linzess pages) — any fix must be brand/find-relief-scoped and regression-checked against other Linzess pages; prefer no change.
- **Local vs deployed**: even though `/linzess/nav` exists locally, the local header may differ from the deployed/live header (fonts, fragment freshness) — judge the header-over-hero overlay and nav-sticky by computed styles + `is-stuck`, and corroborate against the live/deployed page.
- **Hero images** are base64/remote rasters; the markup/xwalk delivery may strip them in local preview — verify the hero image renders; flag if the cell is empty (separate from the overlay/sticky checks).
- Verification-first: **no code changes unless a check fails.**
- Working tree still has uncommitted recovery changes from prior work (`image-text.js`, `styles.css`, `tabs.js`, `tokens.css`, `_text.json`, `.stylelintrc.json`); this task won't commit them — still holding for approval.
