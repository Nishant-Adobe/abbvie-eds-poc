/* eslint-disable */
/* global WebImporter */

/**
 * Shared helpers for the linzess-savings-support parsers.
 *
 * All block tables are produced with WebImporter.DOMUtils.createTable so that
 * the html2md -> md2jcr pipeline yields the SAME .plain.html block-table shape
 * as the gold-standard pages (content/linzess/{index,why-linzess,resources}).
 *
 * IMPORTANT (project rules):
 *  - Never emit <sup>. Use literal Unicode symbols (* † ‡ § ||) and ¹²³.
 *  - Verbatim regulated copy (ISI, savings terms, insurance table, footnotes).
 */

/**
 * Create a <picture><img></picture> element with optional width/height/alt.
 * @param {Document} document
 * @param {string} src DAM path
 * @param {Object} [opts]
 * @returns {HTMLElement} picture element
 */
export function picture(document, src, opts = {}) {
  const pic = document.createElement('picture');
  const img = document.createElement('img');
  img.setAttribute('src', src);
  if (opts.alt) img.setAttribute('alt', opts.alt);
  if (opts.width) img.setAttribute('width', String(opts.width));
  if (opts.height) img.setAttribute('height', String(opts.height));
  pic.append(img);
  return pic;
}

/**
 * Build a single <p> with arbitrary inline HTML.
 * @param {Document} document
 * @param {string} html
 * @returns {HTMLParagraphElement}
 */
export function p(document, html) {
  const el = document.createElement('p');
  el.innerHTML = html;
  return el;
}

/**
 * Build an <a> link element.
 * @param {Document} document
 * @param {string} href
 * @param {string} text
 * @returns {HTMLAnchorElement}
 */
export function link(document, href, text) {
  const a = document.createElement('a');
  a.setAttribute('href', href);
  a.textContent = text;
  return a;
}

/**
 * Wrap one or more nodes/strings into a single container div so a table cell
 * can hold multiple paragraphs (createTable accepts an Element per cell).
 * @param {Document} document
 * @param {Array<Node|string>} nodes
 * @returns {HTMLDivElement}
 */
export function cell(document, nodes) {
  const div = document.createElement('div');
  nodes.forEach((n) => {
    if (typeof n === 'string') {
      const para = document.createElement('p');
      para.innerHTML = n;
      div.append(para);
    } else {
      div.append(n);
    }
  });
  return div;
}
