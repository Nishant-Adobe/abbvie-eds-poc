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

function buildRinvoq(block, afterImg, beforeImg, startPct, captionHtml) {
  const container = document.createElement('div');
  container.className = 'ic-container';

  afterImg.className = 'ic-img ic-after';
  container.appendChild(afterImg);

  const beforeLayer = document.createElement('div');
  beforeLayer.className = 'ic-before-layer';
  beforeImg.className = 'ic-img ic-before';
  beforeLayer.appendChild(beforeImg);
  container.appendChild(beforeLayer);

  const divider = document.createElement('div');
  divider.className = 'ic-divider';
  container.appendChild(divider);

  const labelBefore = document.createElement('div');
  labelBefore.className = 'ic-label ic-label-before';
  labelBefore.textContent = 'BEFORE';
  container.appendChild(labelBefore);

  const labelAfter = document.createElement('div');
  labelAfter.className = 'ic-label ic-label-after';
  labelAfter.textContent = 'AFTER';
  container.appendChild(labelAfter);

  const handle = document.createElement('div');
  handle.className = 'ic-handle';
  handle.innerHTML = '<span class="ic-handle-text">CLICK AND DRAG</span>'
    + '<span class="ic-handle-text">TO SEE RESULTS</span>'
    + '<span class="ic-handle-arrows">'
    + '<span class="ic-chevrons">«««</span>'
    + '<span class="ic-circle">↔</span>'
    + '<span class="ic-chevrons">»»»</span>'
    + '</span>';
  container.appendChild(handle);

  if (captionHtml) {
    const caption = document.createElement('div');
    caption.className = 'ic-caption';
    caption.innerHTML = captionHtml;
    container.appendChild(caption);
  }

  block.appendChild(container);
  return { container, beforeLayer, beforeImg, afterImg, divider, handle };
}

function buildSkyrizi(block, afterImg, beforeImg, labelLeft, labelRight, topLabel, patientName) {
  const wrapper = document.createElement('div');
  wrapper.className = 'ic-wrapper';

  if (topLabel) {
    const topBar = document.createElement('div');
    topBar.className = 'ic-top-bar';
    topBar.textContent = topLabel;
    wrapper.appendChild(topBar);
  }

  const container = document.createElement('div');
  container.className = 'ic-container';

  afterImg.className = 'ic-img ic-after';
  container.appendChild(afterImg);

  const beforeLayer = document.createElement('div');
  beforeLayer.className = 'ic-before-layer';
  beforeImg.className = 'ic-img ic-before';
  beforeLayer.appendChild(beforeImg);
  container.appendChild(beforeLayer);

  const divider = document.createElement('div');
  divider.className = 'ic-divider';
  container.appendChild(divider);

  const handle = document.createElement('div');
  handle.className = 'ic-handle ic-handle-circle';
  handle.innerHTML = '<span class="ic-arrow-left"></span><span class="ic-arrow-right"></span>';
  container.appendChild(handle);

  const bottomBar = document.createElement('div');
  bottomBar.className = 'ic-bottom-bar';
  bottomBar.innerHTML = `<span class="ic-bottom-left">${labelLeft}</span>`
    + `<span class="ic-bottom-right">${labelRight}</span>`;
  container.appendChild(bottomBar);

  wrapper.appendChild(container);

  if (patientName) {
    const patient = document.createElement('div');
    patient.className = 'ic-patient';
    patient.textContent = patientName;
    wrapper.appendChild(patient);
  }

  block.appendChild(wrapper);
  return { container, beforeLayer, beforeImg, afterImg, divider, handle };
}

