I'll inspect the current local font setup so the download plan is accurate against what live actually loads.# Download Live find-relief Fonts Plan

## Goal
Download every font file that live `linzess.com/find-relief` actually loads (captured from the Network → Font panel) and reconcile them with the local `fonts/linzess/` set so the migrated pages render with byte-correct faces. The screenshot shows 10 font requests; this plan maps each to its family, source, and local destination.

## Live font requests (from Network panel screenshot)
| # | Request name | Family (decoded) | Initiator | Live size | Notes |
|---|---|---|---|---|---|
| 1 | `S6u9w4BMUTPHh50XSwiPGQ.woff2` | **Lato** (Google subset) | `css2?family=Bebas+Neue&family=Lato` | 22.5 kB | Google Fonts Lato |
| 2 | `S6uyw4BMUTPHjx4wXg.woff2` | **Lato** | same css2 | 23.6 kB | Google Fonts Lato |
| 3 | `abbv_iconFont.woff` | **abbv-iconFont** | `css-clientlib-all.min...css` | 21.7 kB | icon glyphs |
| 4 | `S6u9w4BMUTPHh6UVSwiPGQ.woff2` | **Lato** | css2 | 23.1 kB | Google Fonts Lato |
| 5 | `JTUSjIg69CK48gW7PXoo9WIhyw.woff2` | **Bebas Neue** (Google) | css2 | 13.8 kB | Google Fonts Bebas Neue |
| 6 | `BasicCommercialLTCom-Blk.ttf` | **BasicCommercialLT Black** | `linzess-global.css` | 61.8 kB | self-hosted legal-bold |
| 7 | `BasicCommercialLTCom-Roman.ttf` | **BasicCommercialLT Roman** | `linzess-global.css` | 82.6 kB | self-hosted legal-body |
| 8 | `S6uyw4BMUTPHjxAwXjeu.woff2` | **Lato** | css2 | 5.6 kB | Google Fonts Lato (subset) |
| 9 | `data:application/fo...` | (inline data-URI font) | `find-relief:6606` | 4.3 kB | inline base64 — not a downloadable file |
| 10 | `KFO7CnqEu92Fr1ME7kSn66aGLdTylUAMa3yUBA.woff2` | **Roboto** (Google) | `anchor?ar=1&k=...` | 40.2 kB | likely 3rd-party widget (cookie/anchor), not brand copy |

## Reconciliation with current local `fonts/linzess/`
Local inventory (already on disk):
- `Lato-Regular.woff2` (23.6 kB ✓), `Lato-Bold.woff2` (23 kB ✓), `Lato-ExtraBold.woff2` **(5.4 kB — suspiciously small, likely a broken/placeholder file → re-download)**
- `BasicCommercialLT-Roman.woff2` (177 kB) and `BasicCommercialLT-Black.woff2` (126 kB) — **byte-identical to the sibling `.ttf` files → these "woff2" are actually TTF bytes renamed.** Live serves true `.ttf` (`BasicCommercialLTCom-Roman.ttf` / `-Blk.ttf`). Decide whether to keep the renamed-woff2 or pull live's genuine TTFs.
- `BebasNeue-Regular.ttf` (in `fonts/`, 57 kB) ✓ — live uses a Google woff2 subset instead.
- `abbv-iconFont.woff` / `abbv_iconFont.woff` (in `fonts/`, 43 kB) ✓ already present.

## Key findings / decisions
1. **Lato + Bebas Neue are Google Fonts on live** (css2 API woff2 subsets), but the repo self-hosts its own Lato woff2 + Bebas TTF. Downloading the Google hashed files (`S6u*`, `JTUSj*`) gives the exact live bytes but with opaque names — the repo convention is friendly names. Likely keep self-hosted faces; only fix the broken `Lato-ExtraBold.woff2`.
2. **`Lato-ExtraBold.woff2` (5.4 kB) is almost certainly corrupt/stub** — extra-bold (800) is used for eyebrows & CTA labels across find-relief. This is the highest-value real fix in this request.
3. **BasicCommercialLT local "woff2" are mislabeled TTFs.** Live serves `.ttf`. Either (a) pull live `BasicCommercialLTCom-{Blk,Roman}.ttf` and point `fonts.css` at them, or (b) generate real woff2 from the TTFs. Current `fonts.css` references `BasicCommercialLT-{Roman,Black}.woff2`.
4. **`KFO7Cnq…` (Roboto) and the `data:` font** come from a third-party anchor/cookie widget, not brand content — exclude from the brand font set.

## Constraints
- Downloading requires **Execute mode + network access** (Bash `curl`/`wget`). Plan mode can only read local state.
- Don't break existing `@font-face` URLs in `styles/linzess/fonts.css` — any new file must match the declared `src:` path or the declaration gets updated in lockstep.
- No commits without explicit confirmation.

## Checklist
- [x] Capture live font request list from Network panel (10 requests, decoded above).
- [x] Inventory local `fonts/` + `fonts/linzess/`; flag `Lato-ExtraBold.woff2` (5.4 kB, likely broken) and mislabeled BasicCommercialLT "woff2" (TTF bytes).
- [ ] Confirm scope with user (decisions below) via AskUserQuestion.
- [ ] Re-download genuine **Lato ExtraBold (800)** woff2 → `fonts/linzess/Lato-ExtraBold.woff2`; verify file size sane (~25 kB) and `@font-face` 800 resolves.
- [ ] (If chosen) Download live `BasicCommercialLTCom-Blk.ttf` + `-Roman.ttf`; either replace the mislabeled woff2 or update `fonts.css` `src:` to `.ttf`.
- [ ] (If chosen) Download Google woff2 subsets for Lato/Bebas (`S6u*`, `JTUSj*`) for byte-exact live parity; otherwise keep self-hosted.
- [ ] Exclude `KFO7Cnq…` (Roboto, 3rd-party) and the inline `data:` font from brand set.
- [ ] Verify each downloaded file loads (no 404, correct glyph render) on all 3 find-relief pages at the brand weights (400/700/800 Lato, 400 Bebas, 400/900 legal).
- [ ] Report which files were added/replaced and any `fonts.css` edits.

## Open decisions (to resolve before executing)
1. Self-hosted friendly-named faces (current repo convention) **vs** byte-exact Google hashed files from live?
2. BasicCommercialLT: pull live genuine `.ttf` and update `fonts.css`, **or** convert the existing TTFs to real woff2?
3. Scope: just fix the broken `Lato-ExtraBold.woff2`, **or** full re-download of all live brand fonts?

## Notes
- **Execution requires Execute mode** (network + file writes). This artifact is the plan only.
- The single clearest defect is the 5.4 kB `Lato-ExtraBold.woff2` — if extra-bold text on find-relief looks like faux-bold or falls back, that file is the cause.
- `data:` and `KFO7Cnq…`/`anchor` requests are third-party/inline and out of scope for brand fonts.
