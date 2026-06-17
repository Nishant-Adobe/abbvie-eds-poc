/* eslint-disable */
/* global WebImporter */

// PARSER IMPORTS
import heroParser from './parsers/hero.js';
import sectionNavParser from './parsers/section-nav.js';
import embedParser from './parsers/embed.js';
import cardsGridParser from './parsers/cards-grid.js';
import columnsParser from './parsers/columns.js';
import tabsParser from './parsers/tabs.js';
import textContainerParser from './parsers/text-container.js';

// TRANSFORMER IMPORTS
import cleanupTransformer from './transformers/linzess-cleanup.js';
import imagesTransformer from './transformers/linzess-images.js';
import sectionsTransformer from './transformers/linzess-sections.js';

// PARSER REGISTRY
const parsers = {
  hero: heroParser,
  'section-nav': sectionNavParser,
  embed: embedParser,
  'cards-grid': cardsGridParser,
  columns: columnsParser,
  tabs: tabsParser,
  'text-container': textContainerParser,
};

// TRANSFORMER REGISTRY (cleanup → images → sections; sections must run last so
// section breaks are inserted after parsers have produced block tables).
const transformers = [
  cleanupTransformer,
  imagesTransformer,
  sectionsTransformer,
];

// PAGE TEMPLATE CONFIGURATION (embedded from page-templates.json)
const PAGE_TEMPLATE = {
  name: 'find-relief',
  description: 'LINZESS Find Relief content page and Gut Check (static).',
  urls: [
    'https://www.linzess.com/find-relief',
    'https://www.linzess.com/find-relief/gutcheck',
  ],
  blocks: [
    { name: 'hero', instances: ['.hero-container.abbv-image-text-v2'] },
    { name: 'section-nav', instances: ['.abbv-section-navigation'] },
    { name: 'embed', instances: ['.abbv-video-player'] },
    { name: 'cards-grid', instances: ['.abbv-flex-container-v2.flexbox-cards:not(.flexbox-video-cards)'] },
    { name: 'tabs', instances: ['.abbv-container.background-white.rounded-corners'] },
    {
      name: 'columns',
      instances: [
        '.abbv-row-container.image-text-wrapper',
        '.abbv-flex-container-v2.flexbox-column-mobile:not(.flexbox-cards):not(.flexbox-video-cards)',
      ],
    },
    { name: 'text-container', instances: ['.abbv-inline-use-isi'] },
  ],
};

// Map a live source pathname into the migration-dinesh working folder.
// /find-relief            → /linzess/migration-dinesh/find-relief
// /find-relief/gutcheck   → /linzess/migration-dinesh/find-relief/gutcheck
function mapPath(pathname) {
  const clean = pathname.replace(/\/$/, '').replace(/\.html$/, '');
  return `/linzess/migration-dinesh${clean}`;
}

// Append key/value rows to the page Metadata block (created by
// WebImporter.rules.createMetadata). Used to add `brand`, `footer`, etc. so
// the EDS brand CSS cascade and shared fragments load. If no metadata block
// exists yet, create one.
function addPageMetadata(document, main, entries) {
  let table = [...main.querySelectorAll('table')].find((t) => {
    const first = t.querySelector('th, td');
    return first && first.textContent.trim().toLowerCase() === 'metadata';
  });
  if (!table) {
    table = WebImporter.DOMUtils.createTable([['Metadata']], document);
    main.appendChild(table);
  }
  const tbody = table.querySelector('tbody') || table;
  Object.entries(entries).forEach(([key, value]) => {
    const tr = document.createElement('tr');
    const keyTd = document.createElement('td');
    keyTd.textContent = key;
    const valTd = document.createElement('td');
    valTd.textContent = value;
    tr.append(keyTd, valTd);
    tbody.appendChild(tr);
  });
}

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

function findBlocksOnPage(document, template) {
  const pageBlocks = [];
  template.blocks.forEach((blockDef) => {
    blockDef.instances.forEach((selector) => {
      document.querySelectorAll(selector).forEach((element) => {
        pageBlocks.push({ name: blockDef.name, selector, element });
      });
    });
  });
  return pageBlocks;
}

export default {
  transform: (payload) => {
    const { document, url, params } = payload;
    const main = document.body;

    // 1. beforeTransform cleanup (strips chrome, scopes to content container).
    executeTransformers('beforeTransform', main, payload);

    // 2. Parse blocks. Skip elements already detached by an earlier parser.
    const pageBlocks = findBlocksOnPage(document, PAGE_TEMPLATE);
    pageBlocks.forEach((block) => {
      if (!block.element.parentNode) return;
      const parser = parsers[block.name];
      if (parser) {
        try {
          parser(block.element, { document, url, params });
        } catch (e) {
          console.error(`Failed to parse ${block.name} (${block.selector}):`, e);
        }
      }
    });

    // 3. afterTransform (image DAM rewrite + section breaks/metadata).
    executeTransformers('afterTransform', main, payload);

    // 4. Built-in rules: metadata, background images, image URL adjustment.
    const hr = document.createElement('hr');
    main.appendChild(hr);
    WebImporter.rules.createMetadata(main, document);
    WebImporter.rules.transformBackgroundImages(main, document);
    WebImporter.rules.adjustImageUrls(main, url, params.originalURL);

    // 4a. adjustImageUrls re-absolutizes our project DAM paths against the
    // SOURCE host (https://www.linzess.com/content/dam/abbvie-eds-poc/...).
    // Strip that prefix so the project DAM assets stay relative and resolve
    // against the EDS host instead.
    main.querySelectorAll('img[src], source[srcset]').forEach((el) => {
      ['src', 'srcset'].forEach((attr) => {
        const v = el.getAttribute(attr);
        if (v && v.includes('/content/dam/abbvie-eds-poc/')) {
          el.setAttribute(attr, v.replace(/https?:\/\/www\.linzess\.com(\/content\/dam\/abbvie-eds-poc\/)/g, '$1'));
        }
      });
    });

    // 4a. Inject brand/nav/footer page metadata so the linzess CSS cascade,
    // fonts, and shared header/footer fragments load on EDS. Without `brand`
    // the page renders unstyled (default theme). Append rows to the metadata
    // block created by createMetadata (its first row header is "Metadata").
    addPageMetadata(document, main, {
      brand: 'linzess',
      nav: '/linzess/nav',
      footer: '/linzess/footer',
    });

    const path = mapPath(new URL(params.originalURL).pathname);

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
