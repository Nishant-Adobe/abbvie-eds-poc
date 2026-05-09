# Tab Container Implementation Plan

## Files to Change

| # | File | Changes |
|---|------|---------|
| 1 | `component-definition.json` | Rename IDs + titles: `tabs-item` → `tab-item`, `tab-items` → `tab-panel` |
| 2 | `component-filters.json` | Update filter references: `tabs-item` → `tab-item`, `tab-items` → `tab-panel` |
| 3 | `component-models.json` | Rename model IDs, simplify `tab-item` fields, add `colSplit` to `tab-panel` |
| 4 | `blocks/tabs/_tabs.json` | Rename filter ref + add layout select to tabs model |
| 5 | `blocks/tabs/tabs.js` | Rewrite `decorateTabContainer` with name-based linking + metadata cleanup |
| 6 | `blocks/tabs/tabs.css` | Add split ratio classes + responsive collapse |

**Total: 6 files**

---

## Checklist

- [ ] `component-definition.json` — rename IDs and display titles
- [ ] `component-filters.json` — update filter component references
- [ ] `component-models.json` — rename model IDs, simplify tab-item, add colSplit to tab-panel
- [ ] `blocks/tabs/_tabs.json` — rename filter ref, add layout select
- [ ] `blocks/tabs/tabs.js` — name-based linking (case-insensitive), metadata cleanup, graceful failure
- [ ] `blocks/tabs/tabs.css` — split ratio classes, responsive collapse

---

*Implementation requires Execute mode.*
