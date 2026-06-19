/* eslint-disable */
/* global WebImporter */

/**
 * Deterministic builder + SEO hardening for the Linzess savings-card "terms"
 * sub-page (Program Terms, Conditions, and Eligibility Criteria).
 *
 * The live page scrape for these standalone documents is unreliable (the lead
 * heading comes back as <p><strong>, the section class is lost, titles can be
 * error strings). So for the terms page we build the document deterministically
 * from the known-verbatim regulated copy instead of trusting the live DOM. This
 * also fixes the PageSpeed/Lighthouse SEO + a11y flags:
 *   - a single top-level <h1>
 *   - a meaningful <meta name="description">
 *
 * Other savings-card sub-pages (activate, savings) keep the generic path:
 * promote the lead heading to <h1> and append a curated Metadata block.
 *
 * The importer must NOT also call WebImporter.rules.createMetadata for these
 * pages, or a duplicate Metadata block results.
 */

const PER_PAGE_TITLE = {
  terms: 'Program Terms, Conditions, and Eligibility Criteria | LINZESS®',
  activate: 'Activate Your LINZESS® Savings Card | LINZESS®',
  savings: 'LINZESS® Savings Card | Save on Your Prescription',
};

// Verbatim regulated terms copy (kept byte-for-byte from the authored page).
const TERMS_HEADING = 'Program Terms, Conditions, and Eligibility Criteria';
const TERMS_BODY_HTML = '<p>This offer is valid only for patients with commercial prescription insurance coverage, who are 6 years of age or older and meet eligibility criteria and is good for use only with a valid prescription for LINZESS<sup>®</sup> (linaclotide) capsules 72 mcg, 145 mcg, or 290 mcg at the time the prescription is filled by the pharmacist and dispensed to the patient. This offer is not valid for use by patients enrolled in Medicare, Medicaid, or other federal or state programs (including any state pharmaceutical assistance programs, TRICARE, Department of Defense or Veterans Affairs programs), or private indemnity or HMO insurance plans that reimburse you for the entire cost of your prescription drugs or where prohibited by law or by the patient’s health insurance provider. If at any time a patient begins receiving prescription drug coverage under any such federal, state, or government-funded healthcare program, patient will no longer be eligible to use the LINZESS savings card. Patients may not use this card if they are Medicare-eligible and enrolled in an employer-sponsored health plan or prescription drug benefit program for retirees. This offer is not valid for cash-paying patients. Offer good only in the USA, including Puerto Rico, at participating retail pharmacies. Patients residing in or receiving treatment in certain states may not be eligible to participate in this program. Depending on your insurance coverage, eligible patients may pay as little as $30 per 30, 60, or 90-day supply for each of up to twelve (12) prescription fills per calendar year. One 60-day supply counts as two (2) fills and one 90-day supply counts as three (3) fills of the total twelve (12) fills. AbbVie reserves the right to rescind, revoke, or amend this offer without notice. Void if prohibited by law, taxed, or restricted. Patients may not seek reimbursement for value received under the LINZESS Savings Program from any third-party payers. This offer is not transferable. The selling, purchasing, trading, or counterfeiting of this card is prohibited by law. This offer has no cash value and may not be used in combination with any other discount, coupon, rebate, free trial, or similar offer for the specified prescription. Subject to all other terms and conditions, the maximum annual benefit that may be available solely for the patient’s benefit under the co-pay assistance program is $2,280.00 per calendar year. The actual application and use of the benefit available under the co-pay assistance program may vary on a monthly, quarterly, and/or annual basis depending on each individual patient’s plan of insurance and other prescription drug costs. This offer is not health insurance. <strong>By redeeming this offer, you acknowledge that you are an eligible patient and that you understand and agree to comply with the terms and conditions of this offer. To learn about AbbVie’s privacy practices and your privacy choices, visit <a href="https://abbv.ie/corpprivacy">https://abbv.ie/corpprivacy</a>.</strong></p>';
const TERMS_DESCRIPTION = 'LINZESS® (linaclotide) Savings Program terms, conditions, and eligibility criteria — who qualifies, savings limits, and how to use the LINZESS savings card.';

function frag(doc, html) {
  const tpl = doc.createElement('div');
  tpl.innerHTML = html;
  const f = doc.createDocumentFragment();
  while (tpl.firstChild) f.appendChild(tpl.firstChild);
  return f;
}

function slugFromUrl(payload) {
  const src = payload.params?.originalURL || payload.url || '';
  try {
    return new URL(src).pathname.replace(/\/$/, '').split('/').filter(Boolean).pop() || '';
  } catch (e) {
    return '';
  }
}

function appendMetadata(element, document, title, description) {
  const table = WebImporter.DOMUtils.createTable([
    ['Metadata'],
    ['brand', 'linzess'],
    ['title', title],
    ['description', description],
  ], document);
  element.append(table);
}

export default function transform(hookName, element, payload) {
  if (hookName !== 'afterTransform') return;

  const { document } = payload;
  const slug = slugFromUrl(payload);

  // --- Terms page: build deterministically (ignore the fragile live DOM) ---
  if (slug === 'terms') {
    element.textContent = '';

    const content = document.createElement('div');
    const h1 = document.createElement('h1');
    h1.textContent = TERMS_HEADING;
    content.append(h1);
    content.append(frag(document, TERMS_BODY_HTML));
    // Preserve the authored section style class.
    content.append(WebImporter.DOMUtils.createTable([
      ['Section Metadata'],
      ['classes_customClass', 'terms-content'],
    ], document));
    element.append(content);

    appendMetadata(element, document, PER_PAGE_TITLE.terms, TERMS_DESCRIPTION);
    return;
  }

  // --- Other sub-pages (activate, savings): generic SEO hardening ---
  if (!element.querySelector('h1')) {
    const lead = element.querySelector('h2, h3');
    if (lead) {
      const h1 = document.createElement('h1');
      h1.innerHTML = lead.innerHTML;
      lead.replaceWith(h1);
    }
  }

  const firstParagraph = [...element.querySelectorAll('p')]
    .map((p) => p.textContent.trim())
    .find((t) => t.length > 40);
  const title = PER_PAGE_TITLE[slug]
    || (document.title || '').trim()
    || element.querySelector('h1, h2, h3')?.textContent?.trim()
    || 'LINZESS® (linaclotide)';
  const description = (firstParagraph
    || `${title} — LINZESS® (linaclotide). Important Safety Information and full Prescribing Information.`)
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, 160);

  appendMetadata(element, document, title, description);
}
