// eslint-disable-next-line max-len
function buildSlider(container, beforeSrc, afterSrc, beforeAlt, afterAlt, beforeLabel, afterLabel, initialPos) {
  container.innerHTML = '';
  const afterEl = document.createElement('div');
  afterEl.className = 'image-compare-after';
  const afterImg = document.createElement('img');
  afterImg.src = afterSrc;
  afterImg.alt = afterAlt;
  afterImg.setAttribute('aria-hidden', 'true');
  afterEl.append(afterImg);
  if (afterLabel) {
    const lbl = document.createElement('span');
    lbl.className = 'image-compare-label image-compare-label-after';
    lbl.textContent = afterLabel;
    afterEl.append(lbl);
  }

  const beforeEl = document.createElement('div');
  beforeEl.className = 'image-compare-before';
  const beforeImg = document.createElement('img');
  beforeImg.src = beforeSrc;
  beforeImg.alt = beforeAlt;
  beforeImg.setAttribute('aria-hidden', 'true');
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
  handle.setAttribute('aria-valuenow', String(initialPos));
  handle.setAttribute('aria-valuemin', '0');
  handle.setAttribute('aria-valuemax', '100');
  handle.setAttribute('tabindex', '0');

  container.append(afterEl, beforeEl, handle);
  container.style.setProperty('--compare-position', `${initialPos}%`);

  function setPosition(percent) {
    const clamped = Math.max(0, Math.min(100, percent));
    container.style.setProperty('--compare-position', `${clamped}%`);
    handle.setAttribute('aria-valuenow', String(Math.round(clamped)));
  }

  function getPercent(e) {
    const rect = container.getBoundingClientRect();
    const isVert = container.closest('.image-compare')?.classList.contains('vertical');
    if (isVert) return ((e.clientY - rect.top) / rect.height) * 100;
    return ((e.clientX - rect.left) / rect.width) * 100;
  }

  container.addEventListener('pointerdown', (e) => {
    container.setPointerCapture(e.pointerId);
    setPosition(getPercent(e));
  });
  container.addEventListener('pointermove', (e) => {
    if (container.hasPointerCapture(e.pointerId)) setPosition(getPercent(e));
  });
  container.addEventListener('pointerup', (e) => {
    container.releasePointerCapture(e.pointerId);
  });

  handle.addEventListener('keydown', (e) => {
    const current = parseFloat(container.style.getPropertyValue('--compare-position') || String(initialPos));
    const isVert = container.closest('.image-compare')?.classList.contains('vertical');
    const dec = isVert ? 'ArrowUp' : 'ArrowLeft';
    const inc = isVert ? 'ArrowDown' : 'ArrowRight';
    if (e.key === dec) setPosition(current - 5);
    if (e.key === inc) setPosition(current + 5);
  });

  return { setPosition };
}

function parseGalleryRows(block) {
  const config = {};
  const items = [];
  let currentItem = null;
  const configFields = new Set([
    'heading', 'description', 'sliderPrompt',
    'beforeLabelPrefix', 'afterLabelPrefix', 'anchorId',
  ]);
  const itemFields = new Set([
    'tabLabel', 'thumbnail', 'thumbnailAlt', 'thumbnailLabel',
    'thumbnailSubLabel', 'beforeImage', 'beforeAlt', 'afterImage', 'afterAlt',
  ]);

  [...block.children].forEach((row) => {
    const cells = [...row.children];
    const rawKey = cells[0]?.textContent?.trim() || '';
    const key = rawKey
      .replace(/[-\s]+(.)/g, (_, c) => c.toUpperCase())
      .replace(/^(.)/, (c) => c.toLowerCase());

    if (key === 'tabLabel') {
      currentItem = { tabLabel: cells[1]?.textContent?.trim() || '' };
      items.push(currentItem);
      return;
    }
    if (currentItem && itemFields.has(key)) {
      const imgEl = cells[1]?.querySelector('img, picture img');
      if (imgEl && ['thumbnail', 'beforeImage', 'afterImage'].includes(key)) {
        currentItem[key] = imgEl.src || '';
        if (!currentItem[`${key.replace('Image', '')}Alt`]) {
          currentItem[`${key.replace('Image', '')}Alt`] = imgEl.alt || '';
        }
      } else {
        currentItem[key] = cells[1]?.textContent?.trim() || '';
      }
      return;
    }
    if (configFields.has(key)) {
      config[key] = key === 'description'
        ? cells[1]?.innerHTML?.trim() || ''
        : cells[1]?.textContent?.trim() || '';
    }
  });

  const tabMap = new Map();
  items.forEach((item) => {
    const label = item.tabLabel || 'Default';
    if (!tabMap.has(label)) tabMap.set(label, []);
    tabMap.get(label).push(item);
  });
  config.tabs = [...tabMap.entries()].map(([label, images]) => ({ label, images }));
  return config;
}

