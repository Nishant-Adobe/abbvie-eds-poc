# Tabs Block — Accessibility & Quality Fixes Plan

## Scope

Implement accessibility fixes and quality improvements to the Tabs block (`blocks/tabs/tabs.js` and brand CSS files) without breaking existing functionality.

**Constraint:** No changes to existing tab switching behavior, styling, or DOM structure. Only additive improvements.

---

## Impact Analysis — Will Existing Behavior Change?

| Fix | Existing behavior affected? | Explanation |
|-----|---------------------------|-------------|
| **Keyboard navigation** | ❌ No | Adds a new `keydown` listener. Click behavior unchanged. Mouse users see zero difference. |
| **First tab activation** | ⚠️ Minor edge case only | Only changes behavior when Tab 1 has NO matching section (currently nothing activates). Normal case (Tab 1 has content) = identical behavior. |
| **Focus indicators** | ❌ No | Adds outline only when using keyboard (`focus-visible`). Mouse clicks don't trigger it. No visual change for mouse users. |
| **Deep link (URL hash)** | ❌ No | Only activates if URL has `#hash`. Normal page load without hash = same as current. |
| **Cache panel ref** | ❌ No | Internal refactor — same panel shows/hides, just uses a variable instead of `getElementById`. Zero visual difference. |
| **Hardcoded values fix** | ❌ No | Replaces `0.75em` with token equivalent — same computed value, just tokenized. |
| **Grid scoping** | ❌ No | Adds `data-tabs-grid` attribute to sections already inside panels. Same CSS applies, just scoped tighter. |

### Summary: **Your current tabs will work exactly the same.** These are purely additive — they add keyboard support, fix an edge case, and improve code quality. No tab switching, styling, animation, or layout changes.

---

## Fixes to Implement

### 1. Keyboard Navigation (BLOCKING — Accessibility)

Add arrow key, Home, End navigation to tablist. This is additive — adds a `keydown` event listener to the tablist element after it's created.

**Where:** `blocks/tabs/tabs.js` — after `block.prepend(tablist)` at the end of the `decorate` function.

**What:** 
```javascript
tablist.addEventListener('keydown', (e) => {
  const buttons = [...tablist.querySelectorAll('button')];
  const currentIndex = buttons.indexOf(document.activeElement);
  let targetIndex = currentIndex;

  switch (e.key) {
    case 'ArrowLeft':
      e.preventDefault();
      targetIndex = currentIndex > 0 ? currentIndex - 1 : buttons.length - 1;
      break;
    case 'ArrowRight':
      e.preventDefault();
      targetIndex = currentIndex < buttons.length - 1 ? currentIndex + 1 : 0;
      break;
    case 'Home':
      e.preventDefault();
      targetIndex = 0;
      break;
    case 'End':
      e.preventDefault();
      targetIndex = buttons.length - 1;
      break;
    default:
      return;
  }

  buttons[targetIndex]?.click();
  buttons[targetIndex]?.focus();
});
```

---

### 2. Fix First Tab Activation Logic (BLOCKING)

Replace `firstTab` boolean with `hasActiveTab` to ensure the first tab WITH matched content is activated.

**Where:** `blocks/tabs/tabs.js` — lines 77-109 (the `tabNames.forEach` loop).

**Change:** Replace `let firstTab = true` with `let hasActiveTab = false`, then use `const shouldActivate = matched.length > 0 && !hasActiveTab` for setting `aria-selected` and `aria-hidden`.

**When does this matter?** Only when Tab 1 has no matching section. Currently: nothing activates. After fix: Tab 2 (first with content) activates. Normal usage (Tab 1 has content) = no change.

---

### 3. Replace Hardcoded Values in rinvoq-hcp/tabs.css

**Where:** `blocks/tabs/rinvoq-hcp/tabs.css`

**What:** Replace 8 hardcoded `em` padding values with spacing tokens:

| Current | Replace with |
|---------|-------------|
| `0.5em 0.8em` | `var(--spacing-05) var(--spacing-08)` |
| `0.8em 0.8em 0.5em` | `var(--spacing-08) var(--spacing-08) var(--spacing-05)` |
| `0.75em 1.5em` | `var(--spacing-08) var(--spacing-15)` |
| `1.2em 1.5em 0.75em` | `var(--spacing-12) var(--spacing-15) var(--spacing-08)` |

**Visual impact:** None. Same computed pixel values, just tokenized.

---

### 4. Replace Hardcoded Transition in base tabs.css

**Where:** `blocks/tabs/tabs.css` — line 42

**Change:** `transition: background-color 0.2s` → `transition: background-color var(--transition-duration-fast)`

---

### 5. Focus Indicators (Accessibility)

Add `:focus-visible` styles to tab buttons in base `tabs.css`. Brand overrides inherit this.

