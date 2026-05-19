import { applyCommonProps } from '../../scripts/utils.js';

export default async function decorate(block) {
  const type = [...block.classList].filter((c) => c !== 'block' && c !== 'header-content').pop();
  block.dataset.type = type || 'menu';

  const secondCol = block.children[1];
  if (secondCol) {
    const toolsLink = secondCol.querySelector(':scope > div > div > p:nth-of-type(2) > a');
    if (toolsLink) toolsLink.classList.add('navigation-content-preview-tools-link');
  }

  const firstCol = block.children[0];
  if (!firstCol) return;

  const wrapper = firstCol.firstElementChild;
  if (!wrapper) return;

  wrapper
    .querySelector(':scope > p:first-child')
    ?.classList.add('navigation-content-preview-heading');

  wrapper
    .querySelector(':scope > p:nth-of-type(2) > a')
    ?.classList.add('navigation-content-preview-link');
  applyCommonProps(block);
}
