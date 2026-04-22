---
name: building-brand
description: End-to-end guide for creating, configuring, and removing a brand in the EDS Multi-Brand project. Covers scaffold generation, token configuration, global style overrides, font setup, block-level brand overrides, block-config.js brand customisation, CSS build, page metadata, and removal. Use this skill whenever adding a new brand identity to the project.
---

# Building a Brand

This skill guides you through everything required to introduce a new brand identity into the EDS Multi-Brand project. A **brand** is a distinct site identity — its own design tokens, global styles, fonts, and block-level visual overrides — deployed under a brand-specific sub-path (e.g. `/roy/…`).

## Related Skills

- **building-themes**: Use when adding a theme (visual variant) within or across brands after the brand is set up. The scaffold auto-creates theme folders for all existing themes when a brand is created.
- **building-blocks**: Use when a new block needs to be created for this brand. The scaffold automatically creates brand folders for all brands in `brand-config.json` when a block is scaffolded.
- **building-brand-blocks**: Use when implementing block-level visual overrides specific to this brand — editing `_{block}.css` partials, brand `block-config.js`, or brand+theme CSS. The scaffold creates empty override partials for all existing blocks.
- **ue-component-model**: Use to expose `brand` as a page-level `select` field in Universal Editor after the brand is registered.

---

## What the Scaffold Creates

Running `npm run scaffold:create` (choosing **Brand**) calls `node theme-tools/initiate-brand.js brand {name}` which:

1. Adds the brand name to `brand-config.json` → `brands[]`
2. Creates **`styles/{brand}/`** with:
   - `_tokens.css` — prefilled with a copy of the global `styles/tokens.css` `:root` block
   - `_styles.css` — imports `../styles.css` + placeholder comment
   - `_fonts.css` — placeholder comment
   - `_lazy-styles.css` — imports `../lazy-styles.css` + placeholder comment
   - Compiled counterparts (`tokens.css`, `styles.css`, `fonts.css`, `lazy-styles.css`)
3. For each theme already in `brand-config.json`, creates **`styles/{brand}/themes/{theme}/`** with the same `_*.css` / `*.css` pairs
4. For each block already in **`blocks/`**, creates:
   - `blocks/{block}/{brand}/_{block}.css` — partial with `@import '../{block}.css';` + placeholder
   - `blocks/{block}/{brand}/block-config.js` — empty config template
   - `blocks/{block}/{brand}/themes/{theme}/_{block}.css` — for each existing theme
5. Also creates overrides in **`templates/`** if that directory exists

**Files are never overwritten** — the scaffold skips any file that already exists.

---

## Full Brand Directory Structure After Scaffold

```
styles/
└── {brand}/
    ├── _tokens.css            ← SOURCE: brand design tokens
    ├── _styles.css            ← SOURCE: brand global style overrides
    ├── _fonts.css             ← SOURCE: brand font declarations
    ├── _lazy-styles.css       ← SOURCE: brand lazy style overrides
    ├── tokens.css             ← compiled (do not edit)
    ├── styles.css             ← compiled
    ├── fonts.css              ← compiled
    ├── lazy-styles.css        ← compiled
    └── themes/{theme}/
        ├── _tokens.css        ← SOURCE: brand+theme token overrides
        ├── _styles.css        ← SOURCE: brand+theme style overrides
        ├── _fonts.css
        ├── _lazy-styles.css
        └── *.css (compiled)

blocks/{block}/
└── {brand}/
    ├── _{block}.css           ← SOURCE: brand block overrides
    ├── {block}.css            ← compiled
    ├── block-config.js        ← brand block config overrides
    └── themes/{theme}/
        ├── _{block}.css       ← SOURCE: brand+theme block overrides
        └── {block}.css        ← compiled
```

---

## Process

### Step 1: Check Prerequisites

Before creating a brand:
- Brand name must be **lowercase, letters/numbers/hyphens only** (validated by scaffold)
- Check `brand-config.json` to confirm the name doesn't already exist
- Confirm existing themes in `brand-config.json` — the scaffold will create brand+theme folders for all of them automatically

```sh
cat brand-config.json
```

### Step 2: Run the Scaffold

```sh
npm run scaffold:create
# Prompts: What do you want to create? → Brand
# Prompts: Enter Brand name: → {brand}
```

For verbose output (shows every file created/skipped):
```sh
npm run scaffold:create:log
```

The scaffold updates `brand-config.json` and creates all directories and partial files. Verify:

```sh
ls styles/{brand}/
ls blocks/*/  # each should now have a {brand}/ subfolder
```

### Step 3: Configure Brand Tokens

The most important step. Edit **`styles/{brand}/_tokens.css`** — the scaffold pre-fills it with the global token values as a starting point. Override only what differs from the defaults.

