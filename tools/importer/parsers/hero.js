/* eslint-disable */
/* global WebImporter */

/**
 * Hero parser — LINZESS find-relief editorial hero.
 *
 * Source instance: `.hero-container.abbv-image-text-v2` (unique, not in a
 * modal). Contains the image-swap <picture> (desktop/mobile sources), an
 * eyebrow (.abbv-eyebrow) and an <h1>.
 *
 * Emits the 8-row hero block table (FieldGroups), variant
 * `no-padding text-left linzess-behind-nav-linzess-editorial-hero`:
 *   row 1: image (desktop)    row 2: mobileImage   row 3: eyebrow
 *   row 4: indication (empty) row 5: text (h1)     row 6: layers (empty)
 *   row 7: video (empty)      row 8: imageCaption (empty)
 *
 * Replaces `element` itself so the import validator can locate the created
 * block (it must remain at the element's original position).
 */
export default function parse(element, { document }) {
  // Desktop + mobile images from the image-swap <picture>.
  const picture = element.querySelector('picture');
  let desktopSrc = '';
  let mobileSrc = '';
  if (picture) {
    const sources = [...picture.querySelectorAll('source')];
    const desktop = sources.find((s) => /min-width:\s*985px/.test(s.media)) || sources[0];
    const mobile = sources.find((s) => /max-width:\s*600px/.test(s.media))
      || sources.find((s) => /max-width:\s*984px/.test(s.media));
    desktopSrc = (desktop && desktop.getAttribute('srcset'))
      || picture.querySelector('img')?.getAttribute('src') || '';
    mobileSrc = (mobile && mobile.getAttribute('srcset')) || '';
  }

  const makePicture = (src) => {
    if (!src) return '';
    const p = document.createElement('picture');
    const img = document.createElement('img');
    img.setAttribute('src', src);
    p.append(img);
    return p;
  };

  const eyebrow = element.querySelector('.abbv-eyebrow, [class*="eyebrow"]');
  const eyebrowText = eyebrow ? eyebrow.textContent.trim() : '';

  const h1 = element.querySelector('h1');
  const textCell = document.createElement('div');
  if (h1) textCell.append(h1.cloneNode(true));

  const cells = [
    ['Hero (no-padding, text-left, linzess-behind-nav-linzess-editorial-hero)'],
    [makePicture(desktopSrc)],
    [makePicture(mobileSrc)],
    [eyebrowText],
    [''],
    [textCell],
    [''],
    [''],
    [''],
  ];

  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
