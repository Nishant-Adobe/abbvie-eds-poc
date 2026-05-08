# Tab Container Implementation Plan

## Understanding

The Tab Container is a **section-level** component with this structure:

```
Tab Container (section, data-identifier="Tab Container")
│
├── Tabs block (direct child)  ← contains Tab items that define button labels
│   ├── Tab (title="Overview")   ← becomes button 1
│   └── Tab (title="Features")   ← becomes button 2
│
├── Tab Items section (tabName="Overview")  ← panel, linked to Tab1
│   └── [any blocks: hero, cards, etc.]
│
└── Tab Items section (tabName="Features")  ← panel, linked to Tab2
    └── [any blocks: hero, cards, etc.]
```

### How it works:
- **Tab Container** = parent section wrapping everything
- **Tabs block** = direct child defining tab buttons from its Tab items
- **Tab Items sections** = content panels, each with a `tabName` that matches a tab title
- The Tabs block detects it's inside a Tab Container, reads tab titles from its items, and links them to sibling sections by matching `tabName`

### What authors see in the "+" modal:

**Inside Tab Container:**
| Component | Purpose |
|-----------|---------|
| Tabs (block) | The tab controls — add Tab items inside to define buttons |
| Tab Items (section) | A content panel — set Tab Name to link to a tab button |

**Inside Grid Container:**
| Component | Purpose |
|-----------|---------|
| Tabs (block) | Simple standalone tabs (normal mode) |
| Tab Items (section) | A content panel section |

### Linking mechanism:
- Each Tab item inside the Tabs block has a `tabTitle` field (e.g., "Overview")
- Each Tab Items section has a `tabName` field (e.g., "Overview")
- The Tabs block matches `tabTitle` → `tabName` to wire click → show/hide

### Current state:
- UE component model ✅ (tab-container, tab-items, tabs block all defined)
- Tab Container filter ❌ (only allows `tab-items`, needs `tabs` added too)
- Grid Container filter ❌ (currently empty — needs `tabs` and `tab-items` added)
- Runtime JS ❌ (tabs.js needs modification to detect Tab Container context)
- Runtime CSS ❌ (tab container panel show/hide styles needed)

---

## Architecture

The Tabs block (`blocks/tabs/tabs.js`) already generates tab controls. It needs a **mode switch**:

1. **Normal mode** (existing): Tabs block has tab items as children, each with content fields. Panels are block rows.
2. **Tab Container mode** (new): Tabs block is inside a Tab Container. It generates buttons from its tab items but links them to **sibling Tab Items sections** instead of block rows. Only `tabTitle` is used for button labels.

Detection: `block.closest('[data-identifier="Tab Container"]')` → if found, use container mode.

---

## Rendered HTML (expected output)

```html
<!-- Tab Container section -->
<div class="section tab-container" data-identifier="Tab Container">

  <!-- Tabs block (direct child — generates the tablist) -->
  <div class="tabs-wrapper">
    <div class="tabs block" data-block-status="loaded">
      <div class="tabs-list" role="tablist">
        <button class="tabs-tab" aria-selected="true" role="tab">Overview</button>
        <button class="tabs-tab" aria-selected="false" role="tab">Features</button>
      </div>
    </div>
  </div>

  <!-- Panel 1 (visible) -->
  <div class="section tab-panel" data-identifier="Tab Items" data-tab-name="Overview">
    <!-- any blocks authored here -->
  </div>

  <!-- Panel 2 (hidden) -->
  <div class="section tab-panel" data-identifier="Tab Items" data-tab-name="Features" style="display:none">
    <!-- any blocks authored here -->
  </div>

</div>
```

---

## Filter Changes

### `tab-container` filter (what "+" shows inside Tab Container):
```json
{
  "id": "tab-container",
  "components": ["tabs", "tab-items"]
}
```

### `grid-container` filter (what "+" shows inside Grid Container):
```json
{
  "id": "grid-container",
  "components": ["tabs", "tab-items"]
}
```

---

## Files to Modify

| File | Action | Purpose |
|------|--------|---------|
| `blocks/tabs/tabs.js` | Modify | Add Tab Container mode: detect parent, generate buttons, wire to sibling sections |
| `blocks/tabs/tabs.css` | Modify | Add styles for tab-container context (panel visibility) |
| `component-filters.json` | Modify | Update `tab-container` and `grid-container` filters to allow `tabs` + `tab-items` |

---

## Checklist

- [ ] Update `component-filters.json`
  - `tab-container`: change `["tab-items"]` → `["tabs", "tab-items"]`
  - `grid-container`: change `[]` → `["tabs", "tab-items"]`
- [ ] Modify `blocks/tabs/tabs.js` to add Tab Container mode
  - Detect if block is inside `[data-identifier="Tab Container"]`
  - If yes: extract `tabTitle` from each tab item (for button labels)
  - Generate tab buttons (same `.tabs-list` markup as current)
  - Find sibling sections in the Tab Container with `data-tab-name`
  - Match each button to a section by `tabTitle` ↔ `data-tab-name`
  - On click: hide all panel sections, show matched one
  - Show first panel by default, hide others
  - Remove the tab item rows from DOM (they're only used for button data)
  - Add ARIA attributes (`aria-controls`, `aria-selected`, `role`)
- [ ] Add CSS for Tab Container panel visibility in `blocks/tabs/tabs.css`
  - Panel sections hidden by default
  - Active panel visible
- [ ] Revert the incorrect `tabs-item` filter change from earlier session
- [ ] Create test content page to verify behavior
- [ ] Test tab switching, ARIA states, and nested blocks rendering

---

## Authoring Flow

1. Add **Tab Container** at page level
2. Click "+" inside Tab Container → select **Tabs** (adds the block)
3. Add **Tab** items to the Tabs block — set each Tab Title (e.g., "Overview", "Features")
4. Click "+" inside Tab Container → select **Tab Items** (adds a section panel)
5. Set the section's **Tab Name** = "Overview" (must match a Tab Title exactly)
6. Add any blocks inside that panel section
7. Repeat steps 4-6 for more panels
8. Preview: Tabs block generates buttons, clicking switches between panel sections

---

*Ready for implementation — switch to Execute mode to proceed.*
