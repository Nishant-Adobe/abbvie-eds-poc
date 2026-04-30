function parseBlock(block) {
  const config = {};
  const items = [];
  let currentItem = null;
  const configFields = new Set([
    'heading', 'description', 'sliderPrompt',
    'beforeLabelPrefix', 'afterLabelPrefix', 'anchorId', 'analyticsId',
    'classes', 'variant',
  ]);
  const itemFields = new Set([
    'tabLabel', 'thumbnail', 'thumbnailAlt', 'thumbnailLabel',
    'thumbnailSubLabel', 'beforeImage', 'beforeAlt', 'afterImage', 'afterAlt',
  ]);
  [...block.children].forEach((row) => {
    const cells = [...row.children];
    const rawKey = cells[0]?.textContent?.trim() || '';
    const camelKey = rawKey
      .replace(/[-\s]+(.)/g, (_, c) => c.toUpperCase())
      .replace(/^(.)/, (c) => c.toLowerCase());
    if (camelKey === 'tabLabel' || camelKey === 'tab-label') {
      currentItem = { tabLabel: cells[1]?.textContent?.trim() || '' };
      items.push(currentItem);
      return;
    }
    if (currentItem && itemFields.has(camelKey)) {
      const imgEl = cells[1]?.querySelector('img, picture img');
      if (imgEl && (camelKey === 'thumbnail' || camelKey === 'beforeImage' || camelKey === 'afterImage')) {
        currentItem[camelKey] = imgEl.src || '';
        const altKey = `${camelKey.replace('Image', '')}Alt`;
        if (!currentItem[altKey]) currentItem[altKey] = imgEl.alt || '';
      } else {
        currentItem[camelKey] = cells[1]?.textContent?.trim() || '';
      }
      return;
    }
    if (configFields.has(camelKey) || !currentItem) {
      if (camelKey === 'description') {
        config[camelKey] = cells[1]?.innerHTML?.trim() || '';
      } else {
        config[camelKey] = cells[1]?.textContent?.trim() || '';
      }
    }
  });
  const tabMap = new Map();
  items.forEach((item) => {
    const label = item.tabLabel || 'Default';
    if (!tabMap.has(label)) tabMap.set(label, []);
    tabMap.get(label).push(item);
  });
  config.tabs = [...tabMap.entries()].map(([label, images], i) => ({
    tabLabel: label,
    openDefault: i === 0,
    images,
  }));
  return config;
}

function buildTabs(config, isToggle, onTabSwitch) {
  const nav = document.createElement('div');
  nav.className = `before-after-gallery-tabs${isToggle ? ' before-after-gallery-toggle' : ''}`;
  nav.setAttribute('role', 'tablist');
  config.tabs.forEach((tab, i) => {
    const btn = document.createElement('button');
    btn.className = 'before-after-gallery-tab';
    btn.setAttribute('role', 'tab');
    btn.setAttribute('aria-selected', String(tab.openDefault));
    btn.setAttribute('aria-controls', `bag-panel-${i}`);
    btn.id = `bag-tab-${i}`;
    btn.textContent = tab.tabLabel;
    if (tab.openDefault) btn.classList.add('is-active');
    btn.addEventListener('click', () => {
      nav.querySelectorAll('.before-after-gallery-tab').forEach((b) => {
        b.classList.remove('is-active');
        b.setAttribute('aria-selected', 'false');
      });
      btn.classList.add('is-active');
      btn.setAttribute('aria-selected', 'true');
      onTabSwitch(i);
    });
    btn.addEventListener('keydown', (e) => {
      const allTabs = [...nav.querySelectorAll('.before-after-gallery-tab')];
      const idx = allTabs.indexOf(btn);
      if (e.key === 'ArrowRight') allTabs[(idx + 1) % allTabs.length]?.focus();
      if (e.key === 'ArrowLeft') allTabs[(idx - 1 + allTabs.length) % allTabs.length]?.focus();
    });
    nav.append(btn);
  });
  return nav;
}

function buildThumbnails(images, onSelect) {
  const grid = document.createElement('div');
  grid.className = 'before-after-gallery-thumbnails';
  images.forEach((img, i) => {
    const thumb = document.createElement('button');
    thumb.className = 'before-after-gallery-thumb';
    thumb.type = 'button';
    if (i === 0) thumb.classList.add('is-active');
    thumb.setAttribute('aria-label', img.thumbnailLabel || `Image ${i + 1}`);
    if (img.thumbnail) {
      const pic = document.createElement('img');
      pic.className = 'before-after-gallery-thumb-image';
      pic.src = img.thumbnail;
      pic.alt = img.thumbnailAlt || img.thumbnailLabel || '';
      pic.loading = 'lazy';
      thumb.append(pic);
    }
    if (img.thumbnailLabel) {
      const lbl = document.createElement('span');
      lbl.className = 'before-after-gallery-thumb-label';
      lbl.textContent = img.thumbnailLabel;
      thumb.append(lbl);
    }
    if (img.thumbnailSubLabel) {
      const sub = document.createElement('span');
      sub.className = 'before-after-gallery-thumb-sublabel';
      sub.textContent = img.thumbnailSubLabel;
      thumb.append(sub);
    }
    thumb.addEventListener('click', () => {
      grid.querySelectorAll('.before-after-gallery-thumb').forEach((t) => t.classList.remove('is-active'));
      thumb.classList.add('is-active');
      onSelect(i);
    });
    grid.append(thumb);
  });
  return grid;
}

