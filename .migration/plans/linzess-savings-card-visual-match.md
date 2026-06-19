# Match Migrated Page to Live LINZESS Savings Card Site

## Objective

Run full pixel-perfect comparison between the migrated page (`/content/savings-card-hero`) and the live site (`https://www.linzess.com/savings-card`), then iteratively apply CSS and content fixes until visual parity is achieved.

## Approach

Use the `excat:excat-page-critique` skill to:
1. Inspect the original (live) page — capture screenshots, styles, and HTML of all elements
2. Inspect the migrated page — capture same data from local preview
3. Compare and generate a critique report with similarity score
4. Apply CSS fixes prioritized by visual impact
5. Re-inspect and iterate until ≥85% similarity (Good grade)

## Prerequisites

- Dev server running at `http://localhost:3000`
- Migrated page accessible at `http://localhost:3000/content/savings-card-hero`
- Live site accessible at `https://www.linzess.com/savings-card`

## Checklist

- [ ] Initialize critique session (create session directory)
- [ ] Inspect original page (capture 400x400+ elements from live site)
- [ ] Inspect migrated page (capture 400x400+ elements from local preview)
- [ ] Compare pages and generate critique report (similarity score, differences, CSS fixes)
- [ ] Apply CSS fixes (iteration 1) — target high-priority visual differences
- [ ] Re-inspect and re-compare (verify improvement)
- [ ] Apply remaining fixes (iteration 2, if needed)
- [ ] Achieve ≥85% similarity or complete 3 iterations

---

> **Ready for execution.** Switch to Execute mode to run the page critique workflow.
