Let me examine the terms page and how the header is loaded before forming a plan.Let me check how the header is loaded and the existing terms-content CSS (footer is already hidden via CSS).The footer is already hidden on the terms page via CSS, but the header isn't. Let me confirm the header DOM structure to target it correctly.# Fix: Remove Header on EDS Terms Page (`/linzess/savings-card/terms`)

## Problem
The EDS terms page renders the full site **header/navigation**, but the live LINZESS terms page (`https://www.linzess.com/savings-card/terms`) is a bare standalone fragment with **no header** (and no footer). The header must be removed on this page only, matching the live site.

## Current State
- The footer is **already hidden** on the terms page via:
  ```css
  body:has(main > .section.terms-content) footer { display: none; }
  ```
- There is **no equivalent rule for the header**, so the header still renders.
- The terms section also reserves top padding for the (now-unwanted) fixed header:
  ```css
  main > .section.terms-content {
    padding: calc(var(--nav-height, 88px) + 4rem) 16px 4rem;
  }
  ```

## Root Cause
The terms page uses the standard EDS shell, which always injects `<header>` and `<footer>`. Only the footer was suppressed; the header rule was never added. Additionally, once the header is gone, the large top padding (which exists to clear the fixed header) leaves an oversized empty gap, so it should be reduced to match the live page's compact top spacing.

## Proposed Fix (scoped to terms page only)
In `styles/styles.css`, extend the existing terms-content scoping:

1. **Hide the header** on the terms page using the same `:has()` body scope already used for the footer:
   ```css
   body:has(main > .section.terms-content) header {
     display: none;
   }
   ```
2. **Reduce the top padding** on `.section.terms-content` since there's no fixed header to clear (e.g. `padding: 4rem 16px` or a small top value matching the live page's spacing).

This is fully scoped via `body:has(main > .section.terms-content)`, so no other page, section, block, or the global header/footer behavior is affected.

## Checklist
- [ ] Add `body:has(main > .section.terms-content) header { display: none; }` to `styles/styles.css` (next to the existing footer-hide rule)
- [ ] Reduce `.section.terms-content` top padding now that the fixed header is gone, to match the live page's compact top spacing
- [ ] Verify in preview (`/content/linzess/savings-card/terms`) that the header no longer renders and content starts near the top
- [ ] Confirm the footer remains hidden and the terms content/heading styling is unchanged
- [ ] Verify across desktop and mobile widths
- [ ] Confirm no other pages (savings-card index, activate) lose their header/footer

## Notes
- The EDS live URL serves from AEM; after the CSS change is pushed and the code deploys, re-check the `*.aem.page` URL. The CSS fix applies wherever `.section.terms-content` is present, so it will take effect on the published EDS page once deployed.
- Execution requires **Execute mode**.
