# Find-Relief — Rebuild Pixel-Perfect Styling (Git History + Chat History)

Restore all the find-relief section/block styling that the recent branch reset removed, plus the three AEM authoring fixes, matching `https://www.linzess.com/find-relief` section-by-section. The content file still references the `find-relief-*` classes; **no CSS currently targets any of them**, so every section renders with default block styling. Use **git history as the primary recovery source** (the reset only moved HEAD — the lost CSS still exists in commits/reflog/backup branch), and the **chat history as the spec** to verify each recovered rule.

> **Execution requires Execute mode.** This is the read-only plan. Git recovery (log/show/checkout), editing CSS/content, base64 conversion, md2jcr validation, lint, and Playwright comparison are write/exec ops blocked in plan mode. Hold for approval before any commit/push.

## Current state (verified read-only)

- Branch reset to remote tip — `grep find-relief styles/linzess/styles.css` → **0** rules.
- Content `content/linzess/migration-dinesh/find-relief/index.plain.html` still uses library blocks with find-relief classes: `hero` (3), `section-nav` (30), `image-text find-relief-gut-check` (65), `video` (107, 135), `cards-grid …find-relief-prescribed` (150), `…find-relief-signup` (172), `tabs` (216), `cards-grid …find-relief-dosing` (234, 278), `image-text find-relief-savings-tout` (324), `cards-grid …find-relief-bottom-nav` (376), `safety-bar split` (439).
- **No CSS** anywhere targets `find-relief-gut-check / -savings-tout / -prescribed / -signup / -bottom-nav / -dosing` (grep → none).
- Remote moved find-relief CSS into per-block files (`blocks/*/linzess/*.css`).

## Git-history recovery (primary path — Execute mode)

The chat documents a backup branch `backup/pre-rebase-edb210b1` (at commit `edb210b1`) and a stash `pre-safe-path-working-tree`, plus prior commits `2ff10a97` and `fcc8da4d` ("align find-relief CSS with deployed content classes", which added 1871 lines to `styles/linzess/styles.css`). Reset only moves HEAD, so these are recoverable:

