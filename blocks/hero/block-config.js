import { decorateBlock } from './hero.js';

export default async function getBlockConfigs() {
  return {
    flags: {
      // bannerCol,
    },
    variations: [
      // { variation: 'multi-column-category-banner', module: 'multi-column-cat-banner.js' },
    ],
    decorations: {
      decorate: async (ctx, blockConfig) => decorateBlock(ctx, blockConfig),
    },
  };
}
