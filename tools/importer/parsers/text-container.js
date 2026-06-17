/* eslint-disable */
/* global WebImporter */

/**
 * Text-container parser — LINZESS inline ISI (Important Safety Information).
 *
 * Source instance: `.abbv-inline-use-isi`, containing USES + IMPORTANT RISK
 * INFORMATION subsections and the job code (US-LIN-250121).
 *
 * REGULATORY: copy is moved VERBATIM. No paraphrase, no reorder, no spelling
 * or punctuation changes. All inline markup (<strong>, <sup>, <a>, <ul>/<li>)
 * is preserved exactly as authored on the live page. (See pharma-content-
 * fidelity skill.)
 *
 * Emits the `text-container` block in the canonical 5-row config form:
 *   row0: classes group → 'id:linzess-find-relief-isi'
 *   row1: blockId placeholder → '-'
 *   row2: language → 'lang:none'
 *   row3: analytics placeholder → '' (empty)
 *   row4: item content → the full ISI richtext (wrapped in an extra <div>)
 */
export default function parse(element, { document }) {
  // Collect the meaningful ISI subsections in source order, verbatim.
  const content = document.createElement('div');
  const inner = document.createElement('div');

  const parts = [
    element.querySelector('.abbv-inline-use'),
    element.querySelector('.abbv-inline-safety'),
    element.querySelector('.abbv-inline-miscisi'),
  ].filter(Boolean);

  if (parts.length) {
    parts.forEach((part) => {
      [...part.childNodes].forEach((node) => inner.append(node.cloneNode(true)));
    });
  } else {
    // Fallback: clone the whole ISI region verbatim.
    [...element.childNodes].forEach((node) => inner.append(node.cloneNode(true)));
  }
  content.append(inner);

  const cells = [
    ['Text Container'],
    ['id:linzess-find-relief-isi'],
    ['-'],
    ['lang:none'],
    [''],
    [content],
  ];

  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
