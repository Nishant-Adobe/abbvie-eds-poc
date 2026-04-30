import { getMetadata } from '../../scripts/aem.js';
import { loadFragment } from '../fragment/fragment.js';
// eslint-disable-next-line import/no-named-as-default
import IndexUtils from '../../scripts/index-utils.js';
import { fetchDashboardCardData } from '../../scripts/cfUtil.js';
import decorateExternalLinksUtility from '../../scripts/utils.js';

// ─── Constants ───────────────────────────────────────────────────────────────

const DESKTOP_BREAKPOINT = '(min-width: 1024px)';
const SCROLL_THRESHOLD_DEFAULT = 200;

// Header layout variants mapped to modifier CSS classes
const VARIANT_CLASSES = {
  classic: [],
  lite: ['header-lite'],
  'fl-safety': ['header-lite', 'header-fl-safety'],
  slim: ['header-lite', 'header-slim'],
};

// ─── Shared state ────────────────────────────────────────────────────────────

let lastScrollTop = 0;
const navigationCache = new Map();
let scrollThrottleId = null;
const isDesktop = window.matchMedia(DESKTOP_BREAKPOINT);

// ─── Utilities ───────────────────────────────────────────────────────────────

function throttleRAF(callback) {
  if (scrollThrottleId) return;
  scrollThrottleId = requestAnimationFrame(() => {
    callback();
    scrollThrottleId = null;
  });
}

/* eslint-disable-next-line object-curly-newline */
function createElement(tag, { className, attributes = {}, textContent, innerHTML } = {}) {
  const el = document.createElement(tag);
  if (className) el.className = className;
  Object.entries(attributes).forEach(([key, value]) => el.setAttribute(key, value));
  if (textContent) el.textContent = textContent;
  if (innerHTML) el.innerHTML = innerHTML;
  return el;
}

/** Returns all direct child rows of a block as arrays of cells */
function parseBlockRows(block) {
  return [...block.children].map((row) => [...row.children]);
}

// ─── Scroll + sticky ─────────────────────────────────────────────────────────

function handleScroll() {
  throttleRAF(() => {
    const header = document.querySelector('header');
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    const heroBlock = document.querySelector('.hero.block');
    const threshold = heroBlock ? heroBlock.offsetHeight - 100 : SCROLL_THRESHOLD_DEFAULT;
    if (scrollTop > lastScrollTop && scrollTop > threshold) {
      header.classList.add('hide-nav');
      header.classList.remove('show-nav');
    } else {
      header.classList.add('show-nav');
      header.classList.remove('hide-nav');
    }
    lastScrollTop = Math.max(scrollTop, 0);
  });
}

function handleKeydown(e) {
  if (e.key !== 'Escape') return;
  const navSections = document.querySelector('.nav-sections');
  if (!navSections || navSections.getAttribute('aria-expanded') === 'false') return;
  toggleAllNavSections(false); // eslint-disable-line no-use-before-define
  document.getElementById('nav-backdrop')?.setAttribute('aria-hidden', 'true');
}

window.addEventListener('scroll', handleScroll);
document.addEventListener('keydown', handleKeydown);

// ─── Existing nav section helpers (backward-compatible) ───────────────────────

function toggleAllNavSections(expanded = false) {
  const nav = document.querySelector('nav');
  const isSearchOpen = [...(nav?.querySelectorAll('.nav-sections ul > li') || [])]
    .some((li) => li.getAttribute('aria-expanded') === 'true');
  if (nav && !isDesktop.matches && isSearchOpen) {
    nav.classList.remove('second-level-active');
  }
  document.querySelectorAll('.nav-item-level-0 .default-content-wrapper > ul > li').forEach((section) => {
    section.setAttribute('aria-expanded', expanded);
    section.querySelector('button')?.setAttribute('aria-expanded', expanded);
  });
}

function toggleMenu(nav, navSections, forceExpanded = null) {
  if (forceExpanded === null) {
    const isSearchOpen = nav.querySelector('.menu-search')?.getAttribute('aria-expanded') === 'true';
    const expanded = isSearchOpen || nav.getAttribute('aria-expanded') === 'true';
    const button = nav.querySelector('.nav-hamburger button');
    document.body.style.overflowY = (expanded || isDesktop.matches) ? '' : 'hidden';
    nav.setAttribute('aria-expanded', expanded ? 'false' : 'true');
    toggleAllNavSections(false);
    button.setAttribute('aria-label', expanded ? 'Open navigation' : 'Close navigation');
    const backdrop = document.getElementById('nav-backdrop');
    backdrop?.setAttribute('aria-hidden', expanded ? 'true' : 'false');
  }
}