function parseXWalkFields(block) {
  const rows = [...block.children];
  const config = {
    heading: '',
    description: '',
    sliderPrompt: '',
    beforeLabelPrefix: 'BEFORE',
    afterLabelPrefix: 'AFTER',
    tabs: [],
  };

  function getSrc(row) {
    if (!row) return '';
    const img = row.querySelector('img, picture img');
    return img ? img.src : '';
  }

  function getAlt(row) {
    if (!row) return '';
    const img = row.querySelector('img, picture img');
    return img ? img.alt || '' : '';
  }

  function getText(row) {
    if (!row) return '';
    return row.textContent.trim();
  }

  // XWalk renders model fields sequentially as rows.
  // Model field order: heading, description, sliderPrompt, beforeLabelPrefix,
  // afterLabelPrefix, beforeImage, beforeAlt, afterImage, afterAlt,
  // tab1Label, tab1Img1Before, tab1Img1After, tab1Img1Thumb, tab1Img1Label,
  // tab1Img1SubLabel, tab1Img2Before, tab1Img2After, tab1Img2Thumb,
  // tab1Img2Label, tab1Img2SubLabel, tab2Label, tab2Img1Before, ...
  // We parse by scanning rows in order and matching by content type.

  let idx = 0;

  // Skip empty rows at start
  while (idx < rows.length && !getText(rows[idx]) && !getSrc(rows[idx])) idx += 1;

  // heading (text)
  if (idx < rows.length && !getSrc(rows[idx])) {
    config.heading = getText(rows[idx]);
    idx += 1;
  }
  // description (text/html)
  if (idx < rows.length && !getSrc(rows[idx])) {
    config.description = rows[idx].innerHTML?.trim() || '';
    idx += 1;
  }
  // sliderPrompt (text)
  if (idx < rows.length && !getSrc(rows[idx])) {
    const val = getText(rows[idx]);
    if (val.toUpperCase().includes('DRAG') || val.toUpperCase().includes('CLICK')) {
      config.sliderPrompt = val;
      idx += 1;
    }
  }
  // beforeLabelPrefix (text)
  if (idx < rows.length && !getSrc(rows[idx])) {
    config.beforeLabelPrefix = getText(rows[idx]);
    idx += 1;
  }
  // afterLabelPrefix (text)
  if (idx < rows.length && !getSrc(rows[idx])) {
    config.afterLabelPrefix = getText(rows[idx]);
    idx += 1;
  }

  // Skip simple mode fields (beforeImage, beforeAlt, afterImage, afterAlt)
  // These may be empty or may have images — skip if present before tab fields
  const beforeSimple = getSrc(rows[idx]);
  if (beforeSimple && idx + 1 < rows.length) {
    // Check if next text row looks like alt text (short) followed by another image
    // Skip: beforeImage, beforeAlt, afterImage, afterAlt
    idx += 1; // beforeImage
    if (idx < rows.length && !getSrc(rows[idx])) idx += 1; // beforeAlt
    if (idx < rows.length && getSrc(rows[idx])) idx += 1; // afterImage
    if (idx < rows.length && !getSrc(rows[idx])) idx += 1; // afterAlt
  }

  // Now parse tab groups
  function parseTabGroup() {
    const images = [];
    let tabLabel = '';

    // tab label (text)
    if (idx < rows.length && !getSrc(rows[idx])) {
      tabLabel = getText(rows[idx]);
      idx += 1;
    }

    // Parse image sets: each set = before(img), after(img), thumb(img), label(text), subLabel(text)
    while (idx < rows.length) {
      const nextSrc = getSrc(rows[idx]);
      if (!nextSrc) break; // No more images = end of this tab's images

      const beforeImage = nextSrc;
      const beforeAltVal = getAlt(rows[idx]);
      idx += 1;

      let afterImage = '';
      let afterAltVal = '';
      if (idx < rows.length && getSrc(rows[idx])) {
        afterImage = getSrc(rows[idx]);
        afterAltVal = getAlt(rows[idx]);
        idx += 1;
      }

      let thumbnail = '';
      if (idx < rows.length && getSrc(rows[idx])) {
        thumbnail = getSrc(rows[idx]);
        idx += 1;
      }

      let imgLabel = '';
      if (idx < rows.length && !getSrc(rows[idx])) {
        imgLabel = getText(rows[idx]);
        idx += 1;
      }

      let imgSubLabel = '';
      if (idx < rows.length && !getSrc(rows[idx])) {
        const peek = getText(rows[idx]);
        if (peek && (peek.includes('%') || peek.length <= 20)) {
          imgSubLabel = peek;
          idx += 1;
        }
      }

      if (beforeImage && afterImage) {
        images.push({
          beforeImage,
          afterImage,
          beforeAlt: beforeAltVal,
          afterAlt: afterAltVal,
          thumbnail: thumbnail || beforeImage,
          thumbnailAlt: '',
          thumbnailLabel: imgLabel,
          thumbnailSubLabel: imgSubLabel,
        });
      }
    }

    return { label: tabLabel, images };
  }

  // Parse Tab 1
  if (idx < rows.length) {
    const tab1 = parseTabGroup();
    if (tab1.images.length) config.tabs.push(tab1);
  }

  // Parse Tab 2 (if more rows remain)
  if (idx < rows.length) {
    const tab2 = parseTabGroup();
    if (tab2.images.length) config.tabs.push(tab2);
  }

  return config;
}

