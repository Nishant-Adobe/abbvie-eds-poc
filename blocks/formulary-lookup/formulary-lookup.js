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

function showMessage(status, msg) {
  status.textContent = msg;
}

function renderResultsTable(plans, results, config, page) {
  results.innerHTML = '';
  const perPage = parseInt(config['results-per-page'], 10) || 10;
  const totalPages = Math.ceil(plans.length / perPage);
  const currentPage = Math.min(Math.max(page, 1), totalPages);
  const start = (currentPage - 1) * perPage;
  const slice = plans.slice(start, start + perPage);

  const tableWrapper = document.createElement('div');
  tableWrapper.className = 'formulary-results-table-wrapper';

  const table = document.createElement('table');
  table.className = 'formulary-results-table';

  const thead = document.createElement('thead');
  thead.innerHTML = '<tr><th>Name</th><th>Tier</th><th>Details</th></tr>';
  table.append(thead);

  const tbody = document.createElement('tbody');
  slice.forEach((plan) => {
    const tr = document.createElement('tr');
    tr.className = 'formulary-results-row';
    const tdName = document.createElement('td');
    tdName.textContent = plan.name || '';
    const tdTier = document.createElement('td');
    if (plan.tier) {
      const badge = document.createElement('span');
      badge.className = 'formulary-plan-tier';
      badge.textContent = `Tier ${plan.tier}`;
      tdTier.append(badge);
    }
    const tdDetail = document.createElement('td');
    tdDetail.textContent = plan.detail || '';
    tr.append(tdName, tdTier, tdDetail);
    tbody.append(tr);
  });
  table.append(tbody);
  tableWrapper.append(table);
  results.append(tableWrapper);

  if (totalPages > 1) {
    const pagination = document.createElement('div');
    pagination.className = 'formulary-pagination';

    const prevBtn = document.createElement('button');
    prevBtn.type = 'button';
    prevBtn.className = 'formulary-pagination-btn';
    prevBtn.textContent = 'Previous';
    prevBtn.setAttribute('aria-label', 'Previous page');
    prevBtn.disabled = currentPage <= 1;
    prevBtn.addEventListener('click', () => {
      renderResultsTable(plans, results, config, currentPage - 1);
    });

    const info = document.createElement('span');
    info.className = 'formulary-pagination-info';
    const showStart = start + 1;
    const showEnd = Math.min(start + perPage, plans.length);
    const template = config['pagination-label'] || 'Showing {start}–{end} of {total}';
    info.textContent = template
      .replace('{start}', showStart)
      .replace('{end}', showEnd)
      .replace('{total}', plans.length);

    const nextBtn = document.createElement('button');
    nextBtn.type = 'button';
    nextBtn.className = 'formulary-pagination-btn';
    nextBtn.textContent = 'Next';
    nextBtn.setAttribute('aria-label', 'Next page');
    nextBtn.disabled = currentPage >= totalPages;
    nextBtn.addEventListener('click', () => {
      renderResultsTable(plans, results, config, currentPage + 1);
    });

    pagination.append(prevBtn, info, nextBtn);
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
      showMessage(status, config.error || 'Lookup not configured.');
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
      showMessage(status, config.error || 'An error occurred. Please try again.');
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
      showMessage(status, config.error || 'An error occurred. Please try again.');
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
      showMessage(status, config.error || 'An error occurred. Please try again.');
    }
  });
}

function buildZipVariant(config, section, status, results) {
  const { form, input } = createZipForm(config);
  applyAnalytics(form.querySelector('.formulary-lookup-submit'), config);
  section.append(form);

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const zip = input.value.trim();
    results.innerHTML = '';

    if (!/^\d{5}$/.test(zip)) {
      showMessage(status, 'Please enter a valid 5-digit ZIP code.');
      return;
    }
    if (!config.api) {
      showMessage(status, config.error || 'Lookup not configured.');
      return;
    }

    showLoading(status);
    try {
      const data = await fetchWithRecaptcha(`${config.api}?zip=${encodeURIComponent(zip)}`, config);
      const plans = data.plans || data.results || data || [];
      if (!plans.length) {
        showMessage(status, config['no-results'] || 'No coverage information found.');
        return;
      }
      showMessage(status, '');
      renderResultsTable(plans, results, config, 1);
    } catch {
      showMessage(status, config.error || 'An error occurred. Please try again.');
    }
  });
}

export default async function decorate(block) {
  const config = parseConfig(block);
  const isDynamic = block.classList.contains('dynamic');
  const isZip = block.classList.contains('zip');

  const section = document.createElement('div');
  section.className = 'formulary-lookup-form';

  if (config.heading) {
    const h2 = document.createElement('h2');
    h2.className = 'formulary-lookup-heading';
    h2.textContent = config.heading;
    section.append(h2);
  }

  if (config.description) {
    const p = document.createElement('p');
    p.className = 'formulary-lookup-description';
    p.textContent = config.description;
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

  section.append(status, results);
  block.replaceChildren(section);
}
