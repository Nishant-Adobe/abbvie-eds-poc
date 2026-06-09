import { resolveImageReference } from '../../scripts/scripts.js';
import decorateExternalLinksUtility from '../../scripts/utils.js';

const MOBILE_IMAGE_MEDIA = '(max-width: 767px)';

/**
 * When a column image cell holds two images (desktop + mobile variant), merge
 * them into a single responsive <picture>: the first picture is the desktop
 * fallback, the second image becomes a mobile <source>. Matches the live site
 * which swaps to a curved mobile artwork below the tablet breakpoint.
 */
function applyMobileImageSource(cell) {
  const pictures = [...cell.querySelectorAll('picture')];
  if (pictures.length < 2) return;

  const [desktopPicture, mobilePicture] = pictures;
  const mobileImg = mobilePicture.querySelector('img');
  if (!mobileImg) return;

  const mobileSrcset = mobileImg.getAttribute('src');
  if (mobileSrcset) {
    const source = document.createElement('source');
    source.setAttribute('media', MOBILE_IMAGE_MEDIA);
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
  const anchorId = rowData[0]?.textContent.trim();
  if (anchorId) {
    block.id = anchorId;
    rowData[0]?.remove();
  }

  rowData.forEach((item) => {
    item.classList.add('columns-item');

    [...item.children].forEach((cell) => {
      resolveImageReference(cell);
      if (cell.querySelector('picture, img')) {
        cell.classList.add('columns-item-image');
        applyMobileImageSource(cell);
      } else {
        cell.classList.add('columns-item-content');
      }
    });
  });

  decorateExternalLinksUtility(block);
}
