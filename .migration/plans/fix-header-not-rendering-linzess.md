# Fix: Header Not Rendering on LINZESS Pages

## Problem

The site header disappeared on LINZESS pages after I added a rule intended only to hide the *empty* header on the standalone SMS-terms page.

## Root cause

In `styles/linzess/styles.css` (~line 176):

```css
header.header-wrapper:not(:has(.nav)) {
  display: none;
}
```

This selector checks for an element with **class** `.nav`. But the header block (`blocks/header/header.js:1007`) builds its nav as a **tag** with an **id**:

```js
const nav = createElement('nav', { attributes: { id: 'nav', 'aria-expanded': 'false' } });
```

There is no element with `class="nav"` anywhere in the header. So `:has(.nav)` is never true, `:not(:has(.nav))` is **always** true, and the rule hides the header on **every** linzess page — not just the empty SMS-terms one. (The footer rule above it is correctly scoped via `.footer.block:empty`, so the footer is unaffected.)

## Fix options

The intent was: hide the header only when it rendered empty (standalone pages with `nav: false`, e.g. reminder-terms). When the header is empty, the decorate function returns early and never appends the `<nav id="nav">`, so the real distinguisher is "no `<nav>` element present."

**Chosen fix:** change the selector to match the empty state correctly and scope it so it can only hide a genuinely empty header — replace `.nav` (class) with `nav` (tag):

```css
/* Hide the header only when it rendered empty (no <nav> built — standalone
   pages with nav:false). Real headers always contain <nav id="nav">. */
header.header-wrapper:not(:has(nav)) {
  display: none;
}
```

This restores the header on all normal pages (they contain `<nav id="nav">`) while still collapsing the empty header on the SMS-terms page.

## Verification

- **sitemap** (nav `/linzess/nav`): header renders again
- **es-home** (nav `/linzess/es/nav`): unaffected by this rule
- **reminder-terms-conditions** (nav `false`): header still collapsed (no `<nav>` built → still hidden)
- Confirm in preview that the header bar returns on sitemap and the savings-card pages, and stays gone on reminder-terms.

## Checklist

- [ ] In `styles/linzess/styles.css`, change `header.header-wrapper:not(:has(.nav))` → `header.header-wrapper:not(:has(nav))` (class selector `.nav` → tag selector `nav`)
- [ ] Reload `/content/linzess/utility/sitemap` and confirm the header bar renders (logo + nav)
- [ ] Reload `/content/linzess/savings-card/` (or another normal linzess page) and confirm the header still renders — i.e. the rule no longer hides it
- [ ] Reload `/content/linzess/utility/reminder-terms-conditions` and confirm the header stays hidden (empty, nav:false)
- [ ] Confirm footer behavior is unchanged on all three (footer rule was already correctly scoped)

> Note: This is a one-line CSS selector fix in `styles/linzess/styles.css`. Applying it requires Execute mode.
