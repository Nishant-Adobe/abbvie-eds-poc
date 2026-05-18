function getCookie(name) {
  try {
    const match = document.cookie.split('; ').find((r) => r.startsWith(`${name}=`));
    return match?.split('=')[1] || '';
  } catch {
    return '';
  }
}

function setCookie(name, value, days) {
  try {
    document.cookie = `${name}=${value};max-age=${days * 86400};path=/`;
  } catch { /* consent may block */ }
}

function deleteCookie(name) {
  try {
    document.cookie = `${name}=;max-age=0;path=/`;
  } catch { /* consent may block */ }
}

function extractConfig(block) {
  const rows = [...block.querySelectorAll(':scope > div:not([data-aue-resource])')];

  let heading = '';
  let question = null;
  let disclaimer = null;
  let cookieName = '';
  let showReset = false;
  let resetLabel = 'Start over';

  rows.forEach((row) => {
    if (row.querySelector('picture') || row.querySelector('img[src]')) return;
    const prop = row.querySelector('[data-aue-prop]') || (row.hasAttribute('data-aue-prop') ? row : null);
    if (prop) {
      const name = prop.getAttribute('data-aue-prop');
      if (name === 'heading') heading = prop.textContent?.trim() || '';
      if (name === 'question') { question = prop; }
      if (name === 'disclaimer') { disclaimer = prop; row.dataset.itDisclaimer = ''; }
      if (name === 'cookieName') cookieName = prop.textContent?.trim() || '';
      if (name === 'resetLabel') resetLabel = prop.textContent?.trim() || 'Start over';
      if (name === 'showReset') {
        const val = prop.textContent?.trim().toLowerCase();
        showReset = val === 'true';
      }
      row.dataset.itConfig = '';
    } else {
      const divs = row.querySelectorAll(':scope > div');
      if (divs.length >= 2) {
        const key = divs[0]?.textContent?.trim().toLowerCase();
        if (key === 'heading') { heading = divs[1]?.textContent?.trim() || ''; row.dataset.itConfig = ''; }
        if (key === 'question') { [, question] = divs; row.dataset.itConfig = ''; }
        if (key === 'disclaimer') { [, disclaimer] = divs; row.dataset.itDisclaimer = ''; }
        if (key === 'cookiename') { cookieName = divs[1]?.textContent?.trim() || ''; row.dataset.itConfig = ''; }
        if (key === 'resetlabel') { resetLabel = divs[1]?.textContent?.trim() || 'Start over'; row.dataset.itConfig = ''; }
        if (key === 'showreset') {
          showReset = divs[1]?.textContent?.trim().toLowerCase() === 'true';
          row.dataset.itConfig = '';
        }
      } else {
        const cell = divs[0] || row;
        const text = cell.textContent?.trim();
        const lower = text.toLowerCase();
        if (lower === 'true' || lower === 'false') {
          showReset = lower === 'true';
          row.dataset.itConfig = '';
        } else if (!question && (cell.querySelector('h1,h2,h3,h4,h5,h6') || text.endsWith('?'))) {
          question = cell;
          row.dataset.itConfig = '';
        } else if (!cookieName && text && !text.includes(' ')) {
          cookieName = text;
          row.dataset.itConfig = '';
        } else if (!resetLabel || lower === 'start over') {
          resetLabel = text || 'Start over';
          row.dataset.itConfig = '';
        }
      }
    }
  });

  return {
    heading, question, disclaimer, cookieName, showReset, resetLabel,
  };
}

function extractImage(block) {
  const imgProp = block.querySelector('[data-aue-prop="image"]');
  if (imgProp) {
    const pic = imgProp.closest('div')?.querySelector('picture')
      || imgProp.querySelector('picture')
      || imgProp.querySelector('img');
    return pic?.cloneNode(true) || null;
  }
  const rows = [...block.querySelectorAll(':scope > div:not([data-aue-resource])')];
  for (let i = 0; i < rows.length; i += 1) {
    const pic = rows[i].querySelector('picture') || rows[i].querySelector('img');
    if (pic) {
      rows[i].dataset.itConfig = '';
      return pic.cloneNode(true);
    }
  }
  return null;
}