1. `git reflog` + `git branch -a` → confirm `backup/pre-rebase-edb210b1`, the stash, and commits `edb210b1` / `fcc8da4d` exist.
2. `git show fcc8da4d:styles/linzess/styles.css` (and the backup branch's version) → extract the exact lost `find-relief-*` rules (talk list, gut-check, videos, dosing, savings-tout, bottom-nav, hero/nav arc, base64 checkmark).
3. **Reconcile, don't clobber:** the remote advanced 113 commits with a per-block CSS architecture. Port the recovered rules into the current structure rather than overwriting newer files. Diff recovered vs current per-block CSS to avoid regressing remote work.
4. Use the **chat history as the spec** to confirm each recovered rule matches the final tuned values (some sections were iterated many times after `fcc8da4d`).

## Architecture decision (resolve at kickoff)

Recovered rules came from monolithic `styles/linzess/styles.css` (a generated/merged artifact); remote favors per-block `blocks/{block}/linzess/_{block}.css`. Decide where recovered rules land: (a) `styles/linzess/styles.css` (matches recovered source + page-section scoping) or (b) per-block `_*.css` (matches remote, rebuilt via CSS build). Recommend (b) for block-internal looks, page-section scoping where a section spans blocks. Confirm before writing.

## Three AEM authoring issues (chat directives)

- **A. `background: url('/icons/divider.svg')` breaks on AEM publish** — inline `/icons/divider.svg` as base64; replace every reference.
- **B. Authoring ≠ preview** — confirm `models/_text.json`/`_image.json` carry `template.model` + rebuilt aggregates (PR #102).
- **C. Pseudo-classes in authoring** — brand CSS must auto-load in UE iframe; keep pseudo-element graphics self-contained (base64, not `/icons/`).

## Per-section spec (recover from git, verify vs chat + live)

1. **Hero + section-nav** — white overlay eyebrow + H1; header overlays hero; white arc is the *next section's* `::before` (radius 100% 100% 0 0, ~255px, top −60px) — no hero `::before` (double-arc); section-nav pill overlaps hero bottom (margin-top −40/−60px, z-index above arc).
2. **Talk-to-a-Doctor list** — dark-purple `#422e83` rounded card, 2-col flex, orange checkmark `li::before` (base64 SVG), white text, 998px cap.
3. **Gut-check tout** (`image-text`) — off-white card, 44% image col, natural-ratio image (baked-in curve PNG), white "Actor Portrayal" overlay bottom-left, content padding-left 80px, purple heading + purple CTA.
4. **Videos ×2** — transparent overlay (no navy scrim), hide overlay title/desc, 72px white translucent circle + purple ▶, full-width light-purple caption bar attached to video bottom (title left / View Transcript right, bottom-rounded only, 0 gap).
5. **Prescribed cards** — card 1 dark-purple/white, card 2 light-purple/purple, icons on top, no CTA.
6. **Sign-up trio** — 3-up, purple CTAs.
7. **Dosing tabs** — Instructions heading + tabs + each panel in one continuous white container (rounded top, squared join, rounded bottom, 998px aligned); centered purple "Take LINZESS" per panel; dosing rows off-white, 12px radius, 1px `#e0dce8` border, transparent 80px icon half-overlapping left edge (PR #104 recipe), even body spacing.
8. **HOW TO STORE** — display Bebas heading + divider (scope via `:has(.find-relief-savings-tout)`).
9. **Savings tout** (`image-text`) — off-white card, image left, purple "Sign Up Now" CTA (white text).
10. **Bottom-nav** — dark-purple section + arc, orange "Learn More" CTAs.
11. **ISI + safety-bar** — styled by shared blocks; verify only.

## Checklist

### Setup & git recovery
- [ ] `git reflog` / `git branch -a` — confirm `backup/pre-rebase-edb210b1`, stash, commits `fcc8da4d` / `edb210b1` exist
- [ ] `git show fcc8da4d:styles/linzess/styles.css` (+ backup branch) — extract lost `find-relief-*` rules + base64 checkmark
- [ ] Diff recovered rules vs current per-block CSS; plan reconciliation (no regression to remote work)
- [ ] Confirm CSS architecture target (per-block `_*.css` vs `styles/linzess/styles.css`) before writing
- [ ] Verify `models/_text.json`/`_image.json` `template.model` + rebuilt aggregates intact (issue B)
- [ ] Confirm content blocks/classes unchanged; image-text blocks at importer's required row count

### AEM issues
- [ ] Inline `/icons/divider.svg` as base64; replace all refs (issue A)
- [ ] Add base64 orange checkmark for talk-list `li::before` (issue A/C)
- [ ] Confirm pseudo-element graphics render in authoring (issue C)

### Per-section rebuild (recover → reconcile → verify vs live at desktop + mobile)
- [ ] Hero + section-nav overlap + next-section white arc
- [ ] Talk-to-a-Doctor dark-purple checkmark list card
- [ ] Gut-check tout — image fill, Actor Portrayal overlay, purple CTA
- [ ] Videos ×2 — transparent overlay, circular play button, attached caption bar
- [ ] Prescribed cards (dark/light purple, icons, no CTA)
- [ ] Sign-up trio (3-up, purple CTAs)
- [ ] Dosing tabs — one white container, centered "Take LINZESS", off-white cards + transparent half-overlap icons
- [ ] HOW TO STORE display heading
- [ ] Savings tout — purple CTA
- [ ] Bottom-nav — purple section + arc + orange CTAs
- [ ] ISI + safety-bar — verify unchanged

### Validation
- [ ] Rebuild brand CSS if per-block sources changed
- [ ] md2jcr round-trip (importer version) → SUCCESS; image-text maps; no entity double-encoding
- [ ] Playwright section-by-section compare vs live; iterate (lowest-specificity fix → re-screenshot → regression-check)
- [ ] `npm run lint` clean except the 3 pre-existing safety-bar errors
- [ ] Regression: other Linzess pages (OTC/transcript) unchanged
- [ ] Hold for approval before any commit/push

## Risks
- **Recovery may be incomplete:** if git GC pruned dangling commits, fall back to rebuilding the missing rules from the chat spec + live site.
- **Architecture mismatch:** reset moved to per-block CSS; reintroducing monolithic rules could conflict — reconcile, resolve architecture first.
- **`styles/linzess/styles.css` is generated/merged** — edits may be clobbered by the build; prefer source `_*.css`.
- **Content file is gitignored**, delivered via AEM pipeline — CSS/JS reaches the page only after commit+push; content needs re-import/publish.
