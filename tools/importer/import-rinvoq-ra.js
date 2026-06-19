/* eslint-disable */
/* global WebImporter */

// PARSER IMPORTS
// ra-page is the page-level orchestrating parser (keyed on `body`). It is
// self-contained and composes every section deterministically.
import raPageParser from './parsers/ra-page.js';

// TRANSFORMER IMPORTS (reused AS-IS from the linzess pipeline)
import cleanupTransformer from './transformers/cleanup.js';
import sectionsTransformer from './transformers/sections.js';

// PARSER REGISTRY
const parsers = {
  'ra-page': raPageParser,
};

// PAGE TEMPLATE CONFIGURATION (also added to page-templates.json)
const PAGE_TEMPLATE = {
  name: 'rinvoq-ra',
  description: 'RINVOQ HCP Rheumatoid Arthritis condition landing page (single page migration). brand-explorer + hero(no-padding) + footnotes + indication(boxed-warning) + benefit cards(cards-grid-cta-card) + access support + ISI lead-in + primary endpoints chart + study cards + ISI(boxed-warning/legal) + references + safety-bar split + metadata.',
  urls: [
    'https://www.rinvoqhcp.com/rheumatoid-arthritis',
  ],
  blocks: [
    {
      name: 'ra-page',
      // No <main> on the live page; `body` is the single deterministic anchor.
      instances: ['body'],
    },
  ],
  sections: [
    { id: 'brand-explorer', name: 'Brand Explorer', style: '' },
    { id: 'ra-hero', name: 'Hero', style: 'ra-hero' },
    { id: 'ra-hero-footnotes', name: 'Hero Footnotes', style: 'ra-hero-footnotes' },
    { id: 'ra-indication', name: 'Indication', style: 'ra-indication' },
    { id: 'ra-benefits', name: 'Benefits', style: 'ra-benefits' },
    { id: 'ra-isi-leadin', name: 'ISI Lead-in', style: 'ra-isi-leadin' },
    { id: 'ra-primary-endpoints', name: 'Primary Endpoints', style: 'ra-primary-endpoints' },
    { id: 'isi-boxed-warning', name: 'ISI Boxed Warning', style: '' },
    { id: 'isi-legal', name: 'ISI Legal', style: '' },
    { id: 'references', name: 'References', style: '' },
    { id: 'safety-bar', name: 'Safety Bar', style: '' },
  ],
};

// TRANSFORMER REGISTRY
const transformers = [
  cleanupTransformer,
  ...(PAGE_TEMPLATE.sections && PAGE_TEMPLATE.sections.length > 1 ? [sectionsTransformer] : []),
];

/**
 * Execute all page transformers for a specific hook.
 * @param {string} hookName 'beforeTransform' | 'afterTransform'
 * @param {Element} element DOM element (document.body)
 * @param {Object} payload { document, url, html, params }
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
 * Find all blocks on the page based on the embedded template configuration.
 * @param {Document} document
 * @param {Object} template
 * @returns {Array}
 */
function findBlocksOnPage(document, template) {
  const pageBlocks = [];
  template.blocks.forEach((blockDef) => {
    blockDef.instances.forEach((selector) => {
      const elements = document.querySelectorAll(selector);
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

/**
 * Append the trailing Metadata block, WRAPPED in a section <div> (md2jcr rule:
 * an unwrapped metadata block leaks as visible text). Matches the tail of
 * content/rinvoq-hcp/index.plain.html: brand/rinvoq-hcp, nav, footer + page
 * Title/Description.
 * @param {Element} main
 * @param {Document} document
 */
function appendMetadata(main, document) {
  const cells = [
    ['Metadata'],
    ['brand', 'rinvoq-hcp'],
    ['nav', '/rinvoq-hcp/nav'],
    ['footer', '/rinvoq-hcp/footer'],
    ['title', 'RINVOQ® (upadacitinib) for Rheumatoid Arthritis'],
    ['description', 'RINVOQ (upadacitinib) is indicated for moderate to severe RA in adult TNFi-IR patients. Met primary endpoints in 4 trials. See full PI and Important Safety Information, including BOXED WARNING.'],
  ];

  const block = WebImporter.DOMUtils.createTable(cells, document);

  // CRITICAL: wrap the metadata block in an outer section div (md2jcr rule).
  const section = document.createElement('div');
  section.append(block);
  main.append(section);
}

// EXPORT DEFAULT CONFIGURATION
export default {
  transform: (payload) => {
    const { document, url, params } = payload;
    const main = document.body;

    // 1. beforeTransform (cleanup chrome)
    executeTransformers('beforeTransform', main, payload);

    // 2. Find blocks (the page-level parser keyed on `body`)
    const pageBlocks = findBlocksOnPage(document, PAGE_TEMPLATE);

    // 3. Parse each block. The ra-page parser composes the entire page.
    pageBlocks.forEach((block) => {
      if (!block.element.parentNode && block.element !== document.body) return;
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

    // 4. afterTransform (normalize section breaks)
    executeTransformers('afterTransform', main, payload);

    // 5. WebImporter built-in rules + metadata
    const hr = document.createElement('hr');
    main.appendChild(hr);
    appendMetadata(main, document);
    WebImporter.rules.transformBackgroundImages(main, document);
    WebImporter.rules.adjustImageUrls(main, url, params.originalURL);

    // 6. Generate sanitized path -> /rinvoq-hcp/rheumatoid-arthritis
    const sourcePath = new URL(params.originalURL).pathname
      .replace(/\/$/, '')
      .replace(/\.html$/, '');
    const path = WebImporter.FileUtils.sanitizePath(`/rinvoq-hcp${sourcePath}`);

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
