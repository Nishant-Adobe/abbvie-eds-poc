import { getRecaptchaToken } from '../eds-form/recaptcha.js';

const US_STATES = [
  ['Alabama', 'AL'], ['Alaska', 'AK'], ['Arizona', 'AZ'], ['Arkansas', 'AR'], ['California', 'CA'],
  ['Colorado', 'CO'], ['Connecticut', 'CT'], ['Delaware', 'DE'], ['Florida', 'FL'], ['Georgia', 'GA'],
  ['Hawaii', 'HI'], ['Idaho', 'ID'], ['Illinois', 'IL'], ['Indiana', 'IN'], ['Iowa', 'IA'],
  ['Kansas', 'KS'], ['Kentucky', 'KY'], ['Louisiana', 'LA'], ['Maine', 'ME'], ['Maryland', 'MD'],
  ['Massachusetts', 'MA'], ['Michigan', 'MI'], ['Minnesota', 'MN'], ['Mississippi', 'MS'], ['Missouri', 'MO'],
  ['Montana', 'MT'], ['Nebraska', 'NE'], ['Nevada', 'NV'], ['New Hampshire', 'NH'], ['New Jersey', 'NJ'],
  ['New Mexico', 'NM'], ['New York', 'NY'], ['North Carolina', 'NC'], ['North Dakota', 'ND'], ['Ohio', 'OH'],
  ['Oklahoma', 'OK'], ['Oregon', 'OR'], ['Pennsylvania', 'PA'], ['Rhode Island', 'RI'], ['South Carolina', 'SC'],
  ['South Dakota', 'SD'], ['Tennessee', 'TN'], ['Texas', 'TX'], ['Utah', 'UT'], ['Vermont', 'VT'],
  ['Virginia', 'VA'], ['Washington', 'WA'], ['West Virginia', 'WV'], ['Wisconsin', 'WI'], ['Wyoming', 'WY'],
];

function parseConfig(block) {
  const config = {};
  [...block.children].forEach((row) => {
    const cells = [...row.children];
    const key = cells[0]?.textContent.trim().toLowerCase().replace(/\s+/g, '-');
    config[key] = cells[1]?.textContent.trim() || cells[0]?.textContent.trim();
  });
  return config;
}

function createStateSelect(config, id) {
  const label = document.createElement('label');
  label.className = 'formulary-lookup-label';
  label.htmlFor = id;
  label.textContent = config['state-label'] || 'Select your state';

  const select = document.createElement('select');
  select.id = id;
  select.className = 'formulary-lookup-select';
  select.setAttribute('aria-label', config['state-label'] || 'Select your state');

  const defaultOpt = document.createElement('option');
  defaultOpt.value = '';
  defaultOpt.textContent = '— Select a state —';
  select.append(defaultOpt);

  US_STATES.forEach(([name, code]) => {
    const opt = document.createElement('option');
    opt.value = code;
    opt.textContent = name;
    select.append(opt);
  });

  return { label, select };
}

function createCountySelect(config, id) {
  const wrapper = document.createElement('div');
  wrapper.className = 'formulary-lookup-county-wrapper';
  wrapper.hidden = true;

  const label = document.createElement('label');
  label.className = 'formulary-lookup-label';
  label.htmlFor = id;
  label.textContent = config['county-label'] || 'Select your county';

  const select = document.createElement('select');
  select.id = id;
  select.className = 'formulary-lookup-select';
  select.setAttribute('aria-label', config['county-label'] || 'Select your county');
  select.disabled = true;

  const defaultOpt = document.createElement('option');
  defaultOpt.value = '';
  defaultOpt.textContent = '— Select a county —';
  select.append(defaultOpt);

  wrapper.append(label, select);
  return { wrapper, select };
}

