/* eslint-disable no-console */
// eslint-disable-next-line import/no-named-as-default
import IndexUtils from '../../scripts/index-utils.js';

function formatSegment(segment) {
  return segment
    .split('-')
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ');
}

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

function extractConfig(block) {
  const propElements = block.querySelectorAll('[data-aue-prop]');
  if (propElements.length > 0) {
    const getTextVal = (name, defaultVal = '') => {
      const el = block.querySelector(`[data-aue-prop="${name}"]`);
      return el?.textContent?.trim() || defaultVal;
    };
    const getBoolVal = (name, defaultVal) => {
      const val = getTextVal(name, '').toLowerCase();
      if (val === 'true') return true;
      if (val === 'false') return false;
      return defaultVal;
    };

    return {
      auto: getBoolVal('auto', true),
      homeLabel: getTextVal('homeLabel', 'Home'),
      title: getTextVal('title', 'Breadcrumb'),
      anchorId: getTextVal('anchorId'),
    };
  }

  const rows = [...block.querySelectorAll(':scope > div')];
  const cells = rows.flatMap((row) => [...row.querySelectorAll(':scope > div')]);

  const getText = (idx) => cells[idx]?.textContent?.trim() || '';
  const getBool = (idx, defaultVal) => {
    const val = getText(idx).toLowerCase();
    if (val === 'true') return true;
    if (val === 'false') return false;
    return defaultVal;
  };

  return {
    auto: getBool(0, true),
    homeLabel: getText(1) || 'Home',
    title: getText(2) || 'Breadcrumb',
    anchorId: getText(3),
  };
}

function extractManualCrumbs(block) {
  const rows = [...block.querySelectorAll(':scope > div')];
  return rows.reduce((crumbs, row) => {
    const labelEl = row.querySelector('[data-aue-prop="label"]');
    const hrefEl = row.querySelector('[data-aue-prop="href"]');

    if (labelEl) {
      const label = labelEl.textContent?.trim();
      const href = hrefEl?.querySelector('a')?.getAttribute('href')
        || hrefEl?.textContent?.trim()
        || '';
      if (label) crumbs.push({ label, href });
    } else {
      const divs = row.querySelectorAll(':scope > div');
      if (divs.length >= 2) {
        const label = divs[0]?.textContent?.trim();
        const href = divs[1]?.querySelector('a')?.getAttribute('href')
          || divs[1]?.textContent?.trim()
          || '';
        if (label) crumbs.push({ label, href });
      }
    }
    return crumbs;
  }, []);
}

function buildManualNav(config, crumbs) {
  const currentPath = window.location.pathname
    .replace(/^\/content/, '')
    .replace(/\.html$/, '');

  const nav = document.createElement('nav');
  nav.className = 'breadcrumb-nav';
  nav.setAttribute('aria-label', config.title);

  const ol = document.createElement('ol');
  crumbs.forEach((crumb) => {
    const li = document.createElement('li');
    const hrefClean = (crumb.href || '').replace(/\.html$/, '');
    const isActive = hrefClean && (hrefClean === currentPath);

    if (isActive) {
      li.textContent = crumb.label;
      li.setAttribute('aria-current', 'page');
    } else if (crumb.href) {
      const a = document.createElement('a');
      a.href = crumb.href;
      a.textContent = crumb.label;
      li.append(a);
    } else {
      li.textContent = crumb.label;
    }
    ol.append(li);
  });

  nav.append(ol);
  return nav;
}

export async function buildBreadcrumbTrail(config, indexData) {
  const { homeLabel } = config;

  const currentPath = window.location.pathname
    .replace(/^\/content/, '')
    .replace(/\.html$/, '');

  const segments = currentPath.split('/').filter(Boolean);
  if (segments.length <= 1) return null;

  const nav = document.createElement('nav');
  nav.className = 'breadcrumb-nav';
  nav.setAttribute('aria-label', config.title);

  const ol = document.createElement('ol');

  for (let i = 0; i < segments.length; i += 1) {
    const itemPath = `/${segments.slice(0, i + 1).join('/')}`;
    const li = document.createElement('li');
    const matchedItem = Object.values(indexData).find((item) => item.path === itemPath);
    const isLast = i === segments.length - 1;

    const title = formatSegment(matchedItem?.navtitle || segments[i]);

    if (isLast) {
      li.textContent = title;
      li.setAttribute('aria-current', 'page');
    } else {
      const a = document.createElement('a');
      a.href = itemPath;
      a.textContent = title;
      li.append(a);
    }

    if (i === 0 && homeLabel) {
      const firstChild = li.querySelector('a') || li;
      firstChild.textContent = homeLabel;
    }

    ol.append(li);
  }

  nav.append(ol);
  return nav;
}

export default async function decorate(block) {
  const config = extractConfig(block);
  const manualCrumbs = !config.auto ? extractManualCrumbs(block) : [];

  if (config.anchorId) block.id = config.anchorId;
  block.textContent = '';

  let breadcrumbNav;

  if (config.auto) {
    const indexData = await IndexUtils.getIndexData(true);
    breadcrumbNav = await buildBreadcrumbTrail(config, indexData);
  } else if (manualCrumbs.length > 0) {
    breadcrumbNav = buildManualNav(config, manualCrumbs);
  }

  if (breadcrumbNav) {
    const lastItem = breadcrumbNav.querySelector('ol li:last-child');
    const currentTitle = lastItem?.textContent?.trim() || '';

    const dropBtn = document.createElement('button');
    dropBtn.className = 'breadcrumb-drop-title';
    dropBtn.setAttribute('aria-label', `${currentTitle}, Breadcrumb`);
    dropBtn.setAttribute('aria-expanded', 'false');
    dropBtn.textContent = currentTitle;

    dropBtn.addEventListener('click', () => {
      const isOpen = block.classList.toggle('open-breadcrumb');
      dropBtn.setAttribute('aria-expanded', String(isOpen));
    });

    block.append(dropBtn);
    block.append(breadcrumbNav);

    appendJsonLd(breadcrumbNav.querySelector('ol'));
  }
}
