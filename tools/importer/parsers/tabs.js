/* eslint-disable */
/* global WebImporter */

/**
 * Tabs parser — LINZESS "Instructions For Adults & Children" dosing tabs.
 *
 * Source instance: `.abbv-container.background-white.rounded-corners` holding
 * two tab labels (`.abbv-tab-text`: Adults / Pediatric) and two panels
 * (`.abbv-flex-container-v2.flexbox-column`), each a 4-step dosing list.
 *
 * The linzess tabs block matches tab labels to sibling SECTIONS that carry a
 * `tab-name` section-metadata row (see blocks/tabs/tabs.js getSectionIdentifier).
 * So this parser emits, in document order:
 *   1. a `tabs` block (one row per tab, cell = tabName)
 *   2. for each panel: <hr> + the panel heading + a `flexbox (column)` block
 *      + a `Section Metadata` table with `tab-name` = matching label
 *
 * Each flexbox row: [anchor(empty), image(picture), content(richtext), empty].
 */
function makePicture(document, img) {
  const cell = document.createElement('div');
  if (img) {
    const picture = document.createElement('picture');
    const newImg = document.createElement('img');
    newImg.setAttribute('src', img.getAttribute('src'));
    if (img.getAttribute('alt')) newImg.setAttribute('alt', img.getAttribute('alt'));
    picture.append(newImg);
    cell.append(picture);
  }
  return cell;
}

function panelHeading(document, panel) {
  // The "Take LINZESS" lead-in sits just before the flex container.
  const prev = panel.previousElementSibling;
  const heading = document.createElement('p');
  const text = prev && /take linzess/i.test(prev.textContent)
    ? prev.textContent.replace(/\s+/g, ' ').trim()
    : 'Take LINZESS';
  heading.textContent = text;
  return heading;
}

function flexboxTable(document, panel) {
  const steps = [...panel.querySelectorAll('.abbv-flex-item-v2')];
  const rows = [['Flexbox (column)'], ['']];
  steps.forEach((step) => {
    const img = step.querySelector('img');
    const contentSrc = step.querySelector('.abbv-image-text-content-container-v2, .abbv-stretched-card-body')
      || step;
    const content = document.createElement('div');
    [...contentSrc.querySelectorAll('p')].forEach((p) => content.append(p.cloneNode(true)));
    rows.push(['', makePicture(document, img), content, '']);
  });
  return WebImporter.DOMUtils.createTable(rows, document);
}

export default function parse(element, { document }) {
  const labels = [...new Set(
    [...element.querySelectorAll('.abbv-tab-text')].map((e) => e.textContent.replace(/\s+/g, ' ').trim()),
  )].filter(Boolean);
  const panels = [...element.querySelectorAll('.abbv-flex-container-v2.flexbox-column')];

  const frag = document.createDocumentFragment();

  // The dosing tabs live INSIDE the live off-white "How to Take" container.
  // The section transformer cannot split that container reliably (nested <hr>s
  // are dropped by html2md), so this fragment — which replaces the tabs
  // container and DOES survive as flat top-level sections — owns the off-white
  // section boundaries. Sequence emitted (matching the known-good page):
  //   [off-white meta + howtotake]  ← closes the How-to-Take section (content above)
  //   <hr> tabs [off-white meta]    ← the tabs section
  //   <hr> panel1 [tab-name] … panelN [tab-name]
  //   <hr> [off-white meta]         ← opens the Storage section (content below)
  const offWhiteMeta = (sectionId) => {
    const rows = sectionId
      ? [['Section Metadata (find-relief-off-white)'], ['sectionId', sectionId]]
      : [['Section Metadata (find-relief-off-white)']];
    return WebImporter.DOMUtils.createTable(rows, document);
  };

  // 0. Close the How-to-Take section that precedes the tabs.
  frag.append(offWhiteMeta('howtotake'));
  frag.append(document.createElement('hr'));

  // 1. Tabs block: one row per tab label, then close the tabs section.
  const tabRows = [['Tabs']];
  labels.forEach((label) => tabRows.push([label]));
  frag.append(WebImporter.DOMUtils.createTable(tabRows, document));
  frag.append(offWhiteMeta(null));

  // 2. One section per panel, tagged with its tab-name.
  panels.forEach((panel, i) => {
    frag.append(document.createElement('hr'));
    frag.append(panelHeading(document, panel));
    frag.append(flexboxTable(document, panel));
    const metaRows = [['Section Metadata'], ['tab-name', labels[i] || '']];
    frag.append(WebImporter.DOMUtils.createTable(metaRows, document));
  });

  // 3. Open the Storage section that follows the panels.
  frag.append(document.createElement('hr'));
  frag.append(offWhiteMeta(null));

  element.replaceWith(frag);
}
