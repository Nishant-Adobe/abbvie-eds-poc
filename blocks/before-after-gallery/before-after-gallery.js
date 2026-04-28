function parseBlock(block) {
  const config = {};
  [...block.children].forEach((row) => {
    const cells = [...row.children];
    const rawKey = cells[0]?.textContent?.trim() || '';
    const camelKey = rawKey
      .replace(/[-\s]+(.)/g, (_, c) => c.toUpperCase())
      .replace(/^(.)/, (c) => c.toLowerCase());
    if (!camelKey) return;
    const imgEl = cells[1]?.querySelector('img, picture img');
    if (imgEl) {
      config[camelKey] = imgEl.src || '';
      const alt = imgEl.alt || '';
      if (!config[`${camelKey}Alt`]) config[`${camelKey}Alt`] = alt;
    } else if (camelKey === 'description') {
      config[camelKey] = cells[1]?.innerHTML?.trim() || '';
    } else {
      config[camelKey] = cells[1]?.textContent?.trim() || '';
    }
  });
  const tabs = [];
  [1, 2].forEach((t) => {
    const label = config[`tab${t}Label`];
    if (!label) return;
    const images = [];
    [1, 2, 3, 4].forEach((i) => {
      const prefix = `tab${t}Image${i}`;
      const before = config[`${prefix}Before`];
      const after = config[`${prefix}After`];
      if (!before && !after) return;
      images.push({
        thumbnail: config[`${prefix}Thumbnail`] || before || '',
        thumbnailAlt: config[`${prefix}ThumbnailAlt`] || '',
        thumbnailLabel: config[`${prefix}Label`] || '',
        thumbnailSubLabel: config[`${prefix}SubLabel`] || '',
        beforeImage: before || '',
        beforeAlt: config[`${prefix}BeforeAlt`] || '',
        afterImage: after || '',
        afterAlt: config[`${prefix}AfterAlt`] || '',
        patientInfo: config[`${prefix}PatientInfo`] || '',
      });
    });
    if (images.length) {
      tabs.push({
        tabLabel: label,
        openDefault: t === 1,
        images,
      });
    }
  });
  config.tabs = tabs;
  return config;
}

function buildTabs(config, isToggle, onTabSwitch) {
  const nav = document.createElement('div');
  const cls = 'before-after-gallery-tabs';
  nav.className = isToggle ? `${cls} before-after-gallery-toggle` : cls;
  nav.setAttribute('role', 'tablist');
  config.tabs.forEach((tab, i) => {
    const btn = document.createElement('button');
    btn.className = 'before-after-gallery-tab';
    btn.setAttribute('role', 'tab');
    btn.setAttribute('aria-selected', String(tab.openDefault));
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
      const allTabs = [
        ...nav.querySelectorAll('.before-after-gallery-tab'),
      ];
      const idx = allTabs.indexOf(btn);
      if (e.key === 'ArrowRight') {
        allTabs[(idx + 1) % allTabs.length]?.focus();
      }
      if (e.key === 'ArrowLeft') {
        allTabs[(idx - 1 + allTabs.length) % allTabs.length]?.focus();
      }
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
    thumb.setAttribute(
      'aria-label',
      img.thumbnailLabel || `Image ${i + 1}`,
    );
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
      grid.querySelectorAll('.before-after-gallery-thumb').forEach((t) => {
        t.classList.remove('is-active');
      });
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
  handle.setAttribute(
    'aria-label',
    config.sliderPrompt || 'Drag to compare',
  );
  handle.setAttribute('aria-valuenow', '50');
  handle.setAttribute('aria-valuemin', '0');
  handle.setAttribute('aria-valuemax', '100');
  handle.setAttribute('tabindex', '0');

  const prompt = document.createElement('div');
  prompt.className = 'before-after-gallery-prompt';
  prompt.textContent = config.sliderPrompt
    || 'CLICK AND DRAG TO SEE RESULTS';

  if (config.imageOverlayText) {
    const overlay = document.createElement('div');
    overlay.className = 'before-after-gallery-image-overlay';
    overlay.innerHTML = config.imageOverlayText;
    slider.append(overlay);
  }

  slider.append(afterEl, beforeEl, labels, handle, prompt);

  const startPct = parseInt(config.startPosition, 10) || 50;
  function setPosition(pct) {
    const clamped = Math.max(0, Math.min(100, pct));
    slider.style.setProperty('--compare-position', `${clamped}%`);
    handle.setAttribute('aria-valuenow', String(Math.round(clamped)));
  }
  setPosition(startPct);

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
    const val = slider.style.getPropertyValue('--compare-position');
    const current = parseFloat(val || '50');
    if (e.key === 'ArrowLeft') { setPosition(current - 5); hidePrompt(); }
    if (e.key === 'ArrowRight') { setPosition(current + 5); hidePrompt(); }
  });

  function loadImages(imageData) {
    afterImg.src = imageData.afterImage || '';
    afterImg.alt = imageData.afterAlt || '';
    beforeImg.src = imageData.beforeImage || '';
    beforeImg.alt = imageData.beforeAlt || '';
    setPosition(startPct);
  }

  return { slider, loadImages };
}

