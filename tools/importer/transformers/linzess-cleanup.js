/* eslint-disable */
/* global WebImporter */

/**
 * Transformer: linzess cleanup
 * Removes non-authorable site chrome from LINZESS pages.
 *
 * Shared by every Linzess import family (utility/sitemap, savings-card subpages,
 * FAQ, community-support). Keeps develop's two-hook structure (before/after
 * transform, validated against migration-work/cleaned.html for the FAQ &
 * community migrations) and additionally removes the broader generic chrome the
 * utility/savings-card imports rely on.
 */
const TransformHook = { beforeTransform: 'beforeTransform', afterTransform: 'afterTransform' };

export default function transform(hookName, element, payload) {
  if (hookName === TransformHook.beforeTransform) {
    // --- develop (FAQ/community) cleanup ---
    // Modals (exit-site modals, WOL modals)
    WebImporter.DOMUtils.remove(element, ['.abbv-modal']);
    // OneTrust cookie consent banner
    WebImporter.DOMUtils.remove(element, ['#onetrust-consent-sdk']);
    // Floating safety bar (sticky ISI tray) — NOT the inline ISI content
    WebImporter.DOMUtils.remove(element, ['.abbv-safety-bar']);
    // Back-to-top button
    WebImporter.DOMUtils.remove(element, ['.abbv-back-to-top']);

    // --- broader generic cleanup (utility/savings-card imports, which did all
    //     of these in beforeTransform) ---
    // Generic header / nav / footer / banner chrome
    WebImporter.DOMUtils.remove(element, ['header', 'nav', '.abbv-header', '.abbv-nav', 'footer', '.abbv-footer', '.abbv-top-banner', '.abbv-eyebrow']);
    // Generic modals/onetrust variants, floating ISI
    WebImporter.DOMUtils.remove(element, ['[class*="modal"]', '.onetrust-pc-dark-filter', '[class*="onetrust"]', '.abbv-floating-isi']);
    // Scripts, styles, noscript
    WebImporter.DOMUtils.remove(element, ['script', 'style', 'noscript', 'link[rel="stylesheet"]']);
    // Tracking / analytics
    WebImporter.DOMUtils.remove(element, ['[class*="recaptcha"]', '.grecaptcha-badge']);
    // AEM placeholder / loading elements
    WebImporter.DOMUtils.remove(element, ['.cmp-adaptiveform-container-form-loading', '.abbv-animation-loading']);

    // Clean data attributes that aren't needed
    element.querySelectorAll('[data-cmp-is], [data-sly-resource]').forEach((el) => {
      el.removeAttribute('data-cmp-is');
      el.removeAttribute('data-sly-resource');
    });
  }

  if (hookName === TransformHook.afterTransform) {
    // --- develop (FAQ/community) cleanup ---
    // Header / navigation
    WebImporter.DOMUtils.remove(element, ['header.abbv-header-v2']);
    // Top promotional banner
    WebImporter.DOMUtils.remove(element, ['.linzess-top-banner']);
    // Sticky anchor div
    WebImporter.DOMUtils.remove(element, ['.abbv-sticky-anchor']);
    // Footer
    WebImporter.DOMUtils.remove(element, ['footer.abbv-footer']);
    // Misc ISI anchor/container
    WebImporter.DOMUtils.remove(element, ['.abbv-inline-miscisi']);
    // Iframes (tracking, OneTrust text-resize)
    WebImporter.DOMUtils.remove(element, ['iframe']);
    // Empty structural divs that are not authorable
    WebImporter.DOMUtils.remove(element, ['.newpar.new.section', '.par.iparys_inherited']);
  }
}
