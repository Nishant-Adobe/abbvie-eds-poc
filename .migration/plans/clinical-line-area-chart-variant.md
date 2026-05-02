# Clinical Line/Area Chart Variant — Implementation Plan

## Status: COMPLETE — Ready for Execute Mode

This plan is fully researched and approved. All implementation details are specified below. Once Execute mode is active, implementation will proceed immediately through the checklist.

## Overview
Add a new `clinical-line-area` dynamic variant to the existing chart block that renders complex area/line charts via inline SVG with X/Y axes, multiple data series, callout bubbles, legend, and scroll-triggered animation — matching the Skyrizi PsA efficacy page charts.

## Architecture
- Token-based CSS via `--chart-cla-*` custom properties (no hardcoded colors)
- UE editor detection skips decoration (existing pattern in `chart.js`)
- Accessible hidden data table alongside SVG
- Brand partials remain import-only (tokens loaded globally via `head.html`)
- IntersectionObserver triggers line draw animation on scroll

## Implementation Details

### 1. Tokens — `styles/tokens.css` (after line 360)
```css
/* ---- Chart Clinical Line/Area (defaults) ---- */
--chart-cla-axis-color: #666;
--chart-cla-grid-color: #e0e0e0;
--chart-cla-axis-label-color: var(--text-color);
--chart-cla-series-0: #0057cc;
--chart-cla-series-1: #f60;
--chart-cla-series-2: #00a651;
--chart-cla-series-3: #9c27b0;
--chart-cla-area-opacity: 0.15;
--chart-cla-callout-bg: #fff;
--chart-cla-callout-border: var(--chart-cla-series-0);
--chart-cla-callout-text: var(--text-color);
--chart-cla-legend-text: var(--text-color);
--chart-cla-phase-border: #999;
--chart-cla-phase-text: var(--text-color);
```

### 2. Brand Overrides

**Skyrizi HCP** (`styles/skyrizi-hcp/tokens.css`):
```css
--chart-cla-series-0: #1ba2da;
--chart-cla-series-1: #005272;
--chart-cla-callout-border: #1ba2da;
```

**Rinvoq HCP** (`styles/rinvoq-hcp/tokens.css`):
```css
--chart-cla-series-0: #90124a;
--chart-cla-series-1: #ffd100;
--chart-cla-callout-border: #90124a;
```

**Mavyret** (`styles/mavyret/tokens.css`):
```css
--chart-cla-series-0: #e65400;
--chart-cla-series-1: #76bd22;
--chart-cla-callout-border: #e65400;
```

### 3. Component Model — Chart Type Option
Add to `component-models.json` line 8618 options array:
```json
{ "name": "Clinical Line/Area", "value": "clinical-line-area" }
```

### 4. Component Model — New Chart Fields
Add after `accessibleTable` field (line ~8686):
- `xAxisLabel` (text) — "CLINICAL LINE/AREA ONLY"
- `yAxisLabel` (text)
- `xAxisCategories` (text, comma-separated)
- `yAxisMax` (text, numeric)
- `yAxisStep` (text, numeric)
- `seriesLabels` (text, comma-separated)

### 5. Component Model — Extended Chart-Item Fields
Add after `valueLabel` field (line ~8723):
- `seriesIndex` (text, 0-based index)
- `calloutText` (text, optional)
- `phaseLabel` (text, optional)

### 6. Chart JS — `renderClinicalLineArea(block)`
- Parse config rows (xAxisLabel, yAxisLabel, xAxisCategories, yAxisMax, yAxisStep, seriesLabels)
- Parse data items, group by seriesIndex
- Generate SVG: viewBox `0 0 400 250`
- Draw grid lines, Y-axis labels, X-axis labels
- For each series: area path + line path + point circles
- Callout bubbles (foreignObject) at labeled points
- Phase divider lines
- Legend (HTML div below SVG)
- IntersectionObserver for `.chart-cla-animated` class toggle
- Hidden accessible `<table>`

### 7. Chart CSS — `.chart.clinical-line-area`
- Container, SVG responsive sizing
- Grid/axis styles using `--chart-cla-*` tokens
- Series stroke colors, area fills with opacity token
- Callout bubble styling
- Legend flexbox layout
- `stroke-dasharray`/`stroke-dashoffset` animation
- `@keyframes chart-cla-draw` for line reveal

## Checklist

- [ ] Add `--chart-cla-*` tokens to `styles/tokens.css`
- [ ] Add Skyrizi brand overrides to `styles/skyrizi-hcp/tokens.css`
- [ ] Add Rinvoq brand overrides to `styles/rinvoq-hcp/tokens.css`
- [ ] Add Mavyret brand overrides to `styles/mavyret/tokens.css`
- [ ] Add "Clinical Line/Area" option to chart type select in `component-models.json`
- [ ] Add clinical-line-area fields (xAxisLabel, yAxisLabel, xAxisCategories, yAxisMax, yAxisStep, seriesLabels) to chart model
- [ ] Add seriesIndex, calloutText, phaseLabel fields to chart-item model
- [ ] Implement `renderClinicalLineArea()` in `blocks/chart/chart.js`
- [ ] Wire up variant detection in `decorate()` function
- [ ] Add `.chart.clinical-line-area` CSS styles to `blocks/chart/chart.css`
- [ ] Verify rendering on local preview
