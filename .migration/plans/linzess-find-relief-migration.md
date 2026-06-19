I'll investigate the current published vs preview state (read-only) to confirm the root cause before writing the plan.Let me verify the current authoring state of the section-metadata in the plain.html (read-only).Let me check the page-metadata wrapper and hero/safety-bar section-metadata (read-only).# Linzess "Find Relief" — Publish Parity Fix Plan (.aem.live vs AEM preview)

**Symptom:** Blocks render correctly on the AEM preview (`preview-aemcoder.adobe.io/content/linzess/find-relief`) but **not** on the published EDS live URL (`linzess-find-relief-migration--abbvie-eds-poc--nishant-adobe.aem.live/linzess/find-relief`) — section styling (off-white band, white instructions card, talk-to-doctor checklist, centered headings) is missing on live.

**Reference:** `AEM_to_EDS_Migration_Super_Prompt_and_Rules.txt` — Issues **1, 16, 19** + Section 2 (md2jcr round-trip) + Section 8 (survival table).

> **Plan mode.** This artifact is the diagnostic + remediation plan. Steps that modify files or trigger publish require **Execute mode**. No commit/push/publish without explicit approval (Rule H).

---

## Root-Cause Analysis (confirmed against the prompt file)

The CSS/JS for every block IS loading on `.aem.live` (verified earlier: 31 stylesheets, 200s, tokens + fonts applied). This is **not** a CSS-load failure. Per **Issue 16** ("AEM preview vs EDS live look different"):

- **AEM preview** (`preview-aemcoder`) serves the **latest authored content** — it already reflects the `classes_customClass` rows and renders correctly.
- **`.aem.live`** serves **from the JCR produced by md2jcr at import time** — it reflects a **stale snapshot** authored *before* the section classes were corrected.

### Why the section styling is missing on live (Issue 1 + Issue 16)
The CSS targets section style classes (`.section.off-white-band`, `.section.instructions-tabs`, `.section.talk-to-doctor`, etc.). Those classes only land on the published `<section>` when authored as a **`classes_customClass` row** (Issue 1 / Section 2). The local `find-relief.plain.html` now has all 15 `classes_customClass` rows (verified: lines 24, 55, 73, 106, 140, 172, 226, 244, 288, 329, 345, 370, 395, 434), but the **published JCR predates that fix** — so the live `<section>`s carry none of these classes and the CSS has nothing to hook onto.

### Contributing factor (Issue 19 — stale JCR merge)
The importer merges into the existing JCR node (keyed by blockId / node position) rather than replacing it, so a plain re-import may leave **old content surviving in the merged node**. Blocks whose `blockId` is unchanged (`id:`, `id:abbv_use_statement`, `id:abbv_safety_information`) risk merging stale data instead of replacing it.

### Net root cause
The corrected content (`classes_customClass` rows, removed duplicate promo banner, `name`-based tab panels) **has not been re-imported/re-published** into the JCR that backs `.aem.live`. The fix is a **content re-publish through the import pipeline** — not a code change. CSS on the branch is already correct and deployed.

---

## Checklist

### Phase A — Confirm diagnosis (read-only / Execute for probes)
- [ ] Probe `.aem.live`: count `.section.off-white-band`, `.section.instructions-tabs`, `.section.talk-to-doctor`, `.section.store-linzess` → expect **0** (stale)
- [ ] Probe `preview-aemcoder` with same selectors → expect **4 / 1 / 1 / 1** (correct)
- [ ] Confirm delta is **section classes only** (CSS/JS already 200 on live) → confirms Issue 16 stale-JCR, not a CSS bug
- [ ] Verify local `find-relief.plain.html` has `classes_customClass` rows on all 15 styled sections (already verified by grep)

### Phase B — Pre-publish content validation (Execute mode)
- [ ] Run the md2jcr round-trip locally (helix-html2md + helix-md2jcr) on the current `find-relief.plain.html`
- [ ] Assert all 15 `classes_customClass` values survive with hyphens intact
- [ ] Assert both tab-panel `name` values survive ("Adults with IBS-C or CIC" / "Pediatric Functional Constipation (6–17 years of age)")
- [ ] Assert no md2jcr error (no "Cannot read properties of undefined (reading 'fields')") — Section 2 / Issue 18
- [ ] Confirm no `<sup>`/`<span class>` regressions in regulated ISI copy (Section 8 survival table); job codes US-LIN-250071 + US-LIN-250121 verbatim
- [ ] Confirm page-metadata block is wrapped in an outer section `<div>` (Issue 10) — already verified (lines 521–533)

