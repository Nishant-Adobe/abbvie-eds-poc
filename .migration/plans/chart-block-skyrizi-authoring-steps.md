# Chart Block — Fix: Cannot Add Child Items

## Problem

The Chart block shows properties correctly (Chart Type, Title, Center Label, Accessible Table) but:
- Cannot expand Chart in content tree (no arrow/children)
- The **+** button inside Chart doesn't add "Chart Data Point" children
- The block doesn't accept child components

## Root Cause

Looking at the `component-definition.json` template for Chart:

```json
{
  "title": "Chart",
  "id": "chart",
  "plugins": {
    "xwalk": {
      "page": {
        "resourceType": "core/franklin/components/block/v1/block",
        "template": {
          "name": "Chart",
          "model": "chart",
          "filter": "chart",
          "blockId": "id:"
        }
      }
    }
  }
}
```

The template has `"filter": "chart"` which references `component-filters.json` entry `"id": "chart"` → allows `"chart-item"`. This **should** work.

However, the issue is that UE needs a **default child item in the template** to make the block expandable. Without at least one pre-populated child, UE treats the block as a leaf node (no expand arrow, no + button inside).

## Fix Required

Add a default `chart-item` child in the `component-definition.json` template so UE knows this block accepts children:

```json
{
  "template": {
    "name": "Chart",
    "model": "chart",
    "filter": "chart",
    "blockId": "id:",
    "chart_item_1": {
      "name": "Chart Data Point",
      "model": "chart-item",
      "label": "Category",
      "value": "0",
      "valueLabel": ""
    }
  }
}
```

This is the same pattern used by `accordion` (has default `accordion-item`), `brand-explorer` (has default `brand-explorer-item`), and `tabs` (has default `tabs-item`).

## Checklist

- [ ] Update `component-definition.json` — add default `chart-item` child in chart template
- [ ] Push changes
- [ ] Verify in UE: Chart block is expandable in content tree
- [ ] Verify in UE: can add more Chart Data Point children via + button

## Status

Need to add default child item to chart template in `component-definition.json`. Implementation requires Execute mode.
