I'll clarify scope and the pixel-reference source before building the plan, since linzess.com renders unstyled in this environment.# Find-Relief — Full Typography & Style Parity Critique (All Pages, All Viewports)

## Goal
Run a comprehensive per-block critique across **all three find-relief pages** — text alignment, line-height/spacing, font-family/size/weight, colors, and general styling — and match live linzess.com. Cover **mobile (390/425), tablet (768/834), and desktop (1440)**. Live computed values come from **screenshots/values you provide** per block/viewport (linzess.com renders unstyled here).

## Pages in scope
| Page | Path |
|---|---|
| Index (Find Relief) | `find-relief/` |
| How to Take LINZESS | `find-relief/how-to-take-linzess` |
| Talk to a Doctor | `find-relief/talk-to-a-doctor` |

## Block inventory to critique (per page)
Hero · Section-nav (JUMP TO) · Talk "What To Talk About" checklist card · Gut-Check image-text · Video blocks ×2 · Prescribed cards · Sign-up cards · Tabs (Instructions) · Dosing cards · Savings tout · Bottom-nav · ISI/Safety bar · Footer.

## What "match everything" means here (audit dimensions per block)
For each block at each viewport, compare local vs live:
- **Font** — family, size, weight, style, letter-spacing
- **Line-height / spacing** — line-height, paragraph margins, inter-element gaps, section padding
- **Alignment** — text-align, vertical alignment, centering
- **Color** — text, headings, links, backgrounds, accents
- **Misc style** — radius, borders, dividers, list markers, sup/footnote treatment

## Methodology (per block, screenshot-gated)
1. **You provide** a live screenshot (or devtools values) for the block at the viewport in question.
2. Capture local computed styles for the same descendants (`getComputedStyle` for font/line-height/align/color/margins).
3. Build a **delta table** (one row per descendant: property | live | local | match/diff).
4. Tag each real delta with root cause (token / brand global / brand block CSS / section variant).
5. Fix lowest-specificity-first, scoped to `find-relief-*` (brand CSS in `styles/linzess/styles.css` or `blocks/*/linzess/`), one delta set at a time.
6. Re-render, compare to screenshot until within ±1–2px / exact color.
7. Regression at all three viewport tiers + the other pages after each change.

## Constraints & guardrails
- **No base-block / token / JS edits** without STOP-and-ask (token = brand-wide blast radius).
- **No HTML/content edits** to `.plain.html`; ISI/safety copy stays verbatim (pharma-fidelity — content audited for fidelity only, not restyled).
- Brand CSS (`styles/linzess/*`, `blocks/*/linzess/*`) is the default target (lint-exempt, served directly).
- **Don't fabricate fixes** — if a block already matches (several already verified this session: dosing, sign-up CTA, gut-check stack, tabs dimensions, savings tout, section-nav dropdown), report "matches, no change" rather than edit.
- Preserve this session's prior fixes (tabs full-width, nav dropdown overlay, sticky-flicker, image-text 10-row md2jcr, savings/gut-check stacking, dosing badge).
- **Screenshot-gated:** I'll request the live reference for the block I'm about to audit and pause if it's not yet provided, rather than guess.

## Checklist
- [ ] **Hero** — headline (Bebas size/line-height/tracking), eyebrow, body, colors; per viewport vs live.
- [ ] **Section-nav** — JUMP TO label/link type, pill sizing; per viewport.
- [ ] **Talk "What To Talk About" card** — heading, item headings, body line-height/align, checkmark spacing.
- [ ] **Gut-Check image-text** — heading, body, "Actor Portrayal" caption, CTA label type.
- [ ] **Video blocks ×2** — caption-bar title type, "View Transcript" link, spacing.
- [ ] **Prescribed cards** — card heading/body font/line-height/align, type scale per viewport.
- [ ] **Sign-up cards** — heading/body/CTA type, alignment.
- [ ] **Tabs (Instructions)** — heading "INSTRUCTIONS…" + tab labels (already sized this session — re-verify vs live).
- [ ] **Dosing cards** — heading/body/footnote type, alignment (already pixel-matched — regression only).
- [ ] **Savings tout** — heading, body, CTA, footnote alignment/size.
- [ ] **Bottom-nav** — band heading (Bebas), Learn More CTA type.
- [ ] **ISI / Safety bar** — USES/IRI heading hierarchy, body line-height, job-code; content verbatim (audit, don't restyle copy).
- [ ] **Footer** — column headings, link type, legal copy.
- [ ] **Per-viewport sweep** — repeat each block at 390/425, 768/834, 1440; capture deltas only where they differ by tier.
- [ ] **Cross-page** — apply/verify on index, how-to-take, talk-to-a-doctor; confirm shared blocks consistent.
- [ ] **Regression** — after each fix, re-check the three viewport tiers + prior session fixes intact; zero new horizontal overflow.
- [ ] **Report** — per-block × per-viewport match table + list of files touched.

## Notes
- **Execution requires Execute mode.** This artifact is the plan only.
- Work proceeds **block-by-block, gated on your screenshots/values**; I'll request the next block's reference as I reach it rather than guessing.
- Given the breadth, expect this to run as a sequence of focused passes (one block/viewport set at a time) so each fix is verified and regression-checked before moving on.
- Blocks already matched this session are treated as **regression-only** unless your screenshot shows a remaining delta.
