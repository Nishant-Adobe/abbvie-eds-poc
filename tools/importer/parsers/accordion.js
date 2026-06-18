/* eslint-disable */
/* global WebImporter */

const TERMS = 'This offer is valid only for patients with commercial prescription insurance coverage, who are 6 years of age or older and meet eligibility criteria and is good for use only with a valid prescription for LINZESS® (linaclotide) capsules 72 mcg, 145 mcg, or 290 mcg at the time the prescription is filled by the pharmacist and dispensed to the patient. This offer is not valid for use by patients enrolled in Medicare, Medicaid, or other federal or state programs (including any state pharmaceutical assistance programs, TRICARE, Department of Defense or Veterans Affairs programs), or private indemnity or HMO insurance plans that reimburse you for the entire cost of your prescription drugs or where prohibited by law or by the patient’s health insurance provider. If at any time a patient begins receiving prescription drug coverage under any such federal, state, or government-funded healthcare program, patient will no longer be eligible to use the LINZESS savings card. Patients may not use this card if they are Medicare-eligible and enrolled in an employer-sponsored health plan or prescription drug benefit program for retirees. This offer is not valid for cash-paying patients. Offer good only in the USA, including Puerto Rico, at participating retail pharmacies. Patients residing in or receiving treatment in certain states may not be eligible to participate in this program. Depending on your insurance coverage, eligible patients may pay as little as $30 per 30, 60, or 90-day supply for each of up to twelve (12) prescription fills per calendar year. One 60-day supply counts as two (2) fills and one 90-day supply counts as three (3) fills of the total twelve (12) fills. AbbVie reserves the right to rescind, revoke, or amend this offer without notice. Void if prohibited by law, taxed, or restricted. Patients may not seek reimbursement for value received under the LINZESS Savings Program from any third-party payers. This offer is not transferable. The selling, purchasing, trading, or counterfeiting of this card is prohibited by law. This offer has no cash value and may not be used in combination with any other discount, coupon, rebate, free trial, or similar offer for the specified prescription. Subject to all other terms and conditions, the maximum annual benefit that may be available solely for the patient’s benefit under the co-pay assistance program is $2,280.00 per calendar year. The actual application and use of the benefit available under the co-pay assistance program may vary on a monthly, quarterly, and/or annual basis depending on each individual patient’s plan of insurance and other prescription drug costs. This offer is not health insurance. By redeeming this offer, you acknowledge that you are an eligible patient and that you understand and agree to comply with the terms and conditions of this offer. To learn about AbbVie’s privacy practices and your privacy choices, visit https://abbv.ie/corpprivacy.';

const HEADING = 'Program Terms, Conditions, and Eligibility Criteria';

/**
 * Accordion parser (Program Terms).
 *
 * Modeled EXACTLY on the working gold-standard content/rinvoq-hcp/accordion-test.plain.html
 * which produces 16 parent config rows + accordion-item rows (8 cells each):
 *   [0]  blockHeading
 *   [1]  expandAll label
 *   [2]  collapseAll label
 *   [3]  expandAll icon (plus)
 *   [4]  collapseAll icon (minus)
 *   [5]  expand icon (plus)
 *   [6]  collapse icon (minus)
 *   [7]  expandAllIconImage (empty)
 *   [8]  collapseAllIconImage (empty)
 *   [9]  expandIconImage (empty)
 *   [10] collapseIconImage (empty)
 *   [11] ariaExpandAllLabel (empty)
 *   [12] ariaCollapseAllLabel (empty)
 *   [13] analyticsId (empty)
 *   [14] id:
 *   [15] lang:none
 *   item rows: [summary, text(richtext), "accordion-item", '', '', '', '', '']
 *
 * Block name: "Accordion"
 *
 * @param {Element} element
 * @param {Object} ctx { document }
 */
export default function parse(element, { document }) {
  const termsRich = document.createElement('div');
  const termsP = document.createElement('p');
  termsP.textContent = TERMS;
  termsRich.append(termsP);

  const cells = [
    ['Accordion'],
    [HEADING],
    ['Expand All'],
    ['Collapse All'],
    ['plus'],
    ['minus'],
    ['plus'],
    ['minus'],
    [''],
    [''],
    [''],
    [''],
    [''],
    [''],
    [''],
    ['id:'],
    ['lang:none'],
    [HEADING, termsRich, 'accordion-item', '', '', '', '', ''],
  ];

  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
