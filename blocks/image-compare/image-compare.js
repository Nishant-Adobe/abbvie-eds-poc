import { resolveImageReference } from '../../scripts/scripts.js';
import { applyCommonProps } from '../../scripts/utils.js';

// ─── Config row indices ───────────────────────────────────────────────────────
// Tabs produce no rows. classes_* fields become CSS classes (no row).
// Every other field produces one row in DOM order.
const CFG = {
  SLIDER_START: 0,
  BEFORE_IMAGE: 1,
  BEFORE_ALT: 2,
  BEFORE_WIDTH: 3,
  BEFORE_HEIGHT: 4,
  BEFORE_LABEL: 5,
  BEFORE_POS: 6,
  AFTER_IMAGE: 7,
  AFTER_ALT: 8,
  AFTER_WIDTH: 9,
  AFTER_HEIGHT: 10,
  AFTER_LABEL: 11,
  AFTER_POS: 12,
  ANALYTICS_ID: 13,
  ANCHOR_ID: 14,
  COUNT: 15,
};

// ─── DOM helpers ──────────────────────────────────────────────────────────────

function cellText(row, cellIdx = 0) {
  return row?.children[cellIdx]?.textContent?.trim() || '';
}

function resolveImg(row) {
  if (!row) return null;
  const cell = row.firstElementChild || row;
  resolveImageReference(cell);
  const pic = cell.querySelector('picture');
  const img = cell.querySelector('img');
  return pic || img || null;
}

// ─── Config reader ────────────────────────────────────────────────────────────

function readConfig(block) {
  const rows = [...block.children];
  const c = rows.slice(0, CFG.COUNT);
  return {
    sliderStart: Math.min(100, Math.max(0, parseFloat(cellText(c[CFG.SLIDER_START])) || 50)),
    beforeImg: resolveImg(c[CFG.BEFORE_IMAGE]),
    beforeAlt: cellText(c[CFG.BEFORE_ALT]),
    beforeWidth: cellText(c[CFG.BEFORE_WIDTH]),
    beforeHeight: cellText(c[CFG.BEFORE_HEIGHT]),
    beforeLabel: cellText(c[CFG.BEFORE_LABEL]) || 'Before',
    beforePos: cellText(c[CFG.BEFORE_POS]) || 'bottom-left',
    afterImg: resolveImg(c[CFG.AFTER_IMAGE]),
    afterAlt: cellText(c[CFG.AFTER_ALT]),
    afterWidth: cellText(c[CFG.AFTER_WIDTH]),
    afterHeight: cellText(c[CFG.AFTER_HEIGHT]),
    afterLabel: cellText(c[CFG.AFTER_LABEL]) || 'After',
    afterPos: cellText(c[CFG.AFTER_POS]) || 'bottom-right',
    analyticsId: cellText(c[CFG.ANALYTICS_ID]),
    anchorId: cellText(c[CFG.ANCHOR_ID]),
  };
}

// ─── Image builder ────────────────────────────────────────────────────────────

function buildImg(source, alt, width, height) {
  let img;
  if (source?.tagName === 'PICTURE') {
    img = source.querySelector('img');
    if (alt) img.alt = alt;
    if (width) img.width = width;
    if (height) img.height = height;
    return source;
  }
  img = source?.tagName === 'IMG' ? source : document.createElement('img');
  if (alt) img.alt = alt;
  if (width) img.width = width;
  if (height) img.height = height;
  img.loading = 'lazy';
  return img;
}

// ─── Label builder ────────────────────────────────────────────────────────────

function buildLabel(text, posClass) {
  const span = document.createElement('span');
  span.className = `ic-label ${posClass}`;
  span.textContent = text;
  return span;
}

// ─── GTM analytics ────────────────────────────────────────────────────────────

function setupAnalytics(container, cfg, type) {
  if (!cfg.analyticsId) return;
  const dl = () => { window.dataLayer = window.dataLayer || []; return window.dataLayer; };
  let fired = false;
  container.addEventListener('mouseup', () => {
    if (fired) return;
    fired = true;
    dl().push({ event: 'image_compare_interact', slider_type: type, interaction_id: cfg.analyticsId });
    setTimeout(() => { fired = false; }, 1000);
  });
  container.addEventListener('touchend', () => {
    if (fired) return;
    fired = true;
    dl().push({ event: 'image_compare_interact', slider_type: type, interaction_id: cfg.analyticsId });
    setTimeout(() => { fired = false; }, 1000);
  });
}

// ─── Mode: Horizontal & Vertical ─────────────────────────────────────────────

