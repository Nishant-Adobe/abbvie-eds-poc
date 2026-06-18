/* eslint-disable */
/* global WebImporter */

import { picture, p, link, cell } from './helpers.js';

const DAM = '/content/dam/abbvie-eds-poc/linzess/images';

/**
 * Savings promo columns parser.
 *
 * Modeled on content/linzess/resources/index.plain.html
 * `<div class="columns columns-resources-savings">` (2-cell columns row):
 *   [left]  picture(s) — desktop (w880) + mobile
 *   [right] richtext: 2 paragraphs + CTA "Sign Up Now" + "Already have..." activate line
 *
 * Block name: "Columns (columns-resources-savings)"
 *
 * @param {Element} element
 * @param {Object} ctx { document }
 */
export default function parse(element, { document }) {
  const left = cell(document, [
    picture(document, `${DAM}/SavingsCard-Tout-Asterisk_Desktop.png`, {
      alt: 'You may be eligible to get 90 days for 30 dollars', width: 880, height: 599,
    }),
    picture(document, `${DAM}/SavingsCard-Tout-Asterisk_Mobile.png`, {
      alt: 'You may be eligible to get 90 days for 30 dollars',
    }),
  ]);

  const right = document.createElement('div');
  right.append(
    p(document, 'Whether you start with a 90-day or 30-day prescription, you could be eligible to pay as little as $30* with the LINZESS Savings Program.'),
    p(document, 'Talk to a doctor about a 90-day prescription to potentially maximize your savings and minimize trips to the pharmacy.'),
  );
  const signUp = document.createElement('p');
  signUp.append(link(document, '/savings-card', 'Sign Up Now'));
  right.append(signUp);
  const activate = document.createElement('p');
  activate.append(
    document.createTextNode('Already have a savings card? '),
    link(document, '/savings-card', 'Activate now'),
    document.createTextNode('.'),
  );
  right.append(activate);

  const cells = [
    ['Columns (columns-resources-savings)'],
    [left, right],
  ];

  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