function extractItems(block) {
  const itemRows = [...block.querySelectorAll(':scope > div[data-aue-resource]')];
  if (itemRows.length) {
    const items = [];
    for (let i = 0; i < itemRows.length; i += 1) {
      const row = itemRows[i];
      const isInfoTreeItem = row.getAttribute('data-aue-component') === 'info-tree-item'
        || row.querySelector('[data-aue-prop="answerLabel"]');
      if (isInfoTreeItem) {
        const labelEl = row.querySelector('[data-aue-prop="answerLabel"]');
        const contentEl = row.querySelector('[data-aue-prop="answerContent"]');
        const label = labelEl?.textContent?.trim() || '';
        const cells = [...row.querySelectorAll(':scope > div')];
        const fallbackContent = cells.length >= 2 ? cells[1] : null;
        let ctaEl = null;
        const nextRow = itemRows[i + 1];
        const isCta = nextRow && (
          nextRow.getAttribute('data-aue-component') === 'info-tree-cta'
          || nextRow.getAttribute('data-aue-model') === 'info-tree-cta'
          || nextRow.querySelector('[data-aue-prop="ctaLabel"]')
          || (nextRow.hasAttribute('data-aue-resource')
            && !nextRow.querySelector('[data-aue-prop="answerLabel"]'))
        );
        if (isCta) {
          ctaEl = nextRow;
          i += 1;
        }
        if (label) items.push({ label, content: contentEl || fallbackContent, ctaEl });
      }
    }
    return items;
  }

  const rows = [...block.querySelectorAll(':scope > div:not([data-it-config]):not([data-it-disclaimer])')];
  const items = [];
  for (let i = 0; i < rows.length; i += 1) {
    const row = rows[i];
    const divs = row.querySelectorAll(':scope > div');
    if (divs.length >= 2) {
      const label = divs[0]?.textContent?.trim() || '';
      if (label) {
        let ctaEl = null;
        const nextRow = rows[i + 1];
        if (nextRow && (nextRow.classList.contains('cta')
          || nextRow.querySelector('.cta-wrapper')
          || nextRow.querySelector('a.abbv-cta'))) {
          ctaEl = nextRow;
          nextRow.dataset.itItem = '';
          i += 1;
        }
        items.push({ label, content: divs[1], ctaEl });
        row.dataset.itItem = '';
      }
    }
  }
  return items;
}

function showAnswer(block, resultsEl, buttonsEl, resetWrap, answerId) {
  block.classList.add('is-answered');
  const headingEl = block.querySelector('.info-tree-heading');
  const questionEl = block.querySelector('.info-tree-question');
  if (headingEl) headingEl.classList.add('info-tree-hidden');
  if (questionEl) questionEl.classList.add('info-tree-hidden');
  buttonsEl.classList.add('info-tree-hidden');
  [...resultsEl.children].forEach((r) => {
    if (r.dataset.answerId === answerId) {
      r.classList.remove('info-tree-hidden');
    } else {
      r.classList.add('info-tree-hidden');
    }
  });
  if (resetWrap) resetWrap.classList.remove('info-tree-hidden');
}

function hideAnswer(block, resultsEl, buttonsEl, resetWrap) {
  block.classList.remove('is-answered');
  const headingEl = block.querySelector('.info-tree-heading');
  const questionEl = block.querySelector('.info-tree-question');
  if (headingEl) headingEl.classList.remove('info-tree-hidden');
  if (questionEl) questionEl.classList.remove('info-tree-hidden');
  buttonsEl.classList.remove('info-tree-hidden');
  [...resultsEl.children].forEach((r) => { r.classList.add('info-tree-hidden'); });
  if (resetWrap) resetWrap.classList.add('info-tree-hidden');
}

