import { getMetadata } from '../../../scripts/aem.js';
import decorateExternalLinksUtility from '../../../scripts/utils.js';
import { loadFragment } from '../../fragment/fragment.js';

/**
 * Custom decoration for RINVOQ DTC footer.
 * Live design: 3 vertical columns, each with an <h5> heading + <ul> of links,
 * plus a footer-bottom containing legal-number + AbbVie logo.
 *
 * Authoring convention for /rinvoq-dtc/footer fragment:
 *   Section 1:
 *     - H5 "RINVOQ (upadacitinib)" → starts column 1
 *     - UL of links → goes in column 1
 *     - H5 "Important Information for Patients" → starts column 2
 *     - UL of links
 *     - H5 "Information from AbbVie" → starts column 3
 *     - UL of links
 *   Section 2:
 *     - Optional legal-text paragraph
 *     - P with indication code (e.g. US-RNQD-XXXXXX)
 *     - Image: AbbVie logo
 *
 * @param {Element} block The footer block element
 */
async function decorateRinvoqDtc(block) {
  const footerMeta = getMetadata('footer');
  const footerPath = footerMeta ? new URL(footerMeta, window.location).pathname : '/footer';
  const fragment = await loadFragment(footerPath);

  block.textContent = '';

  const sections = fragment.querySelectorAll('.section');

  // Section 1 → multi-column layout (paired H1-H6 + UL into footer-column divs)
  if (sections.length > 0) {
    const firstSection = sections[0];
    const allChildren = [];
    const wrappers = firstSection.querySelectorAll('.default-content-wrapper, .social-media-wrapper');
    wrappers.forEach((wrapper) => {
      allChildren.push(...Array.from(wrapper.children));
    });

    const columnsContainer = document.createElement('div');
    columnsContainer.className = 'footer-columns';

    let currentColumn = null;
    let columnIndex = 0;

    const startColumn = () => {
      columnIndex += 1;
      currentColumn = document.createElement('div');
      currentColumn.className = `footer-column footer-column-${columnIndex}`;
      columnsContainer.appendChild(currentColumn);
    };

    allChildren.forEach((child) => {
      // Any heading (H1-H6) starts a new column
      if (/^H[1-6]$/.test(child.tagName)) {
        startColumn();
      } else if (!currentColumn) {
        // No heading authored before this content — create implicit first column
        startColumn();
      }
      currentColumn.appendChild(child.cloneNode(true));
    });

    block.appendChild(columnsContainer);
    decorateExternalLinksUtility(columnsContainer);
  }

  // Section 2 → footer-bottom (legal-text, legal-number, logo)
  if (sections.length > 1) {
    const secondSection = sections[1];
    const secondSectionWrapper = secondSection.querySelector('.default-content-wrapper');

    if (secondSectionWrapper) {
      const bottomLinks = document.createElement('div');
      bottomLinks.className = 'footer-bottom';

      Array.from(secondSectionWrapper.children).forEach((child) => {
        bottomLinks.appendChild(child.cloneNode(true));
      });

      decorateExternalLinksUtility(bottomLinks);
      block.appendChild(bottomLinks);
    }
  }
}

export default async function getBlockConfigs() {
  return {
    flags: {},
    variations: [],
    decorations: {
      decorate: async (ctx) => decorateRinvoqDtc(ctx),
    },
  };
}
