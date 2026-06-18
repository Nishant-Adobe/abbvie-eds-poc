/* eslint-disable */
/* global WebImporter */

/**
 * Page-level parser for the LINZESS Savings & Support page.
 *
 * SELECTOR STRATEGY (documented assumption):
 * The live linzess DOM exposes highly ambiguous, repeated wrappers — 8
 * `.image-text-v2.parbase`, 12 `.container.parbase`, deeply nested empty divs —
 * that cannot be reliably disambiguated per-section by CSS selector alone.
 * Per project memory ("Live HTML is reference only"), this single page-level
 * parser is keyed on `main` and DETERMINISTICALLY composes every section in
 * gold-standard order using the verbatim content captured in
 * import-work/linzess-savings-support/analysis.md.
 *
 * This parser is SELF-CONTAINED (no ES imports) because the excat parser
 * validator injects parser files as plain <script> elements (not modules);
 * any top-level `import` would throw a SyntaxError and yield "No results".
 * The dedicated per-block parsers (hero.js, section-nav.js, …) build the same
 * tables and are wired into the real import script (import-linzess-savings-support.js)
 * via Node ESM imports for production runs.
 *
 * Block-table shapes are modeled EXACTLY on the gold-standard plain.html:
 *   content/linzess/{index,why-linzess,resources}/index.plain.html
 *
 * Project rules honored:
 *   - No <sup>: literal Unicode (* † ‡ § ||).
 *   - Verbatim regulated copy (ISI, savings terms, insurance table, footnotes).
 *
 * @param {Element} element The `main` element (its children are replaced).
 * @param {Object} ctx { document }
 */
