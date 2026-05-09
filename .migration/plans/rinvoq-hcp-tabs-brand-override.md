# Rinvoq HCP — Tabs Block Brand Override Plan

## Understanding

From the reference screenshots of `rinvoqhcp.com` safety/efficacy pages:

**Two distinct tab style variations are used:**

### Variation 1: "Folder Tab" (Study Design / Baseline Characteristics)
- Active tab: White bg, bold italic text, rounded top corners, raised above panel
- Inactive tab: Light gray bg (`--color-glacier`), normal weight, flat
- Panel: White card
- Left-aligned

### Variation 2: "Pill Tab" (RA / PsA / AS / nr-axSpA / GCA)
- Tabs: Rounded pill-shaped buttons with border
- Active tab: Bold text, white bg, prominent border
- Inactive tab: Light bg with border, regular weight
- Horizontally spaced, left-aligned

---

## Two-Column Authoring Approach

**Chosen approach: Two sections with the same tab name.**

The existing `tabs.js` already supports this — when multiple sections share the same name (e.g., both named "PsA"), the JS wraps them together into a single `.tabs-panel` div.

For Rinvoq HCP, the brand override CSS grids them: **first section = 8 cols (table/content), second section = 4 cols (sidebar)**.

**Authoring example:**
```
Section (Tabs block — "tabs-pill" variant)
├── Tab Item: "RA"
├── Tab Item: "PsA"

Section (name: "RA")          ← single section → full width

Section (name: "PsA")        ← first of two → 8 columns (left)

Section (name: "PsA")        ← second of two → 4 columns (right sidebar)
```

---

## Existing Assets

| File | Status |
|------|--------|
| `styles/rinvoq-hcp/tokens.css` | ✅ Exists — full Rinvoq HCP brand tokens |
| `blocks/tabs/rinvoq-hcp/` | ❌ Does NOT exist — first push for this brand |

**Note:** `styles/rinvoq/` is Rinvoq DTC (consumer). This plan uses `styles/rinvoq-hcp/` which is the correct HCP brand. No revert needed — nothing was pushed to the wrong brand.

---

## File Structure to Create

```
blocks/tabs/rinvoq-hcp/
├── _tabs.css           (entry point — imports)
├── tabs.css            (brand overrides — both variations)
└── block-config.js     (empty config)
```

---

## CSS Implementation

```css
/* Entry: _tabs.css */
@import './tabs.css';

/* Override: tabs.css */
@import '../tabs.css';
@import '../../../styles/rinvoq-hcp/tokens.css';

/* ── Tab container ── */
.section.tabs-container {
  margin-bottom: 0;
  padding-bottom: 0;
}

/* ── Tab controls wrapper ── */
.tabs-container .tabs-wrapper {
  display: flex;
  justify-content: flex-start;
  align-items: flex-end;
}

/* ── Tab list — base (folder style) ── */
.tabs-container .tabs .tabs-list {
  display: flex;
  gap: var(--spacing-02);
  background: transparent;
  border: none;
  padding: 0;
  border-radius: 0;
}

/* ── Tab buttons (inactive) — folder style ── */
.tabs-container .tabs .tabs-list button.tabs-tab {
  padding: var(--spacing-12) var(--spacing-24);
  background: var(--color-glacier);
  color: var(--color-charcoal);
  font-family: var(--body-font-family);
  font-size: var(--font-size-16);
  font-weight: var(--font-weight-body);
  font-style: normal;
  border: none;
  border-radius: var(--spacing-08) var(--spacing-08) 0 0;
  white-space: nowrap;
  position: relative;
  cursor: pointer;
  transition: background-color var(--transition-duration-fast);
}

/* ── Active tab — folder style ── */
.tabs-container .tabs .tabs-list button.tabs-tab[aria-selected='true'] {
  background: var(--background-color);
  color: var(--color-charcoal);
  font-weight: var(--font-weight-heading);
  font-style: italic;
  box-shadow: var(--shadow-default);
  z-index: var(--z-index-1);
}

/* ── Pill variation (add class "tabs-pill" on Tabs block) ── */
.tabs-container .tabs.tabs-pill .tabs-list {
  gap: var(--spacing-08);
}

.tabs-container .tabs.tabs-pill .tabs-list button.tabs-tab {
  border: var(--separator-height-1) solid var(--color-border-default);
  border-radius: var(--spacing-06);
  background: var(--background-color);
  padding: var(--spacing-10) var(--spacing-20);
  font-style: normal;
}

.tabs-container .tabs.tabs-pill .tabs-list button.tabs-tab[aria-selected='true'] {
  font-weight: var(--font-weight-heading);
  font-style: normal;
  border-color: var(--color-charcoal);
  box-shadow: none;
}

/* ── Panel wrapper ── */
.tabs-panel {
  background: var(--background-color);
  border: none;
  border-top: var(--separator-height-1) solid var(--color-border-default);
  padding: var(--spacing-30) var(--spacing-24);
  margin: 0;
  position: relative;
  max-width: var(--content-max-width);
  margin-left: auto;
  margin-right: auto;
}

/* ── Sections inside panel — remove default spacing ── */
.tabs-panel > .section.abbvie-container {
  margin: 0;
  padding: 0;
  max-width: none;
}

/* ── Two-section layout (8+4 grid): content left, sidebar right ── */
/* Base: mobile stacked */
.tabs-panel {
  display: grid;
  grid-template-columns: 1fr;
  gap: var(--spacing-24);
}

/* Tablet+: 2 sections → side by side 8+4 */
@media (width >= 600px) {
  .tabs-panel:has(> .section:first-child:nth-last-child(2)) {
    grid-template-columns: repeat(12, 1fr);
  }

  .tabs-panel > .section:first-child:nth-last-child(2) {
    grid-column: span 8;
  }

  .tabs-panel > .section:first-child:nth-last-child(2) ~ .section {
    grid-column: span 4;
  }
}

/* Single section → full width */
.tabs-panel > .section:only-child {
  grid-column: 1 / -1;
}

/* ── Responsive: tablet+ tab padding ── */
@media (width >= 600px) {
  .tabs-container .tabs .tabs-list button.tabs-tab {
    padding: var(--spacing-14) var(--spacing-30);
  }
}
```

