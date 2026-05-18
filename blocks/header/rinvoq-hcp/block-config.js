export default async function getBlockConfigs() {
  return {
    flags: {},
    variations: [],
    decorations: {
      afterDecorate: (block) => {
        // Remove external-link class — not needed in header nav
        block.querySelectorAll('a.external-link').forEach((link) => link.classList.remove('external-link'));

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
