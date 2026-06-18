/* eslint-disable */
/* global WebImporter */

import { picture, link } from './helpers.js';

const DAM = '/content/dam/abbvie-eds-poc/linzess/images';

/**
 * Sign-up method cards parser (3-up icon-image cards).
 *
 * The linzess cards-grid builder (blocks/cards-grid/linzess/cards-grid.js,
 * buildLinzessIconImageCardColumn) expects each card wrapper's direct child divs
 * in order: [0]=link(href) [1]=picture/icon [2]=title [3]=body [4]=cta label [5]=empty.
 * This matches the 6-cell row shape in the gold-standard
 * cards-grid-icon-image-card blocks (resources/why-linzess).
 *
 * Live icon order is preserved: icon-text-msg / icon-daily-reminders / icon-web-click.
 *
 * Block name: "Cards Grid (cards-grid-icon-image-card, savings-signup)"
 *
 * @param {Element} element
 * @param {Object} ctx { document }
 */
export default function parse(element, { document }) {
  const cards = [
    {
      href: 'sms:59257',
      icon: `${DAM}/icon-text-msg.svg`,
      title: 'Text',
      body: 'Text “LINZESS” to 59257 to sign up and add your card to your phone.†',
      cta: 'Text to Sign Up',
    },
    {
      href: 'tel:1-855-859-5614',
      icon: `${DAM}/icon-daily-reminders.svg`,
      title: 'Call',
      body: 'Call 1-855-859-5614 and we’ll help you sign up and mail out your card.',
      cta: 'Call to Sign Up',
    },
    {
      href: '/savings-card',
      icon: `${DAM}/icon-web-click.svg`,
      title: 'Click',
      body: 'Click to sign up online and download your card.',
      cta: 'Sign Up Online',
    },
  ];

  const cells = [['Cards Grid (cards-grid-icon-image-card, savings-signup)']];

  cards.forEach((card) => {
    const linkCell = document.createElement('div');
    linkCell.append(link(document, card.href, card.href));

    const titleP = document.createElement('p');
    titleP.textContent = card.title;

    const bodyP = document.createElement('p');
    bodyP.innerHTML = card.body;

    const ctaP = document.createElement('p');
    ctaP.textContent = card.cta;

    cells.push([
      linkCell,
      picture(document, card.icon),
      titleP,
      bodyP,
      ctaP,
      '',
    ]);
  });

  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
