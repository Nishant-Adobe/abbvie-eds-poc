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

/**
 * Plain "(secukinumab) 10" or "(secukinumab) 10**" → adds <sup> around the trailing digits when missing.
 * Authors can include ** after the number in the field to match footnote styling from skyrizi-hcp.
 */
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

function parseLinkCell(cell) {
  const a = cell?.querySelector('a[href]');
  if (!a) return { href: '#', target: '_self' };
  return {
    href: a.getAttribute('href') || '#',
    target: a.getAttribute('target') || '_self',
  };
}

/**
 * @param {HTMLElement} block
 */
export default function decorate(block) {
  applyCommonProps(block);

  const cells = [...block.children];
  if (cells.length < 5) return;

  const { href, target } = parseLinkCell(cells[0]);
  const line1 = normalizeLine1Html(cellParagraph(cells[1])?.innerHTML ?? '');
  const line2 = cellParagraph(cells[2])?.innerHTML?.trim() ?? '';
  const line3 = normalizeLine3Html(cellParagraph(cells[3])?.innerHTML ?? '');
  const line4 = cellParagraph(cells[4])?.innerHTML?.trim() ?? '';

  /** Matches index.html: .cta-card-grid-richtext > .cta-card-grid > p > a > spans (no extra wrappers). */
  const inner = document.createElement('div');
  inner.className = 'cta-card-grid';

  const p = document.createElement('p');
  const a = document.createElement('a');
  a.setAttribute('href', href);
  a.setAttribute('target', target);

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

  a.append(span1, span2, span3, span4);
  p.append(a);
  inner.append(p);

  block.textContent = '';
  block.classList.add('cta-card-grid-richtext');
  block.append(inner);
}
