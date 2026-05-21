import { renderBlock } from '../../scripts/multi-theme.js';

export default async function decorate(block) {
  const rows = [...block.children];

  // Anchor ID: read from block.id or data attribute only (no row heuristic)
  const anchorId = block.id || block.dataset.anchorId || '';

  // Each remaining row is a flex item
  // UE field order: image(0) | imageAlt(1) | content(2) | itemClasses(3)
  const items = rows.map((row) => {
    const cells = [...row.children];
    const item = document.createElement('div');
    item.className = 'flexbox-item';

    // Detect UE pattern: cell[0] has picture/DAM link AND cell[3] is a width keyword
    const hasImageInFirst = cells[0]?.querySelector('picture, a[href*="/content/dam"]');
    const lastCellText = cells[3]?.textContent?.trim() || '';
    const hasWidthInLast = ['full', 'half', 'third', 'quarter'].includes(lastCellText);
    const isMultiField = cells.length >= 4 && hasImageInFirst && hasWidthInLast;

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
        } else if (cell.hasChildNodes()) {
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
