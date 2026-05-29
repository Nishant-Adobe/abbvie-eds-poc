---
name: aemcoder-section-fix-loop
description: Repair a single section of an aemcoder-migrated page that diverges from the live source. Codifies the diff → root-cause-tag → lowest-specificity-fix → regression-check loop that prevents back-and-forth iterations. Use whenever a section on a migrated page does not pixel-match the live source — hero, brush card, glacier section, header, safety bar, brand explorer, cards-grid, etc. Trigger phrases include "section not matching", "fix section X with aemcoder", "pixel diff for section", "{block-name} not matching live", "header/hero/safety-bar/footer not matching", "regression on {page}".
---

# aemcoder Section Fix Loop

## Execution context

**You execute this workflow directly.** When the user reports a section
not matching, follow the 8-step loop below. The prompt template in
`../aemcoder-migration-orchestrator/templates/section-fix-prompt.md`
is your internal checklist, not output for another tool.

---

Per-section repair workflow for any block on a migrated page
that diverges from live source. Replaces the ad-hoc iterate-on-screenshot
pattern with a structured 8-step loop:

```
1. Preconditions   → 2. Desktop baseline → 3. Side-by-side diff
4. Behavior diff   → 5. Root-cause tag  → 6. Fix proposal
7. Apply (1 at a time) → 8. Cross-page regression sweep
```

The loop has hard stop conditions (≥90% match per viewport, 3-round cap,
escalation triggers) so we don't churn forever.

## Related skills

- **aemcoder-migration-orchestrator** — Parent skill governing the
  end-to-end migration phases. This fix-loop is invoked from Phase B/C/D
  when a section diverges.
- **pharma-content-fidelity** — Auto-triggers when the section is safety-bar,
  ISI, references, dosing, or any other regulated-copy block. Content diff
  precedes visual diff for those blocks.
- **building-brand-blocks** — Reference for editing brand block CSS
  partials (the most common fix target).
- **abbvie-design-tokens** — Reference for token values when root-cause is
  brand-wide token divergence.

## When to use this skill

Trigger this skill on any of:
- "{section-name} is not matching live" (hero, cards-grid, header, etc.)
- "pixel diff for {section}"
- "regression on {page} after fixing {other-thing}"
- "mobile breakpoint broken for {section}"
- "desktop view broken after mobile fix"
- "fix {section} with aemcoder"

## The 10-category root-cause taxonomy

Every delta gets tagged with exactly one root cause. This is the most
important constraint in the skill — without categorizing, aemcoder defaults
to editing block CSS for what's actually an authoring issue (or vice versa).

| # | Category | Fix scope | File path |
|---|---|---|---|
| 1 | **Author content** | UE field value | UE / `.plain.html` row |
| 2 | **Token** | Brand-wide value | `styles/{brand}/_tokens.css` (with approval) |
| 3 | **Custom class + brand global** | One-off section variant | `classes_commonCustomClass` + `styles/{brand}/_styles.css` |
| 4 | **Brand block CSS partial** | Recurring block pattern | `blocks/{block}/{brand}/_{block}.css` |
| 5 | **Section style variant** | Section-wrapper variant missing | `models/_section.json` + `styles/{brand}/_styles.css` |
| 6 | **Variant** | Recurring block variant | `blocks/{block}/block-config.js` `variations` array |
| 7 | **Asset** | SVG/image/font file | Download to `content/content/dam/abbvie-eds-poc/{filename}` |
| 8 | **Base block CSS** | Bug in base — affects all brands | ESCALATE, do not patch |
| 9 | **Base block JS** | DOM/behavior bug in base | ESCALATE, do not patch |
| 10 | **A11y** | ARIA, focus, alt, touch target | Brand CSS for hit-area; base JS for ARIA (escalate) |
| 11 | **Fragment content** | Fragment doc wrong/stub | Fix fragment source, verbatim from live |
| 12 | **Fragment not referenced** | Block missing entirely | Add Fragment block + reference path in UE |

## Lowest-specificity-first fix ordering (mandatory)

Never skip levels. Apply at the lowest level that resolves the delta:

```
1. Author content / fields      (most reversible)
2. Token                        (brand-wide; requires approval)
3. Custom class + brand global  (page-specific)
4. Brand block CSS partial      (brand-recurring pattern)
5. Section variant              (cross-section pattern)
6. Block variant + JS module    (cross-block pattern)
                                ↓
7. BASE block CSS / JS          ESCALATE — affects all 9 brands
```

If the agent reaches for level 7 without checking 1–6, push back.

## Hard rules

These apply to every section, every viewport, every fix:

1. **No class renaming.** Class names diverge between Platform-C `abbv-*`
   and our EDS naming — do not rename local classes to match live. Match
   the *visual and behavioral outcome* only.
2. **Verbatim content.** Especially for safety / clinical / dosing /
   reference / footnote / job-code copy. Zero paraphrase. (See
   **pharma-content-fidelity** for the full ruleset.)
3. **No `!important`.** Per project convention. If you reach for it, the
   specificity strategy is wrong — escalate.
4. **No base block edits.** Use brand override path. Missing
   `blocks/{block}/{brand}/` folder means inheritance is intentional, NOT
   a gap — don't auto-create unless a real visual delta needs it.
