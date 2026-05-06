import { resolveImageReference } from '../../scripts/scripts.js';
import decorateExternalLinksUtility from '../../scripts/utils.js';

export default function decorate(block) {
  // Apply anchorId as element id for deep-linking
  const { anchorId } = block.dataset;
  if (anchorId) block.id = anchorId;

  [...block.children].forEach((item) => {
    item.classList.add('columns-item');

    const [contentCell, imageCell] = item.children;

    if (contentCell) contentCell.classList.add('columns-item-content');

    if (imageCell) {
      resolveImageReference(imageCell);
      if (imageCell.querySelector('picture, img')) {
        item.classList.add('columns-item-image');
      }
    }
  });

  decorateExternalLinksUtility(block);
}
