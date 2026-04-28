# Rinvoq Formulary Lookup — Pixel-Perfect Styling Refinement

## Analysis: UE (Image 1) vs Source Site (Image 2)

The UE preview (image 1) is running **old code** because the 3 pending commits haven't been pushed to the `formulary-lookup` branch. Once pushed, the rinvoq brand CSS will load and the block will look like the local preview which already closely matches the source.

However, comparing the **local preview** against the **source site** (image 2), there are remaining refinements:

### Source Site (rinvoqhcp.com) Details from Image 2

| Element | Source Site Value |
|---|---|
| Icon | Clipboard icon, ~40px, positioned left of heading |
| Heading | `Check the Formulary Status for RINVOQ in Your Area` — mixed case, bold, ~18-20px |
| Yellow underline | Full-width gold bar under heading, ~4px height |
| ZIP input | `*Enter Zip Code` floating label, `58758` value, ~500px wide, rectangular with slight rounding |
| Filter | `Select a filter` with orange up-arrow toggle, panel open showing checkboxes |
| Filter selected | `Commercial` highlighted in gold/yellow `rgb(218 170 0)` tint |
| Indication | `Choose Indication` heading, `AD` radio selected with gold accent |
| Submit | `Look Up Status` magenta pill with search icon, ~200px auto-width centered |
| reCAPTCHA | Small text with links, centered |
| Container | White card with subtle shadow inside a tool-box section |

### Gaps to Fix

| # | Issue | Current Value | Target Value | File |
|---|---|---|---|---|
| 1 | Filter selected bg | `rgb(200 220 255)` blue | Gold tint matching brand | rinvoq CSS |
| 2 | Filter checkbox accent | Default blue | `rgb(218 170 0)` gold | rinvoq CSS |
| 3 | Indication radio accent | Default blue | `rgb(144 18 74)` magenta or gold | rinvoq CSS |
| 4 | Submit button width | `100%` full-width | Auto-width centered (~200px) | rinvoq CSS — **revert to auto** |
| 5 | Filter toggle icon color | Red `✕` | Brand gold/orange | rinvoq CSS |
| 6 | Form container max-width | 390px | ~500-600px (source appears wider) | rinvoq CSS |

**Key finding**: Looking at source image 2 more carefully, the submit button is **NOT full-width** — it's auto-width centered, about 200px wide. The full-width change from the last commit was incorrect for Rinvoq. It should be reverted to auto-width.

Also the source form container appears wider than 390px — the input and filter are wider, closer to 500-600px. Need to increase `--formulary-form-max-width` and `--formulary-input-max-width`.

## Checklist

### CSS Fixes (`styles/rinvoq/blocks/formulary-lookup/formulary-lookup.css`)
- [ ] **1.1** Revert submit button from `width: 100%` back to auto-width centered
- [ ] **1.2** Increase form/input max-width from 390px to 500px to match source layout width
- [ ] **1.3** Update filter selected background to gold tint: `rgb(255 243 200)` 
- [ ] **1.4** Add filter checkbox `accent-color: rgb(218 170 0)` (gold)
- [ ] **1.5** Add indication radio `accent-color: rgb(144 18 74)` (magenta)
- [ ] **1.6** Update filter clear button color from red to gold: `color: rgb(218 170 0)`

### Sync
- [ ] **2.1** Sync all changes to `blocks/formulary-lookup/rinvoq/formulary-lookup.css`

### Verification
- [ ] **3.1** Preview locally and compare against source screenshot
- [ ] **3.2** Commit changes

---

## Notes
- The UE preview will not reflect changes until the commits are pushed to the `formulary-lookup` branch. The user needs to navigate to their local repo clone directory first (`cd path/to/abbvie-eds-poc`) before running `git push`.
- The icon beside the heading is an authoring task — requires uploading the clipboard icon to DAM.
- **Execution requires switching to Execute mode.**
