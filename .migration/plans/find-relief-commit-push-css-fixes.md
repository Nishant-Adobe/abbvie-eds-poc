# Find-Relief — Commit & Push CSS Fixes, then Footer / Safety Bar / ISI Fidelity

## Objective
Two sequential phases:
- **Phase A — Commit & push** the verified, uncommitted CSS fixes from this session to `origin/linzess-find-relief` (deploys via the EDS code bus).
- **Phase B — Footer → Safety Bar → ISI text-container** fidelity work on the migrated Find Relief page (`/content/linzess/migration-dinesh/find-relief/`), one block at a time, matched to live.

**Execution requires Execute mode** — this artifact is read-only; staging/commit/push and CSS edits run once switched to Execute.

---

## Phase A — Commit & Push

### Changes to commit (local, already verified)
- `styles/linzess/styles.css` — bottom-nav CTA cards 2-column grid + `grid-column: auto` reset
- `blocks/hero/linzess/_hero.css` + `blocks/hero/linzess/hero.css` — hero `::after` overlay `background: none` (arc crescent fix); H1 bottom margin `0 0 20px`; mobile H1 32px / desktop sizing
- `blocks/section-nav/linzess/_section-nav.css` + `blocks/section-nav/linzess/section-nav.css` — sticky pill content-width/centered, no shadow/strip; pill link 16px / `0 24px`
- `.stylelintrc.json` — disable `no-descending-specificity` / `no-duplicate-selectors` for compiled block CSS

### Excluded (intentionally)
- `content/.../index.plain.html` (gitignored; published via AEM/import), `.migration/project.json`, `.migration/plans/`

### Auth (per user)
- User will provide a **fresh PAT**; use it once for the push (do **not** persist in git config), then remind user to revoke it. Earlier exposed token must also be revoked.

---

## Phase B — Block fidelity (one at a time, vs live `https://www.linzess.com/find-relief`)
Reuse existing blocks; EDS sibling reference `…/linzess/healthy-routines/otc-and-prescription-treatments`. Files: footer `blocks/footer/linzess/_footer.css`(+compiled); safety-bar `blocks/safety-bar/linzess/_safety-bar.css`(+compiled, has 3 known pre-existing lint errors); ISI `.section.isi` rules in `styles/linzess/styles.css`.

## Checklist

### Phase A — Commit & Push
- [ ] `git status` + `git diff --stat` — confirm exactly the 6 fix files modified; leave `.migration/*` unstaged.
- [ ] Lint changed files — expect clean except the 3 known pre-existing `safety-bar.css` errors; `styles/linzess/styles.css` via `--ignore-path /dev/null`.
- [ ] Stage only the 6 fix files; commit with descriptive message + `Co-Authored-By` trailer.
- [ ] Push to `origin/linzess-find-relief` using the user-provided PAT (one-time, not persisted; fast-forward, no `--force`).
- [ ] Verify remote tip = new commit (`git ls-remote --heads origin linzess-find-relief`); report commit hash + push result; remind user to revoke the token.

### Phase B1 — Footer
- [ ] Load live + migrated footer (desktop + mobile); capture columns (WHY LINZESS / UNDERSTANDING CONSTIPATION / FIND RELIEF / RESOURCES / SAVINGS & SUPPORT / CHECK MY SYMPTOMS), legal row, AbbVie/Ironwood logos, purple bg.
- [ ] Diff vs live: column count/order, heading style, link spacing, separators, logo placement, mobile stacking.
- [ ] Apply footer fixes in `blocks/footer/linzess/_footer.css` + compiled `footer.css`.
- [ ] Verify desktop + mobile vs live; no regression on other Linzess pages.

### Phase B2 — Safety Bar (floating ISI)
- [ ] Load live + migrated; capture docked/sticky behavior, minimized vs expanded, "Expand Safety Information" toggle, height/bg/shadow/z-index/rounded top.
- [ ] Diff vs live: position, expand/collapse interaction, typography, spacing.
- [ ] Apply safety-bar fixes in `blocks/safety-bar/linzess/_safety-bar.css` + compiled `safety-bar.css` (don't regress the 3 known lint errors).
- [ ] Verify expand/collapse + docked behavior, desktop + mobile; no regression.

### Phase B3 — ISI text-container (inline USES / IMPORTANT RISK INFORMATION)
- [ ] Load live + migrated inline ISI; capture heading sizes, body 14/16px, list bullets, link color, max-width/padding, desktop column behavior.
- [ ] Diff vs live: `--content-width-isi`, heading scale, paragraph/li spacing, link styling.
- [ ] Apply ISI fixes in `styles/linzess/styles.css` (`.section.isi` rules, lines ~63–270+).
- [ ] Verify ISI vs live desktop + mobile; no regression to the safety-bar-fed ISI fragment.

### Wrap-up
- [ ] Lint changed files (expect clean except the 3 known pre-existing `safety-bar.css` errors).
- [ ] Report pass/fail per block; HOLD for approval before committing/pushing Phase B changes.

## Notes / Risks
- Footer + safety bar are **shared blocks** — verify no regression on canonical find-relief / healthy-routines.
- ISI selectors are broad (`.section.isi`, `main > .section:nth-of-type(2):not(...)`) — scope edits to avoid non-ISI sections.
- `styles/linzess/styles.css` is in `.stylelintignore` — lint via `--ignore-path /dev/null`.
- Phase B CSS deploys via code bus (commit/push), separate from the AEM content publish used for the hero image.
- **Execution requires Execute mode.**
