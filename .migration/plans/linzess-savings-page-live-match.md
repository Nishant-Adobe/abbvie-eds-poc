# Linzess Savings Card Page — Live Site Match Plan

## Analysis: Migrated Preview vs Live Site Differences

### Key Differences Identified

| # | Issue | Migrated (Preview) | Live Site | Fix |
|---|-------|--------------------|-----------|----|
| 1 | **Form section uses static text instead of embedded form** | Form fields rendered as plain text paragraphs (First Name *, Last Name *, etc.) | Interactive AEM adaptive form with actual input fields | Replace static text with `embed-form` block pointing to the AEM form path |
| 2 | **Callout "Pay as little as $30" section present in migration but NOT on live page** | Purple callout block appears between form and eligibility sections | Not present on live page — live goes directly from form section to ISI | Remove the callout section entirely |
| 3 | **"How Do I Know If I'm Eligible?" + Cards section NOT on live page** | "Need a Savings Card?" and "Already Have a Card?" cards section visible | Not present on live page | Remove the eligibility/cards section entirely |
| 4 | **Steps section NOT on live page** | Step 1, Step 2, Step 3 default content visible | Not present on live page | Remove the steps section entirely |
| 5 | **FAQ Accordion NOT on live page** | "Who is eligible...", "How much can I save?", "How do I activate..." accordion | Not present on live page | Remove the FAQ accordion section entirely |
| 6 | **Form section heading differs** | `<h2>Sign up for the Linzess® Savings Program</h2>` repeated as section heading | No separate h2 above form — the form area starts with "Please tell us about yourself..." text | Remove the h2 from the form section |
| 7 | **Missing "Not actual card image" italic text position** | Shows below savings card image | Shows below savings card image on live (correct) | Keep as-is |
| 8 | **Section style: form should be on white background with arc top** | Has `white-arc` section style | White background with curved/arc separator at top | Keep as-is (correct) |
| 9 | **Columns layout for form + image** | Uses `columns columns-offset` with form text left, image right | Live has form fields left, savings card image right | Keep columns but replace left column content with `embed-form` block |
| 10 | **reCAPTCHA + buttons below form** | Static text "☐ I'm not a robot" + buttons as links | Live has actual reCAPTCHA widget + styled buttons | Remove static reCAPTCHA text (form handles this internally); keep buttons |
| 11 | **Disclaimer text placement** | Below buttons | Below buttons on live (correct) | Keep as-is |

### Summary of Required Changes

The live site page is much simpler than the migrated version. The live page only contains:
1. Utility bar
2. Page title + Terms accordion
3. Form section (embedded AEM form + savings card image + disclaimer)
4. ISI section (Uses + Important Risk Information)

The migrated page has **4 extra sections** (callout, eligibility cards, steps, FAQ accordion) that do NOT exist on the live site. These were likely generated from a different/older version or from content that's been removed.

## Execution Plan

### Phase 1: Remove sections not present on live site
- [ ] Remove callout "Pay as little as $30" section (lines 86-91)
- [ ] Remove "How Do I Know If I'm Eligible?" + cards section (lines 92-123)
- [ ] Remove steps section (lines 124-131)
- [ ] Remove FAQ accordion section (lines 132-181)

### Phase 2: Fix form section to match live site
- [ ] Remove the `<h2>Sign up for the Linzess® Savings Program</h2>` heading from form section (line 49)
- [ ] Replace static form field text in left column with `embed-form` block referencing the AEM adaptive form path: `/content/forms/af/admp/linzess/allergan-common-savings-card-forms/2023-privacy-update/linzess-savings-program.html`
- [ ] Remove the static reCAPTCHA text "☐ I'm not a robot" (line 75) — the embedded form handles this
- [ ] Remove the reCAPTCHA Enterprise paragraph (line 76) — form handles this
- [ ] Keep the "Get New Card" and "Activate Existing Card" buttons (line 77)
- [ ] Keep the disclaimer text (line 78)

### Phase 3: Validate
- [ ] Run md2jcr validation to ensure no errors
- [ ] Preview page in browser and compare with live site structure
- [ ] Verify accordion, embed-form, columns, and ISI sections render correctly

## Checklist

- [ ] Remove callout section
- [ ] Remove eligibility/cards section
- [ ] Remove steps section
- [ ] Remove FAQ accordion section
- [ ] Remove duplicate h2 heading from form section
- [ ] Replace static form text with embed-form block
- [ ] Remove static reCAPTCHA placeholder text
- [ ] Run md2jcr validation — confirm SUCCESS
- [ ] Preview page — confirm structure matches live site

## Notes

- The `embed-form` block requires the AEM Cloud Forms server to render the actual interactive form. In local preview it will show the form path as text — this is expected behavior.
- The `columns columns-offset` variant should be kept to maintain the form-left / image-right layout.
- Header and footer load automatically via metadata (`nav: /linzess/nav`, `footer: /linzess/footer`).
- Execution requires switching to Execute mode.