function createSubmenuWrapper(label) {
  const slug = label.toLowerCase().replace(/\s+/g, '-');
  const submenu = createElement('div', {
    className: 'submenu-level-1',
    attributes: { id: `submenu-${slug}`, role: 'menu', 'data-label': label },
  });
  const closeWrapper = createElement('div', { className: 'close-btn-wrapper' });
  const closeBtn = createElement('button', {
    className: 'close-btn',
    attributes: { type: 'button' },
    textContent: 'CLOSE',
  });
  closeBtn.addEventListener('click', () => {
    toggleAllNavSections(false);
    document.getElementById('nav-backdrop')?.setAttribute('aria-hidden', 'true');
  });
  closeWrapper.appendChild(closeBtn);
  submenu.appendChild(closeWrapper);
  return { submenu, closeBtn };
}

async function getNavigationByPath(path) {
  if (navigationCache.has(path)) return navigationCache.get(path);
  try {
    const item = await IndexUtils.findIndexItem(path);
    navigationCache.set(path, item);
    return item;
  } catch {
    return { children: [] };
  }
}

function parseUl(ul) {
  const children = [];
  Array.from(ul.children).forEach((li) => {
    let textTitle = '';
    let link = '#';
    let subChildren = [];
    let hasP = false;
    Array.from(li.childNodes).forEach((node) => {
      if (node.tagName === 'P') { textTitle = node.textContent.trim(); hasP = true; }
      else if (node.tagName === 'UL') { subChildren = parseUl(node); }
    });
    if (!hasP) {
      const a = li.querySelector('a');
      if (a) { textTitle = a.textContent.trim() || a.getAttribute('title') || ''; link = a.getAttribute('href') || '#'; }
      else { textTitle = li.textContent.trim(); }
    }
    children.push({ title: textTitle, path: link, children: subChildren });
  });
  return children;
}

async function getSecondCardData(url) {
  if (!url) return false;
  try {
    const response = await fetchDashboardCardData(url, 'cfBaseUrl');
    return response?.data?.dashboardCardByPath?.item || { children: [] };
  } catch {
    return { children: [] };
  }
}

async function buildMegaMenu(block) {
  if (!block) return null;
  const innerDivs = block.querySelectorAll(':scope > div');
  if (innerDivs.length <= 1) return null;
  const allTags = Array.from(innerDivs).slice(1);
  const tagsValues = allTags.map((div) => {
    const ul = div.querySelector('ul');
    if (ul) return ul;
    const a = div.querySelector('a');
    if (a) return a;
    const p = div.querySelector('p');
    const heading = div.querySelector('h1, h2, h3, h4, h5, h6');
    if (heading && p) return { heading: heading.textContent.trim(), paragraph: p.textContent.trim() };
    if (heading) return heading.textContent.trim();
    if (p) return p.textContent.trim();
    return '';
  });
  const [
    megaMenuTitle, megaMenuDescription, megaMenuCta, megaMenuDashboardLinks,
    megaMenuCardTitle, megaMenuCardContent, megaMenuCardCta, megaMenuDashboardCard, dashboardCardType,
  ] = tagsValues;

  const primaryCardData = { title: megaMenuCardTitle, cardContent: megaMenuCardContent, link: megaMenuCardCta };
  const secondaryCardData = await getSecondCardData(megaMenuDashboardCard?.title);
  const dashboardLinks = megaMenuDashboardLinks?.querySelectorAll('li');
  const wrapper = document.createElement('div');
  wrapper.className = 'mega-menu-wrapper';

  const left = document.createElement('div');
  left.className = 'mega-menu-left';
  left.innerHTML = `
    <h4 class="mega-menu-title">${megaMenuTitle}</h4>
    <div class="mega-menu-description">${megaMenuDescription}</div>
    <p class="button-container">
      <a href="${megaMenuCta?.href || '#'}" class="button">${megaMenuCta?.textContent || ''}</a>
    </p>
  `;
  if (dashboardLinks) {
    const ul = document.createElement('ul');
    ul.className = 'dashboard-links';
    dashboardLinks.forEach((li) => {
      const link = li.querySelector('a');
      if (!link) return;
      const liClone = document.createElement('li');
      liClone.innerHTML = `<a href="${link.href}" class="dashboard-list-link" title="${link.title}">${link.textContent.trim()}</a>`;
      ul.appendChild(liClone);
    });
    left.appendChild(ul);
  }

  function createCard(data, cardType, isPrimary = false) {
    const cardWrapper = document.createElement('div');
    cardWrapper.className = `mega-menu-card ${isPrimary ? 'mega-card-primary' : 'mega-card-secondary'} ${cardType}`;
    const card = document.createElement('div');
    card.className = 'mega-card';
    const appendIfExists = (parent, tag, classType, content) => {
      if (content) parent.appendChild(createElement(tag, { className: classType, textContent: content }));
    };
    if (isPrimary) {
      appendIfExists(card, 'p', 'mega-card-title', data?.title);
      if (data?.cardContent?.heading || data?.cardContent?.paragraph) {
        const content = createElement('div', { className: 'mega-card-content' });
        appendIfExists(content, 'h4', 'mega-card-heading', data.cardContent.heading);
        appendIfExists(content, 'p', 'card-description', data.cardContent.paragraph);
        card.appendChild(content);
      } else {
        const contentP = createElement('div', { className: 'mega-card-content' });
        appendIfExists(contentP, 'h4', 'mega-card-heading', data.cardContent);
        card.appendChild(contentP);
      }
      if (data?.link?.textContent) {
        const btnWrap = createElement('p', { className: 'button-container' });
        btnWrap.appendChild(createElement('span', { className: 'card-cta', textContent: data.link.textContent }));
        card.appendChild(btnWrap);
      }
      const container = data?.link ? (() => {
        const anchor = createElement('a', { className: 'card-link' });
        anchor.href = data.link.href;
        return anchor;
      })() : cardWrapper;
      container.appendChild(card);
      if (data?.link) cardWrapper.appendChild(container);
    } else {
      appendIfExists(card, 'p', 'mega-card-title', data?.eyebrow);
      if (data?.dataPoint || data?.dataPointSufix) {
        const countWrap = createElement('div', { className: 'mega-card-count' });
        appendIfExists(countWrap, 'div', 'count', data.dataPoint);
        appendIfExists(countWrap, 'div', 'count-unit', data.dataPointSufix);
        card.appendChild(countWrap);
      }
      appendIfExists(card, 'p', 'card-description', data?.description?.plaintext);
      cardWrapper.appendChild(card);
    }
    return cardWrapper;
  }

  const primaryCard = createCard(primaryCardData, dashboardCardType, true);
  const secondaryCard = createCard(secondaryCardData, dashboardCardType, false);
  wrapper.appendChild(left);
  wrapper.appendChild(primaryCard);
  wrapper.appendChild(secondaryCard);
  wrapper.addEventListener('click', () => {
    document.querySelector('.mega-menu-minimize')?.classList.remove('mega-menu-minimize');
  });
  return wrapper;
}

