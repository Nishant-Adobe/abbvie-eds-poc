export default async function getBlockConfigs() {
  return {
    flags: {},
    variations: [],
    decorations: {
      afterDecorate: () => {
        const observer = new MutationObserver(() => {
          const section = document.querySelector('.safety-bar-section');
          if (!section) return;
          observer.disconnect();

          let overlay = document.createElement('div');
          overlay.className = 'safety-bar-overlay';
          section.prepend(overlay);

          const bar = section.querySelector('.safety-bar');
          if (!bar) return;

          const mo = new MutationObserver(() => {
            overlay.classList.toggle('is-visible', bar.classList.contains('is-expanded'));
          });
          mo.observe(bar, { attributes: true, attributeFilter: ['class'] });
        });
        observer.observe(document.body, { childList: true });
      },
    },
  };
}
