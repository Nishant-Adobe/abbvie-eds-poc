# Escalation: Base `tabs.js` fails to match panel sections (tab-name) → panels don't gate

**Severity:** High (functional) · **Scope:** base block `blocks/tabs/tabs.js` — affects ALL brands/pages using the tabs + per-section `tab-name` pattern
**Status:** Escalated — NOT patched (base-block JS change requires owning-team review)
**Found on:** `linzess/dinesh-linzess/find-relief` (migrated) AND the deployed known-good `linzess/find-relief` (`develop--abbvie-eds-poc--nishant-adobe.aem.live`) — both exhibit it, so this is a pre-existing base defect, not migration-specific.

---

## Symptom

On `find-relief`, the "Instructions For Adults & Children" dosing tabs do **not** gate:
- Local dev: both tab panels (Adults / Pediatric) render simultaneously; both tab buttons show `aria-selected="false"`; no panel is hidden.
- Deployed (`*.aem.live`): worse — console throws
  `failed to load module for tabs NotFoundError: Failed to execute 'insertBefore' on 'Node'`,
  the tab buttons disappear entirely, and the panels collapse into a single merged region.

Expected (live linzess.com): one panel visible at a time, switched by the two tab buttons.

---

## Root cause

The tabs block matches sibling sections to tab labels via `getSectionIdentifier(section)`
(`blocks/tabs/tabs.js`, lines 14–33). For section-metadata it does:

```js
const meta = section.querySelector('.section-metadata');   // line 18
```

But by the time `tabs.js` runs, **`decorateSections()` in `scripts/aem.js` has already consumed and REMOVED the `.section-metadata` div**:

- `scripts/aem.js` `applySectionMeta()` (line ~518) does
  `section.dataset[toCamelCase(key)] = value` → the `tab-name` row becomes
  **`section.dataset.tabName`**, and then
- `decorateSections()` calls `sectionMeta.parentNode.remove()` — the
  `.section-metadata` element no longer exists in the DOM.

So `section.querySelector('.section-metadata')` returns `null`,
`getSectionIdentifier()` falls through to `return ''`, **no section matches any
tab name**, `tabPanelMap` is empty, and every tab gets `matched.length === 0`:

- No `shouldActivate` ever becomes true → no panel hidden → both panels show.
- `main.insertBefore(wrapper, insertBefore)` / section re-parenting then operates
  on stale/!-present references in the multi-section case → `insertBefore`
  `NotFoundError` on the deployed page.

`getSectionIdentifier` already reads `section.id` and `section.dataset.aueLabel`,
but **not** the `section.dataset.tabName` (nor `dataset.name`) that
`decorateSections` actually produces. That's the gap.

---

## Proposed patch (base `blocks/tabs/tabs.js`)

Make `getSectionIdentifier` read the dataset keys that `decorateSections` writes,
**before** falling back to the (already-removed) `.section-metadata` query. This is
backward-compatible: pages where the metadata div still exists are unaffected.

```js
function getSectionIdentifier(section) {
  if (section.id) return section.id;
  if (section.dataset.aueLabel) return section.dataset.aueLabel;

  // decorateSections() (scripts/aem.js) consumes the `tab-name` section-metadata
  // row into a dataset property and REMOVES the .section-metadata element, so
  // prefer the dataset value. toCamelCase('tab-name') === 'tabName'.
  if (section.dataset.tabName) return section.dataset.tabName;
  if (section.dataset.name) return section.dataset.name;

  // Fallback: metadata div still present (e.g. UE author view, pre-decoration).
  const meta = section.querySelector('.section-metadata');
  if (meta) {
    const match = [...meta.children].find((row) => {
      const firstChild = row.firstElementChild;
      if (!firstChild) return false;
      const key = normalize(firstChild.textContent);
      return key === 'tabname' || key === 'tab-name' || key === 'name';
    });
    if (match) {
      const cells = [...match.children];
      return cells[1]?.textContent?.trim() || '';
    }
  }

  return '';
}
```

### Secondary hardening (optional, recommended)
Guard the panel re-parenting so a future matching miss can't throw:

```js
if (matched.length > 0 && matched[0].parentNode === main) {
  main.insertBefore(wrapper, matched[0]);
  ...
}
```

---

## Why this is escalated, not patched here

Per project rules (`aemcoder-section-fix-loop` taxonomy #9 + scope ladder), base
block JS changes affect **all 9 brands** and every page using `tabs`, so they go
through the owning team / a dedicated PR with cross-brand QA — not migration scope.

## Verification steps for the fix
1. Apply the `getSectionIdentifier` change to `blocks/tabs/tabs.js`.
2. Render `linzess/find-relief` locally: confirm 2 tab buttons, first active,
   only the Adults panel visible; clicking Pediatric swaps panels.
3. Confirm no `insertBefore` error in console on `*.aem.live` after deploy.
4. Regression-check other tabs users (USDermEd disease pages, efficacy-tabs)
   across brands.

## Related, already-fixed (in migration scope, brand CSS only)
The same dosing section also had the icons ballooning to full width. Fixed in
`blocks/flexbox/linzess/_flexbox.css` (cap icon at `--spacing-110`, icon+content
row layout) — brand override, no base change. That fix is independent of this
tabs bug.