function decorateGallery(block) {
  let config = parseGalleryRows(block);

  if (!config.tabs.length) {
    config = parseXWalkFields(block);
  }

  const isToggle = block.classList.contains('toggle');
  const hasPrompt = block.classList.contains('prompt');
  const initialPos = parseInt(block.dataset.initialPosition || '50', 10) || 50;

  const wrapper = document.createElement('div');
  wrapper.className = 'image-compare-wrapper';

  if (config.heading) {
    const h2 = document.createElement('h2');
    h2.className = 'image-compare-heading';
    h2.textContent = config.heading;
    wrapper.append(h2);
  }
  if (config.description) {
    const desc = document.createElement('div');
    desc.className = 'image-compare-description';
    desc.innerHTML = config.description;
    wrapper.append(desc);
  }

  if (!config.tabs.length) {
    wrapper.innerHTML += '<p>No images configured.</p>';
    block.replaceChildren(wrapper);
    return;
  }

  const sliderContainer = document.createElement('div');
  sliderContainer.className = 'image-compare-container';

  let promptEl = null;
  if (hasPrompt && config.sliderPrompt) {
    promptEl = document.createElement('div');
    promptEl.className = 'image-compare-prompt';
    promptEl.textContent = config.sliderPrompt;
    sliderContainer.addEventListener('pointerdown', () => promptEl.classList.add('is-hidden'), { once: true });
  }

  const content = document.createElement('div');
  content.className = 'image-compare-gallery-content';
  content.append(sliderContainer);
  if (promptEl) sliderContainer.append(promptEl);

  let thumbnailGrid = null;

  function renderTab(tabIdx) {
    const tab = config.tabs[tabIdx];
    if (!tab) return;
    if (thumbnailGrid) thumbnailGrid.remove();

    thumbnailGrid = document.createElement('div');
    thumbnailGrid.className = 'image-compare-thumbnails';

    tab.images.forEach((img, i) => {
      const btn = document.createElement('button');
      btn.className = 'image-compare-thumb';
      btn.type = 'button';
      if (i === 0) btn.classList.add('is-active');
      btn.setAttribute('aria-label', img.thumbnailLabel || `Image ${i + 1}`);

      if (img.thumbnail) {
        const pic = document.createElement('img');
        pic.className = 'image-compare-thumb-image';
        pic.src = img.thumbnail;
        pic.alt = img.thumbnailAlt || img.thumbnailLabel || '';
        pic.loading = 'lazy';
        btn.append(pic);
      }
      if (img.thumbnailLabel) {
        const lbl = document.createElement('span');
        lbl.className = 'image-compare-thumb-label';
        lbl.textContent = img.thumbnailLabel;
        btn.append(lbl);
      }
      if (img.thumbnailSubLabel) {
        const sub = document.createElement('span');
        sub.className = 'image-compare-thumb-sublabel';
        sub.textContent = img.thumbnailSubLabel;
        btn.append(sub);
      }

      btn.addEventListener('click', () => {
        thumbnailGrid.querySelectorAll('.image-compare-thumb').forEach((t) => t.classList.remove('is-active'));
        btn.classList.add('is-active');
        buildSlider(
          sliderContainer,
          img.beforeImage,
          img.afterImage,
          img.beforeAlt || '',
          img.afterAlt || '',
          config.beforeLabelPrefix || 'BEFORE',
          config.afterLabelPrefix || 'AFTER',
          initialPos,
        );
        if (promptEl) sliderContainer.append(promptEl);
      });
      thumbnailGrid.append(btn);
    });

    content.append(thumbnailGrid);
    if (tab.images.length) {
      const first = tab.images[0];
      buildSlider(
        sliderContainer,
        first.beforeImage,
        first.afterImage,
        first.beforeAlt || '',
        first.afterAlt || '',
        config.beforeLabelPrefix || 'BEFORE',
        config.afterLabelPrefix || 'AFTER',
        initialPos,
      );
      if (promptEl) sliderContainer.append(promptEl);
    }
  }

  if (config.tabs.length > 1) {
    const nav = document.createElement('div');
    nav.className = `image-compare-tabs${isToggle ? ' image-compare-tabs-toggle' : ''}`;
    nav.setAttribute('role', 'tablist');

    config.tabs.forEach((tab, i) => {
      const btn = document.createElement('button');
      btn.className = 'image-compare-tab';
      btn.setAttribute('role', 'tab');
      btn.setAttribute('aria-selected', String(i === 0));
      btn.textContent = tab.label;
      if (i === 0) btn.classList.add('is-active');

      btn.addEventListener('click', () => {
        nav.querySelectorAll('.image-compare-tab').forEach((b) => {
          b.classList.remove('is-active');
          b.setAttribute('aria-selected', 'false');
        });
        btn.classList.add('is-active');
        btn.setAttribute('aria-selected', 'true');
        renderTab(i);
      });
      nav.append(btn);
    });
    wrapper.append(nav);
  }

  wrapper.append(content);
  renderTab(0);
  block.replaceChildren(wrapper);
}

