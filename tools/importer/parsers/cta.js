/* global WebImporter */
export default function parse(element, { document }) {
  const heading = element.querySelector('.heading-2, h2, h3, p.heading-2');
  const ctaLink = element.querySelector('a[href]');

  const cells = [
    ['CTA'],
    [heading ? heading.textContent.trim() : ''],
    [ctaLink ? ctaLink.cloneNode(true) : ''],
  ];

  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
