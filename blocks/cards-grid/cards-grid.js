import { moveInstrumentation } from '../../scripts/scripts.js';
import { applyCommonProps } from '../../scripts/utils.js';
import decorateGridCard, {
  buildGridCardMarkup,
  parseLinkCell,
  isCenteredCell,
} from '../grid-card/grid-card.js';

/**
 * Cards Grid — flex container for Skyrizi-style CTA cards.
 *
 * Preferred: **Grid Card** child blocks (`grid-card`). Each outputs the
 * skyrizi-hcp card DOM; this block places them in the flex row.
 *
 * Legacy: flat table rows (same columns, no `grid-card` wrapper).
 */

function mergeContainerClasses(block, container) {
  container.classList.add('abbv-flex-container-v2', 'cta-card-container');
  [...block.classList].forEach((cls) => {
    if (cls === 'block' || cls === 'cards-grid') return;
    if (/^cta-card-container/.test(cls)) {
      container.classList.add(cls);
    }
  });
}

function decorateLegacyRow(row, container) {
  const cells = [...row.children];
  if (cells.length < 5) return;

  const { href, target } = parseLinkCell(cells[0]);
  const line1 = cells[1]?.innerHTML?.trim() ?? '';
  const line2 = cells[2]?.innerHTML?.trim() ?? '';
  const line3 = cells[3]?.innerHTML?.trim() ?? '';
  const line4 = cells[4]?.innerHTML?.trim() ?? '';
  const centered = cells.length > 5 && isCenteredCell(cells[5]);

  const rich = buildGridCardMarkup({
    href,
    target,
    line1,
    line2,
    line3,
    line4,
    centered,
  });
  moveInstrumentation(row, rich);
  container.append(rich);
}

/**
 * @param {HTMLElement} block
 */
export default function decorate(block) {
  applyCommonProps(block);

  const container = document.createElement('div');
  mergeContainerClasses(block, container);

  [...block.children].forEach((row) => {
    if (row.classList.contains('grid-card')) {
      decorateGridCard(row);
      const rich = row.querySelector(':scope > .rich-text');
      if (rich) {
        moveInstrumentation(row, rich);
        container.append(rich);
      }
    } else {
      decorateLegacyRow(row, container);
    }
  });

  block.textContent = '';
  block.append(container);
}
