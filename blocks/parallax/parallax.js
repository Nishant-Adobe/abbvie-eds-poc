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

  // Find content — all non-image text content (exclude image cells and DAM link cells)
  let contentHTML = '';
  rows.forEach((row) => {
    const cells = [...row.children];
    cells.forEach((cell) => {
      const hasPicture = cell.querySelector('picture');
      const hasDAMLink = cell.querySelector('a[href*="/content/dam"], a[href*=".jpg"], a[href*=".png"], a[href*=".webp"], a[href*=".svg"]');
      if (!hasPicture && !hasDAMLink) {
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
