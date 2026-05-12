/*
 * Modal Block
 * Fragment-based modal with variant support.
 *
 * Variants (applied as classes on the block wrapper):
 *   panel        — slide-in side panel from right
 *   exit         — triggered by mouseleave on document (desktop)
 *   exit-small   — smaller exit modal
 *   small        — narrow confirmation dialog (~480px)
 *   media        — wide modal for video/image, no inner padding
 *   image        — full-bleed image lightbox
 *   information  — informational overlay
 *   once         — show only once per user (persistent cookie)
 *   once-session — show once per session (sessionStorage)
 *   force        — always open on load; no backdrop dismiss
 *
 * Authoring (key–value block table):
 *   | modalId       | promo-2025                        |
 *   | fragmentPath  | /us/en/fragments/promo-2025       |
 *   | openLabel     | Show offer                        |
 */

import { loadFragment } from '../fragment/fragment.js';

/* ------------------------------------------------------------------ */
/* Shared overlay (one instance per page)                              */
/* ------------------------------------------------------------------ */

let overlay = null;
let lastTrigger = null;
let activeVariants = [];

function getFocusable(container) {
  return [
    ...container.querySelectorAll(
      'a[href], button:not([disabled]), input:not([disabled]),'
      + ' select:not([disabled]), textarea:not([disabled]),'
      + ' [tabindex]:not([tabindex="-1"])',
    ),
  ];
}

function closeModal() {
  if (!overlay) return;
  if (activeVariants.includes('force')) return;

  const dialog = overlay.querySelector('.modal-dialog');
  dialog.setAttribute('aria-hidden', 'true');
  overlay.classList.remove('is-open');
  overlay.className = 'modal-overlay';
  document.body.classList.remove('modal-is-open');
  if (lastTrigger) lastTrigger.focus();
}

function getOverlay() {
  if (overlay) return overlay;

  overlay = document.createElement('div');
  overlay.className = 'modal-overlay';

  const dialog = document.createElement('div');
  dialog.className = 'modal-dialog';
  dialog.setAttribute('role', 'dialog');
  dialog.setAttribute('aria-modal', 'true');
  dialog.setAttribute('aria-hidden', 'true');
  dialog.setAttribute('tabindex', '-1');

  const header = document.createElement('div');
  header.className = 'modal-header';

  const closeBtn = document.createElement('button');
  closeBtn.className = 'modal-close';
  closeBtn.type = 'button';
  closeBtn.setAttribute('aria-label', 'Close modal');
  closeBtn.textContent = '✕';
  closeBtn.addEventListener('click', closeModal);

  header.append(closeBtn);

  const content = document.createElement('div');
  content.className = 'modal-content';

  dialog.append(header, content);
  overlay.append(dialog);
  document.body.append(overlay);

  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) closeModal();
  });

  overlay.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') { closeModal(); return; }
    if (e.key !== 'Tab') return;
    const focusable = getFocusable(dialog);
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

  return overlay;
}

/* ------------------------------------------------------------------ */
/* Cookie / session helpers                                            */
/* ------------------------------------------------------------------ */

function setCookie(name, value, days) {
  const d = new Date();
  d.setTime(d.getTime() + days * 86400000);
  document.cookie = `${name}=${value};expires=${d.toUTCString()};path=/;SameSite=Lax`;
}

function getCookie(name) {
  const escaped = name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const match = document.cookie.match(new RegExp(`(^| )${escaped}=([^;]+)`));
  return match ? match[2] : null;
}

function hasSeenModal(modalId, variants) {
  if (variants.includes('once')) {
    return getCookie(`modal-seen-${modalId}`) === '1';
  }
  if (variants.includes('once-session')) {
    try { return sessionStorage.getItem(`modal-seen-${modalId}`) === '1'; } catch { /* private browsing */ }
  }
  return false;
}

function markModalSeen(modalId, variants) {
  if (variants.includes('once')) {
    setCookie(`modal-seen-${modalId}`, '1', 365);
  }
  if (variants.includes('once-session')) {
    try { sessionStorage.setItem(`modal-seen-${modalId}`, '1'); } catch { /* private browsing */ }
  }
}

/* ------------------------------------------------------------------ */
/* Open                                                                 */
/* ------------------------------------------------------------------ */

