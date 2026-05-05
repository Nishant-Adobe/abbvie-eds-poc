export default function decorate(block) {
  const wrappers = [...block.querySelectorAll('div[data-aue-component="grid-card"]')];
  wrappers.forEach((wrapper) => {
    const card = document.createElement('a');
    card.className = 'grid-card';
    const sourceLink = wrapper.querySelector('a[href]');
    if (sourceLink) {
      card.href = sourceLink.getAttribute('href') || '#';
      card.target = sourceLink.getAttribute('target') || '_self';
      const title = sourceLink.getAttribute('title');
      if (title) card.title = title;
      const aria = sourceLink.getAttribute('aria-label');
      if (aria) card.setAttribute('aria-label', aria);
      const rel = sourceLink.getAttribute('rel');
      if (rel) card.rel = rel;
    } else {
      card.href = '#';
      card.target = '_self';
    }
    while (wrapper.firstChild) {
      card.append(wrapper.firstChild);
    }
    const dupLink = card.firstElementChild?.querySelector('a[href]');
    if (dupLink && dupLink.getAttribute('href') === card.getAttribute('href')) {
      const host = dupLink.parentElement;
      if (host) {
        while (dupLink.firstChild) host.insertBefore(dupLink.firstChild, dupLink);
        dupLink.remove();
      }
    }
    wrapper.replaceWith(card);
  });
}
