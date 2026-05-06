import { applyCommonProps } from '../../scripts/utils.js';
import { readBlockConfig } from '../../scripts/aem.js';

const LINE1_SPAN_CLASSES = 'cta-card-grid-line-1 abbv-icon-keyboard_arrow_right i-a';

/**
 * Match skyrizi-hcp reference: brand in .cta-card-grid-risa-pri; UE strong/b → spans.
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

/** Plain-text footnote pattern → superscript (when not already HTML). */
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
 * One grid row → reference DOM (schoudry.github.io skyrizi-hcp index.html).
 * @param {HTMLElement} wrapper – UE `div[data-aue-component="grid-card"]` or `div.grid-card`
 * @returns {HTMLDivElement | null}
 */
function buildGridCardShell(wrapper) {
  const cells = [...wrapper.children];
  if (cells.length < 5) return null;

  const sourceLink = cells[0].querySelector('a[href]');
  const href = sourceLink?.getAttribute('href') || '#';
  const target = sourceLink?.getAttribute('target') || '_self';

  const line1 = normalizeLine1Html(cellParagraph(cells[1])?.innerHTML ?? '');
  const line2 = cellParagraph(cells[2])?.innerHTML?.trim() ?? '';
  const line3 = normalizeLine3Html(cellParagraph(cells[3])?.innerHTML ?? '');
  const line4 = cellParagraph(cells[4])?.innerHTML?.trim() ?? '';

  const shell = document.createElement('div');
  shell.className = 'cta-card-grid-richtext';

  const grid = document.createElement('div');
  grid.className = 'cta-card-grid';

  const p = document.createElement('p');
  const a = document.createElement('a');
  a.href = href;
  a.target = target;
  if (sourceLink?.getAttribute('title')) a.title = sourceLink.getAttribute('title');
  const aria = sourceLink?.getAttribute('aria-label');
  if (aria) a.setAttribute('aria-label', aria);
  const rel = sourceLink?.getAttribute('rel');
  if (rel) a.rel = rel;

  const s1 = document.createElement('span');
  s1.className = LINE1_SPAN_CLASSES;
  s1.innerHTML = line1;

  const s2 = document.createElement('span');
  s2.className = 'cta-card-grid-line-2';
  s2.innerHTML = line2;

  const s3 = document.createElement('span');
  s3.className = 'cta-card-grid-line-3';
  s3.innerHTML = line3;

  const s4 = document.createElement('span');
  s4.className = 'cta-card-grid-line-4';
  s4.innerHTML = line4;

  a.append(s1, s2, s3, s4);
  p.append(a);
  grid.append(p);
  shell.append(grid);
  return shell;
}

/**
 * Cards Grid (parent) + Grid Card rows (items), same UX pattern as carousel / carousel-item.
 * Final markup matches static reference in skyrizi-hcp/index.html.
 */
export default function decorate(block) {
  applyCommonProps(block);

  const cfg = readBlockConfig(block);

  const wrapperSelectors = [
    ':scope > div[data-aue-component="grid-card"]',
    ':scope > div.grid-card',
  ];
  const wrappers = [...new Set(wrapperSelectors.flatMap((sel) => [...block.querySelectorAll(sel)]))];

  const shells = [];
  wrappers.forEach((wrapper) => {
    const shell = buildGridCardShell(wrapper);
    if (shell) {
      shells.push(shell);
      wrapper.replaceWith(shell);
    }
  });

  if (shells.length === 0) return;

  const container = document.createElement('div');
  container.classList.add('cta-card-grid-container');

  if (cfg.classes) {
    const raw = cfg.classes;
    const parts = typeof raw === 'string'
      ? raw.split(/[\s,]+/).filter(Boolean)
      : Array.isArray(raw)
        ? raw
        : [String(raw)];
    container.classList.add(...parts);
  }

  shells.forEach((s) => container.append(s));
  block.replaceChildren(container);
}
