/* eslint-disable */
/* global WebImporter */

/**
 * Cards-grid parser — LINZESS icon-image cards.
 *
 * Source instance: `.abbv-flex-container-v2.flexbox-cards` (excluding
 * `.flexbox-video-cards`, which are handled by the embed parser). Two
 * instances on find-relief: the 2-card "Already Prescribed" row and the
 * 3-card "Need A Savings Card" row.
 *
 * Emits the `cards-grid (icon-image-card)` block. Each card row has 6 cells:
 *   link | image | line1 (title) | line2 (body richtext) | line3 (cta label) | line4 (empty)
 *
 * The body (line2) preserves inline markup (<strong>, <sup>) verbatim. The CTA
 * label (line3) is the visible text of the card's link, if any; the same link
 * URL goes in cell 1 (link).
 */
function richText(document, sourceEl) {
  const cell = document.createElement('div');
  if (sourceEl) {
    [...sourceEl.childNodes].forEach((n) => cell.append(n.cloneNode(true)));
  }
  return cell;
}

export default function parse(element, { document }) {
  const cards = [...element.querySelectorAll('.abbv-flex-item-v2')];
  const rows = [['Cards Grid (icon-image-card)']];

  cards.forEach((card) => {
    const content = card.querySelector('.abbv-image-text-content-container-v2')
      || card.querySelector('.abbv-stretched-card-body')
      || card;
    const paragraphs = [...content.querySelectorAll('p')];
    const img = card.querySelector('img');
    const cta = card.querySelector('.cta a, a.abbv-button-primary, a.abbv-button-tertiary, a');

    // Title = first paragraph (heading-styled); body = remaining paragraphs.
    const titleP = paragraphs[0];
    const bodyParas = paragraphs.slice(1);

    // Link cell: prefer the CTA href; tel:/sms: kept verbatim.
    const linkHref = cta ? cta.getAttribute('href') : '';
    const linkCell = document.createElement('div');
    if (linkHref) {
      if (/^(https?:|tel:|sms:|\/)/.test(linkHref)) {
        const a = document.createElement('a');
        a.setAttribute('href', linkHref);
        a.textContent = linkHref;
        linkCell.append(a);
      } else {
        linkCell.textContent = linkHref;
      }
    }

    // Image cell as <picture><img>.
    const imageCell = document.createElement('div');
    if (img) {
      const picture = document.createElement('picture');
      const newImg = document.createElement('img');
      newImg.setAttribute('src', img.getAttribute('src'));
      if (img.getAttribute('alt')) newImg.setAttribute('alt', img.getAttribute('alt'));
      picture.append(newImg);
      imageCell.append(picture);
    }

    // line1 title.
    const titleCell = document.createElement('div');
    if (titleP) titleCell.textContent = titleP.textContent.trim();

    // line2 body (preserve inline markup across remaining paragraphs).
    const bodyCell = document.createElement('div');
    bodyParas.forEach((p) => bodyCell.append(p.cloneNode(true)));

    // line3 CTA label.
    const ctaCell = document.createElement('div');
    if (cta) ctaCell.textContent = cta.textContent.replace(/\s+/g, ' ').trim();

    rows.push([linkCell, imageCell, titleCell, bodyCell, ctaCell, '']);
  });

  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
