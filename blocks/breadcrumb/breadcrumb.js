function appendJsonLd(ol) {
  const items = [...ol.querySelectorAll('li')];
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((li, idx) => {
      const a = li.querySelector('a');
      const entry = {
        '@type': 'ListItem',
        position: idx + 1,
        name: li.textContent.trim(),
      };
      if (a) {
        entry.item = new URL(a.getAttribute('href'), window.location.origin).href;
      }
      return entry;
    }),
  };
  const script = document.createElement('script');
  script.type = 'application/ld+json';
  script.textContent = JSON.stringify(jsonLd);
  document.head.append(script);
}

function extractItems(block) {
  const rows = [...block.querySelectorAll(':scope > div')];
  return rows.reduce((items, row) => {
    const labelEl = row.querySelector('[data-aue-prop="label"]');
    const hrefEl = row.querySelector('[data-aue-prop="href"]');

    if (labelEl) {
      const label = labelEl.textContent?.trim() || '';
      const href = hrefEl?.querySelector('a')?.getAttribute('href')
        || hrefEl?.textContent?.trim()
        || '';
      if (label) items.push({ label, href });
    } else {
      const divs = row.querySelectorAll(':scope > div');
      if (divs.length >= 2) {
        const label = divs[0]?.textContent?.trim() || '';
        const href = divs[1]?.querySelector('a')?.getAttribute('href')
          || divs[1]?.textContent?.trim()
          || '';
        if (label) items.push({ label, href });
      }
    }
    return items;
  }, []);
}

function getAriaLabel(block) {
  const titleEl = block.querySelector('[data-aue-prop="title"]');
  return titleEl?.textContent?.trim() || 'Breadcrumb';
}

function getAnchorId(block) {
  const el = block.querySelector('[data-aue-prop="anchorId"]');
  return el?.textContent?.trim() || '';
}

export default async function decorate(block) {
  const ariaLabel = getAriaLabel(block);
  const anchorId = getAnchorId(block);
  const items = extractItems(block);

  const rows = [...block.querySelectorAll(':scope > div')];
  rows.forEach((row) => { row.classList.add('breadcrumb-hidden'); });

  if (anchorId) block.id = anchorId;
  if (!items.length) return;

  const currentPath = window.location.pathname
    .replace(/^\/content/, '')
    .replace(/\.html$/, '');

  const nav = document.createElement('nav');
  nav.className = 'breadcrumb-nav';
  nav.setAttribute('aria-label', ariaLabel);

  const ol = document.createElement('ol');
  items.forEach(({ label, href }) => {
    const li = document.createElement('li');
    const hrefClean = (href || '').replace(/\.html$/, '');
    const isActive = hrefClean && hrefClean === currentPath;

    if (isActive) {
      li.textContent = label;
      li.setAttribute('aria-current', 'page');
    } else if (href) {
      const a = document.createElement('a');
      a.href = href;
      a.textContent = label;
      li.append(a);
    } else {
      li.textContent = label;
    }
    ol.append(li);
  });

  nav.append(ol);
  block.append(nav);
  appendJsonLd(ol);
}
