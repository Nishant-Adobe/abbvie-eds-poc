/* eslint-disable */
/* global WebImporter */

import { link } from './helpers.js';

/**
 * Section-nav parser.
 *
 * Modeled EXACTLY on content/linzess/resources/index.plain.html section-nav:
 *   [0] single cell "-"
 *   [n] label cell + link cell  (link text == href, e.g. "#savings")
 *
 * Block name: "Section Nav (sticky, mobile-menu)"
 * -> <div class="section-nav sticky mobile-menu">
 *
 * @param {Element} element
 * @param {Object} ctx { document }
 */
export default function parse(element, { document }) {
  const items = [
    { label: 'Savings', anchor: '#savings' },
    { label: 'Financial Support', anchor: '#financialsupport' },
  ];

  const cells = [
    ['Section Nav (sticky, mobile-menu)'],
    ['-'],
  ];

  items.forEach(({ label, anchor }) => {
    cells.push([label, link(document, anchor, anchor)]);
  });

  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
