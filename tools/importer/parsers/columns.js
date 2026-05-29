export default function parse(element, { document }) {
  const items = element.querySelectorAll('.abbv-flex-item-v2, .abbv-col');
  const cells = [['Columns']];

  if (items.length > 0) {
    const row = [];
    items.forEach((item) => {
      const col = document.createElement('div');
      const img = item.querySelector('picture') || item.querySelector('img');
      const headingEl = item.querySelector('.heading-2, h2, h3');
      const headingText = headingEl ? headingEl.textContent.trim()
        : (item.querySelector('p strong') ? item.querySelector('p strong').textContent.trim() : '');
      const bodyPs = item.querySelectorAll('p:not(.heading-2)');
      const cta = item.querySelector('a[href]');

      if (img) col.appendChild(img.cloneNode(true));
      if (headingText) {
        const p = document.createElement('p');
        const strong = document.createElement('strong');
        strong.textContent = headingText;
        p.appendChild(strong);
        col.appendChild(p);
      }
      bodyPs.forEach((bp) => {
        if (!bp.querySelector('strong') || bp.querySelector('strong').textContent.trim() !== headingText) {
          col.appendChild(bp.cloneNode(true));
        }
      });
      if (cta) {
        const p = document.createElement('p');
        p.appendChild(cta.cloneNode(true));
        col.appendChild(p);
      }
      row.push(col);
    });
    cells.push(row);
  } else {
    const img = element.querySelector('picture') || element.querySelector('img');
    const textContent = document.createElement('div');
    const allPs = element.querySelectorAll('p');
    const cta = element.querySelector('a[href]');
    allPs.forEach((p) => textContent.appendChild(p.cloneNode(true)));
    if (cta && !textContent.querySelector('a')) {
      const p = document.createElement('p');
      p.appendChild(cta.cloneNode(true));
      textContent.appendChild(p);
    }
    const row = [];
    if (img) row.push(img.cloneNode(true));
    row.push(textContent);
    cells.push(row);
  }

  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
