# Linzess /savings-and-support — Migration Analysis

Source: https://www.linzess.com/savings-and-support
Title: Cost Savings & Financial Support | LINZESS® (linaclotide)
Brand: linzess | Job codes: US-LIN-250121 (ISI), US-LIN-250071 (footer)

## Section sequence (each abbv background-container = 1 EDS section)

1. **HERO** (image-text-v2) — full-bleed bg image, white uppercase overlay text, middle-left.
   - Eyebrow: "Savings & Support"  → divider → H1: "See If You're Eligible<br>To Save on LINZESS"
   - Images: savings-hero-desktop.jpg (2048x874), savings-hero-mobile.jpg (750x740)
   - H1: Bebas Neue, 40px, lh 36px, weight 400, uppercase, white. Eyebrow class eyebrow--white.
   - Maps to existing linzess hero variant: `linzess-behind-nav-linzess-editorial-hero` (white text behind nav).

2. **SECTION-NAV** (section-navigation) — sticky "JUMP TO" in-page nav.
   - Labels: Savings (#savings), Financial Support (#financialsupport)
   - Maps to `section-nav sticky mobile-menu`.

3. **SAVINGS** section (anchor #savings)
   - Eyebrow "Savings" + H2 "You Could Pay as Little as $30* For 90 or 30 Days of LINZESS"
   - **Savings promo** (columns): off-white rounded card, left = SavingsCard-Tout-Asterisk_Desktop.png / _Mobile.png ; right text:
     - "Whether you start with a 90-day or 30-day prescription, you could be eligible to pay as little as $30* with the LINZESS Savings Program."
     - "Talk to a doctor about a 90-day prescription to potentially maximize your savings and minimize trips to the pharmacy."
     - CTA "Sign Up Now" → /savings-card ; "Already have a savings card? Activate now." → /savings-card
     - Matches existing `columns columns-homepage-savings` / `columns-resources-savings` pattern.
   - **"Choose how you want to sign up:"** heading
   - **3 sign-up method cards** (flexbox 3-up), rounded-corners 16px, pad 0 28px 40px, alternating bg:
     - Text  — bg light-purple #d9d7f9 — icon icon-text-msg.svg — body "Text "LINZESS" to 59257 to sign up and add your card to your phone.†" — CTA "Text to Sign Up" → sms:59257
     - Call  — bg dark-purple #422e83 (white text) — icon icon-daily-reminders.svg — body "Call 1-855-859-5614 and we'll help you sign up and mail out your card." — CTA "Call to Sign Up" → tel:1-855-859-5614
     - Click — bg light-purple #d9d7f9 — icon icon-web-click.svg — body "Click to sign up online and download your card." — CTA "Sign Up Online" → /savings-card
   - **Savings footnotes** (*  and †) — verbatim below.
   - **Accordion** "Program Terms, Conditions, and Eligibility Criteria" (collapsed) — verbatim terms below.

4. **FINANCIAL SUPPORT** section (anchor #financialsupport)
   - Eyebrow "Financial Support" + H2 "What Financial Help Is Available?"
   - WAC paragraph: "The list price, also known as the Wholesale Acquisition Cost (WAC),‡ for LINZESS® is $282.48 a month (as of January 2026). The WAC may not reflect the price paid by patients."
   - "Insurance Information§" sub-heading
   - **Insurance table** — `table-container rounded-corners` flex, radius 16px, overflow hidden, gap 2px.
     - Header row: bg #60579e (purple), white, weight 800, uppercase, pad 16px 24px, Lato 16px. Cells: "If You Have:" | "You Could Pay:"
     - Data rows: 2 cells. col0 bg light-purple #d9d7f9 color #422e83. col1 bg white color #4d4d4f. pad 24px.
     - 6 data rows (Commercial Insurance / Medicaid / Medicare Part D / Medicare LIS / Other Insurance / Uninsured) — verbatim below.
   - **Footnotes** ‡ § || — verbatim below.
   - **2 info boxes** (flexbox 2-up, gap 16px, each w≈427px, radius 16px, pad 0 32px):
     - Insurance Coverage Support — bg dark-purple #422e83 (white text)
     - MyAbbvie Assist — bg light-purple #d9d7f9
   - **Gut-check CTA** (columns) — white rounded card, img Resources-Doctor-Tout-Desktop.png/_Mobile.png, "Actor Portrayal" tag, "Ready to Talk to Your Doctor?" + body + CTA "Start My Discussion Guide" → /find-relief/gutcheck. (Same as resources columns-resources-gutcheck.)

5. **EXPLORE cards** (container) — dark-purple arc section (`background-dark-purple background-dark-purple-arc`), 2-up:
   - Check My Symptoms → /find-relief/gutcheck (Learn More)
   - Why LINZESS? → /why-linzess (Learn More)
   - Maps to `cards-grid cards-grid-icon-image-card` explore variant (cf. whylinzess-explore / resources-explore).

6. **ISI** text-container + **safety-bar split** — shared, identical to other linzess pages (verbatim US-LIN-250121).
7. **Footer / metadata** — brand=linzess, nav=/linzess/nav, footer=/linzess/footer.

## Images (DAM: content/content/dam/abbvie-eds-poc/linzess/images)
NEW (downloaded): savings-hero-desktop.jpg, savings-hero-mobile.jpg, SavingsCard-Tout-Asterisk_Mobile.png, Resources-Doctor-Tout-Mobile.png, icon-text-msg.svg, icon-daily-reminders.svg, icon-web-click.svg
EXISTING: SavingsCard-Tout-Asterisk_Desktop.png, Resources-Doctor-Tout-Desktop.png

## Verbatim copy

### Savings footnotes
*Maximum savings limit applies; patient out-of-pocket expense may vary. This offer is available to patients with commercial insurance coverage and a valid LINZESS prescription. Offer not valid for patients enrolled in Medicare, Medicaid, or other federal or state healthcare programs. This offer is not valid for cash-paying patients. Please see Program Terms, Conditions, Privacy Notice, and Eligibility Criteria. (link → /savings-and-support#expand)

†By texting LINZESS to 59257, you will receive your activated savings card. 10 msgs. per enrollment activation. Message and data rates apply. Reply HELP for help; reply STOP to cancel. Consent to receiving SMS messages is not a condition of purchase of goods or services. Please see full Terms (→ https://smsterms.copaysavingsprogram.com/Linzess) and Privacy Policy (→ https://smsprivacy.copaysavingsprogram.com/Linzess).

### Insurance table rows
HEADER: If You Have: | You Could Pay:
1. Commercial Insurance (Usually provided by an employer) | Depending on your plan, your monthly copay for LINZESS may vary. Eligible patients may pay as little as $30 for a 30-day or 90-day prescription* with a LINZESS savings card. About 92% of LINZESS® prescriptions have an out-of-pocket cost between $0–$50 per month.|| This cost includes use of LINZESS savings cards.
2. Medicaid | About 100% of LINZESS prescriptions have an out-of-pocket cost between $0–$10 per month depending on state plan.
3. Medicare Part D | About 93% of LINZESS prescriptions have an out-of-pocket cost between $0–$50 per month||, depending on coverage phase. Out-of-pocket cost for LINZESS may vary depending on patient's other medication costs. Most Medicare patients have standard Part D prescription coverage, which has different costs depending on deductibles and coverage gaps.
4. Medicare Low Income Subsidy (LIS) | Most patients who qualify for Full Extra Help LIS pay $12.15 per month starting January 1, 2025.
5. Other Insurance (VA, DOD, TRICARE, Others) | The DOD represents active military and non active (retired) military members plus their families. Members can go to the MTF (Military Treatment Facility)/military base pharmacy or TRICARE (retail pharmacy), or Mail Order for prescription. LINZESS co-pays range from $0 to $43 depending on if you are active, non active (retired), or a family member and where you pick up your prescription. VA LINZESS co-pay is $11.
6. Uninsured or if you cannot afford your medication | If you are having difficulty paying for your medicine, AbbVie may be able to help. Visit AbbVie.com/PatientAccessSupport (→ https://abbvie.com/myabbvieassist) to learn more.

### Financial support footnotes
‡The price at which AbbVie® sells its products to wholesalers.
§Important details about understanding your individual costs: The chart above provides cost information based on what a person with the type of coverage listed may pay. Your type of health or prescription insurance plan will determine exactly how much you will pay. Information listed is accurate as of January 2022 and is based on publicly available benefit design information for Medicaid and Medicare Part D out-of-pocket costs for the 2022 plan year.
||IQVIA LAAD Dispensed TRx as of Jan 2025 to Dec 2025.

### Info boxes
Insurance Coverage Support: To help you understand your coverage and what your out-of-pocket costs may be, it's important to verify your benefits. And even if your LINZESS isn't covered, there may be ways to save on your prescription. An Insurance Specialist can talk you through your coverage and help identify potential savings options—regardless of your insurance coverage.

MyAbbvie Assist: If you are having difficulty paying for your medicine, myAbbVie Assist may be able to help. myAbbVie Assist, our patient assistance program, provides AbbVie medicine to qualifying patients. It is intended for people that live in the United States, have limited or no health insurance coverage and demonstrate qualifying financial need. Visit AbbVie.com/PatientAccessSupport (→ https://www.abbvie.com/patients/patient-support.html) to learn more.

### Gut-check CTA
Actor Portrayal | Ready to Talk to Your Doctor? | Prepare for your visit by taking the Gut Check Quiz and create your own discussion guide. You'll be ready to better describe your symptoms at your next doctor's appointment. | CTA "Start My Discussion Guide" → /find-relief/gutcheck

### Accordion: Program Terms, Conditions, and Eligibility Criteria
This offer is valid only for patients with commercial prescription insurance coverage, who are 6 years of age or older and meet eligibility criteria and is good for use only with a valid prescription for LINZESS® (linaclotide) capsules 72 mcg, 145 mcg, or 290 mcg at the time the prescription is filled by the pharmacist and dispensed to the patient. This offer is not valid for use by patients enrolled in Medicare, Medicaid, or other federal or state programs (including any state pharmaceutical assistance programs, TRICARE, Department of Defense or Veterans Affairs programs), or private indemnity or HMO insurance plans that reimburse you for the entire cost of your prescription drugs or where prohibited by law or by the patient's health insurance provider. If at any time a patient begins receiving prescription drug coverage under any such federal, state, or government-funded healthcare program, patient will no longer be eligible to use the LINZESS savings card. Patients may not use this card if they are Medicare-eligible and enrolled in an employer-sponsored health plan or prescription drug benefit program for retirees. This offer is not valid for cash-paying patients. Offer good only in the USA, including Puerto Rico, at participating retail pharmacies. Patients residing in or receiving treatment in certain states may not be eligible to participate in this program. Depending on your insurance coverage, eligible patients may pay as little as $30 per 30, 60, or 90-day supply for each of up to twelve (12) prescription fills per calendar year. One 60-day supply counts as two (2) fills and one 90-day supply counts as three (3) fills of the total twelve (12) fills. AbbVie reserves the right to rescind, revoke, or amend this offer without notice. Void if prohibited by law, taxed, or restricted. Patients may not seek reimbursement for value received under the LINZESS Savings Program from any third-party payers. This offer is not transferable. The selling, purchasing, trading, or counterfeiting of this card is prohibited by law. This offer has no cash value and may not be used in combination with any other discount, coupon, rebate, free trial, or similar offer for the specified prescription. Subject to all other terms and conditions, the maximum annual benefit that may be available solely for the patient's benefit under the co-pay assistance program is $2,280.00 per calendar year. The actual application and use of the benefit available under the co-pay assistance program may vary on a monthly, quarterly, and/or annual basis depending on each individual patient's plan of insurance and other prescription drug costs. This offer is not health insurance. By redeeming this offer, you acknowledge that you are an eligible patient and that you understand and agree to comply with the terms and conditions of this offer. To learn about AbbVie's privacy practices and your privacy choices, visit https://abbv.ie/corpprivacy.

## NOTE: superscripts
Use Unicode superscripts (* † ‡ § ||  → keep literal symbols; for numeric use ¹²³) — NOT <sup> (md2jcr degrades <sup> to <div>).