async function openModal(trigger, variants = []) {
  lastTrigger = trigger;
  activeVariants = variants;

  const fragmentPath = trigger?.dataset?.fragmentPath || trigger?.fragmentPath;
  const modalId = trigger?.dataset?.modalId || '';
  const ov = getOverlay();
  const dialog = ov.querySelector('.modal-dialog');
  const content = ov.querySelector('.modal-content');

  // Apply variant classes to overlay
  ov.className = 'modal-overlay';
  variants.forEach((v) => ov.classList.add(`modal-${v}`));

  // Hide close button for force variant
  const closeBtn = dialog.querySelector('.modal-close');
  if (closeBtn) closeBtn.hidden = variants.includes('force');

  content.innerHTML = '<p class="modal-loading">Loading…</p>';
  dialog.setAttribute('aria-hidden', 'false');
  ov.classList.add('is-open');
  document.body.classList.add('modal-is-open');

  try {
    const fragment = await loadFragment(fragmentPath);
    content.innerHTML = '';
    if (fragment) {
      [...fragment.childNodes].forEach((node) => content.append(node));
    }
    const heading = content.querySelector('h1, h2, h3');
    if (heading) {
      if (!heading.id) heading.id = `modal-title-${modalId || 'default'}`;
      dialog.setAttribute('aria-labelledby', heading.id);
    }
    // Links with href="#" inside modal act as close/cancel buttons
    content.querySelectorAll('a[href="#"]').forEach((link) => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        closeModal();
      });
    });
  } catch {
    content.innerHTML = '<p class="modal-error">Unable to load content.</p>';
  }

  // Mark as seen for once/once-session variants
  if (modalId) markModalSeen(modalId, variants);

  const focusable = getFocusable(dialog);
  if (focusable.length) focusable[0].focus();
  else dialog.focus();
}

/* ------------------------------------------------------------------ */
/* Exit-intent listener                                                */
/* ------------------------------------------------------------------ */

let exitListenerRegistered = false;
const exitModals = [];

function registerExitIntent(trigger, variants) {
  exitModals.push({ trigger, variants });
  if (exitListenerRegistered) return;
  exitListenerRegistered = true;

  document.addEventListener('mouseleave', (e) => {
    if (e.clientY > 0) return;
    const modal = exitModals.find(
      (m) => !hasSeenModal(m.trigger.dataset.modalId, m.variants),
    );
    if (!modal) return;
    exitListenerRegistered = false;
    openModal(modal.trigger, modal.variants).catch(() => {});
  });
}

/* ------------------------------------------------------------------ */
/* data-modal-id trigger support                                       */
/* ------------------------------------------------------------------ */

let globalTriggerAc;

function setupGlobalTriggers() {
  if (globalTriggerAc) globalTriggerAc.abort();
  globalTriggerAc = new AbortController();
  document.addEventListener('click', (e) => {
    const trigger = e.target.closest('[data-modal-id]');
    if (!trigger) return;
    e.preventDefault();
    const { modalId } = trigger.dataset;
    document.dispatchEvent(new CustomEvent('modal:open', { detail: { modalId } }));
  }, { signal: globalTriggerAc.signal });
}

let globalTriggersSetup = false;

/* ------------------------------------------------------------------ */
/* Block decoration                                                     */
/* ------------------------------------------------------------------ */

