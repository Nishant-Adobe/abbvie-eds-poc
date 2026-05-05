/* Model field order → column indices (tabs/classes excluded from column output) */
const COL = {
  heading: 0,
  description: 1,
  sliderPrompt: 2,
  beforeLabelPrefix: 3,
  afterLabelPrefix: 4,
  beforeImage: 5,
  beforeAlt: 6,
  afterImage: 7,
  afterAlt: 8,
  tab1Label: 9,
  tab1Img1Before: 10,
  tab1Img1After: 11,
  tab1Img1Thumb: 12,
  tab1Img1Label: 13,
  tab1Img1SubLabel: 14,
  tab1Img2Before: 15,
  tab1Img2After: 16,
  tab1Img2Thumb: 17,
  tab1Img2Label: 18,
  tab1Img2SubLabel: 19,
  tab2Label: 20,
  tab2Img1Before: 21,
  tab2Img1After: 22,
  tab2Img1Thumb: 23,
  tab2Img1Label: 24,
  tab2Img1SubLabel: 25,
  initialPosition: 26,
  anchorId: 27,
};

function getImg(cell) {
  return cell?.querySelector('img');
}

function getText(cell) {
  return cell?.textContent?.trim() || '';
}

function buildSliderContainer(afterImg, beforeImg, opts = {}) {
  const container = document.createElement('div');
  container.className = 'image-compare-container';

  const afterWrap = document.createElement('div');
  afterWrap.className = 'image-compare-after';
  afterWrap.appendChild(afterImg);
  container.appendChild(afterWrap);

  const beforeWrap = document.createElement('div');
  beforeWrap.className = 'image-compare-before';
  beforeWrap.appendChild(beforeImg);
  container.appendChild(beforeWrap);

  const handle = document.createElement('div');
  handle.className = 'image-compare-handle';
  handle.setAttribute('role', 'separator');
  handle.setAttribute('tabindex', '0');
  container.appendChild(handle);

  if (opts.beforeLabel) {
    const lbl = document.createElement('div');
    lbl.className = 'image-compare-label image-compare-label-before';
    lbl.textContent = opts.beforeLabel;
    container.appendChild(lbl);
  }

  if (opts.afterLabel) {
    const lbl = document.createElement('div');
    lbl.className = 'image-compare-label image-compare-label-after';
    lbl.textContent = opts.afterLabel;
    container.appendChild(lbl);
  }

  if (opts.prompt) {
    const prompt = document.createElement('div');
    prompt.className = 'image-compare-prompt';
    prompt.textContent = opts.prompt;
    container.appendChild(prompt);
  }

  return { container, beforeWrap, handle };
}

function buildRinvoq(block, afterImg, beforeImg, opts) {
  const slider = buildSliderContainer(afterImg, beforeImg, opts);
  const { container } = slider;

  if (opts.captionHtml) {
    const caption = document.createElement('div');
    caption.className = 'image-compare-gallery-content';
    caption.innerHTML = opts.captionHtml;
    block.appendChild(caption);
  }

  block.insertBefore(container, block.firstChild);
  return slider;
}

function buildSkyrizi(block, afterImg, beforeImg, opts) {
  const wrapper = document.createElement('div');
  wrapper.className = 'image-compare-wrapper';

  const slider = buildSliderContainer(afterImg, beforeImg, opts);
  const { container } = slider;

  wrapper.appendChild(container);

  if (opts.patientName) {
    const galleryContent = document.createElement('div');
    galleryContent.className = 'image-compare-gallery-content';
    galleryContent.setAttribute('data-caption', opts.patientName);
    wrapper.appendChild(galleryContent);
  }

  block.appendChild(wrapper);
  return slider;
}

