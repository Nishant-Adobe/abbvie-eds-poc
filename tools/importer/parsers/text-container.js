/* eslint-disable */
/* global WebImporter */

/**
 * Parser: text-container
 * Base block: text-container
 * Source: https://www.linzess.com/find-relief
 * Selector: .abbv-inline-use-isi
 * Generated: 2026-06-10
 *
 * UE Model fields (from blocks/text-container/_text-container.json):
 *  Row 0: classes_customDynamicClass (text) — custom dynamic CSS classes
 *  Row 1: blockId (text) — unique block identifier (id:value)
 *  Row 2: classes_commonCustomClass (text) — custom CSS class
 *  Row 3: language (text) — language code (lang:value)
 *  Row 4: (empty separator)
 *  Row 5+: text (richtext) — ISI rich text content items
 *
 * The text-container block contains the ISI (Important Safety Information)
 * with USES indication statement and IMPORTANT RISK INFORMATION sections.
 * This is regulated pharma content that must be preserved verbatim.
 *
 * Source DOM structure (validated against source.html):
 *  - .abbv-inline-use > .rich-text > .abbv-rich-text.linzess-use-statement — USES section
 *  - .abbv-inline-safety > .rich-text > .abbv-rich-text.linzess-isi-iri — IRI section
 *  - h3 headings, p paragraphs, ul/li lists, b bold, sup superscript, a links
 */
export default function parse(element, { document }) {
  // --- Row 0: classes_customDynamicClass (placeholder "-") ---
  const row0Frag = document.createDocumentFragment();
  row0Frag.appendChild(document.createComment(' field:classes_customDynamicClass '));
  row0Frag.appendChild(document.createTextNode('-'));

  // --- Row 1: blockId ---
  const row1Frag = document.createDocumentFragment();
  row1Frag.appendChild(document.createComment(' field:blockId '));
  row1Frag.appendChild(document.createTextNode('id:linzess-find-relief-isi'));

  // --- Row 2: classes_commonCustomClass (placeholder "-") ---
  const row2Frag = document.createDocumentFragment();
  row2Frag.appendChild(document.createComment(' field:classes_commonCustomClass '));
  row2Frag.appendChild(document.createTextNode('-'));

  // --- Row 3: language ---
  const row3Frag = document.createDocumentFragment();
  row3Frag.appendChild(document.createComment(' field:language '));
  row3Frag.appendChild(document.createTextNode('lang:none'));

  // --- Row 4: empty separator ---
  // Required by xwalk model - empty row between config rows and content rows

  // --- Row 5: ISI text content (richtext) ---
  // Extract the full ISI content from both USES and IMPORTANT RISK INFORMATION sections.
  // Pharma regulatory content must be preserved verbatim.
  const textFrag = document.createDocumentFragment();
  textFrag.appendChild(document.createComment(' field:text '));

  // Extract USES section
  const usesSection = element.querySelector('.abbv-inline-use .abbv-rich-text, .abbv-inline-use .rich-text');
  if (usesSection) {
    // Get the innermost rich-text container with actual content
    const usesContent = usesSection.querySelector('.abbv-rich-text') || usesSection;
    const usesClone = usesContent.cloneNode(true);
    // Move children to fragment, preserving all semantic HTML
    while (usesClone.firstChild) {
      textFrag.appendChild(usesClone.firstChild);
    }
  }

  // Extract IMPORTANT RISK INFORMATION section
  const safetySection = element.querySelector('.abbv-inline-safety .abbv-rich-text, .abbv-inline-safety .rich-text');
  if (safetySection) {
    const safetyContent = safetySection.querySelector('.abbv-rich-text') || safetySection;
    const safetyClone = safetyContent.cloneNode(true);
    // Move children to fragment, preserving all semantic HTML (headings, lists, bold, links)
    while (safetyClone.firstChild) {
      textFrag.appendChild(safetyClone.firstChild);
    }
  }

  // --- Build cells array matching UE model row structure ---
  const cells = [
    /* Row 0: classes_customDynamicClass */ [row0Frag],
    /* Row 1: blockId */                   [row1Frag],
    /* Row 2: classes_commonCustomClass */  [row2Frag],
    /* Row 3: language */                   [row3Frag],
    /* Row 4: empty separator */           [''],
    /* Row 5: text content (ISI) */        [textFrag],
  ];

  const block = WebImporter.Blocks.createBlock(document, { name: 'text-container', cells });
  element.replaceWith(block);
}
