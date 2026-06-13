# Find-Relief — Commit & Push Pending CSS Fixes

## Objective
Commit the verified, uncommitted CSS fixes from this session and push them to `origin/linzess-find-relief` so they deploy via the EDS code bus. Version-control task only — no further visual work. **Execution requires Execute mode** (this plan is read-only; staging/commit/push run once switched to Execute).

## Changes to commit (all local, already verified in preview)
- `styles/linzess/styles.css` — bottom-nav CTA cards 2-column grid + `grid-column: auto` reset (side-by-side CTAs)
- `blocks/hero/linzess/_hero.css` + `blocks/hero/linzess/hero.css` — hero `::after` overlay `background: none` (arc crescent fix); H1 bottom margin `0 0 20px`; mobile H1 32px / desktop sizing
- `blocks/section-nav/linzess/_section-nav.css` + `blocks/section-nav/linzess/section-nav.css` — sticky pill: content-width centered, no shadow/strip; pill link 16px / `0 24px`
- `.stylelintrc.json` — disable `no-descending-specificity` / `no-duplicate-selectors` for compiled block CSS

## Excluded (intentionally)
- `content/.../index.plain.html` — gitignored; hero image already published via AEM/import path, not git
- `.migration/project.json`, `.migration/plans/` — session/working artifacts unrelated to the visual fixes

## Preconditions
- Approval to commit + push: **given.**
- Push auth: HTTPS remote has no stored credential. The token shared earlier is **exposed in chat and must be revoked** — a push needs a fresh credential (PAT, `gh auth login`, or SSH remote). If none is available, commit locally and stop before push.
- Branch `linzess-find-relief` tracks `origin`; prior remote tip `49552d61`. New commit = clean fast-forward.

## Checklist
- [ ] `git status` + `git diff --stat` — confirm exactly the 6 intended files are modified; `.migration/*` left unstaged.
- [ ] Lint changed files — expect clean except the 3 known pre-existing `safety-bar.css` errors; verify `styles/linzess/styles.css` via `--ignore-path /dev/null`.
- [ ] Stage only the 6 fix files (hero source+compiled, section-nav source+compiled, styles.css, .stylelintrc.json).
- [ ] Commit with descriptive message (find-relief hero overlay + bottom-nav CTA grid + sticky nav fidelity) + `Co-Authored-By` trailer.
- [ ] Confirm a valid push credential (fresh PAT / `gh auth` / SSH) — required before push.
- [ ] Push to `origin/linzess-find-relief` (fast-forward, no `--force`).
- [ ] Verify remote tip = new commit (`git ls-remote --heads origin linzess-find-relief`).
- [ ] Report commit hash + push result; remind user to revoke the exposed token.

## Notes / Risks
- Footer / Safety Bar / ISI fidelity work is **not** part of this task — deferred to a separate plan; not started.
- If push auth is unavailable, the commit stands locally and push is reported as blocked (no force-push, no remote/credential config changes without approval).
- **Execution requires Execute mode** — switch to Execute to run the checklist.
