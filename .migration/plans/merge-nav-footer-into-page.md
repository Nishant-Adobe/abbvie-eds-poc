# Merge Nav/Footer into Page Content

## Context

Currently, the header and footer load from separate fragment files:
- `content/nav.plain.html` — loaded by the header block via `loadFragment('/content/nav')`
- `content/footer.plain.html` — loaded by the footer block via `loadFragment('/content/footer')`

These are separate because the EDS framework's header/footer blocks are designed to fetch fragments from remote paths. However, the user wants everything in a single file.

## Important Limitation

**The EDS header and footer blocks cannot read content from the page file itself.** They always fetch from fragment paths (`/nav` and `/footer`). Merging nav/footer HTML directly into `savings-card-hero.plain.html` as page sections would:
- **NOT** be rendered by the header/footer blocks (they ignore page content)
- Appear as regular content sections in the `<main>` area instead
- Break the standard EDS header/footer pattern

**The only way to control header/footer content locally is via the separate fragment files.** This is a framework constraint, not a design choice.

## Options

1. **Keep separate files** (standard EDS pattern) — header/footer blocks fetch fragments correctly
2. **Remove separate files** — header/footer fall back to remote proxy
3. **Add nav/footer as page sections** — renders in `<main>` not in `<header>`/`<footer>` semantic elements (non-standard, breaks accessibility)

## Checklist

- [ ] Decide final approach (user chose "merge" but this has framework limitations)
- [ ] If merging: remove nav.plain.html and footer.plain.html, accept that header/footer will load from remote proxy
- [ ] If keeping: retain current setup with separate fragment files

---

> **Note:** Merging into the page file is not technically feasible with the EDS header/footer block architecture. The fragments must remain separate, OR be removed to fall back to the remote proxy. Execution requires Execute mode.
