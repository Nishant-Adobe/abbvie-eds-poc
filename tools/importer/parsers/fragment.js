export default function parse(element, { document }) {
  const link = document.createElement('a');
  link.href = '/linzess/fragments/safety-bar';
  link.textContent = '/linzess/fragments/safety-bar';

  const cells = [
    ['Fragment'],
    [link],
  ];

  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
