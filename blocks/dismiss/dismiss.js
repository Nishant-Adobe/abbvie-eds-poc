function setCookie(name) {
  const expires = new Date(Date.now() + 365 * 864e5).toUTCString();
  document.cookie = `${encodeURIComponent(name)}=1;expires=${expires};path=/;SameSite=Lax`;
}

function hasCookie(name) {
  return document.cookie.split(';').some((c) => c.trim().startsWith(`${encodeURIComponent(name)}=`));
}

function deleteCookie(name) {
  document.cookie = `${encodeURIComponent(name)}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/;SameSite=Lax`;
}

function readFields(block) {
  const rows = [...block.children];
  const fields = { cookieName: '', closeLabel: '', resetOnLoad: false };
  const toRemove = [];

  rows.forEach((row) => {
    if (row.querySelector('strong, em, a')) return;
    const text = row.textContent.trim();
    if (!text) return;
    toRemove.push(row);
    if (text === 'true' || text === 'false') {
      fields.resetOnLoad = text === 'true';
    } else if (!fields.cookieName) {
      fields.cookieName = text;
    } else if (!fields.closeLabel) {
      fields.closeLabel = text;
    }
  });

  toRemove.forEach((r) => r.remove());
  return fields;
}

export default function decorate(block) {
  const { cookieName, closeLabel, resetOnLoad } = readFields(block);

  const key = cookieName || `dismiss-${window.location.pathname}`;

  if (resetOnLoad) {
    deleteCookie(key);
  } else if (hasCookie(key)) {
    block.closest('.section')?.remove();
    return;
  }

  const closeBtn = document.createElement('button');
  closeBtn.className = 'dismiss-close';
  closeBtn.type = 'button';
  closeBtn.setAttribute('aria-label', closeLabel || 'Close');

  block.append(closeBtn);

  closeBtn.addEventListener('click', () => {
    const section = block.closest('.section');
    setCookie(key);
    block.classList.add('dismiss-is-closing');
    setTimeout(() => section?.remove(), 300);
  });
}
