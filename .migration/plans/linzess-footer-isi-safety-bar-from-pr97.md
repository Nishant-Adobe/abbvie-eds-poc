I'll investigate PR #97 and the reference URL before finalizing the plan.Bash is blocked in plan mode. Let me inspect current footer/ISI/safety-bar code with read-only tools to ground the plan.# Port Footer, ISI & Safety Bar from PR #97 (linzess find-relief)

## Goal
Bring the **footer**, **ISI**, and **safety bar** on the `linzess-find-relief` branch into parity with **PR #97** (`https://github.com/Nishant-Adobe/abbvie-eds-poc/pull/97`), using the EDS reference `https://linzess-bulk--abbvie-eds-poc--nishant-adobe.aem.live/linzess/experience/dr-lucak-transcripts` as the live render target.
- **Footer + Safety bar:** port **both code and content** from PR #97 (block JS/CSS/block-config + authored content), overwriting local where they diverge.
- **ISI:** ISI is **default-content text**, not a block — **match the rendering** of PR #97 / the reference URL (section-scoped CSS + content structure), don't force it into a block.

## Source / reference
- **PR #97** branch (to be identified in Execute via `gh`/API — likely the branch this session has been on, or a sibling). Need its `head.ref` to fetch and diff.
- **Reference EDS URL:** `…/linzess/experience/dr-lucak-transcripts` — a published page that renders the target footer/ISI/safety-bar; use for visual + computed-value confirmation.

## Current local block inventory (verified)
- `blocks/footer/linzess/` → `footer.css`, `_footer.css`, `block-config.js` (shared `blocks/footer/footer.js`).
- `blocks/safety-bar/linzess/` → `safety-bar.css`, `_safety-bar.css`, `block-config.js` (shared `blocks/safety-bar/safety-bar.js`).
- **ISI:** no block dir — rendered as default-content `text`/section, styled via `.section.isi` rules in `styles/linzess/styles.css`.

## ⚠️ Caveats / open items
- **PR #97 may already be (partially) merged into this branch** — several prior commits this session were `fix(linzess)` on `linzess-find-relief`. Must **diff PR #97 head against the current branch** before overwriting, to avoid clobbering newer local fixes (e.g. the safety-bar H4 legal-font fix, footer column work). Where local is newer/correct, keep it and flag.
- **Content location is xwalk/markup** — footer is a global fragment (`/…/footer`), ISI/safety-bar content lives in the page `.plain.html` or a shared fragment. Confirm where PR #97 authored each before copying.
- **`media_*` / DAM assets** referenced by ported content must exist (gitignored locally) — verify resolve on the reference host.
- **Shared block code** (`footer.js`, `safety-bar.js`) is multi-brand — only port the **linzess** brand files + content unless PR #97 changed the base intentionally (STOP-and-ask before editing base/shared JS).

## Methodology
1. Identify PR #97 head ref; fetch it read-only.
2. Diff PR #97's `blocks/footer/linzess/*`, `blocks/safety-bar/linzess/*`, their `block-config.js`, and any ISI/`.section.isi` CSS + content against the current branch.
3. For footer + safety-bar: port code files and authored content from PR #97; reconcile against newer local fixes.
4. For ISI: match PR #97's rendered structure/CSS (default content), don't block-ify.
5. Render current branch vs the reference URL at desktop + mobile; confirm computed-value parity per element.
6. Regression-check the find-relief page (and siblings) since footer/safety-bar are shared.

## Checklist
- [ ] Resolve PR #97 head ref + fetch read-only; confirm what it actually changes for footer/ISI/safety-bar.
- [ ] Diff PR #97 vs current branch for `blocks/footer/linzess/{footer.css,_footer.css,block-config.js}`.
- [ ] Diff PR #97 vs current for `blocks/safety-bar/linzess/{safety-bar.css,_safety-bar.css,block-config.js}` (preserve the local H4 legal-font fix if newer).
- [ ] Diff PR #97 vs current for ISI styling (`.section.isi` in `styles/linzess/styles.css`) + content structure.
- [ ] Identify PR #97's footer/ISI/safety-bar **content** locations (global footer fragment, page `.plain.html`, or shared ISI fragment).
- [ ] Port **footer** code + content from PR #97; rebuild served CSS from `_footer.css` partial if applicable.
- [ ] Port **safety-bar** code + content from PR #97; keep served + `_safety-bar.css` in sync; reconcile with local H4 fix.
- [ ] Match **ISI** rendering (default-content CSS + content) to PR #97 / reference URL — no block conversion.
- [ ] Verify each `media_*`/DAM asset referenced by ported content resolves.
- [ ] Render current branch vs `…/dr-lucak-transcripts` reference at 1440 + 390; confirm footer/ISI/safety-bar parity (layout, fonts, colors, job codes verbatim).
- [ ] Pharma fidelity: ISI/safety-bar copy + job codes (US-LIN-*) verbatim, Boxed-Warning treatment intact.
- [ ] Regression: find-relief index + how-to-take + talk-to-a-doctor (footer/safety-bar are shared) at both viewports.
- [ ] Lint touched CSS/JS; report files changed + any PR#97-vs-local conflicts where local was kept.

## Notes
- **Execution requires Execute mode.** This artifact is the plan only; reads so far are read-only.
- "Both code + content" applies to footer + safety-bar; ISI is **render-match only** (it's default content, not a block).
- Do not overwrite newer local fixes blindly — diff first; where PR #97 is older, keep local and note it.
- No base/shared JS edits or commits/pushes without explicit confirmation; regulated copy stays verbatim.
