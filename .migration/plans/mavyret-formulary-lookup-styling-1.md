# Mavyret Formulary Lookup — Pixel-Perfect Styling Fix

## Critical Issues Found

### 1. Brand Mismatch: `mavyret` vs `botox`
The metadata.json (image 2) maps `/formulary-lookup-mavyret` to brand **`mavyret`**, but CSS files exist only under `styles/botox/`. The `getBrandPath()` function looks for `styles/mavyret/blocks/formulary-lookup/` which doesn't exist, so **no brand CSS loads** — only base styles render.

**Fix:** Create `styles/mavyret/` directory with formulary-lookup CSS, or add `mavyret` as an alias in the brand resolution logic.

### 2. Submit Button Style Wrong
The green button was based on an incorrect earlier reference. The actual mavyret.com source (images 3-4) shows:
- **Transparent/white background** with **dark border** (`2px solid black`)
- Dark text color
- `>` arrow on the right
- Centered below the select dropdown

### 3. Select Dropdown Styling
Source (image 3) shows:
- ~400px wide select with dark border (`2px solid black`)
- Custom dropdown arrow
- Left-aligned "Select State" label
- `Select state` placeholder text

### 4. Layout
Source shows stacked vertical layout — heading, label, select, button — all centered. Current CSS already does this but brand CSS isn't loading.

## Files to Change

### 1. Create `styles/mavyret/blocks/formulary-lookup/formulary-lookup.css`
New file with Mavyret brand overrides matching the source site exactly.

### 2. Create `blocks/formulary-lookup/mavyret/` directory and files
- `formulary-lookup.css` — brand override with `@import` from base
- `block-config.js` — Mavyret-specific flags

### 3. Update `brand-config.json`
Add `mavyret` to the brands list so the build pipeline processes it.

### 4. Keep `botox` files as-is
Don't modify existing botox brand files in case other pages use them.

## Source Site Style Values (from mavyret.com screenshots)

| Property | Value |
|---|---|
| Heading font-size | ~28px |
| Heading font-weight | 400 (normal), bold only on "Formulary Lookup Tool" |
| Heading color | black |
| Label font-size | 16px |
| Label font-weight | 600 (bold) |
| Label alignment | Left-aligned |
| Select width | ~400px |
| Select height | ~50px |
| Select border | 2px solid black |
| Select border-radius | 2px |
| Select font-size | 16px |
| Submit bg | transparent/white |
| Submit border | 2px solid black |
| Submit color | black |
| Submit font-size | 16px |
| Submit font-weight | 400 |
| Submit `>` arrow | `\203A` character, right-aligned |
| Submit width | ~400px (matches select) |
| Form max-width | ~500px centered |
| Text align | center |

## Checklist

### Brand Setup
- [ ] **1.1** Add `mavyret` to `brand-config.json` brands array
- [ ] **1.2** Create directory `styles/mavyret/blocks/formulary-lookup/`
- [ ] **1.3** Create `styles/mavyret/blocks/formulary-lookup/formulary-lookup.css` with Mavyret overrides
- [ ] **1.4** Create directory `blocks/formulary-lookup/mavyret/`
- [ ] **1.5** Create `blocks/formulary-lookup/mavyret/formulary-lookup.css` (sync copy)
- [ ] **1.6** Create `blocks/formulary-lookup/mavyret/block-config.js`

### CSS — Mavyret Brand Override
- [ ] **2.1** Set submit button to transparent bg with `2px solid black` border (not green)
- [ ] **2.2** Set select to `2px solid black` border, ~400px width, 50px height
- [ ] **2.3** Set heading to ~28px, normal weight, black color
- [ ] **2.4** Set form stacked column layout, max-width 500px
- [ ] **2.5** Set label left-aligned, 16px bold
- [ ] **2.6** Set submit `>` arrow via `::after`

### Verification
- [ ] **3.1** Preview locally with `brand: mavyret` metadata
- [ ] **3.2** Compare against source screenshots pixel-by-pixel
- [ ] **3.3** Commit and provide files for GitHub update

---

## Notes
- The `botox` brand files should remain unchanged — they may be used by other pages.
- The `mavyret` brand is a new addition to the project's brand system.
- The disclaimer on the source site is shown in a **modal overlay** (image 4) — this is outside the formulary block scope. Our block renders it inline, which is acceptable.
- **Execution requires switching to Execute mode.**
