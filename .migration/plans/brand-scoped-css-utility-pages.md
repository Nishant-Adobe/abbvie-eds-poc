# Sitemap & Utility Page Styling — Scope to Brand/Block CSS

## Answer: changes in `styles.css`

There are **two different files** named `styles.css`. Here is exactly what is in each:

### 1. Global `styles/styles.css` — **NO CHANGES**
Verified via `git diff HEAD -- styles/styles.css`: **empty output**, and it does not appear in `git status`. The global shared stylesheet is completely untouched. ✅

### 2. Brand-scoped `styles/linzess/styles.css` — **+497 lines added** (this is brand-specific, not global)
All additions are appended after the existing `body.no-hero` block (line 47+). Grouped by feature:

**A. SMS Terms page (default content, scoped via `h3#from-the-gutsm-text-message-terms-and-conditions`)**
- `body` 8px margin; wrapper full-width, no max-width/centering, left-aligned
- Document text: Times New Roman, 16px, black
- Heading: 18.72px / 700 / `line-height: normal` / 18.72px block margins
- Paragraphs: 16px / `line-height: normal` / 16px block margins
- `sup`: `font-size: smaller`, `line-height: normal`

**B. Sitemap page (default content, scoped via `h1#sitemap`)**
- Curved white arc via `::before` (130% wide) + `overflow-x: clip`
- Responsive top spacing: `margin-top` 17rem→20rem→22rem, `padding-top` 4rem→6rem→8rem
- H1: weight 400, no uppercase
- `.sitemap-categories` grid: 1 col → 2 col (768px) → 32%/32%/20% with 70px gaps (986px)
- `.sitemap-category`: Lato 16px/400, `margin-top: 8rem`
- Category `h2`: 2.4rem/700/`line-height: normal`/brand purple
- Category `p`: 1.6rem/`line-height: normal`
- Category `a`: 1.6rem/`line-height: normal`/underline/1.1rem tap padding
- Heading `sup` shrink rule; empty header/footer collapse rules

**C. ES homepage sections (scoped via `es-center`, `es-symptoms`, `es-comparison`, `es-savings`, `es-testimonial`)** — pre-existing/related section styling

**D. Inline ISI (scoped via `.section.isi`, targets the `text-container` block)**
- White bg, black base text 1.6rem/2rem, responsive bottom padding 8rem
- `.text-container` left-aligned, flush (`margin: 0`)
- ISI `h3`: brand purple, 1.6rem, `-0.32px` letter-spacing
- ISI `p`: gray #555, 1.4rem/1.6rem, 2rem side padding, 1.2rem bottom margin
- Purple subtitles via `p:nth-of-type(2)/(4) strong`
- Compact list: disc bullets, 1rem margin, 1.5rem indent, 0.4rem item gaps

> Also changed (non-CSS, for context): `scripts/scripts.js` (+60 lines: sitemap column grouping + terms viewport hook) and `blocks/footer/footer.js` (+6 lines).

## Relevant to the migration plan
Under the new "no global edits" rule, the audit confirms the global file is clean. The remaining question is whether the **brand** `styles/linzess/styles.css` is acceptable for the default-content targets (sitemap, terms) that have no block — you answered **block-level only**, which is why the open decision below matters.

## Checklist
- [x] Verify no edits exist in global `styles/styles.css` (confirmed: empty diff, not in git status).
- [x] Identify which sitemap/ISI/terms rules sit in brand `styles/linzess/styles.css` (audited above; +497 lines).
- [x] Confirm build pipeline: `blocks/<block>/<brand>/_<block>.css` → gulp `createBrandCSS` merges base+brand → served `blocks/<block>/<brand>/<block>.css`.
- [x] Confirm `blocks/safety-bar/linzess/` already exists (block-level); `blocks/text-container/linzess/` does NOT yet exist.
- [ ] **DECISION NEEDED:** Sitemap + SMS-Terms are default content (no block). Choose: (a) keep their rules in brand `styles/linzess/styles.css`, or (b) full block-level refactor (new block scaffolds + import-script rewrites + content re-import — higher risk).
- [ ] Move ISI rules from `styles/linzess/styles.css` → `blocks/text-container/linzess/_text-container.css`; run `scaffold:build` to regenerate; verify served CSS.
- [ ] Verify safety-bar rules already live in `blocks/safety-bar/linzess/` (no move needed).
- [ ] Re-verify each relocated rule renders identically at desktop/tablet/mobile.
- [ ] Confirm `npm run lint:css` passes for added block CSS.

## Notes
- Execution of file changes requires **Execute mode**; this artifact is plan-only.
- The pending DECISION blocks the sitemap/terms relocation; ISI relocation to `text-container` block-level can proceed regardless.
