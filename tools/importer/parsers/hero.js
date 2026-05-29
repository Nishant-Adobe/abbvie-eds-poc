export default function parse(element, { document }) {
  const picture = element.querySelector('picture') || element.querySelector('img');
  const h1 = element.querySelector('h1');
  const eyebrowEl = element.querySelector('p.tl-m, .abbv-image-text-content-v2 p:first-of-type');
  const bodyP = h1 ? h1.nextElementSibling : null;
  const ctaLink = element.querySelector('a[href]');

  // Output as default content (no block table) — the hero block JS
  // will pick up structure from the section via extractRows()
  const container = document.createElement('div');

  if (picture) container.appendChild(picture.cloneNode(true));
  if (eyebrowEl) container.appendChild(eyebrowEl.cloneNode(true));
  if (h1) container.appendChild(h1.cloneNode(true));
  if (bodyP && bodyP.tagName === 'P') container.appendChild(bodyP.cloneNode(true));
  if (ctaLink) {
    const p = document.createElement('p');
    p.appendChild(ctaLink.cloneNode(true));
    container.appendChild(p);
  }

  element.replaceWith(container);
}
