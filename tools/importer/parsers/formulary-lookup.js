/*
 * Import parser for formulary-lookup block.
 * Detects and extracts formulary lookup components from AbbVie source sites
 * (SkyriziHCP, RinvoqHCP, Mavyret HCP, Venclexta, etc.) and maps them to
 * the EDS formulary-lookup block table format.
 *
 * Source DOM patterns handled:
 *   - .formulary-container / .abbv-container.formulary-container (wrapper)
 *   - .formulary-lookup-zipcode + .abbv-formulary (zip variant)
 *   - .abbv-formulary-dynamic (dynamic state+county variant)
 *   - .abbv-formulary-dropdown / select (state-lookup variant)
 *   - .abbv-plan-category (filter dropdown)
 *   - .abbv-pick-indication (indication radio group)
 */

export const name = 'Formulary Lookup';

const CONTAINER_SELECTORS = [
  '.formulary-container',
  '.abbv-container.formulary-container',
  '[class*="formulary-container"]',
];

const FORMULARY_INNER = [
  '.formulary-lookup-zipcode',
  '.abbv-formulary',
  '.abbv-formulary-dropdown',
  '.abbv-formulary-dynamic',
];

export function detect(element) {
  for (const sel of CONTAINER_SELECTORS) {
    if (element.matches?.(sel) || element.querySelector?.(sel)) return true;
  }
  for (const sel of FORMULARY_INNER) {
    if (element.matches?.(sel) || element.querySelector?.(sel)) return true;
  }
  return false;
}

function q(el, selector) {
  return el.querySelector(selector);
}

function qa(el, selector) {
  return [...el.querySelectorAll(selector)];
}

function text(el, selector) {
  const t = q(el, selector);
  return t?.textContent?.trim() || '';
}

function html(el, selector) {
  const t = q(el, selector);
  return t?.innerHTML?.trim() || '';
}

function determineVariants(el) {
  const variants = [];

  const hasZip = q(el, '.formulary-lookup-zipcode')
    || q(el, 'input[class*="zip" i]')
    || q(el, 'input[placeholder*="zip" i]')
    || q(el, 'input[placeholder*="Zip"]')
    || q(el, '[class*="abbvformularylookupzip"]');

  const hasDynamic = q(el, '.abbv-formulary-dynamic')
    || q(el, '[data-config*="enableAPI"]');

  if (hasZip) variants.push('zip');
  else if (hasDynamic) variants.push('dynamic');

  const isToolBox = el.closest('.tool-box')
    || q(el, '.tool-box')
    || el.matches?.('[class*="tool-box"]');
  if (isToolBox) variants.push('card');

  const isCentered = el.closest('.text-center')
    || el.closest('[class*="section-fullwidth"]')
    || el.matches?.('.text-center');
  if (isCentered) variants.push('centered');

  return variants;
}

function extractHeading(el) {
  const selectors = [
    '.tool-box-title h3',
    '.tool-box-title h2',
    '.abbv-rich-text h3',
    '.abbv-rich-text h2',
    '.abbv-formulary h3',
    '.abbv-formulary h2',
    '.rich-text h3',
    '.rich-text h2',
    'h3',
    'h2',
  ];
  for (const sel of selectors) {
    const heading = q(el, sel);
    if (heading && heading.textContent.trim()) return heading.innerHTML.trim();
  }
  return '';
}

function extractDescription(el) {
  const descEl = q(el, '.tool-box-description')
    || q(el, '.abbv-formulary-description')
    || q(el, '.abbv-rich-text-common > p:not(:first-child)');
  if (descEl) return descEl.innerHTML.trim();

  const heading = q(el, 'h2, h3');
  if (heading) {
    let sibling = heading.parentElement?.nextElementSibling;
    while (sibling) {
      if (sibling.matches?.('p') && !sibling.textContent.includes('reCAPTCHA')) {
        const descText = sibling.textContent.trim();
        if (descText.length > 20 && descText.length < 500) return sibling.innerHTML.trim();
      }
      if (sibling.matches?.('div.rich-text, .abbv-rich-text')) {
        const inner = sibling.textContent.trim();
        if (inner.length > 20 && inner.length < 500) return sibling.innerHTML.trim();
      }
      sibling = sibling.nextElementSibling;
    }
  }
  return '';
}

function extractIcon(el) {
  const img = q(el, '.tool-box-title img')
    || q(el, '.abbv-formulary img[class*="icon"]')
    || q(el, '.formulary-container img[src*="icon"]')
    || q(el, 'img[src*="clipboard"]')
    || q(el, 'img[src*="formulary"]');
  return img?.getAttribute('src') || '';
}

