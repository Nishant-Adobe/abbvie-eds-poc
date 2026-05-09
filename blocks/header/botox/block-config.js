// import { beforeDecorate, decorateBlock, afterDecorate } from '../header.js';

export default async function getBlockConfigs() {
  return {
    flags: {},
    variations: [],
    decorations: {
      afterDecorate: (block) => {
        block.querySelectorAll('a.external-link').forEach((link) => link.classList.remove('external-link'));
      },
    },
  };
}
