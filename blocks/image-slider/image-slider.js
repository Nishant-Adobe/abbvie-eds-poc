/*
 * Parent model field → row index mapping.
 * classes_* fields are merged into the block's class attribute and produce no rows.
 * Field order: accessible[0], imageHeight[1], imageWidth[2], anchorId[3]
 */
const CFG = {
  ACCESSIBLE: 0, IMAGE_HEIGHT: 1, IMAGE_WIDTH: 2, ANCHOR_ID: 3, COUNT: 4,
};
const ITEM = {
  IMAGE: 0, ALT: 1, LABEL: 2, ACCESSIBLE_TEXT: 3,
};

function getText(el) {
  return el?.textContent?.trim() || '';
}

function getImg(el) {
  return el?.querySelector('img') || null;
}

// Xwalk UE editing mode: cells carry data-aue-prop attributes
function isXwalk(block) {
  return [...block.children].some((row) => {
    const cell = row.children[0];
    return cell?.hasAttribute('data-aue-prop') || cell?.querySelector('[data-aue-prop]');
  });
}

function readXwalkProps(block) {
  const map = {};
  [...block.children].forEach((row) => {
    const cell = row.children[0];
    if (!cell) return;
    const prop = cell.getAttribute('data-aue-prop')
      || cell.querySelector('[data-aue-prop]')?.getAttribute('data-aue-prop');
    if (prop) map[prop] = getText(cell);
  });
  return {
    accessible: map.accessible === 'true',
    imageHeight: parseInt(map.imageHeight, 10) || 0,
    imageWidth: parseInt(map.imageWidth, 10) || 0,
    anchorId: map.anchorId || '',
  };
}

function readDocProps(block) {
  const rows = [...block.children];
  return {
    accessible: getText(rows[CFG.ACCESSIBLE]).toLowerCase() === 'true',
    imageHeight: parseInt(getText(rows[CFG.IMAGE_HEIGHT]), 10) || 0,
    imageWidth: parseInt(getText(rows[CFG.IMAGE_WIDTH]), 10) || 0,
    anchorId: getText(rows[CFG.ANCHOR_ID]),
  };
}

function readXwalkItems(block) {
  return [...block.children]
    .filter((row) => row.getAttribute('data-aue-type') === 'component'
      && row.getAttribute('data-aue-model') === 'image-slider-item')
    .map((itemRow) => {
      const cells = [...itemRow.children];
      const img = getImg(cells[ITEM.IMAGE]);
      const alt = getText(cells[ITEM.ALT]);
      if (img && alt) img.alt = alt;
      return { img, label: getText(cells[ITEM.LABEL]), accessibleHtml: cells[ITEM.ACCESSIBLE_TEXT]?.innerHTML || '' };
    })
    .filter((item) => item.img);
}

function readDocItems(block) {
  return [...block.children]
    .slice(CFG.COUNT)
    .map((row) => {
      const cells = [...row.children];
      const img = getImg(cells[ITEM.IMAGE]);
      if (!img) return null;
      const alt = getText(cells[ITEM.ALT]);
      if (alt) img.alt = alt;
      return { img, label: getText(cells[ITEM.LABEL]), accessibleHtml: cells[ITEM.ACCESSIBLE_TEXT]?.innerHTML || '' };
    })
    .filter(Boolean);
}

function applyImageSize(img, imageHeight, imageWidth) {
  if (imageHeight) img.style.height = `${imageHeight}px`;
  if (imageWidth) img.style.width = `${imageWidth}px`;
  if (imageHeight || imageWidth) img.style.objectFit = 'cover';
}

function buildSlide(item, index, props) {
  const slide = document.createElement('div');
  slide.className = 'image-slider-slide';
  slide.setAttribute('role', 'tabpanel');
  slide.setAttribute('aria-label', item.label || `Image ${index + 1}`);
  slide.setAttribute('aria-hidden', index !== 0 ? 'true' : 'false');
  slide.dataset.index = index;
  if (index === 0) slide.classList.add('is-active');

  const imgWrap = document.createElement('div');
  imgWrap.className = 'image-slider-image-wrap';

  if (item.img) {
    item.img.removeAttribute('loading');
    applyImageSize(item.img, props.imageHeight, props.imageWidth);
    imgWrap.appendChild(item.img);
  }

  if (item.label) {
    const lbl = document.createElement('span');
    lbl.className = 'image-slider-label';
    lbl.textContent = item.label;
    imgWrap.appendChild(lbl);
  }

  slide.appendChild(imgWrap);

  if (item.accessibleHtml) {
    const accDiv = document.createElement('div');
    accDiv.className = 'image-slider-accessible-text';
    accDiv.innerHTML = item.accessibleHtml;
    slide.appendChild(accDiv);
  }

  return slide;
}

