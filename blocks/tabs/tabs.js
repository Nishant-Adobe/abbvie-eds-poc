// eslint-disable-next-line import/no-unresolved
import { moveInstrumentation } from '../../scripts/scripts.js';

let tabBlockCnt = 0;

function normalize(value) {
  return value?.trim().toLowerCase() || '';
}

/**
 * Get section name from section-metadata or data attributes.
 * Checks: data-tab-name, section-metadata rows (tabName, name), data-aue-label.
 */
function getSectionName(section) {
  if (section.dataset.tabName) return section.dataset.tabName;

  const meta = section.querySelector('.section-metadata');
  if (meta) {
    const match = [...meta.children].find((row) => {
      const firstChild = row.firstElementChild;
      if (!firstChild) return false;
      const key = normalize(firstChild.textContent);
      return key === 'tabname' || key === 'tab-name' || key === 'name';
    });
    if (match) {
      const cells = [...match.children];
      return cells[1]?.textContent?.trim() || '';
    }
  }

  return '';
}

export default async function decorate(block) {
  tabBlockCnt += 1;

  const tablist = document.createElement('div');
  tablist.className = 'tabs-list';
  tablist.setAttribute('role', 'tablist');
  tablist.id = `tablist-${tabBlockCnt}`;

  // Find sibling sections after the tabs block's parent section
  const blockSection = block.closest('.section');
  const main = blockSection?.parentElement;
  let panels = [];

  if (main) {
    const allSections = [...main.children].filter((el) => el.classList.contains('section'));
    const blockIdx = allSections.indexOf(blockSection);
    panels = allSections.slice(blockIdx + 1);
  }

  // Also check for panels inside the same section (UE xwalk delivery)
  if (panels.length === 0 && blockSection) {
    panels = [...blockSection.querySelectorAll('[data-aue-component="tab-panel"]')];
  }

  // Extract names from panels
  panels.forEach((panel) => {
    if (!panel.dataset.tabName) {
      const name = getSectionName(panel);
      if (name) panel.dataset.tabName = name;
    }
  });

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

    const panelId = panel?.id || `tab-panel-${tabBlockCnt}-${i + 1}`;
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
      panel.classList.add('tabs-panel');
      panel.setAttribute('role', 'tabpanel');
      panel.setAttribute('aria-labelledby', button.id);
      panel.setAttribute('aria-hidden', !!firstPanel);

      if (!firstPanel) {
        firstPanel = panel;
      }
    }

    button.addEventListener('click', () => {
      panels.forEach((p) => {
        if (p.dataset.tabName) p.setAttribute('aria-hidden', true);
      });
      tablist.querySelectorAll('button').forEach((btn) => {
        btn.setAttribute('aria-selected', false);
      });
      if (panel) panel.setAttribute('aria-hidden', false);
      button.setAttribute('aria-selected', true);
    });

    tablist.append(button);

    if (button.firstElementChild) {
      moveInstrumentation(button.firstElementChild, null);
    }
  });

  // Hide original tab items but keep in DOM for UE content tree
  tabItems.forEach((tabItem) => {
    tabItem.classList.add('tabs-item-hidden');
  });
  block.prepend(tablist);
}