function setupSlider(container, beforeLayer, beforeImg, afterImg, handle, startPct, isSkyrizi) {
  function setPosition(pct) {
    const p = Math.min(1, Math.max(0, pct));
    beforeLayer.style.width = `${p * 100}%`;
    const d = container.querySelector('.ic-divider');
    if (d) d.style.left = `${p * 100}%`;
    handle.style.left = `${p * 100}%`;
  }

  function fixBeforeWidth() {
    beforeImg.style.width = `${container.clientWidth}px`;
  }

  afterImg.addEventListener('load', fixBeforeWidth);
  window.addEventListener('resize', fixBeforeWidth);
  if (afterImg.complete) fixBeforeWidth();

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
    if (!isSkyrizi) handle.classList.add('ic-handle-hidden');
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
    const labelLeft = cells[3]?.textContent?.trim() || 'BEFORE | WEEK 0';
    const labelRight = cells[4]?.textContent?.trim() || 'AFTER | WEEK 16';
    const topLabel = cells[5]?.textContent?.trim() || '';
    const patientName = cells[6]?.textContent?.trim() || '';
    const parts = buildSkyrizi(block, afterImg, beforeImg, labelLeft, labelRight, topLabel, patientName);
    return { ...parts, startPct, isSkyrizi: true };
  }

  const captionHtml = cells[3]?.innerHTML || '';
  const parts = buildRinvoq(block, afterImg, beforeImg, startPct, captionHtml);
  return { ...parts, startPct, isSkyrizi: false };
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
    } else if ((key === 'beforeImage' || key === 'afterImage' || key === 'thumbnail'
      || key === 'thumbnailLabel' || key === 'thumbnailSubLabel') && currentTab) {
      if (!currentTab.images.length
        || (key === 'beforeImage' && currentTab.images[currentTab.images.length - 1].beforeImg)) {
        currentTab.images.push({});
      }
      const entry = currentTab.images[currentTab.images.length - 1];
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

  const startPct = 0.5;
  const hasToggle = block.classList.contains('toggle');
  const isSkyrizi = !hasToggle;

  block.innerHTML = '';

  if (isSkyrizi) {
    const labelLeft = getText(data.beforeLabelPrefix) || 'BEFORE | WEEK 0';
    const labelRight = getText(data.afterLabelPrefix) || 'AFTER | WEEK 16';
    const topLabel = getText(data.heading) || '';
    const patientName = firstImg?.label || '';
    const parts = buildSkyrizi(block, afterImg, beforeImg, labelLeft, labelRight, topLabel, patientName);
    return { ...parts, startPct, isSkyrizi: true };
  }

  const captionHtml = data.description?.innerHTML || '';
  const parts = buildRinvoq(block, afterImg, beforeImg, startPct, captionHtml);
  return { ...parts, startPct, isSkyrizi: false };
}

/* --- UE model-order format: single row with 28+ columns matching COL indices --- */
function decorateModelFormat(block, cells) {
  const afterImg = getImg(cells[COL.afterImage]);
  const beforeImg = getImg(cells[COL.beforeImage]);
  const startPct = (parseFloat(getText(cells[COL.initialPosition])) || 50) / 100;
  if (!afterImg || !beforeImg) return null;

  const hasToggle = block.classList.contains('toggle');
  const isSkyrizi = !hasToggle && block.classList.contains('gallery');

  block.innerHTML = '';

  if (isSkyrizi) {
    const labelLeft = getText(cells[COL.beforeLabelPrefix]) || 'BEFORE | WEEK 0';
    const labelRight = getText(cells[COL.afterLabelPrefix]) || 'AFTER | WEEK 16';
    const topLabel = getText(cells[COL.heading]) || '';
    const patientName = getText(cells[COL.tab1Img1Label]) || '';
    const parts = buildSkyrizi(block, afterImg, beforeImg, labelLeft, labelRight, topLabel, patientName);
    return { ...parts, startPct, isSkyrizi: true };
  }

  const captionHtml = cells[COL.description]?.innerHTML || '';
  const parts = buildRinvoq(block, afterImg, beforeImg, startPct, captionHtml);
  return { ...parts, startPct, isSkyrizi: false };
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
    container, beforeLayer, beforeImg, afterImg, handle, startPct, isSkyrizi,
  } = result;

  setupSlider(container, beforeLayer, beforeImg, afterImg, handle, startPct, isSkyrizi);
}
