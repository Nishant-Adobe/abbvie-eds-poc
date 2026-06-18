/* eslint-disable */
/* global WebImporter */

import { picture, p, link, cell } from './helpers.js';

const DAM = '/content/dam/abbvie-eds-poc/linzess/images';

/**
 * Gut-check CTA columns parser.
 *
 * Modeled on content/linzess/resources/index.plain.html
 * `<div class="columns columns-resources-gutcheck">` (2-cell columns row):
 *   [left]  picture(s): desktop (w880) + mobile, alt "Actor Portrayal"
 *   [right] heading + body + CTA "Start My Discussion Guide"
 *
 * Block name: "Columns (columns-resources-gutcheck)"
 *
 * @param {Element} element
 * @param {Object} ctx { document }
 */
export default function parse(element, { document }) {
  const left = cell(document, [
    picture(document, `${DAM}/Resources-Doctor-Tout-Desktop.png`, {
      alt: 'Actor Portrayal', width: 880, height: 647,
    }),
    picture(document, `${DAM}/Resources-Doctor-Tout-Mobile.png`, {
      alt: 'Actor Portrayal',
    }),
  ]);

  const right = document.createElement('div');
  right.append(
    p(document, '<strong>Ready to Talk to Your Doctor?</strong>'),
    p(document, 'Prepare for your visit by taking the Gut Check Quiz and create your own discussion guide. You’ll be ready to better describe your symptoms at your next doctor’s appointment.'),
  );
  const cta = document.createElement('p');
  cta.append(link(document, '/find-relief/gutcheck', 'Start My Discussion Guide'));
  right.append(cta);

  const cells = [
    ['Columns (columns-resources-gutcheck)'],
    [left, right],
  ];

  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