function extractSubmitLabel(el) {
  const selectors = [
    '.abbv-formulary button[type="submit"]',
    '.abbv-formulary .abbv-button-secondary',
    '.abbv-formulary .abbv-button-primary',
    '.formulary-container button',
    'button.abbv-button-primary',
    'button.abbv-button-secondary',
    'a.abbv-button-primary',
    'a.abbv-button-secondary',
    'button[class*="submit"]',
    'input[type="submit"]',
  ];
  for (const sel of selectors) {
    const btn = q(el, sel);
    if (btn) {
      const label = btn.textContent.trim().replace(/\s+/g, ' ');
      if (label) return label;
    }
  }
  return '';
}

function extractZipLabel(el) {
  const zipInput = q(el, 'input[class*="zip" i]')
    || q(el, 'input[placeholder*="zip" i]')
    || q(el, 'input[placeholder*="Zip"]')
    || q(el, '.abbv-formulary-zipcode input[type="text"]')
    || q(el, '.abbv-formulary input[type="text"]');

  if (!zipInput) return '';

  const id = zipInput.id || zipInput.getAttribute('name');
  if (id) {
    const label = q(el, `label[for="${id}"]`);
    if (label) return label.textContent.trim();
  }

  const parentLabel = zipInput.closest('label');
  if (parentLabel) {
    const clone = parentLabel.cloneNode(true);
    const inner = clone.querySelector('input');
    if (inner) inner.remove();
    const labelText = clone.textContent.trim();
    if (labelText) return labelText;
  }

  const ariaLabel = zipInput.getAttribute('aria-label');
  if (ariaLabel) return ariaLabel;

  const placeholder = zipInput.getAttribute('placeholder');
  if (placeholder && placeholder.toLowerCase().includes('zip')) return placeholder;

  return '*Enter Zip Code';
}

function extractZipPlaceholder(el) {
  const zipInput = q(el, 'input[class*="zip" i]')
    || q(el, 'input[placeholder*="zip" i]')
    || q(el, 'input[placeholder*="Zip"]')
    || q(el, '.abbv-formulary input[type="text"]');
  const placeholder = zipInput?.getAttribute('placeholder') || '';
  if (placeholder.toLowerCase().includes('zip')) return placeholder;
  return placeholder;
}

function extractStateLabel(el) {
  const select = q(el, 'select');
  if (select) {
    const id = select.id || select.getAttribute('name');
    if (id) {
      const label = q(el, `label[for="${id}"]`);
      if (label) return label.textContent.trim();
    }
  }

  const labels = qa(el, 'label');
  for (const label of labels) {
    const t = label.textContent.trim().toLowerCase();
    if (t.includes('state') || t.includes('select')) return label.textContent.trim();
  }

  const stateInput = q(el, '.abbv-state-input, .formulary-dropdown-input');
  if (stateInput) {
    const ariaLabel = stateInput.getAttribute('aria-label') || stateInput.getAttribute('placeholder');
    if (ariaLabel) return ariaLabel;
  }

  return 'Select State';
}

function extractFilterInfo(el) {
  const filterContainer = q(el, '.abbv-plan-category')
    || q(el, '[class*="plan-category"]')
    || q(el, '.abbv-formulary-filter')
    || q(el, '[class*="formulary-filter"]');

  if (!filterContainer) return { label: '', options: '' };

  const anchor = q(filterContainer, '.anchor span, [class*="anchor"] span, label');
  const label = anchor?.textContent?.trim() || '';

  const checkboxes = qa(filterContainer, 'input[type="checkbox"]');
  const options = checkboxes.map((cb) => {
    const cbLabel = cb.closest('label') || q(el, `label[for="${cb.id}"]`);
    return cbLabel?.textContent?.trim() || cb.value || '';
  }).filter(Boolean);

  if (!options.length) {
    const items = qa(filterContainer, 'li, [class*="item"], [class*="option"]');
    items.forEach((item) => {
      const t = item.textContent.trim();
      if (t) options.push(t);
    });
  }

  return { label, options: options.join(',') };
}

function extractIndicationInfo(el) {
  const container = q(el, '.abbv-pick-indication')
    || q(el, '[class*="pick-indication"]')
    || q(el, '[class*="choose-indication"]');

  if (!container) return { label: '', values: '' };

  const heading = q(container, 'h3, h4, label, [class*="heading"], [class*="title"]');
  const label = heading?.textContent?.trim() || '';

  const radios = qa(container, 'input[type="radio"]');
  const values = radios.map((r) => {
    const rLabel = r.closest('label') || q(el, `label[for="${r.id}"]`);
    return rLabel?.textContent?.trim() || r.value || '';
  }).filter(Boolean);

  return { label, values: values.join(',') };
}

