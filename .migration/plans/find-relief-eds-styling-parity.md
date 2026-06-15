# Match Local Find-Relief Preview to the Published EDS Site (Full Styling Parity)

## Goal

Make the local AEM preview of `/linzess/migration-dinesh/find-relief/` render **identically to the published EDS site** shown in the screenshots — full Linzess styling, fonts, and functionality: purple checklist card with orange checkmarks, styled Gut Check tout, dark-purple icon cards ("Already Been Prescribed"), 3-up sign-up cards, dosing tabs with icon bubbles, arc dividers, orange CTA buttons, and the Linzess footer.

## Current state (verified this session)

The restore is **already substantially complete**:

- **CSS/JS/fonts:** every asset the page loads now byte-matches the deployed EDS build (verified with decompressed md5). The 4 files that were ahead of deployed (`fonts.css`, `cards-grid/linzess/cards-grid.css`, `safety-bar/linzess/safety-bar.css`, `footer/linzess/footer.css`) were reverted to the deployed versions; `navigation-content/linzess` was correctly left as the local placeholder (deployed = 404).
- **Content (3 pages):** `index`, `talk-to-a-doctor`, `how-to-take-linzess` `.plain.html` were overwritten with the exact published HTML (byte/md5 match).
- **Brand metadata re-added:** the published `.plain.html` omits the page-metadata block (EDS delivers it in `<head>`), which the local dev server needs. I re-appended a clean `brand: linzess / nav / footer / title / description` metadata block to all 3 files; div-balance verified.
- **Local render confirmed:** `body class="appear linzess"`, brand CSS loaded, body font **Lato**, H1 **Bebas Neue 40px**, section headings **purple #422e83**, images load via the `media_*` proxy, 2 videos, dosing tabs, ISI, Linzess footer all present — matching the screenshots.

## What's left (the only open items)

1. **Final lint** (`npm run lint:css`) — the last run was interrupted (exit 137 / OOM-style kill) before producing output. Needs a clean re-run; expectation is only the 3 pre-existing `safety-bar.css` errors.
2. **Side-by-side visual confirmation** vs the provided screenshots at desktop width — spot-check the checklist card (purple + orange checks), Gut Check tout overlap, prescribed dark/light-purple icon cards, sign-up 3-up, dosing icon bubbles, arc dividers, orange bottom-nav CTAs.
3. **Subpage spot-check** — confirm `talk-to-a-doctor` and `how-to-take-linzess` also render with the brand applied (same metadata fix).

## Approach

- Re-run `npm run lint:css` once (single invocation, capture tail) to avoid the prior interruption; report deltas.
- Reload the local preview for all 3 pages and verify brand-applied computed styles + key section visuals against the screenshots (DOM/computed checks first; one screenshot only if a visual delta is suspected, to conserve tokens).
- Report final parity: local == deployed for assets + content, brand styling active.

> Execution (running lint, browser verification) requires **Execute mode** — this artifact is the plan only. No commit/push (held for approval; no git credentials in this environment).

## Checklist

- [ ] Re-run `npm run lint:css` cleanly; confirm only the 3 pre-existing safety-bar errors (no new deltas)
- [ ] Reload local `index` preview; confirm `body.appear.linzess`, Lato/Bebas fonts, purple `#422e83` headings, brand CSS loaded
- [ ] Verify key sections vs screenshots: purple checklist card + orange checkmarks, Gut Check tout (image overlap + Actor Portrayal), "Already Been Prescribed" dark/light-purple icon cards, 3-up sign-up cards, dosing tabs + icon bubbles, arc dividers, orange "Learn More"/bottom-nav CTAs, Linzess footer
- [ ] Spot-check `talk-to-a-doctor` and `how-to-take-linzess` render with brand applied (metadata fix effective)
- [ ] Confirm images load (no broken `media_*`), both videos show posters + play overlay, dosing tab switching works
- [ ] Report final local-vs-deployed parity (assets byte-match, content byte-match, brand active); hold for approval before any commit/push

## Open Questions / Risks

- The local preview footer/header come from the dev server's proxy origin fragment; if it shows a different brand's footer that's a dev-server `--url` config detail, not page content — flag if it diverges from the screenshots.
- Content `.plain.html` files are gitignored (need `git add -f` to track); the 4 reverted block CSS files are tracked and currently modified in the working tree.
- This restored state intentionally matches the **older deployed build** (e.g. cards-grid without `.cards-grid-wrapper`); the newer local styling remains recoverable from git history / `/tmp` backups if you later want it back.
- No commit/push performed (no credentials); changes stay in the working tree pending approval.
