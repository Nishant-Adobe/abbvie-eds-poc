// import { beforeDecorate, decorateBlock, afterDecorate } from '../{{name}}.js';

export default async function getBlockConfigs() {
  return {
    flags: {
      // flag: true,
    },
    variations: [
      // { variation: 'multi-column-category-banner', module: 'multi-column-cat-banner.js' },
    ],
    decorations: {
      afterDecorate: (block) => {
        block.querySelectorAll('a.external-link').forEach((link) => link.classList.remove('external-link'));
      },
    },
  };
}
