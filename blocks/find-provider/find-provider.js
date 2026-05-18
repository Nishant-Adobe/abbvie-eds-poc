import { renderBlock } from '../../scripts/multi-theme.js';

const DUMMY_PROVIDERS_URL = new URL('./dummy-providers.json', import.meta.url).href;
const MIN_LOADER_DELAY_MS = 800;

let blockCounter = 0;
let dummyProvidersCache = null;

async function loadDummyProviders() {
  if (dummyProvidersCache) return dummyProvidersCache;
  try {
    const resp = await fetch(DUMMY_PROVIDERS_URL);
    if (!resp.ok) return [];
    const data = await resp.json();
    dummyProvidersCache = data.results || data.providers || [];
    return dummyProvidersCache;
  } catch {
    return [];
  }
}

// Must match the field order in _find-provider.json (excluding tab, classes, and common-prop)
const FIELD_ORDER = [
  'search-label',
  'search-placeholder',
  'radius-label',
  'specialty-label',
  'submit-label',
  'geo-button-label',
  'clear-label',
  'terms-label',
  'terms-text',
  'no-results',
  'error',
  'captcha-message',
  'api-endpoint',
  'indication',
  'exit-modal-id',
  'anchor-id',
];

const RICHTEXT_KEYS = new Set(['terms-text', 'captcha-message']);

// UE renders each field as a single-column row; Google Doc authoring uses key | value rows
function isUEMode(block) {
  const firstRow = block.children[0];
  return firstRow ? firstRow.children.length === 1 : false;
}

function readConfig(block) {
  const config = {};
  const rows = [...block.children];
  const ue = isUEMode(block);

  rows.forEach((row, i) => {
    const cells = [...row.children];
    const key = ue ? FIELD_ORDER[i] : cells[0]?.textContent.trim().toLowerCase().replace(/\s+/g, '-');
    const cell = ue ? cells[0] : cells[1];
    if (!key || !cell) return;
    config[key] = RICHTEXT_KEYS.has(key) ? cell.innerHTML.trim() : cell.textContent.trim();
  });

  return config;
}

