/* eslint-disable */
/* global WebImporter */

// PARSER IMPORTS
import brightcoveVideoParser from './parsers/brightcove-video.js';
import cardsParser from './parsers/cards.js';
import columnsParser from './parsers/columns.js';
import fragmentParser from './parsers/fragment.js';
import heroParser from './parsers/hero.js';
import sectionNavParser from './parsers/section-nav.js';
import tabsParser from './parsers/tabs.js';

// TRANSFORMER IMPORTS
import linzessCleanupTransformer from './transformers/linzess-cleanup.js';
import linzessSubpageSplitterTransformer from './transformers/linzess-subpage-splitter.js';
import linzessSectionsTransformer from './transformers/linzess-sections.js';

// PARSER REGISTRY
const parsers = {
  'brightcove-video': brightcoveVideoParser,
  'cards': cardsParser,
  'columns': columnsParser,
  'fragment': fragmentParser,
  'hero': heroParser,
  'section-nav': sectionNavParser,
  'tabs': tabsParser,
};

// PAGE TEMPLATE CONFIGURATION
const PAGE_TEMPLATES = {
  'find-relief': {
    name: 'find-relief',
    description: 'Linzess Find Relief page - Talk to a Doctor, How to Take LINZESS sections with videos, cards, tabs',
    documentPath: '/linzess/find-relief/index',
    urls: ['https://www.linzess.com/find-relief'],
    blocks: [
      { name: 'hero', instances: ['.hero-container.abbv-image-text-v2'] },
      { name: 'section-nav', instances: ['.abbv-section-navigation'] },
      { name: 'columns', instances: ['.image-outside-container-v3.abbv-image-text-v2', '.abbv-row-container.savings-card-tout', '.abbv-container.background-dark-purple-gradient .abbv-image-text-v2'] },
      { name: 'brightcove-video', instances: ['.abbv-video-player'] },
      { name: 'cards', instances: ['.abbv-flex-container-v2:has(.icon-image-card)', '.savings-card-cards'] },
      { name: 'tabs', instances: ['.abbv-tabs'] },
      { name: 'fragment', instances: ['.abbv-inline-use-isi'] },
    ],
    sections: [
      { id: 'hero', name: 'Hero', selector: '.hero-container.abbv-image-text-v2', style: null, anchorId: null, blocks: ['hero'], defaultContent: [] },
      { id: 'section-nav', name: 'Section Navigation', selector: '.section-navigation.parbase', style: null, anchorId: null, blocks: ['section-nav'], defaultContent: [] },
      { id: 'talk-to-a-doctor', name: 'Talk to a Doctor', selector: ['#talktoadoctor', '.abbv-container.background-white.background-white-arc'], style: 'find-relief-checklist', anchorId: 'talktoadoctor', blocks: ['columns', 'brightcove-video'], defaultContent: ['.abbv-rich-text.text-align-center.narrow-spacing', '.checkmark-list'] },
      { id: 'how-to-take', name: 'How to Take LINZESS', selector: ['#howtotake', '.abbv-container.background-off-white'], style: 'find-relief-off-white', anchorId: 'howtotake', blocks: ['brightcove-video', 'cards', 'tabs', 'columns'], defaultContent: ['.abbv-rich-text.text-align-center'] },
      { id: 'bottom-cta', name: 'Bottom Navigation CTA', selector: '.abbv-container.background-dark-purple.bottom-nav', style: 'find-relief-dark-purple', anchorId: null, blocks: ['columns'], defaultContent: [] },
      { id: 'isi', name: 'ISI', selector: '.abbv-inline-use-isi', style: null, anchorId: null, blocks: ['fragment'], defaultContent: [] },
    ],
  },
  'find-relief-talk-to-a-doctor': {
    name: 'find-relief-talk-to-a-doctor',
    description: 'Linzess Find Relief subpage - Talk to a Doctor section',
    documentPath: '/linzess/find-relief/talk-to-a-doctor',
    urls: ['https://www.linzess.com/find-relief'],
    blocks: [
      { name: 'hero', instances: ['.hero-container.abbv-image-text-v2'] },
      { name: 'section-nav', instances: ['.abbv-section-navigation'] },
      { name: 'columns', instances: ['.image-outside-container-v3.abbv-image-text-v2'] },
      { name: 'brightcove-video', instances: ['.abbv-video-player'] },
      { name: 'fragment', instances: ['.abbv-inline-use-isi'] },
    ],
    sections: [
      { id: 'hero', name: 'Hero', selector: '.hero-container.abbv-image-text-v2', style: null, anchorId: null, blocks: ['hero'], defaultContent: [] },
      { id: 'section-nav', name: 'Section Navigation', selector: '.section-navigation.parbase', style: null, anchorId: null, blocks: ['section-nav'], defaultContent: [] },
      { id: 'talk-to-a-doctor', name: 'Talk to a Doctor', selector: ['#talktoadoctor', '.abbv-container.background-white.background-white-arc'], style: 'find-relief-checklist', anchorId: 'talktoadoctor', blocks: ['columns', 'brightcove-video'], defaultContent: ['.abbv-rich-text.text-align-center.narrow-spacing', '.checkmark-list'] },
      { id: 'bottom-cta', name: 'Bottom Navigation CTA', selector: '.abbv-container.background-dark-purple.bottom-nav', style: 'find-relief-dark-purple', anchorId: null, blocks: ['columns'], defaultContent: [] },
      { id: 'isi', name: 'ISI', selector: '.abbv-inline-use-isi', style: null, anchorId: null, blocks: ['fragment'], defaultContent: [] },
    ],
  },
  'find-relief-how-to-take-linzess': {
    name: 'find-relief-how-to-take-linzess',
    description: 'Linzess Find Relief subpage - How to Take LINZESS',
    documentPath: '/linzess/find-relief/how-to-take-linzess',
    urls: ['https://www.linzess.com/find-relief'],
    blocks: [
      { name: 'hero', instances: ['.hero-container.abbv-image-text-v2'] },
      { name: 'section-nav', instances: ['.abbv-section-navigation'] },
      { name: 'columns', instances: ['.abbv-row-container.savings-card-tout', '.abbv-container.background-dark-purple-gradient .abbv-image-text-v2'] },
      { name: 'brightcove-video', instances: ['.abbv-video-player'] },
      { name: 'cards', instances: ['.abbv-flex-container-v2:has(.icon-image-card)', '.savings-card-cards'] },
      { name: 'tabs', instances: ['.abbv-tabs'] },
      { name: 'fragment', instances: ['.abbv-inline-use-isi'] },
    ],
    sections: [
      { id: 'hero', name: 'Hero', selector: '.hero-container.abbv-image-text-v2', style: null, anchorId: null, blocks: ['hero'], defaultContent: [] },
      { id: 'section-nav', name: 'Section Navigation', selector: '.section-navigation.parbase', style: null, anchorId: null, blocks: ['section-nav'], defaultContent: [] },
      { id: 'how-to-take', name: 'How to Take LINZESS', selector: ['#howtotake', '.abbv-container.background-off-white'], style: 'find-relief-off-white', anchorId: 'howtotake', blocks: ['brightcove-video', 'cards', 'tabs', 'columns'], defaultContent: ['.abbv-rich-text.text-align-center'] },
      { id: 'bottom-cta', name: 'Bottom Navigation CTA', selector: '.abbv-container.background-dark-purple.bottom-nav', style: 'find-relief-dark-purple', anchorId: null, blocks: ['columns'], defaultContent: [] },
      { id: 'isi', name: 'ISI', selector: '.abbv-inline-use-isi', style: null, anchorId: null, blocks: ['fragment'], defaultContent: [] },
    ],
  },
};

