I'll read the current food-swaps authoring and CSS so the critique and plan are precise.The current EDS block doesn't pixel-match the live design — let me confirm one approach decision before finalizing the plan.# Food Swaps Block — Pixel-Match to Live Plan

## Critique: current EDS block vs. live site

The current `food-swaps` columns block is **text-only** and diverges substantially from the live design. Side-by-side gaps:

| Aspect | Live site | Current EDS migration |
|---|---|---|
| **Card structure** | Each food item = a white rounded **card** containing a circular food **illustration** + label below | Plain `<p>` text lines, no images, no cards |
| **Food images** | 10 illustrated PNGs in white circles (yogurt, kiwi, syrup, popcorn, rice bowl / milk, apple, honey, chips, white bread) | None — images entirely missing |
| **Callout badges** | Colored circular badges with white text baked into artwork: **teal** on left ("Try These") column, **dark-purple** on right ("When Craving These") column, positioned top-left/top-right of the food circle | Rendered as small gold italic `<em>` text lines below the label — wrong color, wrong placement, no badge |
| **Column panels** | Each column is a **light-purple (pastel) rounded panel** with its own dark-purple header bar at top | Single shared purple section background; headers are plain white text, no header bar/panel |
| **Header bar** | "Try These:" / "When Craving These:" sit in a **dark-purple rounded bar** spanning the panel width, white centered Bebas-style text | White `<h3>`, no bar/background |
| **Label text color** | Dark-purple bold labels under each image | White text (`--color-text-on-dark`) |
| **Item rhythm** | 5 cards per column, vertically centered, even gaps; columns are independent panels side-by-side | 2-column grid of text, row-aligned |
| **Section bg** | Page is white/light; the purple lives only inside the two column panels | Whole section is solid dark-purple `rgb(66,46,131)` |

**Root issue:** the section was authored as a dark-purple band with white text, but the live design is a **light page** with two **pastel-purple card-panels**, each containing **image cards with baked-in colored callout badges** and **dark-purple labels**. Almost every visual property is off.

## Decision (confirmed)
Use the **live PNGs as-is** — including the `-callout@2x.png` variants that already have the colored bubble + text baked into the image. This is the pixel-perfect, lowest-CSS path. Callout wording is preserved in `alt` text for accessibility.

## Live image inventory (from selected HTML)

**Left column — "Try These:"** (teal callouts)
1. `4.2.2-d/m-...-yogurt-callout@2x.png` → "Almond milk, yogurt, brie, or camembert" (callout: *Yogurt contains good bacteria your gut loves.*)
2. `...-kiwi-callout@2x.png` → "Bananas, berries, citrus fruits, or kiwi" (callout: *Kiwi acts as a natural laxative.*)
3. `...-maple-syrup@2x.png` → "Treats made with molasses or maple syrup" (no callout)
4. `...-popcorn@2x.png` → "Baked chips, rice cakes, or popcorn" (no callout)
5. `...-rice_bowl_callout@2x.png` → "Whole-grain bread, oats, brown rice, or quinoa" (callout: *Brown rice provides 4 grams of fiber per cup.*)

**Right column — "When Craving These:"** (dark-purple callouts)
1. `...-milk@2x.png` → "Milk, cream cheese, or sour cream" (no callout)
2. `...-apple@2x.png` → "Apples, pears, watermelon, or dried fruit" (no callout)
3. `...-honey-callout@2x.png` → "Treats made with honey or artificial sweeteners that end in '-ol'" (callout: *Honey is high in fructose, which can cause flare-ups.*)
4. `...-chips-callout@2x.png` → "Potato chips or fried foods" (callout: *Fatty foods slow digestion and can bring on the bloat.*)
5. `...-white-bread@2x.png` → "Pasta, crackers, white rice and white wheat, or rye bread" (no callout)

