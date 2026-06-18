# Linzess "Keeping in Touch with Your Doctor" — Migration

Branch: `linzess-keeping-in-touch` (off develop `0bf91c1b`)
Live source: https://www.linzess.com/starting-linzess/healthy-routines/keeping-in-touch-with-your-doctor
EDS path: /linzess/healthy-routines/keeping-in-touch-with-your-doctor
AEM author: /content/abbvie-eds-poc/linzess/healthy-routines/keeping-in-touch-with-your-doctor

## Status
- [x] Phase 0 — branch off develop, access/config confirmed
- [x] Phase 1 — live scrape + analysis (see import-work/keeping-in-touch/analysis.md); JS approach = author for develop's block JS as-is (verified OTC renders correctly on develop)
- [x] Phase 2 — content authored: content/linzess/healthy-routines/keeping-in-touch-with-your-doctor.plain.html (local only — content/ is gitignored and goes to AEM author via upload)
- [x] Phase 3 — kit-* scoped CSS variants added to styles/linzess/styles.css + columns exclusion lists in both columns.css/_columns.css
- [ ] Phase 4 — verify >=90% vs live  **BLOCKED: clean URL proxies AEM author; needs upload first**
- [ ] Phase 5 — md2jcr upload to author + Preview + Publish  **BLOCKED: no AEM auth in env**
- [ ] Phase 6 — commit (CSS + this plan committed; content/images stay local per convention)

## Section map (matches OTC/triggers article family)
1. Hero (behind-nav editorial) — article-intouch-desktop.jpg / -mobile.jpg
2. kit-touchpoints-section (white) — intro heading + body + 4 icon cards
   (Speak up / Don't Sugarcoat / Ask Questions / Take Notes)
3. kit-relief-section (dark purple #422e83, arc) — "When Can You Expect Relief?"
   2-col text + patient illustration, then "What are Some Common Side Effects?" + list
4. kit-conversation-section (light purple #d9d7f9) — "Keep the Conversation Going"
   text + thought-bubbles image
5. more-like-this (reused) — FoodSwaps / OTC / Tackling IBS-C cards
6. cta-cards (reused) — Check My Symptoms / Savings & Support
7. ISI (inline) + safety-bar (split) — verbatim, US-LIN-250121 / US-LIN-250071

## New variant classes (all scoped; no shared/base rule touched)
- Section styles: kit-touchpoints-section, kit-relief-section, kit-conversation-section
  (added to the article :is(...) lists in styles.css; reuse heading/divider/arc machinery)
- Columns variants: kit-touchpoints, kit-relief, kit-conversation
  (added to the 37x homepage-promo :not() exclusion lists in columns.css + _columns.css
   so promo styling does not leak onto them — same pattern as how-they-work/cta-cards)
- New bg: kit-conversation-section uses var(--linz-light-purple) #d9d7f9 (arc + band)

## Images (downloaded to import-work/keeping-in-touch/images/, copied to local DAM
content/content/dam/abbvie-eds-poc/linzess/images/ for preview; upload to AEM DAM in Phase 5)
- article-intouch-desktop.jpg, article-intouch-mobile.jpg
- 4.1.1-d-keeping-in-touch-with-your-doctor-speak-up@2x.png
- 4.1.1-d-keeping-in-touch-with-your-doctor-sugarcoat@2x.png
- 4.1.1-d-keeping-in-touch-with-your-doctor-ask-questions@2x.png
- 4.1.1-d-keeping-in-touch-with-your-doctor-notes@2x.png
- 4.1.1-d-keeping-in-touch-with-your-doctor-patient@2x.png
- 4.1.1-d-keeping-in-touch-with-your-doctor-thought-bubbles-no-bkg@2x.png
(all PNG/JPG — no SVG, so no 40KB SVG publish blocker)

## Remaining blockers
- AEM author authentication is not present in this environment. Required for:
  Phase 4 (local clean URL proxies author/edge — `via: ...aem.page` — so the page
  must be in author to render) and Phase 5 (md2jcr upload + Preview + Publish).
- md2jcr converter is available (@adobe/helix-md2jcr + excat run-bulk-import.js).
- When auth is provided: convert plain.html -> JCR, upload to author path above,
  upload 8 DAM images, run Preview, verify >=90% vs live at 1440/768/390, then
  pause for Publish approval.

## md2jcr authoring guards honored
- Columns blocks authored ONE ROW PER COLUMN ITEM; variant class in first (classes) row.
- Hero authored with two-<picture> (desktop + mobile) structure, OTC 8-row pattern.
- ISI/safety-bar copy verbatim; US-LIN job codes preserved.
