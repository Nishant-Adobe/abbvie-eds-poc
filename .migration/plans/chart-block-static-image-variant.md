# Chart Block — Complete Implementation Plan (Dynamic + Static)

## Both Variants — As Per Requirements Doc

The chart block supports **5 variants** total. Two categories:

### Dynamic (SVG from data) — for simple/new charts
| Variant | CSS Class | What It Does |
|---------|-----------|-------------|
| `pie` | `.chart-pie` | JS generates SVG donut from authored segments |
| `bar` | `.chart-bar` | JS generates SVG bars from authored segments |
| `bar horizontal` | `.chart-bar .chart-horizontal` | JS generates horizontal SVG bars |
| `line` | `.chart-line` | JS generates SVG line from authored data points |

### Static (Image upload) — for migrating existing complex charts
| Variant | CSS Class | What It Does |
|---------|-----------|-------------|
| `static` | `.chart-static` | Renders responsive `<picture>` from uploaded chart images |

---

## Dynamic Variant (pie/bar/line) — Already Built

This is what we already have. Author enters segment data, JS renders inline SVG.

**How it works:**
1. Author selects "Bar Chart" or "Pie Chart"
2. Author adds Chart Data Point children (label, value, display value)
3. On preview/live: JS generates SVG from data

**Current status:** ✅ Working (pie + bar)

---

## Static Variant — Needs to Be Added

This is for Skyrizi/Rinvoq migration where charts are complex pre-rendered images.

**How it works:**
1. Author selects "Static (Image)"
2. Author uploads 3 chart images (desktop, tablet, mobile) + alt text
3. On preview/live: JS renders `<figure><picture>` with responsive `<source>` breakpoints

**Current status:** ❌ Not yet implemented

---

## What the Author Sees in UE (After Implementation)

### If they choose Bar/Pie (dynamic):
```
Chart Type: [Bar Chart ▼]
Chart Title: "87% PASI 90"
Accessible Data Table: ✓
→ Add Chart Data Points (label + value + display value)
```

### If they choose Static (image):
```
Chart Type: [Static (Image) ▼]
Chart Title: "PASI 90 at Week 52 (NRI)"
Chart Image (Desktop): [📎 Upload from DAM]
Chart Image (Tablet): [📎 Upload from DAM] (optional)
Chart Image (Mobile): [📎 Upload from DAM]
Chart Image Alt: "SKYRIZI demonstrated superior rates..."
Accessible Data Table: ✓
```

---

## Pages & Which Variant They Use

| Page | Charts | Variant to Use |
|------|--------|---------------|
| Skyrizi H2H vs Cosentyx | Complex area charts with dose markers, callouts | **static** (image upload) |
| Skyrizi PsA Efficacy | Complex area/line/donut charts | **static** (image upload) |
| Rinvoq H2H vs Dupixent | Interactive bars (simple) | **dynamic** (bar from data) OR static |
| Mavyret Efficacy | Bar + line charts | **static** (image upload) |
| Future new simple charts | Basic pie/bar comparisons | **dynamic** (pie/bar from data) |

---

## Files to Change

| # | File | What Changes |
|---|------|-------------|
| 1 | `component-models.json` | Add `"Static (Image)"` to chart type + add image fields |
| 2 | `blocks/chart/chart.js` | Add static variant handler (render `<picture>`) |
| 3 | `blocks/chart/chart.css` | Add `.chart-static` styles (responsive figure) |

---

## Checklist

- [ ] Add `"Static (Image)"` option to chart type select in `component-models.json`
- [ ] Add `chartImage`, `chartImageTablet`, `chartImageMobile`, `chartImageAlt` fields to chart model
- [ ] Update `chart.js` — add static variant: render `<figure><picture>` with responsive sources
- [ ] Keep existing dynamic pie/bar/line SVG logic unchanged
- [ ] Add `.chart-static` CSS (responsive image sizing)
- [ ] Push and verify: both variants work in UE
- [ ] Test dynamic: author enters data → SVG renders on preview
- [ ] Test static: author uploads images → responsive `<picture>` renders on preview
- [ ] Migrate Skyrizi pages using static variant

## Status

Both dynamic (already built) and static (needs to be added) are part of the same chart block. Only 3 files need changes to add the static variant. Implementation requires Execute mode.
