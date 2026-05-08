// eslint-disable-next-line import/no-unresolved
import { moveInstrumentation } from '../../scripts/scripts.js';

// keep track globally of the number of tab blocks on the page
let tabBlockCnt = 0;

export default async function decorate(block) {
  // build tablist
  const tablist = document.createElement('div');
  tablist.className = 'tabs-list';
  tablist.setAttribute('role', 'tablist');
  tablist.id = `tablist-${tabBlockCnt += 1}`;

  const tabItems = [...block.children];

  tabItems.forEach((tabItem, i) => {
    const id = `tabpanel-${tabBlockCnt}-tab-${i + 1}`;

    // First row contains the tab item fields (title, heading, image, content)
    // Remaining rows are the sections
    const itemContentRow = tabItem.firstElementChild;

    // Extract tab title from first cell of first row
    const titleCell = itemContentRow?.firstElementChild;
    const title = titleCell?.textContent.trim() || `Tab ${i + 1}`;

    // Build tab item content wrapper for the tab's own content (heading, image, richtext)
    const tabItemContent = document.createElement('div');
    tabItemContent.className = 'tabs-panel-content';

    // Move item content (heading, image, richtext) into wrapper
    // Skip the first cell (title) and process remaining cells
    const contentCells = [...itemContentRow.children].slice(1);
    contentCells.forEach((cell) => {
      // Clone and append each content cell
      const cellContent = cell.cloneNode(true);
      tabItemContent.appendChild(cellContent);
    });

    // Remove the first row (item content row) from tabItem
    itemContentRow.remove();

    // Setup tab panel (contains item content + sections)
    tabItem.className = 'tabs-panel';
    tabItem.id = id;
    tabItem.setAttribute('aria-hidden', !!i);
    tabItem.setAttribute('aria-labelledby', `tab-${id}`);
    tabItem.setAttribute('role', 'tabpanel');

    // Prepend tab item content before sections (if it has any content)
    if (tabItemContent.children.length > 0) {
      tabItem.prepend(tabItemContent);
    }

    // Build tab button
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

    // Remove instrumentation from button
    if (button.firstElementChild) {
      moveInstrumentation(button.firstElementChild, null);
    }
  });

  block.prepend(tablist);

  // Sections and their blocks are automatically decorated by EDS framework
}