function buildSlider(config) {
  const slider = document.createElement('div');
  slider.className = 'before-after-gallery-slider';
  const afterEl = document.createElement('div');
  afterEl.className = 'before-after-gallery-after';
  const afterImg = document.createElement('img');
  afterImg.setAttribute('aria-hidden', 'true');
  afterEl.append(afterImg);
  const beforeEl = document.createElement('div');
  beforeEl.className = 'before-after-gallery-before';
  const beforeImg = document.createElement('img');
  beforeImg.setAttribute('aria-hidden', 'true');
  beforeEl.append(beforeImg);
  const labels = document.createElement('div');
  labels.className = 'before-after-gallery-labels';
  const lblBefore = document.createElement('span');
  lblBefore.className = 'before-after-gallery-label-before';
  lblBefore.textContent = config.beforeLabelPrefix || 'BEFORE';
  const lblAfter = document.createElement('span');
  lblAfter.className = 'before-after-gallery-label-after';
  lblAfter.textContent = config.afterLabelPrefix || 'AFTER';
  labels.append(lblBefore, lblAfter);
  const handle = document.createElement('div');
  handle.className = 'before-after-gallery-handle';
  handle.setAttribute('role', 'slider');
  handle.setAttribute('aria-label', config.sliderPrompt || 'Drag to compare');
  handle.setAttribute('aria-valuenow', '50');
  handle.setAttribute('aria-valuemin', '0');
  handle.setAttribute('aria-valuemax', '100');
  handle.setAttribute('tabindex', '0');
  const prompt = document.createElement('div');
  prompt.className = 'before-after-gallery-prompt';
  prompt.textContent = config.sliderPrompt || 'CLICK AND DRAG TO SEE RESULTS';
  slider.append(afterEl, beforeEl, labels, handle, prompt);
  function setPosition(pct) {
    const clamped = Math.max(0, Math.min(100, pct));
    slider.style.setProperty('--compare-position', `${clamped}%`);
    handle.setAttribute('aria-valuenow', String(Math.round(clamped)));
  }
  setPosition(50);
  function getPercent(clientX) {
    const rect = slider.getBoundingClientRect();
    return ((clientX - rect.left) / rect.width) * 100;
  }
  let dragging = false;
  function hidePrompt() {
    if (prompt.parentElement) prompt.classList.add('is-hidden');
  }
  slider.addEventListener('pointerdown', (e) => {
    dragging = true;
    slider.setPointerCapture(e.pointerId);
    setPosition(getPercent(e.clientX));
    hidePrompt();
  });
  slider.addEventListener('pointermove', (e) => {
    if (dragging) setPosition(getPercent(e.clientX));
  });
  slider.addEventListener('pointerup', () => { dragging = false; });
  slider.addEventListener('pointercancel', () => { dragging = false; });
  handle.addEventListener('keydown', (e) => {
    const current = parseFloat(slider.style.getPropertyValue('--compare-position') || '50');
    if (e.key === 'ArrowLeft') { setPosition(current - 5); hidePrompt(); }
    if (e.key === 'ArrowRight') { setPosition(current + 5); hidePrompt(); }
  });
  function loadImages(imageData) {
    afterImg.src = imageData.afterImage || '';
    afterImg.alt = imageData.afterAlt || '';
    beforeImg.src = imageData.beforeImage || '';
    beforeImg.alt = imageData.beforeAlt || '';
    setPosition(50);
  }
  return { slider, loadImages };
}

export default function decorate(block) {
  const config = parseBlock(block);
  const isToggle = block.classList.contains('toggle');
  if (config.anchorId) block.id = config.anchorId;
  if (config.analyticsId) block.setAttribute('data-analytics', config.analyticsId);
  const wrapper = document.createElement('div');
  wrapper.className = 'before-after-gallery-wrapper';
  if (config.heading) {
    const h2 = document.createElement('h2');
    h2.className = 'before-after-gallery-heading';
    h2.textContent = config.heading;
    wrapper.append(h2);
  }
  if (config.description) {
    const desc = document.createElement('div');
    desc.className = 'before-after-gallery-description';
    desc.innerHTML = config.description;
    wrapper.append(desc);
  }
  if (!config.tabs.length) {
    const msg = document.createElement('p');
    msg.className = 'before-after-gallery-empty';
    msg.textContent = 'Add Before After Gallery Items to display the gallery.';
    wrapper.append(msg);
    block.replaceChildren(wrapper);
    return;
  }
  const result = buildSlider(config);
  const content = document.createElement('div');
  content.className = 'before-after-gallery-content';
  content.append(result.slider);
  let thumbnailGrid = null;
  function renderTab(tabIdx) {
    const tab = config.tabs[tabIdx];
    if (!tab) return;
    if (thumbnailGrid) thumbnailGrid.remove();
    thumbnailGrid = buildThumbnails(tab.images, (imgIdx) => {
      result.loadImages(tab.images[imgIdx]);
    });
    content.append(thumbnailGrid);
    if (tab.images.length) result.loadImages(tab.images[0]);
  }
  if (config.tabs.length > 1) {
    const tabs = buildTabs(config, isToggle, (idx) => {
      renderTab(idx);
    });
    wrapper.append(tabs);
  }
  wrapper.append(content);
  renderTab(0);
  block.replaceChildren(wrapper);
}
