/* eslint-disable */
/* global WebImporter */

/**
 * Parser: cards-grid
 * Base block: cards-grid
 * Variant class: cards-grid-icon-image-card
 * Source: https://www.linzess.com/find-relief
 * Selectors: .abbv-flex-container-v2:has(.icon-image-card), .savings-card-cards
 * Generated: 2026-06-10
 *
 * UE Model fields (grid-card item):
 *   link (aem-content) - Card CTA href (sms:, tel:, or path)
 *   image (reference) - Icon image
 *   line1 (richtext) - Card title/heading
 *   line2 (richtext) - Card body/description text
 *   line3 (richtext) - CTA button label
 *   line4 (richtext) - Empty/unused
 *
 * Block table structure:
 *   Header: "Cards Grid (icon-image-card)"
 *   Each card = one row with 6 cells: [link, image, line1, line2, line3, line4]
 *
 * Handles two instances:
 *   1. "Refill on Time" / "Keep Your Doctor Updated" - 2 cards (no CTA buttons)
 *   2. "Text" / "Call" / "Click" savings cards - 3 cards with CTA buttons (sms:/tel:/path)
 */
export default function parse(element, { document }) {
  // Guard: only process actual card containers with flexbox-cards class
  // Tab-internal flex containers use flexbox-column (not flexbox-cards) and must be excluded
  if (!element.classList.contains('flexbox-cards') && !element.classList.contains('savings-card-cards')) {
    return;
  }

  // Guard: skip if inside a tab panel (those cards are handled by the tabs parser)
  if (element.closest('.abbv-tab')) {
    return;
  }

  // Find direct card items - the .icon-image-card flex items with col-2-card class
  // col-2-card distinguishes cards-grid cards from tab-internal instruction cards
  const cardItems = element.querySelectorAll(':scope > .flexboxitem-v2 > .abbv-flex-item-v2.icon-image-card.col-2-card');

  // Guard: skip if no card items found
  if (!cardItems.length) return;

  const cells = [];

  cardItems.forEach((card) => {
    // Extract icon image from image container
    const img = card.querySelector('.abbv-image-content-container-v2 img');

    // Extract heading (title) from card body
    const cardBody = card.querySelector('.abbv-stretched-card-body');
    const headingEl = cardBody ? cardBody.querySelector('.heading-2, h2') : null;

    // Extract description (non-heading paragraph) from card body
    const descriptionEl = cardBody ? cardBody.querySelector('p:not(.heading-2):not(h2)') : null;

    // Extract CTA link (present in savings-card-cards instance)
    const ctaLink = card.querySelector('.cta a');

    // Determine the link href - from CTA button if present
    const href = ctaLink ? (ctaLink.getAttribute('href') || '') : '';

    // Cell 1: link (aem-content field)
    const linkCell = document.createDocumentFragment();
    linkCell.appendChild(document.createComment(' field:link '));
    if (href) {
      const linkP = document.createElement('p');
      const a = document.createElement('a');
      a.href = href;
      a.textContent = href;
      linkP.appendChild(a);
      linkCell.appendChild(linkP);
    }

    // Cell 2: image (reference field)
    const imageCell = document.createDocumentFragment();
    imageCell.appendChild(document.createComment(' field:image '));
    if (img) {
      const imgEl = document.createElement('img');
      imgEl.src = img.getAttribute('src') || '';
      imgEl.alt = img.getAttribute('alt') || '';
      imageCell.appendChild(imgEl);
    }

    // Cell 3: line1 - title/heading (richtext field)
    const line1Cell = document.createDocumentFragment();
    line1Cell.appendChild(document.createComment(' field:line1 '));
    if (headingEl) {
      const p = document.createElement('p');
      p.textContent = headingEl.textContent.trim();
      line1Cell.appendChild(p);
    }

    // Cell 4: line2 - description/body (richtext field)
    const line2Cell = document.createDocumentFragment();
    line2Cell.appendChild(document.createComment(' field:line2 '));
    if (descriptionEl) {
      const p = document.createElement('p');
      // Preserve innerHTML for bold/sup tags within description
      p.innerHTML = descriptionEl.innerHTML.trim();
      line2Cell.appendChild(p);
    }

    // Cell 5: line3 - CTA button label (richtext field)
    const line3Cell = document.createDocumentFragment();
    line3Cell.appendChild(document.createComment(' field:line3 '));
    if (ctaLink) {
      const p = document.createElement('p');
      p.textContent = ctaLink.textContent.trim();
      line3Cell.appendChild(p);
    }

    // Cell 6: line4 - empty (richtext field, unused)
    const line4Cell = document.createDocumentFragment();
    line4Cell.appendChild(document.createComment(' field:line4 '));

    // Each card = one row with 6 cells matching grid-card model fields
    cells.push([linkCell, imageCell, line1Cell, line2Cell, line3Cell, line4Cell]);
  });

  const block = WebImporter.Blocks.createBlock(document, { name: 'cards-grid (icon-image-card)', cells });
  element.replaceWith(block);
}
