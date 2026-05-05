import { getMetadata } from '../../../scripts/aem.js';
import decorateExternalLinksUtility from '../../../scripts/utils.js';
import { loadFragment } from '../../fragment/fragment.js';

/**
 * Custom decoration for RINVOQ DTC footer.
 * Live design layout (top → bottom):
 *   1. .footer-top    → indication code (e.g. US-RNQD-250405) on white bg, ABOVE gray
 *   2. .footer-columns → 3 vertical columns with H5 + UL of links, GRAY bg
 *   3. .footer-bottom  → legal text + AbbVie logo on white bg, BELOW gray
 *
 * Authoring convention for /rinvoq-dtc/footer fragment:
 *   Section 1:
 *     - H5 "RINVOQ (upadacitinib)" + UL of links
 *     - H5 "Important Information for Patients" + UL of links
 *     - H5 "Information from AbbVie" + UL of links
 *   Section 2 (any order — decorator extracts the indication-code paragraph):
 *     - P with indication code (matched by US-XXX-XXXXXX pattern) → goes to footer-top
 *     - Optional copyright/legal paragraph(s) → goes to footer-bottom
 *     - Image: AbbVie logo → goes to footer-bottom
 *
 * @param {Element} block The footer block element
 */
async function decorateRinvoqDtc(block) {
  const footerMeta = getMetadata('footer');
  const footerPath = footerMeta ? new URL(footerMeta, window.location).pathname : '/footer';
  const fragment = await loadFragment(footerPath);

  block.textContent = '';

  const sections = fragment.querySelectorAll('.section');

  // Extract legal-number from section 2 (rendered ABOVE columns per live design)
  let legalNumber = null;
  const bottomItems = [];

  if (sections.length > 1) {
    const wrapper = sections[1].querySelector('.default-content-wrapper');
    if (wrapper) {
      Array.from(wrapper.children).forEach((child) => {
        const text = child.textContent.trim();
        // Match indication-code pattern e.g. US-RNQD-250405
        if (child.tagName === 'P' && /^US-[A-Z]+-\d+$/.test(text)) {
          legalNumber = child;
        } else {
          bottomItems.push(child);
        }
      });
    }
  }

  // Footer-top → indication code (white bg, above gray)
  if (legalNumber) {
    const topContainer = document.createElement('div');
    topContainer.className = 'footer-top';
    topContainer.appendChild(legalNumber.cloneNode(true));
    block.appendChild(topContainer);
  }

  // Section 1 → footer-columns (gray bg)
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

  // Footer-bottom → legal text + logo (white bg, below gray)
  if (bottomItems.length) {
    const bottomContainer = document.createElement('div');
    bottomContainer.className = 'footer-bottom';
    bottomItems.forEach((item) => bottomContainer.appendChild(item.cloneNode(true)));
    decorateExternalLinksUtility(bottomContainer);
    block.appendChild(bottomContainer);
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
