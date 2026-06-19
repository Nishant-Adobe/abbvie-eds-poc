/* eslint-disable */
/* global WebImporter */

// TRANSFORMER IMPORTS
import cleanupTransformer from './transformers/linzess-cleanup.js';
import subpageSeoTransformer from './transformers/savings-card-subpage-seo.js';

// PAGE TEMPLATE CONFIGURATION
const PAGE_TEMPLATE = {
  name: 'savings-card-subpage',
  description: 'Linzess savings card sub-pages including terms, activation, and savings details',
  urls: [
    'https://www.linzess.com/savings-card/terms',
    'https://www.linzess.com/savings-card/activate',
    'https://www.linzess.com/savings-card/savings'
  ],
  blocks: [],
  sections: []
};

// TRANSFORMER REGISTRY
const transformers = [
  cleanupTransformer, // beforeTransform: strip header/footer/cookie/scripts
  subpageSeoTransformer, // afterTransform: promote lead heading to h1 + curated Metadata (brand/title/description)
];

function executeTransformers(hookName, element, payload) {
  const enhancedPayload = {
    ...payload,
    template: PAGE_TEMPLATE
  };

  transformers.forEach((transformerFn) => {
    try {
      transformerFn.call(null, hookName, element, enhancedPayload);
    } catch (e) {
      console.error(`Transformer failed at ${hookName}:`, e);
    }
  });
}

export default {
  transform: (payload) => {
    const { document, url, html, params } = payload;

    const main = document.body;

    // 1. Execute beforeTransform transformers (initial cleanup)
    executeTransformers('beforeTransform', main, payload);

    // 2. Execute afterTransform transformers (final cleanup)
    executeTransformers('afterTransform', main, payload);

    // 3. Apply WebImporter built-in rules.
    // NOTE: metadata is appended explicitly by subpageSeoTransformer (curated
    // brand/title/description), so we do NOT call WebImporter.rules.createMetadata
    // here — it would emit a duplicate Metadata block and overwrite the curated
    // description with the live page's (often empty/unreliable) <head> values.
    WebImporter.rules.transformBackgroundImages(main, document);
    WebImporter.rules.adjustImageUrls(main, url, params.originalURL);

    // 4. Generate sanitized path under the linzess brand folder. The live URL
    // pathname is /savings-card/<slug>, but these pages are authored under
    // /linzess/savings-card/<slug> in this project, so prefix the brand.
    const slug = new URL(params.originalURL).pathname
      .replace(/\/$/, '')
      .replace(/\.html$/, '')
      .split('/')
      .filter(Boolean)
      .pop() || 'index';
    const path = WebImporter.FileUtils.sanitizePath(`/linzess/savings-card/${slug}`);

    return [{
      element: main,
      path,
      report: {
        title: document.title,
        template: PAGE_TEMPLATE.name,
        blocks: [],
      }
    }];
  }
};
