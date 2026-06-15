/* eslint-disable */
/* global WebImporter */

/**
 * Parser: tabs
 * Base block: tabs
 * Source: https://www.linzess.com/find-relief
 * Selector: .abbv-tabs
 * Generated: 2026-06-04
 *
 * The tabs block creates a tabbed interface where each tab item row contains
 * the tab title (tabTitle field). The actual tab panel content is imported as
 * separate sections with section-metadata "name" matching the tab title, which
 * the tabs.js decoration logic uses to associate panels with tab buttons.
 *
 * Source structure:
 *   .abbv-tabs
 *     .abbv-tabs-controls
 *       .abbv-tab-control > .abbv-tab-link > .abbv-tab-text (full label)
 *       .abbv-tab-control > .abbv-tab-link > .abbv-tab-text-sm (mobile label)
 *     .abbv-tabs-container
 *       .abbv-tab (panel content per tab)
 *
 * UE Model fields:
 *   tabs model: classes (select: Default or Pill)
 *   tab-item model: tabTitle (text, required)
 */
export default function parse(element, { document }) {
  // Extract tab titles from the tab controls
  // Use .abbv-tab-text (desktop/full label) - the primary text for each tab
  const tabControls = element.querySelectorAll('.abbv-tabs-controls .abbv-tab-control');

  const cells = [];

  tabControls.forEach((control) => {
    // Get the full tab title text from .abbv-tab-text (not the mobile-abbreviated .abbv-tab-text-sm)
    const tabTextEl = control.querySelector('.abbv-tab-text');
    if (tabTextEl) {
      // Replace <br> elements with spaces before extracting text to preserve word boundaries
      tabTextEl.querySelectorAll('br').forEach((br) => br.replaceWith(' '));
      // Clean the text content (collapse whitespace)
      const titleText = tabTextEl.textContent.trim().replace(/\s+/g, ' ');

      // Create a text node for the tab title
      // Field hint for xwalk UE model: tabTitle (text)
      const titleNode = document.createTextNode(titleText);
      cells.push([titleNode]); // <!-- field:tabTitle -->
    }
  });

  const block = WebImporter.Blocks.createBlock(document, { name: 'tabs', cells });
  element.replaceWith(block);
}
