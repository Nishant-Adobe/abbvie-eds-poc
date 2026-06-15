# Find-Relief — Apply All Downloaded Fonts (Match Live Element-by-Element)

## Goal
Every font face live `linzess.com/find-relief` loads is declared in `styles/linzess/fonts.css` and on disk, but two faces — **Lato 900 ("Black")** and **BasicCommercialLT-Bold (700)** — are declared yet **not applied to any element or token**. This plan audits live element-by-element, maps only the faces live actually uses, then **commits** the result (the user's latest instruction).

## ⚠️ Commit scope decision needed
The working tree currently holds **more than this session's font work** — also the 13 downloaded `media_*` image renditions, plus prior uncommitted CSS edits (tabs, safety-bar, Call-card, fonts.css). "Commit" is ambiguous about scope, so this is gated on the question below before any staging happens. No commit will run until both (a) the element-by-element font mapping is actually applied in Execute mode and (b) commit scope is confirmed.

## Current state (verified, read-only)
**Declared `@font-face` (`styles/linzess/fonts.css`):**
| Family | Weight | File | Applied today? |
|---|---|---|---|
| Bebas Neue | 400 | `BebasNeue-Regular.ttf` | ✅ `--heading-font-family` |
| Lato | 400 | `Lato-Regular.woff2` | ✅ `--body-font-family` |
| Lato | 700 | `Lato-Bold.woff2` | ✅ bold body |
| Lato | 800 | `Lato-ExtraBold.woff2` | ✅ eyebrows / CTA |
| **Lato** | **900** | `Lato-Black.woff2` | ❌ **declared, unused** |
| BasicCommercialLT-Roman | 400 | `BasicCommercialLT-Roman.woff2` | ✅ `--font-family-legal` |
| **BasicCommercialLT-Bold** | **700** | `BasicCommercialLT-Bold.ttf` | ❌ **declared, unused** |
| BasicCommercialLT-Black | 900 | `BasicCommercialLT-Black.woff2` | ✅ `--font-family-legal-bold` |

## Constraints
- Live renders **degraded** here (CSS 404s) → element→weight mapping needs user-supplied DevTools/screenshot values or the already-fetched `linzess-global.css` + Google `css2` as proxy. Brand CSS only; **token changes are brand-wide → STOP-and-ask**. Verbatim regulatory copy. Bebas is weight-400-only (ignore weight). No commit/push without explicit confirmation.

## Checklist
- [x] Inventory downloaded font binaries (`fonts/linzess/`).
- [x] Read `@font-face` + token map; identify 2 declared-but-unused faces (Lato 900, BC-Bold 700).
- [ ] **Confirm commit scope** (font work only vs everything in tree) via AskUserQuestion.
- [ ] Obtain live element→font/weight reference for find-relief (gated — degraded live).
- [ ] Capture local computed `font-family`/`font-weight` per element at 390/768/1440.
- [ ] Build live-vs-local delta; flag elements where live uses Lato 900 or BC-Bold 700 and local differs.
- [ ] Decide per-delta scope: token (STOP-and-ask) vs block-scoped `find-relief-*` rule.
- [ ] Apply mapped faces at lowest specificity; keep served + `_partial.css` in sync.
- [ ] Verify each applied face loads (Font Loading API) and renders (no faux-bold/fallback).
- [ ] Regression at 390/768/1440 across index, how-to-take-linzess, talk-to-a-doctor.
- [ ] Stage + commit the confirmed scope with a `fix(linzess):`-style message; report files committed.
- [ ] (Only if explicitly requested) push to `origin/linzess-find-relief`.

## Notes
- **Execution requires Execute mode.** This artifact is the plan only; all steps so far were read-only.
- If the live audit shows **no find-relief element uses Lato 900 or BC-Bold 700**, the correct outcome is to leave them declared-and-available and report that — not force an unused face onto an element (which would diverge from live). In that case the commit would cover only the already-complete declarations/binaries.