function createZipForm(config) {
  const form = document.createElement('form');
  form.className = 'formulary-lookup-zip-form';
  form.setAttribute('novalidate', '');

  const label = document.createElement('label');
  label.className = 'formulary-lookup-label';
  label.htmlFor = 'formulary-zip';
  label.textContent = config['zip-label'] || 'Enter your ZIP code';

  const inputGroup = document.createElement('div');
  inputGroup.className = 'formulary-lookup-input-group';

  const input = document.createElement('input');
  input.type = 'text';
  input.id = 'formulary-zip';
  input.className = 'formulary-lookup-zip-input';
  input.pattern = '[0-9]{5}';
  input.inputMode = 'numeric';
  input.maxLength = 5;
  input.placeholder = config['zip-placeholder'] || '';
  input.setAttribute('aria-label', config['zip-label'] || 'Enter your ZIP code');
  input.required = true;

  const btn = document.createElement('button');
  btn.type = 'submit';
  btn.className = 'formulary-lookup-submit';
  btn.textContent = config['submit-label'] || 'Search';

  inputGroup.append(input, btn);
  form.append(label, inputGroup);
  return { form, input };
}

function createStatus() {
  const status = document.createElement('div');
  status.className = 'formulary-lookup-status';
  status.setAttribute('aria-live', 'polite');
  return status;
}

function createResultsContainer() {
  const results = document.createElement('div');
  results.className = 'formulary-lookup-results';
  return results;
}

function showLoading(status) {
  status.innerHTML = '';
  const spinner = document.createElement('div');
  spinner.className = 'formulary-lookup-loading';
  spinner.setAttribute('aria-label', 'Loading results');
  status.append(spinner);
}

function showMessage(status, msg, isError = false) {
  status.textContent = msg;
  status.classList.toggle('error', isError);
}

function renderResultsTable(plans, results, config, page) {
  results.innerHTML = '';
  const perPage = parseInt(config['results-per-page'], 10) || 10;
  const totalPages = Math.ceil(plans.length / perPage);
  const currentPage = Math.min(Math.max(page, 1), totalPages);
  const start = (currentPage - 1) * perPage;
  const slice = plans.slice(start, start + perPage);

  const heading = document.createElement('h3');
  heading.className = 'formulary-results-heading';
  heading.textContent = 'Formulary Status Results';
  results.append(heading);

  const list = document.createElement('div');
  list.className = 'formulary-results-list';
  list.setAttribute('role', 'table');
  list.setAttribute('aria-label', 'Insurance Plans');

  const header = document.createElement('div');
  header.className = 'formulary-results-header';
  header.setAttribute('role', 'rowgroup');
  ['Plan Name', 'Plan Type', 'Status'].forEach((t) => {
    const col = document.createElement('div');
    col.className = 'formulary-results-col';
    col.setAttribute('role', 'columnheader');
    col.textContent = t;
    header.append(col);
  });
  list.append(header);

  slice.forEach((plan) => {
    const row = document.createElement('div');
    row.className = 'formulary-results-row';
    row.setAttribute('role', 'row');

    const colName = document.createElement('div');
    colName.className = 'formulary-results-col formulary-col-name';
    colName.setAttribute('role', 'cell');
    colName.textContent = plan.name || '';

    const colType = document.createElement('div');
    colType.className = 'formulary-results-col formulary-col-type';
    colType.setAttribute('role', 'cell');
    colType.textContent = plan.type || plan.tier || '';

    const colStatus = document.createElement('div');
    colStatus.className = 'formulary-results-col formulary-col-status';
    colStatus.setAttribute('role', 'cell');
    colStatus.textContent = plan.status || plan.detail || '';

    row.append(colName, colType, colStatus);
    list.append(row);
  });
  results.append(list);

  if (totalPages > 1) {
    const pagination = document.createElement('div');
    pagination.className = 'formulary-pagination';

    const prevBtn = document.createElement('button');
    prevBtn.type = 'button';
    prevBtn.className = 'formulary-pagination-btn';
    prevBtn.setAttribute('aria-label', 'Previous page');
    prevBtn.innerHTML = '&#8249;';
    prevBtn.disabled = currentPage <= 1;
    prevBtn.addEventListener('click', () => {
      renderResultsTable(plans, results, config, currentPage - 1);
    });

    pagination.append(prevBtn);
    for (let p = 1; p <= totalPages; p += 1) {
      const pageBtn = document.createElement('button');
      pageBtn.type = 'button';
      pageBtn.className = 'formulary-pagination-num';
      if (p === currentPage) pageBtn.classList.add('is-active');
      pageBtn.textContent = p;
      pageBtn.setAttribute('aria-label', `Page ${p}`);
      pageBtn.addEventListener('click', () => {
        renderResultsTable(plans, results, config, p);
      });
      pagination.append(pageBtn);
    }

    const nextBtn = document.createElement('button');
    nextBtn.type = 'button';
    nextBtn.className = 'formulary-pagination-btn';
    nextBtn.setAttribute('aria-label', 'Next page');
    nextBtn.innerHTML = '&#8250;';
    nextBtn.disabled = currentPage >= totalPages;
    nextBtn.addEventListener('click', () => {
      renderResultsTable(plans, results, config, currentPage + 1);
    });

    pagination.append(nextBtn);
    results.append(pagination);
  }
}

