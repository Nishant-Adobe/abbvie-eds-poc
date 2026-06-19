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

  // tools/importer/import-savings-card-subpage.js
  var import_savings_card_subpage_exports = {};
  __export(import_savings_card_subpage_exports, {
    default: () => import_savings_card_subpage_default
  });

  // tools/importer/transformers/linzess-cleanup.js
  function transform(hookName, element, payload) {
    if (hookName !== "beforeTransform") return;
    const { document } = payload;
    element.querySelectorAll("header, nav, .abbv-header, .abbv-nav, .abbv-sticky-anchor").forEach((el) => el.remove());
    element.querySelectorAll("footer, .abbv-footer").forEach((el) => el.remove());
    element.querySelectorAll('#onetrust-consent-sdk, .onetrust-pc-dark-filter, [class*="onetrust"]').forEach((el) => el.remove());
    element.querySelectorAll(".abbv-safety-bar, .abbv-floating-isi").forEach((el) => el.remove());
    element.querySelectorAll('.abbv-modal, [class*="modal"]').forEach((el) => el.remove());
    element.querySelectorAll('script, style, noscript, link[rel="stylesheet"]').forEach((el) => el.remove());
    element.querySelectorAll('iframe, [class*="recaptcha"], .grecaptcha-badge').forEach((el) => el.remove());
    element.querySelectorAll(".cmp-adaptiveform-container-form-loading, .abbv-animation-loading").forEach((el) => el.remove());
    element.querySelectorAll(".abbv-top-banner, .abbv-eyebrow").forEach((el) => el.remove());
    element.querySelectorAll("[data-cmp-is], [data-sly-resource]").forEach((el) => {
      el.removeAttribute("data-cmp-is");
      el.removeAttribute("data-sly-resource");
    });
  }

  // tools/importer/transformers/savings-card-subpage-seo.js
  var PER_PAGE_TITLE = {
    terms: "Program Terms, Conditions, and Eligibility Criteria | LINZESS\xAE",
    activate: "Activate Your LINZESS\xAE Savings Card | LINZESS\xAE",
    savings: "LINZESS\xAE Savings Card | Save on Your Prescription"
  };
  var TERMS_HEADING = "Program Terms, Conditions, and Eligibility Criteria";
  var TERMS_BODY_HTML = '<p>This offer is valid only for patients with commercial prescription insurance coverage, who are 6 years of age or older and meet eligibility criteria and is good for use only with a valid prescription for LINZESS<sup>\xAE</sup> (linaclotide) capsules 72 mcg, 145 mcg, or 290 mcg at the time the prescription is filled by the pharmacist and dispensed to the patient. This offer is not valid for use by patients enrolled in Medicare, Medicaid, or other federal or state programs (including any state pharmaceutical assistance programs, TRICARE, Department of Defense or Veterans Affairs programs), or private indemnity or HMO insurance plans that reimburse you for the entire cost of your prescription drugs or where prohibited by law or by the patient\u2019s health insurance provider. If at any time a patient begins receiving prescription drug coverage under any such federal, state, or government-funded healthcare program, patient will no longer be eligible to use the LINZESS savings card. Patients may not use this card if they are Medicare-eligible and enrolled in an employer-sponsored health plan or prescription drug benefit program for retirees. This offer is not valid for cash-paying patients. Offer good only in the USA, including Puerto Rico, at participating retail pharmacies. Patients residing in or receiving treatment in certain states may not be eligible to participate in this program. Depending on your insurance coverage, eligible patients may pay as little as $30 per 30, 60, or 90-day supply for each of up to twelve (12) prescription fills per calendar year. One 60-day supply counts as two (2) fills and one 90-day supply counts as three (3) fills of the total twelve (12) fills. AbbVie reserves the right to rescind, revoke, or amend this offer without notice. Void if prohibited by law, taxed, or restricted. Patients may not seek reimbursement for value received under the LINZESS Savings Program from any third-party payers. This offer is not transferable. The selling, purchasing, trading, or counterfeiting of this card is prohibited by law. This offer has no cash value and may not be used in combination with any other discount, coupon, rebate, free trial, or similar offer for the specified prescription. Subject to all other terms and conditions, the maximum annual benefit that may be available solely for the patient\u2019s benefit under the co-pay assistance program is $2,280.00 per calendar year. The actual application and use of the benefit available under the co-pay assistance program may vary on a monthly, quarterly, and/or annual basis depending on each individual patient\u2019s plan of insurance and other prescription drug costs. This offer is not health insurance. <strong>By redeeming this offer, you acknowledge that you are an eligible patient and that you understand and agree to comply with the terms and conditions of this offer. To learn about AbbVie\u2019s privacy practices and your privacy choices, visit <a href="https://abbv.ie/corpprivacy">https://abbv.ie/corpprivacy</a>.</strong></p>';
  var TERMS_DESCRIPTION = "LINZESS\xAE (linaclotide) Savings Program terms, conditions, and eligibility criteria \u2014 who qualifies, savings limits, and how to use the LINZESS savings card.";
  function frag(doc, html) {
    const tpl = doc.createElement("div");
    tpl.innerHTML = html;
    const f = doc.createDocumentFragment();
    while (tpl.firstChild) f.appendChild(tpl.firstChild);
    return f;
  }
  function slugFromUrl(payload) {
    var _a;
    const src = ((_a = payload.params) == null ? void 0 : _a.originalURL) || payload.url || "";
    try {
      return new URL(src).pathname.replace(/\/$/, "").split("/").filter(Boolean).pop() || "";
    } catch (e) {
      return "";
    }
  }
  function appendMetadata(element, document, title, description) {
    const table = WebImporter.DOMUtils.createTable([
      ["Metadata"],
      ["brand", "linzess"],
      ["title", title],
      ["description", description]
    ], document);
    element.append(table);
  }
  function transform2(hookName, element, payload) {
    var _a, _b;
    if (hookName !== "afterTransform") return;
    const { document } = payload;
    const slug = slugFromUrl(payload);
    if (slug === "terms") {
      element.textContent = "";
      const content = document.createElement("div");
      const h1 = document.createElement("h1");
      h1.textContent = TERMS_HEADING;
      content.append(h1);
      content.append(frag(document, TERMS_BODY_HTML));
      content.append(WebImporter.DOMUtils.createTable([
        ["Section Metadata"],
        ["classes_customClass", "terms-content"]
      ], document));
      element.append(content);
      appendMetadata(element, document, PER_PAGE_TITLE.terms, TERMS_DESCRIPTION);
      return;
    }
    if (!element.querySelector("h1")) {
      const lead = element.querySelector("h2, h3");
      if (lead) {
        const h1 = document.createElement("h1");
        h1.innerHTML = lead.innerHTML;
        lead.replaceWith(h1);
      }
    }
    const firstParagraph = [...element.querySelectorAll("p")].map((p) => p.textContent.trim()).find((t) => t.length > 40);
    const title = PER_PAGE_TITLE[slug] || (document.title || "").trim() || ((_b = (_a = element.querySelector("h1, h2, h3")) == null ? void 0 : _a.textContent) == null ? void 0 : _b.trim()) || "LINZESS\xAE (linaclotide)";
    const description = (firstParagraph || `${title} \u2014 LINZESS\xAE (linaclotide). Important Safety Information and full Prescribing Information.`).replace(/\s+/g, " ").trim().slice(0, 160);
    appendMetadata(element, document, title, description);
  }

  // tools/importer/import-savings-card-subpage.js
  var PAGE_TEMPLATE = {
    name: "savings-card-subpage",
    description: "Linzess savings card sub-pages including terms, activation, and savings details",
    urls: [
      "https://www.linzess.com/savings-card/terms",
      "https://www.linzess.com/savings-card/activate",
      "https://www.linzess.com/savings-card/savings"
    ],
    blocks: [],
    sections: []
  };
  var transformers = [
    transform,
    // beforeTransform: strip header/footer/cookie/scripts
    transform2
    // afterTransform: promote lead heading to h1 + curated Metadata (brand/title/description)
  ];
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
  var import_savings_card_subpage_default = {
    transform: (payload) => {
      const { document, url, html, params } = payload;
      const main = document.body;
      executeTransformers("beforeTransform", main, payload);
      executeTransformers("afterTransform", main, payload);
      WebImporter.rules.transformBackgroundImages(main, document);
      WebImporter.rules.adjustImageUrls(main, url, params.originalURL);
      const slug = new URL(params.originalURL).pathname.replace(/\/$/, "").replace(/\.html$/, "").split("/").filter(Boolean).pop() || "index";
      const path = WebImporter.FileUtils.sanitizePath(`/linzess/savings-card/${slug}`);
      return [{
        element: main,
        path,
        report: {
          title: document.title,
          template: PAGE_TEMPLATE.name,
          blocks: []
        }
      }];
    }
  };
  return __toCommonJS(import_savings_card_subpage_exports);
})();
