/* eslint-disable */
/* global WebImporter */

/**
 * Transformer: Linzess section breaks and section-metadata insertion.
 * Uses payload.template.sections from page-templates.json to identify section boundaries
 * and insert <hr> breaks and Section Metadata blocks with style properties.
 * All selectors validated against migration-work/cleaned.html for https://www.linzess.com/find-relief
 *
 * Sections:
 *   1. hero - .hero-container.abbv-image-text-v2 (line 237) - no style
 *   2. section-nav - .section-navigation.parbase (line 262) - no style
 *   3. talk-to-a-doctor - #talktoadoctor / .abbv-container.background-white.background-white-arc (lines 288-290) - style: find-relief-checklist
 *   4. how-to-take - #howtotake / .abbv-container.background-off-white (lines 818-820) - style: find-relief-off-white
 *   5. bottom-cta - .abbv-container.background-dark-purple.bottom-nav (line 1732) - style: find-relief-dark-purple
 *   6. isi - .abbv-inline-use-isi (line 1764) - no style
 */
const TransformHook = { beforeTransform: 'beforeTransform', afterTransform: 'afterTransform' };

/**
 * Find the first element matching a section's selector(s).
 * Selectors can be a string or an array of strings (tried in order).
 */
function findSectionElement(element, selector) {
  const selectors = Array.isArray(selector) ? selector : [selector];
  for (const sel of selectors) {
    const el = element.querySelector(sel);
    if (el) return el;
  }
  return null;
}

export default function transform(hookName, element, payload) {
  if (hookName === TransformHook.afterTransform) {
    const { template } = payload;
    if (!template || !template.sections || template.sections.length < 2) return;

    const doc = element.ownerDocument || document;

    const sections = template.sections;

    // Process sections in reverse order to preserve DOM positions
    for (let i = sections.length - 1; i >= 0; i--) {
      const section = sections[i];
      const sectionEl = findSectionElement(element, section.selector);

      if (!sectionEl) continue;

      // Insert Section Metadata block after section element if style is defined
      if (section.style) {
        const sectionMetadata = WebImporter.Blocks.createBlock(doc, {
          name: 'Section Metadata',
          cells: { style: section.style },
        });
        sectionEl.after(sectionMetadata);
      }

      // Insert <hr> before section element for all non-first sections
      if (i > 0) {
        const hr = doc.createElement('hr');
        sectionEl.before(hr);
      }
    }
  }
}
