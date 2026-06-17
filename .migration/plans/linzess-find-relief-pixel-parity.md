# LINZESS Find-Relief — Pixel-Parity Implementation Plan

This plan uses the live LINZESS `find-relief` source (HTML + `linzess-global.css` + Platform-C component CSS) as the authoritative reference and drives the migrated EDS page at `content/linzess/migration-dinesh/find-relief/` to pixel parity, using **existing blocks only** and **brand-scoped custom classes** (no `!important`, tokens only, no base-block edits).

> Execution requires **Execute mode** — this artifact is the agreed plan; nothing below is applied while in plan mode.

## Reference values extracted from live CSS (authoritative)

| Element | Live rule | Token mapping |
|---|---|---|
| Off-white band | `#f4f6fb` | `--linz-off-white` ✓ exists |
| Dark-purple band | `#422e83` | `--linz-dark-purple` ✓ |
| White band | `#fff` | `--linz-white` ✓ |
| **Section arc** (`.background-arc:before`) | 130%-wide dome, `border-top-left/right-radius:100%`, `height:75px` (≥900px `255px`), `top:-60px`, `padding-bottom:100px` on band | new brand tokens needed |
| Rounded corner | `16px` | `--linz-rounded-corner` ✓ |
| Hero pull-up under transparent header | `.hero-container{top:-138px}` desktop / `-147px` | new `--linz-hero-pullup` |
| Section-nav pill | dark-purple, radius 16px, `margin-top:-30px`, `width:max-content` | done ✓ |
| Checklist checkmark | `icon-checkmark-orange.svg` (NOT a dot) | needs asset download |
| Tabs control | light-purple track, active = dark-purple, radius 16px | `--linz-light-purple` |
| Dosing step rows | `background-off-white rounded-corners`, icon-left | done (flexbox) ✓ |
| "Prescribed?" + Savings cards | icon-image-card, alt dark/light-purple, icon overlaps top `-50px`, circle 136px desktop | cards-grid brand CSS |
| Bottom CTA | dark-purple band, 2 cols w/ `#948ebe` divider, **orange** buttons | `--linz-orange` |
| ISI / footer arcs | white / dark-purple `:before` domes | brand global |

## Checklist

### Phase 0 — Baseline capture (HARD GATE, before any edit)
- [ ] Capture live screenshots at 1440px + 390px for each section (hero, talk-to-doctor, how-to-take, tabs, dosing, storage+savings, bottom CTA, ISI, footer)
- [ ] Capture current local render screenshots at 1440px + 390px for the same sections
- [ ] Build one delta table (selector | property | live | local | match/diff) covering background, arc, radius, spacing, color, font
- [ ] Confirm previously-approved batch pages (for cross-page regression baseline)

### Phase 1 — Tokens (define before referencing)
- [ ] Add arc tokens to `styles/linzess/tokens.css`: `--linz-arc-height` (75px), `--linz-arc-height-lg` (255px), `--linz-arc-overlap` (-60px), `--linz-band-pad-btm` (100px)
- [ ] Add `--linz-hero-pullup` (138px) + mobile variant
- [ ] Verify `--linz-orange`, `--linz-light-purple`, `--linz-purple` (`#60579e` divider) all present
- [ ] Rebuild: `BRANDS=linzess npx gulp createBrandCSS`; `git diff --stat` confirms only linzess files changed

### Phase 2 — Assets
- [ ] Download `icon-checkmark-orange.svg` (checklist), `divider.svg` (eyebrow rule) into `content/content/dam/abbvie-eds-poc/linzess/images/`
- [ ] Verify both load (network 200) on local

