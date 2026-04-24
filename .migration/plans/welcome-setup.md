# Demo Brand Explorer Block — Implementation Plan

## Overview

Create a new `demo-brand-explorer` block that replicates the multi-brand product navigator accordion from [skyrizihcp.com/dermatology](https://www.skyrizihcp.com/dermatology). The original component uses a BEM-style `.brandexplorer` pattern — a fixed bottom bar with AbbVie logo, "Immunology Therapies" toggle, utility links, and an expandable panel containing product accordion blades with indication links.

---

## Original Component Analysis

### Structure (from skyrizihcp.com)
The original `.brandexplorer` has two main zones:

1. **Bar (`brandexplorer__bar`)** — fixed to viewport bottom, dark navy background, contains:
   - **Left section (`brandexplorer__left`)**: AbbVie SVG logo + "Immunology Therapies" browse button (toggle)
   - **Right section (`brandexplorer__right`)**: Utility links (Contact Medical Info, Full Prescribing Info, Patient Site)

2. **Content panel (`brandexplorer__content`)** — hidden by default, slides open on toggle:
   - Close button (`brandexplorer__close`)
   - **Accordions container (`brandexplorer__accordions`)** — 3-column grid on desktop, accordion on mobile (<896px):
     - **Accordion items (`brandexplorer__accordion`)** — one per brand (Rinvoq, Skyrizi, Humira), each containing:
       - **Blade (`brandexplorer__blade`)**: Brand product image + optional safety subtitle with `<hr>`
       - **Links (`brandexplorer__links`)**: Indication links (`brandexplorer__indication`) with severity prefix modifiers (`--moderate`, `--active`, `--refractory`, `--noninfectious`, `--blank`) + "Visit [brand].com" link (`brandexplorer__visit`)
   - Project number text (`brandexplorer__projectnumber`)

### Key Computed Styles
| Element | Key Properties |
|---|---|
| `.brandexplorer` | `position: relative; z-index: 100; color: rgb(33,64,109); font: 14px/16px Arial; background: #fff` |
| `.brandexplorer__bar` | `display: flex; flex-direction: column; justify-content: space-between; align-items: center; max-width: 1220px; padding: 0 15px; color: #fff` |
| `.brandexplorer__left` | `display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid #d8d8d8; padding: 10px 0 0 12px` |
| `.brandexplorer__right` | `display: flex; justify-content: space-between; align-items: center` |
| `.brandexplorer__browse` | `font-size: 13px; color: #fff; padding: 12px 42px 12px 0; cursor: pointer` (with circle-plus icon) |
| `.brandexplorer__close` | `position: absolute; right: -10px; z-index: 10; color: rgb(7,29,73); cursor: pointer` (with X icon) |
| `.brandexplorer__content` | `display: none; max-width: 1220px; margin: 0 auto; padding: 0 15px` (slideToggle on open) |
| `.brandexplorer__accordions` | `display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 40px` (on desktop) |
| `.brandexplorer__accordion` | `position: relative; margin-bottom: 20px; height: 100%` |
| `.brandexplorer__indication` | `color: rgb(7,29,73); font-weight: 700; padding: 12px 12px 16px 0; width: 100%; cursor: pointer` |
| `.brandexplorer__visit` | `color: rgb(7,29,73); font-weight: 700; padding: 12px 42px 16px 0` (with arrow icon) |
| `.brandexplorer__logo` | `width: 86px` (AbbVie SVG logo) |

### Responsive Behavior
- **Desktop (≥896px)**: Accordions displayed as 3-column grid; links always visible; blades act as visual headers
- **Mobile (<896px)**: Accordions collapse; blades become clickable accordion triggers; links slideToggle; `brandexplorer__active` class toggles visibility

### Toggle Behavior
- Clicking "Immunology Therapies" (`brandexplorer__browse`) adds `brandexplorer__open` class and slides the `brandexplorer__content` panel open
- Clicking close button or outside the component closes it
- On mobile, clicking a blade toggles `brandexplorer__active` on its accordion and collapses others

---

## EDS Content Model Design

The block will use a table-based authoring model:

```
| demo-brand-explorer                                             |
| AbbVie Logo URL | Bar Label       | Utility Link 1 | Link URL  |  ← Row 0: bar config
| Brand Image     | Brand Name      | Safety Text     | Brand URL |  ← Row 1..n: brand accordion
| Indication Name | Indication URL  | Severity Type   |           |  ← Sub-rows per brand
```

**Simplified approach** — each row type is identified by content pattern:
- **Row 0** (first row): Bar label text (e.g., "Immunology Therapies")
- **Rows 1+**: Each row is either a **brand header** (has image) or an **indication link** (text + URL + optional severity modifier)

---

## Files to Create/Modify

### New Files
1. **`blocks/demo-brand-explorer/demo-brand-explorer.js`** — Block decoration logic
2. **`blocks/demo-brand-explorer/demo-brand-explorer.css`** — Block styles matching original
3. **`blocks/demo-brand-explorer/block-config.js`** — Block configuration (empty defaults)
4. **`blocks/demo-brand-explorer/_demo-brand-explorer.json`** — UE component model

### Brand Override Files (scaffolded, initially empty)
5. **`blocks/demo-brand-explorer/abbvie/_demo-brand-explorer.css`** — AbbVie partial
6. **`blocks/demo-brand-explorer/abbvie/demo-brand-explorer.css`** — AbbVie compiled
7. **`blocks/demo-brand-explorer/abbvie/block-config.js`** — AbbVie block config

### Existing Files to Update
8. **`component-definition.json`** — Add demo-brand-explorer block definition
9. **`component-models.json`** — Add demo-brand-explorer field models
10. **`component-filters.json`** — Add demo-brand-explorer to section filters

### Test Content
11. **`content/test-demo-brand-explorer.plain.html`** — Test page with authored block content

---

## Implementation Details

### JavaScript (`demo-brand-explorer.js`)

The `decorate()` function will:
1. Parse authored rows into: bar config, brand entries (each with image, name, safety text, URL), and indication links per brand
2. Build the DOM structure:
   - `.demo-brand-explorer-bar` with `.demo-brand-explorer-left` (logo + browse button) and `.demo-brand-explorer-right` (utility links)
   - `.demo-brand-explorer-content` with `.demo-brand-explorer-accordions` container
   - Per-brand `.demo-brand-explorer-accordion` with `.demo-brand-explorer-blade` (image + subtitle) and `.demo-brand-explorer-links` (indications + visit link)
   - `.demo-brand-explorer-close` button inside content
3. Wire toggle logic:
   - Browse button click → toggle `is-open` class + slideToggle content
   - Close button → close panel
   - Outside click → close panel
   - Escape key → close panel
   - Mobile blade click (<896px) → toggle `is-active` on accordion, collapse others
4. Move the block section to `document.body` and fix to bottom

### CSS (`demo-brand-explorer.css`)

Match the original computed styles, including:
- Fixed bottom positioning via section
- Navy dark bar (`#071d49` area) with white text
- 3-column grid for accordions on desktop
- Accordion collapse behavior on mobile (<896px)
- BEM-style indication links with bold 14px/16px Arial
- Slide transitions for open/close
- Icon pseudo-elements for browse (circle-plus), close (X), and visit (arrow-right)
- Brand product images within blades
- Safety subtitle text with `<hr>` separators

### Key Color Values
- Bar/navigation text: `#fff` (white)
- Content panel text: `rgb(33, 64, 109)` / `#21406d`
- Indication links: `rgb(7, 29, 73)` / `#071d49`
- Left border-bottom: `rgb(216, 216, 216)` / `#d8d8d8`
- Background: `#fff`

---

## Checklist

- [ ] Create `blocks/demo-brand-explorer/demo-brand-explorer.js` — decoration logic with bar, panel, accordions, toggle behavior
- [ ] Create `blocks/demo-brand-explorer/demo-brand-explorer.css` — full styles matching skyrizihcp.com brand explorer
- [ ] Create `blocks/demo-brand-explorer/block-config.js` — default block config
- [ ] Create `blocks/demo-brand-explorer/_demo-brand-explorer.json` — UE component model with bar label, brand entries, indications
- [ ] Scaffold brand override folders (`abbvie/`) with partial CSS and block-config
- [ ] Update `component-definition.json` — register demo-brand-explorer block
- [ ] Update `component-models.json` — add field models for authoring
- [ ] Update `component-filters.json` — allow block in sections
- [ ] Create test content page (`content/test-demo-brand-explorer.plain.html`)
- [ ] Run CSS build (`npm run scaffold:build`) to compile brand partials
- [ ] Preview in local dev server and verify: bar renders fixed at bottom, toggle opens panel, accordions display in 3-col grid on desktop
- [ ] Verify mobile responsive behavior: accordion collapse at <896px breakpoint
- [ ] Visual comparison against original skyrizihcp.com component
- [ ] Run lint checks (`npm run lint`)

---

## Dependencies & Risks

- **No jQuery**: The original uses jQuery for slideToggle/click handlers. The EDS block will use vanilla JS with CSS transitions instead.
- **SVG Logo**: The AbbVie SVG logo will be referenced via an authored image or icon, not hardcoded.
- **Product Images**: Brand images (Rinvoq, Skyrizi, Humira logos) need to be available in the content/DAM — the test content will use placeholder images.
- **Cross-origin styles**: Cannot directly read CSS rules from skyrizihcp.com stylesheets (CORS). Styles were extracted via computed style inspection.

> **Note:** This plan requires Execute mode to implement. Switch to Execute mode to begin building.
