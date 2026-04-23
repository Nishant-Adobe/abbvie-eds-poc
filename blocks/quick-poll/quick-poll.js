export default async function decorate(block) {
  const rows = [...block.children];
  let apiEndpoint = null;
  let questionRow = null;
  const optionRows = [];

  rows.forEach((row) => {
    const cells = [...row.children];
    const key = cells[0]?.textContent.trim().toLowerCase();
    if (key === 'api') {
      apiEndpoint = cells[1]?.textContent.trim();
    } else if (!questionRow) {
      questionRow = row;
    } else {
      optionRows.push(row);
    }
  });

  const question = questionRow?.textContent.trim() || '';
  const options = optionRows.map((row) => {
    const cells = [...row.children];
    return { label: cells[0]?.textContent.trim(), id: cells[1]?.textContent.trim() };
  }).filter((o) => o.label && o.id);

  const questionEl = document.createElement('p');
  questionEl.className = 'quick-poll-question';
  questionEl.textContent = question;

  const optionsEl = document.createElement('div');
  optionsEl.className = 'quick-poll-options';
  optionsEl.setAttribute('role', 'group');
  optionsEl.setAttribute('aria-labelledby', 'poll-question');
  questionEl.id = 'poll-question';

  options.forEach((opt) => {
    const btn = document.createElement('button');
    btn.className = 'quick-poll-option';
    btn.textContent = opt.label;
    btn.dataset.optionId = opt.id;
    optionsEl.append(btn);
  });

  const results = document.createElement('div');
  results.className = 'quick-poll-results';
  results.setAttribute('aria-live', 'polite');
  results.hidden = true;

  function showResults(selectedId, resultsData) {
    optionsEl.hidden = true;
    results.hidden = false;
    results.innerHTML = '';

    options.forEach((opt) => {
      const pct = resultsData?.[opt.id] ?? (opt.id === selectedId ? 100 : 0);
      const resultRow = document.createElement('div');
      resultRow.className = 'quick-poll-result-row';
      resultRow.innerHTML = `
        <span class="quick-poll-result-label${opt.id === selectedId ? ' is-selected' : ''}">${opt.label}</span>
        <div class="quick-poll-bar" role="progressbar" aria-valuenow="${pct}" aria-valuemin="0" aria-valuemax="100">
          <span class="quick-poll-bar-fill" style="--pct:${pct}%"></span>
        </div>
        <span class="quick-poll-pct">${pct}%</span>
      `;
      results.append(resultRow);
    });
  }

  block.replaceChildren(questionEl, optionsEl, results);

  const storageKey = `poll-${question.slice(0, 20)}`;
  const voted = sessionStorage.getItem(storageKey);
  if (voted) showResults(voted);

  optionsEl.addEventListener('click', async (e) => {
    const btn = e.target.closest('.quick-poll-option');
    if (!btn) return;
    const { optionId } = btn.dataset;

    if (apiEndpoint) {
      try {
        const resp = await fetch(apiEndpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ optionId }),
        });
        if (!resp.ok) throw new Error('Vote failed');
        const data = await resp.json();
        showResults(optionId, data.results);
      } catch {
        showResults(optionId);
      }
    } else {
      showResults(optionId);
    }
    sessionStorage.setItem(storageKey, optionId);
  });
}
