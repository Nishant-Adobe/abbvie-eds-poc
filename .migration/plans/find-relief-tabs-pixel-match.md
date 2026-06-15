# Find-Relief Typography & Style Parity Critique (Font-Family Anchored)

## Goal
Run a full per-block typography and style parity critique across all 3 find-relief pages (index, how-to-take-linzess, talk-to-a-doctor) at 390 / 768 / 1440, matching live linzess.com. This plan is now anchored on the **authoritative font-family set** confirmed from this branch (PR #97 / `linzess-find-relief`), so every font-family delta is checked against the real declared faces rather than guessed.

## Authoritative font families (from branch — `styles/linzess/fonts.css` + `tokens.css`)

**Declared `@font-face` files:**
| Family | Weights available | Source file |
|---|---|---|
| `Bebas Neue` | 400 | `/fonts/BebasNeue-Regular.ttf` |
| `Lato` | 400, 700, 800 | `/fonts/linzess/Lato-{Regular,Bold,ExtraBold}.woff2` |
| `BasicCommercialLT-Roman` | 400 | `/fonts/linzess/BasicCommercialLT-Roman.woff2` |
| `BasicCommercialLT-Black` | 900 | `/fonts/linzess/BasicCommercialLT-Black.woff2` |
| `abbv-iconFont` | (icon glyphs) | icon font (declared elsewhere) |

**Token → family mapping (`tokens.css` :54–59):**
| Token | Family | Role |
|---|---|---|
| `--heading-font-family` | `'Bebas Neue', sans-serif` | Display / section H1–H3 titles |
| `--heading-font-family-bold` | `'Bebas Neue', sans-serif` | (same — Bebas has only 400) |
| `--body-font-family` | `'Lato', sans-serif` | Body copy, eyebrows, card text, nav |
| `--font-family-legal` | `'BasicCommercialLT-Roman', sans-serif` | ISI / regulatory body |
| `--font-family-legal-bold` | `'BasicCommercialLT-Black', sans-serif` | ISI / regulatory bold + USES headings |
| `--icon-font-family` | `'abbv-iconFont'` | Icon glyphs |

**Critique rule derived from this set:**
- Section display headings (H1/H3 titles like "What To Talk About", "Instructions For Adults & Children") → must resolve to **Bebas Neue 400**.
- Eyebrows / body / card / nav text → **Lato** (400 body, 700 bold, 800 extra-bold for eyebrows & CTA labels).
- ISI/regulatory copy → **BasicCommercialLT-Roman** (body) / **BasicCommercialLT-Black** (bold & USES/IRI headings).
- Any element resolving to a different family (e.g. a heading falling back to Lato, or body copy in Bebas) is a **flagged delta**.
- Bebas Neue has only weight 400 — a `font-weight:700` on a Bebas heading does nothing; if live looks heavier, that's a different font or a faux-bold, not a weight bump. Note when auditing.

## Verified baseline so far (index page, current build)
| Element | Family (resolved) | Size / LH / Weight | Color | Align | Verdict |
|---|---|---|---|---|---|
| Hero H1 | Bebas Neue | 40px / 36 / 400 | #fff | start | matches token role ✓ |
| Hero eyebrow | Lato | 12px / 14.4 / 800 | #fff | start | ✓ |
| Talk H2 (eyebrow) | Lato | 12px / 800 uppercase, ls .6 | #422e83 | center | ✓ |
| Talk H3 title | Bebas Neue | 40px / 36 / 400 | #422e83 | center | ✓ (32/30 @390) |
| Talk lead p | Lato | 16px (14 @390) | #4d4d4f | center | ✓ |
| Talk list panel headings | Lato | 24px / 700 (18 @390) | #fff on #422e83 panel | — | ✓ (white-on-purple, not a defect) |
| Instructions H3 | Bebas Neue | 40px / 36 | #422e83 | center | ✓ |
| ISI H3 (USES) | BasicCommercialLT-Black | 16px / 400 | #422e83 | start | family ✓ — confirm intended size vs live |
| ISI body | BasicCommercialLT-Roman | 14px / 16 | #555 | start | ✓ |

All resolved families already match their intended token roles — no font-family fallback defects found on the index sections measured so far.

## Open verification items (need live reference per block)
Live linzess.com renders degraded in this environment, so per-block live values/screenshots from the user are required to find true deltas. Per block, confirm: family resolution, font-size per viewport, line-height, weight, color, alignment, and spacing (margins/gaps).

## ⚠️ Constraints
- Brand CSS only (`styles/linzess/styles.css`, `styles/linzess/tokens.css` for token-level, `blocks/*/linzess/*.css`). No base-block/JS edits without STOP-and-ask. Token changes affect all pages → ASK before applying.
- Verbatim regulatory copy (ISI/safety/job-code) — content untouched, style only.
- No HTML edits in content dir; no commits without explicit confirmation.
- Don't regress the just-corrected tabs control or the white instructions card / dosing-panel seam.

## Checklist
- [x] Pull authoritative font families from branch (`fonts.css` + `tokens.css` token map).
- [x] Inventory index page sections/blocks.
- [x] Baseline index typography; confirm all resolved families match token roles (no fallback defects found).
- [ ] Get live reference (screenshot/values) for **Talk-to-doctor image-text** block first.
- [ ] Delta Talk-to-doctor block vs live @ 390/768/1440 (family, size, LH, weight, color, align, 2-col split 418/532 gap 48, purple panel radius/padding).
- [ ] Critique remaining index blocks: hero+section-nav, dosing cards-grid, savings tout, bottom-nav, ISI/safety-bar.
- [ ] Critique how-to-take-linzess page blocks @ all viewports.
- [ ] Critique talk-to-a-doctor page blocks @ all viewports.
- [ ] Apply fixes block-by-block (lowest-specificity first), regression-check after each.
- [ ] Report before/after per block per viewport.

## Notes
- **Execution requires Execute mode.** This artifact is the plan only; measurements and reads done so far are read-only.
- The branch font set is now the source of truth for all font-family checks — any heading not resolving to Bebas Neue, or body not resolving to Lato, or ISI not resolving to BasicCommercialLT, is a flagged delta.
- Bebas Neue is weight-400-only: ignore any `font-weight` on Bebas headings as a no-op when matching live.