export default function parse(element, { document }) {
  const DAM = '/content/dam/abbvie-eds-poc/linzess/images';

  const USES_FULL = 'LINZESS® (linaclotide) is a prescription medication used to treat irritable bowel syndrome with constipation (IBS-C) in adults and in children and adolescents 7 years of age and older, chronic idiopathic constipation (CIC) in adults, and functional constipation (FC) in children and adolescents 6 years of age and older. “Idiopathic” means the cause of the constipation is unknown. <strong>It is not known if LINZESS is safe and effective in children with functional constipation less than 6 years of age or in children with IBS-C less than 7 years of age.</strong>';

  const TERMS = 'This offer is valid only for patients with commercial prescription insurance coverage, who are 6 years of age or older and meet eligibility criteria and is good for use only with a valid prescription for LINZESS® (linaclotide) capsules 72 mcg, 145 mcg, or 290 mcg at the time the prescription is filled by the pharmacist and dispensed to the patient. This offer is not valid for use by patients enrolled in Medicare, Medicaid, or other federal or state programs (including any state pharmaceutical assistance programs, TRICARE, Department of Defense or Veterans Affairs programs), or private indemnity or HMO insurance plans that reimburse you for the entire cost of your prescription drugs or where prohibited by law or by the patient’s health insurance provider. If at any time a patient begins receiving prescription drug coverage under any such federal, state, or government-funded healthcare program, patient will no longer be eligible to use the LINZESS savings card. Patients may not use this card if they are Medicare-eligible and enrolled in an employer-sponsored health plan or prescription drug benefit program for retirees. This offer is not valid for cash-paying patients. Offer good only in the USA, including Puerto Rico, at participating retail pharmacies. Patients residing in or receiving treatment in certain states may not be eligible to participate in this program. Depending on your insurance coverage, eligible patients may pay as little as $30 per 30, 60, or 90-day supply for each of up to twelve (12) prescription fills per calendar year. One 60-day supply counts as two (2) fills and one 90-day supply counts as three (3) fills of the total twelve (12) fills. AbbVie reserves the right to rescind, revoke, or amend this offer without notice. Void if prohibited by law, taxed, or restricted. Patients may not seek reimbursement for value received under the LINZESS Savings Program from any third-party payers. This offer is not transferable. The selling, purchasing, trading, or counterfeiting of this card is prohibited by law. This offer has no cash value and may not be used in combination with any other discount, coupon, rebate, free trial, or similar offer for the specified prescription. Subject to all other terms and conditions, the maximum annual benefit that may be available solely for the patient’s benefit under the co-pay assistance program is $2,280.00 per calendar year. The actual application and use of the benefit available under the co-pay assistance program may vary on a monthly, quarterly, and/or annual basis depending on each individual patient’s plan of insurance and other prescription drug costs. This offer is not health insurance. By redeeming this offer, you acknowledge that you are an eligible patient and that you understand and agree to comply with the terms and conditions of this offer. To learn about AbbVie’s privacy practices and your privacy choices, visit https://abbv.ie/corpprivacy.';

  // -- inline helpers (self-contained) --
  const picture = (src, opts = {}) => {
    const pic = document.createElement('picture');
    const img = document.createElement('img');
    img.setAttribute('src', src);
    if (opts.alt) img.setAttribute('alt', opts.alt);
    if (opts.width) img.setAttribute('width', String(opts.width));
    if (opts.height) img.setAttribute('height', String(opts.height));
    pic.append(img);
    return pic;
  };
  const para = (html) => { const el = document.createElement('p'); el.innerHTML = html; return el; };
  const anchor = (href, text) => { const a = document.createElement('a'); a.setAttribute('href', href); a.textContent = text; return a; };
  const div = (...nodes) => { const d = document.createElement('div'); nodes.forEach((n) => d.append(n)); return d; };
  const hr = () => document.createElement('hr');
  const table = (cells) => WebImporter.DOMUtils.createTable(cells, document);

  const out = document.createElement('div');

  // ---- 1. HERO ----
  // why-linzess hero cell order: desktopImg, mobileImg, '', eyebrow, '', richtext(h1), '', ''
  const heroRich = div(document.createElement('p'));
  const h1 = document.createElement('h1');
  h1.textContent = "See If You're Eligible To Save on LINZESS";
  heroRich.append(h1);
  out.append(table([
    ['Hero (no-padding, text-left, linzess-behind-nav-linzess-editorial-hero)'],
    [picture(`${DAM}/savings-hero-desktop.jpg`)],
    [picture(`${DAM}/savings-hero-mobile.jpg`)],
    [''],
    ['Savings & Support'],
    [''],
    [heroRich],
    [''],
    [''],
  ]));

  out.append(hr());

  // ---- 2. SECTION-NAV ----
  out.append(table([
    ['Section Nav (sticky, mobile-menu)'],
    ['-'],
    ['Savings', anchor('#savings', '#savings')],
    ['Financial Support', anchor('#financialsupport', '#financialsupport')],
  ]));

  out.append(hr());

  // ---- 3. SAVINGS SECTION (anchor #savings) ----
  out.append(para('Savings'));
  const savingsHeading = document.createElement('h2');
  savingsHeading.id = 'savings';
  savingsHeading.textContent = 'You Could Pay as Little as $30* For 90 or 30 Days of LINZESS';
  out.append(savingsHeading);

  // 3b. savings promo columns (model: columns-resources-savings)
  const promoLeft = div(
    picture(`${DAM}/SavingsCard-Tout-Asterisk_Desktop.png`, { alt: 'You may be eligible to get 90 days for 30 dollars', width: 880, height: 599 }),
    picture(`${DAM}/SavingsCard-Tout-Asterisk_Mobile.png`, { alt: 'You may be eligible to get 90 days for 30 dollars' }),
  );
  const promoRight = div(
    para('Whether you start with a 90-day or 30-day prescription, you could be eligible to pay as little as $30* with the LINZESS Savings Program.'),
    para('Talk to a doctor about a 90-day prescription to potentially maximize your savings and minimize trips to the pharmacy.'),
  );
  const promoSignUp = document.createElement('p');
  promoSignUp.append(anchor('/savings-card', 'Sign Up Now'));
  promoRight.append(promoSignUp);
  const promoActivate = document.createElement('p');
  promoActivate.append(document.createTextNode('Already have a savings card? '), anchor('/savings-card', 'Activate now'), document.createTextNode('.'));
  promoRight.append(promoActivate);
  out.append(table([
    ['Columns (columns-resources-savings)'],
    [promoLeft],
    [promoRight],
  ]));

  // 3c. choose-how default content
  out.append(para('Choose how you want to sign up:'));

  // 3d. 3 sign-up cards (model: cards-grid-icon-image-card, 6 cells/card)
  // Live icon order: icon-text-msg / icon-daily-reminders / icon-web-click
  const signupCards = [
    { href: 'sms:59257', icon: `${DAM}/icon-text-msg.svg`, title: 'Text', body: 'Text “LINZESS” to 59257 to sign up and add your card to your phone.†', cta: 'Text to Sign Up' },
    { href: 'tel:1-855-859-5614', icon: `${DAM}/icon-daily-reminders.svg`, title: 'Call', body: 'Call 1-855-859-5614 and we’ll help you sign up and mail out your card.', cta: 'Call to Sign Up' },
    { href: '/savings-card', icon: `${DAM}/icon-web-click.svg`, title: 'Click', body: 'Click to sign up online and download your card.', cta: 'Sign Up Online' },
  ];
  const signupCells = [['Cards Grid (cards-grid-icon-image-card, savings-signup)']];
  signupCards.forEach((c) => {
    const t = document.createElement('p'); t.textContent = c.title;
    const b = para(c.body);
    const cta = document.createElement('p'); cta.textContent = c.cta;
    signupCells.push([div(anchor(c.href, c.href)), picture(c.icon), t, b, cta, '']);
  });
  out.append(table(signupCells));

  // 3e. savings footnotes (* and †) verbatim
  const footAsterisk = document.createElement('p');
  footAsterisk.append(
    document.createTextNode('*Maximum savings limit applies; patient out-of-pocket expense may vary. This offer is available to patients with commercial insurance coverage and a valid LINZESS prescription. Offer not valid for patients enrolled in Medicare, Medicaid, or other federal or state healthcare programs. This offer is not valid for cash-paying patients. Please see '),
    anchor('/savings-and-support#expand', 'Program Terms, Conditions, Privacy Notice, and Eligibility Criteria.'),
  );
  out.append(footAsterisk);
  const footDagger = document.createElement('p');
  footDagger.append(
    document.createTextNode('†By texting LINZESS to 59257, you will receive your activated savings card. 10 msgs. per enrollment activation. Message and data rates apply. Reply HELP for help; reply STOP to cancel. Consent to receiving SMS messages is not a condition of purchase of goods or services. Please see full '),
    anchor('https://smsterms.copaysavingsprogram.com/Linzess', 'Terms'),
    document.createTextNode(' and '),
    anchor('https://smsprivacy.copaysavingsprogram.com/Linzess', 'Privacy Policy'),
    document.createTextNode('.'),
  );
  out.append(footDagger);

  // 3f. accordion (Program Terms) — model: accordion-test.plain.html
  // 16 parent config rows + accordion-item rows (8 cells)
  const termsRich = div(para(TERMS));
  const HEADING = 'Program Terms, Conditions, and Eligibility Criteria';
  out.append(table([
    ['Accordion'],
    [HEADING],
    ['Expand All'],
    ['Collapse All'],
    ['plus'],
    ['minus'],
    ['plus'],
    ['minus'],
    [''], [''], [''], [''], [''], [''], [''],
    ['id:'],
    ['lang:none'],
    [HEADING, termsRich, 'accordion-item', '', '', '', '', ''],
  ]));

  out.append(hr());

  // ---- 4. FINANCIAL SUPPORT SECTION (anchor #financialsupport) ----
  out.append(para('Financial Support'));
  const finHeading = document.createElement('h2');
  finHeading.id = 'financialsupport';
  finHeading.textContent = 'What Financial Help Is Available?';
  out.append(finHeading);

  // 4b. WAC paragraph + Insurance Information sub-line
  out.append(para('The list price, also known as the Wholesale Acquisition Cost (WAC),‡ for LINZESS® is $282.48 a month (as of January 2026). The WAC may not reflect the price paid by patients.'));
  out.append(para('<strong>Insurance Information§</strong>'));

  // 4c. insurance table (base table block, variant insurance-table)
  const uninsured = div();
  uninsured.append(
    document.createTextNode('If you are having difficulty paying for your medicine, AbbVie may be able to help. Visit '),
    anchor('https://abbvie.com/myabbvieassist', 'AbbVie.com/PatientAccessSupport'),
    document.createTextNode(' to learn more.'),
  );
  // The base Table block is a CONTAINER model (fields: classes, filter); md2jcr
  // needs a `table-N-columns` filter row + a leading `table-col-N` marker cell
  // per data row to resolve each row's model (else "Cannot read properties of
  // undefined (reading 'fields')"). table.js strips both markers at render time.
  // This 2-column table → `table-2-columns` + `table-col-2` rows.
  out.append(table([
    ['Table (insurance-table)'],
    ['table-2-columns'],
    ['table-col-2', 'If You Have:', 'You Could Pay:'],
    ['table-col-2', 'Commercial Insurance (Usually provided by an employer)', 'Depending on your plan, your monthly copay for LINZESS may vary. Eligible patients may pay as little as $30 for a 30-day or 90-day prescription* with a LINZESS savings card. About 92% of LINZESS® prescriptions have an out-of-pocket cost between $0–$50 per month.|| This cost includes use of LINZESS savings cards.'],
    ['table-col-2', 'Medicaid', 'About 100% of LINZESS prescriptions have an out-of-pocket cost between $0–$10 per month depending on state plan.'],
    ['table-col-2', 'Medicare Part D', 'About 93% of LINZESS prescriptions have an out-of-pocket cost between $0–$50 per month||, depending on coverage phase. Out-of-pocket cost for LINZESS may vary depending on patient’s other medication costs. Most Medicare patients have standard Part D prescription coverage, which has different costs depending on deductibles and coverage gaps.'],
    ['table-col-2', 'Medicare Low Income Subsidy (LIS)', 'Most patients who qualify for Full Extra Help LIS pay $12.15 per month starting January 1, 2025.'],
    ['table-col-2', 'Other Insurance (VA, DOD, TRICARE, Others)', 'The DOD represents active military and non active (retired) military members plus their families. Members can go to the MTF (Military Treatment Facility)/military base pharmacy or TRICARE (retail pharmacy), or Mail Order for prescription. LINZESS co-pays range from $0 to $43 depending on if you are active, non active (retired), or a family member and where you pick up your prescription. VA LINZESS co-pay is $11.'],
    ['table-col-2', 'Uninsured or if you cannot afford your medication', uninsured],
  ]));

  // 4d. footnotes ‡ § || verbatim
  out.append(para('‡The price at which AbbVie® sells its products to wholesalers.'));
  out.append(para('§Important details about understanding your individual costs: The chart above provides cost information based on what a person with the type of coverage listed may pay. Your type of health or prescription insurance plan will determine exactly how much you will pay. Information listed is accurate as of January 2022 and is based on publicly available benefit design information for Medicaid and Medicare Part D out-of-pocket costs for the 2022 plan year.'));
  out.append(para('||IQVIA LAAD Dispensed TRx as of Jan 2025 to Dec 2025.'));

  // 4e. 2 info boxes (columns financial-info-boxes)
  const box1 = div(
    para('<strong>Insurance Coverage Support</strong>'),
    para('To help you understand your coverage and what your out-of-pocket costs may be, it’s important to verify your benefits. And even if your LINZESS isn’t covered, there may be ways to save on your prescription. An Insurance Specialist can talk you through your coverage and help identify potential savings options—regardless of your insurance coverage.'),
  );
  const box2 = div(
    para('<strong>MyAbbvie Assist</strong>'),
    para('If you are having difficulty paying for your medicine, myAbbVie Assist may be able to help. myAbbVie Assist, our patient assistance program, provides AbbVie medicine to qualifying patients. It is intended for people that live in the United States, have limited or no health insurance coverage and demonstrate qualifying financial need.'),
  );
  const box2Visit = document.createElement('p');
  box2Visit.append(document.createTextNode('Visit '), anchor('https://www.abbvie.com/patients/patient-support.html', 'AbbVie.com/PatientAccessSupport'), document.createTextNode(' to learn more.'));
  box2.append(box2Visit);
  out.append(table([
    ['Columns (financial-info-boxes)'],
    [box1],
    [box2],
  ]));

  // 4f. gut-check CTA (columns columns-resources-gutcheck)
  const gutLeft = div(
    picture(`${DAM}/Resources-Doctor-Tout-Desktop.png`, { alt: 'Actor Portrayal', width: 880, height: 647 }),
    picture(`${DAM}/Resources-Doctor-Tout-Mobile.png`, { alt: 'Actor Portrayal' }),
  );
  const gutRight = div(
    para('<strong>Ready to Talk to Your Doctor?</strong>'),
    para('Prepare for your visit by taking the Gut Check Quiz and create your own discussion guide. You’ll be ready to better describe your symptoms at your next doctor’s appointment.'),
  );
  const gutCta = document.createElement('p');
  gutCta.append(anchor('/find-relief/gutcheck', 'Start My Discussion Guide'));
  gutRight.append(gutCta);
  out.append(table([
    ['Columns (columns-resources-gutcheck)'],
    [gutLeft],
    [gutRight],
  ]));

  out.append(hr());

  // ---- 5. EXPLORE cards (cards-grid-icon-image-card, no icons) ----
  const exploreCards = [
    { href: '/find-relief/gutcheck', title: 'Check My Symptoms', cta: 'Learn More' },
    { href: '/why-linzess', title: 'Why LINZESS?', cta: 'Learn More' },
  ];
  const exploreCells = [['Cards Grid (cards-grid-icon-image-card, savings-explore)']];
  exploreCards.forEach((c) => {
    const t = document.createElement('p'); t.textContent = c.title;
    const cta = document.createElement('p'); cta.textContent = c.cta;
    exploreCells.push([div(anchor(c.href, c.href)), '', t, '', cta, '']);
  });
  out.append(table(exploreCells));

  out.append(hr());

  // ---- 6. ISI default content + safety-bar split (verbatim shared US-LIN-250121) ----
  const isi = div();
  isi.innerHTML = `
    <h3>USES</h3>
    <p>${USES_FULL}</p>
    <h3>IMPORTANT RISK INFORMATION</h3>
    <ul>
     <li><strong>Do not give LINZESS to children who are less than 2 years of age. It may harm them.</strong> LINZESS can cause severe diarrhea and your child could get severe dehydration (loss of a large amount of body water and salt).</li>
     <li>Do not take LINZESS if a doctor has told you that you have a bowel blockage (intestinal obstruction).</li>
    </ul>
    <h4>Before you take LINZESS, tell your doctor about your medical conditions, including if you are:</h4>
    <ul>
     <li>Pregnant or plan to become pregnant. It is not known if LINZESS will harm your unborn baby.</li>
     <li>Breastfeeding or plan to breastfeed. You and your doctor should decide if you will take LINZESS and breastfeed.</li>
    </ul>
    <p><strong>Tell your doctor about all the medicines you take,</strong> including prescription and over-the-counter medicines, vitamins, and herbal supplements.</p>
    <h5>Side Effects</h5>
    <p><strong>LINZESS can cause serious side effects, including diarrhea, which is the most common side effect and can sometimes be severe.</strong> Diarrhea often begins within the first 2 weeks of LINZESS treatment. <strong>Stop taking LINZESS and call your doctor right away if you get severe diarrhea during treatment with LINZESS.</strong></p>
    <p>Other common side effects of LINZESS in people with IBS-C and CIC include gas, stomach-area (abdomen) pain, and swelling, or a feeling of fullness or pressure in your abdomen (distention).</p>
    <strong>Call your doctor or go to the nearest hospital emergency room right away if you develop unusual or severe stomach-area (abdomen) pain, especially if you also have bright red, bloody stools or black stools that look like tar.</strong>
    <p>These are not all the possible side effects of LINZESS. For more information, ask your doctor or pharmacist.</p>
    <p><strong>You are encouraged to report negative side effects of prescription drugs to the FDA. Visit <a href="https://www.fda.gov/medwatch">www.fda.gov/medwatch</a> or call <a href="tel:18003321088">1-800-FDA-1088</a>.</strong> <strong>If you are having difficulty paying for your medicine, AbbVie and Ironwood may be able to help. Visit <a href="https://www.abbvie.com/patients/patient-support.html">AbbVie.com/PatientAccessSupport</a> to learn more.</strong> <strong>Please see full <a href="/content/dam/abbvie-eds-poc/pdf/linzess_pi.pdf">Prescribing Information</a>, including Boxed Warning, and <a href="https://www.rxabbvie.com/pdf/linzess_pi.pdf#page=26">Medication Guide</a>.</strong></p>
    <p>US-LIN-250121</p>
  `;
  out.append(isi);

  out.append(hr());

  const sbCell1 = div();
  sbCell1.innerHTML = `<p></p>\n<h3>USES</h3>\n<p>${USES_FULL}</p>`;
  const sbCell2 = div();
  sbCell2.innerHTML = `<p></p>
<h3>IMPORTANT RISK INFORMATION</h3>
<p></p>
<ul>
 <li><strong>Do not give LINZESS to children who are less than 2 years of age. It may harm them.</strong> LINZESS can cause severe diarrhea and your child could get severe dehydration (loss of a large amount of body water and salt).</li>
 <li>Do not take LINZESS if a doctor has told you that you have a bowel blockage (intestinal obstruction).</li>
</ul>
<p><strong>Before you take LINZESS, tell your doctor about your medical conditions, including if you are:</strong></p>`;
  const sbCell3 = div();
  sbCell3.innerHTML = `<p></p>
<h3>USES</h3>
<p>${USES_FULL}</p>
<p></p>
<h3>IMPORTANT RISK INFORMATION</h3>
<p></p>
<ul>
 <li><strong>Do not give LINZESS to children who are less than 2 years of age. It may harm them.</strong> LINZESS can cause severe diarrhea and your child could get severe dehydration (loss of a large amount of body water and salt).</li>
 <li>Do not take LINZESS if a doctor has told you that you have a bowel blockage (intestinal obstruction).</li>
</ul>
<p></p>
<h4>Before you take LINZESS, tell your doctor about your medical conditions, including if you are:</h4>
<p></p>
<ul>
 <li>Pregnant or plan to become pregnant. It is not known if LINZESS will harm your unborn baby.</li>
 <li>Breastfeeding or plan to breastfeed. You and your doctor should decide if you will take LINZESS and breastfeed.</li>
</ul>
<p><strong>Tell your doctor about all the medicines you take,</strong> including prescription and over-the-counter medicines, vitamins, and herbal supplements.</p>
<p></p>
<h5>Side Effects</h5>
<p><strong>LINZESS can cause serious side effects, including diarrhea, which is the most common side effect and can sometimes be severe.</strong> Diarrhea often begins within the first 2 weeks of LINZESS treatment. <strong>Stop taking LINZESS and call your doctor right away if you get severe diarrhea during treatment with LINZESS.</strong></p>
<p>Other common side effects of LINZESS in people with IBS-C and CIC include gas, stomach-area (abdomen) pain, and swelling, or a feeling of fullness or pressure in your abdomen (distention).</p>
<p><strong>Call your doctor or go to the nearest hospital emergency room right away if you develop unusual or severe stomach-area (abdomen) pain, especially if you also have bright red, bloody stools or black stools that look like tar.</strong></p>
<p>These are not all the possible side effects of LINZESS. For more information, ask your doctor or pharmacist.</p>
<p><strong>You are encouraged to report negative side effects of prescription drugs to the FDA. Visit <a href="https://www.fda.gov/medwatch">www.fda.gov/medwatch</a> or call <a href="tel:18003321088">1-800-FDA-1088</a>.</strong></p>
<p><strong>If you are having difficulty paying for your medicine, AbbVie and Ironwood may be able to help. Visit <a href="https://www.abbvie.com/patients/patient-support.html">AbbVie.com/PatientAccessSupport</a> to learn more.</strong></p>
<p><strong>Please see full</strong> <a href="/content/dam/abbvie-eds-poc/pdf/linzess_pi.pdf">Prescribing Information</a><strong>, including Boxed Warning, and</strong> <a href="https://www.rxabbvie.com/pdf/linzess_pi.pdf#page=26">Medication Guide</a><strong>.</strong></p>
<p>US-LIN-250121</p>`;
  out.append(table([
    ['Safety Bar (split)'],
    [sbCell1],
    [sbCell2],
    [sbCell3],
    ['id:'],
    [''],
  ]));

  // Replace all of main's content with the composed output.
  element.replaceChildren(...out.childNodes);
}
