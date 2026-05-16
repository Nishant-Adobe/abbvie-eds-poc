export default async function getBlockConfigs() {
  return {
    flags: {},
    variations: [],
    decorations: {
      afterDecorate: (block) => {
        // Remove external-link class — not needed in header nav
        block.querySelectorAll('a.external-link').forEach((link) => link.classList.remove('external-link'));

        // Desktop hover — open nav section submenu on hover
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

        if (!block.dataset.navClickBound) {
          block.dataset.navClickBound = 'true';
          document.addEventListener('click', (e) => {
            if (!block.querySelector('.nav-sections').contains(e.target)) closeAll();
          });
        }
      },
    },
  };
}
