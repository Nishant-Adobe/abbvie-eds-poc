/* eslint-disable */
/* global WebImporter */

/**
 * Transformer: Linzess site-wide cleanup.
 * Removes non-authorable content (header, footer, modals, safety bar, banners, tracking).
 * All selectors validated against migration-work/cleaned.html for https://www.linzess.com/find-relief
 */
const TransformHook = { beforeTransform: 'beforeTransform', afterTransform: 'afterTransform' };

export default function transform(hookName, element, payload) {
  if (hookName === TransformHook.beforeTransform) {
    // Remove modals that overlay content and could interfere with block parsing
    // Found in cleaned.html: <div class="abbv-modal hcpwol ..."> (lines 2046, 2095, 2228, etc.)
    WebImporter.DOMUtils.remove(element, [
      '.abbv-modal',
    ]);
  }

  if (hookName === TransformHook.afterTransform) {
    // Remove non-authorable site chrome and global elements
    // header.abbv-header-v2 (line 20) - site header with navigation
    // footer.abbv-footer (line 1849) - site footer
    // .linzess-top-banner (line 13) - top promotional banner
    // .header-v2.parbase (line 19) - header wrapper
    // .footer.parbase (line 1847) - footer wrapper
    // .safety-bar.parbase (line 3112) - floating safety bar component
    // .abbv-safety-bar (line 3114) - safety bar inner content
    // .abbv-skip-to-main-content (line 22) - skip nav link
    // .abbv-sticky-anchor (line 263) - sticky positioning anchor (empty div)
    WebImporter.DOMUtils.remove(element, [
      'header.abbv-header-v2',
      'footer.abbv-footer',
      '.linzess-top-banner',
      '.header-v2.parbase',
      '.footer.parbase',
      '.safety-bar.parbase',
      '.abbv-skip-to-main-content',
      '.abbv-sticky-anchor',
    ]);

    // Remove empty structural divs that are not authorable
    // .newpar.new.section (lines 3, 9, etc.) - AEM authoring placeholders
    // .par.iparys_inherited (lines 5, 11, etc.) - inherited paragraph containers
    WebImporter.DOMUtils.remove(element, [
      '.newpar.new.section',
      '.par.iparys_inherited',
    ]);

    // Remove non-content elements
    WebImporter.DOMUtils.remove(element, [
      'noscript',
      'link',
      'iframe',
    ]);
  }
}
