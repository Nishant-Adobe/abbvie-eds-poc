export default function parse(element, { document }) {
  const cards = Array.from(element.querySelectorAll('.abbv-flex-item-v2'))
    .filter((c) => c.querySelector('.font-size-xl'));
  const cells = [['Cards Grid']];

  cards.forEach((card) => {
    const statEl = card.querySelector('.font-size-xl');
    const statParent = statEl ? statEl.closest('p') || statEl.parentElement : null;
    const allPs = card.querySelectorAll('p');
    const descP = allPs.length > 1 ? allPs[allPs.length - 1] : null;

    const content = document.createElement('div');
    if (statParent) {
      const p = document.createElement('p');
      const strong = document.createElement('strong');
      strong.textContent = statParent.textContent.trim();
      p.appendChild(strong);
      content.appendChild(p);
    }
    if (descP && descP !== statParent) {
      content.appendChild(descP.cloneNode(true));
    }
    cells.push([content]);
  });

  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
