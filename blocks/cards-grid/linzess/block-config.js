import { decorateBlock } from '../cards-grid.js';
import brandDecorate, { fixDosingIcons } from './cards-grid.js';

export default async function getBlockConfigs() {
  return {
    decorations: {
      decorate: async (ctx) => {
        if (!brandDecorate(ctx)) decorateBlock(ctx);
        fixDosingIcons(ctx);
      },
    },
  };
}
