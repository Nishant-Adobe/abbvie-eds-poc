/* eslint-disable */
var CustomImportScript = (() => {
  var __defProp = Object.defineProperty;
  var __defProps = Object.defineProperties;
  var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
  var __getOwnPropDescs = Object.getOwnPropertyDescriptors;
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __getOwnPropSymbols = Object.getOwnPropertySymbols;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
  var __propIsEnum = Object.prototype.propertyIsEnumerable;
  var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
  var __spreadValues = (a, b) => {
    for (var prop in b || (b = {}))
      if (__hasOwnProp.call(b, prop))
        __defNormalProp(a, prop, b[prop]);
    if (__getOwnPropSymbols)
      for (var prop of __getOwnPropSymbols(b)) {
        if (__propIsEnum.call(b, prop))
          __defNormalProp(a, prop, b[prop]);
      }
    return a;
  };
  var __spreadProps = (a, b) => __defProps(a, __getOwnPropDescs(b));
  var __export = (target, all) => {
    for (var name in all)
      __defProp(target, name, { get: all[name], enumerable: true });
  };
  var __copyProps = (to, from, except, desc) => {
    if (from && typeof from === "object" || typeof from === "function") {
      for (let key of __getOwnPropNames(from))
        if (!__hasOwnProp.call(to, key) && key !== except)
          __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
    }
    return to;
  };
  var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

  // tools/importer/import-linzess-savings-support.js
  var import_linzess_savings_support_exports = {};
  __export(import_linzess_savings_support_exports, {
    default: () => import_linzess_savings_support_default
  });

  // tools/importer/parsers/savings-page.js
  function parse(element, { document }) {
    const DAM5 = "/content/dam/abbvie-eds-poc/linzess/images";
    const USES_FULL2 = "LINZESS\xAE (linaclotide) is a prescription medication used to treat irritable bowel syndrome with constipation (IBS-C) in adults and in children and adolescents 7 years of age and older, chronic idiopathic constipation (CIC) in adults, and functional constipation (FC) in children and adolescents 6 years of age and older. \u201CIdiopathic\u201D means the cause of the constipation is unknown. <strong>It is not known if LINZESS is safe and effective in children with functional constipation less than 6 years of age or in children with IBS-C less than 7 years of age.</strong>";
    const TERMS2 = "This offer is valid only for patients with commercial prescription insurance coverage, who are 6 years of age or older and meet eligibility criteria and is good for use only with a valid prescription for LINZESS\xAE (linaclotide) capsules 72 mcg, 145 mcg, or 290 mcg at the time the prescription is filled by the pharmacist and dispensed to the patient. This offer is not valid for use by patients enrolled in Medicare, Medicaid, or other federal or state programs (including any state pharmaceutical assistance programs, TRICARE, Department of Defense or Veterans Affairs programs), or private indemnity or HMO insurance plans that reimburse you for the entire cost of your prescription drugs or where prohibited by law or by the patient\u2019s health insurance provider. If at any time a patient begins receiving prescription drug coverage under any such federal, state, or government-funded healthcare program, patient will no longer be eligible to use the LINZESS savings card. Patients may not use this card if they are Medicare-eligible and enrolled in an employer-sponsored health plan or prescription drug benefit program for retirees. This offer is not valid for cash-paying patients. Offer good only in the USA, including Puerto Rico, at participating retail pharmacies. Patients residing in or receiving treatment in certain states may not be eligible to participate in this program. Depending on your insurance coverage, eligible patients may pay as little as $30 per 30, 60, or 90-day supply for each of up to twelve (12) prescription fills per calendar year. One 60-day supply counts as two (2) fills and one 90-day supply counts as three (3) fills of the total twelve (12) fills. AbbVie reserves the right to rescind, revoke, or amend this offer without notice. Void if prohibited by law, taxed, or restricted. Patients may not seek reimbursement for value received under the LINZESS Savings Program from any third-party payers. This offer is not transferable. The selling, purchasing, trading, or counterfeiting of this card is prohibited by law. This offer has no cash value and may not be used in combination with any other discount, coupon, rebate, free trial, or similar offer for the specified prescription. Subject to all other terms and conditions, the maximum annual benefit that may be available solely for the patient\u2019s benefit under the co-pay assistance program is $2,280.00 per calendar year. The actual application and use of the benefit available under the co-pay assistance program may vary on a monthly, quarterly, and/or annual basis depending on each individual patient\u2019s plan of insurance and other prescription drug costs. This offer is not health insurance. By redeeming this offer, you acknowledge that you are an eligible patient and that you understand and agree to comply with the terms and conditions of this offer. To learn about AbbVie\u2019s privacy practices and your privacy choices, visit https://abbv.ie/corpprivacy.";
    const picture2 = (src, opts = {}) => {
      const pic = document.createElement("picture");
      const img = document.createElement("img");
      img.setAttribute("src", src);
      if (opts.alt) img.setAttribute("alt", opts.alt);
      if (opts.width) img.setAttribute("width", String(opts.width));
      if (opts.height) img.setAttribute("height", String(opts.height));
      pic.append(img);
      return pic;
    };
    const para = (html) => {
      const el = document.createElement("p");
      el.innerHTML = html;
      return el;
    };
    const anchor = (href, text) => {
      const a = document.createElement("a");
      a.setAttribute("href", href);
      a.textContent = text;
      return a;
    };
    const div = (...nodes) => {
      const d = document.createElement("div");
      nodes.forEach((n) => d.append(n));
      return d;
    };
    const hr = () => document.createElement("hr");
    const table = (cells) => WebImporter.DOMUtils.createTable(cells, document);
    const out = document.createElement("div");
    const heroRich = div(document.createElement("p"));
    const h1 = document.createElement("h1");
    h1.textContent = "See If You're Eligible To Save on LINZESS";
    heroRich.append(h1);
    out.append(table([
      ["Hero (no-padding, text-left, linzess-behind-nav-linzess-editorial-hero)"],
      [picture2(`${DAM5}/savings-hero-desktop.jpg`)],
      [picture2(`${DAM5}/savings-hero-mobile.jpg`)],
      [""],
      ["Savings & Support"],
      [""],
      [heroRich],
      [""],
      [""]
    ]));
    out.append(hr());
    out.append(table([
      ["Section Nav (sticky, mobile-menu)"],
      ["-"],
      ["Savings", anchor("#savings", "#savings")],
      ["Financial Support", anchor("#financialsupport", "#financialsupport")]
    ]));
    out.append(hr());
    out.append(para("Savings"));
    const savingsHeading = document.createElement("h2");
    savingsHeading.id = "savings";
    savingsHeading.textContent = "You Could Pay as Little as $30* For 90 or 30 Days of LINZESS";
    out.append(savingsHeading);
    const promoLeft = div(
      picture2(`${DAM5}/SavingsCard-Tout-Asterisk_Desktop.png`, { alt: "You may be eligible to get 90 days for 30 dollars", width: 880, height: 599 }),
      picture2(`${DAM5}/SavingsCard-Tout-Asterisk_Mobile.png`, { alt: "You may be eligible to get 90 days for 30 dollars" })
    );
    const promoRight = div(
      para("Whether you start with a 90-day or 30-day prescription, you could be eligible to pay as little as $30* with the LINZESS Savings Program."),
      para("Talk to a doctor about a 90-day prescription to potentially maximize your savings and minimize trips to the pharmacy.")
    );
    const promoSignUp = document.createElement("p");
    promoSignUp.append(anchor("/savings-card", "Sign Up Now"));
    promoRight.append(promoSignUp);
    const promoActivate = document.createElement("p");
    promoActivate.append(document.createTextNode("Already have a savings card? "), anchor("/savings-card", "Activate now"), document.createTextNode("."));
    promoRight.append(promoActivate);
    out.append(table([
      ["Columns (columns-resources-savings)"],
      [promoLeft],
      [promoRight]
    ]));
    out.append(para("Choose how you want to sign up:"));
    const signupCards = [
      { href: "sms:59257", icon: `${DAM5}/icon-text-msg.svg`, title: "Text", body: "Text \u201CLINZESS\u201D to 59257 to sign up and add your card to your phone.\u2020", cta: "Text to Sign Up" },
      { href: "tel:1-855-859-5614", icon: `${DAM5}/icon-daily-reminders.svg`, title: "Call", body: "Call 1-855-859-5614 and we\u2019ll help you sign up and mail out your card.", cta: "Call to Sign Up" },
      { href: "/savings-card", icon: `${DAM5}/icon-web-click.svg`, title: "Click", body: "Click to sign up online and download your card.", cta: "Sign Up Online" }
    ];
    const signupCells = [["Cards Grid (cards-grid-icon-image-card, savings-signup)"]];
    signupCards.forEach((c) => {
      const t = document.createElement("p");
      t.textContent = c.title;
      const b = para(c.body);
      const cta = document.createElement("p");
      cta.textContent = c.cta;
      signupCells.push([div(anchor(c.href, c.href)), picture2(c.icon), t, b, cta, ""]);
    });
    out.append(table(signupCells));
    const footAsterisk = document.createElement("p");
    footAsterisk.append(
      document.createTextNode("*Maximum savings limit applies; patient out-of-pocket expense may vary. This offer is available to patients with commercial insurance coverage and a valid LINZESS prescription. Offer not valid for patients enrolled in Medicare, Medicaid, or other federal or state healthcare programs. This offer is not valid for cash-paying patients. Please see "),
      anchor("/savings-and-support#expand", "Program Terms, Conditions, Privacy Notice, and Eligibility Criteria.")
    );
    out.append(footAsterisk);
    const footDagger = document.createElement("p");
    footDagger.append(
      document.createTextNode("\u2020By texting LINZESS to 59257, you will receive your activated savings card. 10 msgs. per enrollment activation. Message and data rates apply. Reply HELP for help; reply STOP to cancel. Consent to receiving SMS messages is not a condition of purchase of goods or services. Please see full "),
      anchor("https://smsterms.copaysavingsprogram.com/Linzess", "Terms"),
      document.createTextNode(" and "),
      anchor("https://smsprivacy.copaysavingsprogram.com/Linzess", "Privacy Policy"),
      document.createTextNode(".")
    );
    out.append(footDagger);
    const termsRich = div(para(TERMS2));
    const HEADING2 = "Program Terms, Conditions, and Eligibility Criteria";
    out.append(table([
      ["Accordion"],
      [HEADING2],
      ["Expand All"],
      ["Collapse All"],
      ["plus"],
      ["minus"],
      ["plus"],
      ["minus"],
      [""],
      [""],
      [""],
      [""],
      [""],
      [""],
      [""],
      ["id:"],
      ["lang:none"],
      [HEADING2, termsRich, "accordion-item", "", "", "", "", ""]
    ]));
    out.append(hr());
    out.append(para("Financial Support"));
    const finHeading = document.createElement("h2");
    finHeading.id = "financialsupport";
    finHeading.textContent = "What Financial Help Is Available?";
    out.append(finHeading);
    out.append(para("The list price, also known as the Wholesale Acquisition Cost (WAC),\u2021 for LINZESS\xAE is $282.48 a month (as of January 2026). The WAC may not reflect the price paid by patients."));
    out.append(para("<strong>Insurance Information\xA7</strong>"));
    const uninsured = div();
    uninsured.append(
      document.createTextNode("If you are having difficulty paying for your medicine, AbbVie may be able to help. Visit "),
      anchor("https://abbvie.com/myabbvieassist", "AbbVie.com/PatientAccessSupport"),
      document.createTextNode(" to learn more.")
    );
    out.append(table([
      ["Table (insurance-table)"],
      ["table-2-columns"],
      ["table-col-2", "If You Have:", "You Could Pay:"],
      ["table-col-2", "Commercial Insurance (Usually provided by an employer)", "Depending on your plan, your monthly copay for LINZESS may vary. Eligible patients may pay as little as $30 for a 30-day or 90-day prescription* with a LINZESS savings card. About 92% of LINZESS\xAE prescriptions have an out-of-pocket cost between $0\u2013$50 per month.|| This cost includes use of LINZESS savings cards."],
      ["table-col-2", "Medicaid", "About 100% of LINZESS prescriptions have an out-of-pocket cost between $0\u2013$10 per month depending on state plan."],
      ["table-col-2", "Medicare Part D", "About 93% of LINZESS prescriptions have an out-of-pocket cost between $0\u2013$50 per month||, depending on coverage phase. Out-of-pocket cost for LINZESS may vary depending on patient\u2019s other medication costs. Most Medicare patients have standard Part D prescription coverage, which has different costs depending on deductibles and coverage gaps."],
      ["table-col-2", "Medicare Low Income Subsidy (LIS)", "Most patients who qualify for Full Extra Help LIS pay $12.15 per month starting January 1, 2025."],
      ["table-col-2", "Other Insurance (VA, DOD, TRICARE, Others)", "The DOD represents active military and non active (retired) military members plus their families. Members can go to the MTF (Military Treatment Facility)/military base pharmacy or TRICARE (retail pharmacy), or Mail Order for prescription. LINZESS co-pays range from $0 to $43 depending on if you are active, non active (retired), or a family member and where you pick up your prescription. VA LINZESS co-pay is $11."],
      ["table-col-2", "Uninsured or if you cannot afford your medication", uninsured]
    ]));
    out.append(para("\u2021The price at which AbbVie\xAE sells its products to wholesalers."));
    out.append(para("\xA7Important details about understanding your individual costs: The chart above provides cost information based on what a person with the type of coverage listed may pay. Your type of health or prescription insurance plan will determine exactly how much you will pay. Information listed is accurate as of January 2022 and is based on publicly available benefit design information for Medicaid and Medicare Part D out-of-pocket costs for the 2022 plan year."));
    out.append(para("||IQVIA LAAD Dispensed TRx as of Jan 2025 to Dec 2025."));
    const box1 = div(
      para("<strong>Insurance Coverage Support</strong>"),
      para("To help you understand your coverage and what your out-of-pocket costs may be, it\u2019s important to verify your benefits. And even if your LINZESS isn\u2019t covered, there may be ways to save on your prescription. An Insurance Specialist can talk you through your coverage and help identify potential savings options\u2014regardless of your insurance coverage.")
    );
    const box2 = div(
      para("<strong>MyAbbvie Assist</strong>"),
      para("If you are having difficulty paying for your medicine, myAbbVie Assist may be able to help. myAbbVie Assist, our patient assistance program, provides AbbVie medicine to qualifying patients. It is intended for people that live in the United States, have limited or no health insurance coverage and demonstrate qualifying financial need.")
    );
    const box2Visit = document.createElement("p");
    box2Visit.append(document.createTextNode("Visit "), anchor("https://www.abbvie.com/patients/patient-support.html", "AbbVie.com/PatientAccessSupport"), document.createTextNode(" to learn more."));
    box2.append(box2Visit);
    out.append(table([
      ["Columns (financial-info-boxes)"],
      [box1],
      [box2]
    ]));
    const gutLeft = div(
      picture2(`${DAM5}/Resources-Doctor-Tout-Desktop.png`, { alt: "Actor Portrayal", width: 880, height: 647 }),
      picture2(`${DAM5}/Resources-Doctor-Tout-Mobile.png`, { alt: "Actor Portrayal" })
    );
    const gutRight = div(
      para("<strong>Ready to Talk to Your Doctor?</strong>"),
      para("Prepare for your visit by taking the Gut Check Quiz and create your own discussion guide. You\u2019ll be ready to better describe your symptoms at your next doctor\u2019s appointment.")
    );
    const gutCta = document.createElement("p");
    gutCta.append(anchor("/find-relief/gutcheck", "Start My Discussion Guide"));
    gutRight.append(gutCta);
    out.append(table([
      ["Columns (columns-resources-gutcheck)"],
      [gutLeft],
      [gutRight]
    ]));
    out.append(hr());
    const exploreCards = [
      { href: "/find-relief/gutcheck", title: "Check My Symptoms", cta: "Learn More" },
      { href: "/why-linzess", title: "Why LINZESS?", cta: "Learn More" }
    ];
    const exploreCells = [["Cards Grid (cards-grid-icon-image-card, savings-explore)"]];
    exploreCards.forEach((c) => {
      const t = document.createElement("p");
      t.textContent = c.title;
      const cta = document.createElement("p");
      cta.textContent = c.cta;
      exploreCells.push([div(anchor(c.href, c.href)), "", t, "", cta, ""]);
    });
    out.append(table(exploreCells));
    out.append(hr());
    const isi = div();
    isi.innerHTML = `
    <h3>USES</h3>
    <p>${USES_FULL2}</p>
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
    sbCell1.innerHTML = `<p></p>
<h3>USES</h3>
<p>${USES_FULL2}</p>`;
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
<p>${USES_FULL2}</p>
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
      ["Safety Bar (split)"],
      [sbCell1],
      [sbCell2],
      [sbCell3],
      ["id:"],
      [""]
    ]));
    element.replaceChildren(...out.childNodes);
  }

  // tools/importer/parsers/helpers.js
  function picture(document, src, opts = {}) {
    const pic = document.createElement("picture");
    const img = document.createElement("img");
    img.setAttribute("src", src);
    if (opts.alt) img.setAttribute("alt", opts.alt);
    if (opts.width) img.setAttribute("width", String(opts.width));
    if (opts.height) img.setAttribute("height", String(opts.height));
    pic.append(img);
    return pic;
  }
  function p(document, html) {
    const el = document.createElement("p");
    el.innerHTML = html;
    return el;
  }
  function link(document, href, text) {
    const a = document.createElement("a");
    a.setAttribute("href", href);
    a.textContent = text;
    return a;
  }
  function cell(document, nodes) {
    const div = document.createElement("div");
    nodes.forEach((n) => {
      if (typeof n === "string") {
        const para = document.createElement("p");
        para.innerHTML = n;
        div.append(para);
      } else {
        div.append(n);
      }
    });
    return div;
  }

  // tools/importer/parsers/hero.js
  var DAM = "/content/dam/abbvie-eds-poc/linzess/images";
  function parse2(element, { document }) {
    const desktop = picture(document, `${DAM}/savings-hero-desktop.jpg`);
    const mobile = picture(document, `${DAM}/savings-hero-mobile.jpg`);
    const richtext = document.createElement("div");
    const emptyP = document.createElement("p");
    const h1 = document.createElement("h1");
    h1.textContent = "See If You're Eligible To Save on LINZESS";
    richtext.append(emptyP, h1);
    const cells = [
      ["Hero (no-padding, text-left, linzess-behind-nav-linzess-editorial-hero)"],
      [desktop],
      [mobile],
      [""],
      ["Savings & Support"],
      [""],
      [richtext],
      [""],
      [""]
    ];
    const table = WebImporter.DOMUtils.createTable(cells, document);
    element.replaceWith(table);
  }

  // tools/importer/parsers/section-nav.js
  function parse3(element, { document }) {
    const items = [
      { label: "Savings", anchor: "#savings" },
      { label: "Financial Support", anchor: "#financialsupport" }
    ];
    const cells = [
      ["Section Nav (sticky, mobile-menu)"],
      ["-"]
    ];
    items.forEach(({ label, anchor }) => {
      cells.push([label, link(document, anchor, anchor)]);
    });
    const table = WebImporter.DOMUtils.createTable(cells, document);
    element.replaceWith(table);
  }

  // tools/importer/parsers/savings-promo.js
  var DAM2 = "/content/dam/abbvie-eds-poc/linzess/images";
  function parse4(element, { document }) {
    const left = cell(document, [
      picture(document, `${DAM2}/SavingsCard-Tout-Asterisk_Desktop.png`, {
        alt: "You may be eligible to get 90 days for 30 dollars",
        width: 880,
        height: 599
      }),
      picture(document, `${DAM2}/SavingsCard-Tout-Asterisk_Mobile.png`, {
        alt: "You may be eligible to get 90 days for 30 dollars"
      })
    ]);
    const right = document.createElement("div");
    right.append(
      p(document, "Whether you start with a 90-day or 30-day prescription, you could be eligible to pay as little as $30* with the LINZESS Savings Program."),
      p(document, "Talk to a doctor about a 90-day prescription to potentially maximize your savings and minimize trips to the pharmacy.")
    );
    const signUp = document.createElement("p");
    signUp.append(link(document, "/savings-card", "Sign Up Now"));
    right.append(signUp);
    const activate = document.createElement("p");
    activate.append(
      document.createTextNode("Already have a savings card? "),
      link(document, "/savings-card", "Activate now"),
      document.createTextNode(".")
    );
    right.append(activate);
    const cells = [
      ["Columns (columns-resources-savings)"],
      [left, right]
    ];
    const table = WebImporter.DOMUtils.createTable(cells, document);
    element.replaceWith(table);
  }

  // tools/importer/parsers/cards-grid-signup.js
  var DAM3 = "/content/dam/abbvie-eds-poc/linzess/images";
  function parse5(element, { document }) {
    const cards = [
      {
        href: "sms:59257",
        icon: `${DAM3}/icon-text-msg.svg`,
        title: "Text",
        body: "Text \u201CLINZESS\u201D to 59257 to sign up and add your card to your phone.\u2020",
        cta: "Text to Sign Up"
      },
      {
        href: "tel:1-855-859-5614",
        icon: `${DAM3}/icon-daily-reminders.svg`,
        title: "Call",
        body: "Call 1-855-859-5614 and we\u2019ll help you sign up and mail out your card.",
        cta: "Call to Sign Up"
      },
      {
        href: "/savings-card",
        icon: `${DAM3}/icon-web-click.svg`,
        title: "Click",
        body: "Click to sign up online and download your card.",
        cta: "Sign Up Online"
      }
    ];
    const cells = [["Cards Grid (cards-grid-icon-image-card, savings-signup)"]];
    cards.forEach((card) => {
      const linkCell = document.createElement("div");
      linkCell.append(link(document, card.href, card.href));
      const titleP = document.createElement("p");
      titleP.textContent = card.title;
      const bodyP = document.createElement("p");
      bodyP.innerHTML = card.body;
      const ctaP = document.createElement("p");
      ctaP.textContent = card.cta;
      cells.push([
        linkCell,
        picture(document, card.icon),
        titleP,
        bodyP,
        ctaP,
        ""
      ]);
    });
    const table = WebImporter.DOMUtils.createTable(cells, document);
    element.replaceWith(table);
  }

  // tools/importer/parsers/accordion.js
  var TERMS = "This offer is valid only for patients with commercial prescription insurance coverage, who are 6 years of age or older and meet eligibility criteria and is good for use only with a valid prescription for LINZESS\xAE (linaclotide) capsules 72 mcg, 145 mcg, or 290 mcg at the time the prescription is filled by the pharmacist and dispensed to the patient. This offer is not valid for use by patients enrolled in Medicare, Medicaid, or other federal or state programs (including any state pharmaceutical assistance programs, TRICARE, Department of Defense or Veterans Affairs programs), or private indemnity or HMO insurance plans that reimburse you for the entire cost of your prescription drugs or where prohibited by law or by the patient\u2019s health insurance provider. If at any time a patient begins receiving prescription drug coverage under any such federal, state, or government-funded healthcare program, patient will no longer be eligible to use the LINZESS savings card. Patients may not use this card if they are Medicare-eligible and enrolled in an employer-sponsored health plan or prescription drug benefit program for retirees. This offer is not valid for cash-paying patients. Offer good only in the USA, including Puerto Rico, at participating retail pharmacies. Patients residing in or receiving treatment in certain states may not be eligible to participate in this program. Depending on your insurance coverage, eligible patients may pay as little as $30 per 30, 60, or 90-day supply for each of up to twelve (12) prescription fills per calendar year. One 60-day supply counts as two (2) fills and one 90-day supply counts as three (3) fills of the total twelve (12) fills. AbbVie reserves the right to rescind, revoke, or amend this offer without notice. Void if prohibited by law, taxed, or restricted. Patients may not seek reimbursement for value received under the LINZESS Savings Program from any third-party payers. This offer is not transferable. The selling, purchasing, trading, or counterfeiting of this card is prohibited by law. This offer has no cash value and may not be used in combination with any other discount, coupon, rebate, free trial, or similar offer for the specified prescription. Subject to all other terms and conditions, the maximum annual benefit that may be available solely for the patient\u2019s benefit under the co-pay assistance program is $2,280.00 per calendar year. The actual application and use of the benefit available under the co-pay assistance program may vary on a monthly, quarterly, and/or annual basis depending on each individual patient\u2019s plan of insurance and other prescription drug costs. This offer is not health insurance. By redeeming this offer, you acknowledge that you are an eligible patient and that you understand and agree to comply with the terms and conditions of this offer. To learn about AbbVie\u2019s privacy practices and your privacy choices, visit https://abbv.ie/corpprivacy.";
  var HEADING = "Program Terms, Conditions, and Eligibility Criteria";
  function parse6(element, { document }) {
    const termsRich = document.createElement("div");
    const termsP = document.createElement("p");
    termsP.textContent = TERMS;
    termsRich.append(termsP);
    const cells = [
      ["Accordion"],
      [HEADING],
      ["Expand All"],
      ["Collapse All"],
      ["plus"],
      ["minus"],
      ["plus"],
      ["minus"],
      [""],
      [""],
      [""],
      [""],
      [""],
      [""],
      [""],
      ["id:"],
      ["lang:none"],
      [HEADING, termsRich, "accordion-item", "", "", "", "", ""]
    ];
    const table = WebImporter.DOMUtils.createTable(cells, document);
    element.replaceWith(table);
  }

  // tools/importer/parsers/insurance-table.js
  function parse7(element, { document }) {
    const uninsured = document.createElement("div");
    uninsured.append(
      document.createTextNode("If you are having difficulty paying for your medicine, AbbVie may be able to help. Visit "),
      link(document, "https://abbvie.com/myabbvieassist", "AbbVie.com/PatientAccessSupport"),
      document.createTextNode(" to learn more.")
    );
    const rows = [
      ["Commercial Insurance (Usually provided by an employer)", "Depending on your plan, your monthly copay for LINZESS may vary. Eligible patients may pay as little as $30 for a 30-day or 90-day prescription* with a LINZESS savings card. About 92% of LINZESS\xAE prescriptions have an out-of-pocket cost between $0\u2013$50 per month.|| This cost includes use of LINZESS savings cards."],
      ["Medicaid", "About 100% of LINZESS prescriptions have an out-of-pocket cost between $0\u2013$10 per month depending on state plan."],
      ["Medicare Part D", "About 93% of LINZESS prescriptions have an out-of-pocket cost between $0\u2013$50 per month||, depending on coverage phase. Out-of-pocket cost for LINZESS may vary depending on patient\u2019s other medication costs. Most Medicare patients have standard Part D prescription coverage, which has different costs depending on deductibles and coverage gaps."],
      ["Medicare Low Income Subsidy (LIS)", "Most patients who qualify for Full Extra Help LIS pay $12.15 per month starting January 1, 2025."],
      ["Other Insurance (VA, DOD, TRICARE, Others)", "The DOD represents active military and non active (retired) military members plus their families. Members can go to the MTF (Military Treatment Facility)/military base pharmacy or TRICARE (retail pharmacy), or Mail Order for prescription. LINZESS co-pays range from $0 to $43 depending on if you are active, non active (retired), or a family member and where you pick up your prescription. VA LINZESS co-pay is $11."]
    ];
    const cells = [
      ["Table (insurance-table)"],
      ["If You Have:", "You Could Pay:"]
    ];
    rows.forEach(([a, b]) => cells.push([a, b]));
    cells.push(["Uninsured or if you cannot afford your medication", uninsured]);
    const table = WebImporter.DOMUtils.createTable(cells, document);
    element.replaceWith(table);
  }

  // tools/importer/parsers/financial-info-boxes.js
  function parse8(element, { document }) {
    const box1 = document.createElement("div");
    box1.append(
      p(document, "<strong>Insurance Coverage Support</strong>"),
      p(document, "To help you understand your coverage and what your out-of-pocket costs may be, it\u2019s important to verify your benefits. And even if your LINZESS isn\u2019t covered, there may be ways to save on your prescription. An Insurance Specialist can talk you through your coverage and help identify potential savings options\u2014regardless of your insurance coverage.")
    );
    const box2 = document.createElement("div");
    box2.append(
      p(document, "<strong>MyAbbvie Assist</strong>"),
      p(document, "If you are having difficulty paying for your medicine, myAbbVie Assist may be able to help. myAbbVie Assist, our patient assistance program, provides AbbVie medicine to qualifying patients. It is intended for people that live in the United States, have limited or no health insurance coverage and demonstrate qualifying financial need.")
    );
    const visit = document.createElement("p");
    visit.append(
      document.createTextNode("Visit "),
      link(document, "https://www.abbvie.com/patients/patient-support.html", "AbbVie.com/PatientAccessSupport"),
      document.createTextNode(" to learn more.")
    );
    box2.append(visit);
    const cells = [
      ["Columns (financial-info-boxes)"],
      [box1, box2]
    ];
    const table = WebImporter.DOMUtils.createTable(cells, document);
    element.replaceWith(table);
  }

  // tools/importer/parsers/gut-check.js
  var DAM4 = "/content/dam/abbvie-eds-poc/linzess/images";
  function parse9(element, { document }) {
    const left = cell(document, [
      picture(document, `${DAM4}/Resources-Doctor-Tout-Desktop.png`, {
        alt: "Actor Portrayal",
        width: 880,
        height: 647
      }),
      picture(document, `${DAM4}/Resources-Doctor-Tout-Mobile.png`, {
        alt: "Actor Portrayal"
      })
    ]);
    const right = document.createElement("div");
    right.append(
      p(document, "<strong>Ready to Talk to Your Doctor?</strong>"),
      p(document, "Prepare for your visit by taking the Gut Check Quiz and create your own discussion guide. You\u2019ll be ready to better describe your symptoms at your next doctor\u2019s appointment.")
    );
    const cta = document.createElement("p");
    cta.append(link(document, "/find-relief/gutcheck", "Start My Discussion Guide"));
    right.append(cta);
    const cells = [
      ["Columns (columns-resources-gutcheck)"],
      [left, right]
    ];
    const table = WebImporter.DOMUtils.createTable(cells, document);
    element.replaceWith(table);
  }

  // tools/importer/parsers/cards-grid-explore.js
  function parse10(element, { document }) {
    const cards = [
      { href: "/find-relief/gutcheck", title: "Check My Symptoms", cta: "Learn More" },
      { href: "/why-linzess", title: "Why LINZESS?", cta: "Learn More" }
    ];
    const cells = [["Cards Grid (cards-grid-icon-image-card, savings-explore)"]];
    cards.forEach((card) => {
      const linkCell = document.createElement("div");
      linkCell.append(link(document, card.href, card.href));
      const titleP = document.createElement("p");
      titleP.textContent = card.title;
      const ctaP = document.createElement("p");
      ctaP.textContent = card.cta;
      cells.push([linkCell, "", titleP, "", ctaP, ""]);
    });
    const table = WebImporter.DOMUtils.createTable(cells, document);
    element.replaceWith(table);
  }

  // tools/importer/parsers/isi-safety-bar.js
  var USES_FULL = "LINZESS\xAE (linaclotide) is a prescription medication used to treat irritable bowel syndrome with constipation (IBS-C) in adults and in children and adolescents 7 years of age and older, chronic idiopathic constipation (CIC) in adults, and functional constipation (FC) in children and adolescents 6 years of age and older. \u201CIdiopathic\u201D means the cause of the constipation is unknown. <strong>It is not known if LINZESS is safe and effective in children with functional constipation less than 6 years of age or in children with IBS-C less than 7 years of age.</strong>";
  function isiDefaultContent(document) {
    const frag = document.createElement("div");
    frag.innerHTML = `
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
    return frag;
  }
  function safetyBarCell1(document) {
    const div = document.createElement("div");
    div.innerHTML = `<p></p>
<h3>USES</h3>
<p>${USES_FULL}</p>`;
    return div;
  }
  function safetyBarCell2(document) {
    const div = document.createElement("div");
    div.innerHTML = `<p></p>
<h3>IMPORTANT RISK INFORMATION</h3>
<p></p>
<ul>
 <li><strong>Do not give LINZESS to children who are less than 2 years of age. It may harm them.</strong> LINZESS can cause severe diarrhea and your child could get severe dehydration (loss of a large amount of body water and salt).</li>
 <li>Do not take LINZESS if a doctor has told you that you have a bowel blockage (intestinal obstruction).</li>
</ul>
<p><strong>Before you take LINZESS, tell your doctor about your medical conditions, including if you are:</strong></p>`;
    return div;
  }
  function safetyBarCell3(document) {
    const div = document.createElement("div");
    div.innerHTML = `<p></p>
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
    return div;
  }
  function parse11(element, { document }) {
    const isi = isiDefaultContent(document);
    const cells = [
      ["Safety Bar (split)"],
      [safetyBarCell1(document)],
      [safetyBarCell2(document)],
      [safetyBarCell3(document)],
      ["id:"],
      [""]
    ];
    const safetyTable = WebImporter.DOMUtils.createTable(cells, document);
    const wrapper = document.createElement("div");
    wrapper.append(isi, document.createElement("hr"), safetyTable);
    element.replaceWith(wrapper);
  }

  // tools/importer/transformers/cleanup.js
  function transform(hookName, element, payload) {
    const { document } = payload;
    if (hookName === "beforeTransform") {
      WebImporter.DOMUtils.remove(element, [
        "header",
        "footer",
        "nav",
        ".header",
        ".footer",
        ".navigation",
        "script",
        "style",
        "noscript",
        'link[rel="stylesheet"]',
        "iframe",
        // cookie / consent
        "#onetrust-consent-sdk",
        "#onetrust-banner-sdk",
        ".onetrust-pc-dark-filter",
        ".ot-sdk-container",
        // modals / overlays
        ".modal.parbase",
        ".modal",
        ".overlay",
        // brand chrome / floating bars / save-on-linzess top bar
        ".brand-explorer",
        ".save-on-linzess",
        ".isi-tray",
        ".floating-isi",
        ".sticky-isi",
        ".safety-bar-floating"
      ]);
      return;
    }
    if (hookName === "afterTransform") {
      element.querySelectorAll("[style]").forEach((el) => el.removeAttribute("style"));
      element.querySelectorAll("[class]").forEach((el) => {
        if (el.tagName === "TABLE" || el.closest("table")) return;
      });
    }
  }

  // tools/importer/transformers/sections.js
  function transform2(hookName, element, payload) {
    if (hookName !== "afterTransform") return;
    const hrs = [...element.querySelectorAll(":scope > hr")];
    hrs.forEach((hr) => {
      let next = hr.nextElementSibling;
      while (next && next.tagName === "HR") {
        const toRemove = next;
        next = next.nextElementSibling;
        toRemove.remove();
      }
    });
    const first = element.firstElementChild;
    if (first && first.tagName === "HR") first.remove();
    const last = element.lastElementChild;
    if (last && last.tagName === "HR") last.remove();
  }

  // tools/importer/import-linzess-savings-support.js
  var parsers = {
    "savings-page": parse,
    hero: parse2,
    "section-nav": parse3,
    "savings-promo": parse4,
    "cards-grid-signup": parse5,
    accordion: parse6,
    "insurance-table": parse7,
    "financial-info-boxes": parse8,
    "gut-check": parse9,
    "cards-grid-explore": parse10,
    "isi-safety-bar": parse11
  };
  var PAGE_TEMPLATE = {
    name: "linzess-savings-support",
    description: "LINZESS Savings & Support page (single page migration).",
    urls: [
      "https://www.linzess.com/savings-and-support"
    ],
    blocks: [
      {
        name: "savings-page",
        // No <main> on the live page; `body` is the single deterministic anchor.
        instances: ["body"]
      }
    ],
    sections: [
      { id: "hero", name: "Hero", style: "" },
      { id: "section-nav", name: "Section Nav", style: "" },
      { id: "savings", name: "Savings", style: "" },
      { id: "financial-support", name: "Financial Support", style: "" },
      { id: "explore", name: "Explore", style: "background-dark-purple background-dark-purple-arc" },
      { id: "isi", name: "ISI", style: "" },
      { id: "safety-bar", name: "Safety Bar", style: "" }
    ]
  };
  var transformers = [
    transform,
    ...PAGE_TEMPLATE.sections && PAGE_TEMPLATE.sections.length > 1 ? [transform2] : []
  ];
  function executeTransformers(hookName, element, payload) {
    const enhancedPayload = __spreadProps(__spreadValues({}, payload), { template: PAGE_TEMPLATE });
    transformers.forEach((transformerFn) => {
      try {
        transformerFn.call(null, hookName, element, enhancedPayload);
      } catch (e) {
        console.error(`Transformer failed at ${hookName}:`, e);
      }
    });
  }
  function findBlocksOnPage(document, template) {
    const pageBlocks = [];
    template.blocks.forEach((blockDef) => {
      blockDef.instances.forEach((selector) => {
        const elements = document.querySelectorAll(selector);
        if (elements.length === 0) {
          console.warn(`Block "${blockDef.name}" selector not found: ${selector}`);
        }
        elements.forEach((element) => {
          pageBlocks.push({
            name: blockDef.name,
            selector,
            element,
            section: blockDef.section || null
          });
        });
      });
    });
    console.log(`Found ${pageBlocks.length} block instances on page`);
    return pageBlocks;
  }
  function appendMetadata(main, document) {
    const meta = {};
    const title = document.querySelector("title");
    if (title) meta.Title = title.textContent.replace(/[\n\t]/gm, "").trim();
    const desc = document.querySelector('[property="og:description"], [name="description"]');
    if (desc) meta.Description = desc.getAttribute("content") || "";
    const cells = [
      ["Metadata"],
      ["brand", "linzess"],
      ["nav", "/linzess/nav"],
      ["footer", "/linzess/footer"]
    ];
    if (meta.Title) cells.push(["Title", meta.Title]);
    if (meta.Description) cells.push(["Description", meta.Description]);
    const block = WebImporter.DOMUtils.createTable(cells, document);
    const section = document.createElement("div");
    section.append(block);
    main.append(section);
  }
  var import_linzess_savings_support_default = {
    transform: (payload) => {
      const { document, url, params } = payload;
      const main = document.body;
      executeTransformers("beforeTransform", main, payload);
      const pageBlocks = findBlocksOnPage(document, PAGE_TEMPLATE);
      pageBlocks.forEach((block) => {
        if (!block.element.parentNode && block.element !== document.body) return;
        const parser = parsers[block.name];
        if (parser) {
          try {
            parser(block.element, { document, url, params });
          } catch (e) {
            console.error(`Failed to parse ${block.name} (${block.selector}):`, e);
          }
        } else {
          console.warn(`No parser found for block: ${block.name}`);
        }
      });
      executeTransformers("afterTransform", main, payload);
      const hr = document.createElement("hr");
      main.appendChild(hr);
      appendMetadata(main, document);
      WebImporter.rules.transformBackgroundImages(main, document);
      WebImporter.rules.adjustImageUrls(main, url, params.originalURL);
      const sourcePath = new URL(params.originalURL).pathname.replace(/\/$/, "").replace(/\.html$/, "");
      const path = WebImporter.FileUtils.sanitizePath(`/linzess${sourcePath}`);
      return [{
        element: main,
        path,
        report: {
          title: document.title,
          template: PAGE_TEMPLATE.name,
          blocks: pageBlocks.map((b) => b.name)
        }
      }];
    }
  };
  return __toCommonJS(import_linzess_savings_support_exports);
})();
