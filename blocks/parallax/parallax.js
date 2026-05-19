import { renderBlock } from '../../scripts/multi-theme.js';

export default async function decorate(block) {
  const rows = [...block.children];

  // Find image — could be a <picture> element or a DAM reference <a> link
  const picture = block.querySelector('picture');
  const img = picture?.querySelector('img');
  let imgSrc = img?.src || '';
  let altText = img?.alt || '';

  // If no picture, check for a DAM reference link
  if (!imgSrc) {
    const link = block.querySelector('a[href*="/content/dam"], a[href*=".jpg"], a[href*=".png"], a[href*=".webp"], a[href*=".svg"]');
    if (link) {
      imgSrc = link.href;
      altText = link.textContent.trim() || altText;
    }
  }

  // Find content — clone non-image cells (avoid innerHTML re-parse)
  const contentFragment = document.createDocumentFragment();
  rows.forEach((row) => {
    const cells = [...row.children];
    cells.forEach((cell) => {
      const hasPicture = cell.querySelector('picture');
      const hasDAMLink = cell.querySelector('a[href*="/content/dam"], a[href*=".jpg"], a[href*=".png"], a[href*=".webp"], a[href*=".svg"]');
      if (!hasPicture && !hasDAMLink && cell.textContent.trim()) {
        [...cell.childNodes].forEach((node) => {
          contentFragment.append(node.cloneNode(true));
        });
      }
    });
  });

  // Read anchorId from authored content
  const anchorId = block.querySelector('[data-anchor-id]')?.dataset.anchorId
    || block.closest('[id]')?.id || '';

  // Clear block
  block.textContent = '';

  // Set anchor ID if authored
  if (anchorId) block.id = anchorId;

  // Build parallax structure
  const wrapper = document.createElement('div');
  wrapper.className = 'parallax-wrapper';
  if (altText) {
    wrapper.setAttribute('role', 'img');
    wrapper.setAttribute('aria-label', altText);
  }

  // Set background image via CSS custom property (no inline style)
  if (imgSrc) {
    wrapper.style.setProperty('--parallax-bg-image', `url('${imgSrc}')`);
  }

  // Content overlay — append cloned DOM nodes (no innerHTML)
  if (contentFragment.childNodes.length) {
    const overlay = document.createElement('div');
    overlay.className = 'parallax-content';
    overlay.append(contentFragment);
    wrapper.append(overlay);
  }

  block.append(wrapper);

  try {
    await renderBlock(block);
  } catch {
    // brand block-config failed; parallax still renders
  }
}