async function buildLevelTwoNavigations(block, languageLinkData, element) {
  const selector = languageLinkData ? 'span:last-child' : 'span';
  const label = block.querySelector(selector)?.textContent?.trim() || '';
  if (!label) return;
  const navigation = label.toLowerCase().replace(/\s+/g, '-');
  let navigationData;
  if (languageLinkData) {
    navigationData = { children: parseUl(languageLinkData) };
    languageLinkData.remove();
  } else {
    const anchor = block.querySelector('a');
    const href = anchor?.href ?? null;
    const path = href ? new URL(href).pathname : `/${navigation}`;
    navigationData = await getNavigationByPath(path);
  }
  const level2Container = document.querySelector(`#submenu-${navigation}`);
  if (!level2Container) return;
  const isMegaMenu = level2Container.querySelector('.mega-menu-wrapper');
  if (isDesktop.matches) level2Container.classList.add('mega-menu-minimize');
  if (isMegaMenu) isMegaMenu.remove();
  const megaMenu = await buildMegaMenu(element);
  const data = navigationData;
  level2Container.querySelector('.navigation-group')?.remove();
  const fragment = document.createDocumentFragment();
  const ul = createElement('ul', { className: 'navigation-group' });
  const pageRedirectText = megaMenu.querySelector('.mega-menu-left .button-container a').textContent.trim();
  (data?.children || []).forEach((child) => {
    const li = createElement('li', { className: 'navigation-item navigation-item-level-1' });
    if (child.children?.length) {
      const levelTwoMenu = createElement('div', { className: 'level-two-menu' });
      const button = createElement('button', {
        className: 'root-two-dropdown-btn',
        attributes: { 'aria-expanded': 'false' },
        textContent: child.title,
      });
      button.appendChild(createElement('span', { className: 'accordion-icon' }));
      const menuItems = createElement('div', { className: 'level-two-menu-items' });
      button.addEventListener('click', () => {
        const isExpanded = button.getAttribute('aria-expanded') === 'true';
        button.setAttribute('aria-expanded', !isExpanded);
        button.classList.toggle('active');
        menuItems.classList.toggle('show-child');
      });
      const goToPageLink = createElement('a', {
        className: 'go-to-page-btn',
        attributes: { href: child.path, 'aria-label': pageRedirectText, 'data-warn-on-departure': 'false' },
        textContent: pageRedirectText,
      });
      const subUl = createElement('ul', { className: 'navigation-group' });
      child.children.forEach((subChild) => {
        const subLi = createElement('li', { className: 'navigation-item navigation-item-level-2' });
        subLi.appendChild(createElement('a', {
          className: 'navigation-item-link',
          attributes: { href: subChild.path, 'data-warn-on-departure': 'false' },
          textContent: subChild.title,
        }));
        subUl.appendChild(subLi);
      });
      menuItems.appendChild(goToPageLink);
      menuItems.appendChild(subUl);
      levelTwoMenu.appendChild(button);
      levelTwoMenu.appendChild(menuItems);
      li.appendChild(levelTwoMenu);
    } else {
      li.appendChild(createElement('a', {
        className: 'level-two-link-adjustment',
        attributes: { href: child.path, 'data-warn-on-departure': 'false' },
        textContent: child.title,
      }));
    }
    ul.appendChild(li);
  });
  fragment.appendChild(ul);
  if (megaMenu) level2Container.appendChild(megaMenu);
  level2Container.appendChild(fragment);
}

