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

## AEMCODER-XXX failure-pattern IDs

Throughout this skill and its siblings, you'll see references like
"AEMCODER-013" or "AEMCODER-018". These are historical labels for
specific failure patterns observed during prior migrations. The
prevention for each is encoded as a rule inside the relevant skill
(see Anti-patterns sections and the rules cross-referenced by ID).

**When a NEW failure mode is discovered:**
- Add a one-line entry in the "Anti-patterns" section of the most
  relevant skill, with a short description and the prevention rule.
- Optionally cite a new AEMCODER-XXX ID (next available number) for
  consistency with existing references — git history preserves the
  date.
- Do NOT recreate a JSON registry file — prevention rules live in
  skill prose, not in a separate machine-readable file.

## Cross-page regression protection (mandatory gate)

**Triggered by AEMCODER-013 (2026-06-01).** /dermatology/access migration
silently regressed the approved homepage. Phase D's end-of-phase check
was insufficient because regressions had already shipped to local preview
by then. The fix is a **pre-edit gate** + **shared-file inventory**.

### Approved pages (state)

At the start of any fix session, the user names the previously approved
pages in this batch (or ask them). Examples for the active Rinvoq HCP
batch (as of 2026-06-02): homepage (rinvoqhcp.com), /dermatology. Add
to your working list whenever the user approves a new page.

### Shared-File Inventory (edit-to-page mapping)

These file paths affect MULTIPLE pages. Editing any of them requires
regression check against EVERY previously approved page in the active
batch:

| File pattern | Affects | Why |
|---|---|---|
| `styles/{brand}/_tokens.css` | ALL pages w/ `brand: {brand}` metadata | Brand-wide token cascade |
| `styles/{brand}/_fonts.css` | ALL pages w/ `brand: {brand}` | Brand-wide fonts |
| `styles/{brand}/_styles.css` | ALL pages w/ `brand: {brand}` | Brand-wide global rules |
| `styles/{brand}/themes/{theme}/_styles.css` | ALL pages w/ both `brand` + `theme` | Theme overlay |
| `blocks/{block}/{brand}/_{block}.css` | EVERY page using that block + brand | Brand block override |
| `blocks/{block}/block-config.js` | EVERY page using that block (all brands) | Block JS variants — high regression risk |
| `blocks/{block}/{brand}/block-config.js` | EVERY page using that block + brand | Brand block config override |
| Any Fragment doc (`/nav`, `/footer`, `/safety-bar`, etc.) | EVERY page referencing the fragment | Shared content |
| `models/_*.json` partials | EVERY page using affected block | UE authoring contract |
| `component-{models,definition,filters}.json` (root, compiled) | EVERY page | NEVER edit manually — auto-generated |

Files that DO NOT trigger cross-page regression:
- The current page's own `.plain.html` (only affects this page)
- Custom-class rules scoped via `classes_commonCustomClass` + tight
  selectors in `styles/{brand}/_styles.css` (custom class is page-specific)
- A new asset under `content/content/dam/abbvie-eds-poc/` (only affects
  pages that reference it)

### PRE-EDIT GATE (mandatory before editing any shared file)

```
BEFORE editing a file in the Shared-File Inventory:
  1. Confirm the active batch's previously approved pages (from user or session context).
  2. Snapshot EACH approved page at 1440px AND 390px.
  3. Save as "pre-edit-{file-being-edited}-{timestamp}.png" baseline.

DURING editing:
  4. Apply the change.
  5. Run `npm run scaffold:build:block --block-name X --brand-name Y` if
     CSS partials touched.

AFTER editing:
  6. Re-snapshot EACH approved page at 1440 + 390.
  7. Diff against pre-edit baselines.
  8. Any unintended visual change on ANY approved page = REGRESSION.
  9. If regression: REVERT, narrow the fix scope (custom class + scoped
     rule instead of brand-wide), re-attempt.
  10. Only declare done when ALL approved pages match their baselines.
```

### POST-EDIT VERIFICATION (mandatory before user approval)

Before saying "done" or asking for user approval on the in-progress page:

- [ ] Enumerate every previously approved page in the active batch
- [ ] For each, capture 1440px + 390px screenshots of the live local URL
- [ ] Diff each against the pre-edit baseline OR the user's last-approved state
- [ ] Report any visual changes detected (even minor)
- [ ] If ZERO unintended changes: proceed to user approval
- [ ] If ANY unintended change: revert, document the trigger, narrow scope

### Why this is mechanical, not advisory

Advisory rules ("check previously approved pages") failed in
AEMCODER-013 because:
- They didn't enforce a TIMING (before or after the edit?)
- They didn't list WHICH file edits triggered the check

This protocol fixes both with the pre-edit gate (timing) and the
Shared-File Inventory (triggers). The approved-pages list is kept in
session context rather than a registry file — simpler to maintain.

### CSS SELECTOR SCOPE CHECK (AEMCODER-018)

