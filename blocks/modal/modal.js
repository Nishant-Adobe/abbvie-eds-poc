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
  document.cookie = `${name}=${value};expires=${d.toUTCString()};path=/`;
}

function getCookie(name) {
  const match = document.cookie.match(new RegExp(`(^| )${name}=([^;]+)`));
  return match ? match[2] : null;
}

function hasSeenModal(modalId, variants) {
  if (variants.includes('once')) {
    return getCookie(`modal-seen-${modalId}`) === '1';
  }
  if (variants.includes('once-session')) {
    return sessionStorage.getItem(`modal-seen-${modalId}`) === '1';
  }
  return false;
}

function markModalSeen(modalId, variants) {
  if (variants.includes('once')) {
    setCookie(`modal-seen-${modalId}`, '1', 365);
  }
  if (variants.includes('once-session')) {
    sessionStorage.setItem(`modal-seen-${modalId}`, '1');
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
    if (modal) openModal(modal.trigger, modal.variants);
  }, { once: true });
}

/* ------------------------------------------------------------------ */
/* data-modal-id trigger support                                       */
/* ------------------------------------------------------------------ */

function setupGlobalTriggers() {
  document.addEventListener('click', (e) => {
    const trigger = e.target.closest('[data-modal-id]');
    if (!trigger) return;
    const modalId = trigger.dataset.modalId;
    const block = document.querySelector(`.modal[data-modal-id="${modalId}"]`);
    if (!block) return;

    e.preventDefault();
    const variants = [...block.classList]
      .filter((c) => c !== 'modal' && c !== 'block')
      .map((c) => c.replace('modal-', ''));
    const fragmentPath = block.dataset.fragmentPath;
    openModal({ dataset: { fragmentPath, modalId }, fragmentPath }, variants);
  });
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

  const rows = [...block.querySelectorAll(':scope > div')];

  let fragmentPath;
  let openLabel;
  let modalId;

  if (rows[0]?.children.length >= 2) {
    const config = {};
    rows.forEach((row) => {
      const key = row.children[0]?.textContent?.trim();
      const value = row.children[1]?.textContent?.trim();
      if (key && value) config[key] = value;
    });
    modalId = config.modalId || config['modal-id'] || '';
    fragmentPath = config.fragmentPath || config['fragment-path'];
    openLabel = config.openLabel || config['open-label'] || 'Open modal';
  } else {
    modalId = rows[0]?.children[0]?.textContent?.trim() || '';
    fragmentPath = rows[1]?.querySelector('a')?.getAttribute('href')
      || rows[1]?.children[0]?.textContent?.trim();
    openLabel = rows[2]?.children[0]?.textContent?.trim() || 'Open modal';
  }

  if (!fragmentPath) return;

  // Extract variants from block classes
  const variants = [...block.classList]
    .filter((c) => c !== 'modal' && c !== 'block')
    .map((c) => c.replace('modal-', ''));

  // Store data on block for global trigger lookup
  block.dataset.modalId = modalId;
  block.dataset.fragmentPath = fragmentPath;

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
      setTimeout(() => {
        openModal({ dataset: { fragmentPath, modalId }, fragmentPath }, variants);
      }, 500);
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
  button.addEventListener('click', () => openModal(button, variants));

  block.append(button);
}
