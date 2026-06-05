import { renderBlock } from '../../scripts/multi-theme.js';

export default async function decorate(block) {
  const rows = [...block.children];
  const anchorId = block.id || block.dataset.anchorId || '';
  if (anchorId) block.id = anchorId;

  // Detect UE context: rows have data-aue-type instrumentation
  const isUE = rows.some((row) => row.hasAttribute('data-aue-type'));

  if (isUE) {
    // UE mode: decorate in-place to preserve instrumentation
    rows.filter((row) => row.children.length > 0).forEach((row) => {
      row.classList.add('flexbox-item');
      const cells = [...row.children];
      // Field order: image(0) | imageAlt(1) | content(2) | itemClasses(3)
      const imageCell = cells[0];
      const altText = cells[1]?.textContent?.trim() || '';
      const contentCell = cells[2];
      const widthValue = cells[3]?.textContent?.trim() || '';

      if (imageCell) {
        const picture = imageCell.querySelector('picture');
        if (picture) {
          const img = picture.querySelector('img');
          if (img && altText) img.alt = altText;
          imageCell.classList.add('flexbox-item-image');
        }
      }
      if (contentCell) contentCell.classList.add('flexbox-item-content');
      if (cells[1]) cells[1].hidden = true;
      if (cells[3]) cells[3].hidden = true;

      if (['full', 'sixty', 'half', 'third', 'thirty', 'quarter'].includes(widthValue)) {
        row.dataset.width = widthValue;
      }
    });
  } else {
    // Document authoring: rebuild DOM for clean markup, skip empty config rows
    const items = rows.filter((row) => row.textContent.trim() || row.querySelector('picture')).map((row) => {
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
        } else if (cell.hasChildNodes()) {
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

    block.textContent = '';
    items.forEach((item) => block.append(item));
  }

  // Column variant: apply inline styles to ensure layout works inside .abbvie-container grid
  if (block.classList.contains('column')) {
    block.querySelectorAll('.flexbox-item').forEach((item) => {
      item.style.cssText = 'display:grid!important;grid-template-columns:8rem 1fr!important;gap:1.6rem!important;align-items:center!important;padding:2rem!important;background-color:#f8f7fc!important;border-left:4px solid #d9d7f9!important;border-radius:8px!important;margin-bottom:1.2rem!important;';
      const imgDiv = item.querySelector('.flexbox-item-image');
      if (imgDiv) {
        imgDiv.style.cssText = 'width:6.4rem!important;height:6.4rem!important;min-width:6.4rem!important;min-height:6.4rem!important;display:flex!important;align-items:center!important;justify-content:center!important;background-color:#e8e5f5!important;border-radius:50%!important;grid-column:1!important;';
        const img = imgDiv.querySelector('img');
        if (img) img.style.cssText = 'width:4rem!important;height:4rem!important;max-width:4rem!important;object-fit:contain!important;';
      }
      const contentDiv = item.querySelector('.flexbox-item-content');
      if (contentDiv) {
        contentDiv.style.cssText = 'grid-column:2!important;';
        const firstP = contentDiv.querySelector('p:first-child');
        if (firstP) firstP.style.cssText = 'font-size:1.8rem!important;font-weight:700!important;color:#422e83!important;margin-bottom:0.8rem!important;';
      }
    });
  }

  try {
    await renderBlock(block);
  } catch {
    // brand block-config failed; flexbox still renders
  }
}
