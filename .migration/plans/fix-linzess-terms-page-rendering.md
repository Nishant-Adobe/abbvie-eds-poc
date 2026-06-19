Let me investigate the terms page setup before forming a plan.Let me check whether this file is actually tracked in git (the `.plain.html` gitignore issue) and the CSS that applies to it.Let me check the terms-content CSS and the JCR XML output for the terms page.# Fix: Terms Page Renders Blank in EDS (`/linzess/savings-card/terms`)

## Problem
The migrated Terms & Conditions page renders as a **blank/empty page** in EDS at `/linzess/savings-card/terms`, even though the content is committed to the repo and published to AEM.

## Root-Cause Analysis

The EDS published/preview site sources this page from **AEM JCR** (via the `markup` mountpoint in `fstab.yaml`), not from the local repo `content/` folder. So the defect lives in how the content converted into AEM. Inspecting `migration-work/jcr-content/linzess/savings-card/terms.xml` reveals two malformations in the single `text` component:

1. **`<sup>®</sup>` was converted to `<div>®</div>`** — a block-level `<div>` embedded inside the text field's inline HTML. When AEM delivers this back as `.plain.html` and EDS `decorateSections`/text decoration runs, the mis-nested block element can break the section's DOM structure.
2. **The leading heading lost its wrapper** — the source `<p><strong>Program Terms…</strong></p>` became a bare `&lt;strong&gt;…&lt;/strong&gt;` at the very start of the `text` value (no `<p>` or heading element wrapping it), immediately followed by `<p>`. A bare inline `<strong>` as the first node is fragile through the AEM→EDS round-trip.

Combined, the malformed text component is the most likely reason the section comes back empty/hidden in EDS while the raw content "exists."

Secondary checks to rule out:
- Confirm the page is published on **both** preview (`*.aem.page`) and live (`*.aem.live`) at the exact path, and that a blank (not 404) is genuinely served.
- Confirm the `text` component's HTML isn't being sanitized to empty by the franklin text component.

## Proposed Fix

**In `content/linzess/savings-card/terms.plain.html`:**
- Change the first line from `<p><strong>Program Terms, Conditions, and Eligibility Criteria</strong></p>` to a real heading: `<h2>Program Terms, Conditions, and Eligibility Criteria</h2>` — gives md2jcr a clean heading element instead of a bare `<strong>`, and matches the live page's heading semantics.
- Keep `<sup>®</sup>` in the body but verify the importer/md2jcr emits `<sup>` (not `<div>`); if the pipeline mis-converts `<sup>`, replace the registered symbol with the literal `®` character (`&reg;`) inline so no block element is produced.
- Leave the `section-metadata` (`classes_customClass` → `terms-content`) and page `metadata` blocks unchanged (these were already corrected in the earlier `Style → classes_customClass` fix).

**Re-run the pipeline & redeliver to AEM:**
- Re-run html2md → md2jcr on the corrected file and confirm the `text` value contains a clean `<h2>…</h2><p>…</p>` with `<sup>` (no `<div>`).
- Re-upload the regenerated JCR to AEM and **re-publish** the terms page.
- Re-preview/re-publish via the EDS admin (aem.page then aem.live) so the corrected markup is served.

**Verify CSS still applies:**
- `main > .section.terms-content .default-content-wrapper p:first-child strong` currently styles the heading; after switching to `<h2>`, add/adjust a rule so the heading style targets the `<h2>` (Times New Roman, #000, 20px) instead of `p:first-child strong`.

## Checklist
- [ ] Confirm the EDS URL `/linzess/savings-card/terms` returns a blank page (not a 404) on preview and live
- [ ] Inspect AEM-delivered `.plain.html` for the terms page to confirm the malformed `<div>®</div>` / bare `<strong>` is present in delivered markup
- [ ] In `terms.plain.html`, change the first line to a proper `<h2>` heading
- [ ] Ensure the `®` renders as `<sup>®</sup>` (or literal `&reg;`) — no `<div>` produced by md2jcr
- [ ] Update `styles.css` terms-content heading rule to target the new `<h2>` (Times New Roman, #000, 20px)
- [ ] Re-run html2md → md2jcr and confirm clean `text` field output (heading + paragraph, no block `<div>` inside text)
- [ ] Re-upload corrected JCR to AEM and re-publish the terms page
- [ ] Re-preview and re-publish via EDS admin (aem.page → aem.live)
- [ ] Verify the page renders with content and correct styling on EDS across desktop/mobile
- [ ] Confirm no other savings-card pages/sections are affected

## Notes
- Execution requires **Execute mode**. Re-uploading JCR to AEM and republishing are steps you perform in your AEM/EDS environment (I can prepare the corrected content + JCR and validate locally, but I cannot publish to your AEM instance).
- This plan changes only the terms page content and a scoped `terms-content` heading style — no other blocks or sections.