function buildLevelTwoLanguageLinks(selector) {
  const menu = selector.querySelector('ul');
  if (!menu) return null;
  const items = Array.from(menu.querySelectorAll(':scope > li'));
  if (!items.length) return null;
  items[0].classList.add('open');
  const accordion = createElement('div', { className: 'accordion' });
  items.forEach((item) => {
    const childUL = item.querySelector('ul');
    item.classList.add('menu-item');
    const label = item.querySelector('p')?.textContent.trim() || item.firstChild?.textContent.trim();
    if (item.querySelector('p')) item.querySelector('p').remove();
    if (item.firstChild?.nodeType === 3) item.firstChild.remove();
    const textSpan = createElement('span', { className: 'menu-label', textContent: label });
    item.prepend(textSpan);
    if (childUL) {
      const wrapperDiv = createElement('div', { className: 'submenu-wrapper' });
      wrapperDiv.appendChild(childUL);
      item.appendChild(wrapperDiv);
      item.classList.add('has-arrow');
      textSpan.addEventListener('click', (e) => {
        e.stopPropagation();
        if (item.classList.contains('open')) return;
        items.forEach((i) => i.classList.remove('open'));
        item.classList.add('open');
      });
    }
  });
  accordion.appendChild(menu);
  return accordion;
}

function createSearchForm(block) {
  const text = block.querySelector('p:last-child')?.textContent.trim();
  const maindiv = createElement('div', { className: 'search-main-wrapper' });
  const wrapperdiv = createElement('div', { className: 'search-wrapper' });
  const form = createElement('form', { className: 'search-form', attributes: { method: 'get', role: 'search' } });
  const innerDiv = createElement('div', { className: 'search-inner-wrapper' });
  const input = createElement('input', {
    className: 'search-input',
    attributes: {
      type: 'search', autocomplete: 'off', spellcheck: 'false',
      size: '10', maxlength: '100', 'aria-label': text, name: 'q',
      'aria-describedby': 'search-alert-text',
    },
  });
  const label = createElement('label', {
    className: 'search-input-label',
    attributes: { 'data-desktop-placeholder': text, 'aria-label': text },
    textContent: text,
  });
  const alertDiv = createElement('div', { className: 'search-input-alert' });
  alertDiv.appendChild(createElement('p', { attributes: { id: 'search-alert-text' }, textContent: 'Please enter a valid search term' }));
  innerDiv.append(input, label, alertDiv);
  form.appendChild(innerDiv);
  wrapperdiv.appendChild(form);
  maindiv.appendChild(wrapperdiv);
  const updateLabel = () => {
    label.classList.toggle('focus-out', input.value.trim() === '' && document.activeElement !== input);
  };
  input.addEventListener('focus', updateLabel);
  input.addEventListener('blur', updateLabel);
  label.addEventListener('focus', updateLabel);
  label.addEventListener('blur', updateLabel);
  updateLabel();
  return maindiv;
}

