/* eslint-disable */
/* global WebImporter */

// PARSER IMPORTS
import brightcoveVideoParser from './parsers/brightcove-video.js';
import cardsParser from './parsers/cards.js';
import columnsParser from './parsers/columns.js';
import fragmentParser from './parsers/fragment.js';
import tabsParser from './parsers/tabs.js';

// TRANSFORMER IMPORTS
import linzessCleanupTransformer from './transformers/linzess-cleanup.js';
import linzessSectionsTransformer from './transformers/linzess-sections.js';

// PARSER REGISTRY
const parsers = {
  'brightcove-video': brightcoveVideoParser,
  'cards': cardsParser,
  'columns': columnsParser,
  'fragment': fragmentParser,
  'tabs': tabsParser,
};

// PAGE TEMPLATE CONFIGURATION
const PAGE_TEMPLATE = {
  name: 'find-relief',
  description: 'Linzess Find Relief page - Talk to a Doctor, How to Take LINZESS sections with videos, cards, tabs',
  urls: [
    'https://www.linzess.com/find-relief'
  ],
  blocks: [
    {
      name: 'section-nav',
      instances: ['.abbv-section-navigation']
    },
    {
      name: 'columns',
      instances: ['.image-outside-container-v3.abbv-image-text-v2', '.abbv-row-container.savings-card-tout', '.abbv-container.background-dark-purple-gradient .abbv-image-text-v2']
    },
    {
      name: 'brightcove-video',
      instances: ['.abbv-video-player']
    },
    {
      name: 'cards',
      instances: ['.abbv-flex-container-v2:has(.icon-image-card)', '.savings-card-cards']
    },
    {
      name: 'tabs',
      instances: ['.abbv-tabs']
    },
    {
      name: 'fragment',
      instances: ['.abbv-inline-use-isi']
    }
  ],
  sections: [
    {
      id: 'hero',
      name: 'Hero',
      selector: '.hero-container.abbv-image-text-v2',
      style: null,
      blocks: [],
      defaultContent: ['.abbv-image-text-content-v2 .heading-1', '.abbv-image-text-content-v2 p']
    },
    {
      id: 'section-nav',
      name: 'Section Navigation',
      selector: '.section-navigation.parbase',
      style: null,
      blocks: ['section-nav'],
      defaultContent: []
    },
    {
      id: 'talk-to-a-doctor',
      name: 'Talk to a Doctor',
      selector: ['#talktoadoctor', '.abbv-container.background-white.background-white-arc'],
      style: 'find-relief-checklist',
      blocks: ['columns', 'brightcove-video'],
      defaultContent: ['.abbv-rich-text.text-align-center.narrow-spacing', '.checkmark-list']
    },
    {
      id: 'how-to-take',
      name: 'How to Take LINZESS',
      selector: ['#howtotake', '.abbv-container.background-off-white'],
      style: 'find-relief-off-white',
      blocks: ['brightcove-video', 'cards', 'tabs', 'columns'],
      defaultContent: ['.abbv-rich-text.text-align-center']
    },
    {
      id: 'bottom-cta',
      name: 'Bottom Navigation CTA',
      selector: '.abbv-container.background-dark-purple.bottom-nav',
      style: 'find-relief-dark-purple',
      blocks: ['columns'],
      defaultContent: []
    },
    {
      id: 'isi',
      name: 'ISI',
      selector: '.abbv-inline-use-isi',
      style: null,
      blocks: ['fragment'],
      defaultContent: []
    }
  ]
};

// TRANSFORMER REGISTRY
const transformers = [
  linzessCleanupTransformer,
  ...(PAGE_TEMPLATE.sections && PAGE_TEMPLATE.sections.length > 1 ? [linzessSectionsTransformer] : []),
];

/**
 * Execute all page transformers for a specific hook
 */
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

/**
 * Find all blocks on the page based on the embedded template configuration
 */
function findBlocksOnPage(document, template) {
  const pageBlocks = [];

  template.blocks.forEach(blockDef => {
    // Skip section-nav as it's handled by the sections transformer
    if (blockDef.name.startsWith('section-')) return;

    blockDef.instances.forEach(selector => {
      const elements = document.querySelectorAll(selector);
      if (elements.length === 0) {
        console.warn(`Block "${blockDef.name}" selector not found: ${selector}`);
      }
      elements.forEach(element => {
        pageBlocks.push({
          name: blockDef.name,
          selector,
          element,
          section: blockDef.section || null
        });
      });
    });
  });

  console.log(`Found ${pageBlocks.length} block instances on page`);
  return pageBlocks;
}

// EXPORT DEFAULT CONFIGURATION
export default {
  transform: (payload) => {
    const { document, url, html, params } = payload;

    const main = document.body;

    // 1. Execute beforeTransform transformers (initial cleanup)
    executeTransformers('beforeTransform', main, payload);

    // 2. Find blocks on page using embedded template
    const pageBlocks = findBlocksOnPage(document, PAGE_TEMPLATE);

    // 3. Parse each block using registered parsers
    pageBlocks.forEach(block => {
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

    // 4. Execute afterTransform transformers (final cleanup + section breaks/metadata)
    executeTransformers('afterTransform', main, payload);

    // 5. Apply WebImporter built-in rules
    const hr = document.createElement('hr');
    main.appendChild(hr);
    WebImporter.rules.createMetadata(main, document);
    WebImporter.rules.transformBackgroundImages(main, document);
    WebImporter.rules.adjustImageUrls(main, url, params.originalURL);

    // 6. Generate sanitized path
    const path = WebImporter.FileUtils.sanitizePath(
      new URL(params.originalURL).pathname.replace(/\/$/, '').replace(/\.html$/, '')
    );

    return [{
      element: main,
      path,
      report: {
        title: document.title,
        template: PAGE_TEMPLATE.name,
        blocks: pageBlocks.map(b => b.name),
      }
    }];
  }
};
