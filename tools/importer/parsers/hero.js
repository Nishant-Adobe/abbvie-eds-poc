/* eslint-disable */
/* global WebImporter */

import { picture } from './helpers.js';

const DAM = '/content/dam/abbvie-eds-poc/linzess/images';

/**
 * Hero parser.
 *
 * Produces the linzess editorial hero block. Cell order is modeled EXACTLY on
 * content/linzess/why-linzess/index.plain.html:
 *   [0] desktop image
 *   [1] mobile image
 *   [2] (empty)
 *   [3] eyebrow text
 *   [4] (empty)
 *   [5] richtext with empty <p> + <h1>
 *   [6] (empty)
 *   [7] (empty)
 *
 * Block name: "Hero (no-padding, text-left, linzess-behind-nav-linzess-editorial-hero)"
 * -> renders as <div class="hero no-padding text-left linzess-behind-nav-linzess-editorial-hero">
 *
 * @param {Element} element The hero source element (replaced with the table).
 * @param {Object} ctx { document }
 */
export default function parse(element, { document }) {
  const desktop = picture(document, `${DAM}/savings-hero-desktop.jpg`);
  const mobile = picture(document, `${DAM}/savings-hero-mobile.jpg`);

  const richtext = document.createElement('div');
  const emptyP = document.createElement('p');
  const h1 = document.createElement('h1');
  h1.textContent = "See If You're Eligible To Save on LINZESS";
  richtext.append(emptyP, h1);

  const cells = [
    ['Hero (no-padding, text-left, linzess-behind-nav-linzess-editorial-hero)'],
    [desktop],
    [mobile],
    [''],
    ['Savings & Support'],
    [''],
    [richtext],
    [''],
    [''],
  ];

  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