function buildMenuItem(block, isNavigation = false) {
  let label = block.querySelector('p')?.textContent.trim();
  if (block.classList.contains('search')) label = block.querySelector('p:last-child')?.textContent.trim() || 'Search';
  if (!label && !block.classList.contains('search')) return null;
  const slug = label.toLowerCase().replace(/\s+/g, '-');
  const segments = window.location.pathname.split('/').filter(Boolean);
  const currentParentPage = segments[0];
  const li = createElement('li', { className: `menu-${slug}` });
  const button = createElement('button', { attributes: { type: 'button', 'aria-haspopup': 'true', 'aria-expanded': 'false' } });
  if (currentParentPage === slug) button.classList.add('selected');
  const icon = block.querySelector('p > span');
  const text = createElement('span', { textContent: label });
  if (icon) button.appendChild(icon.cloneNode(true));
  button.appendChild(text);
  const { submenu } = createSubmenuWrapper(label);
  const isLinkLanguageBlock = block?.classList.contains('language-links');
  if (isLinkLanguageBlock) {
    const isLinkLanguage = block.querySelector('ul');
    if (isLinkLanguage) isLinkLanguage.classList.add('navigation-group');
    if (!isLinkLanguage) {
      const a = block.querySelector('a');
      if (a) { a.style.display = 'none'; button.appendChild(a); }
    }
    if (isLinkLanguage && isNavigation) submenu.appendChild(isLinkLanguage.cloneNode(true));
  }
  li.append(button, submenu);
  button.addEventListener('click', async (e) => {
    e.stopPropagation();
    const mainDiv = button.parentElement;
    const languageLinkData = mainDiv?.querySelector('.navigation-group');
    const isParsedUl = languageLinkData?.querySelector('.navigation-item');
    const subMenuContainer = mainDiv.querySelector('.submenu-level-1');
    if (subMenuContainer && isDesktop.matches) subMenuContainer.classList.add('mega-menu-minimize');
    if (isNavigation && !isParsedUl) await buildLevelTwoNavigations(button, languageLinkData, block);
    const expanded = li.getAttribute('aria-expanded') === 'true';
    const nav = document.querySelector('nav');
    if (block.classList.contains('search')) {
      const navSections = nav.querySelector('.nav-sections');
      const hamburgerBtn = nav.querySelector('.nav-hamburger button');
      if (!expanded) {
        if (nav.getAttribute('aria-expanded') === 'true') toggleMenu(nav, navSections, true);
        nav.setAttribute('aria-expanded', 'true');
        hamburgerBtn?.setAttribute('aria-label', 'Close navigation');
      } else {
        nav.setAttribute('aria-expanded', 'false');
        hamburgerBtn?.setAttribute('aria-label', 'Open navigation');
      }
    }
    if (nav && !isDesktop.matches && isNavigation) nav.classList.add('second-level-active');
    toggleAllNavSections(false);
    li.setAttribute('aria-expanded', !expanded);
    button.setAttribute('aria-expanded', !expanded);
    document.getElementById('nav-backdrop')?.setAttribute('aria-hidden', expanded);
  });
  return li;
}

// ─── NEW: Utility nav ─────────────────────────────────────────────────────────

/**
 * Parses utility-nav block rows.
 * Each row: [type-cell, label-cell, content-cell?, extra-cell?]
 * type values: isi-jump | pdf-dropdown | hcp-modal | phone | condition-selector |
 *              locale | locate | savings
 */
