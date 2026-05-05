import { moveInstrumentation } from '../../scripts/scripts.js';
import { applyCommonProps } from '../../scripts/utils.js';

/**
 * Grid Card — single Skyrizi-style CTA card (used inside Cards Grid).
 *
 * Outputs DOM matching skyrizi-hcp reference:
 * <div class="rich-text">
 *   <div class="abbv-rich-text cta-card abbv-rich-text-common">
 *     <p><a>… spans cta-card-line-1 … line-4 …</a></p>
 *   </div>
 * </div>
 *
 * Authoring (UE): flat sibling cells — typically
 *   div[link] · div[line1] · div[line2] · div[line3] · div[line4] · div[centered]
 * Content is normalized toward skyrizi-hcp markup (c-risa-pri, sup citations).
 */

const LINE1_CLASS = 'cta-card-line-1 abbv-icon-keyboard_arrow_right i-a';

/**
 * UE often emits &lt;strong&gt; for the brand name; Skyrizi reference uses .c-risa-pri.
 */
function normalizeLine1Html(html) {
  const raw = (html || '').trim();
  if (!raw) return '';
  return raw
    .replace(/<strong\b[^>]*>([\s\S]*?)<\/strong>/gi, '<span class="c-risa-pri">$1</span>')
    .replace(/<b\b[^>]*>([\s\S]*?)<\/b>/gi, '<span class="c-risa-pri">$1</span>');
}

/**
 * UE may output ") 10 **" instead of ")&lt;sup&gt;10&lt;/sup&gt;**".
 */
function normalizeLine3Html(html) {
  const raw = (html || '').trim();
  if (!raw) return '';
  if (/<sup\b/i.test(raw)) return raw;
  return raw.replace(/\)\s*([\d,†]+)\s*\*\*/g, ')<sup>$1</sup>**');
}

function normalizeFieldHtml(field, html) {
  if (field === 'line1') return normalizeLine1Html(html);
  if (field === 'line3') return normalizeLine3Html(html);
  return (html || '').trim();
}

export function parseLinkCell(cell) {
  if (!cell) return { href: '#', target: '_self' };
  const a = cell.querySelector('a[href]');
  if (a) {
    return {
      href: a.getAttribute('href') || '#',
      target: a.getAttribute('target') || '_self',
    };
  }
  const t = cell.textContent.trim();
  if (t && (t.startsWith('http') || t.startsWith('/') || t.startsWith('#'))) {
    return { href: t, target: '_self' };
  }
  if (t) return { href: t, target: '_self' };
  return { href: '#', target: '_self' };
}

export function isCenteredCell(cell) {
  if (!cell) return false;
  return /^(true|yes|1|y|centered)$/i.test(cell.textContent.trim());
}

function getTableCells(block) {
  const elements = [...block.children].filter((n) => n.nodeType === 1);
  if (elements.length === 1 && elements[0].children.length >= 5) {
    return [...elements[0].children].filter((n) => n.nodeType === 1);
  }
  if (elements.length >= 5) return elements;
  return [];
}

export function buildGridCardMarkup({
  href,
  target,
  line1,
  line2,
  line3,
  line4,
  centered,
}) {
  const richOuter = document.createElement('div');
  richOuter.className = 'rich-text';

  const richInner = document.createElement('div');
  richInner.className = centered
    ? 'abbv-rich-text cta-card cta-card--centered abbv-rich-text-common'
    : 'abbv-rich-text cta-card abbv-rich-text-common';

  const p = document.createElement('p');
  const a = document.createElement('a');
  a.href = href;
  a.target = target;
  if (target === '_blank') {
    a.setAttribute('rel', 'noopener noreferrer');
  }

  const s1 = document.createElement('span');
  s1.className = LINE1_CLASS;
  s1.innerHTML = normalizeFieldHtml('line1', line1);

  const s2 = document.createElement('span');
  s2.className = 'cta-card-line-2';
  s2.innerHTML = normalizeFieldHtml('line2', line2);

  const s3 = document.createElement('span');
  s3.className = 'cta-card-line-3';
  s3.innerHTML = normalizeFieldHtml('line3', line3);

  const s4 = document.createElement('span');
  s4.className = 'cta-card-line-4';
  s4.innerHTML = normalizeFieldHtml('line4', line4);

  a.append(s1, s2, s3, s4);
  p.append(a);
  richInner.append(p);
  richOuter.append(richInner);
  return richOuter;
}

/**
 * @param {HTMLElement} block – `.grid-card.block` root
 */
export default function decorate(block) {
  if (block.querySelector(':scope > .rich-text')) {
    return;
  }

  applyCommonProps(block);

  const cells = getTableCells(block);
  if (cells.length < 5) return;

  const { href, target } = parseLinkCell(cells[0]);
  const line1 = cells[1]?.innerHTML?.trim() ?? '';
  const line2 = cells[2]?.innerHTML?.trim() ?? '';
  const line3 = cells[3]?.innerHTML?.trim() ?? '';
  const line4 = cells[4]?.innerHTML?.trim() ?? '';
  const centered = cells.length > 5 && isCenteredCell(cells[5]);

  const rich = buildGridCardMarkup({
    href,
    target,
    line1,
    line2,
    line3,
    line4,
    centered,
  });

  moveInstrumentation(block, rich);
  block.textContent = '';
  block.append(rich);
}
