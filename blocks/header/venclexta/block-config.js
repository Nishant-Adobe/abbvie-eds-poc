export default async function getBlockConfigs() {
  return {
    flags: {},
    variations: [],
    decorations: {
      afterDecorate: (block) => {
        block.querySelectorAll('a.external-link').forEach((link) => link.classList.remove('external-link'));

        const nav = block.querySelector('nav');
        if (!nav) return;

        // The brand-info block (phone/support text) has a <p> with text content so header.js
        // treats it as a nav-sections item instead of brand-info. Move the first nav-sections
        // li that has no .navigation-group (no real submenu items) into .nav-brand-info.
        const sectionsUl = nav.querySelector('.nav-sections .default-content-wrapper > ul');
        if (!sectionsUl) return;

        const firstLi = sectionsUl.querySelector('li');
        if (!firstLi || firstLi.querySelector('.navigation-group')) return;

        const btn = firstLi.querySelector('button');
        if (!btn) return;

        firstLi.remove();

        let brandInfo = nav.querySelector('.nav-brand-info');
        if (!brandInfo) {
          brandInfo = document.createElement('div');
          brandInfo.className = 'nav-brand-info';
          const navSections = nav.querySelector('.nav-sections');
          nav.insertBefore(brandInfo, navSections || null);
        }

        const p = document.createElement('p');
        p.textContent = btn.textContent.trim();
        brandInfo.appendChild(p);
      },
    },
  };
}
