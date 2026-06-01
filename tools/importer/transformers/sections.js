/* global WebImporter */
export default function transform(hookName, element, payload) {
  if (hookName === 'afterTransform') {
    const { document } = payload;
    const main = document.querySelector('[role="main"]') || document.body;

    // Map dark purple background sections to style: dark
    document.querySelectorAll('.background-dark-purple, .abbv-container.background-dark-purple').forEach((el) => {
      el.setAttribute('data-section-style', 'dark');
    });

    // Add Safety Bar block at the end with verbatim ISI content
    // Model: collapsedContent, collapsedContentCol2, expandedContent
    const isiRegion = document.querySelector('[aria-label="Important Safety Information"]');
    if (isiRegion) {
      const useSection = isiRegion.querySelector('.abbv-inline-use, [id="abbv_use_statement"] + div');
      const safetySection = isiRegion.querySelector('.abbv-inline-safety, [id="abbv_safety_information"] + div');

      const collapsedDiv = document.createElement('div');
      if (useSection) {
        collapsedDiv.innerHTML = useSection.innerHTML;
      }

      const expandedDiv = document.createElement('div');
      if (safetySection) {
        expandedDiv.innerHTML = safetySection.innerHTML;
      }

      const safetyCells = [
        ['Safety Bar'],
        [collapsedDiv],
        [''],
        [expandedDiv],
      ];
      const safetyTable = WebImporter.DOMUtils.createTable(safetyCells, document);

      const hr = document.createElement('hr');
      main.appendChild(hr);
      main.appendChild(safetyTable);

      // Remove the inline ISI from the body since we moved it to the block
      isiRegion.remove();
    }
  }
}