function buildNav(total) {
  const nav = document.createElement('div');
  nav.className = 'image-slider-nav';

  const prev = document.createElement('button');
  prev.className = 'image-slider-btn image-slider-prev';
  prev.type = 'button';
  prev.setAttribute('aria-label', 'Previous image');

  const next = document.createElement('button');
  next.className = 'image-slider-btn image-slider-next';
  next.type = 'button';
  next.setAttribute('aria-label', 'Next image');

  const dotsWrap = document.createElement('div');
  dotsWrap.className = 'image-slider-dots';
  dotsWrap.setAttribute('role', 'tablist');
  dotsWrap.setAttribute('aria-label', 'Slide indicators');

  for (let i = 0; i < total; i += 1) {
    const dot = document.createElement('button');
    dot.className = 'image-slider-dot';
    dot.type = 'button';
    dot.setAttribute('role', 'tab');
    dot.setAttribute('aria-label', `Go to image ${i + 1}`);
    dot.setAttribute('aria-selected', i === 0 ? 'true' : 'false');
    dot.dataset.index = i;
    if (i === 0) dot.classList.add('is-active');
    dotsWrap.appendChild(dot);
  }

  nav.appendChild(prev);
  nav.appendChild(dotsWrap);
  nav.appendChild(next);

  return {
    nav, prev, next, dotsWrap,
  };
}

function setupInteraction(track, navEls, total, isVertical) {
  let current = 0;

  function go(index) {
    const target = Math.max(0, Math.min(total - 1, index));
    if (target === current) return;

    track.querySelectorAll('.image-slider-slide').forEach((slide, i) => {
      slide.classList.toggle('is-active', i === target);
      slide.setAttribute('aria-hidden', i !== target ? 'true' : 'false');
    });

    navEls.dotsWrap.querySelectorAll('.image-slider-dot').forEach((dot, i) => {
      dot.classList.toggle('is-active', i === target);
      dot.setAttribute('aria-selected', i === target ? 'true' : 'false');
    });

    track.style.setProperty('--is-offset', `${-target * 100}%`);
    current = target;
  }

  navEls.prev.addEventListener('click', () => go(current - 1));
  navEls.next.addEventListener('click', () => go(current + 1));

  navEls.dotsWrap.querySelectorAll('.image-slider-dot').forEach((dot) => {
    dot.addEventListener('click', () => go(parseInt(dot.dataset.index, 10)));
  });

  track.addEventListener('keydown', (e) => {
    const forward = isVertical ? 'ArrowDown' : 'ArrowRight';
    const backward = isVertical ? 'ArrowUp' : 'ArrowLeft';
    if (e.key === forward) { e.preventDefault(); go(current + 1); } else if (e.key === backward) { e.preventDefault(); go(current - 1); } else if (e.key === 'Home') { e.preventDefault(); go(0); } else if (e.key === 'End') { e.preventDefault(); go(total - 1); }
  });

  // Touch swipe
  let touchStartX = 0;
  let touchStartY = 0;
  track.addEventListener('touchstart', (e) => {
    touchStartX = e.touches[0].clientX;
    touchStartY = e.touches[0].clientY;
  }, { passive: true });
  track.addEventListener('touchend', (e) => {
    const dx = e.changedTouches[0].clientX - touchStartX;
    const dy = e.changedTouches[0].clientY - touchStartY;
    const threshold = 40;
    if (isVertical) {
      if (dy < -threshold) go(current + 1);
      else if (dy > threshold) go(current - 1);
    } else if (dx < -threshold) go(current + 1);
    else if (dx > threshold) go(current - 1);
  }, { passive: true });

  go(0);
}

export default function decorate(block) {
  const isVertical = block.classList.contains('image-slider-vertical');
  const useXwalk = isXwalk(block);

  const props = useXwalk ? readXwalkProps(block) : readDocProps(block);
  const items = useXwalk ? readXwalkItems(block) : readDocItems(block);

  if (!items.length) return;

  if (props.anchorId) block.id = props.anchorId;

  // Boolean prop drives the accessible class (complements the CSS class variant)
  if (props.accessible) block.classList.add('image-slider-accessible');

  const wrapper = document.createElement('div');
  wrapper.className = 'image-slider-wrapper';

  const track = document.createElement('div');
  track.className = 'image-slider-track';
  track.setAttribute('tabindex', '0');
  track.setAttribute('aria-live', 'polite');

  items.forEach((item, i) => track.appendChild(buildSlide(item, i, props)));

  const {
    nav, prev, next, dotsWrap,
  } = buildNav(items.length);
  wrapper.appendChild(track);
  wrapper.appendChild(nav);

  if (block.classList.contains('image-slider-accessible')) {
    const toggle = document.createElement('button');
    toggle.className = 'image-slider-accessible-toggle';
    toggle.type = 'button';
    toggle.setAttribute('aria-pressed', 'false');
    toggle.textContent = 'View accessible text';
    toggle.addEventListener('click', () => {
      const isOn = block.classList.toggle('show-accessible');
      toggle.setAttribute('aria-pressed', String(isOn));
      toggle.textContent = isOn ? 'Hide accessible text' : 'View accessible text';
    });
    wrapper.appendChild(toggle);
  }

  block.replaceChildren(wrapper);
  setupInteraction(track, { prev, next, dotsWrap }, items.length, isVertical);
}
