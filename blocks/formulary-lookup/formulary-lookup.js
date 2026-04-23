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

export default async function decorate(block) {
  const rows = [...block.children];
  const config = {};

  rows.forEach((row) => {
    const cells = [...row.children];
    const key = cells[0]?.textContent.trim().toLowerCase().replace(/\s+/g, '-');
    config[key] = cells[1]?.textContent.trim() || cells[0]?.textContent.trim();
  });

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

  const label = document.createElement('label');
  label.className = 'formulary-lookup-label';
  label.htmlFor = 'formulary-state';
  label.textContent = config['state-label'] || 'Select your state';

  const select = document.createElement('select');
  select.id = 'formulary-state';
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

  const status = document.createElement('p');
  status.className = 'formulary-lookup-status';
  status.setAttribute('aria-live', 'polite');

  const results = document.createElement('div');
  results.className = 'formulary-lookup-results';

  section.append(label, select, status, results);
  block.replaceChildren(section);

  select.addEventListener('change', async () => {
    const state = select.value;
    if (!state) return;
    results.innerHTML = '';

    if (!config.api) {
      status.textContent = config.error || 'Lookup not configured.';
      return;
    }

    status.textContent = 'Loading…';
    try {
      const resp = await fetch(`${config.api}?state=${state}`);
      if (!resp.ok) throw new Error();
      const data = await resp.json();
      const plans = data.plans || data.results || data || [];

      if (!plans.length) {
        status.textContent = config['no-results'] || 'No coverage information found.';
        return;
      }

      status.textContent = '';
      plans.forEach((plan) => {
        const card = document.createElement('div');
        card.className = 'formulary-plan';
        card.innerHTML = `
          <strong class="formulary-plan-name">${plan.name || ''}</strong>
          <span class="formulary-plan-tier">${plan.tier ? `Tier ${plan.tier}` : ''}</span>
          <span class="formulary-plan-detail">${plan.detail || ''}</span>
        `;
        results.append(card);
      });
    } catch {
      status.textContent = config.error || 'An error occurred. Please try again.';
    }
  });
}