async function fetchWithRecaptcha(url, config) {
  const headers = {};
  if (config['recaptcha-key']) {
    try {
      const token = await getRecaptchaToken(config['recaptcha-key'], 'formulary_lookup');
      headers['x-recaptcha-token'] = token;
    } catch {
      // proceed without token if reCAPTCHA fails
    }
  }
  const resp = await fetch(url, { headers });
  if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
  return resp.json();
}

function applyAnalytics(el, config) {
  if (config.analyticsid) {
    el.setAttribute('data-analytics', config.analyticsid);
  }
}

function buildDefaultVariant(config, section, status, results) {
  const { label, select } = createStateSelect(config, 'formulary-state');
  applyAnalytics(select, config);
  section.append(label, select);

  select.addEventListener('change', async () => {
    const state = select.value;
    if (!state) {
      results.innerHTML = '';
      showMessage(status, '');
      return;
    }
    results.innerHTML = '';
    if (!config.api) {
      showMessage(status, config.error || 'Lookup not configured.', true);
      return;
    }
    showLoading(status);
    try {
      const data = await fetchWithRecaptcha(`${config.api}?state=${encodeURIComponent(state)}`, config);
      const plans = data.plans || data.results || data || [];
      if (!plans.length) {
        showMessage(status, config['no-results'] || 'No coverage information found.');
        return;
      }
      showMessage(status, '');
      renderResultsTable(plans, results, config, 1);
    } catch {
      showMessage(status, config.error || 'An error occurred. Please try again.', true);
    }
  });
}

function buildDynamicVariant(config, section, status, results) {
  const { label: stateLabel, select: stateSelect } = createStateSelect(config, 'formulary-state');
  const { wrapper: countyWrapper, select: countySelect } = createCountySelect(config, 'formulary-county');
  applyAnalytics(countySelect, config);
  section.append(stateLabel, stateSelect, countyWrapper);

  stateSelect.addEventListener('change', async () => {
    const state = stateSelect.value;
    countySelect.innerHTML = '';
    results.innerHTML = '';
    showMessage(status, '');

    const defaultOpt = document.createElement('option');
    defaultOpt.value = '';
    defaultOpt.textContent = '— Select a county —';
    countySelect.append(defaultOpt);

    if (!state || !config.api) {
      countyWrapper.hidden = true;
      countySelect.disabled = true;
      return;
    }

    countyWrapper.hidden = false;
    countySelect.disabled = true;
    showLoading(status);

    try {
      const data = await fetchWithRecaptcha(`${config.api}?state=${encodeURIComponent(state)}&list=counties`, config);
      const counties = data.counties || data.results || data || [];
      if (!counties.length) {
        showMessage(status, config['no-results'] || 'No counties found for this state.');
        return;
      }
      showMessage(status, '');
      counties.forEach((county) => {
        const opt = document.createElement('option');
        const name = typeof county === 'string' ? county : county.name || county.county;
        opt.value = name;
        opt.textContent = name;
        countySelect.append(opt);
      });
      countySelect.disabled = false;
    } catch {
      showMessage(status, config.error || 'An error occurred. Please try again.', true);
    }
  });

  countySelect.addEventListener('change', async () => {
    const state = stateSelect.value;
    const county = countySelect.value;
    results.innerHTML = '';
    if (!county || !state || !config.api) return;

    showLoading(status);
    try {
      const data = await fetchWithRecaptcha(
        `${config.api}?state=${encodeURIComponent(state)}&county=${encodeURIComponent(county)}`,
        config,
      );
      const plans = data.plans || data.results || data || [];
      if (!plans.length) {
        showMessage(status, config['no-results'] || 'No coverage information found.');
        return;
      }
      showMessage(status, '');
      renderResultsTable(plans, results, config, 1);
    } catch {
      showMessage(status, config.error || 'An error occurred. Please try again.', true);
    }
  });
}

