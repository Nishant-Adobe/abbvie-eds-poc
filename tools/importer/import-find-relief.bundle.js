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

  // tools/importer/import-find-relief.js
  var import_find_relief_exports = {};
  __export(import_find_relief_exports, {
    default: () => import_find_relief_default
  });

  // tools/importer/parsers/hero.js
  function parse(element, { document }) {
    var _a;
    const picture = element.querySelector("picture");
    let desktopSrc = "";
    let mobileSrc = "";
    if (picture) {
      const sources = [...picture.querySelectorAll("source")];
      const desktop = sources.find((s) => /min-width:\s*985px/.test(s.media)) || sources[0];
      const mobile = sources.find((s) => /max-width:\s*600px/.test(s.media)) || sources.find((s) => /max-width:\s*984px/.test(s.media));
      desktopSrc = desktop && desktop.getAttribute("srcset") || ((_a = picture.querySelector("img")) == null ? void 0 : _a.getAttribute("src")) || "";
      mobileSrc = mobile && mobile.getAttribute("srcset") || "";
    }
    const makePicture2 = (src) => {
      if (!src) return "";
      const p = document.createElement("picture");
      const img = document.createElement("img");
      img.setAttribute("src", src);
      p.append(img);
      return p;
    };
    const eyebrow = element.querySelector('.abbv-eyebrow, [class*="eyebrow"]');
    const eyebrowText = eyebrow ? eyebrow.textContent.trim() : "";
    const h1 = element.querySelector("h1");
    const textCell = document.createElement("div");
    if (h1) textCell.append(h1.cloneNode(true));
    const cells = [
      ["Hero (no-padding, text-left, linzess-behind-nav-linzess-editorial-hero)"],
      [makePicture2(desktopSrc)],
      [makePicture2(mobileSrc)],
      [eyebrowText],
      [""],
      [textCell],
      [""],
      [""],
      [""]
    ];
    const table = WebImporter.DOMUtils.createTable(cells, document);
    element.replaceWith(table);
  }

  // tools/importer/parsers/section-nav.js
  function parse2(element, { document }) {
    const links = [...element.querySelectorAll('.section-navigation-list a, a[href^="#"]')];
    const rows = [["Section Nav (sticky, mobile-menu)"], [""]];
    links.forEach((a) => {
      const label = a.textContent.replace(/\s+/g, " ").trim();
      const href = a.getAttribute("href") || "";
      const linkEl = document.createElement("a");
      linkEl.setAttribute("href", href);
      linkEl.textContent = href;
      rows.push([label, linkEl]);
    });
    const table = WebImporter.DOMUtils.createTable(rows, document);
    element.replaceWith(table);
  }

  // tools/importer/parsers/embed.js
  function posterFromPlayer(element) {
    const poster = element.querySelector(".vjs-poster");
    if (poster) {
      const bg = poster.style.backgroundImage || "";
      const m = bg.match(/url\(["']?([^"')]+)["']?\)/);
      if (m) return m[1];
      const dataPoster = poster.getAttribute("data-poster");
      if (dataPoster) return dataPoster;
    }
    const video = element.querySelector("video, video-js, [poster]");
    if (video && video.getAttribute("poster")) return video.getAttribute("poster");
    return "";
  }
  function parse3(element, { document }) {
    const poster = posterFromPlayer(element);
    const name = element.getAttribute("data-videoname") ? element.getAttribute("data-videoname").replace(/^Watch:\s*/i, "").trim() : "";
    const cell = document.createElement("div");
    if (poster) {
      const picture = document.createElement("picture");
      const img = document.createElement("img");
      img.setAttribute("src", poster);
      if (name) img.setAttribute("alt", name);
      picture.append(img);
      cell.append(picture);
    }
    const cells = [
      ["Embed"],
      [cell]
    ];
    const table = WebImporter.DOMUtils.createTable(cells, document);
    element.replaceWith(table);
  }

  // tools/importer/parsers/cards-grid.js
  function parse4(element, { document }) {
    const cards = [...element.querySelectorAll(".abbv-flex-item-v2")];
    const rows = [["Cards Grid (icon-image-card)"]];
    cards.forEach((card) => {
      const content = card.querySelector(".abbv-image-text-content-container-v2") || card.querySelector(".abbv-stretched-card-body") || card;
      const paragraphs = [...content.querySelectorAll("p")];
      const img = card.querySelector("img");
      const cta = card.querySelector(".cta a, a.abbv-button-primary, a.abbv-button-tertiary, a");
      const titleP = paragraphs[0];
      const bodyParas = paragraphs.slice(1);
      const linkHref = cta ? cta.getAttribute("href") : "";
      const linkCell = document.createElement("div");
      if (linkHref) {
        if (/^(https?:|tel:|sms:|\/)/.test(linkHref)) {
          const a = document.createElement("a");
          a.setAttribute("href", linkHref);
          a.textContent = linkHref;
          linkCell.append(a);
        } else {
          linkCell.textContent = linkHref;
        }
      }
      const imageCell = document.createElement("div");
      if (img) {
        const picture = document.createElement("picture");
        const newImg = document.createElement("img");
        newImg.setAttribute("src", img.getAttribute("src"));
        if (img.getAttribute("alt")) newImg.setAttribute("alt", img.getAttribute("alt"));
        picture.append(newImg);
        imageCell.append(picture);
      }
      const titleCell = document.createElement("div");
      if (titleP) titleCell.textContent = titleP.textContent.trim();
      const bodyCell = document.createElement("div");
      bodyParas.forEach((p) => bodyCell.append(p.cloneNode(true)));
      const ctaCell = document.createElement("div");
      if (cta) ctaCell.textContent = cta.textContent.replace(/\s+/g, " ").trim();
      rows.push([linkCell, imageCell, titleCell, bodyCell, ctaCell, ""]);
    });
    const table = WebImporter.DOMUtils.createTable(rows, document);
    element.replaceWith(table);
  }

  // tools/importer/parsers/columns.js
  function buildCell(document, sourceCol) {
    const cell = document.createElement("div");
    const img = sourceCol.querySelector("img");
    const heading = sourceCol.querySelector("h1, h2, h3, h4");
    if (img && !heading) {
      const picture = document.createElement("picture");
      const newImg = document.createElement("img");
      newImg.setAttribute("src", img.getAttribute("src"));
      if (img.getAttribute("alt")) newImg.setAttribute("alt", img.getAttribute("alt"));
      if (img.getAttribute("width")) newImg.setAttribute("width", img.getAttribute("width"));
      if (img.getAttribute("height")) newImg.setAttribute("height", img.getAttribute("height"));
      picture.append(newImg);
      cell.append(picture);
      sourceCol.querySelectorAll("p, em, i").forEach((p) => {
        const t = p.textContent.trim();
        if (t) cell.append(p.cloneNode(true));
      });
      return cell;
    }
    [...sourceCol.querySelectorAll("h1, h2, h3, h4, p, a")].forEach((node) => {
      if (node.tagName === "A" && node.closest("p")) return;
      cell.append(node.cloneNode(true));
    });
    if (!cell.childNodes.length) {
      [...sourceCol.childNodes].forEach((n) => cell.append(n.cloneNode(true)));
    }
    return cell;
  }
  function parse5(element, { document }) {
    let columns = [...element.querySelectorAll(":scope > .abbv-row > .abbv-col")];
    if (!columns.length) columns = [...element.querySelectorAll(".abbv-col")];
    if (!columns.length) columns = [...element.querySelectorAll(".abbv-flex-item-v2")];
    if (!columns.length) return;
    const contentRow = columns.map((col) => buildCell(document, col));
    const emptyRow = columns.map(() => "");
    const cells = [
      ["Columns"],
      emptyRow,
      contentRow
    ];
    const table = WebImporter.DOMUtils.createTable(cells, document);
    element.replaceWith(table);
  }

  // tools/importer/parsers/tabs.js
  function makePicture(document, img) {
    const cell = document.createElement("div");
    if (img) {
      const picture = document.createElement("picture");
      const newImg = document.createElement("img");
      newImg.setAttribute("src", img.getAttribute("src"));
      if (img.getAttribute("alt")) newImg.setAttribute("alt", img.getAttribute("alt"));
      picture.append(newImg);
      cell.append(picture);
    }
    return cell;
  }
  function panelHeading(document, panel) {
    const prev = panel.previousElementSibling;
    const heading = document.createElement("p");
    const text = prev && /take linzess/i.test(prev.textContent) ? prev.textContent.replace(/\s+/g, " ").trim() : "Take LINZESS";
    heading.textContent = text;
    return heading;
  }
  function flexboxTable(document, panel) {
    const steps = [...panel.querySelectorAll(".abbv-flex-item-v2")];
    const rows = [["Flexbox (column)"], [""]];
    steps.forEach((step) => {
      const img = step.querySelector("img");
      const contentSrc = step.querySelector(".abbv-image-text-content-container-v2, .abbv-stretched-card-body") || step;
      const content = document.createElement("div");
      [...contentSrc.querySelectorAll("p")].forEach((p) => content.append(p.cloneNode(true)));
      rows.push(["", makePicture(document, img), content, ""]);
    });
    return WebImporter.DOMUtils.createTable(rows, document);
  }
  function parse6(element, { document }) {
    const labels = [...new Set(
      [...element.querySelectorAll(".abbv-tab-text")].map((e) => e.textContent.replace(/\s+/g, " ").trim())
    )].filter(Boolean);
    const panels = [...element.querySelectorAll(".abbv-flex-container-v2.flexbox-column")];
    const frag = document.createDocumentFragment();
    const offWhiteMeta = (sectionId) => {
      const rows = sectionId ? [["Section Metadata (find-relief-off-white)"], ["sectionId", sectionId]] : [["Section Metadata (find-relief-off-white)"]];
      return WebImporter.DOMUtils.createTable(rows, document);
    };
    frag.append(offWhiteMeta("howtotake"));
    frag.append(document.createElement("hr"));
    const tabRows = [["Tabs"]];
    labels.forEach((label) => tabRows.push([label]));
    frag.append(WebImporter.DOMUtils.createTable(tabRows, document));
    frag.append(offWhiteMeta(null));
    panels.forEach((panel, i) => {
      frag.append(document.createElement("hr"));
      frag.append(panelHeading(document, panel));
      frag.append(flexboxTable(document, panel));
      const metaRows = [["Section Metadata"], ["tab-name", labels[i] || ""]];
      frag.append(WebImporter.DOMUtils.createTable(metaRows, document));
    });
    frag.append(document.createElement("hr"));
    frag.append(offWhiteMeta(null));
    element.replaceWith(frag);
  }

  // tools/importer/parsers/text-container.js
  function parse7(element, { document }) {
    const content = document.createElement("div");
    const inner = document.createElement("div");
    const parts = [
      element.querySelector(".abbv-inline-use"),
      element.querySelector(".abbv-inline-safety"),
      element.querySelector(".abbv-inline-miscisi")
    ].filter(Boolean);
    if (parts.length) {
      parts.forEach((part) => {
        [...part.childNodes].forEach((node) => inner.append(node.cloneNode(true)));
      });
    } else {
      [...element.childNodes].forEach((node) => inner.append(node.cloneNode(true)));
    }
    content.append(inner);
    const cells = [
      ["Text Container"],
      ["id:linzess-find-relief-isi"],
      ["-"],
      ["lang:none"],
      [""],
      [content]
    ];
    const table = WebImporter.DOMUtils.createTable(cells, document);
    element.replaceWith(table);
  }

  // tools/importer/transformers/linzess-cleanup.js
  function transform(hookName, element, payload) {
    if (hookName !== "beforeTransform") return;
    const { document } = payload;
    const cc = element.querySelector(".abbv-content-container");
    if (cc) {
      [...cc.children].forEach((child) => {
        const keep = child.tagName === "SECTION" || child.classList.contains("abbv-inline-use-isi") || child.querySelector(".abbv-inline-use-isi, .hero-container, .abbv-image-text-v2");
        if (!keep) child.remove();
      });
      cc.querySelectorAll(
        ".abbv-dimmer, .abbv-back-to-top, .abbv-save-bar, .abbv-savings-bar, .abbv-modal, .linzess-modal-bkg, .vjs-control-bar, .vjs-menu, .vjs-modal-dialog, .vjs-text-track-display, .vjs-loading-spinner, .vjs-big-play-button, .vjs-dock-shelf, video, .grecaptcha-badge"
      ).forEach((el) => el.remove());
    }
    element.querySelectorAll(
      '.checkboxCampaignQuestionPanel, [class*="CampaignQuestionPanel"], .cmp-adaptiveform-textinput, .cmp-adaptiveform-numberinput, .cmp-adaptiveform-emailinput, .cmp-adaptiveform-telephoneinput, .cmp-adaptiveform-recaptcha, .cmp-adaptiveform-button'
    ).forEach((el) => {
      const txt = (el.textContent || "").trim();
      const isVisibleEmail = /Email Address/i.test(txt) && !/Campaign|Question Id|SourceId|opt in|opt-in/i.test(txt);
      if (!isVisibleEmail) el.remove();
    });
    element.querySelectorAll(".cmp-adaptiveform-text").forEach((el) => {
      if (/Analytics|MVA|Campaign|Form Name:|Form Category:|appropriate value/i.test(el.textContent || "")) {
        el.remove();
      }
    });
    element.querySelectorAll(
      'header, footer, nav, noscript, script, style, iframe, svg, .abbv-header, .abbv-footer, .abbv-utility-nav, .abbv-save-bar, .abbv-modal, .linzess-modal-bkg, #onetrust-consent-sdk, [id^="ot-"], [aria-label="Cookie banner"], .onetrust-pc-dark-filter, .abbv-floating-isi, .abbv-floating-isi-v2, .abbv-safety-bar, .abbv-skip-link, .abbv-skip-to-main-content'
    ).forEach((el) => el.remove());
  }

  // tools/importer/transformers/linzess-images.js
  var LIVE_DAM = "/content/dam/linzess/";
  var PROJECT_DAM = "/content/dam/abbvie-eds-poc/linzess/";
  var BRIGHTCOVE_HOST = /https?:\/\/cf-images\.[^/]+\/v1\/static\//;
  var PROJECT_BRIGHTCOVE = "/content/dam/abbvie-eds-poc/v1/static/";
  function rewrite(value) {
    if (!value) return value;
    let out = value;
    out = out.replace(BRIGHTCOVE_HOST, PROJECT_BRIGHTCOVE);
    out = out.replace(/https?:\/\/www\.linzess\.com/g, "");
    out = out.replace(LIVE_DAM, PROJECT_DAM);
    return out;
  }
  function transform2(hookName, element, payload) {
    if (hookName !== "afterTransform") return;
    element.querySelectorAll("img").forEach((img) => {
      const src = img.getAttribute("src");
      if (src) img.setAttribute("src", rewrite(src));
      const srcset = img.getAttribute("srcset");
      if (srcset) img.setAttribute("srcset", rewrite(srcset));
    });
    element.querySelectorAll("a[href]").forEach((a) => {
      const href = a.getAttribute("href");
      if (href && href.includes("/content/dam/linzess/")) {
        a.setAttribute("href", rewrite(href));
      }
    });
  }

  // tools/importer/transformers/linzess-sections.js
  function metadataTable(document, style, sectionId) {
    const header = style ? `Section Metadata (${style})` : "Section Metadata";
    const rows = [[header]];
    if (sectionId) rows.push(["sectionId", sectionId]);
    return WebImporter.DOMUtils.createTable(rows, document);
  }
  function transform3(hookName, element, payload) {
    if (hookName !== "afterTransform") return;
    const { document, url, params } = payload;
    const pathname = (() => {
      try {
        return new URL(params.originalURL || url).pathname;
      } catch (e) {
        return "";
      }
    })();
    const isGutcheck = /\/find-relief\/gutcheck\/?$/.test(pathname);
    if (isGutcheck) {
      const isi = element.querySelector(".abbv-inline-use-isi");
      if (isi) {
        isi.before(document.createElement("hr"));
        isi.append(metadataTable(document, "find-relief-isi", null));
      }
      return;
    }
    const sectionDefs = [
      { selector: ".abbv-section-navigation", style: null, id: null, breakOnly: true },
      { selector: ".abbv-container.background-white.background-white-arc", style: "find-relief-checklist", id: "talktoadoctor" },
      { selector: ".abbv-container.background-dark-purple", style: "find-relief-dark-purple", id: null },
      { selector: ".abbv-inline-use-isi", style: "find-relief-isi", id: null }
    ];
    sectionDefs.forEach((def) => {
      const sec = element.querySelector(def.selector);
      if (!sec) return;
      sec.before(document.createElement("hr"));
      if (!def.breakOnly) sec.append(metadataTable(document, def.style, def.id));
    });
    const offWhite = element.querySelector(".abbv-container.background-off-white.background-off-white-arc");
    if (offWhite) {
      offWhite.before(document.createElement("hr"));
    }
  }

  // tools/importer/import-find-relief.js
  var parsers = {
    hero: parse,
    "section-nav": parse2,
    embed: parse3,
    "cards-grid": parse4,
    columns: parse5,
    tabs: parse6,
    "text-container": parse7
  };
  var transformers = [
    transform,
    transform2,
    transform3
  ];
  var PAGE_TEMPLATE = {
    name: "find-relief",
    description: "LINZESS Find Relief content page and Gut Check (static).",
    urls: [
      "https://www.linzess.com/find-relief",
      "https://www.linzess.com/find-relief/gutcheck"
    ],
    blocks: [
      { name: "hero", instances: [".hero-container.abbv-image-text-v2"] },
      { name: "section-nav", instances: [".abbv-section-navigation"] },
      { name: "embed", instances: [".abbv-video-player"] },
      { name: "cards-grid", instances: [".abbv-flex-container-v2.flexbox-cards:not(.flexbox-video-cards)"] },
      { name: "tabs", instances: [".abbv-container.background-white.rounded-corners"] },
      {
        name: "columns",
        instances: [
          ".abbv-row-container.image-text-wrapper",
          ".abbv-flex-container-v2.flexbox-column-mobile:not(.flexbox-cards):not(.flexbox-video-cards)"
        ]
      },
      { name: "text-container", instances: [".abbv-inline-use-isi"] }
    ]
  };
  function mapPath(pathname) {
    const clean = pathname.replace(/\/$/, "").replace(/\.html$/, "");
    return `/linzess/migration-dinesh${clean}`;
  }
  function addPageMetadata(document, main, entries) {
    let table = [...main.querySelectorAll("table")].find((t) => {
      const first = t.querySelector("th, td");
      return first && first.textContent.trim().toLowerCase() === "metadata";
    });
    if (!table) {
      table = WebImporter.DOMUtils.createTable([["Metadata"]], document);
      main.appendChild(table);
    }
    const tbody = table.querySelector("tbody") || table;
    Object.entries(entries).forEach(([key, value]) => {
      const tr = document.createElement("tr");
      const keyTd = document.createElement("td");
      keyTd.textContent = key;
      const valTd = document.createElement("td");
      valTd.textContent = value;
      tr.append(keyTd, valTd);
      tbody.appendChild(tr);
    });
  }
  function executeTransformers(hookName, element, payload) {
    const enhancedPayload = __spreadProps(__spreadValues({}, payload), { template: PAGE_TEMPLATE });
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
  var import_find_relief_default = {
    transform: (payload) => {
      const { document, url, params } = payload;
      const main = document.body;
      executeTransformers("beforeTransform", main, payload);
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
      executeTransformers("afterTransform", main, payload);
      const hr = document.createElement("hr");
      main.appendChild(hr);
      WebImporter.rules.createMetadata(main, document);
      WebImporter.rules.transformBackgroundImages(main, document);
      WebImporter.rules.adjustImageUrls(main, url, params.originalURL);
      main.querySelectorAll("img[src], source[srcset]").forEach((el) => {
        ["src", "srcset"].forEach((attr) => {
          const v = el.getAttribute(attr);
          if (v && v.includes("/content/dam/abbvie-eds-poc/")) {
            el.setAttribute(attr, v.replace(/https?:\/\/www\.linzess\.com(\/content\/dam\/abbvie-eds-poc\/)/g, "$1"));
          }
        });
      });
      addPageMetadata(document, main, {
        brand: "linzess",
        nav: "/linzess/nav",
        footer: "/linzess/footer"
      });
      const path = mapPath(new URL(params.originalURL).pathname);
      return [{
        element: main,
        path,
        report: {
          title: document.title,
          template: PAGE_TEMPLATE.name,
          blocks: pageBlocks.map((b) => b.name)
        }
      }];
    }
  };
  return __toCommonJS(import_find_relief_exports);
})();