function extractRecaptchaNotice(el) {
  const notice = q(el, '.abbv-badgeless-captcha')
    || q(el, '[class*="badgeless-captcha"]')
    || q(el, '[class*="recaptcha-notice"]');
  if (notice) return notice.innerHTML.trim();

  const nodes = qa(el, 'p, div, span');
  for (const node of nodes) {
    const t = node.textContent;
    if (t.includes('reCAPTCHA') && t.includes('Privacy Policy')) {
      return node.innerHTML.trim();
    }
  }
  return '';
}

function extractDisclaimer(el) {
  const disc = q(el, '.abbv-formulary-disclaimer')
    || q(el, '[class*="formulary-disclaimer"]')
    || q(el, '[class*="disclaimer"]');
  if (disc) return disc.innerHTML.trim();

  const patterns = [
    'Preferred means',
    'Coverage requirements',
    'Data feed for formulary',
    'formulary status only',
    'Local can include',
    'Based on paid commercial',
  ];

  const nodes = qa(el, 'p, div');
  for (const node of nodes) {
    const t = node.textContent;
    for (const pattern of patterns) {
      if (t.includes(pattern)) return node.innerHTML.trim();
    }
  }
  return '';
}

function extractRecaptchaKey(el) {
  const script = q(el, 'script[src*="recaptcha"]');
  if (script) {
    const src = script.getAttribute('src') || '';
    const match = src.match(/render=([A-Za-z0-9_-]+)/);
    if (match) return match[1];
  }

  const dataConfig = q(el, '[data-config]');
  if (dataConfig) {
    try {
      const config = JSON.parse(dataConfig.getAttribute('data-config'));
      return config.recaptchaKey || config.recaptchaSiteKey || '';
    } catch { /* not JSON */ }
  }

  const scripts = qa(el, 'script');
  for (const s of scripts) {
    const content = s.textContent;
    const match = content.match(/recaptcha[^"]*?["']([A-Za-z0-9_-]{30,})["']/i);
    if (match) return match[1];
  }
  return '';
}

export function parse(element) {
  const variants = determineVariants(element);
  const isZip = variants.includes('zip');
  const isDynamic = variants.includes('dynamic');

  const heading = extractHeading(element);
  const description = extractDescription(element);
  const icon = extractIcon(element);
  const submitLabel = extractSubmitLabel(element);
  const recaptchaNotice = extractRecaptchaNotice(element);
  const disclaimer = extractDisclaimer(element);
  const recaptchaKey = extractRecaptchaKey(element);

  const cells = [];

  const blockTitle = variants.length
    ? `Formulary Lookup (${variants.join(', ')})`
    : 'Formulary Lookup';
  cells.push([blockTitle]);

  if (icon) cells.push(['icon', icon]);
  if (heading) cells.push(['heading', heading]);
  if (description) cells.push(['description', description]);

  if (isZip) {
    const zipLabel = extractZipLabel(element);
    const zipPlaceholder = extractZipPlaceholder(element);
    if (zipLabel) cells.push(['zip-label', zipLabel]);
    if (zipPlaceholder) cells.push(['zip-placeholder', zipPlaceholder]);
  } else {
    const stateLabel = extractStateLabel(element);
    if (stateLabel) cells.push(['state-label', stateLabel]);
    if (isDynamic) {
      cells.push(['county-label', 'Select your county']);
    }
  }

  if (submitLabel) cells.push(['submit-label', submitLabel]);

  const filter = extractFilterInfo(element);
  if (filter.label) cells.push(['filter-label', filter.label]);
  if (filter.options) cells.push(['filter-options', filter.options]);

  const indications = extractIndicationInfo(element);
  if (indications.label) cells.push(['indication-label', indications.label]);
  if (indications.values) cells.push(['indications', indications.values]);

  if (recaptchaKey) cells.push(['recaptcha-key', recaptchaKey]);
  cells.push(['results-per-page', '10']);
  cells.push(['no-results', 'No coverage information found.']);
  cells.push(['error', 'An error occurred. Please try again.']);

  if (recaptchaNotice) cells.push(['recaptcha-notice', recaptchaNotice]);
  if (disclaimer) cells.push(['disclaimer', disclaimer]);

  return cells;
}