function createIcon(config) {
  if (!config.icon) return null;
  const wrapper = document.createElement('div');
  wrapper.className = 'formulary-lookup-icon';
  const img = document.createElement('img');
  img.src = config.icon;
  img.alt = '';
  img.loading = 'lazy';
  wrapper.append(img);
  return wrapper;
}

function createRecaptchaNotice(config) {
  if (!config['recaptcha-notice']) return null;
  const div = document.createElement('div');
  div.className = 'formulary-lookup-recaptcha-notice';
  div.innerHTML = config['recaptcha-notice'];
  return div;
}

function createDisclaimer(config) {
  if (!config.disclaimer) return null;
  const div = document.createElement('div');
  div.className = 'formulary-lookup-disclaimer';
  div.innerHTML = config.disclaimer;
  return div;
}

function createFilterDropdown(config) {
  if (!config['filter-label']) return null;
  const wrapper = document.createElement('div');
  wrapper.className = 'formulary-lookup-filter';

  const anchor = document.createElement('div');
  anchor.className = 'formulary-lookup-filter-anchor';
  anchor.setAttribute('tabindex', '0');
  anchor.setAttribute('role', 'button');
  anchor.setAttribute('aria-expanded', 'false');
  anchor.setAttribute('aria-label', config['filter-label']);

  const anchorText = document.createElement('span');
  anchorText.className = 'formulary-lookup-filter-text';
  anchorText.textContent = config['filter-label'];

  const clearBtn = document.createElement('button');
  clearBtn.type = 'button';
  clearBtn.className = 'formulary-lookup-filter-clear';
  clearBtn.setAttribute('aria-label', 'Clear filter');
  clearBtn.textContent = '✕';
  clearBtn.hidden = true;

  anchor.append(anchorText, clearBtn);

  const panel = document.createElement('div');
  panel.className = 'formulary-lookup-filter-panel';
  panel.hidden = true;

  const opts = (config['filter-options'] || '')
    .split(',').map((o) => o.trim()).filter(Boolean);
  opts.forEach((opt, i) => {
    const item = document.createElement('label');
    item.className = 'formulary-lookup-filter-option';
    const cb = document.createElement('input');
    cb.type = 'checkbox';
    cb.value = opt;
    cb.id = `formulary-filter-${i}`;
    item.append(cb, document.createTextNode(` ${opt}`));
    panel.append(item);
  });

  wrapper.append(anchor, panel);

  function getSelected() {
    return [...panel.querySelectorAll('input:checked')]
      .map((cb) => cb.value);
  }

  anchor.addEventListener('click', (e) => {
    if (e.target === clearBtn) return;
    const open = panel.hidden;
    panel.hidden = !open;
    anchor.setAttribute('aria-expanded', String(open));
    wrapper.classList.toggle('is-open', open);
  });

  clearBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    panel.querySelectorAll('input').forEach((cb) => {
      cb.checked = false;
    });
    clearBtn.hidden = true;
    anchorText.textContent = config['filter-label'];
    panel.hidden = true;
    anchor.setAttribute('aria-expanded', 'false');
    wrapper.classList.remove('is-open');
  });

  panel.addEventListener('change', () => {
    const sel = getSelected();
    if (sel.length) {
      anchorText.textContent = sel.join(', ');
      clearBtn.hidden = false;
    } else {
      anchorText.textContent = config['filter-label'];
      clearBtn.hidden = true;
    }
  });

  document.addEventListener('click', (e) => {
    if (!wrapper.contains(e.target) && !panel.hidden) {
      panel.hidden = true;
      anchor.setAttribute('aria-expanded', 'false');
      wrapper.classList.remove('is-open');
    }
  });

  return { wrapper, getSelected };
}