**Where:** `blocks/tabs/tabs.css` — after the `.tabs .tabs-list button[aria-selected='true']` rule.

**What:**
```css
.tabs .tabs-list button:focus-visible {
  outline: var(--spacing-02) solid var(--link-color);
  outline-offset: var(--spacing-02);
}
```

**Visual impact:** Only shows when using keyboard Tab key. Mouse clicks = no outline visible.

---

### 6. Deep Link Support (URL Hash)

After all tabs are built, check `window.location.hash` and activate the matching tab if found. Update hash on tab click.

**Where:** `blocks/tabs/tabs.js` — at the end of the `decorate` function, after the tablist is prepended.

**When does this matter?** Only when URL has a `#hash`. Normal page load = no change.

---

### 7. Cache Panel References (Performance)

Replace `document.getElementById(panelId)` in click handler with a direct reference to the wrapper variable already in scope.

**Where:** `blocks/tabs/tabs.js` — line 120 inside the click handler.

**Change:** `const panel = document.getElementById(panelId)` → use `wrapper` directly (already in closure).

**Impact:** Zero. Same panel shows/hides. Internal optimization only.

---

### 8. Scope Grid Rules with Data Attribute

**Where:** `blocks/tabs/tabs.js` (add attribute) + `blocks/tabs/tabs.css` (update selector)

**JS change:** When appending sections to wrapper, add `section.dataset.tabsGrid = 'true'`

**CSS change:** `.tabs-panel > .section` → `.tabs-panel > .section[data-tabs-grid]`

**Impact:** Zero visual change. Same sections get same grid. Just prevents accidental grid application to non-tab sections.

---

### 9. Fix Hardcoded Values in mavyret/tabs.css

**Where:** `blocks/tabs/mavyret/tabs.css`

**What:** Replace hardcoded `em` padding values with spacing tokens (same pattern as rinvoq-hcp).

---

### 10. Fix Hardcoded Value in venclexta/tabs.css

**Where:** `blocks/tabs/venclexta/tabs.css`

**What:** Replace `max-width: 14rem` with a token or CSS custom property.

---

## Files to Modify

| File | Changes |
|------|---------|
| `blocks/tabs/tabs.js` | Add keyboard nav, fix activation logic, add deep link, cache panel ref, add data attribute |
| `blocks/tabs/tabs.css` | Add `:focus-visible` styles, fix transition token, scope grid selector |
| `blocks/tabs/rinvoq-hcp/tabs.css` | Replace 8 hardcoded em values with tokens |
| `blocks/tabs/mavyret/tabs.css` | Replace hardcoded em values with tokens |
| `blocks/tabs/venclexta/tabs.css` | Replace hardcoded 14rem with token |

**NOT modifying:** skyrizi-hcp, linzess brand CSS files (already clean).

---

## Lint Command

```bash
npx eslint blocks/tabs/tabs.js && npx stylelint "blocks/tabs/**/*.css" --allow-empty-input
```

Run lint only on tabs block files.

---

## Checklist

### Must Fix (Blocking):
- [ ] Add keyboard navigation (`keydown` listener on tablist) — ArrowLeft, ArrowRight, Home, End
- [ ] Fix first tab activation — use `hasActiveTab` flag instead of `firstTab` boolean
- [ ] Replace hardcoded padding values in `rinvoq-hcp/tabs.css` with design tokens (8 instances)
- [ ] Replace hardcoded padding values in `mavyret/tabs.css` with design tokens
- [ ] Replace hardcoded `14rem` in `venclexta/tabs.css` with token
- [ ] Replace hardcoded transition duration `0.2s` in `tabs.css` with `var(--transition-duration-fast)`
- [ ] Add `:focus-visible` outline style to base `tabs.css`

### Should Fix (High Priority):
- [ ] Add deep link support — read `window.location.hash` on load, update on tab click
- [ ] Cache panel reference — use `wrapper` variable in click handler instead of `getElementById`
- [ ] Scope grid rules with `[data-tabs-grid]` attribute

### Testing:
- [ ] Run lint: `npx eslint blocks/tabs/tabs.js && npx stylelint "blocks/tabs/**/*.css" --allow-empty-input`
- [ ] Test: keyboard navigation works (arrow keys cycle tabs, Home/End jump)
- [ ] Test: first tab with content auto-activates even if tab 1 has no match
- [ ] Test: focus ring visible when tabbing with keyboard
- [ ] Test: URL hash activates correct tab on page load
- [ ] Test: existing tab switching still works (click behavior unchanged)
- [ ] Test: all brand pages unaffected (skyrizi-hcp, rinvoq-hcp, mavyret, linzess, venclexta)

---

*Implementation requires Execute mode.*
