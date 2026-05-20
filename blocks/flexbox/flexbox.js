import { renderBlock } from '../../scripts/multi-theme.js';

export default async function decorate(block) {
  const rows = [...block.children];

  // Read anchor ID — UE sets block-level fields as attributes or first config rows.
  // Check block's existing id first (UE may set it directly), then check first row.
  let anchorId = block.id || '';
  if (!anchorId && rows.length > 0) {
    const firstCell = rows[0]?.children[0];
    const firstText = firstCell?.textContent?.trim() || '';
    // If first row is a single plain-text cell with no rich content, treat as anchorId
    if (firstCell && rows[0].children.length === 1
      && !firstCell.querySelector('picture, a, h1, h2, h3, h4, h5, h6')
      && firstText && firstText.length < 40 && !/\s/.test(firstText)) {
      anchorId = firstText.toLowerCase().replace(/[^\w-]/g, '');
      rows.shift();
    }
  }

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

      if (contentCell?.textContent?.trim()) {
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
