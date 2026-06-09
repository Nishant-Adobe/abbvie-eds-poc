# Linzess Activate Savings Card Page — Live Site Match Plan

## Current State Analysis

The current `content/savings-card/activate.plain.html` file is a raw HTML dump from the AEM Cloud Forms page — it contains all the internal form metadata, hidden fields, campaign IDs, analytics configuration, and form internals that should NOT be in the content file. It's completely unstructured for EDS.

The live page at `https://www.linzess.com/savings-card/activate` has the same structure as the `/savings-card` page (which we already migrated as `savings-card-hero.plain.html`):
1. Utility bar
2. Page title + Terms accordion
3. Form section (embed-form + savings card image)
4. Buttons (Get New Card + Activate Existing Card)
5. Disclaimer
6. ISI (Uses + Important Risk Information)

## Key Differences: Current activate.plain.html vs Live Site

| # | Issue | Current State | Required |
|---|-------|--------------|----------|
| 1 | **File is raw HTML dump** | Single `<div>` containing all form internals, hidden fields, campaign IDs, analytics metadata mixed with content | Clean EDS-structured sections with blocks |
| 2 | **No section structure** | All content in one flat div | Proper sections with section-metadata |
| 3 | **No accordion block for T&C** | Plain text paragraph for terms | Accordion block (17 parent rows, 8-col item) |
| 4 | **No embed-form block** | Raw form field labels/values dumped | `embed-form` block referencing the AEM form path |
| 5 | **No columns layout** | No columns structure | `columns columns-offset` for form + image layout |
| 6 | **No proper metadata** | Minimal metadata at bottom | Full metadata: brand, nav, footer, title, description |
| 7 | **No ISI section-metadata** | ISI content present but no style marker | `isi` section style |
| 8 | **Contains form internals** | Hidden fields, campaign IDs, analytics payload all visible | Only visible user-facing content |

## Solution

Rewrite `content/savings-card/activate.plain.html` to match the same structure as `savings-card-hero.plain.html` (which already matches the live site). The activate page is essentially the same page — the form just starts in "activate existing card" mode rather than "get new card" mode. The page structure, accordion, image, buttons, disclaimer, and ISI are identical.

The form path remains the same: `/content/forms/af/admp/linzess/allergan-common-savings-card-forms/2023-privacy-update/linzess-savings-program.html`

## Checklist

- [ ] Rewrite `content/savings-card/activate.plain.html` with proper EDS section structure
- [ ] Add utility-bar section
- [ ] Add page-title section with accordion block (17 parent rows, 8-col item for T&C)
- [ ] Add form section with `embed-form` block in `columns columns-offset` layout
- [ ] Add savings card image in right column
- [ ] Add buttons: "Get New Card >" (primary) + "Activate Existing Card >" (secondary)
- [ ] Add disclaimer text
- [ ] Add ISI section (USES + IMPORTANT RISK INFORMATION) with `isi` section style
- [ ] Add metadata block (brand: linzess, nav: /linzess/nav, footer: /linzess/footer, title, description)
- [ ] Run md2jcr validation — confirm SUCCESS
- [ ] Preview page and verify structure matches live site

## Notes

- The activate page is structurally identical to the savings-card-hero page. The only difference is the form's initial state (which tab is active), controlled by the AEM form itself via URL parameters.
- The `embed-form` block path is the same form — AEM handles routing between "get new" and "activate" flows internally.
- Execution requires switching to Execute mode.
