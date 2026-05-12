import { applyCommonProps } from '../../scripts/utils.js';

export default function decorate(block) {
  applyCommonProps(block);

  const isSticky = block.classList.contains('sticky');
  const isMobileMenu = block.classList.contains('mobile-menu');

  // Parse rows: single-cell = anchorId config; two-cell = nav item
  let anchorId = '';
  const items = [];

  [...block.children].forEach((row) => {
    const cells = [...row.children];
    if (cells.length >= 2) {
      const label = cells[0].textContent.trim();
      const rawHref = cells[1].textContent.trim();
      if (label && rawHref) {
        items.push({
          label,
          href: rawHref.startsWith('#') ? rawHref : `#${rawHref}`,
          ue: {
            resource: row.dataset.aueResource,
            type: row.dataset.aueType,
            component: row.dataset.aueComponent,
            model: row.dataset.aueModel,
            label: row.dataset.aueLabel,
            behavior: row.dataset.aueBehavior,
          },
        });
      }
    } else if (cells.length === 1 && !anchorId) {
      const text = cells[0].textContent.trim();
      if (text) anchorId = text;
    }
  });

  if (anchorId) block.id = anchorId;

  // Re-apply UE instrumentation attrs lost when replaceChildren discards original rows
  const applyUeAttrs = (el, ue) => {
    if (!ue?.resource) return;
    el.dataset.aueResource = ue.resource;
    el.dataset.aueType = ue.type || 'component';
    if (ue.component) el.dataset.aueComponent = ue.component;
    if (ue.model) el.dataset.aueModel = ue.model;
    if (ue.label) el.dataset.aueLabel = ue.label;
    if (ue.behavior) el.dataset.aueBehavior = ue.behavior;
  };

  // Build link elements
  const links = items.map(({ label, href }) => {
    const a = document.createElement('a');
    a.href = href;
    a.textContent = label;
    return a;
  });

  // Build nav
  const nav = document.createElement('nav');
  nav.setAttribute('aria-label', 'Page sections');

  if (isMobileMenu) {
    const listId = `section-nav-list-${Math.random().toString(36).slice(2, 9)}`;

    const toggle = document.createElement('button');
    toggle.className = 'section-nav-toggle';
    toggle.setAttribute('aria-expanded', 'false');
    toggle.setAttribute('aria-controls', listId);
    toggle.innerHTML = '<span class="section-nav-hamburger" aria-hidden="true"></span>'
      + '<span class="section-nav-toggle-label">Menu</span>';

    const list = document.createElement('ul');
    list.id = listId;
    links.forEach((a, i) => {
      const li = document.createElement('li');
      applyUeAttrs(li, items[i].ue);
      li.append(a);
      list.append(li);
    });

    const closeMenu = () => {
      toggle.setAttribute('aria-expanded', 'false');
      block.classList.remove('is-open');
    };

    toggle.addEventListener('click', () => {
      const expanded = toggle.getAttribute('aria-expanded') === 'true';
      toggle.setAttribute('aria-expanded', String(!expanded));
      block.classList.toggle('is-open', !expanded);
    });

    // Escape closes; Tab traps focus while open
    block.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && block.classList.contains('is-open')) {
        closeMenu();
        toggle.focus();
        return;
      }
      if (e.key === 'Tab' && block.classList.contains('is-open')) {
        const focusable = [...block.querySelectorAll('button, a[href]')];
        if (focusable.length < 2) return;
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    });

    // Clicking a link closes the menu on mobile
    links.forEach((a) => a.addEventListener('click', closeMenu));

    nav.append(toggle, list);
  } else {
    links.forEach((a, i) => applyUeAttrs(a, items[i].ue));
    nav.append(...links);
  }

  block.replaceChildren(nav);

  // Smooth scroll offset = header height + this nav's height
  const getOffset = () => {
    const headerHeight = parseInt(
      getComputedStyle(document.documentElement).getPropertyValue('--header-height') || '0',
      10,
    );
    return headerHeight + block.offsetHeight;
  };

  links.forEach((a) => {
    a.addEventListener('click', (e) => {
      const id = a.getAttribute('href').slice(1);
      const target = document.getElementById(id);
      if (!target) return;
      e.preventDefault();
      window.scrollTo({
        top: target.getBoundingClientRect().top + window.scrollY - getOffset(),
        behavior: 'smooth',
      });
    });
  });

  // Sticky: sentinel watches for when block becomes pinned, adds .is-stuck for shadow
  if (isSticky) {
    const sentinel = document.createElement('div');
    sentinel.className = 'section-nav-sentinel';
    block.before(sentinel);
    const headerHeight = parseInt(
      getComputedStyle(document.documentElement).getPropertyValue('--header-height') || '0',
      10,
    );
    new IntersectionObserver(
      ([entry]) => block.classList.toggle('is-stuck', !entry.isIntersecting),
      { rootMargin: `-${headerHeight}px 0px 0px 0px` },
    ).observe(sentinel);
  }

  // Active section tracking via IntersectionObserver
  const sectionEls = links
    .map((a) => document.getElementById(a.getAttribute('href').slice(1)))
    .filter(Boolean);

  if (sectionEls.length) {
    const offset = getOffset();
    const activeSections = new Set();

    const activeObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) activeSections.add(entry.target.id);
          else activeSections.delete(entry.target.id);
        });
        // Highlight only the topmost visible section (document order)
        const topmost = sectionEls.find((el) => activeSections.has(el.id));
        links.forEach((a) => a.classList.toggle('is-active', !!topmost && a.getAttribute('href') === `#${topmost.id}`));
      },
      { rootMargin: `-${offset}px 0px -50% 0px`, threshold: 0 },
    );
    sectionEls.forEach((el) => activeObserver.observe(el));
  }
}
