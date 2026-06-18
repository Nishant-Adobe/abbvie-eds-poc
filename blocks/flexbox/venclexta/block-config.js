import { rebuildTables } from '../flexbox.js';

const widthValues = ['full', 'sixty', 'half', 'third', 'thirty', 'quarter'];

// Venclexta document-authoring build for flexbox (the incoming flexbox change).
// Base flexbox.js calls renderBlock before its own build for the document path,
// so this runs on the raw cells and the base skips its build once items exist.
function buildItems(block) {
  const rows = [...block.children];
  // UE is decorated in-place by the base block; never rebuild that here.
  if (rows.some((row) => row.hasAttribute('data-aue-type'))) return;
  if (block.querySelector('.flexbox-item')) return;

  const items = rows
    .filter((row) => row.textContent.trim() || row.querySelector('picture'))
    .map((row) => {
      const cells = [...row.children];
      const item = document.createElement('div');
      item.className = 'flexbox-item';

      cells.forEach((cell, idx) => {
        const text = cell.textContent.trim();
        // Skip itemClasses cell (last cell with width keyword)
        if (idx === cells.length - 1 && widthValues.includes(text)) {
          item.dataset.width = text;
          return;
        }
        const picture = cell.querySelector('picture');
        if (picture) {
          const imgWrap = document.createElement('div');
          imgWrap.className = 'flexbox-item-image';
          imgWrap.append(picture);
          item.append(imgWrap);
        } else if (cell.hasChildNodes() && text) {
          const contentWrap = document.createElement('div');
          contentWrap.className = 'flexbox-item-content';
          [...cell.childNodes].forEach((node) => {
            contentWrap.append(node.cloneNode(true));
          });
          rebuildTables(contentWrap);
          item.append(contentWrap);
        }
      });

      return item;
    });

  if (items.length === 0) return;
  block.textContent = '';
  items.forEach((item) => block.append(item));
}

export default async function getBlockConfigs() {
  return {
    flags: {},
    variations: [],
    decorations: {
      decorate: (block) => buildItems(block),
    },
  };
}
