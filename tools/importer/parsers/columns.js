/* eslint-disable */
/* global WebImporter */

/**
 * Columns parser — LINZESS two-column touts and bottom CTA.
 *
 * Handles two source shapes:
 *   1. `.abbv-row-container.image-text-wrapper` — image + text tout
 *      (Gut Check tout, Savings Card tout). Columns are `.abbv-col`.
 *   2. `.abbv-flex-container-v2.flexbox-column-mobile` (bottom CTA) —
 *      columns are `.abbv-flex-item-v2`.
 *
 * Emits the `columns` block matching the known-good output: a first row whose
 * cells are empty (the EDS columns block consumes the first row as an
 * anchor/spacer row), followed by one row whose cells hold each column's
 * content (image cell first, then text/heading cells).
 *
 * Content is moved verbatim (images become <picture><img>, headings and
 * paragraphs preserved) so safety/legal copy round-trips unchanged.
 */
function buildCell(document, sourceCol) {
  const cell = document.createElement('div');
  // Prefer an image as its own <picture> if present.
  const img = sourceCol.querySelector('img');
  const heading = sourceCol.querySelector('h1, h2, h3, h4');
  if (img && !heading) {
    const picture = document.createElement('picture');
    const newImg = document.createElement('img');
    newImg.setAttribute('src', img.getAttribute('src'));
    if (img.getAttribute('alt')) newImg.setAttribute('alt', img.getAttribute('alt'));
    if (img.getAttribute('width')) newImg.setAttribute('width', img.getAttribute('width'));
    if (img.getAttribute('height')) newImg.setAttribute('height', img.getAttribute('height'));
    picture.append(newImg);
    cell.append(picture);
    // Carry any caption text (e.g. "Actor Portrayal") below the image.
    sourceCol.querySelectorAll('p, em, i').forEach((p) => {
      const t = p.textContent.trim();
      if (t) cell.append(p.cloneNode(true));
    });
    return cell;
  }
  // Text column: keep headings, paragraphs and the CTA link.
  [...sourceCol.querySelectorAll('h1, h2, h3, h4, p, a')].forEach((node) => {
    // Skip nested anchors already captured inside a paragraph.
    if (node.tagName === 'A' && node.closest('p')) return;
    cell.append(node.cloneNode(true));
  });
  if (!cell.childNodes.length) {
    [...sourceCol.childNodes].forEach((n) => cell.append(n.cloneNode(true)));
  }
  return cell;
}

export default function parse(element, { document }) {
  let columns = [...element.querySelectorAll(':scope > .abbv-row > .abbv-col')];
  if (!columns.length) columns = [...element.querySelectorAll('.abbv-col')];
  if (!columns.length) columns = [...element.querySelectorAll('.abbv-flex-item-v2')];
  if (!columns.length) return;

  const contentRow = columns.map((col) => buildCell(document, col));
  const emptyRow = columns.map(() => '');

  const cells = [
    ['Columns'],
    emptyRow,
    contentRow,
  ];

  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
