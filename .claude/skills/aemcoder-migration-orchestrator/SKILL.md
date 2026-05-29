---
name: aemcoder-migration-orchestrator
description: Orchestrate end-to-end page migration to the multi-brand EDS project using aemcoder.adobe.io. Use whenever the user wants to migrate a page from a live AbbVie commercial pharma brand site (rinvoqhcp.com, skyrizihcp.com, linzess.com, mavyret.com, venclexta.com, etc.) to the project using aemcoder. Provides the canonical first-prompt scaffold, sequences phases A→D, owns approval gates, references aemcoder-section-fix-loop for per-section repairs and pharma-content-fidelity for regulated copy. Trigger phrases include "migrate page with aemcoder", "use aemcoder to migrate", "start migration for X brand", "next page migration", "aemcoder migration".
---

# aemcoder Migration Orchestrator

## Execution context

**You ARE aemcoder.** This skill is internal guidance for YOU to follow
directly when migrating pages. You do not generate prompts for a separate
tool — you execute the workflow yourself: scraping, authoring content,
writing CSS, validating in preview, and reporting results back to the user.

The templates in `templates/` are reference documents that encode the
hard rules and workflow steps. Read them as your own instructions, not as
copy-paste output for another system.

---

This skill governs the full lifecycle of migrating any commercial pharma
brand page from a live `*.com` source into the multi-brand AbbVie EDS POC
project.

The skill exists because page migrations historically took 80+ back-and-forth
rounds due to recurring failure modes (paraphrasing safety copy, editing
base when brand was right, regression on desktop after mobile fix,
class-name chasing, premature commits, etc.). This skill bakes those
lessons into a single workflow so subsequent pages migrate in a handful of
rounds.

## Related skills

- **aemcoder-section-fix-loop** — Per-section diff → root-cause → fix loop.
  Invoke whenever a section diverges from live source after the initial
  authoring pass.
- **pharma-content-fidelity** — Always-on overlay for any block carrying
  regulated copy (safety-bar, ISI, dosing, references, indication, Boxed
  Warning). Auto-triggers; this orchestrator pulls its hard rules into the
  first-prompt template.
- **abbvie-page-migration** — General Platform-C → EDS migration patterns
  (URL analysis, page templates, DOM-to-block mapping). This orchestrator
  wraps it with the aemcoder-specific workflow.
- **abbvie-block-library** — Reference for the 22 block types × 47 variations
  available in the project.
- **abbvie-design-tokens** — Brand token reference per brand.
- **building-brand-blocks** — Block development with brand override CSS
  (the LEVER aemcoder pulls when a brand-level fix is needed).
- **ue-component-model** — UE component-model JSON wiring for new authoring
  fields.

## When to use this skill

Trigger this skill on any of:
- "migrate page with aemcoder", "use aemcoder to migrate"
- "next page migration" (after an earlier page is approved)
- "start migration for {brand}" (any commercial pharma brand)
- "migrate to {brand} EDS" combined with a live URL
- Any first-time aemcoder invocation against this repo

## Hard rules (apply throughout)

The full list lives in `templates/first-prompt.md` Section 2. Summary:

| Rule cluster | Headline |
|---|---|
| **Content fidelity** | Verbatim from live source DOM. No paraphrase, reorder, spelling fix. |
| **Class names** | Diverge by design. Do NOT rename local classes to match `abbv-*`. |
| **A11y** | Single H1, alt text, aria-label on icon-only, touch targets ≥44px. |
| **Scope ladder** | Author → custom-class+brand-global → brand-block override → token (with approval) → BASE = ESCALATE. |
| **No `!important`** | Never. |
| **Brand override is opt-in** | Missing `blocks/{block}/{brand}/` is intentional inheritance, NOT a gap. |
| **Regression protection** | Baseline before edit; diff every viewport of every approved page after edit. |
| **Fragments** | Pharma sites often per-condition nav — verify before assuming shared. |
| **Assets** | Live SVG/PNG → download to DAM. Never simulate with CSS gradients. |
| **Responsive** | Mobile-first; 10px root font-size; absolute px for matching live `14px`. |
| **Approval gates** | NEVER commit/push without explicit user approval. NEVER declare "done" without per-viewport screenshots + cross-page regression check. |

## Workflow phases

```
Phase A → Phase B → Phase C → Phase D
(audit)    (page 1)    (pages 2..N)    (cross-page QA)
```

### Phase A — Site-wide design audit (run once per brand, not per page)

Skip if previously done for this brand.

1. Aemcoder scrapes live homepage + 1 deeper page to extract design system.
2. Diff against `styles/{brand}/_tokens.css`. Report mismatches.
3. Confirm `_fonts.css` covers all weights/styles used by live source.
4. **User approval gate.** Do not modify tokens without explicit per-delta
   approval.

