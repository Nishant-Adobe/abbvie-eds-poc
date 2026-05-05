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
  return {
    container, beforeLayer, beforeImg, afterImg, divider, handle,
  };
}

function buildSkyrizi(block, afterImg, beforeImg, startPct, cells) {
  const labelLeft = cells[3]?.textContent?.trim() || 'BEFORE | WEEK 0';
  const labelRight = cells[4]?.textContent?.trim() || 'AFTER | WEEK 16';
  const topLabel = cells[5]?.textContent?.trim() || '';
  const patientName = cells[6]?.textContent?.trim() || '';

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
  return {
    container, beforeLayer, beforeImg, afterImg, divider, handle,
  };
}

export default async function decorate(block) {
  const row = block.children[0];
  if (!row) return;

  const cells = [...row.children];
  const afterImg = cells[0]?.querySelector('img');
  const beforeImg = cells[1]?.querySelector('img');
  const startPct = parseFloat(cells[2]?.textContent) / 100 || 0.5;

  if (!afterImg || !beforeImg) return;

  block.innerHTML = '';

  const isSkyrizi = cells.length >= 7;
  let parts;

  if (isSkyrizi) {
    parts = buildSkyrizi(block, afterImg, beforeImg, startPct, cells);
  } else {
    const captionHtml = cells[3]?.innerHTML || '';
    parts = buildRinvoq(block, afterImg, beforeImg, startPct, captionHtml);
  }

  const {
    container, beforeLayer, beforeImg: bImg, afterImg: aImg, divider, handle,
  } = parts;

  function setPosition(pct) {
    const p = Math.min(1, Math.max(0, pct));
    beforeLayer.style.width = `${p * 100}%`;
    divider.style.left = `${p * 100}%`;
    handle.style.left = `${p * 100}%`;
  }

  function fixBeforeWidth() {
    bImg.style.width = `${container.clientWidth}px`;
  }

  aImg.addEventListener('load', fixBeforeWidth);
  window.addEventListener('resize', fixBeforeWidth);
  if (aImg.complete) fixBeforeWidth();

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
