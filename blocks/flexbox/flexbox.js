import { renderBlock } from '../../scripts/multi-theme.js';

export default async function decorate(block) {
  const rows = [...block.children];

  // Read anchor ID from last row if it's a plain text cell
  const lastRow = rows[rows.length - 1];
  const lastCell = lastRow?.children[0];
  let anchorId = '';
  if (lastCell && !lastCell.querySelector('picture, a, h1, h2, h3, h4, h5, h6')
    && lastCell.children.length <= 1) {
    const text = lastCell.textContent.trim();
    if (text && !text.includes(' ') && text.length < 40) {
      anchorId = text.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]/g, '');
      rows.pop();
    }
  }

  // Each remaining row is a flex item
  const items = rows.map((row) => {
    const cells = [...row.children];
    const item = document.createElement('div');
    item.className = 'flexbox-item';

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
