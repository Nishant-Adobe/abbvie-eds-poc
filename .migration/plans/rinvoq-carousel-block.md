# Parallax Image Block — Development Plan

## Overview

The Parallax Image block creates a visual depth effect where a background image scrolls at a slower rate than the page content. Used on **Skyrizi HCP** and **Mavyret HCP** brand sites for section backgrounds on Home and Efficacy pages.

## Reference from Execution Plan

- **Priority:** P5 — Conditional (~3 pages)
- **Effort:** 1 day / 8 hours
- **DOM Evidence:** `abbv-parallax` + `abbv-parallax-bg`
- **Implementation:** CSS `transform: translateY` on scroll via IntersectionObserver
- **Key requirement:** Respects `prefers-reduced-motion: no-preference` gating
- **Risk:** GPU layer promotion — verify no layout thrash; test on low-end mobile

## EDS Block Specification (from Requirements Doc)

| Field | Type | Notes |
|---|---|---|
| `image` | reference | Background image for parallax (DAM) |
| `imageAlt` | text | Alt text (not decorative if content overlays it) |
| `speed` | select | slow, medium (default), fast |
| `content` | richtext | Overlay text/content on top of parallax image |
| `anchorId` | text | Anchor ID |

## Approach

**CSS-only parallax** via `background-attachment: fixed` on desktop, with static fallback on mobile/tablet (where `background-attachment: fixed` causes performance issues). Respects `prefers-reduced-motion`.

## Checklist

### Phase 1: Block Scaffold
- [ ] Create `blocks/parallax/` directory with `parallax.js`, `parallax.css`, `block-config.js`
- [ ] Create brand overrides: `blocks/parallax/skyrizi-hcp/`, `blocks/parallax/mavyret/`
- [ ] Add block to `component-definition.json`
- [ ] Add component model to `component-models.json` (image, imageAlt, speed, content, anchorId)
- [ ] Add to `component-filters.json` section components list

### Phase 2: JavaScript Decoration
- [ ] Read authored image, speed, and content from block DOM table
- [ ] Build rendered DOM: wrapper div with background image + content overlay
- [ ] Set `background-image` from authored DAM reference
- [ ] Apply `data-speed` attribute for CSS to reference
- [ ] Set `anchorId` as `id` on wrapper
- [ ] Call `renderBlock(block)` for brand config execution

### Phase 3: CSS Implementation
- [ ] Base styles: full-width section, `background-size: cover`, `background-position: center`
- [ ] Desktop: `background-attachment: fixed` (creates parallax effect)
- [ ] Mobile (`< 768px`): `background-attachment: scroll` (disable parallax for performance)
- [ ] `prefers-reduced-motion: reduce` — disable fixed attachment, use static image
- [ ] Speed variants via CSS custom properties:
  - `slow` → subtle effect (minimal transform offset)
  - `medium` → default parallax rate
  - `fast` → exaggerated parallax
- [ ] Content overlay: positioned on top with z-index, proper padding, readable text colors
- [ ] Mobile-first approach (base = mobile, media query for desktop)
- [ ] All values via CSS tokens (`--parallax-min-height`, `--parallax-overlay-bg`, etc.)

### Phase 4: Accessibility & Performance
- [ ] `prefers-reduced-motion` media query disables parallax entirely
- [ ] Image has proper `alt` text via `role="img" aria-label`
- [ ] Content overlay is semantically meaningful (not just decorative)
- [ ] No JavaScript scroll listeners — CSS-only approach avoids jank
- [ ] Image lazy-loaded if below fold (via `loading="lazy"` or IntersectionObserver)
- [ ] Verify no layout thrash via Chrome DevTools Performance tab

### Phase 5: Testing
- [ ] Test on Chrome, Firefox, Safari, Edge (desktop)
- [ ] Test on iOS Safari + Android Chrome (mobile — parallax disabled)
- [ ] Verify `prefers-reduced-motion` disables effect
- [ ] PSI check — no LCP regression from background image
- [ ] Lint passes
- [ ] Test with skyrizi-hcp and mavyret brand tokens

## Files to Create/Modify

| File | Purpose |
|---|---|
| `blocks/parallax/parallax.js` | Block decoration JS |
| `blocks/parallax/parallax.css` | Base CSS with parallax effect |
| `blocks/parallax/block-config.js` | Empty default (no brand-specific JS needed) |
| `blocks/parallax/_parallax.json` | Block definition + model |
| `blocks/parallax/skyrizi-hcp/_parallax.css` | Brand CSS override (if needed) |
| `blocks/parallax/mavyret/_parallax.css` | Brand CSS override (if needed) |
| `component-definition.json` | Register block |
| `component-models.json` | Add parallax model fields |
| `component-filters.json` | Allow in section |

## Implementation Notes

- **No JS scroll listener needed** — pure CSS `background-attachment: fixed` handles the parallax effect without any JavaScript, which is the most performant approach
- On iOS, `background-attachment: fixed` doesn't work — the mobile CSS disables it automatically
- The block is essentially a full-width section with a fixed background image and overlaid content — very similar to a hero block but without the carousel/slider functionality
- Brand-specific overrides are likely just color tokens for the overlay text

## Execution

Implementation requires Execute mode. Create a new branch `parallax-block` off `develop` and implement following the checklist above.