function buildBelowLabels(config) {
  const row = document.createElement('div');
  row.className = 'before-after-gallery-below-labels';
  const left = document.createElement('span');
  left.textContent = config.beforeLabelPrefix || 'BEFORE | WEEK 0';
  const right = document.createElement('span');
  right.textContent = config.afterLabelPrefix || 'AFTER | WEEK 16';
  row.append(left, right);
  return row;
}

function buildCta(config) {
  if (!config.ctaText) return null;
  const a = document.createElement('a');
  a.className = 'before-after-gallery-cta';
  a.href = config.ctaLink || '#';
  a.textContent = config.ctaText;
  return a;
}

function decorateSplit(block, config) {
  const wrapper = document.createElement('div');
  wrapper.className = 'before-after-gallery-wrapper';

  const descCol = document.createElement('div');
  descCol.className = 'before-after-gallery-desc-col';
  if (config.heading) {
    const h2 = document.createElement('h2');
    h2.className = 'before-after-gallery-heading';
    h2.innerHTML = config.heading;
    descCol.append(h2);
  }
  if (config.description) {
    const desc = document.createElement('div');
    desc.className = 'before-after-gallery-description';
    desc.innerHTML = config.description;
    descCol.append(desc);
  }
  const cta = buildCta(config);
  if (cta) descCol.append(cta);

  const { slider, loadImages } = buildSlider(config);
  const sliderCol = document.createElement('div');
  sliderCol.className = 'before-after-gallery-slider-col';
  sliderCol.append(slider);

  const belowLabels = buildBelowLabels(config);
  sliderCol.append(belowLabels);

  const patientEl = document.createElement('div');
  patientEl.className = 'before-after-gallery-patient-info';
  sliderCol.append(patientEl);

  const columns = document.createElement('div');
  columns.className = 'before-after-gallery-columns';
  columns.append(descCol, sliderCol);
  wrapper.append(columns);

  if (!config.tabs.length) {
    block.replaceChildren(wrapper);
    return;
  }

  let thumbnailGrid = null;
  function renderTab(tabIdx) {
    const tab = config.tabs[tabIdx];
    if (!tab) return;
    if (thumbnailGrid) thumbnailGrid.remove();
    thumbnailGrid = buildThumbnails(tab.images, (imgIdx) => {
      loadImages(tab.images[imgIdx]);
      patientEl.textContent = tab.images[imgIdx].patientInfo || '';
    });
    wrapper.append(thumbnailGrid);
    if (tab.images.length) {
      loadImages(tab.images[0]);
      patientEl.textContent = tab.images[0].patientInfo || '';
    }
  }

  if (config.tabs.length > 1) {
    const tabs = buildTabs(config, false, renderTab);
    wrapper.prepend(tabs);
  }

  renderTab(0);
  block.replaceChildren(wrapper);
}

function decorateDefault(block, config, isToggle) {
  const wrapper = document.createElement('div');
  wrapper.className = 'before-after-gallery-wrapper';
  if (config.heading) {
    const h2 = document.createElement('h2');
    h2.className = 'before-after-gallery-heading';
    h2.innerHTML = config.heading;
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
    msg.textContent = 'Fill in Tab 1 and Tab 2 image fields.';
    wrapper.append(msg);
    block.replaceChildren(wrapper);
    return;
  }

  const { slider, loadImages } = buildSlider(config);
  const content = document.createElement('div');
  content.className = 'before-after-gallery-content';
  content.append(slider);

  if (config.instructionText) {
    const instr = document.createElement('div');
    instr.className = 'before-after-gallery-instruction';
    instr.textContent = config.instructionText;
    content.append(instr);
  }

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

  const tabsBelow = config.tabPosition === 'bottom';
  let tabsEl = null;
  if (config.tabs.length > 1) {
    tabsEl = buildTabs(config, isToggle, renderTab);
    if (!tabsBelow) wrapper.append(tabsEl);
  }

  wrapper.append(content);
  if (tabsEl && tabsBelow) wrapper.append(tabsEl);
  renderTab(0);
  block.replaceChildren(wrapper);
}

export default function decorate(block) {
  const config = parseBlock(block);
  const isSplit = block.classList.contains('split');
  const isToggle = block.classList.contains('toggle');

  if (config.anchorId) block.id = config.anchorId;
  if (config.analyticsId) {
    block.setAttribute('data-analytics', config.analyticsId);
  }

  if (isSplit) {
    decorateSplit(block, config);
  } else {
    decorateDefault(block, config, isToggle);
  }
}
