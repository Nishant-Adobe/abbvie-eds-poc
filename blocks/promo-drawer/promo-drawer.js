export default function decorate(block) {
  const rows = [...block.children];
  const isOnce = block.classList.contains('once');
  const drawerId = block.dataset.blockId?.replace('id:', '').trim()
    || block.id
    || 'promo-drawer';
  const storageKey = `promo-drawer-${drawerId}`;

  if (isOnce && sessionStorage.getItem(storageKey) === 'dismissed') {
    block.remove();
    return;
  }

  const [handleRow, contentRow] = rows;

  const handleLabel = handleRow?.textContent.trim() || 'Savings';
  handleRow?.remove();

  const handle = document.createElement('button');
  handle.className = 'promo-drawer-handle';
  handle.setAttribute('aria-expanded', 'false');
  handle.setAttribute('aria-controls', `${drawerId}-panel`);
  handle.textContent = handleLabel;

  const panel = document.createElement('div');
  panel.className = 'promo-drawer-panel';
  panel.id = `${drawerId}-panel`;
  panel.setAttribute('role', 'dialog');
  panel.setAttribute('aria-modal', 'false');
  if (contentRow) panel.append(contentRow);

  const closeBtn = document.createElement('button');
  closeBtn.className = 'promo-drawer-close';
  closeBtn.setAttribute('aria-label', 'Close');
  panel.prepend(closeBtn);

  block.replaceChildren(handle, panel);

  function open() {
    block.classList.add('is-open');
    handle.setAttribute('aria-expanded', 'true');
  }

  function close() {
    block.classList.remove('is-open');
    handle.setAttribute('aria-expanded', 'false');
    if (isOnce) sessionStorage.setItem(storageKey, 'dismissed');
  }

  handle.addEventListener('click', () => {
    if (block.classList.contains('is-open')) close();
    else open();
  });

  closeBtn.addEventListener('click', close);

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && block.classList.contains('is-open')) {
      close();
      handle.focus();
    }
  });

  if (!isOnce || !sessionStorage.getItem(storageKey)) {
    setTimeout(open, 1500);
  }
}
