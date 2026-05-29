/* eslint-disable */
var CustomImportScript = (() => {
  var __defProp = Object.defineProperty;
  var __defProps = Object.defineProperties;
  var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
  var __getOwnPropDescs = Object.getOwnPropertyDescriptors;
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __getOwnPropSymbols = Object.getOwnPropertySymbols;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
  var __propIsEnum = Object.prototype.propertyIsEnumerable;
  var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
  var __spreadValues = (a, b) => {
    for (var prop in b || (b = {}))
      if (__hasOwnProp.call(b, prop))
        __defNormalProp(a, prop, b[prop]);
    if (__getOwnPropSymbols)
      for (var prop of __getOwnPropSymbols(b)) {
        if (__propIsEnum.call(b, prop))
          __defNormalProp(a, prop, b[prop]);
      }
    return a;
  };
  var __spreadProps = (a, b) => __defProps(a, __getOwnPropDescs(b));
  var __export = (target, all) => {
    for (var name in all)
      __defProp(target, name, { get: all[name], enumerable: true });
  };
  var __copyProps = (to, from, except, desc) => {
    if (from && typeof from === "object" || typeof from === "function") {
      for (let key of __getOwnPropNames(from))
        if (!__hasOwnProp.call(to, key) && key !== except)
          __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
    }
    return to;
  };
  var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

  // tools/importer/import-linzess-homepage.js
  var import_linzess_homepage_exports = {};
  __export(import_linzess_homepage_exports, {
    default: () => import_linzess_homepage_default
  });

  // tools/importer/parsers/hero.js
  function parse(element, { document }) {
    const picture = element.querySelector("picture") || element.querySelector("img");
    const h1 = element.querySelector("h1");
    const eyebrowEl = element.querySelector("p.tl-m, .abbv-image-text-content-v2 p:first-of-type");
    const ctaLink = element.querySelector("a[href]");
    const textDiv = document.createElement("div");
    if (eyebrowEl) textDiv.appendChild(eyebrowEl.cloneNode(true));
    if (h1) textDiv.appendChild(h1.cloneNode(true));
    const bodyP = h1 ? h1.nextElementSibling : null;
    if (bodyP && bodyP.tagName === "P") textDiv.appendChild(bodyP.cloneNode(true));
    if (ctaLink) {
      const p = document.createElement("p");
      p.appendChild(ctaLink.cloneNode(true));
      textDiv.appendChild(p);
    }
    const cells = [
      ["Hero"],
      [picture ? picture.cloneNode(true) : ""],
      [textDiv]
    ];
    const table = WebImporter.DOMUtils.createTable(cells, document);
    element.replaceWith(table);
  }

  // tools/importer/parsers/cta.js
  function parse2(element, { document }) {
    const heading = element.querySelector(".heading-2, h2, h3, p.heading-2");
    const ctaLink = element.querySelector("a[href]");
    const cells = [
      ["CTA"],
      [heading ? heading.textContent.trim() : ""],
      [ctaLink ? ctaLink.cloneNode(true) : ""]
    ];
    const table = WebImporter.DOMUtils.createTable(cells, document);
    element.replaceWith(table);
  }

  // tools/importer/parsers/columns.js
  function parse3(element, { document }) {
    const items = element.querySelectorAll(".abbv-flex-item-v2, .abbv-col");
    const cells = [["Columns"]];
    if (items.length > 0) {
      const row = [];
      items.forEach((item) => {
        const col = document.createElement("div");
        const img = item.querySelector("picture") || item.querySelector("img");
        const headingEl = item.querySelector(".heading-2, h2, h3");
        const headingText = headingEl ? headingEl.textContent.trim() : item.querySelector("p strong") ? item.querySelector("p strong").textContent.trim() : "";
        const bodyPs = item.querySelectorAll("p:not(.heading-2)");
        const cta = item.querySelector("a[href]");
        if (img) col.appendChild(img.cloneNode(true));
        if (headingText) {
          const p = document.createElement("p");
          const strong = document.createElement("strong");
          strong.textContent = headingText;
          p.appendChild(strong);
          col.appendChild(p);
        }
        bodyPs.forEach((bp) => {
          if (!bp.querySelector("strong") || bp.querySelector("strong").textContent.trim() !== headingText) {
            col.appendChild(bp.cloneNode(true));
          }
        });
        if (cta) {
          const p = document.createElement("p");
          p.appendChild(cta.cloneNode(true));
          col.appendChild(p);
        }
        row.push(col);
      });
      cells.push(row);
    } else {
      const img = element.querySelector("picture") || element.querySelector("img");
      const textContent = document.createElement("div");
      const allPs = element.querySelectorAll("p");
      const cta = element.querySelector("a[href]");
      allPs.forEach((p) => textContent.appendChild(p.cloneNode(true)));
      if (cta && !textContent.querySelector("a")) {
        const p = document.createElement("p");
        p.appendChild(cta.cloneNode(true));
        textContent.appendChild(p);
      }
      const row = [];
      if (img) row.push(img.cloneNode(true));
      row.push(textContent);
      cells.push(row);
    }
    const table = WebImporter.DOMUtils.createTable(cells, document);
    element.replaceWith(table);
  }

  // tools/importer/parsers/cards-grid.js
  function parse4(element, { document }) {
    const cards = Array.from(element.querySelectorAll(".abbv-flex-item-v2")).filter((c) => c.querySelector(".font-size-xl"));
    const cells = [["Cards Grid"]];
    cards.forEach((card) => {
      const statEl = card.querySelector(".font-size-xl");
      const statParent = statEl ? statEl.closest("p") || statEl.parentElement : null;
      const allPs = card.querySelectorAll("p");
      const descP = allPs.length > 1 ? allPs[allPs.length - 1] : null;
      const content = document.createElement("div");
      if (statParent) {
        const p = document.createElement("p");
        const strong = document.createElement("strong");
        strong.textContent = statParent.textContent.trim();
        p.appendChild(strong);
        content.appendChild(p);
      }
      if (descP && descP !== statParent) {
        content.appendChild(descP.cloneNode(true));
      }
      cells.push([content]);
    });
    const table = WebImporter.DOMUtils.createTable(cells, document);
    element.replaceWith(table);
  }

  // tools/importer/parsers/carousel-video-playlist.js
  function parse5(element, { document }) {
    const videoPlayers = element.querySelectorAll("[data-video-id]");
    const firstVideo = videoPlayers[0];
    const account = firstVideo ? firstVideo.getAttribute("data-account") || "1029485116001" : "1029485116001";
    const player = firstVideo ? firstVideo.getAttribute("data-player") || "Mcp9TXMkPT" : "Mcp9TXMkPT";
    const cells = [["Carousel Video Playlist"]];
    cells.push([""]);
    cells.push([""]);
    cells.push(["0"]);
    cells.push([account]);
    cells.push([""]);
    cells.push([player]);
    cells.push([""]);
    cells.push([""]);
    videoPlayers.forEach((vp) => {
      const videoId = vp.getAttribute("data-video-id") || "";
      if (!videoId) return;
      const card = vp.closest(".abbv-flex-item-v2") || vp.closest(".flexboxitem-v2") || vp.parentElement;
      const titleEl = card ? card.querySelector("h3, .vjs-dock-title") : null;
      const title = titleEl ? titleEl.textContent.trim() : "";
      const transcriptLink = card ? card.querySelector('a[href*="transcript"]') : null;
      const transcript = transcriptLink ? transcriptLink.getAttribute("href") || "" : "";
      cells.push([videoId, title, transcript, "", "", "", ""]);
    });
    const table = WebImporter.DOMUtils.createTable(cells, document);
    element.replaceWith(table);
  }

  // tools/importer/parsers/fragment.js
  function parse6(element, { document }) {
    const link = document.createElement("a");
    link.href = "/linzess/fragments/safety-bar";
    link.textContent = "/linzess/fragments/safety-bar";
    const cells = [
      ["Fragment"],
      [link]
    ];
    const table = WebImporter.DOMUtils.createTable(cells, document);
    element.replaceWith(table);
  }

  // tools/importer/transformers/cleanup.js
  function transform(hookName, element, payload) {
    if (hookName === "beforeTransform") {
      const { document } = payload;
      const selectorsToRemove = [
        "script",
        "style",
        "noscript",
        "iframe",
        "[data-digitaldata]",
        ".abbv-dimmer",
        ".abbv-modal",
        ".onetrust-pc-dark-filter",
        ".otPcCenter",
        "#onetrust-consent-sdk",
        '[class*="onetrust"]',
        ".abbv-skip-to-main-content",
        "[data-stick-anchor-pos]"
      ];
      selectorsToRemove.forEach((selector) => {
        document.querySelectorAll(selector).forEach((el) => el.remove());
      });
      document.querySelectorAll("*").forEach((el) => {
        const attrs = [...el.attributes];
        attrs.forEach((attr) => {
          if (attr.name.startsWith("data-") && !["data-video-id", "data-account", "data-player"].includes(attr.name)) {
            el.removeAttribute(attr.name);
          }
        });
      });
    }
  }

  // tools/importer/transformers/sections.js
  function transform2(hookName, element, payload) {
    if (hookName === "afterTransform") {
      const { document } = payload;
      document.querySelectorAll(".background-dark-purple, .abbv-container.background-dark-purple").forEach((el) => {
        el.setAttribute("data-section-style", "dark");
      });
    }
  }

  // tools/importer/import-linzess-homepage.js
  var parsers = {
    "hero": parse,
    "cta": parse2,
    "columns": parse3,
    "cards-grid": parse4,
    "carousel-video-playlist": parse5,
    "fragment": parse6
  };
  var transformers = [
    transform,
    transform2
  ];
  var PAGE_TEMPLATE = {
    name: "linzess-homepage",
    description: "Linzess DTC homepage with hero, content cards, statistics, video carousel, savings promo, and safety-bar fragment",
    urls: [
      "https://www.linzess.com/"
    ],
    blocks: [
      {
        name: "hero",
        instances: [".hero-container.abbv-image-text-v2"]
      },
      {
        name: "cta",
        instances: [".eligible-tout"]
      },
      {
        name: "columns",
        instances: [".flexbox-cards .abbv-flex-item-v2.icon-image-card", ".savings-card-section"]
      },
      {
        name: "cards-grid",
        instances: [".abbv-flex-container-v2.c-dark-purple.margin-top-80"]
      },
      {
        name: "carousel-video-playlist",
        instances: [".abbv-flex-container-v2.flexbox-video-cards"]
      },
      {
        name: "fragment",
        instances: [".abbv-safety-bar"]
      }
    ],
    sections: [
      {
        id: "hero",
        name: "Hero",
        selector: ".hero-container.abbv-image-text-v2",
        style: null,
        blocks: ["hero"],
        defaultContent: []
      },
      {
        id: "savings-promo-cards",
        name: "Savings Promo and Cards",
        selector: ".eligible-tout",
        style: null,
        blocks: ["cta", "columns"],
        defaultContent: [".gut-check-static"]
      },
      {
        id: "statistics-and-videos",
        name: "Statistics and Videos",
        selector: ".background-dark-purple.statistics-section",
        style: "dark",
        blocks: ["cards-grid", "carousel-video-playlist"],
        defaultContent: [".statistics-section > p", ".statistics-section > h2"]
      },
      {
        id: "savings-card",
        name: "Savings Card",
        selector: ".savings-card-section",
        style: null,
        blocks: ["columns"],
        defaultContent: [".savings-card-section > p"]
      },
      {
        id: "safety-bar",
        name: "Safety Bar",
        selector: ".safety-bar-fragment",
        style: null,
        blocks: ["fragment"],
        defaultContent: []
      }
    ]
  };
  function executeTransformers(hookName, element, payload) {
    const enhancedPayload = __spreadProps(__spreadValues({}, payload), {
      template: PAGE_TEMPLATE
    });
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
  var import_linzess_homepage_default = {
    transform: (payload) => {
      const { document, url, params } = payload;
      const main = document.body;
      executeTransformers("beforeTransform", main, payload);
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
      executeTransformers("afterTransform", main, payload);
      const hr = document.createElement("hr");
      main.appendChild(hr);
      WebImporter.rules.createMetadata(main, document);
      WebImporter.rules.transformBackgroundImages(main, document);
      WebImporter.rules.adjustImageUrls(main, url, params.originalURL);
      const path = WebImporter.FileUtils.sanitizePath(
        new URL(params.originalURL).pathname.replace(/\/$/, "").replace(/\.html$/, "")
      );
      return [{
        element: main,
        path: path || "/linzess/index",
        report: {
          title: document.title,
          template: PAGE_TEMPLATE.name,
          blocks: pageBlocks.map((b) => b.name)
        }
      }];
    }
  };
  return __toCommonJS(import_linzess_homepage_exports);
})();
