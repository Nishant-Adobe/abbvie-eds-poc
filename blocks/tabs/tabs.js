// eslint-disable-next-line import/no-unresolved
import { moveInstrumentation } from '../../scripts/scripts.js';

let tabBlockCnt = 0;

function normalize(value) {
  return value?.trim().toLowerCase() || '';
}

function getTabNameFromMeta(panel) {
  const meta = panel.querySelector('.section-metadata');
  if (!meta) return '';
  const match = [...meta.children].find((row) => {
    const firstChild = row.firstElementChild;
    if (!firstChild) return false;
    const key = normalize(firstChild.textContent);
    return key === 'tab-name' || key === 'tabname' || key === 'tab name';
  });
  if (!match) return '';
  const cells = [...match.children];
  return cells[1]?.textContent?.trim() || '';
}

function decorateTabContainer(block, container) {
  container.classList.add('tabs-container');

  const tablist = document.createElement('div');
  tablist.className = 'tabs-list';
  tablist.setAttribute('role', 'tablist');
  tablist.id = `tablist-${tabBlockCnt}`;

  // Tab Panels can be:
  // 1. Direct child sections with data-tab-name (doc-based delivery)
  // 2. Nested divs with data-aue-component="tab-panel" (xwalk/UE delivery)
  // 3. Divs inside default-content-wrapper with data-aue-component="tab-panel"
  let panels = [...container.querySelectorAll(':scope > .section[data-tab-name]')]
    .filter((section) => section !== block.closest('.section'));

  if (panels.length === 0) {
    panels = [...container.querySelectorAll('[data-aue-component="tab-panel"]')];
  }

  if (panels.length === 0) {
    panels = [...container.querySelectorAll('.default-content-wrapper > div[data-aue-model="tab-panel"]')];
  }

  // Extract tab-name and split classes from section-metadata inside each panel
  panels.forEach((panel) => {
    if (!panel.dataset.tabName) {
      const name = getTabNameFromMeta(panel);
      if (name) panel.dataset.tabName = name;
    }
    // Apply split-* class from section-metadata to the panel itself
    const meta = panel.querySelector('.section-metadata');
    if (meta) {
      [...meta.classList].filter((c) => c.startsWith('split-')).forEach((c) => {
        panel.classList.add(c);
      });
    }
  });

  // Section metadata is hidden via CSS (.tabs-container .section-metadata { display: none })

  const tabItems = [...block.children];
  let firstPanel = null;

  tabItems.forEach((tabItem, i) => {
    const titleCell = tabItem.firstElementChild;
    const title = titleCell?.textContent.trim() || `Tab ${i + 1}`;
    const normalizedTitle = normalize(title);

    // Match by normalized name (case-insensitive, trimmed)
    const panel = panels.find(
      (p) => normalize(p.dataset.tabName) === normalizedTitle,
    );

    const panelId = panel?.id || `tab-container-panel-${tabBlockCnt}-${i + 1}`;
    if (panel && !panel.id) panel.id = panelId;

    const button = document.createElement('button');
    button.className = 'tabs-tab';
    button.id = `tab-${panelId}`;
    button.textContent = title;
    button.setAttribute('aria-controls', panelId);
    button.setAttribute('aria-selected', !firstPanel && !!panel);
    button.setAttribute('role', 'tab');
    button.setAttribute('type', 'button');

    if (panel) {
      panel.classList.add('tab-panel');
      panel.setAttribute('role', 'tabpanel');
      panel.setAttribute('aria-labelledby', button.id);
      panel.setAttribute('aria-hidden', !!firstPanel);

      if (!firstPanel) {
        firstPanel = panel;
      }
    }

    button.addEventListener('click', () => {
      panels.forEach((p) => p.setAttribute('aria-hidden', true));
      tablist.querySelectorAll('button').forEach((btn) => {
        btn.setAttribute('aria-selected', false);
      });
      if (panel) panel.setAttribute('aria-hidden', false);
      button.setAttribute('aria-selected', true);
    });

    tablist.append(button);
  });

  // Hide original tab items but keep them in DOM for UE content tree
  tabItems.forEach((tabItem) => {
    tabItem.classList.add('tabs-item-hidden');
  });
  block.prepend(tablist);
}

function decorateStandalone(block) {
  const tablist = document.createElement('div');
  tablist.className = 'tabs-list';
  tablist.setAttribute('role', 'tablist');
  tablist.id = `tablist-${tabBlockCnt}`;

  const tabItems = [...block.children];

  tabItems.forEach((tabItem, i) => {
    const id = `tabpanel-${tabBlockCnt}-tab-${i + 1}`;

    const itemContentRow = tabItem.firstElementChild;
    const titleCell = itemContentRow?.firstElementChild;
    const title = titleCell?.textContent.trim() || `Tab ${i + 1}`;

    const tabItemContent = document.createElement('div');
    tabItemContent.className = 'tabs-panel-content';

    const contentCells = [...itemContentRow.children].slice(1);
    contentCells.forEach((cell) => {
      tabItemContent.appendChild(cell.cloneNode(true));
    });

    itemContentRow.remove();

    tabItem.className = 'tabs-panel';
    tabItem.id = id;
    tabItem.setAttribute('aria-hidden', !!i);
    tabItem.setAttribute('aria-labelledby', `tab-${id}`);
    tabItem.setAttribute('role', 'tabpanel');

    if (tabItemContent.children.length > 0) {
      tabItem.prepend(tabItemContent);
    }

    const button = document.createElement('button');
    button.className = 'tabs-tab';
    button.id = `tab-${id}`;
    button.textContent = title;
    button.setAttribute('aria-controls', id);
    button.setAttribute('aria-selected', !i);
    button.setAttribute('role', 'tab');
    button.setAttribute('type', 'button');

    button.addEventListener('click', () => {
      block.querySelectorAll('[role=tabpanel]').forEach((panel) => {
        panel.setAttribute('aria-hidden', true);
      });
      tablist.querySelectorAll('button').forEach((btn) => {
        btn.setAttribute('aria-selected', false);
      });
      tabItem.setAttribute('aria-hidden', false);
      button.setAttribute('aria-selected', true);
    });

    tablist.append(button);

    if (button.firstElementChild) {
      moveInstrumentation(button.firstElementChild, null);
    }
  });

  block.prepend(tablist);
}

export default async function decorate(block) {
  tabBlockCnt += 1;

  const container = block.closest('[data-identifier="Tab Container"]')
    || block.closest('.tabs-container')
    || block.closest('[data-aue-model="tab-container"]');

  if (container) {
    decorateTabContainer(block, container);
  } else {
    decorateStandalone(block);
  }
}