### Phase 3 — Section bands + arcs (`styles/linzess/_styles.css`, scoped to `find-relief-*`)
- [ ] Off-white band already applied — extend with `.background-arc:before` dome on `.section.find-relief-off-white`
- [ ] Dark-purple band + arc + white text on `.section.find-relief-dark-purple`
- [ ] White "talk-to-doctor" band: confirm transparent-on-white is acceptable OR add explicit white band + arc on `.section.find-relief-checklist`
- [ ] Add `padding-bottom: var(--linz-band-pad-btm)` to each arced band
- [ ] Responsive: 75px arc mobile → 255px ≥900px
- [ ] Rebuild + verify computed bg/arc at 1440 + 390

### Phase 4 — Block refinements (brand block CSS partials, not page CSS)
- [ ] **Checklist** (`find-relief-checklist`): swap orange dot → `icon-checkmark-orange.svg` marker, confirm 2-col grid / dark-purple card / white text / radius 16px
- [ ] **cards-grid** `blocks/cards-grid/linzess/_cards-grid.css`: icon-image-card 2-up + 3-up, alternating dark/light-purple, icon overlap `-50px`/circle 136px desktop, rounded 16px ("Prescribed?" + Savings rows)
- [ ] **embed/video** posters: light-purple rounded card, max 620px, centered (video sections)
- [ ] **tabs** `blocks/tabs/linzess/_tabs.css`: light-purple control track, active dark-purple, radius 16px, panel spacing
- [ ] **flexbox** dosing rows: confirm off-white rounded row + 110px icon cap (done) matches live `icon-image-card-left`
- [ ] **Storage + Savings tout**: white rounded card inside off-white band (columns/cards-grid variant)
- [ ] **Bottom CTA**: 2-col with `#948ebe` divider, **orange** buttons (`--linz-orange`), white text
- [ ] Each block edit → `npm run scaffold:build:block --block-name X --brand-name linzess` (never bare build)

### Phase 5 — Buttons + typography
- [ ] Primary button: dark-purple, radius 16px, weight 800 (done via brand global)
- [ ] Orange button variant for hero CTA + bottom-nav CTAs
- [ ] Eyebrow (uppercase, 800, dark-purple) + Bebas Neue H1 / Lato body confirm against live `--heading1-font-size` scale

### Phase 6 — ISI + footer arcs (verify, low risk)
- [ ] Confirm ISI region renders with white dome arc (`.abbv-inline-use-isi:before` equivalent) — verbatim ISI copy + job code `US-LIN-250121` unchanged (pharma-content-fidelity gate)
- [ ] Confirm footer dark-purple arc

### Phase 7 — QA gates (block "done" until all pass)
- [ ] Per-section pixel match table at 1440 / 768 / 390 ≥90% each
- [ ] Content fidelity: ISI/ indication / savings footnotes byte-identical to live; references round-trip
- [ ] A11y: single H1, alt text, aria-labels on icon-only controls, touch targets ≥44px
- [ ] Cross-page regression: every previously-approved linzess page unchanged at 1440 + 390 (Shared-File pre-edit gate)
- [ ] All images load (network 200/304), no console errors except known escalations
- [ ] Tabs gating remains **escalated** (base `tabs.js` bug — do NOT patch in this scope); note as accepted known-defect

### Phase 8 — Sync note
- [ ] Summarize what changed; note local-only DAM assets must be uploaded to the shared preview before images resolve there
- [ ] Await user approval before any commit/push

## Out of scope / escalations
- Base `blocks/tabs/tabs.js` panel-gating fix (cross-brand; escalated, documented in `.migration/plans/tabs-section-matching-bug-escalation.md`)
- Header/footer fragment content (shared) — only arc styling verified, no content changes
- Any token change affecting >1 page requires explicit per-delta approval before applying

## Guardrails (applied throughout)
- Tokens only — no literal colors/sizes; define token first if missing
- Custom-class scoping under `.section.find-relief-*`; no bare block selectors in `styles/linzess/_styles.css` (AEMCODER-018)
- No `!important`; lowest-specificity-first fix ladder
- Targeted `scaffold:build:block` only; verify `git diff --stat` after any build (AEMCODER-017)
- One fix at a time, desktop baseline diffed after each (regression-bisectable)
