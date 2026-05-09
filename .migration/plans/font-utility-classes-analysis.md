# Tab Panel Text & Layout Containment Plan

## Two Issues to Fix

### Issue 1: Text Styling
Apply proper fonts, colors, and sizing to text-container content inside tab panels.

### Issue 2: Content Containment
On the original site, content stays within a contained max-width with padding — it never touches the viewport edges. On our implementation, when zoomed out or on wide screens, content bleeds to the edges.

**Root cause:** The original site wraps the tab panel content in a container with `max-width` and horizontal padding. Our `.tabs-panel` has no max-width constraint — sections inside use `.abbvie-container` margins but when wrapped in `.tabs-panel`, those margins are overridden.

---

## Solution

### Text Styling (tokens + CSS)

Add to `styles/skyrizi-hcp/tokens.css`:
```css
--color-tabs-text: #191c1d;
--font-family-tabs-text: 'Univers LT W01_67 Bold_1476016', 'Arial Narrow', sans-serif;
```

Add to `blocks/tabs/skyrizi-hcp/tabs.css`:
```css
.tabs-panel .text-container-text {
  color: var(--color-tabs-text);
  font-family: var(--font-family-tabs-text);
}

.tabs-panel .text-container-text p {
  font-size: var(--font-size-16);
  margin: 0 0 var(--spacing-10);
}

.tabs-panel .text-container-text h5 {
  font-size: var(--font-size-26);
  font-family: var(--font-family-tabs-text);
  font-weight: var(--font-weight-heading);
  margin: 0 0 var(--spacing-10);
}
```

### Content Containment

Add `max-width` and centered padding to `.tabs-panel` so content stays contained like the original site:

```css
.tabs-panel {
  max-width: var(--content-max-width);
  margin-left: auto;
  margin-right: auto;
  padding-left: var(--spacing-20);
  padding-right: var(--spacing-20);
}
```

On tablet+:
```css
@media (width >= 600px) {
  .tabs-panel {
    padding-left: var(--spacing-55);
    padding-right: var(--spacing-55);
  }
}
```

This matches how `.abbvie-container` constrains content with side margins that increase at breakpoints.

---

## Checklist

- [ ] Add `--color-tabs-text` and `--font-family-tabs-text` tokens to `styles/skyrizi-hcp/tokens.css`
- [ ] Add `.tabs-panel .text-container-text` styles (color, font-family)
- [ ] Add `.tabs-panel .text-container-text p` styles (font-size: 16px, margin)
- [ ] Add `.tabs-panel .text-container-text h5` styles (font-size: 26px, bold, margin: 0)
- [ ] Add `max-width` and horizontal padding to `.tabs-panel` for content containment
- [ ] Add responsive padding that increases on tablet/desktop
- [ ] Verify content stays within bounds at all zoom levels
- [ ] Verify text styles in both UE and preview

---

*Implementation requires Execute mode.*
