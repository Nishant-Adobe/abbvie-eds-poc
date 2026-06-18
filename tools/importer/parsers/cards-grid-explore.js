/* eslint-disable */
/* global WebImporter */

import { link } from './helpers.js';

/**
 * Explore cards parser (2-up icon-image cards, no icon images).
 *
 * Modeled EXACTLY on content/linzess/resources/index.plain.html
 * `cards-grid cards-grid-icon-image-card resources-explore` (6 cells per card):
 *   [0] link (href) [1] (empty icon) [2] title [3] (empty body) [4] cta label [5] empty
 *
 * Block name: "Cards Grid (cards-grid-icon-image-card, savings-explore)"
 *
 * @param {Element} element
 * @param {Object} ctx { document }
 */
export default function parse(element, { document }) {
  const cards = [
    { href: '/find-relief/gutcheck', title: 'Check My Symptoms', cta: 'Learn More' },
    { href: '/why-linzess', title: 'Why LINZESS?', cta: 'Learn More' },
  ];

  const cells = [['Cards Grid (cards-grid-icon-image-card, savings-explore)']];

  cards.forEach((card) => {
    const linkCell = document.createElement('div');
    linkCell.append(link(document, card.href, card.href));

    const titleP = document.createElement('p');
    titleP.textContent = card.title;

    const ctaP = document.createElement('p');
    ctaP.textContent = card.cta;

    cells.push([linkCell, '', titleP, '', ctaP, '']);
  });

  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
