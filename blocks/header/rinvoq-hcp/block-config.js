/**
 * Rinvoq HCP block-config.js
 * Handles fl-safety variant specifics:
 *   - Sync body padding-bottom with floating ISI strip height (ResizeObserver)
 *   - Scroll-display sticky: hide header on scroll-down, reveal on scroll-up
 *   - Mark body.isi-expanded when ISI panel is open
 */

export default async function getBlockConfigs() {
  return {
    flags: {},
    variations: [],
    decorations: {
      afterDecorate: async (block) => {
        // ── Floating ISI body padding sync ────────────────────────
        const isi = document.getElementById('header-floating-isi');
        if (isi) {
          const syncPadding = () => {
            document.body.style.paddingBottom = `${isi.offsetHeight}px`;
          };
          new ResizeObserver(syncPadding).observe(isi);
          syncPadding();

          // Toggle body class so brand CSS can expand padding when ISI opens
          const toggle = isi.querySelector('.header-floating-isi-toggle');
          if (toggle) {
            toggle.addEventListener('click', () => {
              const expanded = toggle.getAttribute('aria-expanded') === 'true';
              document.body.classList.toggle('isi-expanded', expanded);
            });
          }
        }

        // ── Scroll-display sticky behavior ────────────────────────
        // header is always visible but hides on scroll-down past threshold
        const header = block.closest('header');
        if (!header) return;

        let lastY = window.scrollY;
        const THRESHOLD = 80;

        window.addEventListener('scroll', () => {
          const y = window.scrollY;
          if (y > THRESHOLD) {
            if (y > lastY) {
              // scrolling down: hide header
              header.style.transform = 'translateY(-100%)';
              header.style.transition = 'transform 0.35s ease';
            } else {
              // scrolling up: reveal header
              header.style.transform = 'translateY(0)';
            }
          } else {
            header.style.transform = '';
          }
          lastY = y;
        }, { passive: true });
      },
    },
  };
}