```css
/* styles/{brand}/_tokens.css */
:root {
  /* Override global base tokens (legacy names — match styles/tokens.css exactly) */
  --background-color: #ffffff;
  --light-color: #f4f4f4;
  --dark-color: #2b2b2b;
  --text-color: #111111;
  --link-color: #0057cc;
  --link-hover-color: #003d99;
  --body-font-family: 'Brand Sans', roboto-fallback, sans-serif;
  --heading-font-family: 'Brand Display', roboto-condensed-fallback, sans-serif;
  --nav-height: 72px;

  /* New brand-specific tokens — follow W3C Design Token naming */
  --color-brand-primary: #0057cc;
  --color-brand-accent: #ff6600;
  --color-brand-surface: #f0f4ff;
  --color-brand-on-surface: #111111;
}
```

**Available global token names to override** (from `styles/tokens.css`):
- Colors: `--background-color`, `--light-color`, `--dark-color`, `--text-color`, `--link-color`, `--link-hover-color`
- Fonts: `--body-font-family`, `--heading-font-family`
- Font sizes: `--body-font-size-m/s/xs`, `--heading-font-size-xxl/xl/l/m/s/xs`
- Nav: `--nav-height`

**W3C Design Token naming rules for new tokens:**

All new tokens introduced at brand, theme, or block level must follow the [W3C Design Token Community Group](https://www.w3.org/community/design-tokens/) format:

```
--{type}-{semantic-group}-{variant}
```

| Type prefix | Used for |
|---|---|
| `--color-` | All color values |
| `--font-family-` | Font stack declarations |
| `--font-size-` | Size values for text |
| `--font-weight-` | Weight values |
| `--spacing-` | Margin, padding, gap |
| `--border-` | Border width, radius, style |
| `--shadow-` | Box or text shadows |
| `--motion-` | Duration, easing |

```css
/* CORRECT — type prefix first, semantic group, then variant */
--color-brand-primary: #0057cc;
--color-brand-surface: #f0f4ff;
--color-text-inverse: #ffffff;
--font-family-display: 'Brand Display', serif;
--font-size-display-l: 3rem;
--spacing-section-gap: 4rem;
--border-radius-card: 8px;
--shadow-card-default: 0 2px 8px rgb(0 0 0 / 12%);

/* WRONG — no type prefix */
--brand-primary: #0057cc;
--brand-surface: #f0f4ff;

/* WRONG — brand or theme name embedded in the token name */
--roy-primary: #0057cc;
--bright-background: #fffde7;
```

Token names must be portable: they must make sense in any brand or theme context and must not encode the brand or theme name.

### Step 4: Add Brand Fonts

If the brand uses custom web fonts, edit **`styles/{brand}/_fonts.css`**:

```css
/* styles/{brand}/_fonts.css */
@font-face {
  font-family: 'Brand Sans';
  font-weight: 400;
  font-style: normal;
  font-display: swap;
  src: url('/styles/{brand}/fonts/brand-sans-regular.woff2') format('woff2');
}

@font-face {
  font-family: 'Brand Display';
  font-weight: 700;
  font-style: normal;
  font-display: swap;
  src: url('/styles/{brand}/fonts/brand-display-bold.woff2') format('woff2');
}
```

Place the font files in `styles/{brand}/fonts/`. Ensure they are optimised (woff2 only, subset if possible).

The `_fonts.css` partial does **not** import the global fonts file — fonts are declared fresh per brand. If you need to extend global fonts, add an `@import '../fonts.css';` at the top.

### Step 5: Override Global Styles (if needed)

Edit **`styles/{brand}/_styles.css`** for typography, layout, or section-level overrides specific to this brand. The file already imports the global base:

```css
/* styles/{brand}/_styles.css */
@import '../styles.css';

/* Brand-specific global overrides */
h1, h2, h3 {
  letter-spacing: -0.02em;
}

main > .section.highlight {
  background-color: var(--color-brand-surface);
}

a.button:any-link {
  border-radius: 4px;          /* override default pill shape */
  font-weight: 700;
}
```

Keep this file minimal — prefer block-level overrides over global ones. Only put rules here that genuinely apply across all blocks and all content.

### Step 6 & 7: Override Block CSS and JS for the Brand

**STOP — do not author block files here.**

All brand-level block work (CSS overrides, `block-config.js` flags/variations/decorations) must be done through the **`building-brand-blocks` skill**. Invoke it now for every block that needs brand-specific changes:

- It enforces the correct brand hierarchy (`blocks/{block}/{brand}/` structure)
- It ensures `block-config.js` is created and wired correctly alongside CSS partials
- It guides the CSS-only vs JS-change decision so the right files are touched

**Invoke `building-brand-blocks` for each block that needs brand overrides before proceeding to Step 8.**

If a block needs no visual or behavioural changes for this brand, leave its scaffold-generated partial (`_{block}.css`) as-is with only the `@import`. Do not delete it — the build pipeline expects it.

### Step 8: Build CSS

After editing all source partials, compile the merged CSS:

```sh
npm run scaffold:build
```

To build only this brand during development (faster):

```sh
# Add to .env temporarily
BRANDS={brand}
npm run scaffold:build
```

For verbose output when debugging:
```sh
npm run scaffold:build:log
```

### Step 9: Set Page Metadata

The runtime reads brand from the page's `brand` metadata. On AEM-authored pages, add this to the page metadata block:

```
Metadata
brand | {brand}
```

For local test content in `drafts/`, add to the HTML `<head>`:

```html
<meta name="brand" content="{brand}">
```

Without this metadata, the page loads the default (no-brand) styles — the brand CSS is never fetched.

### Step 10: Start Dev Server and Verify

```sh
npm start
```

Navigate to a page with `brand: {brand}` metadata. Open DevTools and verify:
- Brand CSS loaded: `Network` → filter by `/{brand}/` — should see `styles/{brand}/styles.css`, `styles/{brand}/tokens.css`, `styles/{brand}/fonts.css`
- Block brand CSS loaded: `blocks/{block}/{brand}/{block}.css` for each block on the page
- Brand tokens applied: in `Elements` panel, `:root` should show the brand token values
- Typography, colours, and spacing match the brand spec

Run linting before committing:
```sh
npm run lint
npm run lint:fix   # if issues found
```

### Step 11: Add Brand Themes (if needed)

If the brand needs theme variants (e.g. `bright`, `dark`):

- **Existing themes**: already scaffolded into `styles/{brand}/themes/{theme}/` and `blocks/{block}/{brand}/themes/{theme}/`
- **New themes**: run `npm run scaffold:create` → Theme, or see the **building-themes** skill

To configure a brand+theme token override, edit `styles/{brand}/themes/{theme}/_tokens.css`:

```css
/* styles/{brand}/themes/bright/_tokens.css */
:root {
  --background-color: #fffde7;
  --brand-surface: #fff9c4;
}
```

The theme is activated by adding `theme: bright` metadata to the page alongside `brand: {brand}`.

---

## Removing a Brand

```sh
npm run scaffold:remove
# Choose: Brand → enter brand name → confirm
```

This removes:
- `styles/{brand}/` and all sub-directories
- `blocks/{block}/{brand}/` for every block
- The brand entry from `brand-config.json`

**This is irreversible.** Ensure no live pages reference this brand before removing. Check with:
```sh
node .skills/content-driven-development/scripts/find-block-content.js header
# then inspect pages for brand metadata
```

---

## CSS Cascade Reference

When a page loads with `brand: {brand}`, styles apply in this order (each level overrides the previous):

```
styles/tokens.css                              ← global tokens
styles/styles.css                              ← global base styles
styles/fonts.css                               ← global fonts
styles/{brand}/tokens.css                      ← brand tokens
styles/{brand}/styles.css                      ← brand styles
styles/{brand}/fonts.css                       ← brand fonts

For each block on the page:
  blocks/{block}/{block}.css                   ← block base styles
  blocks/{block}/{brand}/{block}.css           ← brand block overrides

If a theme is also active (brand + theme):
  styles/{brand}/themes/{theme}/tokens.css     ← brand+theme tokens
  styles/{brand}/themes/{theme}/styles.css     ← brand+theme styles
  blocks/{block}/{brand}/themes/{theme}/{block}.css  ← brand+theme block overrides
```

---

## Runtime: How Brand CSS Is Loaded

`scripts/multi-theme.js` handles all routing automatically:

```js
// Reads brand from page metadata
const brand = getMetadata('brand');       // e.g. 'roy'
const theme = getMetadata('theme');       // e.g. 'bright'

// Block CSS path resolved as:
// blocks/{name}/{brand}/{theme}/{name}.css
// Falls back to base CSS if brand/theme folder does not exist
```

No JS changes are needed to activate a brand — metadata drives everything.

---

## Troubleshooting

| Problem | Fix |
|---|---|
| Brand CSS not loading | Check `brand` metadata on the page; confirm compiled `styles/{brand}/styles.css` exists |
| Token values not applying | Confirm you edited `_tokens.css`, ran `npm run scaffold:build`, and hard-refreshed |
| Block styles unchanged | Check the block's `_{block}.css` imports the base correctly; run `npm run scaffold:build` |
| Build fails | Run `npm run scaffold:build:log`; check `@import` paths in all `_*.css` files |
| Wrong import depth | Brand partials import `../` (one level up); brand+theme partials import `../../` |
| New block missing brand folder | Scaffold was run before the block existed; manually create `blocks/{block}/{brand}/_{block}.css` with `@import '../{block}.css';` and an empty `block-config.js` — or run `npm run scaffold:create` on the block again (it reads `brand-config.json`) |
| Fonts not loading | Verify font files are in `styles/{brand}/fonts/`; check network tab for 404s |

---

## Checklist

- [ ] `npm run scaffold:create` → Brand completed without errors
- [ ] `brand-config.json` updated with new brand name
- [ ] `styles/{brand}/_tokens.css` configured with brand colour, font, and spacing tokens
- [ ] `styles/{brand}/_fonts.css` has `@font-face` declarations (if custom fonts)
- [ ] Font files present in `styles/{brand}/fonts/` (if custom fonts)
- [ ] `styles/{brand}/_styles.css` has any necessary global overrides
- [ ] Block `_{block}.css` partials updated for all blocks with brand visual differences
- [ ] `npm run scaffold:build` run — no errors
- [ ] Dev server tested with `brand: {brand}` metadata on a page
- [ ] Brand tokens visible in DevTools `:root`
- [ ] Brand CSS files loading in Network tab
- [ ] `npm run lint` passes
