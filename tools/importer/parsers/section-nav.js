/* eslint-disable */
/* global WebImporter */

/**
 * Parser: section-nav
 * Base block: section-nav
 * Source: https://www.linzess.com/find-relief
 * Selector: .abbv-section-navigation
 * Generated: 2026-06-09
 *
 * UE Model: container block
 *   Parent: section-nav (fields: classes [multiselect], anchorId [text])
 *   Child: section-nav-item (fields: label [text], href [text])
 *
 * Each nav item = one row with two columns: [label, href-link]
 *
 * Subpage context: When payload contains subpageName, hrefs pointing to
 * the current subpage's anchor become self-anchors (#id) and other section
 * anchors are rewritten as sibling page links.
 */

const SUBPAGE_ANCHOR_MAP = {
  'find-relief-talk-to-a-doctor': {
    '#talktoadoctor': '#talktoadoctor',
    '#howtotake': '/find-relief/how-to-take-linzess',
  },
  'find-relief-how-to-take-linzess': {
    '#talktoadoctor': '/find-relief/talk-to-a-doctor',
    '#howtotake': '#howtotake',
  },
};

export default function parse(element, { document, params }) {
  const navItems = element.querySelectorAll('.section-navigation-list li a');
  if (!navItems.length) return;

  const subpageName = params?.subpageName || '';
  const anchorMap = SUBPAGE_ANCHOR_MAP[subpageName] || null;

  const cells = [];

  navItems.forEach((link) => {
    const label = link.textContent.trim();
    let href = link.getAttribute('href') || '';

    // Rewrite anchors for subpage context
    if (anchorMap && anchorMap[href]) {
      href = anchorMap[href];
    }

    // Build link element
    const a = document.createElement('a');
    a.href = href;
    a.textContent = label;

    cells.push([label, a]);
  });

  const block = WebImporter.Blocks.createBlock(document, { name: 'section-nav', cells });
  element.replaceWith(block);
}