5. **Mobile-first cascade.** `@media (min-width: 600px)` and
   `@media (min-width: 900px)` for progressive enhancement. Avoid
   `max-width` retrofits unless mobile-first restructure would require
   base-block edits.
6. **Project root font-size is 10px.** `0.9rem` = 9px. Use absolute px
   when matching live's `14px`, `16px`, etc.

## The 8-step loop

The exact prompt template is in
`../aemcoder-migration-orchestrator/templates/section-fix-prompt.md`.
Summary:

### Step 1 — Confirm preconditions
- Is `brand: {brand-key}` set in page metadata?
- What variant/custom classes does the local block carry?
- (If relevant) What classes does the live block carry?
- Count match: local instances vs live instances?

### Step 2 — Desktop baseline (regression protection)
Snapshot at 1440px AND 1200px (breakpoint edge — often where bugs hide).
Save before any edit. Diff after EACH fix.

### Step 3 — Side-by-side content + visual diff (no edits)
Capture both at 1440px AND 390px. Table with categories: Layout,
Background/Decoration, Typography, Color, Spacing, Image/Asset, CTA,
Responsive transition, Count/Order, Footnotes/References. Severity per row.

### Step 4 — Behavior diff (interactive sections only)
Headers (hamburger), accordions, modals, safety-bar expand, carousels.
Capture: initial state, open/close triggers, animation, scroll behavior,
focus management, keyboard nav, ARIA attributes.

### Step 5 — Root-cause tag per delta
From the 12-category taxonomy above. Mandatory — every delta gets exactly
one tag.

### Step 6 — Fix proposal (do not apply)
Ordered list per fix:
- Tag from Step 5
- File(s) to touch (exact paths)
- Mobile-first restructure vs additive media query
- Breakpoint(s) used
- Desktop regression risk + how guarded
- Cross-page impact (which other pages share this CSS/fragment)

### Step 7 — Apply one fix at a time
- Apply (partial files + `npm run scaffold:build:block --block-name X
  --brand-name {brand}` if CSS partials touched).
- Desktop regression diff at 1440 + 1200 against Step 2 baseline.
- Mobile snapshot at 390 + 768 tablet.
- Per-fix report.

**Do not batch fixes.** Per-fix isolation makes regressions bisectable.

### Step 8 — Cross-page regression sweep
After all approved fixes:
- Re-snapshot every previously approved page at 390 + 1440.
- Confirm no shared-asset regression on homepage + any page sharing the
  edited fragment / brand CSS partial.

## Stop conditions

- ≥90% match per viewport AND zero desktop regression AND zero cross-page
  regression: stop, await approval.
- Any base block change required: STOP and ask.
- Any token change affecting >1 page or >1 section: ASK before applying.
- 3 fix rounds and still below threshold: STOP, summarize blockers.
- A11y violation requiring base JS: STOP and ask (don't ship known defect).

## Common section types and their dominant root causes

Track these from prior failure patterns so you anchor the diff in the
right place:

| Section type | Most common root causes | Default fix path |
|---|---|---|
| **Hero** | Author content (wrong image asset), Brand block CSS (mobile layout), Asset (missing SVG) | Author + brand CSS partial |
| **Cards-grid (brush card variant)** | Author custom class missing, Asset (brush SVG), Brand block CSS (gold accent) | Custom class + brand global |
| **Header** | Fragment content (per-section nav not authored), Fragment not referenced, Brand block-config (active state per URL) | Fragment + brand block-config |
| **Safety bar** | Fragment content (paraphrased ISI), Pharma-fidelity rules, Brand block CSS (expand state) | Pharma-fidelity + fragment edit |
| **Brand explorer** | Base block JS (hoist logic), Author content (label text), Brand block CSS (bar bg color) | Author + brand CSS (escalate JS) |
| **Section with brushstroke/gradient** | Section style variant missing, Asset (SVG not downloaded), Custom class | Custom class + section variant + asset download |
| **Footer** | Fragment content, Brand block CSS (link colors) | Fragment + brand CSS |
| **Mobile breakpoint regression** | Missing mobile-first base in brand CSS, `!important` in section CSS, image hidden but container still has height | Mobile-first restructure in brand CSS |

## Anti-patterns to call out in aemcoder prompts

Carry these into the section-fix prompt verbatim:
- "Do NOT rename `safety-bar-full-content` → `safety-bar-maximized` to match live"
- "If reaching for `!important`, specificity strategy is wrong — escalate"
- "Author content first, brand CSS last (before base)"
- "Capture baseline BEFORE any edit"
- "Per-fix isolation, never batch"
- "If proposing base-block edit, STOP — escalate"

## When the loop hits 3 rounds without progress

Common escalation paths:
1. **Wrong block selected for section** — Re-do block fit analysis; the
   section may need a different library block.
2. **Author content fundamentally wrong** — Source content may have a
   structure that doesn't fit any library block; flag for content team.
3. **Base block has bug** — Escalate to a separate PR; do not patch in
   migration scope.
4. **A11y defect requiring base JS** — Triage with user: defer fix to
   post-migration ticket, OR accept known defect, OR workaround in brand
   block-config.
5. **Pharma compliance + visual conflict** — Compliance wins; document
   the visual delta as accepted.
