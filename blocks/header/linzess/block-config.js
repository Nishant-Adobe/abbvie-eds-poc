export default async function getBlockConfigs() {
  return {
    flags: {},
    variations: [],
    decorations: {
      afterDecorate: (block) => {
        block.querySelectorAll('a.external-link').forEach((link) => link.classList.remove('external-link'));

        // Remove ISI trigger text ("top") injected into the eyebrow bar by buildEyebrows.
        // buildEyebrows slices paras[2..-2] as content; for Linzess p[2] is the "top" ISI
        // trigger which must not appear in the eyebrow bar.
        const eyebrow = block.querySelector('.nav-eyebrow-top');
        if (eyebrow) {
          eyebrow.querySelectorAll('p').forEach((p) => {
            if (p.textContent.trim().toLowerCase() === 'top') p.remove();
          });
        }
      },
    },
  };
}