function buildSlider(cfg, type) {
  const isVertical = type === 'vertical';
  const container = document.createElement('div');
  container.className = 'ic-container';
  container.dataset.type = type;
  container.style.setProperty('--ic-pos', `${cfg.sliderStart}%`);

  // After (base layer — full size)
  const afterWrap = document.createElement('div');
  afterWrap.className = 'ic-after';
  afterWrap.append(buildImg(cfg.afterImg, cfg.afterAlt, cfg.afterWidth, cfg.afterHeight));
  afterWrap.append(buildLabel(cfg.afterLabel, cfg.afterPos));

  // Before (clipped overlay)
  const beforeWrap = document.createElement('div');
  beforeWrap.className = 'ic-before';
  const beforeImgClone = cfg.beforeImg?.cloneNode(true) || cfg.beforeImg;
  beforeWrap.append(buildImg(beforeImgClone, cfg.beforeAlt, cfg.beforeWidth, cfg.beforeHeight));
  beforeWrap.append(buildLabel(cfg.beforeLabel, cfg.beforePos));

  // Handle
  const handle = document.createElement('div');
  handle.className = 'ic-handle';
  handle.setAttribute('role', 'slider');
  handle.setAttribute('aria-label', 'Image comparison slider');
  handle.setAttribute('aria-valuemin', '0');
  handle.setAttribute('aria-valuemax', '100');
  handle.setAttribute('aria-valuenow', String(cfg.sliderStart));
  handle.setAttribute('tabindex', '0');

  container.append(afterWrap, beforeWrap, handle);

  // ── Interaction ────────────────────────────────────────────────────────────
  let dragging = false;

  function setPos(pct) {
    const v = Math.max(0, Math.min(100, pct));
    container.style.setProperty('--ic-pos', `${v}%`);
    handle.setAttribute('aria-valuenow', String(Math.round(v)));
  }

  function pctFrom(e) {
    const rect = container.getBoundingClientRect();
    if (isVertical) return ((e.clientY - rect.top) / rect.height) * 100;
    return ((e.clientX - rect.left) / rect.width) * 100;
  }

  handle.addEventListener('mousedown', (e) => { e.preventDefault(); dragging = true; });
  handle.addEventListener('touchstart', () => { dragging = true; }, { passive: true });

  window.addEventListener('mousemove', (e) => { if (dragging) setPos(pctFrom(e)); });
  window.addEventListener('touchmove', (e) => {
    if (dragging) setPos(pctFrom(e.touches[0]));
  }, { passive: true });
  window.addEventListener('mouseup', () => { dragging = false; });
  window.addEventListener('touchend', () => { dragging = false; });

  handle.addEventListener('keydown', (e) => {
    const cur = parseFloat(container.style.getPropertyValue('--ic-pos') || `${cfg.sliderStart}`);
    const step = e.shiftKey ? 10 : 5;
    if (isVertical) {
      if (e.key === 'ArrowUp') { e.preventDefault(); setPos(cur - step); }
      if (e.key === 'ArrowDown') { e.preventDefault(); setPos(cur + step); }
    } else {
      if (e.key === 'ArrowLeft') { e.preventDefault(); setPos(cur - step); }
      if (e.key === 'ArrowRight') { e.preventDefault(); setPos(cur + step); }
    }
  });

  return container;
}

// ─── Mode: Progressive (opacity fade) ────────────────────────────────────────

function buildProgressive(cfg) {
  const container = document.createElement('div');
  container.className = 'ic-container';
  container.dataset.type = 'progressive';
  container.style.setProperty('--ic-opacity', String(cfg.sliderStart / 100));

  // After (base — always visible)
  const afterWrap = document.createElement('div');
  afterWrap.className = 'ic-after';
  afterWrap.append(buildImg(cfg.afterImg, cfg.afterAlt, cfg.afterWidth, cfg.afterHeight));

  // Before (fades over the top)
  const beforeWrap = document.createElement('div');
  beforeWrap.className = 'ic-before';
  const progBeforeClone = cfg.beforeImg?.cloneNode ? cfg.beforeImg.cloneNode(true) : cfg.beforeImg;
  beforeWrap.append(buildImg(progBeforeClone, cfg.beforeAlt, cfg.beforeWidth, cfg.beforeHeight));

  // Range control
  const rangeWrap = document.createElement('div');
  rangeWrap.className = 'ic-range-wrap';

  const leftLbl = document.createElement('span');
  leftLbl.className = 'ic-range-label ic-range-label-left';
  leftLbl.textContent = cfg.beforeLabel;

  const range = document.createElement('input');
  range.type = 'range';
  range.className = 'ic-range';
  range.min = '0';
  range.max = '100';
  range.value = String(cfg.sliderStart);
  range.setAttribute('aria-label', 'Image comparison slider');

  const rightLbl = document.createElement('span');
  rightLbl.className = 'ic-range-label ic-range-label-right';
  rightLbl.textContent = cfg.afterLabel;

  rangeWrap.append(leftLbl, range, rightLbl);
  container.append(afterWrap, beforeWrap, rangeWrap);

  function setOpacity(val) {
    // val 0 → before fully visible (opacity 1), after hidden
    // val 100 → after fully visible (before hidden)
    container.style.setProperty('--ic-opacity', String(1 - val / 100));
  }

  setOpacity(cfg.sliderStart);
  range.addEventListener('input', () => setOpacity(parseFloat(range.value)));

  return container;
}

// ─── Main decorate ────────────────────────────────────────────────────────────

export default function decorate(block) {
  applyCommonProps(block);

  const type = ['vertical', 'progressive'].find((t) => block.classList.contains(t)) || 'horizontal';
  const cfg = readConfig(block);

  if (!cfg.beforeImg || !cfg.afterImg) return;

  if (cfg.anchorId) block.id = cfg.anchorId;
  if (cfg.analyticsId) block.dataset.analyticsInteractionId = cfg.analyticsId;

  const container = type === 'progressive'
    ? buildProgressive(cfg)
    : buildSlider(cfg, type);

  setupAnalytics(container, cfg, type);
  block.replaceChildren(container);
}
