/* eslint-disable */
/* global WebImporter */
/**
 * Parser for the "columns" block (multi-variant).
 * Base block: columns
 * Source: https://www.linzess.com/starting-linzess/healthy-routines/keeping-in-touch-with-your-doctor
 * Template: linzess-healthy-routines-article
 * Generated: 2026-06-18
 *
 * The "columns" block appears 6 times on this page family, each a DIFFERENT variant.
 * page-templates.json maps these instance selectors to this single parser, so the
 * parser must DETECT which variant a given element is and emit the matching table.
 *
 * Variants (detected from the element + its band ancestor):
 *   1. kit-touchpoints  — white band, div.columns.parbase with .abbv-image-text children
 *                         (4 image+richtext cards).
 *   2. kit-relief (A)   — dark-purple band, div.columns.parbase with rich-text columns
 *                         (2 text columns: body+footnote | list card).
 *   3. kit-relief (B)   — dark-purple band, div.image-text-v2.parbase side-effects
 *                         (LEFT patient image, RIGHT body + list + paragraph).
 *   4. kit-conversation — light-purple band, div.image-text-v2.parbase thought-bubbles
 *                         (1 image column with desktop + mobile picture).
 *   5. more-like-this   — white band, div.flexbox-v2.parbase article cards
 *                         (3 cards: image + bold title + "Read the article" link).
 *   6. cta-cards        — div.flexbox-v2.parbase CTA cards
 *                         (2 cards: title + "Learn More" link, no image).
 *
 * XWALK NOTES:
 *  - Columns blocks do NOT use field hints (see hinting.md Rule 4 exception).
 *  - ONE ROW PER COLUMN ITEM. The variant class string goes in the FIRST row
 *    (single cell), exactly as the sibling .plain.html does.
 *  - Block name in the table header is "columns" (the exact variant goes in row 1).
 *  - Images are rewritten to local DAM paths /content/dam/abbvie-eds-poc/linzess/images/<file>.
 */

const DAM_BASE = '/content/dam/abbvie-eds-poc/linzess/images';

/**
 * Map a live/source image src (linzess.com URL or local hashed path) to the
 * canonical DAM path by matching a distinctive filename token. Falls back to
 * appending the basename to DAM_BASE so nothing is ever lost.
 */
function toDamSrc(src) {
  if (!src) return src;
  const lower = src.toLowerCase();
  const token = [
    // kit-touchpoints icon cards
    ['speak-up', '4.1.1-d-keeping-in-touch-with-your-doctor-speak-up@2x.png'],
    ['sugarcoat', '4.1.1-d-keeping-in-touch-with-your-doctor-sugarcoat@2x.png'],
    ['ask-questions', '4.1.1-d-keeping-in-touch-with-your-doctor-ask-questions@2x.png'],
    ['notes', '4.1.1-d-keeping-in-touch-with-your-doctor-notes@2x.png'],
    // kit-relief (B) patient illustration
    ['patient', '4.1.1-d-keeping-in-touch-with-your-doctor-patient@2x.png'],
    // kit-conversation thought bubbles (desktop + mobile)
    ['4.1.1-m', '4.1.1-m-keeping-in-touch-with-your-doctor-thought-bubbles-no-bkg@2x.png'],
    ['thought-bubbles', '4.1.1-d-keeping-in-touch-with-your-doctor-thought-bubbles-no-bkg@2x.png'],
    ['chat-bubbles', '4.1.1-d-keeping-in-touch-with-your-doctor-thought-bubbles-no-bkg@2x.png'],
    // more-like-this article cards
    ['food-swap', 'Article-FoodSwap-card.jpg'],
    ['foodswap', 'Article-FoodSwap-card.jpg'],
    ['otc-treatments', 'Article-OTC-Treatments-card.jpg'],
    ['otc', 'Article-OTC-Treatments-card.jpg'],
    ['tackling', 'Article-TacklingIBS-card.jpg'],
    ['ibs', 'Article-TacklingIBS-card.jpg'],
  ].find(([k]) => lower.includes(k));
  if (token) return `${DAM_BASE}/${token[1]}`;
  // Fallback: keep basename under the DAM folder.
  const base = src.split('?')[0].split('#')[0].split('/').pop();
  return `${DAM_BASE}/${base}`;
}

/** Build a <picture><img></picture> with a DAM src and given alt. */
function buildPicture(document, src, alt) {
  const picture = document.createElement('picture');
  const img = document.createElement('img');
  img.setAttribute('src', toDamSrc(src));
  if (alt) img.setAttribute('alt', alt);
  picture.appendChild(img);
  return picture;
}

/** Wrap one or more nodes in a <p>. */
function wrapInP(document, ...nodes) {
  const p = document.createElement('p');
  nodes.forEach((n) => p.appendChild(n));
  return p;
}

