# Formulary Lookup — Full Pixel-Perfect Enhancement Plan

## Scope

Complete four workstreams to make the formulary-lookup block match the RinvoqHCP source exactly:

1. **Filter dropdown enhancement** — Replace native `<select>` with custom checkbox dropdown matching source
2. **Results table styling** — Style the results list to match the source's Plan Name / Plan Type / Status layout
3. **CSS pixel-perfect fixes** — Fine-tune spacing, sizing, colors against source screenshot
4. **UE authoring values** — Exact field values for all three brands

## Source Analysis (from HTML and screenshot)

### Filter Dropdown (Custom Checkbox)
The source uses a **custom dropdown with checkboxes**, not a native `<select>`:
- Container: `.abbv-plan-category` — looks like an input field with "Select a filter" text + red close icon
- When open: shows a dropdown list of checkbox options (Commercial, Medicare, State Medicaid, Health Exchange, Managed Medicaid)
- Selected items get highlighted background (e.g., "Commercial" with blue checkbox + highlight)
- Close icon (red ✕) clears selection and closes dropdown
- Width: 388px, border-radius: 10px, matching the ZIP input styling

### Results Table
The source renders results as a **list** (not an HTML `<table>`):
- Container: `.abbv-formulary-results` with role="table"
- Header row: `<ul>` with `<li role="columnheader">` — Plan Name | Plan Type | Status
- Data rows: `<ul>` with `<li>` containing 3 `<div>` cells — account name, plan type, status
- Each row is a flex row with columns aligned to the header
- "Preferred" status shown as text (no colored badge)
- Pagination below results when multiple pages
- "Formulary Status Results" heading above the table

### CSS Measurements (from DevTools)
- `.formulary-container` padding: `24px 20px`
- `.tool-box` = the card container wrapping everything
- ZIP input: `width: 388px`, `height: 45px`, `border-radius: 10px`
- Filter anchor: `width: 388px`, `height: 50px`, `border-radius: 10px`, `border: 1px solid rgb(135,137,138)`
- Submit button: `background: rgb(144,18,74)`, `border-radius: 100px`, `height: 49px`
- Heading h3: `font-weight: 600`, `font-size: 20px`, graphik-bold font

## Checklist

### Phase 1: Filter Dropdown Enhancement (JS + CSS)
- [ ] **1.1** Replace `createFilterDropdown()` in JS — render as custom `.formulary-lookup-filter-dropdown` with anchor text + dropdown panel of checkboxes
- [ ] **1.2** Add click handler to toggle dropdown open/close
- [ ] **1.3** Add checkbox change handlers to track selected filters
- [ ] **1.4** Add close/clear icon (✕) that resets selections
- [ ] **1.5** Pass selected filter values to API URL on form submit
- [ ] **1.6** Add CSS for `.formulary-lookup-filter-dropdown` — closed state (looks like input), open state (dropdown list), checkbox styling, highlight on selected, close icon

### Phase 2: Results Table Styling (CSS)
- [ ] **2.1** Update `renderResultsTable()` to use list-based layout matching source (flex rows with 3 columns) instead of HTML `<table>`
- [ ] **2.2** Add "Formulary Status Results" heading above results
- [ ] **2.3** Style header row with bold text, bottom border
- [ ] **2.4** Style data rows with flex layout — account name (60%), plan type (20%), status (20%)
- [ ] **2.5** Remove colored tier badge — show status as plain text ("Preferred", "Available", etc.)
- [ ] **2.6** Add pagination styling matching source (numbered pages, prev/next)

### Phase 3: CSS Pixel-Perfect Fixes
- [ ] **3.1** Rinvoq: verify card padding `24px 20px` matches source `.tool-box .formulary-container`
- [ ] **3.2** Rinvoq: verify heading font `graphik-bold`, `20px`, `font-weight: 600`
- [ ] **3.3** Rinvoq: verify yellow underline width and position matches source brushstroke
- [ ] **3.4** Rinvoq: verify floating label position on ZIP input border
- [ ] **3.5** Rinvoq: verify filter dropdown dimensions match ZIP input (388px, border-radius 10px)
- [ ] **3.6** Rinvoq: verify submit button padding `15px 66px 15px 32px` with search icon
- [ ] **3.7** Rinvoq: verify reCAPTCHA notice `11.2px` centered below submit
- [ ] **3.8** Rinvoq: verify disclaimer bold text centered below form

### Phase 4: Author in UE — All Three Brands
- [ ] **4.1** Author SkyriziHCP (brand=abbvie) with ZIP variant, heading, placeholder, submit label, reCAPTCHA, disclaimer
- [ ] **4.2** Author RinvoqHCP (brand=rinvoq) with ZIP+Card+Centered, icon, heading, floating label, filter, indication, reCAPTCHA, disclaimer
- [ ] **4.3** Author Mavyret (brand=botox) with Default variant, richtext heading with partial bold, state label
- [ ] **4.4** Set page metadata `brand` on each page

### Phase 5: Visual QA
- [ ] **5.1** Compare each brand's rendering against source screenshots
- [ ] **5.2** Test filter dropdown interaction (open, select, close)
- [ ] **5.3** Test results table rendering with mock data
- [ ] **5.4** Test mobile responsiveness at 600px

---

*This plan requires Execute mode for implementation. Phases 1-2 involve JS and CSS code changes. Phase 3 is CSS tuning. Phase 4 is manual UE authoring. Phase 5 is visual QA.*
