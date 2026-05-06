import {
  buildBlock,
  decorateBlock as aemDecorateBlock,
  loadBlock,
  loadCSS,
} from '../../scripts/aem.js';
import { loadFragment } from '../fragment/fragment.js';

/*
  Modal block — supports both programmatic API (createModal / openModal)
  and inline-authored content decorated via the standard block pipeline.

  Trigger: any element with [data-modal-id="<id>"] opens the matching modal.
  Variants (block classes): panel | exit | exit-small | once | once-session |
                             force | information | image | indication
*/

function getFocusableElements(container) {
  return [...container.querySelectorAll(
    'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])',
  )];
}

function trapFocus(dialog) {
  dialog.addEventListener('keydown', (e) => {
    if (e.key !== 'Tab') return;
    const focusable = getFocusableElements(dialog);
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
}

function readCookie(name) {
  return document.cookie.split('; ').find((r) => r.startsWith(`${name}=`))?.split('=')[1];
}

function writeCookie(name, session = false) {
  const expires = session ? '' : '; max-age=31536000';
  document.cookie = `${name}=1; path=/${expires}`;
}

/**
 * Creates a modal dialog programmatically.
 * Used by other blocks (e.g. footer links) to open modals from content nodes.
 * @param {Node[]} contentNodes
 * @param {{ onConfirm?: () => void, modalType?: string }} [opts]
 */
export async function createModal(contentNodes, opts = {}) {
  await loadCSS(`${window.hlx.codeBasePath}/blocks/modal/modal.css`);
  const dialog = document.createElement('dialog');
  const { onConfirm, modalType } = opts;
  if (modalType) dialog.dataset.modalType = modalType;

  const dialogContent = document.createElement('div');
  dialogContent.classList.add('modal-content');
  dialogContent.append(...contentNodes);
  dialog.append(dialogContent);

  if (typeof onConfirm === 'function') {
    dialogContent.addEventListener('click', (e) => {
      const trigger = e.target.closest('[data-modal-action="confirm"]');
      if (!trigger) return;
      e.preventDefault();
      onConfirm();
      dialog.close();
    });
  }

  const closeButton = document.createElement('button');
  closeButton.classList.add('close-button');
  closeButton.setAttribute('aria-label', 'Close');
  closeButton.type = 'button';
  closeButton.innerHTML = '<span class="icon icon-close"></span>';
  closeButton.addEventListener('click', () => dialog.close());
  dialog.prepend(closeButton);

  const block = buildBlock('modal', '');
  document.querySelector('main').append(block);
  aemDecorateBlock(block);
  await loadBlock(block);

  dialog.addEventListener('click', ({ clientX, clientY }) => {
    const {
      left, right, top, bottom,
    } = dialog.getBoundingClientRect();
    if (clientX < left || clientX > right || clientY < top || clientY > bottom) {
      dialog.close();
    }
  });

  dialog.addEventListener('close', () => {
    document.body.classList.remove('modal-open');
    block.remove();
  });

  block.innerHTML = '';
  block.append(dialog);

  return {
    block,
    showModal: () => {
      dialog.showModal();
      setTimeout(() => { dialogContent.scrollTop = 0; }, 0);
      document.body.classList.add('modal-open');
    },
  };
}

/**
 * Opens a modal with content loaded from a fragment URL.
 * @param {string} fragmentUrl
 * @param {{ onConfirm?: () => void, modalType?: string }} [options]
 */
export async function openModal(fragmentUrl, options = {}) {
  const path = fragmentUrl.startsWith('http')
    ? new URL(fragmentUrl, window.location).pathname
    : fragmentUrl;
  const fragment = await loadFragment(path);
  if (!fragment) throw new Error(`Modal: fragment not found at ${path}`);
  const { showModal } = await createModal([...fragment.childNodes], options);
  showModal();
}

/**
 * Decorates a modal block with inline authored content.
 *
 * Content model (block rows):
 *   Row 0 — col 0: modalId  |  col 1: close button label (optional, default "Close")
 *   Row 1+ — modal body content (rich text, images, etc.)
 *
 * @param {HTMLElement} block
 */
export async function decorateBlock(block) {
  const rows = [...block.children];
  if (!rows.length) return; // empty block created by createModal API — skip

  const configRow = rows[0];
  const modalId = configRow.children[0]?.textContent.trim() || '';
  const closeLabel = configRow.children[1]?.textContent.trim() || 'Close';

  const isPanel = block.classList.contains('panel');
  const isForce = block.classList.contains('force');
  const isOnce = block.classList.contains('once');
  const isOnceSession = block.classList.contains('once-session');
  const isExit = block.classList.contains('exit') || block.classList.contains('exit-small');

  const dialog = document.createElement('dialog');
  dialog.setAttribute('role', 'dialog');
  dialog.setAttribute('aria-modal', 'true');

  if (modalId) {
    dialog.dataset.modalId = modalId;
    block.dataset.modalId = modalId;
  }

  const closeButton = document.createElement('button');
  closeButton.classList.add('close-button');
  closeButton.setAttribute('aria-label', closeLabel);
  closeButton.type = 'button';
  closeButton.innerHTML = '<span class="icon icon-close"></span>';

  const contentWrapper = document.createElement('div');
  contentWrapper.classList.add('modal-content');
  rows.slice(1).forEach((row) => contentWrapper.append(...row.children));

  dialog.append(closeButton, contentWrapper);

  if (!isPanel) {
    dialog.addEventListener('click', ({ target }) => {
      if (target === dialog) dialog.close();
    });
  }

  if (isForce) {
    dialog.addEventListener('cancel', (e) => e.preventDefault());
  }

  trapFocus(dialog);

  const cookieKey = `modal-${modalId}`;

  function openDialog() {
    if ((isOnce || isOnceSession) && readCookie(cookieKey)) return;
    dialog.showModal();
    document.body.classList.add('modal-open');
    const focusable = getFocusableElements(dialog);
    if (focusable.length) focusable[0].focus();
  }

  function closeDialog() {
    dialog.close();
    document.body.classList.remove('modal-open');
    if (isOnce) writeCookie(cookieKey, false);
    if (isOnceSession) writeCookie(cookieKey, true);
  }

  closeButton.addEventListener('click', closeDialog);

  dialog.addEventListener('close', () => {
    document.body.classList.remove('modal-open');
    if (isOnce) writeCookie(cookieKey, false);
    if (isOnceSession) writeCookie(cookieKey, true);
  });

  // Wire [data-modal-id] triggers anywhere on the page
  if (modalId) {
    document.addEventListener('click', (e) => {
      const trigger = e.target.closest(`[data-modal-id="${modalId}"]`);
      if (trigger && !block.contains(trigger)) {
        e.preventDefault();
        openDialog();
      }
    });
  }

  // Auto-open variants
  if (isForce || isOnce || isOnceSession) {
    if (document.readyState === 'complete') {
      openDialog();
    } else {
      window.addEventListener('load', openDialog);
    }
  }

  // Exit-intent: open when cursor leaves the top of the viewport
  if (isExit) {
    document.addEventListener('mouseleave', (e) => {
      if (e.clientY <= 0) openDialog();
    }, { once: true });
  }

  // Expose for programmatic use by other blocks
  block.openModal = openDialog;
  block.closeModal = closeDialog;

  block.innerHTML = '';
  block.append(dialog);
}

export default async function decorate(block) {
  await decorateBlock(block);
}
