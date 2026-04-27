/*
 * brand-explorer
 * Multi-brand product navigator with therapeutic filter tabs.
 *
 * Variants:
 *   - (default): Full explorer with therapeutic filter tabs
 *   - cards: Brand card grid layout
 *   - nav: Navigation link list
 *
 * Authoring model (table format):
 *   | brand-explorer           |
 *   | Bar label text           |                                    ← row 0
 *   | [logo] | Brand | Area | Description | /url |                 ← row 1..n
 */

import { moveInstrumentation } from '../../scripts/scripts.js';

function parseIndications(row) {
  const cells = [...row.children];
  const imgEl = cells[0]?.querySelector('img, picture');
  const name = (imgEl ? cells[1] : cells[0])?.textContent.trim();
  const therapeuticArea = (imgEl ? cells[2] : cells[1])?.textContent.trim() || '';
  const description = (imgEl ? cells[3] : cells[2])?.innerHTML.trim() || '';
  const url = (imgEl ? cells[4] : cells[3])?.textContent.trim() || '#';

  return {
    imgEl: imgEl ? imgEl.cloneNode(true) : null,
    name: name || '',
    therapeuticArea,
    description,
    url,
  };
}

function buildFilterTabs(brands, container) {
  const areas = [...new Set(brands.map((b) => b.therapeuticArea).filter(Boolean))];
  if (areas.length <= 1) return;

  const tabBar = document.createElement('div');
  tabBar.className = 'brand-explorer-tabs';

  const allTab = document.createElement('button');
  allTab.className = 'brand-explorer-tab is-active';
  allTab.textContent = 'All';
  allTab.dataset.filter = '';
  tabBar.append(allTab);

  areas.forEach((area) => {
    const tab = document.createElement('button');
    tab.className = 'brand-explorer-tab';
    tab.textContent = area;
    tab.dataset.filter = area;
    tabBar.append(tab);
  });

  tabBar.addEventListener('click', (e) => {
    const tab = e.target.closest('.brand-explorer-tab');
    if (!tab) return;
    tabBar.querySelectorAll('.brand-explorer-tab').forEach((t) => t.classList.remove('is-active'));
    tab.classList.add('is-active');

    const { filter } = tab.dataset;
    container.querySelectorAll('.brand-explorer-item').forEach((item) => {
      item.style.display = (!filter || item.dataset.area === filter) ? '' : 'none';
    });
  });

  // eslint-disable-next-line consistent-return
  return tabBar;
}

function buildCard(brand) {
  const li = document.createElement('li');
  li.className = 'brand-explorer-item';
  if (brand.therapeuticArea) li.dataset.area = brand.therapeuticArea;

  const a = document.createElement('a');
  a.href = brand.url;
  a.className = 'brand-explorer-link';

  if (brand.imgEl) {
    const img = brand.imgEl.tagName === 'IMG' ? brand.imgEl : brand.imgEl.querySelector('img');
    if (img) {
      img.className = 'brand-explorer-logo';
      img.loading = 'lazy';
      a.append(img);
    }
  }

  const label = document.createElement('span');
  label.className = 'brand-explorer-name';
  label.textContent = brand.name;
  a.append(label);

  if (brand.therapeuticArea) {
    const area = document.createElement('span');
    area.className = 'brand-explorer-area';
    area.textContent = brand.therapeuticArea;
    a.append(area);
  }

  if (brand.description) {
    const desc = document.createElement('div');
    desc.className = 'brand-explorer-description';
    desc.innerHTML = brand.description;
    a.append(desc);
  }

  li.append(a);
  return li;
}

function buildNavItem(brand) {
  const li = document.createElement('li');
  li.className = 'brand-explorer-item';
  if (brand.therapeuticArea) li.dataset.area = brand.therapeuticArea;

  const a = document.createElement('a');
  a.href = brand.url;
  a.className = 'brand-explorer-nav-link';
  a.textContent = brand.name;
  li.append(a);
  return li;
}

export default function decorate(block) {
  const rows = [...block.children];
  if (!rows.length) return;

  const isCards = block.classList.contains('cards');
  const isNav = block.classList.contains('nav');

  const [labelRow, ...brandRows] = rows;
  const barLabel = labelRow.textContent.trim() || 'Explore AbbVie';

  const brands = brandRows.map((row) => {
    const brand = parseIndications(row);
    moveInstrumentation(row, row);
    return brand;
  }).filter((b) => b.name);

  // Bar
  const bar = document.createElement('div');
  bar.className = 'brand-explorer-bar';

  const trigger = document.createElement('button');
  trigger.className = 'brand-explorer-trigger';
  trigger.setAttribute('aria-expanded', 'false');
  trigger.setAttribute('aria-controls', 'brand-explorer-panel');
  trigger.textContent = barLabel;
  bar.append(trigger);

  // Panel
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

  // Therapeutic filter tabs (only for default variant)
  if (!isCards && !isNav) {
    const grid = document.createElement('ul');
    grid.className = 'brand-explorer-grid';
    const tabBar = buildFilterTabs(brands, grid);
    if (tabBar) panel.append(tabBar);
    brands.forEach((brand) => grid.append(buildCard(brand)));
    panel.append(grid);
  } else if (isCards) {
    const grid = document.createElement('ul');
    grid.className = 'brand-explorer-grid brand-explorer-cards';
    brands.forEach((brand) => grid.append(buildCard(brand)));
    panel.append(grid);
  } else if (isNav) {
    const list = document.createElement('ul');
    list.className = 'brand-explorer-nav-list';
    brands.forEach((brand) => list.append(buildNavItem(brand)));
    panel.append(list);
  }

  // Anchor ID
  const anchorRow = rows.find((r) => r.textContent.trim().startsWith('id:'));
  if (anchorRow) {
    const anchorId = anchorRow.textContent.trim().replace('id:', '').trim();
    if (anchorId) block.id = anchorId;
  }

  block.replaceChildren(bar, panel);

  const section = block.closest('.section');
  if (section) {
    section.classList.add('brand-explorer-section');
    document.body.append(section);
  }

  // Toggle logic
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