function buildForm(config, blockId, isLocation) {
  const form = document.createElement('form');
  form.className = 'find-provider-form';
  form.setAttribute('novalidate', '');

  // Search input
  const searchInput = document.createElement('input');
  searchInput.type = 'text';
  searchInput.id = `${blockId}-search`;
  searchInput.name = 'search';
  searchInput.className = 'find-provider-search-input';
  if (config['search-placeholder']) searchInput.placeholder = config['search-placeholder'];

  const searchGroup = document.createElement('div');
  searchGroup.className = 'find-provider-field-group';
  if (config['search-label']) {
    const label = document.createElement('label');
    label.htmlFor = searchInput.id;
    label.className = 'find-provider-label';
    label.textContent = config['search-label'];
    searchGroup.append(label);
  }

  const searchRow = document.createElement('div');
  searchRow.className = 'find-provider-search-row';
  searchRow.append(searchInput);

  if (isLocation && config['geo-button-label']) {
    const geoBtn = document.createElement('button');
    geoBtn.type = 'button';
    geoBtn.className = 'find-provider-geo-btn';
    const geoIcon = document.createElement('span');
    geoIcon.className = 'find-provider-geo-icon';
    geoIcon.setAttribute('aria-hidden', 'true');
    const geoText = document.createElement('span');
    geoText.textContent = config['geo-button-label'];
    geoBtn.append(geoIcon, geoText);
    searchRow.append(geoBtn);
  }

  searchGroup.append(searchRow);

  const searchError = document.createElement('span');
  searchError.className = 'find-provider-error find-provider-search-error';
  searchError.setAttribute('aria-live', 'polite');
  searchGroup.append(searchError);

  form.append(searchGroup);

  // Terms & Conditions checkbox
  if (config['terms-label'] || config['terms-text']) {
    const termsGroup = document.createElement('div');
    termsGroup.className = 'find-provider-field-group find-provider-terms-group';

    if (config['terms-label']) {
      const termsHeading = document.createElement('span');
      termsHeading.className = 'find-provider-label';
      termsHeading.textContent = config['terms-label'];
      termsGroup.append(termsHeading);
    }

    const termsCheckboxLabel = document.createElement('label');
    termsCheckboxLabel.className = 'find-provider-terms-label';
    termsCheckboxLabel.htmlFor = `${blockId}-terms`;

    const termsCheckbox = document.createElement('input');
    termsCheckbox.type = 'checkbox';
    termsCheckbox.id = `${blockId}-terms`;
    termsCheckbox.className = 'find-provider-terms-checkbox';
    termsCheckbox.name = 'terms';

    const termsText = document.createElement('span');
    termsText.className = 'find-provider-terms-text';
    if (config['terms-text']) {
      // terms-text is authored rich text from CMS (see RICHTEXT_KEYS)
      termsText.innerHTML = config['terms-text'];
    }

    termsCheckboxLabel.append(termsCheckbox, termsText);
    termsGroup.append(termsCheckboxLabel);

    const termsError = document.createElement('span');
    termsError.className = 'find-provider-error find-provider-terms-error';
    termsError.setAttribute('aria-live', 'polite');
    termsGroup.append(termsError);

    form.append(termsGroup);
  }

  const actions = document.createElement('div');
  actions.className = 'find-provider-actions';

  if (config['submit-label']) {
    const submitBtn = document.createElement('button');
    submitBtn.type = 'submit';
    submitBtn.className = 'find-provider-submit button primary';
    submitBtn.textContent = config['submit-label'];
    actions.append(submitBtn);
  }

  if (config['clear-label']) {
    const clearBtn = document.createElement('button');
    clearBtn.type = 'button';
    clearBtn.className = 'find-provider-clear button';
    clearBtn.textContent = config['clear-label'];
    actions.append(clearBtn);
  }

  form.append(actions);

  if (config['captcha-message']) {
    const captcha = document.createElement('div');
    captcha.className = 'find-provider-captcha-message';
    // captcha-message is authored rich text from CMS (see RICHTEXT_KEYS)
    captcha.innerHTML = config['captcha-message'];
    form.append(captcha);
  }

  return form;
}

function letterFromIndex(index) {
  return String.fromCharCode(65 + (index % 26));
}

