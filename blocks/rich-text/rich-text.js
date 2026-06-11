import { applyCommonProps, shouldRunOutsideAuthorEdit } from '../../scripts/utils.js';

export default function decorate(block) {
  applyCommonProps(block);
  // Hoisting cell content out of the block and removing the row strips the
  // UE editable instrumentation. Keep the block intact in the editor.
  if (!shouldRunOutsideAuthorEdit()) return;
  const row = block.querySelector(':scope > div');
  if (!row) return;
  const cell = row.querySelector(':scope > div');
  if (cell) {
    while (cell.firstChild) {
      row.parentElement.insertBefore(cell.firstChild, row);
    }
    row.remove();
  }
}
