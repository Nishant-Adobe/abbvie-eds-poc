I have the font inventory. Let me read the current `@font-face` declarations and how the page references fonts to build an accurate plan.Let me check the token mapping and which declared faces are actually used vs. unused in the page CSS.Bash is blocked in plan mode. Let me use Grep/Read instead.I need to clarify intent before building the plan — the downloaded faces (Lato 900/Black and BasicCommercialLT-Bold) are declared in `fonts.css` but not yet mapped to any element or token, and the earlier finding was that live doesn't actually apply these to find-relief copy.# Find-Relief — Apply All Downloaded Fonts (Match Live Element-by-Element)

## Goal
Every font face that live `linzess.com/find-relief` loads is now declared in `styles/linzess/fonts.css` and present on disk, but two faces — **Lato 900 ("Black")** and **BasicCommercialLT-Bold (700)** — are declared yet **not applied to any element or token**. This plan audits live element-by-element to determine exactly which elements/weights use those two faces, then maps only those, so the migrated pages render with the same faces live uses (no guessing, no blanket swaps).

## Current state (verified, read-only)

**Declared `@font-face` (`styles/linzess/fonts.css`):**
| Family | Weight | File | Applied today? |
|---|---|---|---|
| Bebas Neue | 400 | `/fonts/BebasNeue-Regular.ttf` | ✅ via `--heading-font-family` |
| Lato | 400 | `Lato-Regular.woff2` | ✅ via `--body-font-family` |
| Lato | 700 | `Lato-Bold.woff2` | ✅ (bold body) |
| Lato | 800 | `Lato-ExtraBold.woff2` | ✅ (eyebrows / CTA labels) |
| **Lato** | **900** | `Lato-Black.woff2` | ❌ **declared, unused** |
| BasicCommercialLT-Roman | 400 | `BasicCommercialLT-Roman.woff2` | ✅ via `--font-family-legal` |
| **BasicCommercialLT-Bold** | **700** | `BasicCommercialLT-Bold.ttf` | ❌ **declared, unused** |
| BasicCommercialLT-Black | 900 | `BasicCommercialLT-Black.woff2` | ✅ via `--font-family-legal-bold` |

**Token map (`styles/linzess/tokens.css`):** `--body-font-family: Lato` · `--heading-font-family(-bold): Bebas Neue` · `--font-family-legal: BasicCommercialLT-Roman` · `--font-family-legal-bold: BasicCommercialLT-Black` · `--icon-font-family: abbv-iconFont`.

**The two target faces (Lato 900, BC-Bold 700) are not referenced by any selector or token** outside their own `@font-face` blocks.

## ⚠️ Constraint — live renders degraded here
Per this session's prior findings, `linzess.com` reproducibly loads **unstyled** in this environment (design CSS 404s), so the live element→weight mapping **cannot be read directly via DevTools here**. The element-by-element audit therefore needs a reliable live reference. This plan is **gated on obtaining live computed `font-family` + `font-weight` per element** (user-supplied screenshots/DevTools values, or the live `linzess-global.css` / Google `css2` weight declarations already fetched this session as a proxy).

> Note from prior fetch this session: Google `css2` serves Lato **400/700/900** (no 800) and Bebas 400; `linzess-global.css` self-hosts BasicCommercialLT Roman/Bold/Black. So live *does* ship Lato 900 and BC-Bold — the open question is **which elements** use them on find-relief specifically.

## Approach (element-by-element, lowest-specificity, brand-scoped)
1. **Build the live weight map.** For each text element across the find-relief block set (hero H1/eyebrow, section H3 titles, eyebrows, body, card headings/body, CTA labels, tab labels, ISI USES/IRI/H4/H5/body, footnotes, footer), record live's computed `font-family` + `font-weight` at desktop + mobile.
2. **Diff against local.** For each element, compare live vs the migrated page's current computed face/weight. Flag only elements where live uses **Lato 900** or **BC-Bold 700** but local renders a different weight/family (e.g. local Lato 800 where live is 900, or local BC-Black 900 where live is BC-Bold 700).
3. **Map the deltas.** Apply the correct face at the **lowest-specificity** point:
   - If a delta is systemic (e.g. all eyebrows are Lato 900 on live), repoint the relevant **token** (`--font-family-legal-bold`, or introduce `--font-weight-eyebrow`) — but token edits are brand-wide → **STOP-and-ask before changing a token**.
   - If a delta is block-specific, scope the rule to the `find-relief-*` class in `styles/linzess/styles.css` or `blocks/*/linzess/*.css`.
4. **Keep served CSS + `_partial.css` in sync** for any `blocks/*/linzess/` edit.
5. **Verify load + render.** Confirm each newly-applied face loads (Font Loading API shows `loaded`) and the element renders in the correct face at the mapped weight, with no faux-bold/fallback.
6. **Regression + cross-page** at 390/768/1440 on index, how-to-take-linzess, talk-to-a-doctor.

## Guardrails
- Brand CSS only (`styles/linzess/*`, `blocks/*/linzess/*`). **No base-block/JS edits** without STOP-and-ask.
- **Token changes are brand-wide → confirm before applying** (affects all linzess pages, not just find-relief).
- Verbatim regulatory copy — ISI/safety/job-code styling only, never content.
- Bebas Neue is weight-400-only: ignore `font-weight` on Bebas headings (a no-op) when matching live.
- No `!important` unless overriding an existing `!important` rule.
- No commit/push without explicit confirmation.

## Checklist
- [x] Inventory downloaded font binaries on disk (`fonts/linzess/`).
- [x] Read current `@font-face` declarations + token map; identify the 2 declared-but-unused faces (Lato 900, BC-Bold 700).
- [ ] **Obtain live element→font/weight reference** for find-relief (gated — degraded live render here; needs user screenshots/DevTools values or proxy from `linzess-global.css` + `css2`).
- [ ] Capture current local computed `font-family` + `font-weight` per text element across all find-relief blocks at desktop + mobile.
- [ ] Build the live-vs-local delta table; flag only elements where live uses **Lato 900** or **BasicCommercialLT-Bold 700** and local differs.
- [ ] Decide scope per delta: token-level (STOP-and-ask) vs block-scoped `find-relief-*` rule.
- [ ] Apply mapped faces at lowest specificity; keep served + `_partial.css` in sync for any block CSS.
- [ ] Verify each applied face loads (Font Loading API) and renders correctly (no faux-bold/fallback) at the mapped element.
- [ ] Regression at 390/768/1440; cross-page check on index, how-to-take-linzess, talk-to-a-doctor.
- [ ] Report final element→face map (which elements now use Lato 900 / BC-Bold 700) and files touched.

## Notes
- **Execution requires Execute mode.** This artifact is the plan only; all steps so far were read-only.
- If the live audit shows **no find-relief element actually uses Lato 900 or BC-Bold 700**, the correct outcome is to leave them declared-and-available (already done) and report that — rather than force an unused face onto an element, which would diverge from live.
- The 13 image renditions downloaded earlier and the prior CSS/font edits remain uncommitted; this plan adds only the font-application changes.
