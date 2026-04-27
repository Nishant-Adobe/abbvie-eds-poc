function parseConfig(block) {
  const config = {};
  const tabs = [];
  let currentTab = null;

  [...block.children].forEach((row) => {
    const cells = [...row.children];
    const key = cells[0]?.textContent.trim();
    const val = cells[1]?.innerHTML?.trim() || cells[1]?.textContent?.trim() || '';
    const camelKey = key.replace(/[-\s]+(.)/g, (_, c) => c.toUpperCase()).replace(/^(.)/, (c) => c.toLowerCase());

    if (camelKey === 'tab') {
      currentTab = { tabLabel: val, openDefault: false, images: [] };
      tabs.push(currentTab);
    } else if (camelKey === 'openDefault' && currentTab) {
      currentTab.openDefault = val === 'true';
    } else if (camelKey === 'image' && currentTab) {
      currentTab.images.push({});
    } else if (currentTab && currentTab.images.length > 0) {
      const img = currentTab.images[currentTab.images.length - 1];
      if (camelKey === 'thumbnail' || camelKey === 'beforeImage' || camelKey === 'afterImage') {
        const imgEl = cells[1]?.querySelector('img');
        img[camelKey] = imgEl?.src || val;
        if (camelKey === 'thumbnail') img.thumbnailAlt = imgEl?.alt || '';
        if (camelKey === 'beforeImage') img.beforeAlt = imgEl?.alt || '';
        if (camelKey === 'afterImage') img.afterAlt = imgEl?.alt || '';
      } else {
        img[camelKey] = val;
      }
    } else {
      config[camelKey] = val;
    }
  });

  if (!tabs.some((t) => t.openDefault) && tabs.length) tabs[0].openDefault = true;
  config.tabs = tabs;
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
      const tabs = [...nav.querySelectorAll('.before-after-gallery-tab')];
      const idx = tabs.indexOf(btn);
      if (e.key === 'ArrowRight') tabs[(idx + 1) % tabs.length]?.focus();
      if (e.key === 'ArrowLeft') tabs[(idx - 1 + tabs.length) % tabs.length]?.focus();
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
  prompt.textContent = config.sliderPrompt || 'Click and drag to see results';

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
    if (prompt.parentElement) {
      prompt.classList.add('is-hidden');
    }
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
  const config = parseConfig(block);
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

  const { slider, loadImages } = buildSlider(config);
  const content = document.createElement('div');
  content.className = 'before-after-gallery-content';

  let activeTabIdx = config.tabs.findIndex((t) => t.openDefault);
  if (activeTabIdx < 0) activeTabIdx = 0;

  let thumbnailGrid = null;

  function renderTab(tabIdx) {
    const tab = config.tabs[tabIdx];
    if (!tab) return;
    if (thumbnailGrid) thumbnailGrid.remove();
    thumbnailGrid = buildThumbnails(tab.images, (imgIdx) => {
      loadImages(tab.images[imgIdx]);
    });
    content.append(thumbnailGrid);
    if (tab.images.length) loadImages(tab.images[0]);
  }

  if (config.tabs.length > 1) {
    const tabs = buildTabs(config, isToggle, (idx) => {
      activeTabIdx = idx;
      renderTab(idx);
    });
    wrapper.append(tabs);
  }

  content.append(slider);
  wrapper.append(content);
  renderTab(activeTabIdx);

  block.replaceChildren(wrapper);
}
