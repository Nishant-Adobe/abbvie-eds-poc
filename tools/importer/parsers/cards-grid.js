export default function parse(element, { document }) {
  const cards = Array.from(element.querySelectorAll('.abbv-flex-item-v2'))
    .filter((c) => c.querySelector('.font-size-xl'));

  // Output as default content to avoid md2jcr model validation
  const container = document.createElement('div');

  cards.forEach((card) => {
    const statEl = card.querySelector('.font-size-xl');
    const statParent = statEl ? statEl.closest('p') || statEl.parentElement : null;
    const allPs = card.querySelectorAll('p');
    const descP = allPs.length > 1 ? allPs[allPs.length - 1] : null;

    if (statParent) {
      const p = document.createElement('p');
      const strong = document.createElement('strong');
      strong.textContent = statParent.textContent.trim();
      p.appendChild(strong);
      container.appendChild(p);
    }
    if (descP && descP !== statParent) {
      container.appendChild(descP.cloneNode(true));
    }
  });

  element.replaceWith(container);
}