function buildUtilityNav(block) {
  const nav = createElement('nav', {
    className: 'header-utility-nav',
    attributes: { 'aria-label': 'Utility navigation' },
  });
  const ul = createElement('ul', { className: 'header-utility-list' });

  parseBlockRows(block).forEach((cells) => {
    const type = cells[0]?.textContent?.trim().toLowerCase();
    const labelCell = cells[1];
    const contentCell = cells[2];
    const extraCell = cells[3];
    if (!type) return;

    const li = createElement('li', { className: `header-utility-item header-utility-${type}` });

    switch (type) {
      case 'isi-jump': {
        const href = labelCell?.querySelector('a')?.href || contentCell?.textContent?.trim() || '#isi';
        const label = labelCell?.textContent?.trim() || 'Important Safety Information';
        const a = createElement('a', {
          className: 'header-utility-link',
          attributes: { href },
          textContent: label,
        });
        li.appendChild(a);
        break;
      }

      case 'pdf-dropdown': {
        const dropLabel = labelCell?.textContent?.trim() || 'Full Prescribing Information';
        const btn = createElement('button', {
          className: 'header-utility-dropdown-toggle',
          attributes: { type: 'button', 'aria-expanded': 'false', 'aria-haspopup': 'true' },
          textContent: dropLabel,
        });
        const menu = createElement('ul', {
          className: 'header-utility-dropdown-menu',
          attributes: { role: 'list' },
        });
        contentCell?.querySelectorAll('a').forEach((link) => {
          const menuLi = createElement('li');
          const menuA = link.cloneNode(true);
          menuA.classList.add('header-utility-link');
          if (!menuA.target) { menuA.target = '_blank'; menuA.rel = 'noopener noreferrer'; }
          menuLi.appendChild(menuA);
          menu.appendChild(menuLi);
        });
        btn.addEventListener('click', (e) => {
          e.stopPropagation();
          const open = btn.getAttribute('aria-expanded') === 'true';
          // close other dropdowns
          nav.querySelectorAll('.header-utility-dropdown-toggle[aria-expanded="true"]').forEach((b) => {
            if (b !== btn) b.setAttribute('aria-expanded', 'false');
          });
          btn.setAttribute('aria-expanded', String(!open));
        });
        li.append(btn, menu);
        break;
      }

      case 'hcp-modal': {
        const label = labelCell?.textContent?.trim() || 'Healthcare Professionals';
        const href = labelCell?.querySelector('a')?.href || '#';
        const modalId = contentCell?.textContent?.trim() || extraCell?.textContent?.trim() || 'wolHCP';
        const a = createElement('a', {
          className: 'header-utility-link header-hcp-modal',
          attributes: { href, 'data-id': modalId },
          textContent: label,
        });
        a.addEventListener('click', async (ev) => {
          ev.preventDefault();
          const { openModal } = await import(`${window.hlx.codeBasePath}/blocks/modal/modal.js`);
          openModal(`/modals/${modalId}`);
        });
        li.appendChild(a);
        break;
      }

      case 'phone': {
        const label = labelCell?.textContent?.trim();
        const phoneHref = labelCell?.querySelector('a')?.href || `tel:${label?.replace(/\D/g, '')}`;
        const a = createElement('a', {
          className: 'header-utility-link header-utility-phone',
          attributes: { href: phoneHref },
          textContent: label,
        });
        li.appendChild(a);
        break;
      }

      case 'condition-selector': {
        const selectorLabel = labelCell?.textContent?.trim() || 'Select Condition';
        const btn = createElement('button', {
          className: 'header-condition-toggle',
          attributes: { type: 'button', 'aria-expanded': 'false', 'aria-haspopup': 'listbox' },
          textContent: selectorLabel,
        });
        const listbox = createElement('ul', {
          className: 'header-condition-listbox',
          attributes: { role: 'listbox', 'aria-label': selectorLabel },
        });
        contentCell?.querySelectorAll('a').forEach((link) => {
          const opt = createElement('li', { attributes: { role: 'option', tabindex: '0' } });
          opt.appendChild(link.cloneNode(true));
          listbox.appendChild(opt);
        });
        btn.addEventListener('click', (e) => {
          e.stopPropagation();
          const open = btn.getAttribute('aria-expanded') === 'true';
          btn.setAttribute('aria-expanded', String(!open));
        });
        li.append(btn, listbox);
        break;
      }

      case 'locale':
      case 'language': {
        const a = labelCell?.querySelector('a');
        if (a) {
          const clone = a.cloneNode(true);
          clone.classList.add('header-utility-link', 'header-utility-locale');
          li.appendChild(clone);
        }
        break;
      }

      case 'locate': {
        const a = labelCell?.querySelector('a') || createElement('a', {
          attributes: { href: contentCell?.querySelector('a')?.href || '#' },
          textContent: labelCell?.textContent?.trim() || 'Locate',
        });
        a.classList.add('header-utility-link', 'header-utility-locate');
        li.appendChild(a.cloneNode ? a.cloneNode(true) : a);
        break;
      }

      case 'savings': {
        const a = labelCell?.querySelector('a') || createElement('a', {
          attributes: { href: contentCell?.querySelector('a')?.href || '#' },
          textContent: labelCell?.textContent?.trim(),
        });
        a.classList.add('header-utility-link', 'header-utility-savings');
        li.appendChild(a.cloneNode ? a.cloneNode(true) : a);
        break;
      }

      default:
        return;
    }

    ul.appendChild(li);
  });

  // close dropdowns / condition selectors on outside click
  document.addEventListener('click', () => {
    nav.querySelectorAll('[aria-expanded="true"]').forEach((btn) => {
      if (!li?.contains(btn)) btn.setAttribute('aria-expanded', 'false'); // eslint-disable-line no-undef
    });
  });

  nav.appendChild(ul);
  return nav;
}

// ─── NEW: Eyebrow bar ─────────────────────────────────────────────────────────

function buildEyebrow(block) {
  const rows = parseBlockRows(block);
  const position = rows[0]?.[0]?.textContent?.trim().toLowerCase() === 'bottom' ? 'bottom' : 'top';
  const contentCell = rows[0]?.[1];

  const bar = createElement('div', {
    className: `header-eyebrow header-eyebrow-${position}`,
    attributes: { role: 'region', 'aria-label': 'Promotional message' },
  });
  const inner = createElement('div', { className: 'header-eyebrow-inner' });
  if (contentCell) inner.innerHTML = contentCell.innerHTML;
  bar.appendChild(inner);
  return bar;
}

// ─── NEW: Floating ISI strip ──────────────────────────────────────────────────

function buildFloatingIsi(block) {
  const rows = parseBlockRows(block);
  const contentCell = rows[0]?.[0];
  const expandLabel = rows[0]?.[1]?.textContent?.trim() || 'See Full ISI';
  const collapseLabel = rows[0]?.[2]?.textContent?.trim() || 'Collapse';

  const strip = createElement('div', {
    className: 'header-floating-isi',
    attributes: {
      id: 'header-floating-isi',
      role: 'region',
      'aria-label': 'Important Safety Information',
      'aria-live': 'polite',
    },
  });

  const toggle = createElement('button', {
    className: 'header-floating-isi-toggle',
    attributes: { type: 'button', 'aria-expanded': 'false', 'aria-controls': 'header-floating-isi-content' },
    textContent: expandLabel,
  });

  const content = createElement('div', {
    className: 'header-floating-isi-content',
    attributes: { id: 'header-floating-isi-content', hidden: '' },
  });
  if (contentCell) content.innerHTML = contentCell.innerHTML;

  toggle.addEventListener('click', () => {
    const open = toggle.getAttribute('aria-expanded') === 'true';
    toggle.setAttribute('aria-expanded', String(!open));
    toggle.textContent = open ? expandLabel : collapseLabel;
    if (!open) content.removeAttribute('hidden');
    else content.setAttribute('hidden', '');
    strip.classList.toggle('expanded', !open);
    // sync body padding
    document.body.style.paddingBottom = `${strip.offsetHeight}px`;
  });

  // initial body padding sync
  const ro = new ResizeObserver(() => {
    document.body.style.paddingBottom = `${strip.offsetHeight}px`;
  });
  ro.observe(strip);

  strip.append(toggle, content);
  return strip;
}

