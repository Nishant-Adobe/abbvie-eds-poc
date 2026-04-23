export default function decorate(block) {
  const rows = [...block.children];
  if (!rows.length) return;

  const questionRow = rows[0];
  const optionRows = rows.slice(1);

  const question = document.createElement('p');
  question.className = 'info-tree-question';
  question.textContent = questionRow.textContent.trim();
  question.id = 'info-tree-q';

  const optionsEl = document.createElement('div');
  optionsEl.className = 'info-tree-options';
  optionsEl.setAttribute('role', 'group');
  optionsEl.setAttribute('aria-labelledby', 'info-tree-q');

  const resultsEl = document.createElement('div');
  resultsEl.className = 'info-tree-results';
  resultsEl.setAttribute('aria-live', 'polite');

  const resetBtn = document.createElement('button');
  resetBtn.className = 'info-tree-reset';
  resetBtn.textContent = 'Start over';
  resetBtn.hidden = true;

  const answers = optionRows.map((row, i) => {
    const cells = [...row.children];
    const label = cells[0]?.textContent.trim();
    const content = cells[1];
    const btn = document.createElement('button');
    btn.className = 'info-tree-option';
    btn.textContent = label;
    btn.dataset.idx = i;
    optionsEl.append(btn);
    return { label, content };
  });

  optionsEl.addEventListener('click', (e) => {
    const btn = e.target.closest('.info-tree-option');
    if (!btn) return;
    const idx = Number(btn.dataset.idx);
    const answer = answers[idx];
    resultsEl.innerHTML = '';
    resultsEl.append(answer.content.cloneNode(true));
    optionsEl.querySelectorAll('.info-tree-option').forEach((b) => b.classList.remove('is-selected'));
    btn.classList.add('is-selected');
    resetBtn.hidden = false;
  });

  resetBtn.addEventListener('click', () => {
    resultsEl.innerHTML = '';
    optionsEl.querySelectorAll('.info-tree-option').forEach((b) => b.classList.remove('is-selected'));
    resetBtn.hidden = true;
  });

  block.replaceChildren(question, optionsEl, resultsEl, resetBtn);
}
