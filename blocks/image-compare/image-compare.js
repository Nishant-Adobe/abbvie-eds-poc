/* =========================================================
   MODEL FIELD MAP
========================================================= */

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

/* =========================================================
   HELPERS
========================================================= */

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

/* =========================================================
   SLIDER
========================================================= */

function buildSliderContainer(afterImg, beforeImg, opts = {}) {
  const container = document.createElement('div');
  container.className = 'image-compare-container';

  const afterWrap = document.createElement('div');
  afterWrap.className = 'image-compare-after';

  afterWrap.appendChild(cloneImg(afterImg));

  container.appendChild(afterWrap);

  const beforeWrap = document.createElement('div');
  beforeWrap.className = 'image-compare-before';

  beforeWrap.appendChild(cloneImg(beforeImg));

  container.appendChild(beforeWrap);

  const handle = document.createElement('div');
  handle.className = 'image-compare-handle';

  handle.setAttribute('role', 'separator');
  handle.setAttribute('tabindex', '0');

  container.appendChild(handle);

  if (opts.beforeLabel) {
    const beforeLabel = document.createElement('div');

    beforeLabel.className =
      'image-compare-label image-compare-label-before';

    beforeLabel.textContent = opts.beforeLabel;

    container.appendChild(beforeLabel);
  }

  if (opts.afterLabel) {
    const afterLabel = document.createElement('div');

    afterLabel.className =
      'image-compare-label image-compare-label-after';

    afterLabel.textContent = opts.afterLabel;

    container.appendChild(afterLabel);
  }

  if (opts.prompt) {
    const prompt = document.createElement('div');

    prompt.className = 'image-compare-prompt';

    prompt.textContent = opts.prompt;

    container.appendChild(prompt);
  }

  return {
    container,
    beforeWrap,
    handle,
  };
}

/* =========================================================
   TABS
========================================================= */

function buildTabs(labels, isToggle) {
  const tabsDiv = document.createElement('div');

  tabsDiv.className = isToggle
    ? 'image-compare-tabs image-compare-tabs-toggle'
    : 'image-compare-tabs';

  labels.forEach((label, index) => {
    const btn = document.createElement('button');

    btn.className = 'image-compare-tab';

    if (index === 0) {
      btn.classList.add('is-active');
    }

    btn.textContent = label;

    tabsDiv.appendChild(btn);
  });

  return tabsDiv;
}

/* =========================================================
   THUMBNAILS
========================================================= */

function buildThumbnails(images) {
  const thumbsDiv = document.createElement('div');

  thumbsDiv.className = 'image-compare-thumbnails';

  images.forEach((img, index) => {
    if (!img.thumbImg) return;

    const btn = document.createElement('button');

    btn.className = 'image-compare-thumb';

    if (index === 0) {
      btn.classList.add('is-active');
    }

    btn.dataset.index = index;

    const thumbImg = cloneImg(img.thumbImg);

    if (thumbImg) {
      thumbImg.className = 'image-compare-thumb-image';

      btn.appendChild(thumbImg);
    }

    thumbsDiv.appendChild(btn);
  });

  return thumbsDiv;
}

/* =========================================================
   IMAGE EXTRACTION
========================================================= */

function extractTabImages(cells, offset) {
  const images = [];

  const img1Before = getImg(cells[offset]);
  const img1After = getImg(cells[offset + 1]);

  if (img1Before && img1After) {
    images.push({
      beforeImg: img1Before,
      afterImg: img1After,
      thumbImg: getImg(cells[offset + 2]),
      label: getText(cells[offset + 3]),
    });
  }

  const img2Before = getImg(cells[offset + 5]);
  const img2After = getImg(cells[offset + 6]);

  if (img2Before && img2After) {
    images.push({
      beforeImg: img2Before,
      afterImg: img2After,
      thumbImg: getImg(cells[offset + 7]),
      label: getText(cells[offset + 8]),
    });
  }

  return images;
}

