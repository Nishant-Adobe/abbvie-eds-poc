const navClickCleanup = new WeakMap();

function addSubmenuCategoryLabels(block) {
  block.querySelectorAll('.nav-sections .submenu-level-1 ul li a').forEach((a) => {
    const href = a.getAttribute('href') || '';
    if (href === '/atopic-dermatitis' || href === '/atopic-dermatitis/efficacy' || href === '/atopic-dermatitis/real-patients') {
      a.closest('li')?.classList.add('nav-submenu-ref-moderate');
    }
  });
}

function addIndicationText(block) {
  let currentPath = window.location.pathname.replace(/\/$/, '') || '/';
  const brandPrefix = currentPath.match(/^\/content\/[^/]+/);
  if (brandPrefix) currentPath = currentPath.slice(brandPrefix[0].length) || '/';
  if (!currentPath.startsWith('/dermatology') && !currentPath.startsWith('/atopic-dermatitis')) return;
  const navBrand = block.querySelector('.nav-brand .default-content-wrapper');
  if (!navBrand || navBrand.querySelector('.nav-brand-indication-text')) return;
  const indication = document.createElement('span');
  indication.className = 'nav-brand-indication-text';
  indication.innerHTML = 'For adults and pediatric patients 12 years of age and older with refractory, moderate to severe atopic dermatitis (AD) whose disease is not adequately controlled with other systemic drug products, including biologics, or when use of those therapies are inadvisable<sup>1</sup>';
  navBrand.appendChild(indication);
}

function addActiveNavState(block) {
  let currentPath = window.location.pathname.replace(/\/$/, '') || '/';
  const brandPrefix = currentPath.match(/^\/content\/[^/]+/);
  if (brandPrefix) currentPath = currentPath.slice(brandPrefix[0].length) || '/';
  if (currentPath === '/') return;
  block.querySelectorAll('.nav-sections a').forEach((link) => {
    const linkPath = new URL(link.href).pathname.replace(/\/$/, '') || '/';
    if (currentPath === linkPath || (linkPath !== '/' && currentPath.startsWith(linkPath))) {
      link.classList.add('nav-active');
      const topLi = link.closest('.nav-sections .default-content-wrapper > ul > li');
      if (topLi) {
        const topTrigger = topLi.querySelector(':scope > a, :scope > button');
        if (topTrigger && topTrigger !== link) topTrigger.classList.add('nav-active');
      }
    }
  });
}

export default async function getBlockConfigs() {
  return {
    flags: {},
    variations: [],
    decorations: {
      afterDecorate: (block) => {
        // Remove external-link class — not needed in header nav
        block.querySelectorAll('a.external-link').forEach((link) => link.classList.remove('external-link'));

        // Click outside nav-sections → collapse all top-level items (abort previous on re-decorate)
        navClickCleanup.get(block)?.abort();
        const controller = new AbortController();
        navClickCleanup.set(block, controller);
        document.addEventListener('click', (e) => {
          if (!block.querySelector('.nav-sections')?.contains(e.target)) {
            block.querySelectorAll('.nav-sections .default-content-wrapper > ul > li').forEach((li) => {
              li.setAttribute('aria-expanded', 'false');
            });
          }
        }, { signal: controller.signal });

        addActiveNavState(block);
        addSubmenuCategoryLabels(block);
        addIndicationText(block);
      },
    },
  };
}