function setupSlider(container, beforeWrap, handle, startPct, hasPrompt) {
  const afterImg = container.querySelector('.image-compare-after img');
  const beforeImg = container.querySelector('.image-compare-before img');

  function setPosition(pct) {
    const p = Math.min(1, Math.max(0, pct));
    container.style.setProperty('--compare-position', `${p * 100}%`);
  }

  function fixBeforeWidth() {
    if (beforeImg) beforeImg.style.width = `${container.clientWidth}px`;
  }

  if (afterImg) {
    afterImg.addEventListener('load', fixBeforeWidth);
    if (afterImg.complete) fixBeforeWidth();
  }
  window.addEventListener('resize', fixBeforeWidth);

  setPosition(startPct);

  let dragging = false;

  function getX(e) {
    const rect = container.getBoundingClientRect();
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    return (clientX - rect.left) / rect.width;
  }

  container.addEventListener('pointerdown', (e) => {
    dragging = true;
    container.setPointerCapture(e.pointerId);
    setPosition(getX(e));
    if (hasPrompt) {
      const prompt = container.querySelector('.image-compare-prompt');
      if (prompt) prompt.classList.add('is-hidden');
    }
  });

  container.addEventListener('pointermove', (e) => {
    if (dragging) setPosition(getX(e));
  });

  container.addEventListener('pointerup', (e) => {
    dragging = false;
    container.releasePointerCapture(e.pointerId);
  });
}

/* --- Legacy format: cells[0]=afterImg, cells[1]=beforeImg, cells[2]=pct --- */
function decorateLegacy(block, cells) {
  const afterImg = cells[0]?.querySelector('img');
  const beforeImg = cells[1]?.querySelector('img');
  const startPct = parseFloat(cells[2]?.textContent) / 100 || 0.5;
  if (!afterImg || !beforeImg) return null;

  block.innerHTML = '';
  const isSkyrizi = cells.length >= 7;

  if (isSkyrizi) {
    const opts = {
      beforeLabel: cells[3]?.textContent?.trim() || 'BEFORE | WEEK 0',
      afterLabel: cells[4]?.textContent?.trim() || 'AFTER | WEEK 16',
      patientName: cells[6]?.textContent?.trim() || '',
    };
    const parts = buildSkyrizi(block, afterImg, beforeImg, opts);
    return { ...parts, startPct, hasPrompt: false };
  }

  const opts = {
    beforeLabel: 'BEFORE',
    afterLabel: 'AFTER',
    prompt: 'CLICK AND DRAG TO SEE RESULTS',
    captionHtml: cells[3]?.innerHTML || '',
  };
  const parts = buildRinvoq(block, afterImg, beforeImg, opts);
  return { ...parts, startPct, hasPrompt: true };
}

/* --- Key-value row format: each row has [fieldName, fieldValue] --- */
function parseKeyValueRows(rows) {
  const data = {};
  const tabs = [];
  let currentTab = null;

  rows.forEach((row) => {
    const children = [...row.children];
    if (children.length < 2) return;
    const key = children[0]?.textContent?.trim();
    const val = children[1];
    if (!key) return;

    if (key === 'tabLabel') {
      currentTab = { label: getText(val), images: [] };
      tabs.push(currentTab);
    } else if (currentTab && (key === 'beforeImage'
      || key === 'afterImage' || key === 'thumbnail'
      || key === 'thumbnailLabel' || key === 'thumbnailSubLabel')) {
      const imgs = currentTab.images;
      if (!imgs.length || (key === 'beforeImage' && imgs[imgs.length - 1].beforeImg)) {
        imgs.push({});
      }
      const entry = imgs[imgs.length - 1];
      if (key === 'beforeImage') entry.beforeImg = val.querySelector('img');
      else if (key === 'afterImage') entry.afterImg = val.querySelector('img');
      else if (key === 'thumbnail') entry.thumbImg = val.querySelector('img');
      else if (key === 'thumbnailLabel') entry.label = getText(val);
      else if (key === 'thumbnailSubLabel') entry.subLabel = getText(val);
    } else {
      data[key] = val;
    }
  });

  return { data, tabs };
}

