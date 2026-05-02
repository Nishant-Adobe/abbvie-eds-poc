# Clinical Line/Area Chart — Fix `_chart.json` Model

## Problem

The Universal Editor reads **`blocks/chart/_chart.json`** (the local block model), which only has "Bar" and "Pie" chart types. It's missing:
- "Clinical Line/Area" and "Static (Image)" type options
- All clinical-line-area config fields (xAxisLabel, yAxisLabel, xAxisCategories, yAxisMax, yAxisStep, seriesLabels)
- Extended chart-item fields (seriesIndex, calloutText, phaseLabel)

**Result:** You authored correctly in the content tree (I can see the fields), but UE applied the wrong type class (`pie` instead of `clinical-line-area`), so the chart renders as a black pie chart.

## Fix

Update `blocks/chart/_chart.json` to match the full model in `component-models.json`, including all 4 chart type options and all clinical-line-area fields.

## Checklist

- [x] Add `--chart-cla-*` tokens to `styles/tokens.css`
- [x] Add Skyrizi brand overrides to `styles/skyrizi-hcp/tokens.css`
- [x] Add Rinvoq brand overrides to `styles/rinvoq-hcp/tokens.css`
- [x] Add Mavyret brand overrides to `styles/mavyret/tokens.css`
- [x] Add "Clinical Line/Area" option to chart type select in `component-models.json`
- [x] Add clinical-line-area fields to chart model
- [x] Add seriesIndex, calloutText, phaseLabel fields to chart-item model
- [x] Implement `renderClinicalLineArea()` in `blocks/chart/chart.js`
- [x] Wire up variant detection in `decorate()` function
- [x] Add `.chart.clinical-line-area` CSS styles to `blocks/chart/chart.css`
- [x] Verify rendering on local preview
- [ ] **Fix `blocks/chart/_chart.json`** — add Clinical Line/Area option + all new fields

---

**Requires Execute mode to fix.** Please switch from Plan to Execute mode.
