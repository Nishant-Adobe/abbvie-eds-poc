/* eslint-disable */
/* global WebImporter */

import { link } from './helpers.js';

/**
 * Insurance table parser (base `table` block, variant `insurance-table`).
 *
 * The base table block (blocks/table/table.js) maps each block row -> <tr> and
 * each cell -> <td> (first row becomes <th> with scope). So the createTable rows
 * (after the block-name row) are: header row + 6 data rows, 2 cells each.
 *
 * Verbatim copy from analysis.md. Unicode literals used for ® || – $ (NO <sup>).
 *
 * Block name: "Table (insurance-table)"
 *
 * @param {Element} element
 * @param {Object} ctx { document }
 */
export default function parse(element, { document }) {
  const uninsured = document.createElement('div');
  uninsured.append(
    document.createTextNode('If you are having difficulty paying for your medicine, AbbVie may be able to help. Visit '),
    link(document, 'https://abbvie.com/myabbvieassist', 'AbbVie.com/PatientAccessSupport'),
    document.createTextNode(' to learn more.'),
  );

  const rows = [
    ['Commercial Insurance (Usually provided by an employer)', 'Depending on your plan, your monthly copay for LINZESS may vary. Eligible patients may pay as little as $30 for a 30-day or 90-day prescription* with a LINZESS savings card. About 92% of LINZESS® prescriptions have an out-of-pocket cost between $0–$50 per month.|| This cost includes use of LINZESS savings cards.'],
    ['Medicaid', 'About 100% of LINZESS prescriptions have an out-of-pocket cost between $0–$10 per month depending on state plan.'],
    ['Medicare Part D', 'About 93% of LINZESS prescriptions have an out-of-pocket cost between $0–$50 per month||, depending on coverage phase. Out-of-pocket cost for LINZESS may vary depending on patient’s other medication costs. Most Medicare patients have standard Part D prescription coverage, which has different costs depending on deductibles and coverage gaps.'],
    ['Medicare Low Income Subsidy (LIS)', 'Most patients who qualify for Full Extra Help LIS pay $12.15 per month starting January 1, 2025.'],
    ['Other Insurance (VA, DOD, TRICARE, Others)', 'The DOD represents active military and non active (retired) military members plus their families. Members can go to the MTF (Military Treatment Facility)/military base pharmacy or TRICARE (retail pharmacy), or Mail Order for prescription. LINZESS co-pays range from $0 to $43 depending on if you are active, non active (retired), or a family member and where you pick up your prescription. VA LINZESS co-pay is $11.'],
  ];

  const cells = [
    ['Table (insurance-table)'],
    ['If You Have:', 'You Could Pay:'],
  ];
  rows.forEach(([a, b]) => cells.push([a, b]));
  cells.push(['Uninsured or if you cannot afford your medication', uninsured]);

  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
