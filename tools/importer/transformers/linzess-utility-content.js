/* eslint-disable */

/**
 * Extracts the authorable main-content for Linzess utility pages (sitemap,
 * reminder-terms-conditions, legal pages). These pages are simple default-content
 * documents: a heading plus paragraphs/links. We isolate <main>, drop the ISI
 * region (added separately via fragment/section), and tag the section style.
 */
export default function transform(hookName, element, payload) {
  if (hookName !== 'beforeTransform') return;

  const { document } = payload;

  // NOTE: these Linzess pages have NO <main> element — the "main" in the a11y
  // tree is an inferred role on a div. So we remove non-authorable regions by
  // their real AEM Platform C class names instead of isolating <main>.

  // "Save on Linzess" eyebrow / brand-explorer chrome bar at the very top.
  element.querySelectorAll('.abbv-browser-chrome, .abbv-brand-explorer, .abbv-top-banner').forEach((el) => el.remove());

  // The eyebrow can also render as a bare <p> with the savings-and-support link
  // + the 1-855 phone tel: link (no chrome class). Remove that paragraph too.
  element.querySelectorAll('p').forEach((p) => {
    if (p.querySelector('a[href*="savings-and-support"]') && p.querySelector('a[href^="tel:"]')) {
      p.remove();
    }
  });

  // Inline ISI / Important Safety Information — utility pages surface ISI via
  // the safety-bar/fragment, not inline duplicated copy.
  element.querySelectorAll('.abbv-inline-use-isi, .abbv-inline-use, .linzess-isi-iri, [class*="inline-use-isi"]').forEach((el) => el.remove());
}
