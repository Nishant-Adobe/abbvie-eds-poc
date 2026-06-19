/* eslint-disable */
/* global WebImporter */

/**
 * Transformer: linzess section breaks + section metadata.
 *
 * Maps each live content band to its EDS section and inserts a Section
 * Metadata block (style) plus an <hr> divider between sections, matching the
 * already-migrated sibling page
 * content/linzess/healthy-routines/otc-and-prescription-treatments.plain.html
 * (hero-container / *-section / isi styles, with `---` breaks between bands).
 *
 * Runs in afterTransform only. Section anchors are resolved from durable
 * `.abbv-container.*` classes (and the inline ISI / hero containers) — these
 * survive the cleanup transformer's unwrapping of the .abbv-content /
 * .abbv-content-container / <section> shell. All selectors are taken from the
 * captured DOM in migration-work/cleaned.html:
 *   hero          div.hero-container                      (cleaned.html:237)
 *   touchpoints   div.abbv-container.linzess-keep-touch-doctor.background-white (cleaned.html:264)
 *   relief        div.abbv-container.background-dark-purple.keep-in-touch-doctor (cleaned.html:363)
 *   conversation  div.abbv-container.background-light-purple             (cleaned.html:434)
 *   more-like-this div.abbv-container.background-white (5th container)   (cleaned.html:460)
 *   cta-cards     div.abbv-container.bottom-nav                          (cleaned.html:548)
 *   isi           div.abbv-inline-use-isi                                (cleaned.html:580)
 *
 * Section style mapping (live band -> EDS section-metadata style):
 *   white touchpoints band       -> kit-touchpoints-section
 *   dark-purple relief band       -> kit-relief-section
 *   light-purple conversation band-> kit-conversation-section
 *   more-like-this white band     -> more-like-this-section
 *   cta band                      -> cta-cards-section
 *   inline ISI                    -> isi
 *   hero                          -> hero-container (kept, not a *-section style)
 */

const TransformHook = {
  beforeTransform: 'beforeTransform',
  afterTransform: 'afterTransform',
};

/**
 * Ordered anchor selectors per template section id. The first matching element
 * is treated as the top of that section's band. Order MUST match the template
 * `sections` order so divider/metadata placement is correct.
 */
const SECTION_ANCHORS = {
  hero: '.hero-container, div.image-text-v2.parbase',
  touchpoints: '.abbv-container.linzess-keep-touch-doctor.background-white',
  relief: '.abbv-container.background-dark-purple.keep-in-touch-doctor',
  conversation: '.abbv-container.background-light-purple',
  'more-like-this': '.abbv-container.background-white.background-white-arc',
  'cta-cards': '.abbv-container.bottom-nav',
  isi: '.abbv-inline-use-isi',
};

/**
 * Find the top-level band element for a section. We resolve the matching
 * element, then climb to its highest ancestor that is still a direct child of
 * `root` so the section-metadata block and <hr> are inserted at the correct
 * top-level position.
 */
function findBandTop(root, selector) {
  const match = root.querySelector(selector);
  if (!match) return null;
  let node = match;
  while (node.parentElement && node.parentElement !== root) {
    node = node.parentElement;
  }
  return node.parentElement === root ? node : match;
}

export default function transform(hookName, element, payload) {
  if (hookName !== TransformHook.afterTransform) return;

  const document = element.ownerDocument;
  const sections = (payload && payload.template && payload.template.sections) || [];
  if (sections.length < 2) return;

  // Process in reverse so inserting metadata/dividers does not shift the
  // positions of sections we have not handled yet.
  for (let i = sections.length - 1; i >= 0; i -= 1) {
    const section = sections[i];
    const selector = SECTION_ANCHORS[section.id];
    if (!selector) continue;

    const band = findBandTop(element, selector);
    if (!band) continue;

    // Section Metadata block (only when the section defines a style).
    if (section.style) {
      const metadata = WebImporter.Blocks.createBlock(document, {
        name: 'Section Metadata',
        cells: { style: section.style },
      });
      band.insertAdjacentElement('afterend', metadata);
    }

    // Section divider before every section except the first.
    if (i > 0) {
      const hr = document.createElement('hr');
      band.insertAdjacentElement('beforebegin', hr);
    }
  }
}