export default function decorate(block) {
  const config = extractConfig(block);
  const image = extractImage(block);
  const items = extractItems(block);

  const rows = [...block.querySelectorAll(':scope > div')];
  rows.forEach((row) => {
    const consumed = row.dataset.itConfig !== undefined
      || row.dataset.itItem !== undefined
      || row.hasAttribute('data-aue-resource')
      || row.querySelector('picture')
      || row.querySelector('img[src]');
    if (consumed) {
      row.classList.add('info-tree-hidden');
    } else if (row.dataset.itDisclaimer === undefined) {
      row.classList.add('info-tree-disclaimer');
    }
  });

  if (!items.length) return;

  const blockId = block.dataset.blockId || `info-tree-${Math.random().toString(36).slice(2, 8)}`;

  const imageEl = document.createElement('div');
  imageEl.className = 'info-tree-image';
  if (image) imageEl.append(image);

  const contentEl = document.createElement('div');
  contentEl.className = 'info-tree-content';
  contentEl.style.minWidth = '0';

  if (config.heading) {
    const h2 = document.createElement('h2');
    h2.className = 'info-tree-heading';
    h2.textContent = config.heading;
    contentEl.append(h2);
  }

  if (config.question) {
    const questionEl = document.createElement('div');
    questionEl.className = 'info-tree-question';
    questionEl.id = `${blockId}-q`;
    [...config.question.childNodes].forEach((child) => {
      questionEl.append(child.cloneNode(true));
    });
    contentEl.append(questionEl);
  }

  const buttonsEl = document.createElement('div');
  buttonsEl.className = 'info-tree-buttons';
  buttonsEl.setAttribute('role', 'group');
  buttonsEl.setAttribute('aria-labelledby', `${blockId}-q`);

  const resultsEl = document.createElement('div');
  resultsEl.className = 'info-tree-results';
  resultsEl.setAttribute('aria-live', 'polite');

  items.forEach(({ label, content, ctaEl }) => {
    const btn = document.createElement('button');
    btn.className = 'info-tree-option';
    btn.textContent = label;
    btn.dataset.answerId = label;
    buttonsEl.append(btn);

    const result = document.createElement('div');
    result.className = 'info-tree-result info-tree-hidden';
    result.dataset.answerId = label;
    if (content) {
      [...content.childNodes].forEach((child) => {
        result.append(child.cloneNode(true));
      });
    }
    if (ctaEl) {
      result.append(ctaEl.cloneNode(true));
    }
    resultsEl.append(result);
  });

  contentEl.append(buttonsEl, resultsEl);

  let resetWrap = null;
  if (config.showReset) {
    resetWrap = document.createElement('div');
    resetWrap.className = 'info-tree-reset info-tree-hidden';
    const resetBtn = document.createElement('button');
    resetBtn.className = 'info-tree-reset-btn';
    resetBtn.textContent = config.resetLabel;
    resetWrap.append(resetBtn);
    contentEl.append(resetWrap);

    resetWrap.addEventListener('click', () => {
      if (config.cookieName) deleteCookie(config.cookieName);
      hideAnswer(block, resultsEl, buttonsEl, resetWrap);
    });
  }

  block.append(imageEl, contentEl);

  block.querySelectorAll('.info-tree-disclaimer').forEach((row) => {
    contentEl.append(row);
  });

  buttonsEl.addEventListener('click', (e) => {
    const btn = e.target.closest('.info-tree-option');
    if (!btn) return;
    const { answerId } = btn.dataset;
    if (config.cookieName) setCookie(config.cookieName, answerId, 365);
    showAnswer(block, resultsEl, buttonsEl, resetWrap, answerId);
  });

  if (config.cookieName) {
    const saved = getCookie(config.cookieName);
    if (saved) showAnswer(block, resultsEl, buttonsEl, resetWrap, saved);
  }
}
