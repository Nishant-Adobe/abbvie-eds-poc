# Find Relief Subpages Migration Plan

## Context & Key Finding

The two target URLs are **not standalone pages** on the live site. Both redirect to hash anchors on the single `/find-relief` page:

- `https://www.linzess.com/find-relief/talk-to-a-doctor` → `/find-relief#talktoadoctor`
- `https://www.linzess.com/find-relief/how-to-take-linzess` → `/find-relief#howtotake`

(The first URL was listed twice — there are two distinct pages: **talk-to-a-doctor** and **how-to-take-linzess**.)

Because they are hash-anchor views of one page, each subpage is derived from the already-refined `migration-dinesh/find-relief/index.plain.html` by keeping the relevant section group, removing the other anchor's content, retitling the hero, and repointing the section-nav cross-link to the sibling subpage. This reuses every block already established in the index (hero, section-nav, image-text, video, cards-grid, tabs, ISI, safety-bar) — no new blocks and no hand-authored content.

## Source → Output Mapping

| Output file (`content/linzess/migration-dinesh/find-relief/`) | Hero title | Section groups kept |
|---|---|---|
| `talk-to-a-doctor.plain.html` | "Talk to a Doctor" | hero + section-nav, `find-relief-talk` group, bottom-nav, ISI, safety-bar, metadata |
| `how-to-take-linzess.plain.html` | "How to Take LINZESS" | hero + section-nav, howtotake video/cards group, instructions tabs + 2 dosing panels, savings tout, bottom-nav, ISI, safety-bar, metadata |

Section-nav rule: self-anchor stays `#anchor`; sibling link points to the sibling subpage path (`/find-relief/talk-to-a-doctor` or `/find-relief/how-to-take-linzess`).

## Approach

Generate output via a deterministic Node splitter script (not hand-authored HTML), reading the refined index as the single source of truth. Top-level sections in the index are blank-line-separated `<div>…</div>` blocks identified by stable markers (hero class, `classes_customClass` values, `safety-bar split`, `metadata`).

## Known Block Fix Required

`blocks/section-nav/section-nav.js` force-prefixes every nav href with `#` (line ~21), which corrupts the cross-page sibling link into `#/find-relief/...`. Fix: treat path-style values (containing `/`) as literal hrefs; only bare tokens get the `#` prefix. This is a shared block, so re-verify it does not regress the index page's same-page anchors.

## Checklist

- [ ] Read & confirm section boundaries in `migration-dinesh/find-relief/index.plain.html`
- [ ] Write splitter script `tools/importer/split-find-relief-subpages.mjs` that derives both subpages from the refined index
- [ ] Run splitter to generate `talk-to-a-doctor.plain.html` and `how-to-take-linzess.plain.html` under `migration-dinesh/find-relief/`
- [ ] Patch `blocks/section-nav/section-nav.js` to allow path-style cross-page hrefs
- [ ] Verify `talk-to-a-doctor` in preview: hero title, nav self-anchor + sibling link, talk section, bottom-nav, ISI, floating safety bar
- [ ] Verify `how-to-take-linzess` in preview: hero title, nav cross-link, howtotake group, tabs with both dosing panels, savings tout, bottom-nav, ISI, safety bar
- [ ] Regression check: confirm index page section-nav anchors still work after the block JS change
- [ ] Report results and hold for commit approval

> Note: This work is already implemented in the current session. Re-running or revising it requires **Execute mode**; plan mode cannot modify files.
