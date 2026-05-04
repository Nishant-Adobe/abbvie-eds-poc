import { applyCommonProps } from '../../scripts/utils.js';

// Field order (non-tab fields rendered as rows):
// label[0], srText[1], href[2], target[3], icon[4], modalId[5],
// anchorId[6], analyticsId[7]
const CFG = {
  LABEL: 0,
  SR_TEXT: 1,
  HREF: 2,
  TARGET: 3,
  ICON: 4,
  MODAL_ID: 5,
  ANCHOR_ID: 6,
  ANALYTICS_ID: 7,
  COUNT: 8,
};

function cellText(row, idx = 0) {
  return row?.children[idx]?.textContent?.trim() || '';
}

function readConfig(block) {
  const rows = [...block.children];
  const cfg = rows.slice(0, CFG.COUNT);
  return {
    label: cellText(cfg[CFG.LABEL]) || 'Button',
    srText: cellText(cfg[CFG.SR_TEXT]),
    href: cellText(cfg[CFG.HREF]) || '#',
    target: cellText(cfg[CFG.TARGET]) || '_self',
    icon: cellText(cfg[CFG.ICON]),
    modalId: cellText(cfg[CFG.MODAL_ID]),
    anchorId: cellText(cfg[CFG.ANCHOR_ID]),
    analyticsId: cellText(cfg[CFG.ANALYTICS_ID]),
  };
}

function getVariant(block) {
  const variants = [
    'cta-primary', 'cta-secondary', 'cta-tertiary',
    'cta-plain', 'cta-toggle-round', 'cta-toggle-square',
  ];
  return variants.find((v) => block.classList.contains(v)) || 'cta-primary';
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
  return block.classList.contains('cta-toggle-round')
    || block.classList.contains('cta-toggle-square');
}

function buildToggle(cfg, block) {
  const wrapper = document.createElement('label');
  wrapper.className = 'cta-toggle';

  const input = document.createElement('input');
  input.type = 'checkbox';
  input.className = 'cta-toggle-input';
  if (cfg.srText) input.setAttribute('aria-label', cfg.srText);

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
  el.className = 'cta-button';
  el.href = cfg.href;
  el.textContent = cfg.label;

  if (cfg.target === '_blank') {
    el.target = '_blank';
    el.rel = 'noopener';
  }

  if (cfg.srText) el.setAttribute('aria-label', cfg.srText);

  if (cfg.icon) {
    const iconEl = document.createElement('span');
    iconEl.className = `cta-icon icon-${cfg.icon}`;
    iconEl.setAttribute('aria-hidden', 'true');
    if (block.classList.contains('icon-before')) {
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
  el.className = 'cta-button';
  el.dataset.modalId = cfg.modalId;
  el.textContent = cfg.label;

  if (cfg.srText) el.setAttribute('aria-label', cfg.srText);

  if (cfg.icon) {
    const iconEl = document.createElement('span');
    iconEl.className = `cta-icon icon-${cfg.icon}`;
    iconEl.setAttribute('aria-hidden', 'true');
    if (block.classList.contains('icon-before')) {
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
