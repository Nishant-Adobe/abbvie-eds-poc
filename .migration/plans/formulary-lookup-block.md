Let me analyze the source HTML and screenshot in detail to understand all the visual elements and their styling.Now let me look at the source screenshot carefully. The SkyriziHCP page has more than just the formulary block — it has:

1. A **section heading**: "PLANS LISTING SKYRIZI AS PREFERRED* FOR Ps IN YOUR COUNTY" (teal/blue color)
2. A **blue dotted divider** line
3. A **description**: "SEE WHICH PLANS IN YOUR AREA INCLUDE SKYRIZI ON THEIR PREFERRED DRUG **FORMULARY**"
4. The **ZIP input + button** inline
5. **reCAPTCHA notice**
6. **Disclaimer** (bold + regular paragraphs)
7. Another **gray dotted divider**
8. **"BRIDGE PROGRAM ELIGIBILITY"** heading with sub-text
9. **"BRIDGE PROGRAM"** CTA button

The formulary block itself handles items 3-6. Items 1-2 and 7-9 are separate content above/below the block (section heading, dividers, additional rich text, CTAs). These are default content elements in the EDS section, not part of the formulary-lookup block.

Let me also examine the exact styling gaps between our current preview and the source screenshot.# SkyriziHCP Formulary Lookup — Pixel-Perfect Replication Plan

## Source Analysis

The screenshot shows the full SkyriziHCP coverage/access section from `skyrizihcp.com`. It contains **multiple content elements** within a styled section, not just the formulary-lookup block:

### Source Section Structure (top to bottom)

| # | Element | Source Class | EDS Equivalent |
|---|---------|-------------|----------------|
| 1 | Section heading | `.c-risa-pri h2` — teal/cyan text | Default content `<h2>` with section-level brand color |
| 2 | Blue dotted divider | `.divider--blue` image-text component | Default content horizontal rule or separator block |
| 3 | Description text | `.abbv-rich-text .fs-20 .fwb` — bold 20px centered | Formulary block `heading` field (already authored) |
| 4 | ZIP input + "LOOK UP STATUS" button | `.abbv-formulary-zipcode` + `.abbv-button-secondary` | Formulary block `zip` variant (already working) |
| 5 | reCAPTCHA notice | `.abbv-badgeless-captcha` — small centered text | Formulary block `recaptcha-notice` field |
| 6 | Disclaimer | `.abbv-rich-text .abbv-width-90pc` — bold first paragraph, regular second | Formulary block `disclaimer` field |
| 7 | Gray dotted divider | `.divider--gray` | Default content horizontal rule |
| 8 | "BRIDGE PROGRAM ELIGIBILITY" | `.abbv-rich-text h2` — bold centered | Default content `<h2>` + `<p>` |
| 9 | "BRIDGE PROGRAM" CTA | `.abbv-button-primary` modal trigger | CTA block or default content link |

### What the Formulary Block Handles (items 3-6)
The block itself renders correctly — heading, ZIP input, button, reCAPTCHA, disclaimer. The visual gaps are:

1. **Section-level background**: Light blue/white card-like container with padding — this is the parent `.abbv-background-container` section styling, not block CSS
2. **Disclaimer bold first paragraph**: The source has the first disclaimer paragraph in bold — need `<strong>` wrapping in the authored content
3. **Heading "FORMULARY" highlight**: Already authored with `<strong>` but may need color highlight (the source shows it with a different background/color) — looking more carefully, it appears bold-only, which we already have

### What's Outside the Block (items 1-2, 7-9)
These are separate content elements that need to be authored as default content or separate blocks in the same section:
- Section heading ("PLANS LISTING SKYRIZI...")
- Dividers (horizontal rules)
- Bridge Program section (heading + text + CTA)

## CSS Gaps in Abbvie Brand Override

Comparing the source screenshot to the current local preview:

| Property | Current | Source Screenshot | Fix |
|---|---|---|---|
| Disclaimer first paragraph | Regular weight | **Bold** | Author with `<strong>` wrapping in content |
| Disclaimer max-width | `700px` | ~90% of container (`abbv-width-90pc`) | Change to `max-width: 90%` or keep `700px` (close enough) |
| Heading "FORMULARY" | `<strong>` (bold) | Bold + possibly highlighted | OK — bold matches |
| Section container | No background styling | Light blue/white card background | Section-level CSS, not block |

## Content Updates

The `formulary-skyrizi.plain.html` needs:
1. **Disclaimer**: Wrap first paragraph in `<strong>` to match source
2. **Section heading + dividers + Bridge Program**: Add as default content above and below the block within the same section

## Checklist

### Content Authoring
- [ ] **1.1** Update `content/formulary-skyrizi.plain.html` — wrap first disclaimer paragraph text in `<strong>` tags
- [ ] **1.2** Add section heading "PLANS LISTING SKYRIZI AS PREFERRED* FOR Ps IN YOUR COUNTY" as default content `<h2>` above the block
- [ ] **1.3** Add horizontal rule dividers (blue dotted + gray dotted) as `<hr>` elements
- [ ] **1.4** Add "BRIDGE PROGRAM ELIGIBILITY" heading + description + CTA button below the block

### CSS — Abbvie Brand Override
- [ ] **2.1** Add section heading color token for teal/cyan heading (`color: var(--skyrizi-heading-color)` or direct value)
- [ ] **2.2** Style `<hr>` elements within the section as dotted blue/gray dividers
- [ ] **2.3** Verify disclaimer `max-width` and bold paragraph rendering

### CSS — Base Block
- [ ] **2.4** Ensure `.formulary-lookup-disclaimer strong` or `.formulary-lookup-disclaimer p:first-child` bold styling works

### Verification
- [ ] **3.1** Preview full SkyriziHCP page with all content elements and compare against source screenshot
- [ ] **3.2** Verify dividers, heading colors, disclaimer bold, and CTA button styling

---

## Notes
- The section-level background (light blue container) is outside the formulary-lookup block scope. It would be a section-level style class (e.g., `section-metadata: style = light-blue-bg`) applied to the parent `<div class="section">`.
- The "BRIDGE PROGRAM" CTA button styling depends on the project's global button/CTA styles, not the formulary block CSS.
- The divider styling (blue/gray dotted lines) may require a separator block or styled `<hr>` elements.
- **Execution requires switching to Execute mode.**