### Phase B — Single-page migration (page 1 of any batch)

Always the first page of the batch creates the infrastructure subsequent
pages depend on (fragment references, page metadata pattern, custom-class
naming, asset DAM paths).

1. Scrape live page; extract sections in document order.
2. Map each section to best-fit block from existing library. **Prefer reuse.**
   No new blocks. If a block is missing, STOP and ask.
3. Generate UE authoring tree: per-block field values matching
   `_{block-name}.json` model.
4. Apply `brand: {brand}` page metadata.
5. Render locally (`aem up`); pixel diff vs live at 1440 + 390.
6. For any section <90% match, invoke **aemcoder-section-fix-loop**.
7. **User approval gate** before moving to Phase C.

### Phase C — Cross-page reuse (pages 2..N of a batch)

For each subsequent page, BEFORE authoring:
1. Section-by-section structural diff vs already-approved pages.
2. Categorize each section: **REUSE** (1:1 author swap) / **VARIATION**
   (same block, different config) / **NEW** (full block-fit analysis).
3. Default to REUSE. NEW sections require full Phase B treatment.

For VARIATION sections that need a one-off styling delta, prefer a custom
class + brand global CSS rule over creating a new brand block override
(which would bleed into pages 3..N unexpectedly).

### Phase D — Cross-viewport + cross-page QA

1. Per-section pixel match table at 1440 / 768 / 390.
2. Confirm previously approved pages unregressed (use Phase B baselines).
3. Verify safety-bar fragment unchanged across all pages.
4. A11y sweep (single H1, alt text, ARIA, heading order, touch targets).
5. Performance: ≥95 Lighthouse, no preload hints, no third-party in head.
6. **User approval gate** before commit/push.

## How to start a new page migration

```
1. Read templates/first-prompt.md as your internal guidance
2. Mentally fill in {{...}} placeholders (BRAND_NAME, BRAND_KEY, TARGET_URL, etc.)
3. Skip sections that don't apply (Phase A if done, batch table if standalone)
4. Execute the workflow directly — scrape, author, render, validate
5. Present summary + any clarifying questions to the user
6. After user answers, begin Phase A (or Phase B if A was previously done)
7. Present each phase output for user approval / rejection
8. For section divergences, follow aemcoder-section-fix-loop workflow
```

## The fix-registry

`fix-registry.json` is the running log of every aemcoder failure mode
observed. Currently 12 entries (AEMCODER-001 through AEMCODER-012), all
incorporated into one of the three new skills.

**Workflow:**
- Load `fix-registry.json` at session start so aemcoder sees known failure modes.
- When a NEW failure mode is observed, append entry with status: `pending`.
- Encode prevention in the appropriate skill; flip status to `incorporated-in-skill`.

This is the same pattern as the reference team's `fix-forward pipeline` —
each bug becomes a registry entry that MUST be prevented upstream before
the next migration.

## Stop conditions

- User has not approved current phase: do not advance.
- A NEW failure mode encountered: log to fix-registry, ask user how to
  proceed (extend a skill? add a rule? accept as known limitation?).
- 3 rounds of back-and-forth on the same section without progress: stop,
  invoke aemcoder-section-fix-loop with stricter parameters or escalate to
  user.
- aemcoder proposes base-block edit: stop, escalate.

## Cross-page reuse cheat sheet for current Rinvoq HCP batch

Pages already migrated (treat as reference for remaining pages):
- Homepage (rinvoqhcp.com) — establishes header fragment, footer fragment,
  safety-bar fragment, brand metadata pattern
- /dermatology — establishes condition-specific header fragment, brushstroke
  section variants, page-specific custom-class patterns

Pages remaining in current batch:
- /dermatology/dosing-lab-monitoring (clinical tables, references)
- /atopic-dermatitis (Dermatology Access — landing page variant)
- /atopic-dermatitis/real-patients (Brightcove video, story-cards)
- /atopic-dermatitis/efficacy/rinvoq-vs-dupixent/level-up (charts, comparisons)

For each remaining page: invoke Phase C reuse-first analysis FIRST.
Most sections should land in REUSE category.

> **Note:** Update this list as pages are approved. This section is a
> living reference — not frozen at skill-creation time.

## Anti-patterns to call out in user-facing prompts

Carry these into aemcoder prompts verbatim (they're in the first-prompt template):
- "Do NOT rename our classes to match live source `abbv-*` naming"
- "Verbatim safety copy — zero paraphrase, zero reorder"
- "Missing `blocks/{block}/{brand}/` is intentional inheritance, NOT a gap"
- "No `!important`, ever"
- "Never commit/push without explicit user approval"
- "Capture desktop baseline BEFORE any mobile fix"
- "When live uses SVG/PNG, download to DAM. Never simulate with CSS"