function buildResultCard(provider, config, index = 0) {
  const li = document.createElement('li');
  li.className = 'find-provider-result';

  const address = provider.PartyAddress?.[0] || {};
  const phone = provider.Communication?.find(
    (c) => c.CommunicationTypeDescription === 'Telephone',
  )?.CommunicationValueText || provider.phone || '';

  const pin = document.createElement('span');
  pin.className = 'find-provider-result-pin';
  pin.textContent = letterFromIndex(index);
  pin.setAttribute('aria-hidden', 'true');
  li.append(pin);

  const degree = provider.HCPExtension?.DegreeCode || provider.specialty || '';
  const fullName = [provider.PartyName || provider.name || '', degree].filter(Boolean).join(', ');
  const name = document.createElement('strong');
  name.className = 'find-provider-result-name';
  name.textContent = fullName;
  li.append(name);

  const body = document.createElement('div');
  body.className = 'find-provider-result-body';

  const addr1 = address.AddressLine1 || provider.address || '';
  const city = address.CityName || '';
  const state = address.StateProvinceCode || '';
  const zip = address.PostalCode || '';
  const addressEl = document.createElement('address');
  addressEl.className = 'find-provider-result-address';
  if (addr1) {
    const line1 = document.createElement('span');
    line1.textContent = addr1;
    addressEl.append(line1);
    const cityStateZip = [city, state, zip].filter(Boolean).join(', ');
    if (cityStateZip) {
      const line2 = document.createElement('span');
      line2.textContent = cityStateZip;
      addressEl.append(line2);
    }
  }
  body.append(addressEl);

  const meta = document.createElement('div');
  meta.className = 'find-provider-result-meta';

  const distance = provider.distance || provider.DistanceText || '';
  if (distance) {
    const distEl = document.createElement('span');
    distEl.className = 'find-provider-result-distance';
    distEl.textContent = distance;
    meta.append(distEl);
  }

  if (addr1) {
    if (distance) {
      const sep = document.createElement('span');
      sep.className = 'find-provider-result-sep';
      sep.setAttribute('aria-hidden', 'true');
      sep.textContent = '|';
      meta.append(sep);
    }
    const dest = encodeURIComponent(`${addr1} ${city}, ${state} ${zip}`.trim());
    const dirLink = document.createElement('a');
    dirLink.href = `https://www.google.com/maps/dir/?api=1&destination=${dest}`;
    dirLink.target = '_blank';
    dirLink.rel = 'noopener noreferrer';
    dirLink.className = 'find-provider-result-directions';
    dirLink.textContent = 'Get Directions';
    meta.append(dirLink);
  }

  if (meta.childNodes.length) body.append(meta);

  if (phone) {
    const phoneLink = document.createElement('a');
    phoneLink.href = `tel:${phone.replace(/\D/g, '')}`;
    phoneLink.className = 'find-provider-result-phone';
    phoneLink.textContent = phone;
    body.append(phoneLink);
  }

  const detailsBtn = document.createElement('button');
  detailsBtn.type = 'button';
  detailsBtn.className = 'find-provider-result-details';
  detailsBtn.setAttribute('aria-expanded', 'false');
  detailsBtn.append('Show all practice details ');
  const detailsIcon = document.createElement('span');
  detailsIcon.className = 'find-provider-result-details-icon';
  detailsIcon.setAttribute('aria-hidden', 'true');
  detailsIcon.textContent = '+';
  detailsBtn.append(detailsIcon);
  body.append(detailsBtn);

  li.append(body);

  if (config['exit-modal-id']) {
    li.addEventListener('click', (e) => {
      if (e.target.closest('a, button')) return;
      const modal = document.getElementById(config['exit-modal-id']);
      if (modal) modal.dispatchEvent(new CustomEvent('open-modal', { detail: { provider } }));
    });
  }

  return li;
}

function buildResultsHeader(config) {
  const header = document.createElement('header');
  header.className = 'find-provider-results-header';

  const title = document.createElement('h2');
  title.className = 'find-provider-results-title';
  title.textContent = config['results-title'] || 'Results found';
  header.append(title);

  const radiusGroup = document.createElement('div');
  radiusGroup.className = 'find-provider-results-radius';

  if (config['radius-label']) {
    const radiusLabel = document.createElement('span');
    radiusLabel.className = 'find-provider-results-radius-label';
    radiusLabel.textContent = config['radius-label'];
    radiusGroup.append(radiusLabel);
  }

  const radiusSelect = document.createElement('select');
  radiusSelect.className = 'find-provider-results-radius-select';
  if (config['radius-label']) radiusSelect.setAttribute('aria-label', config['radius-label']);
  ['5 Miles', '10 Miles', '25 Miles', '50 Miles', '100 Miles'].forEach((v) => {
    const opt = document.createElement('option');
    opt.value = v;
    opt.textContent = v;
    radiusSelect.append(opt);
  });
  radiusGroup.append(radiusSelect);

  header.append(radiusGroup);
  return header;
}

