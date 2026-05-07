import { resolveImageReference } from '../../scripts/scripts.js';
import decorateExternalLinksUtility from '../../scripts/utils.js';

export default function decorate(block) {
  // Apply anchorId as element id for deep-linking
  const { anchorId } = block.dataset;
  if (anchorId) block.id = anchorId;

  const items = [...block.children];

  // Determine layout: UE authored (each child = one column cell) vs
  // document-based (each child = one row containing multiple cells).
  // UE model produces items where each child has exactly one content cell.
  // Document-based produces items with 2+ cells per row.
  const isUEAuthored = items.length > 0
    && items.every((item) => item.children.length <= 1);

  if (isUEAuthored && items.length > 1) {
    // Wrap all column items into a single row so CSS grid spans them correctly.
    const row = document.createElement('div');
    row.classList.add('columns-row');

    items.forEach((item) => {
      const cell = document.createElement('div');
      cell.classList.add('columns-col');

      // Move item contents into the cell
      [...item.childNodes].forEach((node) => cell.appendChild(node));

      // Resolve image references and flag image columns
      resolveImageReference(cell);
      if (cell.querySelector('picture, img')) {
        cell.classList.add('columns-img-col');
      }

      row.appendChild(cell);
      item.remove();
    });

    block.appendChild(row);
  } else {
    // Document-based: legacy row/cell structure
    items.forEach((item) => {
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
  }

  decorateExternalLinksUtility(block);
}
