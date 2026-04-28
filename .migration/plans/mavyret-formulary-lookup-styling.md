# Mavyret Formulary Lookup — Pixel-Perfect Styling Plan

## Source vs Current UE Comparison

### Source Site (mavyret.com/hcp/access)
- Heading: `Find MAVYRET Access by State With Our **Formulary Lookup Tool**` — 22px, normal weight, bold on last 3 words
- Label: `Select State` — 14px, bold, left-aligned above select
- Select dropdown: ~300px wide, centered, `Select state` placeholder, thin border
- Submit button: Below select (separate row), centered, thin border with `>` arrow, ~250px wide
- Layout: Everything stacked vertically, centered, narrow form (~300-400px max)
- No reCAPTCHA notice (empty)

### Current UE Rendering (Problems)
1. **Select + button inline**: They appear side by side instead of stacked vertically
2. **Button too wide**: Green button extends to fill available space
3. **Form too wide**: Content stretches wider than the source's compact layout
4. **Label alignment**: "Select your state" instead of "Select State"

## CSS Fixes Needed

| # | Issue | Fix | File |
|---|---|---|---|
| 1 | Select + button stacked | Add flex column layout to form, ensure button is below select | botox CSS |
| 2 | Select width | Keep `max-width: 300px`, ensure `display: block` | botox CSS |  
| 3 | Button width | Set `max-width: 300px`, `width: 100%` to match select width | botox CSS |
| 4 | Form max-width | Reduce to `350px` for tighter layout | botox CSS |
| 5 | Label left-align | Override centered text for label specifically | botox CSS |

## Checklist

- [ ] **1.1** Add `.formulary-lookup .formulary-lookup-form` flex column layout with centered items
- [ ] **1.2** Set select `display: block` and `max-width: 300px` for consistent width
- [ ] **1.3** Set submit button `width: 100%` and `max-width: 300px` to match select width  
- [ ] **1.4** Ensure label is left-aligned within the 300px form area
- [ ] **1.5** Sync changes to `blocks/formulary-lookup/botox/formulary-lookup.css`
- [ ] **1.6** Preview locally and compare against source screenshot
- [ ] **1.7** Commit and provide file for GitHub update

---

## Notes
- The select and button stacking is the biggest visual difference. The source site has them clearly on separate rows.
- The authoring content (heading, label text) needs to be fixed in the UE separately — "Select your state" should be "Select State".
- **Execution requires switching to Execute mode.**
