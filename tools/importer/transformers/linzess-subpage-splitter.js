/* eslint-disable */
/* global WebImporter */

/**
 * Transformer: Linzess subpage splitter.
 * When importing a subpage template (e.g., find-relief-talk-to-a-doctor),
 * removes DOM sections not belonging to that subpage from the single long
 * /find-relief page.
 *
 * Runs in beforeTransform phase (after cleanup, before sections/parsers).
 *
 * Subpage logic:
 *   - find-relief-talk-to-a-doctor: keep hero, section-nav, #talktoadoctor container, bottom-cta, ISI
 *   - find-relief-how-to-take-linzess: keep hero, section-nav, #howtotake container, bottom-cta, ISI
 *
 * Also updates the hero H1 text to reflect the subpage title.
 */
const TransformHook = { beforeTransform: 'beforeTransform', afterTransform: 'afterTransform' };

const SUBPAGE_CONFIG = {
  'find-relief-talk-to-a-doctor': {
    keepAnchor: 'talktoadoctor',
    removeAnchor: 'howtotake',
    heroTitle: 'Talk to a Doctor',
  },
  'find-relief-how-to-take-linzess': {
    keepAnchor: 'howtotake',
    removeAnchor: 'talktoadoctor',
    heroTitle: 'How to Take LINZESS',
  },
};

export default function transform(hookName, element, payload) {
  if (hookName !== TransformHook.beforeTransform) return;

  const { template } = payload;
  if (!template) return;

  const config = SUBPAGE_CONFIG[template.name];
  if (!config) return;

  // Find the section container to REMOVE
  const removeAnchor = element.querySelector(`a[id="${config.removeAnchor}"]`);
  if (removeAnchor) {
    // The anchor's parent .container.parbase holds the entire section
    const containerToRemove = removeAnchor.closest('.container.parbase');
    if (containerToRemove) {
      containerToRemove.remove();
    }
  }

  // Update hero H1 text for subpage context
  const heroContainer = element.querySelector('.hero-container.abbv-image-text-v2');
  if (heroContainer) {
    const h1 = heroContainer.querySelector('h1');
    if (h1) {
      h1.textContent = config.heroTitle;
    }
  }
}