Note the two source folders on live: some under `/content/dam/linzess/images/starting-linzess/` (callout variants) and some under `/content/dam/linzess/images/` (plain). All download into the project DAM (`/content/dam/abbvie-eds-poc/linzess/images/`, host-relative), consistent with the project image-hosting rule. Mobile uses the `-m-` variant where one exists; otherwise the `-d-` variant.

## Re-authoring approach

Convert each food item from a text `<p>` into an **image + label** pair so the generic columns decoration emits `.columns-item-image` + `.columns-item-content`. Each column becomes a list of image-cards under a header. The callout badges are already in the PNGs, so no CSS overlay needed.

- **Header:** keep `<h3>` ("Try These:" / "When Craving These:") — restyle into the dark-purple header bar.
- **Each item:** `<picture>`/`<img>` (download local) + `<p>` label. Drop the `<em>` callout text lines (now baked into images); preserve their wording as part of the image `alt`.
- **Panels:** style each `.columns-item` group... reconsider — live has **two panels, each containing 5 cards**, not 10 sibling items. The cleanest authoring that matches: two columns (left/right), each column = header + 5 image-cards. The existing `columnsBlock(document, 'food-swaps', [[leftNodes],[rightNodes]])` 2-cell shape already produces exactly this (2 `.columns-item` panels). Keep that shape; just swap text nodes for image+label nodes.

## CSS changes (scoped to `.food-swaps-section`)

- **Section bg:** change from solid dark-purple to the **light page bg** (live shows white/page default) — remove the inherited `what-is-linzess-section` purple for this variant.
- **Each `.columns-item`:** light-purple pastel panel (`--color-brand-primary-lighter`), rounded corners, padding.
- **`h3` header:** dark-purple rounded **bar** — full-panel-width background `--color-brand-primary` (or the exact dark-purple `#422e83`), white centered text, top of panel.
- **Image cards:** white circular background behind each food illustration, centered; cap image width to live size; even vertical gaps between cards.
- **Labels (`p`):** dark-purple bold, centered, ~14–16px.
- **Remove** the gold `<em>` callout styling (no longer used).
- **Mobile:** stack the two panels; verify the `-m-` images load.
- Re-verify exact colors/spacing against the live screenshot via preview `getComputedStyle`.

## Validation
- Re-bundle importer, re-run bulk import, confirm 200 + images load (naturalWidth>0).
- Visual check desktop + mobile vs. live screenshot (panels, header bars, circular images, callout badges, dark-purple labels).
- md2jcr (xwalk) well-formed; section `customClass` round-trips.
- Regression-check sibling wellness-tips pages unaffected (scoping unchanged).
- Hold for explicit approval before commit/push.

## Checklist
- [ ] Download all 10 live food PNGs (desktop + mobile variants where present) into project DAM `/content/dam/abbvie-eds-poc/linzess/images/`, verifying each URL resolves on live
- [ ] Re-author the `food-swaps` block in `import-wellness-tips.js`: replace text-only items with `<img>` + `<p>` label per card; preserve callout wording in `alt`; drop `<em>` lines
- [ ] Keep the two-panel `columnsBlock(document, 'food-swaps', [left, right])` shape (header + 5 image-cards per column)
- [ ] Rewrite scoped CSS: light section bg, pastel-purple rounded panels, dark-purple header bar, white circular image backgrounds, dark-purple centered labels; cap image size to live
- [ ] Remove the obsolete gold `<em>` callout CSS rules
- [ ] Add/adjust mobile rules (<768px): stack panels, confirm `-m-` images
- [ ] Re-bundle importer (esbuild IIFE) and re-run bulk import for the food-swaps URL
- [ ] Verify in preview: images load, panels/header bars/labels/badges match live across desktop + mobile (snapshot + getComputedStyle)
- [ ] Run ESLint + md2jcr (confirm well-formed XML, `customClass` round-trips), CSS scoping unchanged
- [ ] Regression-check sibling wellness-tips pages render unchanged
- [ ] Report results and hold for explicit approval before any commit/push

_Execution requires Execute mode — this plan only describes the changes; no files have been modified._
