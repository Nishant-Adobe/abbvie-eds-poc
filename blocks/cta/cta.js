import { applyCommonProps } from '../../scripts/utils.js';

// Field order matches model fields in _cta.json (excluding tabs):
// 0:label, 1:href, 2:ariaLabel, 3:ctaTarget, 4:modalId,
// 5:iconType, 6:iconFont, 7:iconImage, 8:iconPosition, 9:ariaHidden
const CFG = {
  LABEL: 0,
  HREF: 1,
  ARIA_LABEL: 2,
  TARGET: 3,
  MODAL_ID: 4,
  ICON_TYPE: 5,
  ICON_FONT: 6,
  ICON_IMAGE: 7,
  ICON_POSITION: 8,
  ARIA_HIDDEN: 9,
};

function cellText(row) {
  const el = row?.children?.[0];
  return el?.textContent?.trim() || '';
}

function cellHref(row) {
  const a = row?.querySelector('a');
  return a ? a.getAttribute('href') || a.href : cellText(row);
}

function cellImage(row) {
  const img = row?.querySelector('img');
  if (img) return img.getAttribute('src') || img.src;
  const pic = row?.querySelector('picture source');
  if (pic) return pic.getAttribute('srcset');
  return '';
}

function readConfig(block) {
  const rows = [...block.children];
  return {
    label: cellText(rows[CFG.LABEL]) || 'Button',
    href: cellHref(rows[CFG.HREF]) || '#',
    ariaLabel: cellText(rows[CFG.ARIA_LABEL]),
    target: cellText(rows[CFG.TARGET]) || '_self',
    modalId: cellText(rows[CFG.MODAL_ID]),
    iconType: cellText(rows[CFG.ICON_TYPE]) || 'none',
    iconFont: cellText(rows[CFG.ICON_FONT]),
    iconImage: cellImage(rows[CFG.ICON_IMAGE]) || cellText(rows[CFG.ICON_IMAGE]),
    iconPosition: cellText(rows[CFG.ICON_POSITION])
      || (block.classList.contains('i-b') ? 'i-b' : 'i-a'),
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

  input.addEventListener('change', () => {
    const action = input.checked ? 'toggle_on' : 'toggle_off';
    pushAnalytics(cfg, block, action);
  });

  return wrapper;
}

function buildIcon(cfg) {
  if (!cfg.iconType || cfg.iconType === 'none') return null;

  if (cfg.iconType === 'image' && cfg.iconImage) {
    const iconEl = document.createElement('span');
    iconEl.className = 'cta-icon cta-icon-image';
    iconEl.setAttribute('aria-hidden', 'true');
    const img = document.createElement('img');
    img.src = cfg.iconImage;
    img.alt = '';
    img.loading = 'lazy';
    iconEl.append(img);
    return iconEl;
  }

  if (cfg.iconType === 'icon-font' && cfg.iconFont) {
    const iconEl = document.createElement('span');
    iconEl.className = 'cta-icon cta-icon-font';
    iconEl.setAttribute('aria-hidden', 'true');
    const code = cfg.iconFont.replace(/^\\u|^0x|^u\+/i, '');
    iconEl.style.setProperty('--cta-icon-content', `'\\${code}'`);
    return iconEl;
  }

  return null;
}

function attachIcon(el, iconEl, isBefore) {
  if (!iconEl) return;
  if (isBefore) {
    el.prepend(iconEl);
  } else {
    el.append(iconEl);
  }
}

function buildLink(cfg) {
  const el = document.createElement('a');
  el.className = 'abbv-cta';
  el.href = cfg.href;
  el.textContent = cfg.label;

  if (cfg.target === '_blank') {
    el.target = '_blank';
    el.rel = 'noopener';
  }

  if (cfg.ariaLabel) el.setAttribute('aria-label', cfg.ariaLabel);

  attachIcon(el, buildIcon(cfg), cfg.iconPosition === 'i-b');

  return el;
}

function buildButton(cfg) {
  const el = document.createElement('button');
  el.type = 'button';
  el.className = 'abbv-cta';
  el.dataset.modalId = cfg.modalId;
  el.textContent = cfg.label;

  if (cfg.ariaLabel) el.setAttribute('aria-label', cfg.ariaLabel);

  attachIcon(el, buildIcon(cfg), cfg.iconPosition === 'i-b');

  return el;
}

export default function decorate(block) {
  applyCommonProps(block);

  const cfg = readConfig(block);

  if (cfg.iconType && cfg.iconType !== 'none' && cfg.iconPosition) {
    block.classList.add(cfg.iconPosition);
  }

  block.textContent = '';

  const wrapper = document.createElement('span');
  wrapper.className = 'cta-wrapper';

  let element;
  if (isToggle(block)) {
    element = buildToggle(cfg, block);
  } else if (cfg.modalId) {
    element = buildButton(cfg);
  } else {
    element = buildLink(cfg);
  }

  wrapper.append(element);
  block.append(wrapper);

  block.dispatchEvent(
    new CustomEvent('cta:ready', { bubbles: true, detail: { cfg } }),
  );
}
