/**
 * RINVOQ condition-page mega-drawer.
 * When any nav-sections item is clicked, opens a full-width drawer
 * showing all categories with their sub-links simultaneously.
 */
(function initMegaDrawer() {
  function setup() {
    const navSections = document.querySelector('.nav-sections');
    if (!navSections) return;

    const items = [...navSections.querySelectorAll('.default-content-wrapper > ul > li')];
    if (items.length < 2) return;

    const isConditionNav = !items[0]?.classList.contains('menu-choose-your-condition')
      && !items[0]?.classList.contains('menu-conditions');
    if (!isConditionNav) return;

    const wrapper = navSections.querySelector('.default-content-wrapper');

    const drawer = document.createElement('div');
    drawer.className = 'rinvoq-mega-drawer';
    drawer.setAttribute('aria-hidden', 'true');

    items.forEach((li) => {
      const btn = li.querySelector(':scope > button');
      const submenu = li.querySelector('.submenu-level-1');
      if (!btn || !submenu) return;

      const col = document.createElement('div');
      col.className = 'mega-drawer-col';

      const heading = document.createElement('h4');
      heading.className = 'mega-drawer-heading';
      heading.textContent = btn.querySelector('span')?.textContent || btn.textContent;
      col.appendChild(heading);

      const navGroup = submenu.querySelector('.navigation-group');
      if (navGroup) {
        const linkList = navGroup.cloneNode(true);
        linkList.className = 'mega-drawer-links';
        col.appendChild(linkList);
      }

      drawer.appendChild(col);
    });

    wrapper.appendChild(drawer);

    items.forEach((li) => {
      const btn = li.querySelector(':scope > button');
      if (!btn) return;

      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        e.preventDefault();
        const isOpen = drawer.getAttribute('aria-hidden') === 'false';
        drawer.setAttribute('aria-hidden', isOpen ? 'true' : 'false');
      });
    });

    document.addEventListener('click', (e) => {
      if (!drawer.contains(e.target) && !wrapper.contains(e.target)) {
        drawer.setAttribute('aria-hidden', 'true');
      }
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        drawer.setAttribute('aria-hidden', 'true');
      }
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => setTimeout(setup, 2000));
  } else {
    setTimeout(setup, 2000);
  }
}());
