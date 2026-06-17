/* eslint-disable */
/* global WebImporter */

/**
 * Site-wide cleanup transformer for LINZESS DTC pages.
 *
 * The live AEM Platform C DOM is heavily polluted with hidden modals,
 * Brightcove video-player chrome, OneTrust cookie UI, and duplicate ISI
 * widgets. The real editorial content lives entirely inside
 * `.abbv-content-container`, whose meaningful direct children are:
 *   - the hero <section> (.image-text-v2 .hero-container)
 *   - the main content + inline ISI block (.abbv-inline-use-isi)
 *
 * Everything else (save bar, footer nav, dimmer, back-to-top, and ALL
 * sibling modals/scripts/styles outside the content container) is removed.
 * Runs in the beforeTransform hook so parsers see a clean tree.
 */
export default function transform(hookName, element, payload) {
  if (hookName !== 'beforeTransform') return;
  const { document } = payload;

  const cc = element.querySelector('.abbv-content-container');
  if (cc) {
    // Keep ONLY the hero section and the inline-use-isi content block.
    [...cc.children].forEach((child) => {
      const keep = child.tagName === 'SECTION'
        || child.classList.contains('abbv-inline-use-isi')
        || child.querySelector('.abbv-inline-use-isi, .hero-container, .abbv-image-text-v2');
      if (!keep) child.remove();
    });
    // Within what remains, drop chrome that survives nested. NOTE: we keep
    // `.vjs-poster` so the embed parser can extract the Brightcove poster
    // image; everything else from the video-js player chrome is removed.
    cc.querySelectorAll(
      '.abbv-dimmer, .abbv-back-to-top, .abbv-save-bar, .abbv-savings-bar, '
      + '.abbv-modal, .linzess-modal-bkg, .vjs-control-bar, .vjs-menu, '
      + '.vjs-modal-dialog, .vjs-text-track-display, .vjs-loading-spinner, '
      + '.vjs-big-play-button, .vjs-dock-shelf, video, .grecaptcha-badge',
    ).forEach((el) => el.remove());
  }

  // Gut Check page: the adaptive form embeds hidden config/analytics panels
  // (Campaign Id, MVA taxonomy, "Please provide appropriate value…", hidden
  // textinputs) that must NOT leak into the static content. Remove any
  // adaptive-form node that is display:none, plus the known analytics/config
  // panels regardless of display.
  element.querySelectorAll(
    '.checkboxCampaignQuestionPanel, [class*="CampaignQuestionPanel"], '
    + '.cmp-adaptiveform-textinput, .cmp-adaptiveform-numberinput, '
    + '.cmp-adaptiveform-emailinput, .cmp-adaptiveform-telephoneinput, '
    + '.cmp-adaptiveform-recaptcha, .cmp-adaptiveform-button',
  ).forEach((el) => {
    // Keep the two visible email fields (Email Address / Confirm); drop the
    // hidden config/campaign/analytics inputs.
    const txt = (el.textContent || '').trim();
    const isVisibleEmail = /Email Address/i.test(txt) && !/Campaign|Question Id|SourceId|opt in|opt-in/i.test(txt);
    if (!isVisibleEmail) el.remove();
  });
  // Drop analytics spec text panels.
  element.querySelectorAll('.cmp-adaptiveform-text').forEach((el) => {
    if (/Analytics|MVA|Campaign|Form Name:|Form Category:|appropriate value/i.test(el.textContent || '')) {
      el.remove();
    }
  });

  // Remove page-level chrome and non-content nodes anywhere in the tree.
  element.querySelectorAll(
    'header, footer, nav, noscript, script, style, iframe, svg, '
    + '.abbv-header, .abbv-footer, .abbv-utility-nav, .abbv-save-bar, '
    + '.abbv-modal, .linzess-modal-bkg, #onetrust-consent-sdk, '
    + '[id^="ot-"], [aria-label="Cookie banner"], .onetrust-pc-dark-filter, '
    + '.abbv-floating-isi, .abbv-floating-isi-v2, .abbv-safety-bar, '
    + '.abbv-skip-link, .abbv-skip-to-main-content',
  ).forEach((el) => el.remove());
}