export default async function decorate(block) {
  if (!globalTriggersSetup) {
    setupGlobalTriggers();
    globalTriggersSetup = true;
  }

  if (block.modalCleanup) block.modalCleanup();
  if (block.modalAutoOpenTimer) clearTimeout(block.modalAutoOpenTimer);

  const rows = [...block.querySelectorAll(':scope > div')];

  let fragmentPath;
  let openLabel;
  let modalId;

  // Method 1: Read from block dataset (v2 block / UE properties)
  if (block.dataset.modalId || block.dataset.fragmentPath) {
    modalId = block.dataset.modalId || '';
    fragmentPath = block.dataset.fragmentPath || '';
    openLabel = block.dataset.openLabel || 'Open modal';
  } else if (rows.length && rows[0]?.children.length >= 2) {
    // Method 2: Key-value format (two cells per row)
    const config = {};
    rows.forEach((row) => {
      const key = row.children[0]?.textContent?.trim().toLowerCase();
      const value = row.children[1]?.textContent?.trim()
        || row.children[1]?.querySelector('a')?.getAttribute('href') || '';
      if (key) config[key] = value;
    });
    modalId = config.modalid || config['modal-id'] || '';
    fragmentPath = config.fragmentpath || config['fragment-path'] || config.path || '';
    openLabel = config.openlabel || config['open-label'] || 'Open modal';
  } else if (rows.length) {
    // Method 3: UE single-cell format — find fields by content heuristics
    const getText = (i) => rows[i]?.children[0]?.textContent?.trim() || '';
    const getLink = (i) => rows[i]?.querySelector('a')?.getAttribute('href') || '';

    // Find the fragment path row (contains "/" path separator)
    let pathIdx = -1;
    for (let i = 0; i < rows.length; i += 1) {
      const text = getLink(i) || getText(i);
      if (text.startsWith('/') || text.startsWith('http')) { pathIdx = i; break; }
    }

    if (pathIdx >= 0) {
      fragmentPath = getLink(pathIdx) || getText(pathIdx);
      modalId = pathIdx > 0 ? getText(pathIdx - 1) : '';
      openLabel = getText(pathIdx + 1) || 'Open modal';
      // If modalId is empty and there's a row before it, try row before that
      if (!modalId && pathIdx > 1) modalId = getText(pathIdx - 2);
    } else {
      // Fallback: assume order [0]=modalId, [1]=fragmentPath, [2]=openLabel
      modalId = getText(0);
      fragmentPath = getLink(1) || getText(1);
      openLabel = getText(2) || 'Open modal';
    }
  } else {
    // Method 4: No rows at all — try reading from inner text/links directly
    const allText = block.textContent?.trim() || '';
    const link = block.querySelector('a');
    if (link) {
      fragmentPath = link.getAttribute('href');
      openLabel = link.textContent?.trim() || 'Open modal';
    } else if (allText) {
      fragmentPath = allText;
    }
  }

  if (!fragmentPath) return;
  try {
    fragmentPath = new URL(fragmentPath, window.location.origin).pathname;
  } catch { /* already a path */ }

  // Extract variants from block classes
  const edsClasses = new Set(['modal', 'block', 'loaded', 'is-loading']);
  const variants = [...block.classList]
    .filter((c) => !edsClasses.has(c))
    .map((c) => c.replace('modal-', ''));

  // Store data on block for global trigger lookup
  block.dataset.modalId = modalId;
  block.dataset.fragmentPath = fragmentPath;

  if (modalId) {
    const ac = new AbortController();
    document.addEventListener('modal:open', (e) => {
      if (e.detail?.modalId === modalId) {
        openModal({ dataset: { fragmentPath, modalId }, fragmentPath }, variants).catch(() => {});
      }
    }, { signal: ac.signal });
    block.modalCleanup = () => ac.abort();
  }

  block.innerHTML = '';

  // Auto-open variants (force, once, once-session on load)
  const isAutoOpen = variants.includes('force')
    || variants.includes('once')
    || variants.includes('once-session');

  // Exit-intent variants
  const isExit = variants.includes('exit') || variants.includes('exit-small');

  if (isExit) {
    if (!hasSeenModal(modalId, variants)) {
      registerExitIntent({ dataset: { fragmentPath, modalId }, fragmentPath }, variants);
    }
    return;
  }

  if (isAutoOpen) {
    if (!hasSeenModal(modalId, variants)) {
      const timerId = setTimeout(() => {
        if (!block.isConnected) return;
        openModal({ dataset: { fragmentPath, modalId }, fragmentPath }, variants).catch(() => {});
      }, 500);
      block.modalAutoOpenTimer = timerId;
    }
    return;
  }

  // Standard: render trigger button
  const button = document.createElement('button');
  button.className = 'modal-trigger';
  button.type = 'button';
  button.textContent = openLabel;
  button.dataset.fragmentPath = fragmentPath;
  button.dataset.modalId = modalId;
  button.addEventListener('click', () => openModal(button, variants).catch(() => {}));

  block.append(button);
}

export { openModal, closeModal };