**AEMCODER-013 added file-scope checking but selector-scope was missing.**
The /access migration regressed the homepage AGAIN even with the gate,
because a generic block selector inside an approved file affected pages
beyond the active one.

**Rule:** any CSS rule in `styles/{brand}/_styles.css` that touches a
shared block class MUST be scoped under one of:

1. **Section-metadata style class** — `.section.<style-class> .<block> ...`
   (preferred — see AEMCODER-019 and abbvie-page-templates).
2. **Page body class** — `body.page-<slug> .<block> ...`
3. **Brand-scoped block CSS** — move the rule into
   `blocks/{block}/{brand}/_{block}.css` (still affects all pages
   using that block + brand, but at least it's the right layer).

**Forbidden generic selectors** (refuse to write these in styles/{brand}/_styles.css):
- `.cards-grid ...` (without section-class or body-class prefix)
- `.text-container ...`
- `.image-text ...`
- `.hero ...`
- `.formulary-lookup ...`
- `.accordion ...`
- `.tabs ...`
- `.modal ...`
- `.safety-bar ...`
- `.brand-explorer ...`
- Any `:has()` selector targeting a block class without section-class scope

**Detection:** before saving a CSS edit to `styles/{brand}/_styles.css`,
inspect each rule selector. If it matches `^\\s*\\.(cards-grid|text-container|image-text|hero|formulary-lookup|accordion|tabs|modal|safety-bar|brand-explorer)\\s` (i.e. starts with a bare block class), REFUSE the edit and force re-scoping under a section/body class.

### BUILD COMMAND SCOPE CHECK (AEMCODER-017)

**Build commands have site-wide side effects.** Running
`npm run build:json` or `npm run scaffold:build` (no flags) recompiles
every brand's CSS, polluting the working tree with changes across
brands you're not migrating.

**Rule — before running any `npm run scaffold*` or `npm run build*`:**

1. **Prefer the targeted variant**:
   - `npm run scaffold:build:block --block-name X --brand-name Y` for
     a single block + brand (lowest blast radius).
2. **If you must run the un-targeted variant** (e.g. structural rebuild):
   - `git status` first — note the clean baseline.
   - Run the build.
   - `git diff --stat` immediately after — verify ONLY the target brand's
     files changed.
   - Revert unintended changes:
     - `git checkout -- styles/<other-brand>/` for polluted brand styles
     - `git checkout -- component-{models,definition,filters}.json` for
       root compiled JSON (NEVER hand-edit these anyway)

**Why this matters:** the working tree must stay focused on the active
brand's edits. Polluted diffs make code review impossible, cause
accidental commits of unrelated changes, and break PR isolation.

## Stop conditions

- User has not approved current phase: do not advance.
- A NEW failure mode encountered: add to relevant skill's Anti-patterns section, ask user how to
  proceed (extend a skill? add a rule? accept as known limitation?).
- 3 rounds of back-and-forth on the same section without progress: stop,
  invoke aemcoder-section-fix-loop with stricter parameters or escalate to
  user.
- aemcoder proposes base-block edit: stop, escalate.

## Brand scope — generalized to all 6 commercial pharma brands

This orchestrator works for any of the 6 commercial pharma brands in scope
for the POC migration:

| Brand key | Live domain | Special notes |
|---|---|---|
| `rinvoq-hcp` | rinvoqhcp.com | HCP site, per-condition nav |
| `skyrizi-hcp` | skyrizihcp.com | HCP site, similar per-condition pattern |
| `rinvoq-dtc` | rinvoq.com | DTC site, broader audience |
| `linzess` | linzess.com | Hash-based navigation pattern |
| `venclexta` | venclexta.com | CLL-specific ISI variant, clinical-data heavy |
| `mavyret` | mavyret.com | Univers Condensed font, alt-therapy clauses |

Plus 3 non-commercial brands (`abbvie`, `botox`, `rinvoq`) in `brand-config.json`
that can also be targeted if needed.

The skill is brand-agnostic — substitute the brand key everywhere you see
`{{BRAND_KEY}}` placeholders in the templates. Brand-specific data
(fragments, brand-customized blocks) lives in the project under
`styles/{brand}/` and `blocks/{block}/{brand}/`. See `abbvie-page-migration`
skill for per-brand DOM-mapping details (fonts, primary colors, page inventory).

## Cross-page reuse cheat sheet (CURRENT ACTIVE BATCH)

Determine the active brand from the migration kickoff prompt or the
in-progress page URL. The approved-pages list for the active batch is
tracked in session context — at the start of any fix session, ask the
user (or check session history) which pages they have already approved.

### Currently active: Rinvoq HCP (as of 2026-06-02)

Pages already migrated (treat as reference for remaining pages):
- Homepage (rinvoqhcp.com) — establishes header fragment, footer fragment,
  safety-bar fragment, brand metadata pattern
- /dermatology — establishes condition-specific header fragment, brushstroke
  section variants, page-specific custom-class patterns

Pages remaining in current batch:
- /dermatology/access (access & savings programs)
- /dermatology/dosing-lab-monitoring (clinical tables, references)
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