/* =========================================================
   GALLERY INTERACTION
========================================================= */

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

      beforeWrap.appendChild(cloneImg(beforeImg));
    }
  }

  function setupThumbClicks(thumbsEl, images) {
    thumbsEl.querySelectorAll('.image-compare-thumb').forEach((btn) => {
      btn.addEventListener('click', () => {
        const idx = parseInt(btn.dataset.index, 10);

        const img = images[idx];

        if (!img) return;

        swapSliderImages(img.beforeImg, img.afterImg);

        thumbsEl.querySelectorAll('.image-compare-thumb')
          .forEach((thumb) => {
            thumb.classList.remove('is-active');
          });

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
    tabs.forEach((tab, index) => {
      tab.addEventListener('click', () => {
        tabs.forEach((btn) => {
          btn.classList.remove('is-active');
        });

        tab.classList.add('is-active');

        const images = tabSets[index] || [];

        if (images.length) {
          swapSliderImages(
            images[0].beforeImg,
            images[0].afterImg,
          );
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

/* =========================================================
   GALLERY DECORATION
========================================================= */

function decorateGallery(block, cells, startPct) {
  const hasToggle = block.classList.contains('toggle');

  const hasPrompt = block.classList.contains('prompt');

  const isSkyrizi = !hasToggle;

  const beforeLabel =
    getText(cells[COL.beforeLabelPrefix]) || 'BEFORE';

  const afterLabel =
    getText(cells[COL.afterLabelPrefix]) || 'AFTER';

  const promptText = hasPrompt
    ? (
      getText(cells[COL.sliderPrompt])
      || 'CLICK AND DRAG TO SEE RESULTS'
    )
    : '';

  const tab1Label = getText(cells[COL.tab1Label]);
  const tab2Label = getText(cells[COL.tab2Label]);

  const heading = getText(cells[COL.heading]);

  const description =
    cells[COL.description]?.innerHTML || '';

  const tab1Images =
    extractTabImages(cells, COL.tab1Img1Before);

  const tab2Images =
    extractTabImages(cells, COL.tab2Img1Before);

  const firstImg = tab1Images[0];

  const afterImg =
    firstImg?.afterImg
    || getImg(cells[COL.afterImage]);

  const beforeImg =
    firstImg?.beforeImg
    || getImg(cells[COL.beforeImage]);

  if (!afterImg || !beforeImg) {
    return null;
  }

  block.innerHTML = '';

  /* =========================================
     SKYRIZI LAYOUT
  ========================================= */

  if (isSkyrizi) {
    const layout = document.createElement('div');

    layout.className = 'image-compare-layout';

    /* CONTENT COLUMN */

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

      cta.href = '#';

      cta.textContent =
        `VIEW ${tab2Label.toUpperCase()} RESULTS`;

      content.appendChild(cta);
    }

    layout.appendChild(content);

    /* SLIDER COLUMN */

    const sliderWrap = document.createElement('div');

    sliderWrap.className =
      'image-compare-slider-wrapper';

    const slider = buildSliderContainer(
      afterImg,
      beforeImg,
      {
        beforeLabel,
        afterLabel,
        prompt: promptText,
      },
    );

    sliderWrap.appendChild(slider.container);

    const patientName = firstImg?.label || '';

    if (patientName) {
      const patient = document.createElement('div');

      patient.className = 'image-compare-patient';

      patient.textContent = patientName;

      sliderWrap.appendChild(patient);
    }

    layout.appendChild(sliderWrap);

    block.appendChild(layout);

    /* THUMBNAILS */

    const activeImages =
      tab1Images.length
        ? tab1Images
        : tab2Images;

    if (activeImages.length) {
      const thumbsEl = buildThumbnails(activeImages);

      block.appendChild(thumbsEl);
    }

    /* TABS */

    if (tab1Label && tab2Label) {
      const tabs = buildTabs(
        [tab1Label, tab2Label],
        false,
      );

      block.prepend(tabs);
    }

    const tabSets = [
      tab1Images,
      tab2Images,
    ];

    setupGalleryInteraction(
      block,
      slider.container,
      tabSets,
    );

    return {
      ...slider,
      startPct,
      hasPrompt,
    };
  }

  return null;
}

/* =========================================================
   SLIDER INTERACTION
========================================================= */

function setupSlider(
  container,
  beforeWrap,
  handle,
  startPct,
  hasPrompt,
) {
  function setPosition(pct) {
    const p = Math.min(1, Math.max(0, pct));

    container.style.setProperty(
      '--compare-position',
      `${p * 100}%`,
    );
  }

  setPosition(startPct);

  let dragging = false;

  function getX(e) {
    const rect = container.getBoundingClientRect();

    const clientX = e.touches
      ? e.touches[0].clientX
      : e.clientX;

    return (clientX - rect.left) / rect.width;
  }

  container.addEventListener('pointerdown', (e) => {
    dragging = true;

    container.setPointerCapture(e.pointerId);

    setPosition(getX(e));

    if (hasPrompt) {
      const prompt =
        container.querySelector('.image-compare-prompt');

      if (prompt) {
        prompt.classList.add('is-hidden');
      }
    }
  });

  container.addEventListener('pointermove', (e) => {
    if (dragging) {
      setPosition(getX(e));
    }
  });

  container.addEventListener('pointerup', (e) => {
    dragging = false;

    container.releasePointerCapture(e.pointerId);
  });
}

/* =========================================================
   MODEL FORMAT
========================================================= */

function decorateModelFormat(block, cells) {
  const startPct =
    (
      parseFloat(
        getText(cells[COL.initialPosition]),
      ) || 50
    ) / 100;

  return decorateGallery(
    block,
    cells,
    startPct,
  );
}

/* =========================================================
   ENTRY
========================================================= */

export default async function decorate(block) {
  const cells = [
    ...block.children[0].children,
  ];

  const result =
    decorateModelFormat(block, cells);

  if (!result) return;

  const {
    container,
    beforeWrap,
    handle,
    startPct,
    hasPrompt,
  } = result;

  setupSlider(
    container,
    beforeWrap,
    handle,
    startPct,
    hasPrompt,
  );
}