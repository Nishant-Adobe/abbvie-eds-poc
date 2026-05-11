export default async function getBlockConfigs() {
  return {
    flags: {},
    variations: [],
    decorations: {
      afterDecorate: (block) => {
        block.querySelectorAll('a.external-link').forEach((link) => link.classList.remove('external-link'));

        // Utility dropdown — open on hover (desktop; mobile utility bar is hidden via CSS)
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
      },
    },
  };
}