// TODO: pagination is visual-only — buttons have no click handlers wired up yet
function buildPagination(totalPages = 5, currentPage = 1) {
  const nav = document.createElement('nav');
  nav.className = 'find-provider-pagination';
  nav.setAttribute('aria-label', 'Results pagination');

  const prevBtn = document.createElement('button');
  prevBtn.type = 'button';
  prevBtn.className = 'find-provider-pagination-btn find-provider-pagination-prev';
  prevBtn.setAttribute('aria-label', 'Previous page');
  prevBtn.disabled = currentPage === 1;
  nav.append(prevBtn);

  for (let i = 1; i <= totalPages; i += 1) {
    const pageBtn = document.createElement('button');
    pageBtn.type = 'button';
    pageBtn.className = 'find-provider-pagination-page';
    if (i === currentPage) pageBtn.classList.add('is-active');
    pageBtn.textContent = String(i);
    pageBtn.setAttribute('aria-label', `Page ${i}`);
    if (i === currentPage) pageBtn.setAttribute('aria-current', 'page');
    nav.append(pageBtn);

    if (i < totalPages) {
      const sep = document.createElement('span');
      sep.className = 'find-provider-pagination-sep';
      sep.setAttribute('aria-hidden', 'true');
      sep.textContent = '|';
      nav.append(sep);
    }
  }

  const nextBtn = document.createElement('button');
  nextBtn.type = 'button';
  nextBtn.className = 'find-provider-pagination-btn find-provider-pagination-next';
  nextBtn.setAttribute('aria-label', 'Next page');
  nextBtn.disabled = currentPage === totalPages;
  nav.append(nextBtn);

  return nav;
}

