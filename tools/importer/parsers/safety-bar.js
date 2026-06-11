/* eslint-disable */
/* global WebImporter */

/**
 * Parser: safety-bar
 * Base block: safety-bar
 * Source: https://www.linzess.com/find-relief
 * Selector: .abbv-safety-bar.linzess-safety-bar
 * Generated: 2026-06-10
 *
 * UE Model fields (from blocks/safety-bar/_safety-bar.json):
 *  Row 0: collapsedContent (richtext) — Text shown in bar when collapsed (left column for split)
 *  Row 1: collapsedContentCol2 (richtext) — Right column content in collapsed state (split variant)
 *  Row 2: expandedContent (richtext) — Complete ISI displayed when bar is expanded
 *  Row 3: classes_variant (select) — Variant class: "split"
 *  Row 4: blockId (text) — Unique block identifier: "id:linzess-find-relief-safety"
 *  Row 5: classes_commonCustomClass (text) — Custom CSS class
 *  Row 6: language (select) — Language setting: "lang:none"
 *
 * Per xwalk: all 7 rows are emitted with field hints. The split variant uses two
 * columns in collapsed state.
 *
 * Source DOM structure (validated):
 *  - .abbv-safety-bar-content.abbv-safety-bar-less — collapsed content container
 *    - .abbv-row-container > .abbv-row.abbv-row-flush
 *      - .abbv-col.abbv-col-6 (first) — USES heading + paragraph
 *      - .abbv-col.abbv-col-6 (second) — IMPORTANT RISK INFORMATION heading + bullets
 *  - .abbv-safety-bar-content.abbv-safety-bar-more — expanded content container (full ISI)
 */
export default function parse(element, { document }) {
  // --- Helper: create hinted cell with richtext (DOM elements) ---
  function hintedRichtextCell(fieldName, contentEl) {
    const frag = document.createDocumentFragment();
    frag.appendChild(document.createComment(` field:${fieldName} `));
    if (contentEl) {
      // Clone and append all child nodes
      const children = Array.from(contentEl.childNodes);
      children.forEach((child) => {
        frag.appendChild(child.cloneNode(true));
      });
    }
    return [frag];
  }

  // --- Helper: create hinted cell with text value ---
  function hintedCell(fieldName, value) {
    const frag = document.createDocumentFragment();
    frag.appendChild(document.createComment(` field:${fieldName} `));
    if (value) {
      frag.appendChild(document.createTextNode(value));
    }
    return [frag];
  }

  // --- Extract collapsed content (minimized state) ---
  // Collapsed content is within .abbv-safety-bar-content.abbv-safety-bar-less
  const collapsedContainer = element.querySelector('.abbv-safety-bar-content.abbv-safety-bar-less, .abbv-safety-bar-content-minimized-desktop');
  const columns = collapsedContainer
    ? collapsedContainer.querySelectorAll('.abbv-col.abbv-col-6, .abbv-col')
    : [];

  // Column 1: USES summary (h3 + paragraph)
  const col1 = columns.length > 0 ? columns[0].querySelector('div') || columns[0] : null;

  // Column 2: IMPORTANT RISK INFORMATION summary (h3 + bullets + text)
  const col2 = columns.length > 1 ? columns[1].querySelector('div') || columns[1] : null;

  // --- Extract expanded content (full ISI) ---
  // Expanded content is within .abbv-safety-bar-content.abbv-safety-bar-more
  const expandedContainer = element.querySelector('.abbv-safety-bar-content.abbv-safety-bar-more');

  // If no separate expanded container exists, fall back to extracting full ISI
  // from the inline ISI on the same page (handled by transformer combining)
  let expandedContentEl = null;
  if (expandedContainer) {
    // The expanded container holds the complete ISI rich text
    expandedContentEl = expandedContainer.querySelector('.abbv-rich-text, .rich-text') || expandedContainer;
  }

  // --- Determine variant ---
  // The Linzess safety bar uses the "split" variant (two-column collapsed layout)
  const variant = 'split';

  // --- Determine blockId ---
  const blockId = 'id:linzess-find-relief-safety';

  // --- Build cells: 7 rows matching UE model field order ---
  const cells = [
    /* Row 0: collapsedContent */         hintedRichtextCell('collapsedContent', col1),
    /* Row 1: collapsedContentCol2 */     hintedRichtextCell('collapsedContentCol2', col2),
    /* Row 2: expandedContent */          hintedRichtextCell('expandedContent', expandedContentEl),
    /* Row 3: classes_variant */          hintedCell('classes_variant', variant),
    /* Row 4: blockId */                  hintedCell('blockId', blockId),
    /* Row 5: classes_commonCustomClass */ hintedCell('classes_commonCustomClass', ''),
    /* Row 6: language */                 hintedCell('language', 'lang:none'),
  ];

  const block = WebImporter.Blocks.createBlock(document, { name: 'safety-bar', cells });
  element.replaceWith(block);
}
