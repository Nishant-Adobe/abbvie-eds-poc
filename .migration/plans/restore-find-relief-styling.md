# Restore Local Files to Match the Deployed EDS URL (Live = Source of Truth)

## Goal

Treat the deployed EDS page `https://linzess-find-relief--abbvie-eds-poc--nishant-adobe.aem.live/linzess/migration-dinesh/find-relief/` as the **source of truth** and overwrite the local working-tree style/script assets so they exactly equal what Edge Delivery serves right now ("restore to this point").

> ⚠️ **This intentionally reverts newer local styling.** Per the audit, local/GitHub are *ahead* of the deployed build. Making local match deployed will **drop the newer `cards-grid/linzess/cards-grid.css`** (local 41,418 B → deployed 36,873 B, the May-28 version missing `.cards-grid-wrapper` + find-relief card variants). The unstyled sign-up/prescribed/bottom-nav cards on the live page will therefore also be the local state after this. This is what "make local match deployed" means — confirmed by the user.

## What the audit established (read-only, verified)

Comparing every asset the page loads (27 CSS, 26 JS, 7 fonts), decompressed, deployed vs local/GitHub:

- **All JS** (aem.js, scripts.js, tabs.js, cards-grid.js, video.js, header.js, every block-config.js) → **already identical** to deployed ✅ (no change needed)
- **All core CSS** (styles.css, `linzess/styles.css` 87 KB, tokens, hero, header, footer, video, tabs, image-text, safety-bar) → **already identical** to deployed ✅ (no change needed)
- **All 7 fonts** → identical/loaded ✅
- **Exactly ONE asset differs:** `blocks/cards-grid/linzess/cards-grid.css`
  - Deployed (the target state): **36,873 bytes, May 28**
  - Local working tree / GitHub HEAD: **41,418 bytes** (newer)

So "make local match deployed" reduces in practice to **overwriting that single file** with the deployed version — but the plan still re-verifies every CSS/JS asset to be certain nothing else diverged.

## Approach

1. **Snapshot current local** `blocks/cards-grid/linzess/cards-grid.css` (keep a `.bak` copy or rely on git history) so the newer version is recoverable if you change your mind.
2. **Sweep every deployed CSS/JS asset** (decompressed) and compute md5 vs the local file. Build the definitive list of files where deployed ≠ local.
3. For each differing file, **download the deployed version and overwrite** the corresponding local file so local byte-matches deployed. (Expected: only `cards-grid/linzess/cards-grid.css`.)
4. **Verify** local now md5-matches deployed for every audited asset (0 differences).
5. **Local preview check**: render `/content/linzess/migration-dinesh/find-relief/index` to confirm the page now looks like the deployed EDS page (i.e., the card sections revert to the deployed/unstyled-variant state).
6. **Lint** (`npm run lint:css`) — note the reverted file is the deployed version, so expect it to pass as it did on May 28; flag any new lint deltas.
7. **Hold for approval** before any commit/push (standing rule). Do not push.

> Execution (download + overwrite local files, lint, preview) requires **Execute mode** — this artifact is the plan only.

## Files expected to change (local ⟵ deployed)

| File | Local now | Deployed (target) | Action |
|---|---|---|---|
| `blocks/cards-grid/linzess/cards-grid.css` | 41,418 B | 36,873 B (May 28) | Overwrite local with deployed |
| All other CSS/JS/fonts | — | identical | No change |

## Checklist

- [ ] Back up current `blocks/cards-grid/linzess/cards-grid.css` (e.g. note git blob / save `.bak`) before overwriting
- [ ] Re-run decompressed md5 sweep of ALL deployed CSS + JS vs local to get the exact differing-file set (confirm scope)
- [ ] **[Execute mode]** For each differing file, download the deployed (`--compressed`) version and overwrite the local file so it byte-matches deployed
- [ ] **[Execute mode]** Confirm `blocks/cards-grid/linzess/cards-grid.css` local == deployed (36,873 B, May-28 content, no `.cards-grid-wrapper`)
- [ ] Verify local now md5-matches deployed for every audited CSS/JS asset (expect 0 diffs)
- [ ] Restart/refresh local preview; confirm find-relief page matches the deployed EDS page's appearance
- [ ] Run `npm run lint:css`; report any lint deltas introduced by the reverted file
- [ ] Report which files were reverted and confirm local == deployed; hold for approval before any commit/push

## Open Questions / Risks

- **This reverts newer styling on purpose.** After this, local will reproduce the deployed page's unstyled sign-up/prescribed/bottom-nav cards. If the real intent was the opposite (fix the live page to match the fuller local design), that's the *previous* plan (re-sync/push) — say so and I'll switch direction.
- Content `.plain.html` files are gitignored and were not flagged as divergent; this plan touches block CSS/JS only.
- No commit/push performed here (no credentials); changes stay in the working tree pending your approval.
- The newer `cards-grid.css` remains recoverable from git history (`git show HEAD:blocks/cards-grid/linzess/cards-grid.css`) if you want to undo the revert.
