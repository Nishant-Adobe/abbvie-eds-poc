I'll read the find-relief page structure to enumerate all blocks before building the critique plan.# Find-Relief — All-Blocks Live Parity Critique Plan

## Goal
Run the structured per-block fix-loop critique across **every block** on the find-relief index page, comparing each to live linzess.com `/find-relief`, prioritizing the **mobile viewport** (425 / 390 / 360px) with **desktop 1440px** regression — same methodology already validated on the dosing cards. Produce a per-block delta table + root-cause tag, then fix only proven deltas (lowest-specificity-first, scoped to `find-relief-*`).

## Block inventory (from index.plain.html)
| # | Block | Class / variant | Line | Prior status |
|---|---|---|---|---|
| 1 | Hero | `hero ... linzess-editorial-hero` | 3 | — |
| 2 | Section nav | `section-nav sticky mobile-menu` | 45 | — |
| 3 | Image-Text (Gut Check) | `image-text find-relief-gut-check` | 86 | partially tuned earlier |
| 4 | Video (Getting on the Same Page) | `video` | 128 | poster fix done |
| 5 | Video (What to Know) | `video` | 156 | poster fix done |
| 6 | Cards-grid (Prescribed) | `cards-grid-icon-image-card find-relief-prescribed` | 175 | — |
| 7 | Cards-grid (Sign-up) | `cards-grid-icon-image-card find-relief-signup` | 209 | — |
| 8 | Tabs (Instructions) | `tabs` | 267 | tablet pill done |
| 9 | Dosing cards (Adults) | `cards-grid-cta-card find-relief-dosing` | 283 | ✅ DONE (this session) |
| 10 | Dosing cards (Pediatric) | `cards-grid-cta-card find-relief-dosing` | 358 | ✅ shares CSS |
| 11 | Image-Text (Savings tout) | `image-text find-relief-savings-tout` | 430 | savings footnote done |
| 12 | Cards-grid (Bottom nav) | `cards-grid-cta-card find-relief-bottom-nav` | 478 | 2nd band removed earlier |
| 13 | ISI / Safety bar | `isi` + `safety-bar split` | 523/531 | regulated copy — pharma-fidelity |

## Methodology (per block — fix-loop Step 0 hard gate)
For each block, in order:
1. Capture **live** computed styles + screenshot at 425px (and 390/360 where layout shifts).
2. Capture **local** computed styles at matched viewport.
3. Build a one-row-per-descendant **delta table** (display, sizing, padding/margin/gap, font, color, background, radius, position).
4. Tag each delta with the 12-category root cause.
5. Fix lowest-specificity-first, scoped to the block's `find-relief-*` class.
6. Desktop 1440px regression after each block.
7. ISI/safety-bar: **content fidelity first** (verbatim copy, job codes) before any visual diff.

## ⚠️ Known constraint
Live linzess.com renders **degraded** in this environment (design stylesheet 404s, framework JS fails to decrypt). For blocks where decorative CSS can't be read live, I'll request a **screenshot** for that block (as done for dosing) rather than trust an unstyled read. Text metrics + DOM structure remain trustworthy.

## Checklist
- [ ] **Block 1 — Hero:** mobile critique (headline size/line-height, eyebrow, background, behind-nav offset) vs live; fix scoped deltas.
- [ ] **Block 2 — Section nav:** sticky "JUMP TO" bar — mobile collapsed state, pill color, dropdown behavior; verify against live.
- [ ] **Block 3 — Image-Text (Gut Check):** image fill + cut-out overflow, content alignment, "Actor Portrayal" caption, CTA; confirm earlier tuning still matches.
- [ ] **Block 4 & 5 — Video blocks:** poster crispness, play-button overlay, aspect ratio, title + transcript link spacing at mobile.
- [ ] **Block 6 — Cards-grid (Prescribed):** two-card layout (Refill / Keep Doctor Updated), stacking, padding, heading/body type at mobile.
- [ ] **Block 7 — Cards-grid (Sign-up):** three sign-up cards (Text/Call/Click), CTA buttons, stacking + spacing at mobile.
- [ ] **Block 8 — Tabs:** re-verify tablet pill + mobile tab bar; active/inactive states, panel join.
- [ ] **Block 9/10 — Dosing cards:** ✅ already matched this session — include only as regression check (no edits expected).
- [ ] **Block 11 — Image-Text (Savings tout):** "$30" image, body copy, Sign-Up CTA, footnote size/alignment at mobile.
- [ ] **Block 12 — Cards-grid (Bottom nav):** Check My Symptoms / See Resources tiles — layout, "Learn More" CTA, arrow at mobile.
- [ ] **Block 13 — ISI / Safety bar:** **content fidelity first** (verbatim ISI, USES, job codes US-LIN-*), then floating-bar expand state + typography at mobile.
- [ ] **Cross-cutting regression:** after all fixes, re-sweep 425 / 390 / 360 / 1440px and the sibling **how-to-take** page; confirm no block regressed.
- [ ] **Report:** per-block match status table + list of files touched (all expected under `styles/linzess/`, `blocks/*/linzess/`, or fragment docs).

## Notes
- This artifact is the plan only. **Execution requires Execute mode.**
- Blocks already matched (dosing) or previously approved (tabs pill, savings footnote, bottom-nav removal) are treated as **regression-only** unless a fresh delta appears.
- Any base-block, token, or >1-page change will **STOP and ask** before applying. ISI copy changes follow pharma-content-fidelity (zero paraphrase).
- Per-block screenshots may be requested where live renders unstyled.
