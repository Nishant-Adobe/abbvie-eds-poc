/*
 * Modal Block
 * Fragment-based modal: each block instance renders a trigger button and
 * loads an EDS fragment into a shared overlay on demand.
 *
 * Authoring (key–value block table):
 *   | modalId       | promo-2025                        |
 *   | fragmentPath  | /us/en/fragments/promo-2025       |
 *   | openLabel     | Show offer                        |
 *
 * The fragment can contain any EDS blocks (text, buttons, accordion, etc.).
 * Multiple Modal blocks on one page each point to a different fragment.
 */

import { loadFragment } from '../fragment/fragment.js';

/* ------------------------------------------------------------------ */
/* Shared overlay (one instance per page)                              */
/* ------------------------------------------------------------------ */

let overlay = null;
let lastTrigger = null;

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
  const dialog = overlay.querySelector('.modal-dialog');
  dialog.setAttribute('aria-hidden', 'true');
  overlay.classList.remove('is-open');
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

  const closeBtn = document.createElement('button');
  closeBtn.className = 'modal-close';
  closeBtn.type = 'button';
  closeBtn.setAttribute('aria-label', 'Close modal');
  closeBtn.textContent = '✕';
  closeBtn.addEventListener('click', closeModal);

  const content = document.createElement('div');
  content.className = 'modal-content';

  dialog.append(closeBtn, content);
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
/* Open                                                                 */
/* ------------------------------------------------------------------ */

async function openModal(trigger) {
  lastTrigger = trigger;
  const { fragmentPath } = trigger.dataset;
  const ov = getOverlay();
  const dialog = ov.querySelector('.modal-dialog');
  const content = ov.querySelector('.modal-content');

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

  const focusable = getFocusable(dialog);
  if (focusable.length) focusable[0].focus();
  else dialog.focus();
}

/* ------------------------------------------------------------------ */
/* Block decoration                                                     */
/* ------------------------------------------------------------------ */

export default async function decorate(block) {
  const rows = [...block.querySelectorAll(':scope > div')];

  // v2/block: single-cell rows in field order (modalId, fragmentPath, openLabel)
  // v1/block: two-cell rows (key | value) — fall back to key-value parsing
  let fragmentPath;
  let openLabel;

  if (rows[0]?.children.length >= 2) {
    // v1/block key-value format
    const config = {};
    rows.forEach((row) => {
      const key = row.children[0]?.textContent?.trim();
      const value = row.children[1]?.textContent?.trim();
      if (key && value) config[key] = value;
    });
    fragmentPath = config.fragmentPath || config['fragment-path'];
    openLabel = config.openLabel || config['open-label'] || 'Open modal';
  } else {
    // v2/block single-cell format — row 0 = modalId, row 1 = fragmentPath, row 2 = openLabel
    fragmentPath = rows[1]?.querySelector('a')?.getAttribute('href')
      || rows[1]?.children[0]?.textContent?.trim();
    openLabel = rows[2]?.children[0]?.textContent?.trim() || 'Open modal';
  }

  if (!fragmentPath) return;

  block.innerHTML = '';

  const button = document.createElement('button');
  button.className = 'modal-trigger';
  button.type = 'button';
  button.textContent = openLabel;
  button.dataset.fragmentPath = fragmentPath;
  button.addEventListener('click', () => openModal(button));

  block.append(button);
}
