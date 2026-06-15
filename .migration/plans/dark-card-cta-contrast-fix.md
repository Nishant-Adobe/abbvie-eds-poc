I'll inspect the current CTA button colors on the dark vs light sign-up cards before drafting the fix plan.The defect is clear. Let me find the existing CSS rules for these button classes to scope the fix.I have what I need. The current rule paints **all** sign-up CTAs purple fill + white text — which is invisible on the dark-purple "Call" card (purple button on purple card, as the screenshot shows). The live design uses an inverted/secondary style on the dark card.# Find-Relief Sign-Up Cards — Dark-Card CTA Button Color Fix

## Goal
Fix the invisible CTA on the dark-purple "Call" sign-up card in the `find-relief-signup` cards-grid block. The middle card has a **purple button on a purple background** (no contrast). Match live: the dark card's button becomes a **white fill with dark-purple text + chevron** (inverted), while the two light-purple cards keep their purple-fill/white-text buttons. Scope: the selected `cards-grid-icon-image-card find-relief-signup` block only.

## Root cause (measured at desktop, how-to-take page)
The brand JS assigns the middle card `abbv-button-secondary` (vs `abbv-button-primary` on the outer two), signalling an inverted style. But the brand CSS paints **all** sign-up CTAs identically — purple fill, white text — ignoring the secondary class:

| Card | Surface | Card bg | CTA class | CTA bg (now) | CTA text | Problem |
|---|---|---|---|---|---|---|
| 0 "Text" | light | `#D9D7F9` | `abbv-button-primary` | `#422E83` purple | white | ✅ OK (contrast) |
| 1 "Call" | **dark** | `#422E83` | `abbv-button-secondary` | `#422E83` purple | white | **❌ purple-on-purple, invisible** |
| 2 "Click" | light | `#D9D7F9` | `abbv-button-primary` | `#422E83` purple | white | ✅ OK |

The rule at `styles/linzess/styles.css:2042-2056` selects `.cta a` / `.button-container a.button` generically with `background: var(--color-brand-primary)` — no override for the secondary/dark-card button.

## Root-cause tag
**#3 Custom class + brand global** — brand-scoped CSS in `styles/linzess/styles.css`, targeting the dark-card CTA (`abbv-button-secondary`, or the CTA inside `.background-dark-purple`). No base-block, token, JS, or HTML/content change.

## Fix approach (lowest-specificity, additive)
Add one scoped rule after the existing CTA block (≈line 2056) that inverts **only** the dark-card button:
- Selector: `…find-relief-signup .background-dark-purple .cta a` (and/or `a.abbv-button-secondary`) — target by the dark surface so it can't leak to the light cards.
- `background: var(--color-text-on-dark, #fff)` (white fill)
- `color: var(--color-brand-primary, #422E83)` (purple text)
- Chevron `::after` inherits `currentColor` → ensure it's purple (it uses font color, so it follows automatically).
- Keep padding, radius, font, size identical to the primary buttons (only color inverts).

Leave cards 0 & 2 (`abbv-button-primary`, light surface) untouched.

## ⚠️ Constraint
Live linzess.com renders **degraded** here (design CSS 404s), so I'll match the **screenshot intent** (white-ish button on the dark card) + your confirmed choice (white fill, purple text). Exact white/purple values come from existing brand tokens (`--color-text-on-dark`, `--color-brand-primary`).

## Checklist
- [ ] Re-confirm at desktop + mobile: dark "Call" card CTA currently renders `#422E83` on `#422E83` (no contrast); light cards OK.
- [ ] Add scoped rule in `styles/linzess/styles.css` (after line ~2056) inverting the dark-card CTA: white fill + purple text + purple chevron, targeted via `.background-dark-purple` (so light cards are unaffected).
- [ ] Verify dark "Call" card button = white bg, purple text/chevron, fully legible.
- [ ] Confirm light "Text" and "Click" card buttons UNCHANGED (purple fill, white text).
- [ ] Regression: mobile 390/425px (cards stack; dark card is middle) and desktop 1440px.
- [ ] Cross-page: the index `find-relief` page does NOT have this sign-up block in `find-relief-howtotake`? Verify scope — sign-up block appears on how-to-take; confirm no unintended match on index page sign-up/prescribed blocks.
- [ ] Confirm no leak to `find-relief-prescribed` cards (which also have dark cards) — selector must stay scoped to `find-relief-signup`.
- [ ] Report before/after CTA colors per card.

## Notes
- Execution requires **Execute mode.**
- Pure CSS in `styles/linzess/styles.css` (lint-exempt, served directly), scoped to `.find-relief-signup` dark card. No HTML/content, JS, token, or base-block edits.
- The `abbv-button-secondary` class is already present on the dark card (brand JS), so the inversion aligns with the intended live semantics rather than inventing a new variant.
