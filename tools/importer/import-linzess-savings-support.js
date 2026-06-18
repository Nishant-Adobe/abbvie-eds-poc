/* eslint-disable */
/* global WebImporter */

// PARSER IMPORTS
// savings-page is the page-level orchestrating parser (keyed on `body`). It is
// self-contained and composes every section deterministically. The remaining
// per-block parsers build the SAME block tables and are kept as the canonical
// one-parser-per-block reference (importable for reuse / future multi-page work).
import savingsPageParser from './parsers/savings-page.js';
import heroParser from './parsers/hero.js';
import sectionNavParser from './parsers/section-nav.js';
import savingsPromoParser from './parsers/savings-promo.js';
import cardsGridSignupParser from './parsers/cards-grid-signup.js';
import accordionParser from './parsers/accordion.js';
import insuranceTableParser from './parsers/insurance-table.js';
import financialInfoBoxesParser from './parsers/financial-info-boxes.js';
import gutCheckParser from './parsers/gut-check.js';
import cardsGridExploreParser from './parsers/cards-grid-explore.js';
import isiSafetyBarParser from './parsers/isi-safety-bar.js';

// TRANSFORMER IMPORTS
import cleanupTransformer from './transformers/cleanup.js';
import sectionsTransformer from './transformers/sections.js';

// PARSER REGISTRY
const parsers = {
  'savings-page': savingsPageParser,
  hero: heroParser,
  'section-nav': sectionNavParser,
  'savings-promo': savingsPromoParser,
  'cards-grid-signup': cardsGridSignupParser,
  accordion: accordionParser,
  'insurance-table': insuranceTableParser,
  'financial-info-boxes': financialInfoBoxesParser,
  'gut-check': gutCheckParser,
  'cards-grid-explore': cardsGridExploreParser,
  'isi-safety-bar': isiSafetyBarParser,
};

// PAGE TEMPLATE CONFIGURATION (embedded from page-templates.json)
const PAGE_TEMPLATE = {
  name: 'linzess-savings-support',
  description: 'LINZESS Savings & Support page (single page migration).',
  urls: [
    'https://www.linzess.com/savings-and-support',
  ],
  blocks: [
    {
      name: 'savings-page',
      // No <main> on the live page; `body` is the single deterministic anchor.
      instances: ['body'],
    },
  ],
  sections: [
    { id: 'hero', name: 'Hero', style: '' },
    { id: 'section-nav', name: 'Section Nav', style: '' },
    { id: 'savings', name: 'Savings', style: '' },
    { id: 'financial-support', name: 'Financial Support', style: '' },
    { id: 'explore', name: 'Explore', style: 'background-dark-purple background-dark-purple-arc' },
    { id: 'isi', name: 'ISI', style: '' },
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
 * content/linzess/index.plain.html: brand/linzess, nav, footer + page Title/Description.
 * @param {Element} main
 * @param {Document} document
 */
function appendMetadata(main, document) {
  const meta = {};
  const title = document.querySelector('title');
  if (title) meta.Title = title.textContent.replace(/[\n\t]/gm, '').trim();
  const desc = document.querySelector('[property="og:description"], [name="description"]');
  if (desc) meta.Description = desc.getAttribute('content') || '';

  const cells = [
    ['Metadata'],
    ['brand', 'linzess'],
    ['nav', '/linzess/nav'],
    ['footer', '/linzess/footer'],
  ];
  if (meta.Title) cells.push(['Title', meta.Title]);
  if (meta.Description) cells.push(['Description', meta.Description]);

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

    // 3. Parse each block. The savings-page parser composes the entire page.
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

    // 6. Generate sanitized path -> /linzess/savings-and-support
    const sourcePath = new URL(params.originalURL).pathname
      .replace(/\/$/, '')
      .replace(/\.html$/, '');
    const path = WebImporter.FileUtils.sanitizePath(`/linzess${sourcePath}`);

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