/* ----------------------------------------------------------------------------
 * Variant detection
 * ------------------------------------------------------------------------- */

function detectVariant(element) {
  const band = element.closest('.abbv-container') || element.parentElement;
  const bandClass = band ? band.className : '';
  const isColumnsComp = element.classList.contains('columns'); // div.columns.parbase
  const isImageTextV2 = element.classList.contains('image-text-v2'); // div.image-text-v2.parbase
  const isFlexbox = element.classList.contains('flexbox-v2')
    || !!element.querySelector('.abbv-flex-container-v2'); // div.flexbox-v2.parbase or wrapper

  // CTA cards: flexbox cards that have CTA links and NO images.
  if (isFlexbox && element.querySelector('.cta a, a.abbv-button-primary.i-a')
    && !element.querySelector('img, picture')) {
    return 'cta-cards';
  }
  // More like this: flexbox article cards (image + title + read-the-article link).
  if (isFlexbox && element.querySelector('img, picture')) {
    return 'more-like-this';
  }
  // White touchpoints band: columns component with image+text cards.
  if (isColumnsComp && element.querySelector('.abbv-image-text')) {
    return 'kit-touchpoints';
  }
  // Dark-purple band, columns component with rich-text columns → relief A (2-col text).
  if (isColumnsComp) {
    return 'kit-relief';
  }
  // image-text-v2 instances: distinguish conversation (light-purple, swap/two-picture)
  // from side-effects (dark-purple, patient image).
  if (isImageTextV2) {
    if (/background-light-purple/.test(bandClass)
      || element.querySelector('.abbv-image-swap, .linzess-article-chat-bubbles')) {
      return 'kit-conversation';
    }
    if (/background-dark-purple/.test(bandClass)
      || element.querySelector('.linzess-article-side-effects-img')) {
      return 'kit-relief';
    }
    return 'kit-conversation';
  }
  // Last resort.
  return 'kit-touchpoints';
}

/* ----------------------------------------------------------------------------
 * Per-variant cell builders. Each returns an array of rows; each row is a
 * single-cell array (one column item per row), matching the reference .plain.html.
 * ------------------------------------------------------------------------- */

// kit-touchpoints: 4 cards, each = picture + bold title + body paragraph.
function buildTouchpoints(element, { document }) {
  const rows = [];
  const cards = element.querySelectorAll('.abbv-image-text');
  cards.forEach((card) => {
    const cell = [];
    const img = card.querySelector('img');
    if (img) cell.push(wrapInP(document, buildPicture(document, img.getAttribute('src'), img.getAttribute('alt') || '')));
    const display = card.querySelector('.abbv-image-text-display, .abbv-image-text-content');
    if (display) {
      const titleSrc = display.querySelector('p.heading-2, p[class*="heading"]');
      const paras = Array.from(display.querySelectorAll('p')).filter((p) => p !== titleSrc);
      if (titleSrc) {
        const strong = document.createElement('strong');
        strong.textContent = titleSrc.textContent.trim();
        cell.push(wrapInP(document, strong));
      }
      paras.forEach((p) => {
        if (p.textContent.trim()) cell.push(wrapInP(document, document.createTextNode(p.textContent.trim())));
      });
    }
    if (cell.length) rows.push([cell]);
  });
  return rows;
}

// kit-relief A: 2 rich-text columns (body+footnote | heading + list card).
function buildReliefText(element, { document }) {
  const rows = [];
  const cols = element.querySelectorAll('.abbv-col');
  cols.forEach((col) => {
    const rt = col.querySelector('.abbv-rich-text') || col;
    const cell = [];
    Array.from(rt.children).forEach((child) => {
      if (child.textContent.trim() || child.querySelector('li')) cell.push(child);
    });
    if (cell.length) rows.push([cell]);
  });
  return rows;
}

// kit-relief B: side-effects image-text-v2 → LEFT patient image, RIGHT body + list + paragraph.
function buildReliefSideEffects(element, { document }) {
  const rows = [];
  // LEFT column item: patient image (MUST be present).
  const img = element.querySelector('.abbv-image-content-container-v2 img, img');
  if (img) {
    rows.push([[wrapInP(document, buildPicture(document, img.getAttribute('src'), img.getAttribute('alt') || 'patient'))]]);
  }
  // RIGHT column item: body paragraph(s) + list + closing paragraph.
  const body = element.querySelector('.abbv-stretched-card-body, .abbv-image-text-display-v2');
  if (body) {
    const cell = [];
    Array.from(body.children).forEach((child) => {
      if (child.matches('.icon-image-card')) {
        const ul = child.querySelector('ul');
        if (ul) cell.push(ul);
      } else if (child.textContent.trim()) {
        cell.push(child);
      }
    });
    if (cell.length) rows.push([cell]);
  }
  return rows;
}

