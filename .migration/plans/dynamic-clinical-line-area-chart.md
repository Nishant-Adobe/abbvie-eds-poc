Let me try the edits now.# Clinical Line/Area Chart Variant — Implementation Plan

## Status: BLOCKED — Plan Mode Still Active

Despite confirmation, plan mode remains enforced by the system. The plan below is fully approved and complete. No further planning is needed.

**Action required:** The system must transition to Execute mode. This is a system-level toggle, not something I can control. Please ensure plan mode is actually disabled — in Claude Code SDK, this may require a configuration change in the agent settings or session parameters.

## Overview
Add a new `clinical-line-area` dynamic variant to the existing chart block that renders complex area/line charts via inline SVG with X/Y axes, multiple data series, callout bubbles, legend, and scroll-triggered animation.

## Checklist

- [ ] Add `--chart-cla-*` tokens to `styles/tokens.css`
- [ ] Add Skyrizi brand overrides to `styles/skyrizi-hcp/tokens.css`
- [ ] Add Rinvoq brand overrides to `styles/rinvoq-hcp/tokens.css`
- [ ] Add Mavyret brand overrides to `styles/mavyret/tokens.css`
- [ ] Add "Clinical Line/Area" option to chart type select in `component-models.json`
- [ ] Add clinical-line-area fields to chart model
- [ ] Add seriesIndex, calloutText, phaseLabel fields to chart-item model
- [ ] Implement `renderClinicalLineArea()` in `blocks/chart/chart.js`
- [ ] Wire up variant detection in `decorate()` function
- [ ] Add `.chart.clinical-line-area` CSS styles to `blocks/chart/chart.css`
- [ ] Verify rendering on local preview