function createIndicationRadio(config) {
  if (!config['indication-label'] || !config.indications) return null;
  const wrapper = document.createElement('div');
  wrapper.className = 'formulary-lookup-indications';

  const heading = document.createElement('h3');
  heading.className = 'formulary-lookup-indications-heading';
  heading.textContent = config['indication-label'];

  const group = document.createElement('div');
  group.className = 'formulary-lookup-indications-group';

  const items = config.indications.split(',').map((o) => o.trim()).filter(Boolean);
  items.forEach((item, i) => {
    const radio = document.createElement('input');
    radio.type = 'radio';
    radio.name = 'formulary-indication';
    radio.id = `formulary-ind-${i}`;
    radio.value = item;
    if (i === 0) radio.checked = true;

    const label = document.createElement('label');
    label.htmlFor = `formulary-ind-${i}`;
    label.textContent = item;

    const container = document.createElement('label');
    container.append(radio, document.createTextNode(` ${item}`));
    group.append(container);
  });

  wrapper.append(heading, group);
  return wrapper;
}

function buildZipVariant(config, section, status, results) {
  const { form, input } = createZipForm(config);
  const submitBtn = form.querySelector('.formulary-lookup-submit');
  applyAnalytics(submitBtn, config);

  const filter = createFilterDropdown(config);
  const indications = createIndicationRadio(config);

  if (filter || indications) {
    submitBtn.remove();
    if (filter) form.append(filter.wrapper);
    if (indications) form.append(indications);
    form.append(submitBtn);
  }

  section.append(form);

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const zip = input.value.trim();
    results.innerHTML = '';

    if (!/^\d{5}$/.test(zip)) {
      showMessage(status, 'Please enter a valid 5-digit ZIP code.', true);
      return;
    }
    if (!config.api) {
      showMessage(status, config.error || 'Lookup not configured.', true);
      return;
    }

    let url = `${config.api}?zip=${encodeURIComponent(zip)}`;
    if (filter) {
      const sel = filter.getSelected();
      if (sel.length) url += `&filter=${encodeURIComponent(sel.join(','))}`;
    }
    const indicationRadio = form.querySelector('input[name="formulary-indication"]:checked');
    if (indicationRadio) url += `&indication=${encodeURIComponent(indicationRadio.value)}`;

    showLoading(status);
    try {
      const data = await fetchWithRecaptcha(url, config);
      const plans = data.plans || data.results || data || [];
      if (!plans.length) {
        showMessage(status, config['no-results'] || 'No coverage information found.');
        return;
      }
      showMessage(status, '');
      renderResultsTable(plans, results, config, 1);
    } catch {
      showMessage(status, config.error || 'An error occurred. Please try again.', true);
    }
  });
}

export default async function decorate(block) {
  const config = parseConfig(block);
  const isDynamic = block.classList.contains('dynamic');
  const isZip = block.classList.contains('zip');

  const section = document.createElement('div');
  section.className = 'formulary-lookup-form';

  const icon = createIcon(config);
  if (icon) section.append(icon);

  if (config.heading) {
    const h2 = document.createElement('h2');
    h2.className = 'formulary-lookup-heading';
    h2.innerHTML = config.heading;
    section.append(h2);
  }

  if (config.description) {
    const p = document.createElement('p');
    p.className = 'formulary-lookup-description';
    p.innerHTML = config.description;
    section.append(p);
  }

  const status = createStatus();
  const results = createResultsContainer();

  if (isZip) {
    buildZipVariant(config, section, status, results);
  } else if (isDynamic) {
    buildDynamicVariant(config, section, status, results);
  } else {
    buildDefaultVariant(config, section, status, results);
  }

  const recaptchaNotice = createRecaptchaNotice(config);
  if (recaptchaNotice) section.append(recaptchaNotice);

  section.append(status, results);

  const disclaimer = createDisclaimer(config);
  if (disclaimer) section.append(disclaimer);

  block.replaceChildren(section);
}
