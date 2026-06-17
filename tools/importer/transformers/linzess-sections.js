/* eslint-disable */
/* global WebImporter */

/**
 * Section transformer for LINZESS find-relief pages.
 *
 * Inserts EDS section breaks (<hr>) between the page's logical sections and
 * appends a section-metadata table to each so the brand CSS can style them:
 *   1. Hero                          → style: find-relief-hero
 *   2. Talk to a Doctor (white)      → style: find-relief-checklist (id talktoadoctor)
 *   3. How to Take + Savings (off)   → style: find-relief-off-white (id howtotake)
 *   4. Instructions tabs             → style: find-relief-off-white
 *   5. Bottom CTA (dark purple)      → style: find-relief-dark-purple
 *   6. ISI                           → style: find-relief-isi
 *
 * Section boundaries are detected from the live `abbv-container background-*`
 * wrappers (and the hero / inline-isi blocks). Runs in afterTransform AFTER
 * block parsers, so it operates on parsed block tables already in place.
 */
// Build a section-metadata table. The section STYLE is expressed as a block
// VARIANT in the table header — `Section Metadata (find-relief-checklist)`
// becomes `<div class="section-metadata find-relief-checklist">`, which
// `decorateSections` (scripts/aem.js) consumes via applySectionMetaClasses.
// This matches the known-good /linzess/why-linzess + find-relief pages. The
// previous `style` ROW approach left a visible text leak on preview because
// the runtime tried to load `section-metadata` as a block.
function metadataTable(document, style, sectionId) {
  const header = style ? `Section Metadata (${style})` : 'Section Metadata';
  const rows = [[header]];
  if (sectionId) rows.push(['sectionId', sectionId]);
  return WebImporter.DOMUtils.createTable(rows, document);
}

export default function transform(hookName, element, payload) {
  if (hookName !== 'afterTransform') return;
  const { document, url, params } = payload;

  // Only the find-relief INDEX page gets the full multi-section mapping; the
  // Gut Check page has a different layout and must not pick up the index's
  // section styles (e.g. talktoadoctor). Detect index by URL.
  const pathname = (() => {
    try { return new URL(params.originalURL || url).pathname; } catch (e) { return ''; }
  })();
  const isGutcheck = /\/find-relief\/gutcheck\/?$/.test(pathname);

  if (isGutcheck) {
    // Gut Check: tag the ISI region only; leave the quiz body as default content.
    const isi = element.querySelector('.abbv-inline-use-isi');
    if (isi) {
      isi.before(document.createElement('hr'));
      isi.append(metadataTable(document, 'find-relief-isi', null));
    }
    return;
  }

  // Map each live section wrapper to its EDS section style + optional anchor id.
  // html2md creates EDS section breaks from <hr> elements. We insert an <hr>
  // BEFORE each section wrapper (except the first) and append the section's
  // metadata table (style as variant class + optional sectionId) at the end of
  // its content, so each wrapper becomes its own styled EDS section.
  // IMPORTANT: the live "How to Take" section (.background-off-white-arc)
  // CONTAINS the dosing tabs wrapper (.background-white.rounded-corners) nested
  // inside it. We must NOT target the nested tabs wrapper as a separate section
  // — doing so puts TWO section-metadata tables in the same EDS section, and
  // decorateSections only consumes the first, leaking the second as text.
  // Each entry below is a genuine top-level section in document order.
  const sectionDefs = [
    { selector: '.abbv-section-navigation', style: null, id: null, breakOnly: true },
    { selector: '.abbv-container.background-white.background-white-arc', style: 'find-relief-checklist', id: 'talktoadoctor' },
    { selector: '.abbv-container.background-dark-purple', style: 'find-relief-dark-purple', id: null },
    { selector: '.abbv-inline-use-isi', style: 'find-relief-isi', id: null },
  ];

  sectionDefs.forEach((def) => {
    const sec = element.querySelector(def.selector);
    if (!sec) return;
    // A section break before each wrapper isolates it from the preceding one
    // (e.g. the hero, which is the very first content and needs no break).
    sec.before(document.createElement('hr'));
    // breakOnly entries (section-nav) just need the <hr> separator, no metadata.
    if (!def.breakOnly) sec.append(metadataTable(document, def.style, def.id));
  });

  // The off-white "How to Take" container wraps the dosing TABS. The internal
  // section boundaries (how-to-take | tabs | panels | storage), all tagged
  // `find-relief-off-white`, are emitted by the TABS PARSER's fragment, which
  // is the only insertion point that reliably survives html2md as flat
  // top-level sections (nested <hr>/metadata inside this container are dropped).
  // Here we only need the leading break that separates the preceding checklist
  // section from the start of the off-white region.
  const offWhite = element.querySelector('.abbv-container.background-off-white.background-off-white-arc');
  if (offWhite) {
    offWhite.before(document.createElement('hr'));
  }
}
