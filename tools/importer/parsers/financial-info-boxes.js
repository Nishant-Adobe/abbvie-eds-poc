/* eslint-disable */
/* global WebImporter */

import { p, link } from './helpers.js';

/**
 * Financial info boxes parser (2-up columns, variant `financial-info-boxes`).
 *
 * Modeled on the base columns block 2-cell row shape (one cell per box).
 * Each box: heading paragraph (<strong>) + body paragraph(s). Brand CSS styles
 * the dark-purple / light-purple boxes.
 *
 * Block name: "Columns (financial-info-boxes)"
 *
 * @param {Element} element
 * @param {Object} ctx { document }
 */
export default function parse(element, { document }) {
  const box1 = document.createElement('div');
  box1.append(
    p(document, '<strong>Insurance Coverage Support</strong>'),
    p(document, 'To help you understand your coverage and what your out-of-pocket costs may be, it’s important to verify your benefits. And even if your LINZESS isn’t covered, there may be ways to save on your prescription. An Insurance Specialist can talk you through your coverage and help identify potential savings options—regardless of your insurance coverage.'),
  );

  const box2 = document.createElement('div');
  box2.append(
    p(document, '<strong>MyAbbvie Assist</strong>'),
    p(document, 'If you are having difficulty paying for your medicine, myAbbVie Assist may be able to help. myAbbVie Assist, our patient assistance program, provides AbbVie medicine to qualifying patients. It is intended for people that live in the United States, have limited or no health insurance coverage and demonstrate qualifying financial need.'),
  );
  const visit = document.createElement('p');
  visit.append(
    document.createTextNode('Visit '),
    link(document, 'https://www.abbvie.com/patients/patient-support.html', 'AbbVie.com/PatientAccessSupport'),
    document.createTextNode(' to learn more.'),
  );
  box2.append(visit);

  const cells = [
    ['Columns (financial-info-boxes)'],
    [box1, box2],
  ];

  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
