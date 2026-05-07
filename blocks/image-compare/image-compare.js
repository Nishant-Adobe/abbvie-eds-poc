/* Model field order â†’ column indices (tabs/classes excluded from column output) */
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

function cloneImg(img) {
  if (!img) return null;
  const clone = img.cloneNode(true);
  clone.removeAttribute('loading');
  return clone;
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

function buildTabs(labels, isToggle) {
  const tabsDiv = document.createElement('div');
  tabsDiv.className = isToggle
    ? 'image-compare-tabs image-compare-tabs-toggle'
    : 'image-compare-tabs';

  labels.forEach((label, i) => {
    const btn = document.createElement('button');
    btn.className = 'image-compare-tab';
    if (i === 0) btn.classList.add('is-active');
    btn.textContent = label;
    tabsDiv.appendChild(btn);
  });

  return tabsDiv;
}

function buildThumbnails(images) {
  const thumbsDiv = document.createElement('div');
  thumbsDiv.className = 'image-compare-thumbnails';

  images.forEach((img, i) => {
    if (!img.thumbImg) return;
    const btn = document.createElement('button');
    btn.className = 'image-compare-thumb';
    if (i === 0) btn.classList.add('is-active');

    const thumbImg = cloneImg(img.thumbImg);
    if (thumbImg) {
      thumbImg.className = 'image-compare-thumb-image';
      btn.appendChild(thumbImg);
    }

    if (img.label) {
      const lbl = document.createElement('span');
      lbl.className = 'image-compare-thumb-label';
      lbl.textContent = img.label;
      btn.appendChild(lbl);
    }

    if (img.subLabel) {
      const sub = document.createElement('span');
      sub.className = 'image-compare-thumb-sublabel';
      sub.textContent = img.subLabel;
      btn.appendChild(sub);
    }

    btn.dataset.index = i;
    thumbsDiv.appendChild(btn);
  });

  return thumbsDiv;
}

function extractTabImages(cells, tabOffset) {
  const images = [];
  const img1Before = getImg(cells[tabOffset]);
  const img1After = getImg(cells[tabOffset + 1]);
  if (img1Before && img1After) {
    images.push({
      beforeImg: img1Before,
      afterImg: img1After,
      thumbImg: getImg(cells[tabOffset + 2]),
      label: getText(cells[tabOffset + 3]),
      subLabel: getText(cells[tabOffset + 4]),
    });
  }

  const img2Before = getImg(cells[tabOffset + 5]);
  const img2After = getImg(cells[tabOffset + 6]);
  if (img2Before && img2After) {
    images.push({
      beforeImg: img2Before,
      afterImg: img2After,
      thumbImg: getImg(cells[tabOffset + 7]),
      label: getText(cells[tabOffset + 8]),
      subLabel: getText(cells[tabOffset + 9]),
    });
  }

  return images;
}

function setupGalleryInteraction(block, container, tabSets) {
  const tabs = block.querySelectorAll('.image-compare-tab');

  function swapSliderImages(beforeImg, afterImg) {
    const afterWrap = container.querySelector('.image-compare-after');
    const beforeWrap = container.querySelector('.image-compare-before');
    if (afterWrap && afterImg) {
      afterWrap.innerHTML = '';
      afterWrap.appendChild(cloneImg(afterImg));
    }
    if (beforeWrap && beforeImg) {
      beforeWrap.innerHTML = '';
      const bImg = cloneImg(beforeImg);
      bImg.style.width = `${container.clientWidth}px`;
      beforeWrap.appendChild(bImg);
    }
  }

  function setupThumbClicks(thumbsEl, images) {
    thumbsEl.querySelectorAll('.image-compare-thumb').forEach((btn) => {
      btn.addEventListener('click', () => {
        const idx = parseInt(btn.dataset.index, 10);
        const img = images[idx];
        if (!img) return;
        swapSliderImages(img.beforeImg, img.afterImg);
        thumbsEl.querySelectorAll('.image-compare-thumb').forEach(
          (t) => t.classList.remove('is-active'),
        );
        btn.classList.add('is-active');
      });
    });
  }

  function renderThumbnails(images) {
    const current = block.querySelector('.image-compare-thumbnails');
    if (!current) return;
    const newThumbs = buildThumbnails(images);
    current.replaceWith(newThumbs);
    setupThumbClicks(newThumbs, images);
  }

  if (tabs.length && tabSets.length > 1) {
    tabs.forEach((tab, i) => {
      tab.addEventListener('click', () => {
        tabs.forEach((t) => t.classList.remove('is-active'));
        tab.classList.add('is-active');
        const images = tabSets[i] || [];
        if (images.length) {
          swapSliderImages(images[0].beforeImg, images[0].afterImg);
        }
        renderThumbnails(images);
      });
    });
  }

  const initThumbs = block.querySelector('.image-compare-thumbnails');
  if (initThumbs && tabSets[0]) {
    setupThumbClicks(initThumbs, tabSets[0]);
  }
}

function decorateGallery(block, cells, startPct) {
  const hasToggle = block.classList.contains('toggle');
  const hasPrompt = block.classList.contains('prompt');
  const isSkyrizi = !hasToggle;

  const beforeLabel = getText(cells[COL.beforeLabelPrefix]) || 'BEFORE';
  const afterLabel = getText(cells[COL.afterLabelPrefix]) || 'AFTER';
  const promptText = hasPrompt
    ? (getText(cells[COL.sliderPrompt]) || 'CLICK AND DRAG TO SEE RESULTS')
    : '';
  const tab1Label = getText(cells[COL.tab1Label]);
  const tab2Label = getText(cells[COL.tab2Label]);
  const heading = getText(cells[COL.heading]);
  const description = cells[COL.description]?.innerHTML || '';

  const tab1Images = extractTabImages(cells, COL.tab1Img1Before);
  const tab2Images = extractTabImages(cells, COL.tab2Img1Before);

  const firstImg = tab1Images[0];
  const afterImg = firstImg?.afterImg || getImg(cells[COL.afterImage]);
  const beforeImg = firstImg?.beforeImg || getImg(cells[COL.beforeImage]);
  if (!afterImg || !beforeImg) return null;

  const anchorId = getText(cells[COL.anchorId]);
  if (anchorId) block.id = anchorId;
  else if (tab1Label) {
    block.id = tab1Label.toLowerCase().replace(/\s+/g, '-');
  }

  block.innerHTML = '';

  if (isSkyrizi) {
    // Two-column layout: left content + right slider
    const layout = document.createElement('div');
    layout.className = 'image-compare-layout';

    // Left content panel
    const content = document.createElement('div');
    content.className = 'image-compare-content';

    if (tab1Label) {
      const eyebrow = document.createElement('span');
      eyebrow.className = 'image-compare-eyebrow';
      eyebrow.textContent = tab1Label;
      content.appendChild(eyebrow);
    }

    if (heading) {
      const h = document.createElement('h2');
      h.className = 'image-compare-heading';
      h.textContent = heading;
      content.appendChild(h);
    }

    if (description) {
      const desc = document.createElement('div');
      desc.className = 'image-compare-description';
      desc.innerHTML = description;
      content.appendChild(desc);
    }

    if (tab2Label) {
      const cta = document.createElement('a');
      cta.className = 'image-compare-cta';
      cta.href = `#${tab2Label.toLowerCase().replace(/\s+/g, '-')}`;
      cta.textContent = `VIEW ${tab2Label.toUpperCase()} RESULTS`;
      content.appendChild(cta);
    }

    // Right slider panel (or left if reversed)
    const sliderWrap = document.createElement('div');
    sliderWrap.className = 'image-compare-slider-wrapper';

    layout.appendChild(content);

    const sliderOpts = { beforeLabel, afterLabel };
    const slider = buildSliderContainer(afterImg, beforeImg, sliderOpts);
    sliderWrap.appendChild(slider.container);

    const bottomBar = document.createElement('div');
    bottomBar.className = 'image-compare-bottom-bar';
    const leftSpan = document.createElement('span');
    leftSpan.textContent = beforeLabel;
    const rightSpan = document.createElement('span');
    rightSpan.textContent = afterLabel;
    bottomBar.appendChild(leftSpan);
    bottomBar.appendChild(rightSpan);
    sliderWrap.appendChild(bottomBar);

    const patientName = firstImg?.label || getText(cells[COL.tab1Img1Label]) || '';
    if (patientName) {
      const patient = document.createElement('div');
      patient.className = 'image-compare-patient';
      patient.textContent = patientName;
      sliderWrap.appendChild(patient);
    }

    layout.appendChild(sliderWrap);
    block.appendChild(layout);

    // Thumbnails below layout
    const activeImages = tab1Images.length ? tab1Images : tab2Images;
    if (activeImages.length) {
      const thumbsEl = buildThumbnails(activeImages);
      block.appendChild(thumbsEl);
    }

    const tabSets = [tab1Images, tab2Images];
    setupGalleryInteraction(block, slider.container, tabSets);
    return { ...slider, startPct, hasPrompt: false };
  }

  // Rinvoq toggle layout
  const wrapper = document.createElement('div');
  wrapper.className = 'image-compare-wrapper';

  const sliderOpts = { beforeLabel, afterLabel };
  if (promptText) sliderOpts.prompt = promptText;

  const slider = buildSliderContainer(afterImg, beforeImg, sliderOpts);
  wrapper.appendChild(slider.container);

  if (description) {
    const galleryContent = document.createElement('div');
    galleryContent.className = 'image-compare-gallery-content';
    galleryContent.innerHTML = description;
    wrapper.appendChild(galleryContent);
  }

  if (tab1Label && tab2Label) {
    const tabsEl = buildTabs([tab1Label, tab2Label], hasToggle);
    wrapper.appendChild(tabsEl);
  }

  const activeImages = tab1Images.length ? tab1Images : tab2Images;
  if (activeImages.length) {
    const thumbsEl = buildThumbnails(activeImages);
    wrapper.appendChild(thumbsEl);
  }

  block.appendChild(wrapper);

  const tabSets = [tab1Images, tab2Images];
  setupGalleryInteraction(block, slider.container, tabSets);

  return { ...slider, startPct, hasPrompt: !!promptText };
}

/* --- Simple slider builders (non-gallery) --- */

function buildSliderWithCaption(block, afterImg, beforeImg, opts) {
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

function buildWrappedSlider(block, afterImg, beforeImg, opts) {
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

  function setPosition(pct) {
    const p = Math.min(1, Math.max(0, pct));
    container.style.setProperty('--compare-position', `${p * 100}%`);
  }

  function fixBeforeWidth() {
    const bImg = container.querySelector('.image-compare-before img');
    if (bImg) bImg.style.width = `${container.clientWidth}px`;
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

/* --- Legacy format --- */
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
    const parts = buildWrappedSlider(block, afterImg, beforeImg, opts);
    return { ...parts, startPct, hasPrompt: false };
  }

  const opts = {
    beforeLabel: 'BEFORE',
    afterLabel: 'AFTER',
    prompt: 'CLICK AND DRAG TO SEE RESULTS',
    captionHtml: cells[3]?.innerHTML || '',
  };
  const parts = buildSliderWithCaption(block, afterImg, beforeImg, opts);
  return { ...parts, startPct, hasPrompt: true };
}

/* --- Key-value row format --- */
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
      if (!imgs.length
        || (key === 'beforeImage' && imgs[imgs.length - 1].beforeImg)) {
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
    const parts = buildWrappedSlider(block, afterImg, beforeImg, opts);
    return { ...parts, startPct: 0.5, hasPrompt: false };
  }

  const opts = {
    beforeLabel: getText(data.beforeLabelPrefix) || 'BEFORE',
    afterLabel: getText(data.afterLabelPrefix) || 'AFTER',
    prompt: getText(data.sliderPrompt) || 'CLICK AND DRAG TO SEE RESULTS',
    captionHtml: data.description?.innerHTML || '',
  };
  const parts = buildSliderWithCaption(block, afterImg, beforeImg, opts);
  return { ...parts, startPct: 0.5, hasPrompt: true };
}

/* --- UE model-order format --- */
function decorateModelFormat(block, cells) {
  const startPct = (parseFloat(getText(cells[COL.initialPosition])) || 50) / 100;
  const hasGallery = block.classList.contains('gallery');

  if (hasGallery) {
    return decorateGallery(block, cells, startPct);
  }

  const afterImg = getImg(cells[COL.afterImage]);
  const beforeImg = getImg(cells[COL.beforeImage]);
  if (!afterImg || !beforeImg) return null;
  const hasPrompt = block.classList.contains('prompt');
  const promptText = hasPrompt ? getText(cells[COL.sliderPrompt]) : '';

  block.innerHTML = '';

  const opts = {
    beforeLabel: getText(cells[COL.beforeLabelPrefix]) || 'BEFORE',
    afterLabel: getText(cells[COL.afterLabelPrefix]) || 'AFTER',
    prompt: promptText || undefined,
    captionHtml: cells[COL.description]?.innerHTML || '',
  };
  const parts = buildSliderWithCaption(block, afterImg, beforeImg, opts);
  return { ...parts, startPct, hasPrompt: !!promptText };
}

function detectFormat(block) {
  const rows = [...block.children];
  if (!rows.length) return null;

  const firstRow = rows[0];
  const firstCells = [...firstRow.children];

  if (rows.length === 1 && firstCells.length > 10) return 'model';
  if (rows.length <= 7 && firstCells[0]?.querySelector('img')) return 'legacy';
  if (rows.length > 1 && firstCells.length === 2
    && firstRow.children[0]?.textContent?.trim()) return 'keyvalue';
  if (rows.length > 10 && firstCells.length === 1) return 'model-rows';
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
  } else if (format === 'model-rows') {
    const cells = [...block.children].map((row) => row.children[0]);
    result = decorateModelFormat(block, cells);
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
