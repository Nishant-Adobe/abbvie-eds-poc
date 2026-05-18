export default async function getBlockConfigs() {
  return {
    flags: {},
    variations: [],
    decorations: {
      afterDecorate: (block) => {
        // Home icon as first item in orange nav bar
        const navUl = block.querySelector('.nav-sections .default-content-wrapper > ul');
        if (navUl && !navUl.querySelector('.nav-home-item')) {
          const homeLi = document.createElement('li');
          homeLi.className = 'nav-home-item';
          const homeLink = document.createElement('a');
          homeLink.href = '/mavyret/';
          homeLink.setAttribute('aria-label', 'Home');
          homeLink.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/></svg>';
          homeLi.appendChild(homeLink);
          navUl.prepend(homeLi);
        }

        // Style "Request a Rep" utility link as a CTA button
        block.querySelectorAll('.nav-utility a').forEach((link) => {
          if (link.textContent.trim().toLowerCase().includes('request a rep')) {
            link.classList.add('nav-utility-cta');
          }
        });

        // Remove external-link class — not needed in header nav
        block.querySelectorAll('a.external-link').forEach((link) => link.classList.remove('external-link'));

        // Clone utility into nav-sections so it appears at the bottom of the mobile overlay
        const navSections = block.querySelector('.nav-sections');
        const utility = block.querySelector('.nav-utility');
        if (navSections && utility) {
          const utilityClone = utility.cloneNode(true);
          utilityClone.classList.add('nav-utility-mobile');
          navSections.appendChild(utilityClone);
        }

        // Click outside nav-sections → collapse all top-level items
        if (!block.dataset.navClickBound) {
          block.dataset.navClickBound = 'true';
          document.addEventListener('click', (e) => {
            if (!block.querySelector('.nav-sections')?.contains(e.target)) {
              block.querySelectorAll('.nav-sections .default-content-wrapper > ul > li').forEach((li) => {
                li.setAttribute('aria-expanded', 'false');
              });
            }
          });
        }
      },
    },
  };
}
