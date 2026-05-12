export default async function getBlockConfigs() {
  return {
    flags: {},
    variations: [],
    decorations: {
      afterDecorate: (block) => {
        // Home icon on the first utility nav link
        const utilityUl = block.querySelector('.nav-utility ul[role="menubar"]');
        if (utilityUl) {
          const firstLi = utilityUl.querySelector('li:first-child');
          const firstLink = firstLi?.querySelector('a');
          if (firstLink && !firstLink.querySelector('.nav-utility-home-icon')) {
            firstLi.classList.add('nav-utility-home');
            const homeIcon = document.createElement('span');
            homeIcon.className = 'nav-utility-home-icon';
            homeIcon.setAttribute('aria-hidden', 'true');
            homeIcon.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/></svg>';
            firstLink.prepend(homeIcon);
          }
        }

        // Desktop hover — open nav section submenu on hover (no new HTML)
        const navItems = [...block.querySelectorAll('.nav-sections .default-content-wrapper > ul > li')];
        if (!navItems.length) return;

        const desktopMQ = window.matchMedia('(min-width: 1024px)');
        let navTimer = null;

        const openItem = (li) => {
          clearTimeout(navTimer);
          navItems.forEach((other) => {
            if (other !== li) other.setAttribute('aria-expanded', 'false');
          });
          li.setAttribute('aria-expanded', 'true');
          li.querySelector('.submenu-level-1')?.classList.remove('mega-menu-minimize');
        };

        const closeAll = () => {
          navTimer = setTimeout(() => {
            navItems.forEach((li) => li.setAttribute('aria-expanded', 'false'));
          }, 120);
        };

        navItems.forEach((li) => {
          const submenu = li.querySelector('.submenu-level-1');

          li.addEventListener('mouseenter', () => { if (desktopMQ.matches) openItem(li); });
          li.addEventListener('mouseleave', () => { if (desktopMQ.matches) closeAll(); });

          submenu?.addEventListener('mouseenter', () => { if (desktopMQ.matches) clearTimeout(navTimer); });
          submenu?.addEventListener('mouseleave', () => { if (desktopMQ.matches) closeAll(); });
        });

        document.addEventListener('click', (e) => {
          if (!block.querySelector('.nav-sections').contains(e.target)) closeAll();
        });

        // Utility dropdown — open on hover (desktop only; mobile utility bar is hidden)
        block.querySelectorAll('.nav-utility li:has(button[aria-haspopup])').forEach((dropLi) => {
          const btn = dropLi.querySelector('button[aria-haspopup]');
          const menu = dropLi.querySelector('ul[role="menu"]');
          let hoverTimer = null;

          const openOnHover = () => {
            clearTimeout(hoverTimer);
            btn.setAttribute('aria-expanded', 'true');
          };
          const closeOnLeave = () => {
            hoverTimer = setTimeout(() => btn.setAttribute('aria-expanded', 'false'), 150);
          };

          dropLi.addEventListener('mouseenter', openOnHover);
          dropLi.addEventListener('mouseleave', closeOnLeave);
          menu?.addEventListener('mouseenter', () => clearTimeout(hoverTimer));
          menu?.addEventListener('mouseleave', closeOnLeave);
        });

        // Remove external-link class — not needed in header nav
        block.querySelectorAll('a.external-link').forEach((link) => link.classList.remove('external-link'));
      },
    },
  };
}
