/* eslint-disable */
/* global WebImporter */

/**
 * Section-nav parser — LINZESS "JUMP TO" sticky in-page navigation.
 *
 * Source instance: `.abbv-section-navigation` containing a
 * `.section-navigation-list` of anchor links (#talktoadoctor, #howtotake).
 *
 * Emits the `section-nav (sticky, mobile-menu)` block. Per the known-good
 * output: row 1 is an empty anchorId cell; each subsequent row is a
 * label | href pair (href as an <a> whose text is the anchor target).
 */
export default function parse(element, { document }) {
  const links = [...element.querySelectorAll('.section-navigation-list a, a[href^="#"]')];
  const rows = [['Section Nav (sticky, mobile-menu)'], ['']];

  links.forEach((a) => {
    const label = a.textContent.replace(/\s+/g, ' ').trim();
    const href = a.getAttribute('href') || '';
    const linkEl = document.createElement('a');
    linkEl.setAttribute('href', href);
    linkEl.textContent = href;
    rows.push([label, linkEl]);
  });

  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
