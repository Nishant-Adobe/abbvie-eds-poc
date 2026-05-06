/*
 * Modal Block
 *
 * Trigger any element on the page that has:
 *   data-modal-id="my-modal"
 * or a link:
 *   <a href="#my-modal">Open</a>
 *
 * Lazy-init: the overlay DOM is only built the first time a modal
 * is triggered — safe for pages with 20+ modals (e.g. Mavyret).
 *
 * Block authoring format (table):
 *   | modal (once) |            |
 *   |---|---|
 *   | modal-id  | level-up-study  |
 *   | Title     | Study Results   |
 *   | Content   | <rich text>     |
 *   | CTA       | Learn more      |  <- link authored as hyperlink
 *
 * Variants (block class):
 *   once -- show only once per browser session (sessionStorage)
 */

/** @type {Map<string, {block: HTMLElement, cfg: object, overlay: HTMLElement|null}>} */
const registry = new Map();
let listenersAttached = false;

/* ------------------------------------------------------------------ */
/* Helpers                                                              */
/* ------------------------------------------------------------------ */

function readBlock(block) {
  const cfg = {};
  [...block.children].forEach((row) => {
    const key = row.children[0]?.textContent?.trim().toLowerCase() || '';
    const valueEl = row.children[1];

    if (key === 'modal-id' || key === 'modal id') {
      cfg.id = valueEl?.textContent.trim();
    } else if (key === 'title') {
      cfg.title = valueEl?.textContent.trim();
    } else if (key === 'content') {
      cfg.contentEl = valueEl;
    } else if (key === 'cta') {
      const link = valueEl?.querySelector('a');
      cfg.ctaLabel = link?.textContent.trim() || valueEl?.textContent.trim();
      cfg.ctaHref = link?.href || '#';
    }
  });
  return cfg;
}

function getFocusable(container) {
  return [
    ...container.querySelectorAll(
      'a[href], button:not([disabled]), input:not([disabled]),'
      + ' select:not([disabled]), textarea:not([disabled]),'
      + ' [tabindex]:not([tabindex="-1"])',
    ),
  ];
}

/* ------------------------------------------------------------------ */
/* Build overlay DOM (called lazily on first open)                     */
/* ------------------------------------------------------------------ */

function buildOverlay(cfg) {
  const titleId = `modal-title-${cfg.id}`;

  const overlay = document.createElement('div');
  overlay.className = 'modal-overlay';
  overlay.setAttribute('role', 'dialog');
  overlay.setAttribute('aria-modal', 'true');
  if (cfg.title) overlay.setAttribute('aria-labelledby', titleId);

  const panel = document.createElement('div');
  panel.className = 'modal-panel';

  const closeBtn = document.createElement('button');
  closeBtn.className = 'modal-close';
  closeBtn.setAttribute('aria-label', 'Close');
  closeBtn.textContent = '✕';

  const content = document.createElement('div');
  content.className = 'modal-content';

  if (cfg.title) {
    const heading = document.createElement('h2');
    heading.id = titleId;
    heading.className = 'modal-title';
    heading.textContent = cfg.title;
    content.append(heading);
  }

  if (cfg.contentEl) {
    const body = document.createElement('div');
    body.className = 'modal-body';
    body.append(...cfg.contentEl.cloneNode(true).childNodes);
    content.append(body);
  }

  if (cfg.ctaLabel) {
    const cta = document.createElement('a');
    cta.className = 'modal-cta button';
    cta.href = cfg.ctaHref;
    cta.textContent = cfg.ctaLabel;
    content.append(cta);
  }

  panel.append(closeBtn, content);
  overlay.append(panel);
  document.body.append(overlay);

  return overlay;
}

/* ------------------------------------------------------------------ */
/* Open / close                                                         */
/* ------------------------------------------------------------------ */

function closeModal(id) {
  const entry = registry.get(id);
  if (!entry?.overlay) return;
  entry.overlay.classList.remove('is-open');
  document.body.classList.remove('modal-is-open');
}

function openModal(id) {
  const entry = registry.get(id);
  if (!entry) return;

  if (entry.block.classList.contains('once') && sessionStorage.getItem(`modal-${id}`)) return;

  if (!entry.overlay) {
    const overlay = buildOverlay(entry.cfg);
    entry.overlay = overlay;

    const panel = overlay.querySelector('.modal-panel');
    const closeBtn = overlay.querySelector('.modal-close');

    overlay.addEventListener('keydown', (e) => {
      if (e.key !== 'Tab') return;
      const focusable = getFocusable(panel);
      if (!focusable.length) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    });

    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) closeModal(id);
    });

    closeBtn.addEventListener('click', () => closeModal(id));
  }

  entry.overlay.classList.add('is-open');
  document.body.classList.add('modal-is-open');

  const focusable = getFocusable(entry.overlay.querySelector('.modal-panel'));
  if (focusable.length) focusable[0].focus();

  if (entry.block.classList.contains('once')) {
    sessionStorage.setItem(`modal-${id}`, '1');
  }
}

/* ------------------------------------------------------------------ */
/* Global event delegation (attached once per page)                    */
/* ------------------------------------------------------------------ */

function attachGlobalListeners() {
  if (listenersAttached) return;
  listenersAttached = true;

  document.addEventListener('click', (e) => {
    const byAttr = e.target.closest('[data-modal-id]');
    if (byAttr) {
      e.preventDefault();
      openModal(byAttr.dataset.modalId);
      return;
    }

    const byHref = e.target.closest('a[href^="#"]');
    if (byHref) {
      const id = byHref.getAttribute('href').slice(1);
      if (registry.has(id)) {
        e.preventDefault();
        openModal(id);
      }
    }
  });

  document.addEventListener('keydown', (e) => {
    if (e.key !== 'Escape') return;
    registry.forEach((entry, id) => {
      if (entry.overlay?.classList.contains('is-open')) closeModal(id);
    });
  });
}

/* ------------------------------------------------------------------ */
/* Block decoration                                                     */
/* ------------------------------------------------------------------ */

export default async function decorate(block) {
  const cfg = readBlock(block);
  if (!cfg.id) return;

  registry.set(cfg.id, { block, cfg, overlay: null });
  block.hidden = true;

  attachGlobalListeners();
}
