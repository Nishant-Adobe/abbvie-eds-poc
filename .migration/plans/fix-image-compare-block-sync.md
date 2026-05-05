The `fstab.yaml` shows:
```yaml
mountpoints:
  /:
    url: "https://author-p160552-e1944799.adobeaemcloud.com/bin/franklin.delivery/nishant-adobe/abbvie-eds-poc/develop"
    type: "markup"
    suffix: ".html"
```

The AEM Cloud instance serves code from the **`develop`** branch of the `nishant-adobe/abbvie-eds-poc` repository. But we're working on the `image-compare` branch. Let me check the remote and branch status.Now I see. The repo remote is `https://github.com/Nishant-Adobe/abbvie-eds-poc.git` and it only fetches the `develop` branch. The code serves from `develop` branch. Our `image-compare` branch is local only — it needs to be merged into `develop` for the AEM Cloud instance to pick it up.

Let me also check what our current branch state looks like relative to develop.# Fix Image Compare Block — Deploy to AEM Cloud

## Problem

The Skyrizi HCP page (`image-compare-skyrizihcp`) shows **raw unstyled content** — all model field values dumped as plain text/images in sequence. The `decorate()` function is not executing.

### Evidence
- Screenshot 1 shows: "CLICK AND DRAG TO SEE RESULTS", "BEFORE |WEEK 0", "AFTER | WEEK 16", followed by raw images and alt text ("Before Image") — this is the raw block table content without any JS decoration
- Content is correctly authored in UE (Screenshots 2-6 confirm all fields are properly filled)
- The block variant is `Gallery (tabs + thumbnails)` — correctly authored

### Root Cause: Code Not Deployed

The `image-compare.js` rewrite exists only on the local **`image-compare`** branch. The AEM Cloud instance serves code from the **`develop`** branch (per `fstab.yaml` → `nishant-adobe/abbvie-eds-poc/develop`).

**The `develop` branch still has the OLD `image-compare.js`** which expects the legacy format (`cells[0]` = afterImage). When it encounters the new UE model-order format (30+ columns, text at position 0), it hits `if (!afterImg || !beforeImg) return;` and exits — leaving the block undecorated.

### Repository Details
- **Remote:** `https://github.com/Nishant-Adobe/abbvie-eds-poc.git`
- **Active branch for AEM Cloud:** `develop`
- **Our work branch:** `image-compare` (local only, 5 commits ahead)
- **Solution:** Merge `image-compare` → `develop`, then push to origin

---

## Commits on `image-compare` branch (to be merged)

1. `fdf64d2` — Tokenize image-compare block CSS for Rinvoq and Skyrizi HCP brands
2. `b35f818` — Support UE model-order and key-value content formats
3. `fb90304` — Fix lint: break long buildSkyrizi calls
4. `f785e01` — Fix image-compare: align JS class names with CSS selectors
5. `3a588d0` — Add rinvoq-dtc brand support for image-compare block

---

## Checklist

- [ ] Merge `image-compare` branch into `develop`
- [ ] Push `develop` to origin (`https://github.com/Nishant-Adobe/abbvie-eds-poc.git`)
- [ ] Wait for AEM Cloud code sync (~1-2 minutes)
- [ ] Verify `image-compare-skyrizihcp` page now renders as interactive slider
- [ ] Verify `image-compare-rinvoq` page renders correctly (if authored on rinvoq-dtc workspace)
- [ ] If runtime errors appear in browser console, debug and fix

---

## Key Constraints

1. The code logic is correct — verified against authored content column positions
2. Merging into `develop` will affect the shared AEM Cloud instance
3. The `component-models.json` local fix (12 inlined $refs) should NOT be committed — verify it's excluded
4. **Execution requires Execute mode** (to run git merge + push)