export async function decorateBlock(block) {
  blockCounter += 1;
  const blockId = `fp-${blockCounter}`;
  const config = readConfig(block);

  if (config['anchor-id']) block.id = config['anchor-id'];

  const isMap = block.classList.contains('find-provider-map');
  const isLocation = block.classList.contains('find-provider-location');

  const status = document.createElement('p');
  status.className = 'find-provider-status';
  status.setAttribute('aria-live', 'polite');
  status.setAttribute('aria-atomic', 'true');

  const loader = document.createElement('div');
  loader.className = 'find-provider-loader';
  loader.setAttribute('role', 'status');
  loader.setAttribute('aria-live', 'polite');
  loader.setAttribute('aria-label', 'Searching providers');
  const spinner = document.createElement('div');
  spinner.className = 'find-provider-loader-spinner';
  spinner.setAttribute('aria-hidden', 'true');
  loader.append(spinner);

  const results = document.createElement('ul');
  results.className = 'find-provider-results';

  let mapContainer = null;
  if (isMap) {
    mapContainer = document.createElement('div');
    mapContainer.id = 'provider-map';
    mapContainer.className = 'find-provider-map-container';
    mapContainer.setAttribute('role', 'region');
    mapContainer.setAttribute('aria-label', 'Provider map');
  }

  const form = buildForm(config, blockId, isLocation);
  const searchInput = form.querySelector('.find-provider-search-input');
  const clearBtn = form.querySelector('.find-provider-clear');
  const geoBtn = form.querySelector('.find-provider-geo-btn');
  const termsCheckbox = form.querySelector('.find-provider-terms-checkbox');

  async function renderProviders(providers) {
    status.textContent = '';
    results.innerHTML = '';
    if (!providers.length) {
      status.textContent = config['no-results'];
      return;
    }
    providers.forEach((p, idx) => results.append(buildResultCard(p, config, idx)));
    if (isMap) {
      try {
        const { updateMapMarkers } = await import('../eds-form/maps.js');
        updateMapMarkers(providers, 0);
      } catch {
        // Map not ready yet — markers will be set when initializeMap resolves
      }
    }
  }

  async function doSearch(query) {
    if (!config['api-endpoint']) {
      const providers = await loadDummyProviders();
      await renderProviders(providers);
      return;
    }
    status.textContent = '';
    results.innerHTML = '';

    try {
      const params = new URLSearchParams({ q: query });
      if (config.indication) params.set('indication', config.indication);

      const resp = await fetch(`${config['api-endpoint']}?${params}`);
      if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
      const data = await resp.json();
      const providers = data.results || data.providers || (Array.isArray(data) ? data : []);
      await renderProviders(providers);
    } catch {
      status.textContent = config.error;
    }
  }

  const resultsPanel = document.createElement('div');
  resultsPanel.className = 'find-provider-results-panel';
  resultsPanel.append(buildResultsHeader(config));

  const resultsLayout = document.createElement('div');
  resultsLayout.className = 'find-provider-results-layout';
  resultsLayout.append(results);
  if (mapContainer) resultsLayout.append(mapContainer);
  resultsPanel.append(resultsLayout);

  resultsPanel.append(buildPagination(5, 1));

  async function runSearchFlow(query) {
    resultsPanel.classList.remove('is-visible');
    loader.classList.add('is-visible');
    const minDelay = new Promise((resolve) => { setTimeout(resolve, MIN_LOADER_DELAY_MS); });
    await Promise.all([doSearch(query), minDelay]);
    loader.classList.remove('is-visible');
    resultsPanel.classList.add('is-visible');
  }

  const searchError = form.querySelector('.find-provider-search-error');
  const termsError = form.querySelector('.find-provider-terms-error');

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const query = searchInput?.value.trim() || '';

    let hasError = false;
    if (!query) {
      if (searchError) searchError.textContent = 'Please enter a valid ZIP Code';
      hasError = true;
    } else if (searchError) {
      searchError.textContent = '';
    }

    if (termsCheckbox && !termsCheckbox.checked) {
      if (termsError) termsError.textContent = 'Please agree to the Terms & Conditions';
      hasError = true;
    } else if (termsError) {
      termsError.textContent = '';
    }

    if (hasError) return;
    runSearchFlow(query);
  });

  if (searchInput && searchError) {
    searchInput.addEventListener('input', () => {
      if (searchInput.value.trim()) searchError.textContent = '';
    });
  }

  if (termsCheckbox && termsError) {
    termsCheckbox.addEventListener('change', () => {
      if (termsCheckbox.checked) termsError.textContent = '';
    });
  }

  if (clearBtn) {
    clearBtn.addEventListener('click', () => {
      form.reset();
      results.innerHTML = '';
      status.textContent = '';
      resultsPanel.classList.remove('is-visible');
      loader.classList.remove('is-visible');
      form.querySelectorAll('.find-provider-error').forEach((el) => { el.textContent = ''; });
    });
  }

  if (geoBtn) {
    geoBtn.addEventListener('click', () => {
      if (!('geolocation' in navigator)) return;
      if (termsCheckbox && !termsCheckbox.checked) return;
      geoBtn.disabled = true;
      navigator.geolocation.getCurrentPosition(
        ({ coords }) => {
          geoBtn.disabled = false;
          runSearchFlow(`${coords.latitude},${coords.longitude}`);
        },
        () => {
          geoBtn.disabled = false;
        },
        { timeout: 8000 },
      );
    });
  }

  block.replaceChildren(form, status, loader, resultsPanel);

  if (isMap) {
    try {
      const { loadGoogleMapsAPI, initializeMap } = await import('../eds-form/maps.js');
      if (config['maps-api-key']) await loadGoogleMapsAPI(config['maps-api-key']);
      await initializeMap(config['maps-api-key'] || null);
    } catch {
      // Maps failed to load — fall through to iframe fallback below
    }

    if (mapContainer && !mapContainer.querySelector('div, iframe')) {
      const iframe = document.createElement('iframe');
      iframe.src = 'https://maps.google.com/maps?q=Elmhurst,NY+11373&z=11&output=embed';
      iframe.title = 'Provider locations';
      iframe.loading = 'lazy';
      iframe.referrerPolicy = 'no-referrer-when-downgrade';
      iframe.setAttribute('allowfullscreen', '');
      iframe.className = 'find-provider-map-iframe';
      mapContainer.append(iframe);
    }
  }
}

export default async function decorate(block) {
  await renderBlock(block);
}
