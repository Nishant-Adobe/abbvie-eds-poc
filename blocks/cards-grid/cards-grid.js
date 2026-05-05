function createWrapperATag(wrapper) {
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
  const innerLink = card.firstElementChild?.querySelector('a[href]');
  if (innerLink) {
    const host = innerLink.parentElement;
    if (host) {
      while (innerLink.firstChild) host.insertBefore(innerLink.firstChild, innerLink);
      innerLink.remove();
    }
  }
  const linkColumn = card.firstElementChild;
  if (linkColumn?.tagName === 'P') {
    while (linkColumn.firstChild) card.insertBefore(linkColumn.firstChild, linkColumn);
    linkColumn.remove();
  } else if (linkColumn) {
    const linkPara = linkColumn.querySelector(':scope > p');
    if (linkPara) {
      while (linkPara.firstChild) linkColumn.insertBefore(linkPara.firstChild, linkPara);
      linkPara.remove();
    }
  }
  return card;
}

export default function decorate(block) {
  const wrappers = [...block.querySelectorAll('div[data-aue-component="grid-card"]')];
  wrappers.forEach((wrapper) => {
    const card = createWrapperATag(wrapper);
    wrapper.replaceWith(card);
  });
}
