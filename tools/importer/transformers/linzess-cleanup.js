/* eslint-disable */
/* global WebImporter */

/**
 * Transformer: linzess site-wide cleanup.
 *
 * Strips all non-authorable site chrome from the AbbVie/Linzess Platform-C
 * shell so the downstream block parsers receive only the page-body sections
 * (hero, the abbv-container bands, and the inline ISI).
 *
 * Every selector below is taken from the captured DOM in
 * migration-work/cleaned.html (line references in comments) EXCEPT
 * `div.abbv-fixed-isi`, which is the floating safety bar listed as site chrome
 * in tools/importer/page-templates.json (safety-bar block instances). It was
 * not present in this particular scrape, so removal is a safe no-op here and
 * fires when the validator runs against the live URL.
 *
 * After removal, the .abbv-content / .abbv-content-container / <section>
 * wrappers are unwrapped so the section bands become top-level children that
 * the sections transformer and block parsers can address directly.
 */

const TransformHook = {
  beforeTransform: 'beforeTransform',
  afterTransform: 'afterTransform',
};

/**
 * Replace a wrapper element with its own children (unwrap), leaving the
 * children in document order at the wrapper's position.
 */
function unwrap(el) {
  if (!el || !el.parentNode) return;
  const parent = el.parentNode;
  while (el.firstChild) {
    parent.insertBefore(el.firstChild, el);
  }
  parent.removeChild(el);
}

export default function transform(hookName, element, payload) {
  if (hookName === TransformHook.beforeTransform) {
    // Overlays / consent / blocking chrome removed first so they cannot
    // interfere with block matching during parsing.
    WebImporter.DOMUtils.remove(element, [
      '#onetrust-consent-sdk',          // cleaned.html:1734 cookie consent SDK
      '.modal.parbase',                 // cleaned.html:860,909,1042,1121,1166,1211,1254,1381,1434 modal wrappers
      '.abbv-modal',                    // cleaned.html:862+ inner modal nodes (defensive)
      '.g-recaptcha',                   // cleaned.html:1342 recaptcha widget
      '.grecaptcha-badge',              // cleaned.html:1343,1721 recaptcha badge
      '.abbv-fixed-isi',                // floating safety bar (page-templates.json safety-bar instance)
      '.abbv-inline-miscisi',           // duplicate misc ISI carrying non-approved rxabbvie.com links; safety-bar parser supplies the verbatim ISI from .abbv-inline-use-isi instead
    ]);
  }

  if (hookName === TransformHook.afterTransform) {
    // Non-authorable site chrome: top utility/savings banner, sticky header,
    // navigation, footer, back-to-top, and stray embeds/iframes/scripts.
    WebImporter.DOMUtils.remove(element, [
      '.linzess-top-banner',            // cleaned.html:13 savings/utility top bar (div.abbv-rich-text.linzess-top-banner)
      '.header-v2.parbase',             // cleaned.html:19 header wrapper block
      'header.abbv-header-v2',          // cleaned.html:20 sticky header (defensive, inside header-v2)
      '.abbv-skip-to-main-content',     // cleaned.html:22 skip link
      '.abbv-sticky-anchor',            // cleaned.html:229 sticky positioning anchor
      'nav',                            // cleaned.html:30+ nav lists inside header
      '.footer.parbase',                // cleaned.html:663 footer wrapper block
      'footer.abbv-footer',             // cleaned.html:665 footer (defensive, inside footer.parbase)
      '.abbv-back-to-top',              // cleaned.html:850 back-to-top button
      'iframe',                         // cleaned.html:1732 stray iframe (recaptcha host)
      'script',
      'style',
      'noscript',
      'link',
    ]);

    // Drop empty CMS scaffolding nodes that carry no authorable content.
    element.querySelectorAll('.newpar.new.section, .par.iparys_inherited').forEach((el) => {
      if (!el.textContent.trim() && !el.querySelector('img, picture, a, h1, h2, h3, h4, h5, h6, li')) {
        el.remove();
      }
    });

    // Unwrap content shell so the page-body sections become top-level.
    // Order: inner-most first is not required because unwrap is positional;
    // we unwrap the section band container, then the content containers.
    element.querySelectorAll('.abbv-content-container > div > section, .abbv-content-container section').forEach((s) => unwrap(s));
    element.querySelectorAll('.abbv-content-container').forEach((c) => unwrap(c));   // cleaned.html:7
    element.querySelectorAll('.abbv-content').forEach((c) => unwrap(c));            // cleaned.html:2

    // Strip tracking / behavioural attributes left on surviving elements.
    element.querySelectorAll('*').forEach((el) => {
      el.removeAttribute('onclick');
      el.removeAttribute('data-track');
      el.removeAttribute('data-analytics');
    });
  }
}
