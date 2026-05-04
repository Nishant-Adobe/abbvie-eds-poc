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
 * Table (one row): | Link | Line 1 | Line 2 | Line 3 | Line 4 | Centered (optional) |
 */

const LINE1_CLASS = 'cta-card-line-1 abbv-icon-keyboard_arrow_right i-a';

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
  const direct = [...block.children];
  if (direct.length === 1 && direct[0].children.length >= 5) {
    return [...direct[0].children];
  }
  if (direct.length >= 5) return direct;
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
  s1.innerHTML = line1 || '';

  const s2 = document.createElement('span');
  s2.className = 'cta-card-line-2';
  s2.innerHTML = line2 || '';

  const s3 = document.createElement('span');
  s3.className = 'cta-card-line-3';
  s3.innerHTML = line3 || '';

  const s4 = document.createElement('span');
  s4.className = 'cta-card-line-4';
  s4.innerHTML = line4 || '';

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
