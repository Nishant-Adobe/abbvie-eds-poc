import { renderBlock } from '../../scripts/multi-theme.js';

let blockCounter = 0;

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
  'api-endpoint',
  'indication',
  'exit-modal-id',
  'anchor-id',
];

const RICHTEXT_KEYS = new Set(['terms-text']);

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

function buildFieldGroup(labelText, input, groupClass = '') {
  const group = document.createElement('div');
  group.className = `find-provider-field-group${groupClass ? ` ${groupClass}` : ''}`;
  const label = document.createElement('label');
  label.htmlFor = input.id;
  label.className = 'find-provider-label';
  label.textContent = labelText;
  group.append(label, input);
  return group;
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
  form.append(searchGroup);

  if (config['radius-label']) {
    const radiusSelect = document.createElement('select');
    radiusSelect.id = `${blockId}-radius`;
    radiusSelect.name = 'radius';
    radiusSelect.className = 'find-provider-radius-select';
    [5, 10, 25, 50, 100].forEach((miles) => {
      const opt = document.createElement('option');
      opt.value = miles;
      opt.textContent = `${miles} mi`;
      radiusSelect.append(opt);
    });
    form.append(buildFieldGroup(config['radius-label'], radiusSelect));
  }

  if (config['specialty-label']) {
    const specialtySelect = document.createElement('select');
    specialtySelect.id = `${blockId}-specialty`;
    specialtySelect.name = 'specialty';
    specialtySelect.className = 'find-provider-specialty-select';
    const defaultOpt = document.createElement('option');
    defaultOpt.value = '';
    defaultOpt.textContent = '';
    specialtySelect.append(defaultOpt);
    form.append(buildFieldGroup(config['specialty-label'], specialtySelect));
  }

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
      termsText.innerHTML = config['terms-text'];
    }

    termsCheckboxLabel.append(termsCheckbox, termsText);
    termsGroup.append(termsCheckboxLabel);
    form.append(termsGroup);
  }

  const actions = document.createElement('div');
  actions.className = 'find-provider-actions';

  const submitBtn = document.createElement('button');
  submitBtn.type = 'submit';
  submitBtn.className = 'find-provider-submit button primary';
  submitBtn.textContent = config['submit-label'];
  actions.append(submitBtn);

  if (config['clear-label']) {
    const clearBtn = document.createElement('button');
    clearBtn.type = 'button';
    clearBtn.className = 'find-provider-clear button';
    clearBtn.textContent = config['clear-label'];
    actions.append(clearBtn);
  }

  form.append(actions);
  return form;
}

function buildResultCard(provider, config) {
  const li = document.createElement('li');
  li.className = 'find-provider-result';

  const address = provider.PartyAddress?.[0] || {};
  const phone = provider.Communication?.find(
    (c) => c.CommunicationTypeDescription === 'Telephone',
  )?.CommunicationValueText || provider.phone || '';

  const name = document.createElement('strong');
  name.className = 'find-provider-result-name';
  name.textContent = provider.PartyName || provider.name || '';
  li.append(name);

  const degree = provider.HCPExtension?.DegreeCode || provider.specialty || '';
  if (degree) {
    const specialtyEl = document.createElement('span');
    specialtyEl.className = 'find-provider-result-specialty';
    specialtyEl.textContent = degree;
    li.append(specialtyEl);
  }

  const addr1 = address.AddressLine1 || provider.address || '';
  const city = address.CityName || '';
  const state = address.StateProvinceCode || '';
  const zip = address.PostalCode || '';
  const addressEl = document.createElement('address');
  addressEl.className = 'find-provider-result-address';
  if (addr1) {
    const cityStateZip = [city, state, zip].filter(Boolean).join(', ');
    addressEl.textContent = [addr1, cityStateZip].filter(Boolean).join(', ');
  }
  li.append(addressEl);

  if (phone) {
    const phoneLink = document.createElement('a');
    phoneLink.href = `tel:${phone.replace(/\D/g, '')}`;
    phoneLink.className = 'find-provider-result-phone';
    phoneLink.textContent = phone;
    li.append(phoneLink);
  }

  if (addr1) {
    const dest = encodeURIComponent(`${addr1} ${city}, ${state} ${zip}`.trim());
    const dirLink = document.createElement('a');
    dirLink.href = `https://www.google.com/maps/dir/?api=1&destination=${dest}`;
    dirLink.target = '_blank';
    dirLink.rel = 'noopener noreferrer';
    dirLink.className = 'find-provider-result-directions';
    dirLink.textContent = 'Get Directions';
    li.append(dirLink);
  }

  if (config['exit-modal-id']) {
    li.addEventListener('click', (e) => {
      if (e.target.closest('a')) return;
      const modal = document.getElementById(config['exit-modal-id']);
      if (modal) modal.dispatchEvent(new CustomEvent('open-modal', { detail: { provider } }));
    });
  }

  return li;
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

  async function doSearch(query) {
    if (!config['api-endpoint']) {
      status.textContent = config.error;
      return;
    }
    status.textContent = '';
    results.innerHTML = '';

    try {
      const params = new URLSearchParams({ q: query });
      if (config.indication) params.set('indication', config.indication);
      const radiusSelect = form.querySelector('.find-provider-radius-select');
      if (radiusSelect) params.set('radius', radiusSelect.value);
      const specialtySelect = form.querySelector('.find-provider-specialty-select');
      if (specialtySelect?.value) params.set('specialty', specialtySelect.value);

      const resp = await fetch(`${config['api-endpoint']}?${params}`);
      if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
      const data = await resp.json();
      const providers = data.results || data.providers || (Array.isArray(data) ? data : []);

      if (!providers.length) {
        status.textContent = config['no-results'];
        return;
      }

      providers.forEach((p) => results.append(buildResultCard(p, config)));

      if (isMap) {
        const { updateMapMarkers } = await import('../eds-form/maps.js');
        updateMapMarkers(providers, 0);
      }
    } catch {
      status.textContent = config.error;
    }
  }

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const termsCheckbox = form.querySelector('.find-provider-terms-checkbox');
    if (termsCheckbox && !termsCheckbox.checked) {
      status.textContent = config['terms-error'];
      return;
    }
    doSearch(searchInput?.value.trim() || '');
  });

  if (clearBtn) {
    clearBtn.addEventListener('click', () => {
      form.reset();
      results.innerHTML = '';
      status.textContent = '';
    });
  }

  if (geoBtn) {
    geoBtn.addEventListener('click', () => {
      if (!('geolocation' in navigator)) return;
      geoBtn.disabled = true;
      status.textContent = 'Detecting location…';
      navigator.geolocation.getCurrentPosition(
        ({ coords }) => {
          geoBtn.disabled = false;
          doSearch(`${coords.latitude},${coords.longitude}`);
        },
        () => {
          geoBtn.disabled = false;
          status.textContent = config['geo-error'];
        },
        { timeout: 8000 },
      );
    });
  }

  const children = [form, status];
  if (mapContainer) children.push(mapContainer);
  children.push(results);
  block.replaceChildren(...children);

  if (isMap) {
    try {
      const { loadGoogleMapsAPI, initializeMap } = await import('../eds-form/maps.js');
      if (config['maps-api-key']) await loadGoogleMapsAPI(config['maps-api-key']);
      await initializeMap(config['maps-api-key'] || null);
    } catch {
      // Maps failed to load — degrade to list-only
    }
  }
}

export default async function decorate(block) {
  await renderBlock(block);
}