/**
 * Resolve which template to use based on URL params or subpage markers.
 */
function resolveTemplate(params) {
  const subpageName = params?.subpageName || '';
  if (subpageName && PAGE_TEMPLATES[subpageName]) {
    return PAGE_TEMPLATES[subpageName];
  }
  return PAGE_TEMPLATES['find-relief'];
}

// TRANSFORMER REGISTRY (order matters: cleanup → subpage split → sections)
const transformers = [
  linzessCleanupTransformer,
  linzessSubpageSplitterTransformer,
  linzessSectionsTransformer,
];

/**
 * Execute all page transformers for a specific hook
 */
function executeTransformers(hookName, element, payload) {
  transformers.forEach((transformerFn) => {
    try {
      transformerFn.call(null, hookName, element, payload);
    } catch (e) {
      console.error(`Transformer failed at ${hookName}:`, e);
    }
  });
}

/**
 * Find all blocks on the page based on the template configuration
 */
function findBlocksOnPage(document, template) {
  const pageBlocks = [];

  template.blocks.forEach(blockDef => {
    blockDef.instances.forEach(selector => {
      try {
        const elements = document.querySelectorAll(selector);
        elements.forEach(element => {
          pageBlocks.push({
            name: blockDef.name,
            selector,
            element,
            section: blockDef.section || null
          });
        });
      } catch (e) {
        console.warn(`Block "${blockDef.name}" selector failed: ${selector}`, e.message);
      }
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

    // Resolve template based on params
    const template = resolveTemplate(params);

    // Build enhanced payload with template
    const enhancedPayload = { ...payload, template };

    // 1. Execute beforeTransform transformers (cleanup + subpage splitting)
    executeTransformers('beforeTransform', main, enhancedPayload);

    // 2. Find blocks on page using resolved template
    const pageBlocks = findBlocksOnPage(document, template);

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

    // 4. Execute afterTransform transformers (section breaks/metadata)
    executeTransformers('afterTransform', main, enhancedPayload);

    // 5. Apply WebImporter built-in rules
    const hr = document.createElement('hr');
    main.appendChild(hr);
    WebImporter.rules.createMetadata(main, document);
    WebImporter.rules.transformBackgroundImages(main, document);
    WebImporter.rules.adjustImageUrls(main, url, params.originalURL);

    // 6. Generate sanitized path
    const path = template.documentPath || WebImporter.FileUtils.sanitizePath(
      new URL(params.originalURL).pathname.replace(/\/$/, '').replace(/\.html$/, '')
    );

    return [{
      element: main,
      path,
      report: {
        title: document.title,
        template: template.name,
        blocks: pageBlocks.map(b => b.name),
      }
    }];
  }
};
