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

  // tools/importer/parsers/brightcove-video.js
  var VIDEO_ID_MAP = {
    "GETTING ON THE SAME PAGE": "6391879132112",
    "WHAT TO KNOW BEFORE STARTING LINZESS": "6337642986112"
  };
  var LINZESS_ACCOUNT_ID = "1029485116001";
  var DEFAULT_PLAYER_ID = "Mcp9TXMkPT";
  function parse(element, { document: document2 }) {
    var _a, _b, _c;
    const contentArea = element.querySelector(".abbv-video-content");
    const dockTitle = element.querySelector(".vjs-dock-title");
    const contentH3 = contentArea == null ? void 0 : contentArea.querySelector("h3");
    const titleEl = contentH3 && contentH3.textContent.trim() ? contentH3 : dockTitle;
    const overlayTitle = ((_a = titleEl == null ? void 0 : titleEl.textContent) == null ? void 0 : _a.trim()) || "";
    const dockDesc = element.querySelector(".vjs-dock-description");
    const contentP = contentArea == null ? void 0 : contentArea.querySelector("p");
    const descEl = contentP && contentP.textContent.trim() ? contentP : dockDesc;
    const overlayDescription = ((_b = descEl == null ? void 0 : descEl.textContent) == null ? void 0 : _b.trim()) || "";
    const posterImg = element.querySelector(".vjs-poster img");
    const posterSrc = (posterImg == null ? void 0 : posterImg.getAttribute("src")) || "";
    const videoJs = element.querySelector("video-js");
    let playerId = DEFAULT_PLAYER_ID;
    if (videoJs) {
      const classMatch = videoJs.className.match(/bc-player-([A-Za-z0-9]+)_default/);
      if (classMatch) {
        playerId = classMatch[1];
      }
    }
    const contentContainer = element.querySelector(".abbv-video-content-container");
    let videoContentLayout = "bottom";
    if (contentContainer) {
      if (contentContainer.classList.contains("content-none")) videoContentLayout = "none";
      else if (contentContainer.classList.contains("content-left")) videoContentLayout = "left";
      else if (contentContainer.classList.contains("content-right")) videoContentLayout = "right";
      else if (contentContainer.classList.contains("content-bottom")) videoContentLayout = "bottom";
    }
    const transcriptLinkEl = element.querySelector("a.transcript-link");
    const transcriptHref = (transcriptLinkEl == null ? void 0 : transcriptLinkEl.getAttribute("href")) || "";
    const transcriptLabel = ((_c = transcriptLinkEl == null ? void 0 : transcriptLinkEl.textContent) == null ? void 0 : _c.trim()) || "";
    const hasTranscript = !!transcriptHref;
    const videoId = VIDEO_ID_MAP[overlayTitle] || "";
    function hintedCell(fieldName, value) {
      if (!value && value !== "false" && value !== "0") {
        return [""];
      }
      const frag = document2.createDocumentFragment();
      frag.appendChild(document2.createComment(` field:${fieldName} `));
      const text = document2.createTextNode(value);
      frag.appendChild(text);
      return [frag];
    }
    function hintedLinkCell(fieldName, href, text) {
      if (!href) return [""];
      const frag = document2.createDocumentFragment();
      frag.appendChild(document2.createComment(` field:${fieldName} `));
      const link = document2.createElement("a");
      link.href = href;
      link.textContent = text || href;
      frag.appendChild(link);
      return [frag];
    }
    function hintedImageCell(fieldName, src, alt) {
      if (!src) return [""];
      const frag = document2.createDocumentFragment();
      frag.appendChild(document2.createComment(` field:${fieldName} `));
      const img = document2.createElement("img");
      img.src = src;
      if (alt) img.alt = alt;
      frag.appendChild(img);
      return [frag];
    }
    const cells = [
      /* Row 0:  projectNumber */
      hintedCell("projectNumber", ""),
      /* Row 1:  overlayTitle */
      hintedCell("overlayTitle", overlayTitle),
      /* Row 2:  overlayDescription */
      hintedCell("overlayDescription", overlayDescription),
      /* Row 3:  posterType */
      hintedCell("posterType", "brightcove"),
      /* Row 4:  posterImage */
      hintedImageCell("posterImage", posterSrc, overlayTitle),
      /* Row 5:  posterAlt */
      hintedCell("posterAlt", ""),
      /* Row 6:  colorOverlay */
      hintedCell("colorOverlay", ""),
      /* Row 7:  overlayButtonText */
      hintedCell("overlayButtonText", "Watch Video"),
      /* Row 8:  overlayButtonIconType */
      hintedCell("overlayButtonIconType", "icon-font"),
      /* Row 9:  overlayButtonFontIcon */
      hintedCell("overlayButtonFontIcon", "play"),
      /* Row 10: overlayButtonImageIcon */
      [""],
      /* Row 11: iconPosition */
      hintedCell("iconPosition", "left"),
      /* Row 12: playerType */
      hintedCell("playerType", "single"),
      /* Row 13: accountId */
      hintedCell("accountId", LINZESS_ACCOUNT_ID),
      /* Row 14: playerId */
      hintedCell("playerId", playerId),
      /* Row 15: videoId */
      hintedCell("videoId", videoId),
      /* Row 16: playlistId */
      hintedCell("playlistId", ""),
      /* Row 17: defaultPlaylistVideoId */
      hintedCell("defaultPlaylistVideoId", ""),
      /* Row 18: playlistType */
      hintedCell("playlistType", ""),
      /* Row 19: videoContentLayout */
      hintedCell("videoContentLayout", videoContentLayout),
      /* Row 20: playlistLayout */
      hintedCell("playlistLayout", ""),
      /* Row 21: enablePlaylistThumbnailMetadata */
      hintedCell("enablePlaylistThumbnailMetadata", "false"),
      /* Row 22: enableAutoplay */
      hintedCell("enableAutoplay", "false"),
      /* Row 23: enableLoop */
      hintedCell("enableLoop", "false"),
      /* Row 24: enableCaptions */
      hintedCell("enableCaptions", "false"),
      /* Row 25: enableVideoChapters */
      hintedCell("enableVideoChapters", "false"),
      /* Row 26: enableRecommendedVideo */
      hintedCell("enableRecommendedVideo", "false"),
      /* Row 27: enablePlayerControls */
      hintedCell("enablePlayerControls", "true"),
      /* Row 28: enableSocialShare */
      hintedCell("enableSocialShare", "false"),
      /* Row 29: enableTranscript */
      hintedCell("enableTranscript", hasTranscript ? "true" : "false"),
      /* Row 30: transcriptType */
      hintedCell("transcriptType", hasTranscript ? "custom" : ""),
      /* Row 31: showTranscriptLabel */
      hintedCell("showTranscriptLabel", transcriptLabel || "View Transcript"),
      /* Row 32: hideTranscriptLabel */
      hintedCell("hideTranscriptLabel", ""),
      /* Row 33: transcriptClickBehavior */
      hintedCell("transcriptClickBehavior", hasTranscript ? "new-tab" : ""),
      /* Row 34: modalHiddenPanelId */
      hintedCell("modalHiddenPanelId", ""),
      /* Row 35: transcriptLink */
      hintedLinkCell("transcriptLink", transcriptHref, transcriptLabel),
      /* Row 36: transcriptButtonIconType */
      hintedCell("transcriptButtonIconType", hasTranscript ? "icon-font" : ""),
      /* Row 37: transcriptShowFontIcon */
      hintedCell("transcriptShowFontIcon", hasTranscript ? "play" : ""),
      /* Row 38: transcriptShowImageIcon */
      [""],
      /* Row 39: transcriptHideFontIcon */
      hintedCell("transcriptHideFontIcon", ""),
      /* Row 40: transcriptHideImageIcon */
      [""],
      /* Row 41: transcriptLinkIconPosition */
      hintedCell("transcriptLinkIconPosition", hasTranscript ? "after" : ""),
      /* Row 42: playButtonAriaLabel */
      hintedCell("playButtonAriaLabel", ""),
      /* Row 43: videoCaption */
      hintedCell("videoCaption", "")
    ];
    const block = WebImporter.Blocks.createBlock(document2, { name: "brightcove-video", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/cards.js
  function parse2(element, { document: document2 }) {
    if (!element.classList.contains("flexbox-cards") && !element.classList.contains("savings-card-cards")) {
      return;
    }
    const cardItems = element.querySelectorAll(":scope > .flexboxitem-v2 > .abbv-flex-item-v2.icon-image-card");
    if (!cardItems.length) return;
    const cells = [];
    cardItems.forEach((card) => {
      const img = card.querySelector(".abbv-image-content-container-v2 img");
      const cardBody = card.querySelector(".abbv-stretched-card-body");
      const heading = cardBody ? cardBody.querySelector(".heading-2") : null;
      const description = cardBody ? cardBody.querySelector("p:not(.heading-2)") : null;
      const ctaLink = card.querySelector(".cta a");
      const imageCell = document2.createDocumentFragment();
      imageCell.appendChild(document2.createComment(" field:image "));
      if (img) {
        const imgEl = document2.createElement("img");
        imgEl.src = img.getAttribute("src") || "";
        imgEl.alt = img.getAttribute("alt") || "";
        imageCell.appendChild(imgEl);
      }
      const textCell = document2.createDocumentFragment();
      textCell.appendChild(document2.createComment(" field:text "));
      if (heading) {
        const h = document2.createElement("h2");
        h.textContent = heading.textContent.trim();
        textCell.appendChild(h);
      }
      if (description) {
        const p = document2.createElement("p");
        p.textContent = description.textContent.trim();
        textCell.appendChild(p);
      }
      if (ctaLink) {
        const p = document2.createElement("p");
        const a = document2.createElement("a");
        a.href = ctaLink.getAttribute("href") || "";
        a.textContent = ctaLink.textContent.trim();
        p.appendChild(a);
        textCell.appendChild(p);
      }
      cells.push([imageCell, textCell]);
    });
    const block = WebImporter.Blocks.createBlock(document2, { name: "cards", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/columns.js
  function parse3(element, { document: document2 }) {
    const cells = [];
    if (element.classList.contains("image-outside-container-v3")) {
      const imageCol = [];
      const img = element.querySelector(".abbv-image-content-container-v2 img, picture");
      if (img) {
        const picture = img.closest("picture") || img;
        imageCol.push(picture);
      }
      const textCol = [];
      const parentRow = element.closest(".abbv-row");
      if (parentRow) {
        const cols = parentRow.querySelectorAll(":scope > .abbv-col");
        const textColEl = cols.length > 1 ? cols[1] : null;
        if (textColEl) {
          const richText = textColEl.querySelector(".abbv-rich-text");
          if (richText) {
            const heading = richText.querySelector('p[class*="heading"], [class*="heading"]');
            if (heading) textCol.push(heading);
            const paragraphs = richText.querySelectorAll('p:not([class*="heading"])');
            paragraphs.forEach((p) => textCol.push(p));
          }
          const cta = textColEl.querySelector(".cta a, a.abbv-button-primary");
          if (cta) textCol.push(cta);
        }
      }
      cells.push([imageCol, textCol]);
    } else if (element.classList.contains("savings-card-tout")) {
      const cols = element.querySelectorAll(":scope .abbv-col.abbv-col-6");
      const imageCol = [];
      if (cols.length > 0) {
        const img = cols[0].querySelector("img, picture");
        if (img) {
          const picture = img.closest("picture") || img;
          imageCol.push(picture);
        }
      }
      const textCol = [];
      if (cols.length > 1) {
        const richTexts = cols[1].querySelectorAll(".abbv-rich-text");
        richTexts.forEach((rt) => {
          const heading = rt.querySelector('[class*="heading"]');
          if (heading) textCol.push(heading);
          const paragraphs = rt.querySelectorAll('p:not([class*="heading"])');
          paragraphs.forEach((p) => textCol.push(p));
        });
        const ctas = cols[1].querySelectorAll(".cta a, a.abbv-button-primary");
        ctas.forEach((cta) => textCol.push(cta));
      }
      cells.push([imageCol, textCol]);
    } else {
      const flexItems = element.querySelectorAll(".flexboxitem-v2 .abbv-flex-item-v2, .abbv-flex-item-v2");
      if (flexItems.length > 0) {
        const row = [];
        flexItems.forEach((item) => {
          const col = [];
          const heading = item.querySelector('.abbv-rich-text [class*="heading"], .abbv-rich-text p');
          if (heading) col.push(heading);
          const cta = item.querySelector(".cta a, a.abbv-button-primary");
          if (cta) col.push(cta);
          row.push(col);
        });
        cells.push(row);
      } else {
        const allCols = element.querySelectorAll(".abbv-col");
        if (allCols.length > 0) {
          const row = [];
          allCols.forEach((col) => {
            const colContent = [];
            const heading = col.querySelector('[class*="heading"], h2, h3');
            if (heading) colContent.push(heading);
            const paragraphs = col.querySelectorAll('p:not([class*="heading"])');
            paragraphs.forEach((p) => colContent.push(p));
            const cta = col.querySelector('.cta a, a.abbv-button-primary, a[class*="button"]');
            if (cta) colContent.push(cta);
            row.push(colContent);
          });
          cells.push(row);
        }
      }
    }
    const block = WebImporter.Blocks.createBlock(document2, { name: "columns", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/fragment.js
  function parse4(element, { document: document2 }) {
    const fragmentPath = "/fragments/isi/linzess";
    const link = document2.createElement("a");
    link.href = fragmentPath;
    link.textContent = fragmentPath;
    const cells = [
      [link]
      // <!-- field:reference -->
    ];
    const block = WebImporter.Blocks.createBlock(document2, { name: "fragment", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/hero.js
  function parse5(element, { document: document2 }) {
    var _a, _b, _c;
    const img = element.querySelector(".abbv-image-content-container-v2 img");
    const imgSrc = (img == null ? void 0 : img.getAttribute("src")) || "";
    const imgAlt = (img == null ? void 0 : img.getAttribute("alt")) || "";
    const eyebrowEl = element.querySelector(".eyebrow, .eyebrow--white");
    const eyebrow = ((_a = eyebrowEl == null ? void 0 : eyebrowEl.textContent) == null ? void 0 : _a.trim()) || "";
    const headingEl = element.querySelector("h1, .heading-1");
    const headingText = ((_b = headingEl == null ? void 0 : headingEl.textContent) == null ? void 0 : _b.trim()) || "";
    const captionEl = element.querySelector(".tout-overlay");
    const imageCaption = ((_c = captionEl == null ? void 0 : captionEl.textContent) == null ? void 0 : _c.trim()) || "";
    const classes = [];
    if (element.classList.contains("uppercase")) classes.push("no-padding");
    const contentContainer = element.querySelector(".abbv-image-text-content-container-v2");
    if (contentContainer) {
      if (contentContainer.classList.contains("middle-left")) classes.push("text-left");
      else if (contentContainer.classList.contains("middle-center")) classes.push("text-center");
      else if (contentContainer.classList.contains("middle-right")) classes.push("text-right");
    }
    const blockName = classes.length > 0 ? `hero (${classes.join(", ")})` : "hero";
    const imageEl = document2.createElement("img");
    imageEl.src = imgSrc;
    if (imgAlt) imageEl.alt = imgAlt;
    const h1 = document2.createElement("h1");
    h1.textContent = headingText;
    const cells = [
      [imageEl],
      // image
      [""],
      // mobileImage (not available in source)
      [eyebrow],
      // eyebrow
      [""],
      // indication (not used on this page)
      [h1],
      // text (heading & body)
      [""],
      // layers (not used)
      [""],
      // video (not used)
      [imageCaption]
      // imageCaption
    ];
    const block = WebImporter.Blocks.createBlock(document2, { name: blockName, cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/section-nav.js
  var SUBPAGE_ANCHOR_MAP = {
    "find-relief-talk-to-a-doctor": {
      "#talktoadoctor": "#talktoadoctor",
      "#howtotake": "/find-relief/how-to-take-linzess"
    },
    "find-relief-how-to-take-linzess": {
      "#talktoadoctor": "/find-relief/talk-to-a-doctor",
      "#howtotake": "#howtotake"
    }
  };
  function parse6(element, { document: document2, params }) {
    const navItems = element.querySelectorAll(".section-navigation-list li a");
    if (!navItems.length) return;
    const subpageName = (params == null ? void 0 : params.subpageName) || "";
    const anchorMap = SUBPAGE_ANCHOR_MAP[subpageName] || null;
    const cells = [];
    navItems.forEach((link) => {
      const label = link.textContent.trim();
      let href = link.getAttribute("href") || "";
      if (anchorMap && anchorMap[href]) {
        href = anchorMap[href];
      }
      const a = document2.createElement("a");
      a.href = href;
      a.textContent = label;
      cells.push([label, a]);
    });
    const block = WebImporter.Blocks.createBlock(document2, { name: "section-nav", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/tabs.js
  function parse7(element, { document: document2 }) {
    const tabControls = element.querySelectorAll(".abbv-tabs-controls .abbv-tab-control");
    const cells = [];
    tabControls.forEach((control) => {
      const tabTextEl = control.querySelector(".abbv-tab-text");
      if (tabTextEl) {
        tabTextEl.querySelectorAll("br").forEach((br) => br.replaceWith(" "));
        const titleText = tabTextEl.textContent.trim().replace(/\s+/g, " ");
        const titleNode = document2.createTextNode(titleText);
        cells.push([titleNode]);
      }
    });
    const block = WebImporter.Blocks.createBlock(document2, { name: "tabs", cells });
    element.replaceWith(block);
  }

  // tools/importer/transformers/linzess-cleanup.js
  var TransformHook = { beforeTransform: "beforeTransform", afterTransform: "afterTransform" };
  function transform(hookName, element, payload) {
    if (hookName === TransformHook.beforeTransform) {
      WebImporter.DOMUtils.remove(element, [
        ".abbv-modal"
      ]);
      WebImporter.DOMUtils.remove(element, [
        ".vjs-control-bar",
        ".vjs-modal-dialog",
        ".vjs-text-track-settings",
        ".vjs-error-display",
        ".vjs-player-info-modal",
        ".vjs-loading-spinner",
        ".vjs-text-track-display",
        ".vjs-dock-shelf"
      ]);
      const selects = element.querySelectorAll("video-js select, video-js fieldset");
      selects.forEach((el) => el.remove());
      const allImgs = element.querySelectorAll("img");
      const trackingDomains = ["metrics.brightcove.com", "dpm.demdex.net", "adservice.google.com", "gstatic.com/recaptcha"];
      allImgs.forEach((img) => {
        const src = img.getAttribute("src") || "";
        if (trackingDomains.some((domain) => src.includes(domain))) {
          img.remove();
        }
      });
      WebImporter.DOMUtils.remove(element, [
        '[class*="onetrust"]',
        '[id*="onetrust"]',
        '[class*="optanon"]',
        "#ot-sdk-btn-floating"
      ]);
      WebImporter.DOMUtils.remove(element, [
        "script",
        "style"
      ]);
    }
    if (hookName === TransformHook.afterTransform) {
      WebImporter.DOMUtils.remove(element, [
        "header.abbv-header-v2",
        "footer.abbv-footer",
        ".linzess-top-banner",
        ".header-v2.parbase",
        ".footer.parbase",
        ".safety-bar.parbase",
        ".abbv-safety-bar",
        ".abbv-skip-to-main-content",
        ".abbv-sticky-anchor"
      ]);
      WebImporter.DOMUtils.remove(element, [
        ".newpar.new.section",
        ".par.iparys_inherited"
      ]);
      WebImporter.DOMUtils.remove(element, [
        "noscript",
        "link",
        "iframe"
      ]);
      const modalLinks = element.querySelectorAll("a.abbv-modal-open");
      modalLinks.forEach((link) => link.remove());
      const presentationalBrs = element.querySelectorAll("br.desktop-only, br.mobile-only");
      presentationalBrs.forEach((br) => {
        br.replaceWith(document.createTextNode(" "));
      });
      const emptyDivs = element.querySelectorAll(".vjs-dock-shelf, .abbv-inline-miscisi");
      emptyDivs.forEach((div) => {
        if (!div.textContent.trim() && !div.querySelector("img")) {
          div.remove();
        }
      });
    }
  }

  // tools/importer/transformers/linzess-image-urls.js
  var TransformHook2 = { beforeTransform: "beforeTransform", afterTransform: "afterTransform" };
  var SOURCE_DAM_PREFIX = "/content/dam/linzess/images/";
  var PROJECT_DAM_PREFIX = "/content/dam/abbvie-eds-poc/linzess/images/";
  function rewriteUrl(value) {
    if (!value) return value;
    return value.replace(
      /(https?:\/\/[^/]+)?\/content\/dam\/linzess\/images\//g,
      PROJECT_DAM_PREFIX
    );
  }
  function transform2(hookName, element, payload) {
    if (hookName !== TransformHook2.beforeTransform) return;
    element.querySelectorAll("img, source").forEach((el) => {
      ["src", "data-src", "srcset", "data-srcset"].forEach((attr) => {
        const val = el.getAttribute(attr);
        if (val && val.includes(SOURCE_DAM_PREFIX)) {
          el.setAttribute(attr, rewriteUrl(val));
        }
      });
    });
  }

  // tools/importer/transformers/linzess-subpage-splitter.js
  var TransformHook3 = { beforeTransform: "beforeTransform", afterTransform: "afterTransform" };
  var SUBPAGE_CONFIG = {
    "find-relief-talk-to-a-doctor": {
      keepAnchor: "talktoadoctor",
      removeAnchor: "howtotake",
      heroTitle: "Talk to a Doctor"
    },
    "find-relief-how-to-take-linzess": {
      keepAnchor: "howtotake",
      removeAnchor: "talktoadoctor",
      heroTitle: "How to Take LINZESS"
    }
  };
  function transform3(hookName, element, payload) {
    if (hookName !== TransformHook3.beforeTransform) return;
    const { template } = payload;
    if (!template) return;
    const config = SUBPAGE_CONFIG[template.name];
    if (!config) return;
    const removeAnchor = element.querySelector(`a[id="${config.removeAnchor}"]`);
    if (removeAnchor) {
      const containerToRemove = removeAnchor.closest(".container.parbase");
      if (containerToRemove) {
        containerToRemove.remove();
      }
    }
    const heroContainer = element.querySelector(".hero-container.abbv-image-text-v2");
    if (heroContainer) {
      const h1 = heroContainer.querySelector("h1");
      if (h1) {
        h1.textContent = config.heroTitle;
      }
    }
  }

  // tools/importer/transformers/linzess-sections.js
  var TransformHook4 = { beforeTransform: "beforeTransform", afterTransform: "afterTransform" };
  function findSectionElement(element, selector) {
    const selectors = Array.isArray(selector) ? selector : [selector];
    for (const sel of selectors) {
      try {
        const el = element.querySelector(sel);
        if (el) {
          if (el.tagName === "A" && !el.href && el.id) {
            const parent = el.closest('.abbv-container, .container.parbase, section, [class*="container"]');
            if (parent) return parent;
            return el.parentElement;
          }
          return el;
        }
      } catch (e) {
      }
      if (sel.startsWith("#")) {
        const anchorId = sel.substring(1);
        const anchor = element.querySelector(`a[id="${anchorId}"]`);
        if (anchor) {
          const parent = anchor.closest('.abbv-container, .container.parbase, section, [class*="container"]');
          if (parent) return parent;
          return anchor.parentElement;
        }
      }
    }
    return null;
  }
  function transform4(hookName, element, payload) {
    if (hookName === TransformHook4.afterTransform) {
      const { template } = payload;
      if (!template || !template.sections || template.sections.length < 2) return;
      const doc = element.ownerDocument || document;
      const sections = template.sections;
      for (let i = sections.length - 1; i >= 0; i--) {
        const section = sections[i];
        const sectionEl = findSectionElement(element, section.selector);
        if (!sectionEl) continue;
        const hasMeta = section.style || section.anchorId;
        if (hasMeta) {
          const metaCells = {};
          if (section.style) {
            metaCells.style = section.style;
          }
          if (section.anchorId) {
            metaCells.anchorId = section.anchorId;
          }
          const sectionMetadata = WebImporter.Blocks.createBlock(doc, {
            name: "Section Metadata",
            cells: metaCells
          });
          sectionEl.after(sectionMetadata);
        }
        if (i > 0) {
          const hr = doc.createElement("hr");
          const prevAnchor = sectionEl.previousElementSibling;
          if (prevAnchor && prevAnchor.tagName === "A" && prevAnchor.id && !prevAnchor.href) {
            prevAnchor.before(hr);
          } else {
            sectionEl.before(hr);
          }
        }
      }
    }
  }

  // tools/importer/import-find-relief.js
  var parsers = {
    "brightcove-video": parse,
    "cards": parse2,
    "columns": parse3,
    "fragment": parse4,
    "hero": parse5,
    "section-nav": parse6,
    "tabs": parse7
  };
  var PAGE_TEMPLATES = {
    "find-relief": {
      name: "find-relief",
      description: "Linzess Find Relief page - Talk to a Doctor, How to Take LINZESS sections with videos, cards, tabs",
      documentPath: "/linzess/find-relief/index",
      urls: ["https://www.linzess.com/find-relief"],
      blocks: [
        { name: "hero", instances: [".hero-container.abbv-image-text-v2"] },
        { name: "section-nav", instances: [".abbv-section-navigation"] },
        { name: "columns", instances: [".image-outside-container-v3.abbv-image-text-v2", ".abbv-row-container.savings-card-tout", ".abbv-container.background-dark-purple-gradient .abbv-image-text-v2"] },
        { name: "brightcove-video", instances: [".abbv-video-player"] },
        { name: "cards", instances: [".abbv-flex-container-v2:has(.icon-image-card)", ".savings-card-cards"] },
        { name: "tabs", instances: [".abbv-tabs"] },
        { name: "fragment", instances: [".abbv-inline-use-isi"] }
      ],
      sections: [
        { id: "hero", name: "Hero", selector: ".hero-container.abbv-image-text-v2", style: null, anchorId: null, blocks: ["hero"], defaultContent: [] },
        { id: "section-nav", name: "Section Navigation", selector: ".section-navigation.parbase", style: null, anchorId: null, blocks: ["section-nav"], defaultContent: [] },
        { id: "talk-to-a-doctor", name: "Talk to a Doctor", selector: ["#talktoadoctor", ".abbv-container.background-white.background-white-arc"], style: "find-relief-checklist", anchorId: "talktoadoctor", blocks: ["columns", "brightcove-video"], defaultContent: [".abbv-rich-text.text-align-center.narrow-spacing", ".checkmark-list"] },
        { id: "how-to-take", name: "How to Take LINZESS", selector: ["#howtotake", ".abbv-container.background-off-white"], style: "find-relief-off-white", anchorId: "howtotake", blocks: ["brightcove-video", "cards", "tabs", "columns"], defaultContent: [".abbv-rich-text.text-align-center"] },
        { id: "bottom-cta", name: "Bottom Navigation CTA", selector: ".abbv-container.background-dark-purple.bottom-nav", style: "find-relief-dark-purple", anchorId: null, blocks: ["columns"], defaultContent: [] },
        { id: "isi", name: "ISI", selector: ".abbv-inline-use-isi", style: null, anchorId: null, blocks: ["fragment"], defaultContent: [] }
      ]
    },
    "find-relief-talk-to-a-doctor": {
      name: "find-relief-talk-to-a-doctor",
      description: "Linzess Find Relief subpage - Talk to a Doctor section",
      documentPath: "/linzess/find-relief/talk-to-a-doctor",
      urls: ["https://www.linzess.com/find-relief"],
      blocks: [
        { name: "hero", instances: [".hero-container.abbv-image-text-v2"] },
        { name: "section-nav", instances: [".abbv-section-navigation"] },
        { name: "columns", instances: [".image-outside-container-v3.abbv-image-text-v2"] },
        { name: "brightcove-video", instances: [".abbv-video-player"] },
        { name: "fragment", instances: [".abbv-inline-use-isi"] }
      ],
      sections: [
        { id: "hero", name: "Hero", selector: ".hero-container.abbv-image-text-v2", style: null, anchorId: null, blocks: ["hero"], defaultContent: [] },
        { id: "section-nav", name: "Section Navigation", selector: ".section-navigation.parbase", style: null, anchorId: null, blocks: ["section-nav"], defaultContent: [] },
        { id: "talk-to-a-doctor", name: "Talk to a Doctor", selector: ["#talktoadoctor", ".abbv-container.background-white.background-white-arc"], style: "find-relief-checklist", anchorId: "talktoadoctor", blocks: ["columns", "brightcove-video"], defaultContent: [".abbv-rich-text.text-align-center.narrow-spacing", ".checkmark-list"] },
        { id: "bottom-cta", name: "Bottom Navigation CTA", selector: ".abbv-container.background-dark-purple.bottom-nav", style: "find-relief-dark-purple", anchorId: null, blocks: ["columns"], defaultContent: [] },
        { id: "isi", name: "ISI", selector: ".abbv-inline-use-isi", style: null, anchorId: null, blocks: ["fragment"], defaultContent: [] }
      ]
    },
    "find-relief-how-to-take-linzess": {
      name: "find-relief-how-to-take-linzess",
      description: "Linzess Find Relief subpage - How to Take LINZESS",
      documentPath: "/linzess/find-relief/how-to-take-linzess",
      urls: ["https://www.linzess.com/find-relief"],
      blocks: [
        { name: "hero", instances: [".hero-container.abbv-image-text-v2"] },
        { name: "section-nav", instances: [".abbv-section-navigation"] },
        { name: "columns", instances: [".abbv-row-container.savings-card-tout", ".abbv-container.background-dark-purple-gradient .abbv-image-text-v2"] },
        { name: "brightcove-video", instances: [".abbv-video-player"] },
        { name: "cards", instances: [".abbv-flex-container-v2:has(.icon-image-card)", ".savings-card-cards"] },
        { name: "tabs", instances: [".abbv-tabs"] },
        { name: "fragment", instances: [".abbv-inline-use-isi"] }
      ],
      sections: [
        { id: "hero", name: "Hero", selector: ".hero-container.abbv-image-text-v2", style: null, anchorId: null, blocks: ["hero"], defaultContent: [] },
        { id: "section-nav", name: "Section Navigation", selector: ".section-navigation.parbase", style: null, anchorId: null, blocks: ["section-nav"], defaultContent: [] },
        { id: "how-to-take", name: "How to Take LINZESS", selector: ["#howtotake", ".abbv-container.background-off-white"], style: "find-relief-off-white", anchorId: "howtotake", blocks: ["brightcove-video", "cards", "tabs", "columns"], defaultContent: [".abbv-rich-text.text-align-center"] },
        { id: "bottom-cta", name: "Bottom Navigation CTA", selector: ".abbv-container.background-dark-purple.bottom-nav", style: "find-relief-dark-purple", anchorId: null, blocks: ["columns"], defaultContent: [] },
        { id: "isi", name: "ISI", selector: ".abbv-inline-use-isi", style: null, anchorId: null, blocks: ["fragment"], defaultContent: [] }
      ]
    }
  };
  function resolveTemplate(params) {
    const subpageName = (params == null ? void 0 : params.subpageName) || "";
    if (subpageName && PAGE_TEMPLATES[subpageName]) {
      return PAGE_TEMPLATES[subpageName];
    }
    return PAGE_TEMPLATES["find-relief"];
  }
  var transformers = [
    transform,
    transform2,
    transform3,
    transform4
  ];
  function executeTransformers(hookName, element, payload) {
    transformers.forEach((transformerFn) => {
      try {
        transformerFn.call(null, hookName, element, payload);
      } catch (e) {
        console.error(`Transformer failed at ${hookName}:`, e);
      }
    });
  }
  function findBlocksOnPage(document2, template) {
    const pageBlocks = [];
    template.blocks.forEach((blockDef) => {
      blockDef.instances.forEach((selector) => {
        try {
          const elements = document2.querySelectorAll(selector);
          elements.forEach((element) => {
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
  var import_find_relief_default = {
    transform: (payload) => {
      const { document: document2, url, html, params } = payload;
      const main = document2.body;
      const template = resolveTemplate(params);
      const enhancedPayload = __spreadProps(__spreadValues({}, payload), { template });
      executeTransformers("beforeTransform", main, enhancedPayload);
      const pageBlocks = findBlocksOnPage(document2, template);
      pageBlocks.forEach((block) => {
        const parser = parsers[block.name];
        if (parser) {
          try {
            parser(block.element, { document: document2, url, params });
          } catch (e) {
            console.error(`Failed to parse ${block.name} (${block.selector}):`, e);
          }
        } else {
          console.warn(`No parser found for block: ${block.name}`);
        }
      });
      executeTransformers("afterTransform", main, enhancedPayload);
      const hr = document2.createElement("hr");
      main.appendChild(hr);
      WebImporter.rules.createMetadata(main, document2);
      WebImporter.rules.transformBackgroundImages(main, document2);
      WebImporter.rules.adjustImageUrls(main, url, params.originalURL);
      main.querySelectorAll("img, source").forEach((el) => {
        ["src", "srcset"].forEach((attr) => {
          const v = el.getAttribute(attr);
          if (v && v.includes("/content/dam/abbvie-eds-poc/")) {
            el.setAttribute(attr, v.replace(/https?:\/\/[^/]+(\/content\/dam\/abbvie-eds-poc\/)/g, "$1"));
          }
        });
      });
      const path = template.documentPath || WebImporter.FileUtils.sanitizePath(
        new URL(params.originalURL).pathname.replace(/\/$/, "").replace(/\.html$/, "")
      );
      return [{
        element: main,
        path,
        report: {
          title: document2.title,
          template: template.name,
          blocks: pageBlocks.map((b) => b.name)
        }
      }];
    }
  };
  return __toCommonJS(import_find_relief_exports);
})();