function decorateKeyValue(block, rows) {
  const { data, tabs } = parseKeyValueRows(rows);
  const firstTab = tabs[0];
  const firstImg = firstTab?.images?.[0];

  const afterImg = firstImg?.afterImg || data.afterImage?.querySelector('img');
  const beforeImg = firstImg?.beforeImg || data.beforeImage?.querySelector('img');
  if (!afterImg || !beforeImg) return null;

  const hasToggle = block.classList.contains('toggle');

  block.innerHTML = '';

  if (!hasToggle) {
    const opts = {
      beforeLabel: getText(data.beforeLabelPrefix) || 'BEFORE | WEEK 0',
      afterLabel: getText(data.afterLabelPrefix) || 'AFTER | WEEK 16',
      patientName: firstImg?.label || '',
    };
    const parts = buildSkyrizi(block, afterImg, beforeImg, opts);
    return { ...parts, startPct: 0.5, hasPrompt: false };
  }

  const opts = {
    beforeLabel: getText(data.beforeLabelPrefix) || 'BEFORE',
    afterLabel: getText(data.afterLabelPrefix) || 'AFTER',
    prompt: getText(data.sliderPrompt) || 'CLICK AND DRAG TO SEE RESULTS',
    captionHtml: data.description?.innerHTML || '',
  };
  const parts = buildRinvoq(block, afterImg, beforeImg, opts);
  return { ...parts, startPct: 0.5, hasPrompt: true };
}

/* --- UE model-order format: single row with 28+ columns --- */
function decorateModelFormat(block, cells) {
  const afterImg = getImg(cells[COL.afterImage]);
  const beforeImg = getImg(cells[COL.beforeImage]);
  const startPct = (parseFloat(getText(cells[COL.initialPosition])) || 50) / 100;
  if (!afterImg || !beforeImg) return null;

  const hasToggle = block.classList.contains('toggle');
  const hasPrompt = block.classList.contains('prompt');
  const isSkyrizi = !hasToggle && block.classList.contains('gallery');

  block.innerHTML = '';

  if (isSkyrizi) {
    const opts = {
      beforeLabel: getText(cells[COL.beforeLabelPrefix]) || 'BEFORE | WEEK 0',
      afterLabel: getText(cells[COL.afterLabelPrefix]) || 'AFTER | WEEK 16',
      patientName: getText(cells[COL.tab1Img1Label]) || '',
    };
    const parts = buildSkyrizi(block, afterImg, beforeImg, opts);
    return { ...parts, startPct, hasPrompt: false };
  }

  const promptText = hasPrompt ? getText(cells[COL.sliderPrompt]) : '';
  const opts = {
    beforeLabel: getText(cells[COL.beforeLabelPrefix]) || 'BEFORE',
    afterLabel: getText(cells[COL.afterLabelPrefix]) || 'AFTER',
    prompt: promptText || undefined,
    captionHtml: cells[COL.description]?.innerHTML || '',
  };
  const parts = buildRinvoq(block, afterImg, beforeImg, opts);
  return { ...parts, startPct, hasPrompt };
}

function detectFormat(block) {
  const rows = [...block.children];
  if (!rows.length) return null;

  const firstRow = rows[0];
  const firstCells = [...firstRow.children];

  if (rows.length === 1 && firstCells.length > 10) return 'model';
  if (firstCells[0]?.querySelector('img')) return 'legacy';
  if (rows.length > 1 && firstCells.length === 2) return 'keyvalue';
  if (rows.length === 1 && firstCells.length >= 5) return 'model';

  return 'legacy';
}

export default async function decorate(block) {
  const format = detectFormat(block);
  if (!format) return;

  let result;

  if (format === 'legacy') {
    const cells = [...block.children[0].children];
    result = decorateLegacy(block, cells);
  } else if (format === 'keyvalue') {
    const rows = [...block.children];
    result = decorateKeyValue(block, rows);
  } else {
    const cells = [...block.children[0].children];
    result = decorateModelFormat(block, cells);
  }

  if (!result) return;

  const {
    container, beforeWrap, handle, startPct, hasPrompt,
  } = result;
  setupSlider(container, beforeWrap, handle, startPct, hasPrompt);
}
