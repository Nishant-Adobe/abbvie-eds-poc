import { decorateBlock, loadBlock } from '../../scripts/aem.js';

/**
 * Nested blocks are not picked up by decorateBlocks() (only direct section rows are).
 * Without this, grid-card JS/CSS never load for children of cards-grid.
 */
export default async function decorate(block) {
  const nestedCards = [...block.querySelectorAll(':scope > .grid-card')];

  for (const card of nestedCards) {
    if (!card.classList.contains('block')) {
      decorateBlock(card);
    }
    await loadBlock(card);
  }

  const container = document.createElement('div');
  container.classList.add('cta-card-grid-container');
  nestedCards.forEach((card) => container.append(card));
  block.replaceChildren(container);
}
