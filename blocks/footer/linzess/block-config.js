import {
  loadFooterFragment,
  getSectionChildren,
  buildColumnsByHeading,
  buildBottom,
} from '../footer.js';
import decorateExternalLinksUtility from '../../../scripts/utils.js';

/**
 * LINZESS DTC footer — 6-column heading-based grid with 3 callout-only columns
 * + footer-bottom carrying sub-links, legal text, partner logos, copyright,
 * and indication code.
 *
 * Authoring (fragment at /linzess/footer):
 *   Section 1: 8 H5 headings (each becomes its own column)
 *     1. H5 "WHY LINZESS" + UL of 4 sub-links
 *     2. H5 "UNDERSTANDING CONSTIPATION" + UL of 4 sub-links
 *     3. H5 "FIND RELIEF" + UL of 2 sub-links
 *     4. H5 "RESOURCES" + UL of 3 sub-links
 *     5. H5 "SAVINGS & SUPPORT" + UL of 2 sub-links
 *     6. H5 with link "CHECK MY SYMPTOMS"  (no UL — heading-only callout)
 *     7. H5 with link "FAQs"               (no UL — heading-only callout)
 *     8. H5 with link "SIGN UP FOR UPDATES" (no UL — heading-only callout)
 *   At desktop width, columns 1–5 sit in their own grid columns and columns
 *   6–8 stack into the 6th visual column (CSS handles the placement).
 *
 *   Section 2: footer-bottom
 *     - UL of horizontal sub-links (Accessibility Statement, Contact Us, …)
 *     - P with trademark legal text
 *     - P with US-residents disclaimer
 *     - Image: AbbVie logo  (left of bottom row)
 *     - Image: Ironwood logo (left of bottom row, after divider)
 *     - P with copyright "© 2026 AbbVie and Ironwood Pharmaceuticals, Inc. …"
 *     - P with indication code "US-LIN-250071"
 *
 * @param {Element} block
 */
async function decorateLinzess(block) {
  const fragment = await loadFooterFragment();
  block.textContent = '';

  const sections = fragment.querySelectorAll('.section');

  if (sections.length > 0) {
    const columns = buildColumnsByHeading(getSectionChildren(sections[0]));
    block.appendChild(columns);
    decorateExternalLinksUtility(columns);
  }

  if (sections.length > 1) {
    const wrapper = sections[1].querySelector('.default-content-wrapper');
    if (wrapper) {
      const bottom = buildBottom(Array.from(wrapper.children));
      decorateExternalLinksUtility(bottom);
      block.appendChild(bottom);
    }
  }
}

export default async function getBlockConfigs() {
  return {
    flags: {},
    variations: [],
    decorations: {
      decorate: async (ctx) => decorateLinzess(ctx),
    },
  };
}