// kit-conversation: 1 image column item with desktop + mobile picture.
function buildConversation(element, { document }) {
  const img = element.querySelector('.abbv-image-content-container-v2 img, picture img, img');
  const alt = img ? (img.getAttribute('alt') || '') : '';
  const desktopSrc = img ? img.getAttribute('src') : '';
  const cell = [];
  // Desktop picture (image field).
  cell.push(wrapInP(document, buildPicture(document, desktopSrc, alt)));
  // Mobile picture (mobileImage field) — explicit 4.1.1-m thought-bubbles asset.
  cell.push(wrapInP(document, buildPicture(document, '4.1.1-m-thought-bubbles', alt)));
  return [[cell]];
}

// more-like-this: 3 article cards = picture + title + "Read the article" link.
function buildMoreLikeThis(element, { document }) {
  const rows = [];
  // One card boundary = .flexboxitem-v2 (it wraps the inner .abbv-image-text-v2).
  // Fall back to .abbv-image-text-v2 only when no flexbox item wrappers exist.
  let cards = element.querySelectorAll('.flexboxitem-v2');
  if (!cards.length) cards = element.querySelectorAll('.abbv-image-text-v2');
  cards.forEach((card) => {
    const cell = [];
    const img = card.querySelector('img');
    if (img) cell.push(wrapInP(document, buildPicture(document, img.getAttribute('src'), img.getAttribute('alt') || '')));
    const titleEl = card.querySelector('.abbv-stretched-card-body p, p b, p strong');
    if (titleEl) {
      const text = (titleEl.closest('p') || titleEl).textContent.replace(/\s+/g, ' ').trim();
      cell.push(wrapInP(document, document.createTextNode(text)));
    }
    const link = card.querySelector('a.abbv-image-text-link, a[title="Read the article"], a');
    if (link) {
      const a = document.createElement('a');
      a.setAttribute('href', link.getAttribute('href') || '');
      a.textContent = (link.textContent || 'Read the article').trim();
      cell.push(wrapInP(document, a));
    }
    if (cell.length) rows.push([cell]);
  });
  return rows;
}

// cta-cards: 2 CTA cards = title + "Learn More" link (no image).
function buildCtaCards(element, { document }) {
  const rows = [];
  // One card boundary = .flexboxitem-v2 (it wraps .abbv-flex-item-v2). Fall back
  // to .abbv-flex-item-v2 only when no flexbox item wrappers exist.
  let items = element.querySelectorAll('.flexboxitem-v2');
  if (!items.length) items = element.querySelectorAll('.abbv-flex-item-v2');
  items.forEach((item) => {
    const cell = [];
    const titleEl = item.querySelector('.abbv-rich-text p, p.heading-2, p');
    if (titleEl && titleEl.textContent.trim()) {
      cell.push(wrapInP(document, document.createTextNode(titleEl.textContent.trim())));
    }
    const link = item.querySelector('.cta a, a.abbv-button-primary, a');
    if (link) {
      const a = document.createElement('a');
      a.setAttribute('href', link.getAttribute('href') || '');
      a.textContent = (link.textContent || 'Learn More').trim();
      cell.push(wrapInP(document, a));
    }
    if (cell.length) rows.push([cell]);
  });
  return rows;
}

/* ----------------------------------------------------------------------------
 * Entry point
 * ------------------------------------------------------------------------- */

export default function parse(element, { document }) {
  const variant = detectVariant(element);

  let itemRows;
  switch (variant) {
    case 'kit-touchpoints':
      itemRows = buildTouchpoints(element, { document });
      break;
    case 'kit-conversation':
      itemRows = buildConversation(element, { document });
      break;
    case 'more-like-this':
      itemRows = buildMoreLikeThis(element, { document });
      break;
    case 'cta-cards':
      itemRows = buildCtaCards(element, { document });
      break;
    case 'kit-relief':
      // Two kit-relief instances share one variant but different DOM:
      //  - columns component (2 text columns) → relief A
      //  - image-text-v2 (patient image + side effects) → relief B
      itemRows = element.classList.contains('image-text-v2')
        ? buildReliefSideEffects(element, { document })
        : buildReliefText(element, { document });
      break;
    default:
      itemRows = buildTouchpoints(element, { document });
  }

  // Empty-block guard: if nothing extracted, unwrap rather than emit an empty block.
  if (!itemRows || !itemRows.length) {
    element.replaceWith(...element.childNodes);
    return;
  }

  // Row 0 = variant class string (single cell), per the sibling .plain.html.
  const cells = [[variant], ...itemRows];

  const block = WebImporter.Blocks.createBlock(document, { name: 'columns', cells });
  element.replaceWith(block);
}
