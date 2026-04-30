export default function decorate(block) {
  const rows = [...block.children];
  const [beforeRow, afterRow] = rows;

  const beforeImg = beforeRow?.querySelector('img');
  const beforeLabel = [...beforeRow?.children || []].find((c) => !c.querySelector('img'))?.textContent.trim();
  const afterImg = afterRow?.querySelector('img');
  const afterLabel = [...afterRow?.children || []].find((c) => !c.querySelector('img'))?.textContent.trim();

  if (!beforeImg || !afterImg) return;

  beforeImg.setAttribute('aria-hidden', 'true');
  afterImg.setAttribute('aria-hidden', 'true');

  const container = document.createElement('div');
  container.className = 'image-compare-container';

  const afterEl = document.createElement('div');
  afterEl.className = 'image-compare-after';
  afterEl.append(afterImg);
  if (afterLabel) {
    const lbl = document.createElement('span');
    lbl.className = 'image-compare-label image-compare-label-after';
    lbl.textContent = afterLabel;
    afterEl.append(lbl);
  }

  const beforeEl = document.createElement('div');
  beforeEl.className = 'image-compare-before';
  beforeEl.append(beforeImg);
  if (beforeLabel) {
    const lbl = document.createElement('span');
    lbl.className = 'image-compare-label image-compare-label-before';
    lbl.textContent = beforeLabel;
    beforeEl.append(lbl);
  }

  const handle = document.createElement('div');
  handle.className = 'image-compare-handle';
  handle.setAttribute('role', 'slider');
  handle.setAttribute('aria-label', 'Image comparison slider');
  handle.setAttribute('aria-valuenow', '50');
  handle.setAttribute('aria-valuemin', '0');
  handle.setAttribute('aria-valuemax', '100');
  handle.setAttribute('tabindex', '0');

  container.append(afterEl, beforeEl, handle);
  block.replaceChildren(container);

  let isDragging = false;

  function setPosition(percent) {
    const clamped = Math.max(0, Math.min(100, percent));
    container.style.setProperty('--compare-position', `${clamped}%`);
    handle.setAttribute('aria-valuenow', String(Math.round(clamped)));
  }

  setPosition(50);

  function getPercent(clientX) {
    const rect = container.getBoundingClientRect();
    return ((clientX - rect.left) / rect.width) * 100;
  }

  handle.addEventListener('mousedown', () => { isDragging = true; });
  handle.addEventListener('touchstart', () => { isDragging = true; }, { passive: true });

  window.addEventListener('mousemove', (e) => { if (isDragging) setPosition(getPercent(e.clientX)); });
  window.addEventListener('touchmove', (e) => { if (isDragging) setPosition(getPercent(e.touches[0].clientX)); }, { passive: true });
  window.addEventListener('mouseup', () => { isDragging = false; });
  window.addEventListener('touchend', () => { isDragging = false; });

  handle.addEventListener('keydown', (e) => {
    const current = parseFloat(container.style.getPropertyValue('--compare-position') || '50');
    if (e.key === 'ArrowLeft') setPosition(current - 5);
    if (e.key === 'ArrowRight') setPosition(current + 5);
  });
}
