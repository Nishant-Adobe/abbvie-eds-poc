# Gut-Check Image-Text Block — Live-Match Plan

## Goal
Restyle the selected `image-text.find-relief-gut-check` block so it matches the live site: the **image fills its container completely**, and the **cut-out subject (person) overflows slightly above the top edge** of the card (the signature "pop-out" treatment on linzess.com's Gut Check tout).

## Selected element
- **Page:** `content/linzess/migration-dinesh/find-relief/index.plain.html`
- **Selector:** `main > .section.find-relief-talk … > .image-text-wrapper:nth-of-type(2) > .image-text.find-relief-gut-check.block`
- **Structure:** `.image-text-image-col` (picture: `FindRelief-GutCheck-Tout` desktop/mobile) + `.image-text-content-col` (heading "Prepare for Your Visit With the Gut Check", body, "Get My Discussion Guide" CTA), plus the "Actor Portrayal" caption.
- **Scope:** CSS-only on the brand styles already governing this block. **No `.plain.html` content change** — markup/structure stays intact.

## Live reference (target) — to be confirmed in Step 0 capture
- Two-column tout card (image left, content right) with a rounded card / colored panel.
- Image **bleeds to fill** its half (object-fit cover, no letterboxing, no side gaps).
- The cut-out figure **extends above the card's top edge** by a small amount (image container allowed to overflow upward; card uses `overflow: visible`).
- "Actor Portrayal" caption anchored over the image (bottom-left), already present.

## Current state (from existing CSS, to verify in Step 0)
- `find-relief-gut-check` rules live in `styles/linzess/styles.css` (~lines 1490–1560): image col uses `object-fit: cover`, content col has left padding; block is `position: relative`.
- Suspected deltas: image container is clipped to the card (no upward overflow), and/or image doesn't fully fill (height/aspect gap), so the person doesn't pop above the top.

## Root-cause hypothesis (confirm before editing)
- **Brand block CSS** — the image column is constrained to the card height with `overflow: hidden` somewhere up the chain, and the picture/img isn't given the negative top offset + extra height needed to let the cut-out rise above the card. Fix is a scoped CSS change on the `.find-relief-gut-check` image col (and ensuring the card/container is `overflow: visible`).

## Approach (lowest-specificity, mobile-first)
1. **Step 0 dump first:** capture live (desktop 1440 + tablet 768 + mobile 390) computed styles + screenshot for the gut-check tout — card height, image col height/`object-fit`, any negative margin/translate on the image, `overflow` on card and wrappers. Capture the same nodes on EDS. No edit before this.
2. Ensure the **image fully fills** its column: `width:100%`, `height:100%`, `object-fit:cover`, no max-height clamp leaving gaps; align the image col to stretch.
3. Allow the **cut-out to overflow the top**: give the image (or its col) a small negative top offset / extra height matching live, and set the card + relevant wrappers to `overflow: visible` so the figure isn't clipped.
4. Keep the **"Actor Portrayal" caption**, heading, body, and CTA positions intact.
5. Match the exact overflow amount and image framing to the Step 0 live measurements (don't eyeball — use captured px).
6. Confirm no horizontal overflow and the content column stays vertically centered.

> Image asset itself is unchanged (the EDS `media_…png` is the migrated equivalent of live `FindRelief-GutCheck-Tout`). This is framing/overflow CSS only.

## Checklist
- [ ] Step 0: capture LIVE gut-check tout computed styles + screenshot at 1440 / 768 / 390 (card height, image col `object-fit`/height, negative offset/translate, `overflow` on card+wrappers, caption position)
- [ ] Step 0: capture current EDS gut-check block computed styles + screenshot at the same widths
- [ ] Build delta table (image fill, top overflow amount, overflow clipping, caption) and confirm root-cause = brand block CSS
- [ ] Locate the governing rules in `styles/linzess/styles.css` (`.find-relief-gut-check` image col / card) — confirm exact selectors and whether any partial regenerates them
- [ ] Edit CSS: make image fill container (`width/height 100%`, `object-fit: cover`, remove any gap-causing clamp)
- [ ] Edit CSS: set card + wrappers to `overflow: visible`; add the negative top offset / extra height so the cut-out rises above the top by the live amount
- [ ] Verify image fills completely + cut-out pops above top at 1440 / 768 / 390 against live
- [ ] Verify "Actor Portrayal" caption, heading, body, CTA unaffected; no horizontal overflow
- [ ] Cross-check: ensure the overflow/`overflow:visible` change doesn't break adjacent sections (arc/divider above the section, video block below)
- [ ] Lint the edited CSS (note: `styles/linzess/*` may be stylelint-ignored as generated — confirm validity via computed styles if so)

## Risks / notes
- `overflow: visible` on the card/section could expose other absolutely-positioned decorations (section arc, dividers) — regression-check the `find-relief-talk` section immediately above/below.
- The gut-check rules are scoped to `.find-relief-gut-check`, so blast radius is this block only; still verify the sibling find-relief pages that include it.
- `styles/linzess/styles.css` is served directly (no real `_` partial) — edit it directly, no rebuild.
- CSS-only change; on this xwalk project it needs commit + push to the branch to go live (no content re-publish).
- Match the live overflow amount from Step 0 px values — do not guess the pop-out distance.

---
*Execution requires Execute mode. This plan covers the gut-check image fill + top-overflow restyle in `styles/linzess/styles.css`; no `.plain.html` content change is needed.*