function decorateSimple(block) {
  const rows = [...block.children];

  let beforeSrc = '';
  let afterSrc = '';
  let beforeAlt = '';
  let afterAlt = '';
  let beforeLabel = '';
  let afterLabel = '';
  let initialPos = 50;

  if (rows.length >= 2) {
    const beforeRow = rows[0];
    const afterRow = rows[1];
    const posRow = rows[2];

    const beforeImg = beforeRow?.querySelector('img');
    const afterImg = afterRow?.querySelector('img');

    if (beforeImg) {
      beforeSrc = beforeImg.src;
      beforeAlt = beforeImg.alt || '';
    }
    if (afterImg) {
      afterSrc = afterImg.src;
      afterAlt = afterImg.alt || '';
    }

    const beforeCells = [...(beforeRow?.children || [])];
    beforeCells.forEach((cell) => {
      if (!cell.querySelector('img')) {
        const text = cell.textContent.trim();
        if (text && !beforeLabel) beforeLabel = text;
      }
    });

    const afterCells = [...(afterRow?.children || [])];
    afterCells.forEach((cell) => {
      if (!cell.querySelector('img')) {
        const text = cell.textContent.trim();
        if (text && !afterLabel) afterLabel = text;
      }
    });

    if (posRow) {
      const posText = posRow.textContent.trim();
      const parsed = parseInt(posText, 10);
      if (parsed >= 0 && parsed <= 100) initialPos = parsed;
    }
  }

  if (!beforeSrc || !afterSrc) return;

  if (block.dataset.initialPosition) {
    initialPos = parseInt(block.dataset.initialPosition, 10) || 50;
  }

  const container = document.createElement('div');
  container.className = 'image-compare-container';
  block.replaceChildren(container);

  buildSlider(
    container,
    beforeSrc,
    afterSrc,
    beforeAlt,
    afterAlt,
    beforeLabel,
    afterLabel,
    initialPos,
  );
}

export default function decorate(block) {
  if (block.classList.contains('gallery')) {
    decorateGallery(block);
  } else {
    decorateSimple(block);
  }
}
