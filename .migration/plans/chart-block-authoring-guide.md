# Chart Block — Make It Fully Authorable

## Current Problem

The chart model (`component-models.json` line 8606) only has:
- `classes_type` (select: Bar/Pie)
- Common properties reference

Missing fields that authors need:
- **Title** — chart heading text
- **Center Label** — for pie chart center text
- **Accessible Table** — boolean toggle

The `chart-item` child component exists and has `label`, `value`, `valueLabel` — but authors need to be able to **add chart-item children** inside the chart block in UE (this should work since `component-filters.json` already allows `chart-item` inside `chart`).

## What Needs to Change

**`component-models.json`** — Add missing fields to chart model:

```json
{
  "id": "chart",
  "fields": [
    { "component": "tab", "label": "Overview", "name": "overview" },
    { "component": "select", "name": "classes_type", "label": "Chart Type", ... },
    { "component": "text", "name": "title", "label": "Chart Title", "value": "", "description": "Heading displayed above the chart" },
    { "component": "text", "name": "centerLabel", "label": "Center Label", "value": "", "description": "Text shown in donut center (pie variant only)" },
    { "component": "boolean", "name": "accessibleTable", "label": "Accessible Data Table", "description": "Render hidden table for screen readers" },
    { "...": "../../models/_common-properties.json#/common-prop" }
  ]
}
```

## How Author Will Use It After Fix

1. Add Chart block to section ✅ (already works)
2. Select Chart Type (Bar/Pie) ✅ (already works)
3. Fill **Title** field (new)
4. Fill **Center Label** if pie (new)
5. Toggle **Accessible Table** (new)
6. Click **+** inside Chart in content tree to add **Chart Data Point** items
7. Each data point: fill Label, Value, Display Value

## Checklist

- [ ] Add `title`, `centerLabel`, `accessibleTable` fields to chart model in `component-models.json`
- [ ] Push changes
- [ ] Verify in UE: new fields appear in properties panel
- [ ] Verify in UE: can add Chart Data Point children via content tree

## Status

Need to add authoring fields to `component-models.json`. Implementation requires Execute mode.
