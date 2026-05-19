import { renderBlock } from '../../scripts/multi-theme.js';

export default async function decorate(block) {
  const rows = [...block.children];

  // Row 0: image, Row 1: content
  const imageRow = rows[0];
  const contentRow = rows[1];

  // Extract image
  const picture = imageRow?.querySelector('picture');
  const img = picture?.querySelector('img');
  const altText = img?.alt || '';

  // Extract content
  const content = contentRow?.innerHTML || '';

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
  wrapper.setAttribute('role', 'img');
  wrapper.setAttribute('aria-label', altText);

  // Set background image
  if (img) {
    wrapper.style.backgroundImage = `url('${img.src}')`;
  }

  // Content overlay
  if (content) {
    const overlay = document.createElement('div');
    overlay.className = 'parallax-content';
    overlay.innerHTML = content;
    wrapper.append(overlay);
  }

  block.append(wrapper);

  try {
    await renderBlock(block);
  } catch {
    // brand block-config failed; parallax still renders
  }
}
