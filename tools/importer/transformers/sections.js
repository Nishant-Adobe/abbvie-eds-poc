/* eslint-disable */
/* global WebImporter */

/**
 * Sections transformer for the linzess-savings-support template.
 *
 * afterTransform: ensures top-level section breaks (`<hr>`) separate the EDS
 * sections defined in PAGE_TEMPLATE.sections.
 *
 * NOTE: the savings-page parser composes the page deterministically and ALREADY
 * inserts the `<hr>` breaks between sections (hero | section-nav | savings |
 * financial-support | explore | isi | safety-bar). To avoid duplicate section
 * breaks (which would create empty EDS sections), this transformer only
 * normalizes consecutive/leading/trailing `<hr>` rather than blindly inserting
 * new ones.
 *
 * Signature: transform(hookName, element, payload)
 *
 * @param {string} hookName 'beforeTransform' | 'afterTransform'
 * @param {Element} element typically document.body
 * @param {Object} payload { document, url, html, params, template }
 */
export default function transform(hookName, element, payload) {
  if (hookName !== 'afterTransform') return;

  const hrs = [...element.querySelectorAll(':scope > hr')];

  // Collapse adjacent <hr> pairs (would otherwise yield empty sections).
  hrs.forEach((hr) => {
    let next = hr.nextElementSibling;
    while (next && next.tagName === 'HR') {
      const toRemove = next;
      next = next.nextElementSibling;
      toRemove.remove();
    }
  });

  // Drop a leading <hr> (no content before it -> empty first section).
  const first = element.firstElementChild;
  if (first && first.tagName === 'HR') first.remove();

  // Drop a trailing <hr> (the import script appends its own metadata <hr>).
  const last = element.lastElementChild;
  if (last && last.tagName === 'HR') last.remove();
}
