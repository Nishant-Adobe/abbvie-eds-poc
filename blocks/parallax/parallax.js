import { renderBlock } from '../../scripts/multi-theme.js';

export default async function decorate(block) {
  const rows = [...block.children];

  // Find image from any row/cell
  const picture = block.querySelector('picture');
  const img = picture?.querySelector('img');
  const altText = img?.alt || '';
  const imgSrc = img?.src || '';

  // Find content — all non-image text content
  let contentHTML = '';
  rows.forEach((row) => {
    const cells = [...row.children];
    cells.forEach((cell) => {
      if (!cell.querySelector('picture')) {
        const text = cell.innerHTML.trim();
        if (text) contentHTML += text;
      }
    });
  });

  // Get speed variant from block classes
  let speed = 'medium';
  if (block.classList.contains('slow')) speed = 'slow';
  else if (block.classList.contains('fast')) speed = 'fast';

  // Clear block
  block.textContent = '';

  // Build parallax structure
  const wrapper = document.createElement('div');
  wrapper.className = 'parallax-wrapper';
  wrapper.dataset.speed = speed;
  if (altText) {
    wrapper.setAttribute('role', 'img');
    wrapper.setAttribute('aria-label', altText);
  }

  // Set background image
  if (imgSrc) {
    wrapper.style.backgroundImage = `url('${imgSrc}')`;
  }

  // Content overlay
  if (contentHTML) {
    const overlay = document.createElement('div');
    overlay.className = 'parallax-content';
    overlay.innerHTML = contentHTML;
    wrapper.append(overlay);
  }

  block.append(wrapper);

  try {
    await renderBlock(block);
  } catch {
    // brand block-config failed; parallax still renders
  }
}
