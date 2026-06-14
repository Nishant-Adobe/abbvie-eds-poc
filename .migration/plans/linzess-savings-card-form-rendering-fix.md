# Fix LINZESS Savings Card — Radio, Checkbox & Button Container Rendering

## Root cause (confirmed from live DOM)

The "radio buttons," "tick boxes," and CTA buttons on the savings-card form are **faux controls drawn entirely by CSS** that hooks onto custom classes (`form-radio`, `form-checkbox`, `form-radio-question`, `form-consent`, `form-expand-link`, `button secondary`). The authored source (`content/linzess/savings-card/index.plain.html`) has these classes, but the content is stored/round-tripped as **Markdown**, which cannot represent `<span>` or `class` attributes on inline/paragraph content. So by the time the page renders live, **every custom class is stripped** and the empty marker spans are deleted.

Verified live DOM inside `main > .section.white-arc > .default-content-wrapper`:

| # | Authored | Live result | Why broken |
|---|----------|-------------|------------|
| Radio question | `<p class="form-radio-question">` | `<p>` (no class) | `.form-radio-question` margins (styles.css:3797) never match → spacing collapses |
| Yes / No | `<span class="form-radio">Yes</span> <span...>No</span>` | `<p>Yes No</p>` — **spans deleted** | `.form-radio::before` circle (3817) has no element to attach to → no radio bullets |
| Marketing consent | `<span class="form-checkbox"></span> …` | `<p>` — **empty span deleted** | `.form-checkbox` square (3840) has no element → no tick box |
| Expand link | `<p class="form-expand-link">` | `<p>` (no class) | indent/spacing rules (3867) never match |
| Buttons | `<p class="button-container">…<a class="button secondary">` | `<p>` with two bare `<a>` | custom classes stripped **and** EDS auto-button decoration only fires for a *single* link in a `<p>` — two links here, so no `.button`/`.button-container` generated at all → plain text links, no padding/margin/pill |

This is the same class-stripping issue your codebase already documents for the reCAPTCHA logo (styles.css:3913 — "the custom class is stripped... target by alt text instead").

## Approach: structural CSS selectors (no content edit)

Re-point the dead `.form-*` / `.button-container` rules onto **content-based `:has()` and positional selectors** that match the surviving DOM. This is the established pattern already used for the reCAPTCHA image in this file. All changes go in `styles/styles.css`, scoped to `main > .section.white-arc > .default-content-wrapper`.

### What structural CSS CAN fully fix
- **Radio question spacing** → `> p:first-child:has(strong)` (replaces `.form-radio-question`)
- **Marketing-consent tick box** (single checkbox) → `> p:has(a[href*="PrivacyUseData"])` with `padding-left` + a `::before` square (re-creates `.form-checkbox` as a generated box)
- **Expand link** indent/spacing → positional `> p:nth-child(5)`
- **reCAPTCHA notice** → `> p:has(a[href*="policies.google.com"])`
- **Button container + pills** → `> p:has(a[href$="/activate"])` as the flex container; `> p a` as solid purple pills; `> p a[href$="/activate"]` as the secondary/ghost variant (restores padding & margin)
- **Disclaimer** → `> p:has(em):last-child`

### Known limitation (must flag)
The **Yes / No radio bullets cannot be recreated with pure CSS.** The two `<span>`s collapsed into a single text node `<p>Yes No</p>`, so there are no element boundaries to attach two separate circle markers to. Pure structural CSS can only draw one marker before the whole line, which would be wrong. Real per-option radio circles require **one** of:
- **(A)** a minimal content-source change so each option survives Markdown (e.g. author Yes/No as separate list items or links), or
- **(B)** a few lines of decoration JS to wrap the options at runtime.

I'll implement the CSS fixes for everything else, and recommend option (A) for the Yes/No markers as a tiny follow-up.

## Checklist

- [ ] Re-point `.form-radio-question` rule (styles.css:3797) → `main > .section.white-arc > .default-content-wrapper > p:first-child:has(strong)` for question spacing
- [ ] Re-point marketing-consent rule (`.form-consent` 3830 + `.form-checkbox` 3840) → `> p:has(a[href*="PrivacyUseData"])` with `padding-left` and a `::before` square box to render the tick box
- [ ] Re-point expand-link rule (`.form-expand-link` 3867) → positional `> p:nth-child(5)` indent/spacing
- [ ] Re-point reCAPTCHA notice rule (`.form-recaptcha` 3888) → `> p:has(a[href*="policies.google.com"])`
- [ ] Re-point button-container rule (3590) → `> p:has(a[href$="/activate"])` flex container (restore gap/margin/justify)
- [ ] Re-point button pill rules (3598) → `> p:has(a[href$="/activate"]) a` for primary pill and `… a[href$="/activate"]` for the secondary ghost variant (restore padding/border-radius)
- [ ] Re-point disclaimer rule (`.form-disclaimer` 3896) → `> p:has(em):last-child`
- [ ] Verify the consent paragraphs' `~ p` sibling rules (3854) still cascade after re-anchoring
- [ ] Reload the live/preview page and confirm via DOM inspection: tick box visible, button pills have padding/margin, spacing restored
- [ ] **Yes/No radio bullets:** confirm decision — minimal content-source edit (recommended) vs. runtime JS — then implement the chosen option
- [ ] Cross-check the sibling `activate` page (`content/linzess/savings-card/activate.plain.html`) uses the same structure so the fix covers both

> Note: this plan only edits `styles/styles.css` (plus, pending your decision, a small content/JS change for the Yes/No bullets). Applying the edits requires switching to Execute mode.