### Phase C — Force fresh JCR nodes (Issue 19, only if re-import still shows stale)
- [ ] If a plain re-import leaves stale content: give affected blocks **unique `blockId`** values (e.g. `id:linzess-find-relief-isi`) to force new nodes instead of merge
- [ ] Re-run round-trip validation after blockId changes

### Phase D — Re-import + publish (aemcoder/Sidekick — outside this sandbox)
- [ ] Re-import the current `find-relief.plain.html` through the content pipeline so the AEM-author JCR matches local (do **NOT** re-scrape from live — that wipes hand-authored classes)
- [ ] Preview: `POST https://admin.hlx.page/preview/nishant-adobe/abbvie-eds-poc/linzess-find-relief-migration/linzess/find-relief`
- [ ] Publish: `POST https://admin.hlx.page/live/nishant-adobe/abbvie-eds-poc/linzess-find-relief-migration/linzess/find-relief`
- [ ] (Sandbox cannot reach `admin.hlx.page` — HTTP 000, no token — so this step is run by the user / aemcoder UI)

### Phase E — Post-publish verification
- [ ] Re-probe `.aem.live`: `.section.off-white-band` = **4**, `.section.instructions-tabs` present, `.section.store-linzess` present, `.section.talk-to-doctor` present
- [ ] Per-viewport screenshot compare `.aem.live` vs `preview-aemcoder` at 1440 / 768 / 390 — sections match
- [ ] Confirm no duplicate promo banner after ISI; ISI ends at `US-LIN-250121` flowing into footer (no white gap)
- [ ] Regression: other published linzess pages unchanged

---

## Mapping to the Prompt File

| Prompt reference | How it applies here |
|---|---|
| **Issue 1** — section custom classes dropped on publish | Root: classes must be `classes_customClass` rows; now correct locally, must reach JCR via re-publish |
| **Issue 16** — AEM preview vs EDS live differ | Exact symptom: preview = latest authored, live = stale md2jcr JCR; content didn't go through pipeline |
| **Issue 19** — stale JCR on EDS live after republish | Fallback: importer merges old node; force new node via unique `blockId` |
| **Issue 10** — metadata leaks as text | Verified already wrapped — no action |
| **Section 2 / Issue 18** — md2jcr round-trip / orphan suffix | Validate round-trip before publish; tab panels use `name` (not orphan `tabTitle`/`tabName`-suffix) |
| **Section 8** — survival table | Confirm ISI `®`/superscripts/job codes survive verbatim |
| **Rule H** — approval gates | No publish/commit without explicit approval |

---

## What is NOT the cause (ruled out)
- ❌ CSS not loading — all brand/block CSS returns 200 on `.aem.live`.
- ❌ Broken block JS — blocks decorate (sections all `data-section-status="loaded"`).
- ❌ `navigation-content.css` 404 — already fixed (brand scaffold added); harmless.
- ❌ Browser-extension console errors (`ActionableCoachmark`, `showOneChild`) — from the Adobe Acrobat extension, not the page.

---

## Key Constraints
1. **Do NOT re-scrape from live** during re-import — `run-bulk-import.js` overwrites `find-relief.plain.html` and would wipe all hand-authored `classes_customClass` rows, the white-card/off-white-band classes, `no-trigger` modals, and the hero variant. Re-import must use the **current local plain.html**, not the live origin.
2. Section classes via `classes_customClass` row only (Issue 1) — never `style:` key, never wrapper-class variant.
3. Publish runs from the aemcoder/Sidekick environment (this sandbox has no network to `admin.hlx.page` and no publish token).
4. CSS is already correct and deployed on the branch — **no CSS change is required** for this fix; it is purely a content re-publish.
5. Pharma fidelity: ISI/job codes verbatim across the round-trip (Section 8).

---

**Next step:** Switch to **Execute mode** to run Phase A/B validation (probe live vs preview, run the local md2jcr round-trip to prove the classes survive). Phase D (re-import + publish) is performed from aemcoder/Sidekick by the user, since this sandbox cannot reach the publish API. After publish, I run Phase E verification.
