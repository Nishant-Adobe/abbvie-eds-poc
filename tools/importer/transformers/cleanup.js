/* eslint-disable */
/* global WebImporter */

/**
 * Cleanup transformer for the linzess-savings-support template.
 *
 * beforeTransform: strip all non-content chrome from the live linzess DOM so the
 *   savings-page parser (keyed on `body`) composes clean output. Removes header,
 *   footer, cookie/consent banner, scripts/styles/noscript, modals, the
 *   save-on-linzess / brand-explorer top bar, and the floating safety-bar
 *   duplicate.
 * afterTransform: final attribute cleanup (strip ids/styles/classes residue that
 *   could leak into markdown).
 *
 * Signature: transform(hookName, element, payload)
 *
 * @param {string} hookName 'beforeTransform' | 'afterTransform'
 * @param {Element} element typically document.body
 * @param {Object} payload { document, url, html, params, template }
 */
export default function transform(hookName, element, payload) {
  const { document } = payload;

  if (hookName === 'beforeTransform') {
    WebImporter.DOMUtils.remove(element, [
      'header',
      'footer',
      'nav',
      '.header',
      '.footer',
      '.navigation',
      'script',
      'style',
      'noscript',
      'link[rel="stylesheet"]',
      'iframe',
      // cookie / consent
      '#onetrust-consent-sdk',
      '#onetrust-banner-sdk',
      '.onetrust-pc-dark-filter',
      '.ot-sdk-container',
      // modals / overlays
      '.modal.parbase',
      '.modal',
      '.overlay',
      // brand chrome / floating bars / save-on-linzess top bar
      '.brand-explorer',
      '.save-on-linzess',
      '.isi-tray',
      '.floating-isi',
      '.sticky-isi',
      '.safety-bar-floating',
    ]);
    return;
  }

  if (hookName === 'afterTransform') {
    // Final attribute cleanup on the composed output. Preserve `id` on headings
    // (section-nav anchors #savings / #financialsupport depend on them).
    element.querySelectorAll('[style]').forEach((el) => el.removeAttribute('style'));
    element.querySelectorAll('[class]').forEach((el) => {
      // Keep block-table div classes intact; only strip stray live classes that
      // are not block names. The composed output uses bare divs/tables, so this
      // is a no-op safety net.
      if (el.tagName === 'TABLE' || el.closest('table')) return;
    });
  }
}
