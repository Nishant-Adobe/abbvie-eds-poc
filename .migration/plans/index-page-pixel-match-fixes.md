# Find-Relief Section — Pixel-Perfect Block Layout Match Plan

## Goal
Bring every block across the **full find-relief section** to a pixel-perfect (±1–2px) match with live linzess.com at **mobile (390/425px), tablet (768/834px), and desktop (1440px)**. Live reference screenshots are now **provided** (desktop @2560/50% + mobile @425px, covering every block) — these are the trusted pixel targets (linzess.com renders unstyled in this env, so screenshots replace live-DOM measurement).

## Reference screenshots received (this turn)
Desktop + mobile captures covering: hero, section-nav pill bar, **Talk-to-a-Doctor "What To Talk About" card**, Gut Check tout, both videos, Prescribed cards, Sign-up cards, Tabs/dosing, Savings tout, Bottom nav, ISI, footer.

## Candidate deltas spotted from screenshots (to verify in Execute)
| Block | Live (screenshot) | Local (known) | Likely delta |
|---|---|---|---|
| **Talk-to-a-Doctor "What To Talk About"** | **Dark-purple rounded card**, 2×2 grid (desktop) / stacked (mobile), each item led by an **orange circular checkmark** icon; white headings + body | Plain bulleted `<list>`, no card, no checkmark icons | **MAJOR — missing card surface + checkmark icons** |
| Section-nav | Desktop: centered dark-purple **pill** "Talk to a Doctor / How to Take LINZESS"; mobile: "JUMP TO: …" collapsed bar | matches pattern | verify pill radius/centering at desktop |
| Hero | Bebas headline, FIND RELIEF eyebrow + orange underline, full-bleed | matches | verify headline scale/crop per viewport |
| Videos | 16:9 poster, circular play, light-purple caption bar w/ title + View Transcript | matches | verify play-btn size, caption padding |
| Prescribed cards | Refill (dark) + Keep Updated (light); badge straddles top | matches | verify badge offset, card padding |
| Sign-up cards | Text/Click light, **Call dark w/ white button** | ✅ fixed | regression only |
| Savings tout | "90 DAYS FOR $30" banner, purple heading, Sign Up Now | matches | verify banner size, CTA |
| Bottom nav | Purple band, **orange "Learn More" buttons**, Check My Symptoms / See Resources | matches | verify band, CTA color/size |
| Gut Check / Dosing / Tabs | — | ✅ already matched | regression only |

## Pages in scope (all under `migration-dinesh/find-relief/`)
| Page | Path |
|---|---|
| Index (Find Relief) | `find-relief/` |
| How to Take LINZESS | `find-relief/how-to-take-linzess` |
| Talk to a Doctor | `find-relief/talk-to-a-doctor` |

## Methodology (per block — fix-loop Step 0 hard gate)
1. Measure pixel targets from the **provided screenshot** at each viewport tier.
2. Capture local computed styles + screenshot at matched viewport.
3. Build per-descendant **pixel delta table** (target vs local).
4. Root-cause tag (12-category taxonomy).
5. Fix lowest-specificity-first, scoped to `find-relief-*` in `styles/linzess/styles.css` (brand block CSS / block-config only if structural).
6. Re-render, compare to screenshot until ±1–2px.
7. Regression at all three viewport tiers + cross-page after each block.

## Constraints & guardrails
- **No base-block / token / JS edits** without STOP-and-ask.
- **No HTML/content edits** to `.plain.html` except at explicit request; ISI/safety copy verbatim (pharma-fidelity).
- Each fix scoped to its `find-relief-*` class — no cross-block/cross-brand leak.
- The "What To Talk About" card may need authored custom classes (e.g. `abbv-flex` card markup) — if it requires content/structure changes beyond CSS, STOP and confirm approach before editing.

## Checklist
- [ ] **Talk-to-a-Doctor "What To Talk About" card** — verify local vs screenshot; build the dark-purple 2×2 card with orange checkmark icons (desktop) / stacked (mobile). Determine CSS-only vs structural; STOP-ask if structural.
- [ ] **Hero** — headline scale, eyebrow + orange underline, image crop at 390/425, 768/834, 1440.
- [ ] **Section nav** — desktop centered pill vs mobile collapsed "JUMP TO" bar; radius, padding.
- [ ] **Gut Check image-text** — regression (mobile stack + desktop cut-out already fixed); confirm vs screenshot.
- [ ] **Video blocks ×2** — play-btn size, poster crop, caption bar spacing/title/View Transcript.
- [ ] **Prescribed cards** — badge offset, card padding, dark/light pairing, type scale.
- [ ] **Sign-up cards** — regression (dark-card CTA already inverted); confirm vs screenshot.
- [ ] **Tabs** — regression (pill done); confirm track inset/active state.
- [ ] **Dosing cards** — regression (pixel-matched); confirm no drift, first-card clearance intact.
- [ ] **Savings tout** — banner size, heading, Sign Up Now CTA, footnote.
- [ ] **Bottom nav** — purple band height, orange Learn More CTA + arrow, heading scale.
- [ ] **ISI / Safety bar** — type scale, expand-bar (content already verbatim).
- [ ] **How-to-take page** — re-verify shared blocks at all viewports.
- [ ] **Talk-to-a-Doctor page** — full per-block critique.
- [ ] **Tablet sweep (768/834px)** — column-count transitions for all image-text & cards-grid blocks.
- [ ] **Cross-cutting regression** — 390/425 + 768/834 + 1440 across all three pages; zero regressions vs prior approved state.
- [ ] **Report** — per-block × per-viewport match table + files touched.

## Notes
- **Execution requires Execute mode.** This artifact is the plan only.
- Screenshots are now in hand for the index/how-to-take blocks at desktop + 425px; I'll request **tablet (768/834px)** captures for any block whose column count changes there, since none were provided at that width.
- Top priority on execute: the **"What To Talk About At Your Visit" card** — it's the one block that appears structurally unstyled locally (plain list) vs a designed dark-purple checklist card on live.
- Already-matched blocks (dosing, sign-up CTA, gut-check, tabs, first-card clearance) are **regression-only** unless a screenshot shows a remaining delta.