// ─── NEW: CTA group (header-right auth / CTA buttons) ────────────────────────

function buildCtaGroup(block) {
  const group = createElement('div', { className: 'header-cta-group' });

  parseBlockRows(block).forEach((cells) => {
    const ctaType = cells[0]?.textContent?.trim().toLowerCase();
    const contentCell = cells[1];
    if (!ctaType || !contentCell) return;

    switch (ctaType) {
      case 'guest': {
        const guest = createElement('div', { className: 'header-auth-guest' });
        guest.innerHTML = contentCell.innerHTML;
        group.appendChild(guest);
        break;
      }
      case 'user': {
        const user = createElement('div', {
          className: 'header-auth-user',
          attributes: { hidden: '' },
        });
        user.innerHTML = contentCell.innerHTML;
        group.appendChild(user);
        break;
      }
      case 'cta': {
        const a = contentCell.querySelector('a');
        if (a) {
          const btn = a.cloneNode(true);
          btn.classList.add('header-cta-button', 'button', 'primary');
          group.appendChild(btn);
        }
        break;
      }
      default:
        break;
    }
  });

  return group;
}

// ─── NEW: --header-height CSS property sync ───────────────────────────────────

function syncHeaderHeight(headerEl) {
  const set = () => {
    document.documentElement.style.setProperty('--header-height', `${headerEl.offsetHeight}px`);
  };
  new ResizeObserver(set).observe(headerEl);
  set();
}

// ─── Main decorate ────────────────────────────────────────────────────────────

