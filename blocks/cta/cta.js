import { applyCommonProps } from '../../scripts/utils.js';

function cellText(row) {
  return row?.children[0]?.textContent?.trim() || '';
}

function cellHref(row) {
  const a = row?.querySelector('a');
  return a ? a.href : cellText(row);
}

function cellImage(row) {
  const img = row?.querySelector('img');
  return img ? img.src : '';
}

function readConfig(block) {
  const rows = [...block.children];

  const label = cellText(rows[0]) || 'Button';
  const href = cellHref(rows[1]) || '#';
  const ariaLabel = cellText(rows[2]) || '';
  const target = cellText(rows[3]) || '_self';

  let iconType = '';
  let iconFont = '';
  let iconImage = '';
  let iconPosition = '';
  let modalId = '';

  for (let i = 4; i < rows.length; i += 1) {
    const text = cellText(rows[i]);
    const img = cellImage(rows[i]);

    if (text === 'icon-font' || text === 'image' || text === 'none') {
      iconType = text;
    } else if (text === 'i-a' || text === 'i-b') {
      iconPosition = text;
    } else if (/^[0-9a-f]{4,}$/i.test(text) && !iconFont) {
      iconFont = text;
    } else if (img) {
      iconImage = img;
    } else if (text && !modalId && text !== '_self' && text !== '_blank'
      && !text.startsWith('id:') && !text.startsWith('lang:')) {
      modalId = text;
    }
  }

  if (!iconPosition) {
    iconPosition = block.classList.contains('i-b') ? 'i-b' : 'i-a';
  }

  return {
    label, href, ariaLabel, target, iconType, iconFont, iconImage, iconPosition, modalId,
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

  attachIcon(el, buildIcon(cfg), cfg.iconPosition === 'i-b');

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

  attachIcon(el, buildIcon(cfg), cfg.iconPosition === 'i-b');

  if (cfg.analyticsId) {
    el.addEventListener('click', () => pushAnalytics(cfg, block, 'click'));
  }

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
