import { renderBlock } from '../../scripts/multi-theme.js';

export default async function decorate(block) {
  const rows = [...block.children];

  // Anchor ID: UE sets block.id directly from the anchorId model field.
  // No heuristic needed — block.id is authoritative.
  const anchorId = block.id || '';

  // Each remaining row is a flex item
  // UE field order: image(0) | imageAlt(1) | content(2) | itemClasses(3)
  const items = rows.map((row) => {
    const cells = [...row.children];
    const item = document.createElement('div');
    item.className = 'flexbox-item';

    // Detect multi-cell (UE) vs single-cell (document) authoring
    const isMultiField = cells.length >= 3;

    if (isMultiField) {
      // Index-based: image=0, imageAlt=1, content=2, itemClasses=3
      const imageCell = cells[0];
      const altText = cells[1]?.textContent?.trim() || '';
      const contentCell = cells[2];
      const widthValue = cells[3]?.textContent?.trim() || '';

      const picture = imageCell?.querySelector('picture');
      if (picture) {
        const img = picture.querySelector('img');
        if (img && altText) img.alt = altText;
        const imgWrap = document.createElement('div');
        imgWrap.className = 'flexbox-item-image';
        imgWrap.append(picture);
        item.append(imgWrap);
      }

      if (contentCell?.childNodes?.length) {
        const contentWrap = document.createElement('div');
        contentWrap.className = 'flexbox-item-content';
        [...contentCell.childNodes].forEach((node) => {
          contentWrap.append(node.cloneNode(true));
        });
        item.append(contentWrap);
      }

      if (['full', 'half', 'third', 'quarter'].includes(widthValue)) {
        item.dataset.width = widthValue;
      }
    } else {
      // Document authoring: each cell is image or content
      cells.forEach((cell) => {
        const picture = cell.querySelector('picture');
        if (picture) {
          const imgWrap = document.createElement('div');
          imgWrap.className = 'flexbox-item-image';
          imgWrap.append(picture);
          item.append(imgWrap);
        } else if (cell.textContent.trim()) {
          const contentWrap = document.createElement('div');
          contentWrap.className = 'flexbox-item-content';
          [...cell.childNodes].forEach((node) => {
            contentWrap.append(node.cloneNode(true));
          });
          item.append(contentWrap);
        }
      });
    }

    return item;
  });

  // Clear block
  block.textContent = '';

  // Set anchor ID
  if (anchorId) block.id = anchorId;

  // Append flex items
  items.forEach((item) => block.append(item));

  try {
    await renderBlock(block);
  } catch {
    // brand block-config failed; flexbox still renders
  }
}
