/* eslint-disable */
/* global WebImporter */

import heroParser from './parsers/hero.js';
import ctaParser from './parsers/cta.js';
import columnsParser from './parsers/columns.js';
import cardsGridParser from './parsers/cards-grid.js';
import carouselVideoPlaylistParser from './parsers/carousel-video-playlist.js';
import fragmentParser from './parsers/fragment.js';

import cleanupTransformer from './transformers/cleanup.js';
import sectionsTransformer from './transformers/sections.js';

const parsers = {
  'hero': heroParser,
  'cta': ctaParser,
  'columns': columnsParser,
  'cards-grid': cardsGridParser,
  'carousel-video-playlist': carouselVideoPlaylistParser,
  'fragment': fragmentParser,
};

const transformers = [
  cleanupTransformer,
  sectionsTransformer,
];

const PAGE_TEMPLATE = {
  name: 'linzess-homepage',
  description: 'Linzess DTC homepage with hero, content cards, statistics, video carousel, savings promo, and safety-bar fragment',
  urls: [
    'https://www.linzess.com/'
  ],
  blocks: [
    {
      name: 'hero',
      instances: ['.hero-container.abbv-image-text-v2']
    },
    {
      name: 'cta',
      instances: ['.eligible-tout']
    },
    {
      name: 'columns',
      instances: ['.flexbox-cards .abbv-flex-item-v2.icon-image-card', '.savings-card-section']
    },
    {
      name: 'cards-grid',
      instances: ['.abbv-flex-container-v2.c-dark-purple.margin-top-80']
    },
    {
      name: 'carousel-video-playlist',
      instances: ['.abbv-flex-container-v2.flexbox-video-cards']
    },
    {
      name: 'fragment',
      instances: ['.abbv-safety-bar']
    }
  ],
  sections: [
    {
      id: 'hero',
      name: 'Hero',
      selector: '.hero-container.abbv-image-text-v2',
      style: null,
      blocks: ['hero'],
      defaultContent: []
    },
    {
      id: 'savings-promo-cards',
      name: 'Savings Promo and Cards',
      selector: '.eligible-tout',
      style: null,
      blocks: ['cta', 'columns'],
      defaultContent: ['.gut-check-static']
    },
    {
      id: 'statistics-and-videos',
      name: 'Statistics and Videos',
      selector: '.background-dark-purple.statistics-section',
      style: 'dark',
      blocks: ['cards-grid', 'carousel-video-playlist'],
      defaultContent: ['.statistics-section > p', '.statistics-section > h2']
    },
    {
      id: 'savings-card',
      name: 'Savings Card',
      selector: '.savings-card-section',
      style: null,
      blocks: ['columns'],
      defaultContent: ['.savings-card-section > p']
    },
    {
      id: 'safety-bar',
      name: 'Safety Bar',
      selector: '.safety-bar-fragment',
      style: null,
      blocks: ['fragment'],
      defaultContent: []
    }
  ]
};

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

function findBlocksOnPage(document, template) {
  const pageBlocks = [];

  template.blocks.forEach((blockDef) => {
    blockDef.instances.forEach((selector) => {
      const elements = document.querySelectorAll(selector);
      elements.forEach((element) => {
        pageBlocks.push({
          name: blockDef.name,
          selector,
          element,
          section: blockDef.section || null
        });
      });
    });
  });

  return pageBlocks;
}

export default {
  transform: (payload) => {
    const { document, url, params } = payload;

    const main = document.body;

    executeTransformers('beforeTransform', main, payload);

    const pageBlocks = findBlocksOnPage(document, PAGE_TEMPLATE);

    pageBlocks.forEach((block) => {
      const parser = parsers[block.name];
      if (parser) {
        try {
          parser(block.element, { document, url, params });
        } catch (e) {
          console.error(`Failed to parse ${block.name} (${block.selector}):`, e);
        }
      }
    });

    executeTransformers('afterTransform', main, payload);

    const hr = document.createElement('hr');
    main.appendChild(hr);
    WebImporter.rules.createMetadata(main, document);
    WebImporter.rules.transformBackgroundImages(main, document);
    WebImporter.rules.adjustImageUrls(main, url, params.originalURL);

    const path = WebImporter.FileUtils.sanitizePath(
      new URL(params.originalURL).pathname.replace(/\/$/, '').replace(/\.html$/, '')
    );

    return [{
      element: main,
      path: path || '/linzess/index',
      report: {
        title: document.title,
        template: PAGE_TEMPLATE.name,
        blocks: pageBlocks.map((b) => b.name),
      }
    }];
  }
};
