Let me inspect the hero image CSS (object-fit, sizing) and the overflow/arc clipping rules to ground the new critique.# Find-Relief Hero — Image Stretch & Arc-Overflow Fix Plan

## Critique of the selected block (hero `img` / `linzess-behind-nav-linzess-editorial-hero`)

After the base64→URL hero image swap, two new defects appear in the preview that don't match live:

1. **Image looks stretched/distorted** — the doctor-and-patient photo's proportions look off (squished/zoomed) versus the natural, properly-cropped framing on live `linzess.com/find-relief`.
2. **Image visible *below/outside* the white bottom arc** — part of the photo bleeds past the curved arc seam instead of being cleanly cut off by the white curve.

**Likely root causes (from `blocks/hero/linzess/_hero.css`):**
- **Conflicting box sizing (lines 259–262):** the editorial hero sets **both** `min-height: var(--hero-cta-min-height)` (≈68.4rem / 684px) **and** `aspect-ratio: 2.343 / 1`. At many widths these disagree (e.g., 1440px × 2.343 ⇒ ~614px tall, but `min-height` forces ~684px). The taller box stretches/zooms the cover image and pushes the image area below where the arc sits.
- **Image fit (lines 142–154):** `width:100%; height:100%; object-fit: cover` is correct in principle, but it's filling the **over-tall** box created by the min-height/aspect-ratio conflict, so cover crops/zooms more than live.
- **Swapped `<img>` intrinsic attributes:** the new markup uses `width="2048" height="874"` on the **mobile** fallback `<img>` while the desktop `<source>` is `FIndRelief-Hero-Desktop.jpg`. A mismatched intrinsic ratio on the rendered source can interact with `aspect-ratio`/`object-fit` to look stretched. Needs in-browser confirmation of which source actually renders and its natural dimensions.
- **Arc overlap (lines 290–300):** the arc `::before` is anchored `bottom: -64px; height: 128px`. If the hero box is taller than intended, the arc no longer aligns to the visible image bottom, leaving image showing beneath the curve.

This is a **CSS-only** fix on the hero block — **no HTML/content change** (the swapped `<picture>` markup stays; only sizing/fit rules are adjusted). Exact target values must be confirmed against live in Execute mode before locking.

## Fix approach
Reconcile the hero box sizing so the image area matches live: pick a **single** source of truth for height (either the live-matching `aspect-ratio` **or** a min-height, not a conflicting pair), keep `object-fit: cover` with a sensible `object-position` so the photo crops like live, and ensure the arc `::before` aligns to the true image bottom so nothing bleeds past it. Mirror every change in the compiled `hero.css` (served by the dev server). Verify image proportions + arc seam at desktop and mobile against live.

## Checklist
- [ ] **Measure live hero (desktop + mobile):** in Execute mode, read live's hero box `width/height`, computed `aspect-ratio`, `object-fit`, `object-position`, and the rendered image's natural vs displayed size; note where the arc seam sits relative to the image bottom. *(Execute mode required — browser tool.)*
- [ ] **Measure migrated hero (same metrics):** confirm the `min-height` (≈684px) vs `aspect-ratio: 2.343/1` conflict, capture the rendered `<source>`/`<img>` natural dimensions, and confirm whether the image overflows past the arc.
- [ ] **Identify which source renders:** confirm at ≥600px the desktop `FIndRelief-Hero-Desktop.jpg` loads (not the 2048×874 mobile `<img>` attrs causing ratio mismatch); note natural dimensions.
- [ ] **Fix box sizing (source `_hero.css`):** remove/adjust the conflicting `min-height`+`aspect-ratio` pair on `.hero:is(.linzess-editorial-hero, .linzess-behind-nav-linzess-editorial-hero)` (lines ~259–262) so the box matches live's height behavior (single rule).
- [ ] **Confirm image fit:** keep `object-fit: cover`; add/adjust `object-position` if live crops to a specific focal point so the photo isn't zoomed/stretched.
- [ ] **Align the arc:** verify the `::before` arc (`bottom:-64px; height:128px`) sits flush at the corrected image bottom so no image shows below the curve; adjust only if the box-size fix doesn't resolve it.
- [ ] **Sync compiled CSS:** apply identical edits to `blocks/hero/linzess/hero.css`.
- [ ] **Verify desktop (1280/1440/1920px):** image proportions match live (no stretch), full-bleed, and the arc cleanly cuts the image bottom; eyebrow/divider/H1/overlay/pill unchanged.
- [ ] **Verify mobile (390px):** image not stretched, arc seam correct; no regression to the mobile hero.
- [ ] **No content change:** confirm `index.plain.html` hero `<picture>`/`<img>` markup is unchanged by this step (CSS-only).
- [ ] **Lint:** stylelint on changed source files; expect clean (compiled `hero.css` pre-existing formatting noise is excluded by `.stylelintignore`; project lint shows only the 3 known safety-bar errors).
- [ ] **Report pass/fail and HOLD for approval before any commit/push** (standing rule: never push without explicit approval).

## Notes / Risks
- Scope is the **hero image sizing/fit + arc alignment only**. No HTML edits; the base64→URL `<picture>` swap stays as-is.
- If the stretch traces to the swapped `<img>`'s intrinsic `width/height` attributes (mobile dims on the fallback), the minimal correct fix may instead be matching those attributes to the rendered source — that would be a **content** tweak and will be flagged for approval before applying, since content changes go through the import path.
- Separate **pending/uncommitted** items from this session remain: hero image swap, sticky nav-pill CSS, nav-pill link sizing, hero H1 margin, and the earlier **H1 desktop size** critique (40px vs live ~56px) — still open, not part of this image fix.
- **Execution requires Execute mode** — this plan is read-only analysis; live measurement and CSS edits run once approved.
