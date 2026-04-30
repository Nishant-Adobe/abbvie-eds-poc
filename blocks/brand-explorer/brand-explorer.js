/*
 * brand-explorer
 * Fixed bottom bar that expands to a full brand portfolio panel.
 *
 * Authoring model:
 *   | brand-explorer           |
 *   | Bar label text           |              ← row 0: bar trigger label
 *   | [logo img] | Brand name | /brand-url | ← row 1..n: brand entries
 *
 * Variants (space-separated block class): none required.
 */

export default function decorate(block) {
  const rows = [...block.children];
  if (!rows.length) return;

  const [labelRow, ...brandRows] = rows;
  const barLabel = labelRow.textContent.trim() || 'Explore AbbVie';

  // ── bar ──────────────────────────────────────────────────────────────────
  const bar = document.createElement('div');
  bar.className = 'brand-explorer-bar';

  const trigger = document.createElement('button');
  trigger.className = 'brand-explorer-trigger';
  trigger.setAttribute('aria-expanded', 'false');
  trigger.setAttribute('aria-controls', 'brand-explorer-panel');
  trigger.textContent = barLabel;
  bar.append(trigger);

  // ── panel ─────────────────────────────────────────────────────────────────
  const panel = document.createElement('div');
  panel.className = 'brand-explorer-panel';
  panel.id = 'brand-explorer-panel';
  panel.setAttribute('role', 'dialog');
  panel.setAttribute('aria-label', barLabel);
  panel.hidden = true;

  const closeBtn = document.createElement('button');
  closeBtn.className = 'brand-explorer-close';
  closeBtn.setAttribute('aria-label', 'Close brand explorer');
  panel.append(closeBtn);

  const grid = document.createElement('ul');
  grid.className = 'brand-explorer-grid';

  brandRows.forEach((row) => {
    const cells = [...row.children];
    const imgEl = cells[0]?.querySelector('img');
    const name = (imgEl ? cells[1] : cells[0])?.textContent.trim();
    const url = (imgEl ? cells[2] : cells[1])?.textContent.trim() || '#';

    if (!name) return;

    const li = document.createElement('li');
    li.className = 'brand-explorer-item';

    const a = document.createElement('a');
    a.href = url;
    a.className = 'brand-explorer-link';

    if (imgEl) {
      imgEl.className = 'brand-explorer-logo';
      imgEl.loading = 'lazy';
      a.append(imgEl);
    }

    const label = document.createElement('span');
    label.className = 'brand-explorer-name';
    label.textContent = name;
    a.append(label);

    li.append(a);
    grid.append(li);
  });

  panel.append(grid);

  // ── wire into body ────────────────────────────────────────────────────────
  block.replaceChildren(bar, panel);
  const section = block.closest('.section');
  section.classList.add('brand-explorer-section');
  document.body.append(section);

  // ── toggle logic ──────────────────────────────────────────────────────────
  function open() {
    panel.hidden = false;
    trigger.setAttribute('aria-expanded', 'true');
    block.classList.add('is-open');
    closeBtn.focus();
  }

  function close() {
    block.classList.remove('is-open');
    trigger.setAttribute('aria-expanded', 'false');
    panel.addEventListener('transitionend', () => { panel.hidden = true; }, { once: true });
    trigger.focus();
  }

  trigger.addEventListener('click', () => {
    if (block.classList.contains('is-open')) close();
    else open();
  });

  closeBtn.addEventListener('click', close);

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && block.classList.contains('is-open')) close();
  });
}