export default async function decorate(block) {
  const variant = getMetadata('header-variant') || 'classic';
  const variantClasses = VARIANT_CLASSES[variant] || [];

  // Load nav fragment
  const navMeta = getMetadata('nav');
  const navPath = navMeta ? new URL(navMeta, window.location).pathname : '/nav';
  const fragment = await loadFragment(navPath);
  const header = fragment?.querySelector('.navigation-content-container');
  if (!header) return;

  // Apply variant classes to <header> element
  const headerEl = block.closest('header');
  variantClasses.forEach((cls) => headerEl?.classList.add(cls));

  // ── Collect typed blocks from nav fragment ──────────────────────────────────
  const logoBlock = header.querySelector('.navigation-content[data-type="logo"]');
  const utilityBlock = header.querySelector('.navigation-content[data-type="utility-nav"]');
  const eyebrowBlocks = [...header.querySelectorAll('.navigation-content[data-type="eyebrow"]')];
  const floatingIsiBlock = header.querySelector('.navigation-content[data-type="floating-isi"]');
  const navMenuBlocks = [...header.querySelectorAll(
    '.navigation-content[data-type="navigation-content"], .navigation-content[data-type="language-links"]',
  )];
  const toolBlocks = [...header.querySelectorAll(
    '.navigation-content[data-type="language-links"], .navigation-content[data-type="search"]',
  )];
  const searchBlock = header.querySelector('.navigation-content[data-type="search"]');
  const ctaBlock = header.querySelector('.navigation-content[data-type="cta-group"]');

  const navWrapper = document.createElement('div');
  navWrapper.className = 'nav-wrapper';

  // ── 1. Eyebrow bars (top) ──────────────────────────────────────────────────
  eyebrowBlocks
    .filter((b) => {
      const pos = parseBlockRows(b)[0]?.[0]?.textContent?.trim().toLowerCase();
      return pos !== 'bottom';
    })
    .forEach((b) => navWrapper.appendChild(buildEyebrow(b)));

  // ── 2. Utility nav (not in slim or fl-safety with no utility block) ─────────
  if (utilityBlock && variant !== 'slim') {
    navWrapper.appendChild(buildUtilityNav(utilityBlock));
  }

  // ── 3. Main nav element (logo + sections + tools + hamburger) ───────────────
  const nav = createElement('nav', { attributes: { id: 'nav', 'aria-expanded': 'false' } });

  // Brand / Logo
  if (logoBlock) {
    const brandImg = logoBlock.querySelector('picture');
    const logoHref = logoBlock.querySelector('a')?.href || '/';
    const brand = createElement('div', { className: 'section nav-brand nav-item-level-0' });
    const wrapper = createElement('div', { className: 'default-content-wrapper' });
    const p = createElement('p');
    const a = createElement('a', { attributes: { href: logoHref, title: 'Home' } });
    if (brandImg) a.appendChild(brandImg.cloneNode(true));
    p.appendChild(a);
    wrapper.appendChild(p);
    brand.appendChild(wrapper);
    nav.appendChild(brand);

    // Lite/fl-safety: duplicate logo inside the nav bar area via CSS class
    if (variant === 'lite' || variant === 'fl-safety') {
      const brandDupe = brand.cloneNode(true);
      brandDupe.classList.add('nav-brand-inline');
      nav.appendChild(brandDupe);
    }
  }

  // Navigation sections (primary nav — skip in slim)
  if (variant !== 'slim') {
    const section = createElement('div', { className: 'section nav-sections nav-item-level-0' });
    const sectionWrapper = createElement('div', { className: 'default-content-wrapper' });
    const ul = createElement('ul');

    navMenuBlocks.forEach((menu) => {
      let element = menu;
      const p = menu.querySelector('p');
      if (p && p.innerText?.trim() === 'MORE') {
        const clonedBlock = menu.cloneNode(true);
        const clonedP = clonedBlock.querySelector('p');
        if (clonedP) clonedP.textContent = 'Quick Links';
        element = clonedBlock;
      }
      const li = buildMenuItem(element, true);
      if (li) ul.appendChild(li);
    });

    const sectionBackBtn = createElement('button', {
      className: 'back-btn',
      attributes: { type: 'button' },
      textContent: 'BACK',
    });
    sectionBackBtn.addEventListener('click', () => toggleAllNavSections(false));
    ul.prepend(sectionBackBtn);
    sectionWrapper.appendChild(ul);
    section.appendChild(sectionWrapper);
    nav.appendChild(section);

    // Tools (language-links + search — skip in slim)
    const tools = createElement('div', { className: 'section nav-tools nav-item-level-0' });
    const toolsWrapper = createElement('div', { className: 'default-content-wrapper' });
    const toolsUl = createElement('ul');

    // CTA group before search (if present)
    if (ctaBlock) {
      const ctaLi = createElement('li', { className: 'header-cta-item' });
      ctaLi.appendChild(buildCtaGroup(ctaBlock));
      toolsUl.appendChild(ctaLi);
    }

    toolBlocks.forEach((tool) => {
      const li = buildMenuItem(tool);
      let expandableMenu;
      if (tool.classList.contains('search')) expandableMenu = createSearchForm(tool);
      else expandableMenu = buildLevelTwoLanguageLinks(tool);
      if (expandableMenu && li) li.querySelector('.submenu-level-1').appendChild(expandableMenu);
      if (li) toolsUl.appendChild(li);
    });

    toolsWrapper.appendChild(toolsUl);
    tools.appendChild(toolsWrapper);
    nav.appendChild(tools);
  }

  // Hamburger (always present except slim)
  if (variant !== 'slim') {
    const navSections = nav.querySelector('.nav-sections');
    const hamburger = document.createElement('div');
    hamburger.classList.add('nav-hamburger');
    hamburger.innerHTML = `<button type="button" aria-controls="nav" aria-label="Open navigation">
        <span></span><span></span><span></span>
      </button>`;
    hamburger.addEventListener('click', () => {
      const searchMenu = nav.querySelector('.menu-search');
      if (searchMenu?.getAttribute('aria-expanded') === 'true') {
        searchMenu.setAttribute('aria-expanded', 'false');
        searchMenu.querySelector('button')?.setAttribute('aria-expanded', 'false');
      }
      toggleMenu(nav, navSections);
    });
    nav.append(hamburger);
    isDesktop.addEventListener('change', () => toggleMenu(nav, navSections, isDesktop.matches));
  }

  navWrapper.appendChild(nav);

  // ── 4. Eyebrow bottom ──────────────────────────────────────────────────────
  eyebrowBlocks
    .filter((b) => {
      const pos = parseBlockRows(b)[0]?.[0]?.textContent?.trim().toLowerCase();
      return pos === 'bottom';
    })
    .forEach((b) => navWrapper.appendChild(buildEyebrow(b)));

  decorateExternalLinksUtility(navWrapper);
  block.appendChild(navWrapper);

  // ── 5. Backdrop (desktop submenu overlay) ──────────────────────────────────
  const backdrop = createElement('div', {
    className: 'nav-backdrop',
    attributes: { id: 'nav-backdrop', 'aria-hidden': 'true' },
  });
  block.appendChild(backdrop);

  // ── 6. Floating ISI → appended to body (pharma compliance) ─────────────────
  if (floatingIsiBlock) {
    document.body.appendChild(buildFloatingIsi(floatingIsiBlock));
  }

  // ── 7. Sync --header-height CSS custom property ─────────────────────────────
  if (headerEl) syncHeaderHeight(headerEl);

  nav.setAttribute('aria-expanded', 'false');
}
