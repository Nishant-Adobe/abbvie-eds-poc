export default async function getBlockConfigs() {
  return {
    flags: {},
    variations: [],
    decorations: {
      afterDecorate: (block) => {
        const navSections = block.querySelector('.nav-sections');
        if (!navSections) return;

        const items = navSections.querySelectorAll('.default-content-wrapper > ul > li');
        if (items.length < 2) return;

        const hasConditionNav = !items[0]?.classList.contains('menu-choose-your-condition')
          && !items[0]?.classList.contains('menu-conditions');
        if (!hasConditionNav) return;

        const ul = navSections.querySelector('.default-content-wrapper > ul');
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

        ul.parentElement.appendChild(drawer);

        items.forEach((li) => {
          const btn = li.querySelector(':scope > button');
          if (!btn) return;

          btn.addEventListener('click', (e) => {
            e.stopPropagation();
            const isOpen = drawer.getAttribute('aria-hidden') === 'false';
            drawer.setAttribute('aria-hidden', isOpen ? 'true' : 'false');
            li.setAttribute('aria-expanded', !isOpen);

            items.forEach((otherLi) => {
              if (otherLi !== li) otherLi.setAttribute('aria-expanded', !isOpen);
            });
          });
        });

        document.addEventListener('click', (e) => {
          if (!drawer.contains(e.target) && !ul.contains(e.target)) {
            drawer.setAttribute('aria-hidden', 'true');
            items.forEach((li) => li.setAttribute('aria-expanded', 'false'));
          }
        });
      },
    },
  };
}
