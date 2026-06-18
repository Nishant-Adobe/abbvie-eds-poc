import { applyCommonProps } from '../../scripts/utils.js';

export default function decorate(block) {
  applyCommonProps(block);
  const row = block.querySelector(':scope > div');
  if (!row) return;
  const cell = row.querySelector(':scope > div');
  if (cell) {
    while (cell.firstChild) {
      row.parentElement.insertBefore(cell.firstChild, row);
    }
    row.remove();
  }
  // Remove any remaining framework rows (classes placeholder, etc.)
  [...block.querySelectorAll(':scope > div')].forEach((r) => {
    const text = r.textContent.trim();
    if (text === '-' || text === '' || text === 'none') r.remove();
  });
}
