/* eslint-disable */
/* global WebImporter */

// PARSER IMPORTS
import heroParser from './parsers/hero.js';
import columnsParser from './parsers/columns.js';
import safetyBarParser from './parsers/safety-bar.js';

// TRANSFORMER IMPORTS
import cleanupTransformer from './transformers/linzess-cleanup.js';
import sectionsTransformer from './transformers/linzess-sections.js';

// PARSER REGISTRY
const parsers = {
  hero: heroParser,
  columns: columnsParser,
  'safety-bar': safetyBarParser,
};

// PAGE TEMPLATE CONFIGURATION (embedded from page-templates.json)
const PAGE_TEMPLATE = {
  name: 'linzess-healthy-routines-article',
  description: 'Linzess DTC healthy-routines article page.',
  urls: [
    'https://www.linzess.com/starting-linzess/healthy-routines/keeping-in-touch-with-your-doctor',
  ],
  blocks: [
    {
      name: 'hero',
      instances: [
        'div.image-text-v2.parbase > div.hero-container.abbv-image-text-v2.abbv-image-swap',
      ],
      section: 'hero-container',
    },
    {
      name: 'columns',
      instances: [
        'div.abbv-container.linzess-keep-touch-doctor.background-white > div.columns.parbase',
        'div.abbv-container.background-dark-purple.keep-in-touch-doctor > div.columns.parbase',
        'div.abbv-container.background-dark-purple.keep-in-touch-doctor > div.image-text-v2.parbase',
        'div.abbv-container.background-light-purple > div.image-text-v2.parbase',
        'div.container.parbase:nth-of-type(5) div.flexbox-v2.parbase',
        'div.container.parbase:nth-of-type(6) .abbv-container',
      ],
    },
    {
      name: 'safety-bar',
      instances: [
        'div.abbv-inline-use-isi',
        'div.abbv-fixed-isi',
      ],
      section: 'split',
    },
  ],
  sections: [
    { id: 'hero', name: 'Hero', selector: 'section > div.image-text-v2.parbase', style: null, blocks: ['hero'], defaultContent: [] },
    { id: 'touchpoints', name: 'Touchpoints intro + icon cards', selector: 'div.abbv-container.linzess-keep-touch-doctor.background-white', style: 'kit-touchpoints-section', blocks: ['columns'], defaultContent: ['div.abbv-container.linzess-keep-touch-doctor.background-white > div.rich-text'] },
    { id: 'relief', name: 'Relief + Side Effects', selector: 'div.abbv-container.background-dark-purple.keep-in-touch-doctor', style: 'kit-relief-section', blocks: ['columns'], defaultContent: ['div.abbv-container.background-dark-purple.keep-in-touch-doctor > div.rich-text:nth-of-type(1)', 'div.abbv-container.background-dark-purple.keep-in-touch-doctor > div.rich-text:nth-of-type(3)'] },
    { id: 'conversation', name: 'Keep the Conversation Going', selector: 'div.abbv-container.background-light-purple', style: 'kit-conversation-section', blocks: ['columns'], defaultContent: ['div.abbv-container.background-light-purple > div.rich-text'] },
    { id: 'more-like-this', name: 'More Like This', selector: 'div.container.parbase:nth-of-type(5) > div.abbv-container.background-white', style: 'more-like-this-section', blocks: ['columns'], defaultContent: ['div.container.parbase:nth-of-type(5) > div.abbv-container.background-white > div.rich-text'] },
    { id: 'cta-cards', name: 'CTA Cards', selector: 'div.container.parbase:nth-of-type(6)', style: 'cta-cards-section', blocks: ['columns'], defaultContent: [] },
    { id: 'isi', name: 'Inline ISI', selector: 'div.abbv-inline-use-isi', style: 'isi', blocks: [], defaultContent: ['div.abbv-inline-use-isi > div.abbv-inline-use', 'div.abbv-inline-use-isi > div.abbv-inline-safety'] },
  ],
};

// TRANSFORMER REGISTRY (cleanup first, then section breaks/metadata)
const transformers = [
  cleanupTransformer,
  ...(PAGE_TEMPLATE.sections && PAGE_TEMPLATE.sections.length > 1 ? [sectionsTransformer] : []),
];

/**
 * Execute all page transformers for a specific hook.
 */
function executeTransformers(hookName, element, payload) {
  const enhancedPayload = { ...payload, template: PAGE_TEMPLATE };
  transformers.forEach((transformerFn) => {
    try {
      transformerFn.call(null, hookName, element, enhancedPayload);
    } catch (e) {
      console.error(`Transformer failed at ${hookName}:`, e);
    }
  });
}

/**
 * Find all block instances on the page based on the embedded template.
 */
function findBlocksOnPage(document, template) {
  const pageBlocks = [];
  template.blocks.forEach((blockDef) => {
    blockDef.instances.forEach((selector) => {
      let elements = [];
      try {
        elements = document.querySelectorAll(selector);
      } catch (e) {
        console.warn(`Invalid selector for block "${blockDef.name}": ${selector}`);
        return;
      }
      if (elements.length === 0) {
        console.warn(`Block "${blockDef.name}" selector not found: ${selector}`);
      }
      elements.forEach((element) => {
        pageBlocks.push({
          name: blockDef.name,
          selector,
          element,
          section: blockDef.section || null,
        });
      });
    });
  });
  console.log(`Found ${pageBlocks.length} block instances on page`);
  return pageBlocks;
}

export default {
  transform: (payload) => {
    const { document, url, params } = payload;
    const main = document.body;

    // 1. beforeTransform cleanup
    executeTransformers('beforeTransform', main, payload);

    // 2. Discover blocks
    const pageBlocks = findBlocksOnPage(document, PAGE_TEMPLATE);

    // 3. Parse each block (skip those already replaced by a prior parser)
    pageBlocks.forEach((block) => {
      if (!block.element.parentNode) return;
      const parser = parsers[block.name];
      if (parser) {
        try {
          parser(block.element, { document, url, params });
        } catch (e) {
          console.error(`Failed to parse ${block.name} (${block.selector}):`, e);
        }
      } else {
        console.warn(`No parser found for block: ${block.name}`);
      }
    });

    // 4. afterTransform cleanup + section breaks/metadata
    executeTransformers('afterTransform', main, payload);

    // 5. WebImporter built-in rules
    const hr = document.createElement('hr');
    main.appendChild(hr);
    WebImporter.rules.createMetadata(main, document);
    WebImporter.rules.transformBackgroundImages(main, document);
    WebImporter.rules.adjustImageUrls(main, url, params.originalURL);

    // 6. Sanitized path
    const path = WebImporter.FileUtils.sanitizePath(
      new URL(params.originalURL).pathname.replace(/\/$/, '').replace(/\.html$/, ''),
    );

    return [{
      element: main,
      path,
      report: {
        title: document.title,
        template: PAGE_TEMPLATE.name,
        blocks: pageBlocks.map((b) => b.name),
      },
    }];
  },
};