---

## Tokens Already Available (no additions needed)

From `styles/rinvoq-hcp/tokens.css`:
- `--color-glacier: #f5f5f5` → inactive tab bg
- `--color-charcoal: #25282a` → text color
- `--background-color: #fff` → active tab & panel bg
- `--font-weight-heading: 600` → active tab bold
- `--shadow-default: 0 4px 19px 0 rgba(0, 0, 0, 0.07)` → elevation
- `--color-border-default: #c9c9ca` → borders
- `--body-font-family: 'Graphik'` → all text
- `--font-weight-body: 400` → inactive text weight

---

## Best Practices Compliance

### CSS ✅
- [x] Mobile-first (base = mobile, `@media` for tablet+)
- [x] Only `600px` and `900px` breakpoints
- [x] All values use design tokens
- [x] No `!important`
- [x] No hardcoded colors/spacing/fonts
- [x] Proper scoping (`.tabs-container .tabs .tabs-list`)

### JavaScript ✅ (no JS changes needed)
- [x] No CSS in JS (only classes)
- [x] Semantic HTML elements
- [x] Null safety (optional chaining)
- [x] Imports have `.js` extension
- [x] No `console.log` statements
- [x] Event listeners cleaned up

### Block Structure ✅
- [x] Single export default function (existing `tabs.js` unchanged)
- [x] Clear variable names
- [x] Works without JavaScript (tabs degrade to visible sections)
- [x] Performance optimized (CSS-only layout, no JS grid logic)

---

## Checklist

- [ ] Create directory `blocks/tabs/rinvoq-hcp/`
- [ ] Create `blocks/tabs/rinvoq-hcp/_tabs.css` — entry point importing `./tabs.css`
- [ ] Create `blocks/tabs/rinvoq-hcp/tabs.css` — brand override with both tab styles
  - [ ] **Folder tab style** (default): gray inactive, white active with italic bold + shadow
  - [ ] **Pill tab style** (`.tabs-pill` variant): bordered pill buttons, bold active, no italic
  - [ ] Panel styling: white bg, top border, proper padding
  - [ ] **Two-section grid** (8+4): content left, sidebar right when 2 sections share name
  - [ ] **Single-section**: full width
  - [ ] Sections inside panel: zero margin/padding override
  - [ ] Mobile-first responsive (stacked base → side-by-side at `600px`)
- [ ] Create `blocks/tabs/rinvoq-hcp/block-config.js` — empty config
- [ ] Lint CSS with stylelint
- [ ] Verify no hardcoded values — all from `styles/rinvoq-hcp/tokens.css`

---

*Implementation requires Execute mode.*
