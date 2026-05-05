import { applyCommonProps } from '../../scripts/utils.js';

// Field order matches template property order in _cta.json:
// label[0], href[1], ariaLabel[2], ctaTarget[3], iconType[4],
// iconFont[5], iconImage[6], iconPosition[7], modalId[8],
// anchorId[9], analyticsId[10], ariaHidden[11]
const CFG = {
  LABEL: 0,
  HREF: 1,
  ARIA_LABEL: 2,
  TARGET: 3,
  ICON_TYPE: 4,
  ICON_FONT: 5,
  ICON_IMAGE: 6,
  ICON_POSITION: 7,
  MODAL_ID: 8,
  ANCHOR_ID: 9,
  ANALYTICS_ID: 10,
  ARIA_HIDDEN: 11,
  COUNT: 12,
};

function cellText(row, idx = 0) {
  return row?.children[idx]?.textContent?.trim() || '';
}

function readConfig(block) {
  const rows = [...block.children];
  const cfg = rows.slice(0, CFG.COUNT);
  return {
    label: cellText(cfg[CFG.LABEL]) || 'Button',
    href: cellText(cfg[CFG.HREF]) || '#',
    ariaLabel: cellText(cfg[CFG.ARIA_LABEL]),
    target: cellText(cfg[CFG.TARGET]) || '_self',
    iconType: cellText(cfg[CFG.ICON_TYPE]),
    iconFont: cellText(cfg[CFG.ICON_FONT]),
    iconImage: cellText(cfg[CFG.ICON_IMAGE]),
    modalId: cellText(cfg[CFG.MODAL_ID]),
    anchorId: cellText(cfg[CFG.ANCHOR_ID]),
    analyticsId: cellText(cfg[CFG.ANALYTICS_ID]),
  };
}

function getVariant(block) {
  const variants = [
    'abbv-button-primary', 'abbv-button-secondary', 'abbv-button-tertiary',
    'abbv-button-plain', 'abbv-switch-round', 'abbv-switch-square',
  ];
  return variants.find((v) => block.classList.contains(v)) || 'abbv-button-primary';
}

function pushAnalytics(cfg, block, action) {
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({
    event: 'cta_interaction',
    cta_action: action,
    cta_id: cfg.analyticsId,
    cta_label: cfg.label,
    cta_variant: getVariant(block),
  });
}

function isToggle(block) {
  return block.classList.contains('abbv-switch-round')
    || block.classList.contains('abbv-switch-square');
}

function buildToggle(cfg, block) {
  const wrapper = document.createElement('label');
  wrapper.className = 'cta-toggle';

  const input = document.createElement('input');
  input.type = 'checkbox';
  input.className = 'cta-toggle-input';
  if (cfg.ariaLabel) input.setAttribute('aria-label', cfg.ariaLabel);

  const slider = document.createElement('span');
  slider.className = 'cta-toggle-slider';

  const labelSpan = document.createElement('span');
  labelSpan.className = 'cta-toggle-label';
  labelSpan.textContent = cfg.label;

  wrapper.append(input, slider, labelSpan);

  if (cfg.analyticsId) {
    input.addEventListener('change', () => {
      const action = input.checked ? 'toggle_on' : 'toggle_off';
      pushAnalytics(cfg, block, action);
    });
  }

  return wrapper;
}

function buildLink(cfg, block) {
  const el = document.createElement('a');
  el.className = 'abbv-cta';
  el.href = cfg.href;
  el.textContent = cfg.label;

  if (cfg.target === '_blank') {
    el.target = '_blank';
    el.rel = 'noopener';
  }

  if (cfg.ariaLabel) el.setAttribute('aria-label', cfg.ariaLabel);

  if (cfg.iconType && cfg.iconType !== 'none') {
    const iconEl = document.createElement('span');
    iconEl.className = `cta-icon icon-${cfg.iconFont}`;
    iconEl.setAttribute('aria-hidden', 'true');
    if (block.classList.contains('i-b')) {
      el.prepend(iconEl);
    } else {
      el.append(iconEl);
    }
  }

  if (cfg.analyticsId) {
    el.addEventListener('click', () => pushAnalytics(cfg, block, 'click'));
  }

  return el;
}

function buildButton(cfg, block) {
  const el = document.createElement('button');
  el.type = 'button';
  el.className = 'abbv-cta';
  el.dataset.modalId = cfg.modalId;
  el.textContent = cfg.label;

  if (cfg.ariaLabel) el.setAttribute('aria-label', cfg.ariaLabel);

  if (cfg.iconType && cfg.iconType !== 'none') {
    const iconEl = document.createElement('span');
    iconEl.className = `cta-icon icon-${cfg.iconFont}`;
    iconEl.setAttribute('aria-hidden', 'true');
    if (block.classList.contains('i-b')) {
      el.prepend(iconEl);
    } else {
      el.append(iconEl);
    }
  }

  if (cfg.analyticsId) {
    el.addEventListener('click', () => pushAnalytics(cfg, block, 'click'));
  }

  return el;
}

export default function decorate(block) {
  applyCommonProps(block);

  const cfg = readConfig(block);

  if (cfg.anchorId) block.id = cfg.anchorId;

  block.textContent = '';

  const wrapper = document.createElement('span');
  wrapper.className = 'cta-wrapper';

  let element;
  if (isToggle(block)) {
    element = buildToggle(cfg, block);
  } else if (cfg.modalId) {
    element = buildButton(cfg, block);
  } else {
    element = buildLink(cfg, block);
  }

  wrapper.append(element);
  block.append(wrapper);

  block.dispatchEvent(
    new CustomEvent('cta:ready', { bubbles: true, detail: { cfg } }),
  );
}
