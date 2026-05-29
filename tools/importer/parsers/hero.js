export default function parse(element, { document }) {
  const picture = element.querySelector('picture') || element.querySelector('img');
  const h1 = element.querySelector('h1');
  const eyebrowEl = element.querySelector('p.tl-m, .abbv-image-text-content-v2 p:first-of-type');
  const ctaLink = element.querySelector('a[href]');

  const textDiv = document.createElement('div');
  if (eyebrowEl) textDiv.appendChild(eyebrowEl.cloneNode(true));
  if (h1) textDiv.appendChild(h1.cloneNode(true));
  const bodyP = h1 ? h1.nextElementSibling : null;
  if (bodyP && bodyP.tagName === 'P') textDiv.appendChild(bodyP.cloneNode(true));
  if (ctaLink) {
    const p = document.createElement('p');
    p.appendChild(ctaLink.cloneNode(true));
    textDiv.appendChild(p);
  }

  const cells = [
    ['Hero'],
    [picture ? picture.cloneNode(true) : ''],
    [textDiv],
  ];

  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
