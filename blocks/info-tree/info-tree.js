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
    return itemRows.reduce((items, row) => {
      const labelEl = row.querySelector('[data-aue-prop="answerLabel"]');
      const contentEl = row.querySelector('[data-aue-prop="answerContent"]');
      const btnLabelEl = row.querySelector('[data-aue-prop="buttonLabel"]');
      const label = labelEl?.textContent?.trim() || '';
      const buttonLabel = btnLabelEl?.textContent?.trim() || '';
      const cells = [...row.querySelectorAll(':scope > div')];
      const fallbackContent = cells.length >= 2 ? cells[1] : null;
      if (label) items.push({ label, content: contentEl || fallbackContent, buttonLabel });
      return items;
    }, []);
  }

  const rows = [...block.querySelectorAll(':scope > div:not([data-it-config]):not([data-it-disclaimer])')];
  return rows.reduce((items, row) => {
    const divs = row.querySelectorAll(':scope > div');
    if (divs.length >= 2) {
      const label = divs[0]?.textContent?.trim() || '';
      const buttonLabel = divs.length >= 3 ? divs[2]?.textContent?.trim() || '' : '';
      if (label) {
        items.push({ label, content: divs[1], buttonLabel });
        row.dataset.itItem = '';
      }
    }
    return items;
  }, []);
}

function findSectionCta(block, buttonLabel) {
  if (!buttonLabel) return null;
  const section = block.closest('.section');
  if (!section) return null;
  const ctas = section.querySelectorAll('.cta-wrapper, .cta');
  for (let i = 0; i < ctas.length; i += 1) {
    const text = ctas[i].textContent?.trim();
    if (text === buttonLabel) return ctas[i];
  }
  return null;
}

function showAnswer(block, resultsEl, buttonsEl, resetWrap, answerId, items) {
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

  const section = block.closest('.section');
  if (section) {
    section.querySelectorAll('.cta-wrapper, .cta').forEach((cta) => {
      cta.classList.add('info-tree-hidden');
    });
  }
  const matchedItem = items?.find((item) => item.label === answerId);
  if (matchedItem?.buttonLabel) {
    const cta = findSectionCta(block, matchedItem.buttonLabel);
    if (cta) cta.classList.remove('info-tree-hidden');
  }
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

  const section = block.closest('.section');
  if (section) {
    section.querySelectorAll('.cta-wrapper, .cta').forEach((cta) => {
      cta.classList.remove('info-tree-hidden');
    });
  }
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
    } else {
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

  items.forEach(({ label, content }) => {
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

  const section = block.closest('.section');
  if (section) {
    section.querySelectorAll('.cta-wrapper, .cta').forEach((cta) => {
      cta.classList.add('info-tree-hidden');
    });
  }

  buttonsEl.addEventListener('click', (e) => {
    const btn = e.target.closest('.info-tree-option');
    if (!btn) return;
    const { answerId } = btn.dataset;
    if (config.cookieName) setCookie(config.cookieName, answerId, 365);
    showAnswer(block, resultsEl, buttonsEl, resetWrap, answerId, items);
  });

  if (config.cookieName) {
    const saved = getCookie(config.cookieName);
    if (saved) showAnswer(block, resultsEl, buttonsEl, resetWrap, saved, items);
  }
}
