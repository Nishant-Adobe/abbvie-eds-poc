import { applyCommonProps } from '../../scripts/utils.js';

const LINE1_SPAN_CLASSES = 'cta-card-grid-line-1 abbv-icon-keyboard_arrow_right i-a';

/**
 * UE may emit <strong> for the brand; reference uses .cta-card-grid-risa-pri.
 * Plain "SKYRIZI VS" gets the brand span for SKYRIZI.
 */
function normalizeLine1Html(html) {
  let h = (html || '').trim();
  if (!h) return '';
  h = h
    .replace(/<strong\b[^>]*>([\s\S]*?)<\/strong>/gi, '<span class="cta-card-grid-risa-pri">$1</span>')
    .replace(/<b\b[^>]*>([\s\S]*?)<\/b>/gi, '<span class="cta-card-grid-risa-pri">$1</span>');
  if (!h.includes('cta-card-grid-risa-pri')) {
    h = h.replace(/\bSKYRIZI\b/i, '<span class="cta-card-grid-risa-pri">SKYRIZI</span>');
  }
  return h;
}

function normalizeLine3Html(html) {
  const h = (html || '').trim();
  if (!h || h.includes('<sup')) return h;
  const m = h.match(/^(\([^)]+\))\s*(\d+)\s*(\*\*)?\s*$/);
  if (m) return `${m[1]}<sup>${m[2]}</sup>${m[3] ?? ''}`;
  return h;
}

function cellParagraph(cell) {
  return cell?.querySelector('p') ?? null;
}

/**
 * Reuse the authored anchor (preserves href, title, aria-*, target, rel, etc.).
 * @param {HTMLElement | undefined} cell
 * @returns {HTMLAnchorElement}
 */
function extractLinkAnchor(cell) {
  const source = cell?.querySelector('a[href]');
  if (source) {
    const a = /** @type {HTMLAnchorElement} */ (source.cloneNode(false));
    a.classList.add('cta-card-grid-link');
    return a;
  }
  const a = document.createElement('a');
  a.href = '#';
  a.target = '_self';
  a.classList.add('cta-card-grid-link');
  return a;
}

/**
 * Decorate one nested grid card (no separate grid-card block JS — handled here).
 * @param {HTMLElement} card
 */
function decorateGridCard(card) {
  applyCommonProps(card);

  const cells = [...card.children];
  if (cells.length < 5) return;

  const wrapLink = extractLinkAnchor(cells[0]);
  const line1 = normalizeLine1Html(cellParagraph(cells[1])?.innerHTML ?? '');
  const line2 = cellParagraph(cells[2])?.innerHTML?.trim() ?? '';
  const line3 = normalizeLine3Html(cellParagraph(cells[3])?.innerHTML ?? '');
  const line4 = cellParagraph(cells[4])?.innerHTML?.trim() ?? '';

  const inner = document.createElement('div');
  inner.className = 'cta-card-grid';

  const p = document.createElement('p');

  const span1 = document.createElement('span');
  span1.className = LINE1_SPAN_CLASSES;
  span1.innerHTML = line1;

  const span2 = document.createElement('span');
  span2.className = 'cta-card-grid-line-2';
  span2.innerHTML = line2;

  const span3 = document.createElement('span');
  span3.className = 'cta-card-grid-line-3';
  span3.innerHTML = line3;

  const span4 = document.createElement('span');
  span4.className = 'cta-card-grid-line-4';
  span4.innerHTML = line4;

  p.append(span1, span2, span3, span4);
  inner.append(p);
  wrapLink.append(inner);

  card.textContent = '';
  card.classList.add('cta-card-grid-richtext');
  card.append(wrapLink);
}

/**
 * Nested grid cards are not loaded as separate blocks (no grid-card.js).
 * @param {HTMLElement} block
 */
export default function decorate(block) {
  applyCommonProps(block);

  const nestedCards = [...block.querySelectorAll(':scope > .grid-card')];
  if (nestedCards.length === 0) return;

  nestedCards.forEach((card) => decorateGridCard(card));

  const container = document.createElement('div');
  container.classList.add('cta-card-grid-container');
  nestedCards.forEach((card) => container.append(card));
  block.replaceChildren(container);
}
