/* eslint-disable */
/* global WebImporter */
/**
 * Parser for variant: hero
 * Base block: hero
 * Source: https://www.linzess.com/starting-linzess/healthy-routines/keeping-in-touch-with-your-doctor
 * Generated: 2026-06-18
 *
 * Linzess "behind-nav editorial hero". Mirrors the already-migrated sibling page
 * (content/linzess/healthy-routines/otc-and-prescription-treatments.plain.html) exactly:
 * block class string `hero no-padding text-left linzess-behind-nav-linzess-editorial-hero`
 * with an 8-row xwalk structure that round-trips through md2jcr (one row per hero
 * model field group, in model order):
 *   row1 image (desktop picture)        <!-- field:image -->
 *   row2 mobileImage (mobile picture)   <!-- field:mobileImage -->
 *   row3 eyebrow                        <!-- field:eyebrow -->
 *   row4 indication (empty)
 *   row5 text (h1)                      <!-- field:text -->
 *   row6 layers (empty)
 *   row7 video (empty)
 *   row8 imageCaption (empty)
 */

// Source (live/hashed) image references -> local DAM paths. The live hero ships a single
// responsive <img>; the editorial-hero layout needs distinct desktop + mobile crops, which
// live in the project DAM. Map any source src to the correct DAM crop.
const DESKTOP_IMAGE = '/content/dam/abbvie-eds-poc/linzess/images/article-intouch-desktop.jpg';
const MOBILE_IMAGE = '/content/dam/abbvie-eds-poc/linzess/images/article-intouch-mobile.jpg';

function buildPicture(document, src, alt) {
  const picture = document.createElement('picture');
  const img = document.createElement('img');
  img.setAttribute('src', src);
  img.setAttribute('alt', alt || '');
  picture.appendChild(img);
  return picture;
}

function hintedCell(document, fieldName, content) {
  // xwalk field hint: comment BEFORE content, inside the cell.
  const frag = document.createDocumentFragment();
  frag.appendChild(document.createComment(` field:${fieldName} `));
  if (content) frag.appendChild(content);
  return frag;
}

export default function parse(element, { document }) {
  // --- Eyebrow (Resources / Healthy Routines) ---
  const eyebrowEl = element.querySelector('p.eyebrow--white, p.eyebrow, .eyebrow');
  const eyebrowText = eyebrowEl ? eyebrowEl.textContent.trim() : '';

  // --- Heading: live wraps with <br>, sibling uses a single plain-text <h1>. ---
  const sourceH1 = element.querySelector('h1');
  const heading = document.createElement('h1');
  if (sourceH1) {
    heading.textContent = sourceH1.textContent.replace(/\s+/g, ' ').trim();
  } else {
    heading.textContent = '';
  }

  // Empty-block guard.
  if (!eyebrowText && !heading.textContent) {
    element.replaceWith(...element.childNodes);
    return;
  }

  const cells = [];

  // row1: desktop image (field:image)
  cells.push([hintedCell(document, 'image', buildPicture(document, DESKTOP_IMAGE, heading.textContent))]);

  // row2: mobile image (field:mobileImage)
  cells.push([hintedCell(document, 'mobileImage', buildPicture(document, MOBILE_IMAGE, heading.textContent))]);

  // row3: eyebrow text (field:eyebrow)
  const eyebrowOut = document.createElement('p');
  eyebrowOut.textContent = eyebrowText;
  cells.push([hintedCell(document, 'eyebrow', eyebrowOut)]);

  // row4: indication (empty — no hint on empty cells)
  cells.push(['']);

  // row5: heading & body text (field:text)
  cells.push([hintedCell(document, 'text', heading)]);

  // row6: layers (empty)
  cells.push(['']);

  // row7: video (empty)
  cells.push(['']);

  // row8: imageCaption (empty)
  cells.push(['']);

  const block = WebImporter.Blocks.createBlock(document, {
    name: 'hero no-padding text-left linzess-behind-nav-linzess-editorial-hero',
    cells,
  });
  element.replaceWith(block);
}
