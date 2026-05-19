import { renderBlock } from '../../scripts/multi-theme.js';

function sanitizeUrl(url) {
  try {
    const parsed = new URL(url, window.location.origin);
    if (parsed.protocol === 'https:' || parsed.protocol === 'http:') {
      return parsed.href;
    }
  } catch {
    // invalid URL
  }
  return '';
}

export default async function decorate(block) {
  const rows = [...block.children];

  // XWalk field order: image | imageAlt | content | anchorId
  // Row 0: image cell + imageAlt cell
  // Row 1: content cell
  // Row 2: anchorId cell (if present)

  let imgSrc = '';
  let altText = '';
  let anchorId = '';
  const contentFragment = document.createDocumentFragment();

  rows.forEach((row, rowIdx) => {
    const cells = [...row.children];
    cells.forEach((cell) => {
      const picture = cell.querySelector('picture');
      const damLink = cell.querySelector('a[href*="/content/dam"], a[href*=".jpg"], a[href*=".png"], a[href*=".webp"], a[href*=".svg"]');

      if (picture) {
        // Image cell — extract src
        const img = picture.querySelector('img');
        imgSrc = img?.src || '';
      } else if (damLink && !imgSrc) {
        // DAM reference link as image source
        imgSrc = damLink.href;
      } else if (cell.querySelector('h1, h2, h3, h4, h5, h6, p')) {
        // Rich content cell — clone nodes for overlay
        [...cell.childNodes].forEach((node) => {
          contentFragment.append(node.cloneNode(true));
        });
      } else {
        // Plain text cell — could be imageAlt or anchorId
        const text = cell.textContent.trim();
        if (text && !altText && rowIdx === 0) {
          altText = text;
        } else if (text && rowIdx > 0 && !cell.querySelector('h1, h2, h3, h4, h5, h6, p')) {
          anchorId = text;
        }
      }
    });
  });

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

  // Set background image via CSS custom property with URL validation
  const safeUrl = sanitizeUrl(imgSrc);
  if (safeUrl) {
    wrapper.style.setProperty('--parallax-bg-image', `url('${CSS.escape ? safeUrl : encodeURI(safeUrl)}')`);
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
