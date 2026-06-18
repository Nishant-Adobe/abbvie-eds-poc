import { resolveImageReference } from '../../scripts/scripts.js';
import decorateExternalLinksUtility from '../../scripts/utils.js';

// Promo card swaps to the desktop artwork at tablet (matches live). The savings
// card keeps the curved mobile artwork all the way up to the 986px desktop
// breakpoint, so it gets a wider media query.
const MOBILE_IMAGE_MEDIA = '(max-width: 743px)';
const SAVINGS_MOBILE_IMAGE_MEDIA = '(max-width: 985px)';

/**
 * When a column image cell holds two images (desktop + mobile variant), merge
 * them into a single responsive <picture>: the first picture is the desktop
 * fallback, the second image becomes a mobile <source>. Matches the live site
 * which swaps to a curved mobile artwork below the tablet breakpoint.
 */
function applyMobileImageSource(cell, mediaQuery = MOBILE_IMAGE_MEDIA) {
  const pictures = [...cell.querySelectorAll('picture')];
  if (pictures.length < 2) return;

  const [desktopPicture, mobilePicture] = pictures;
  const mobileImg = mobilePicture.querySelector('img');
  if (!mobileImg) return;

  // Prefer an optimized <source> srcset (AEM-processed images) and fall back
  // to the <img> src (plain content) so the mobile artwork resolves either way.
  const mobileSource = mobilePicture.querySelector('source[srcset]');
  const mobileSrcset = mobileSource?.getAttribute('srcset') || mobileImg.getAttribute('src');
  if (mobileSrcset) {
    const source = document.createElement('source');
    source.setAttribute('media', mediaQuery);
    source.setAttribute('srcset', mobileSrcset);
    desktopPicture.prepend(source);
  }
  // remove the now-merged second image and any empty wrapper it left behind
  const mobileWrapper = mobilePicture.parentElement;
  mobilePicture.remove();
  if (mobileWrapper && mobileWrapper !== cell && !mobileWrapper.querySelector('picture, img')) {
    mobileWrapper.remove();
  }
}

export default function decorate(block) {
  const rowData = [...block.children];
  // The optional first row is an anchorId config ONLY when it is a single cell
  // holding plain text (no image/heading/link and no second column cell). A
  // multi-cell row, or one containing media/markup, is a real content column
  // and must NOT be consumed — otherwise the first column silently disappears
  // (or an empty placeholder row becomes a phantom 0-width column).
  const firstRow = rowData[0];
  const firstCells = firstRow ? [...firstRow.children] : [];
  const isAnchorRow = firstCells.length === 1
    && !firstCells[0].querySelector('picture, img, h1, h2, h3, h4, h5, h6, a, ul, ol');
  if (isAnchorRow) {
    const anchorId = firstCells[0].textContent.trim();
    if (anchorId) block.id = anchorId;
    firstRow.remove();
    rowData.shift();
  }

  // The savings card keeps its mobile artwork through the tablet breakpoint;
  // every other column (e.g. the promo card) swaps to desktop at >743px.
  const isSavings = block.classList.contains('columns-homepage-savings')
    || block.classList.contains('columns-resources-savings');
  const imageMedia = isSavings ? SAVINGS_MOBILE_IMAGE_MEDIA : MOBILE_IMAGE_MEDIA;

  rowData.forEach((item) => {
    item.classList.add('columns-item');

    [...item.children].forEach((cell) => {
      resolveImageReference(cell);
      if (cell.querySelector('picture, img')) {
        cell.classList.add('columns-item-image');
        applyMobileImageSource(cell, imageMedia);
      } else {
        cell.classList.add('columns-item-content');
      }
    });
  });

  decorateExternalLinksUtility(block);
}
