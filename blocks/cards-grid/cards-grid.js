import { moveInstrumentation } from '../../scripts/scripts.js';
import { applyCommonProps } from '../../scripts/utils.js';

/**
 * Cards Grid — Skyrizi-style CTA card row (flex strip).
 *
 * Table rows (each row = one card):
 * | Link | Line 1 | Line 2 | Line 3 | Line 4 | Centered (optional) |
 *
 * Link: URL text, or cell containing <a href="...">
 * Lines 1–4: richtext (Line 1 often includes &lt;span class="c-risa-pri"&gt;…&lt;/span&gt; VS)
 * Centered: true / yes / 1 → adds cta-card--centered on that card
 *
 * Block styles (UE): multiselect adds cta-card-container--home, _top, _bottom on the block;
 * those classes are copied to the inner flex container.
 */

const LINE1_CLASS =
  'cta-card-line-1 abbv-icon-keyboard_arrow_right i-a';

function parseLinkCell(cell) {
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

function isCenteredCell(cell) {
  if (!cell) return false;
  return /^(true|yes|1|y|centered)$/i.test(cell.textContent.trim());
}

function buildCardRow({
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

function mergeContainerClasses(block, container) {
  container.classList.add('abbv-flex-container-v2', 'cta-card-container');
  [...block.classList].forEach((cls) => {
    if (cls === 'block' || cls === 'cards-grid') return;
    if (/^cta-card-container/.test(cls)) {
      container.classList.add(cls);
    }
  });
}

/**
 * @param {HTMLElement} block
 */
export default function decorate(block) {
  applyCommonProps(block);

  const container = document.createElement('div');
  mergeContainerClasses(block, container);

  [...block.children].forEach((row) => {
    const cells = [...row.children];
    if (cells.length < 5) return;

    const { href, target } = parseLinkCell(cells[0]);
    const line1 = cells[1]?.innerHTML?.trim() ?? '';
    const line2 = cells[2]?.innerHTML?.trim() ?? '';
    const line3 = cells[3]?.innerHTML?.trim() ?? '';
    const line4 = cells[4]?.innerHTML?.trim() ?? '';
    const centered = cells.length > 5 && isCenteredCell(cells[5]);

    const cardEl = buildCardRow({
      href,
      target,
      line1,
      line2,
      line3,
      line4,
      centered,
    });
    moveInstrumentation(row, cardEl);
    container.append(cardEl);
  });

  block.textContent = '';
  block.append(container);
}
