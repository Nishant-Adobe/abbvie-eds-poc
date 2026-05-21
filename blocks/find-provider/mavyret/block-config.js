function createNavBtn(suffix, ariaLabel) {
  const btn = document.createElement('button');
  btn.type = 'button';
  btn.className = `find-provider-pagination-btn find-provider-pagination-${suffix}`;
  btn.setAttribute('aria-label', ariaLabel);
  return btn;
}

const CONSULTATION_TEXT = 'Consultation visits need not be in person. Ask your doctor about virtual appointments.';

function restructurePagination(block) {
  const pagination = block.querySelector('.find-provider-pagination');
  if (!pagination || pagination.dataset.paginationBuilt) return;
  pagination.dataset.paginationBuilt = 'true';

  const firstBtn = createNavBtn('first', 'First page');
  const lastBtn = createNavBtn('last', 'Last page');
  const activePage = pagination.querySelector('.find-provider-pagination-page.is-active');
  firstBtn.disabled = activePage?.textContent.trim() === '1';
  pagination.prepend(firstBtn);
  pagination.append(lastBtn);

  const title = block.querySelector('.find-provider-results-title');
  if (title) title.textContent = CONSULTATION_TEXT;

  const resultsLayout = block.querySelector('.find-provider-results-layout');
  const header = block.querySelector('.find-provider-results-header');
  const resultsUL = block.querySelector('.find-provider-results');
  if (resultsLayout && header && resultsUL) {
    const right = document.createElement('div');
    right.className = 'find-provider-results-right';
    right.append(header, resultsUL);
    resultsLayout.append(right);

    const topPagination = document.createElement('nav');
    topPagination.className = 'find-provider-pagination find-provider-pagination-top';
    topPagination.setAttribute('aria-label', 'Results pagination');
    topPagination.dataset.paginationBuilt = 'true';
    resultsLayout.before(topPagination);
    pagination.addEventListener('find-provider:pagination-rebuilt', () => {
      topPagination.innerHTML = pagination.innerHTML;
    });
    topPagination.addEventListener('click', (e) => {
      const src = e.target.closest('button');
      if (!src) return;
      const sel = src.dataset.page
        ? `[data-page="${src.dataset.page}"]`
        : src.classList.contains('find-provider-pagination-prev') ? '.find-provider-pagination-prev'
        : src.classList.contains('find-provider-pagination-next') ? '.find-provider-pagination-next'
        : null;
      if (sel) pagination.querySelector(sel)?.click();
    });
  }
}

function moveNameIntoBody(li) {
  const name = li.querySelector('.find-provider-result-name');
  const body = li.querySelector('.find-provider-result-body');
  if (!name || !body || body.contains(name)) return;
  body.prepend(name);
}

function observeResults(block) {
  const resultsList = block.querySelector('.find-provider-results');
  if (!resultsList) return;
  const observer = new MutationObserver((mutations) => {
    mutations.forEach(({ addedNodes }) => {
      addedNodes.forEach((node) => {
        if (node.nodeType === Node.ELEMENT_NODE) moveNameIntoBody(node);
      });
    });
  });
  observer.observe(resultsList, { childList: true });

  if (block.parentNode) {
    const teardown = new MutationObserver(() => {
      if (!block.isConnected) {
        observer.disconnect();
        teardown.disconnect();
      }
    });
    teardown.observe(block.parentNode, { childList: true });
  }
}

function wrapForm(block) {
  const form = block.querySelector('.find-provider-form');
  if (!form) return;
  const wrapper = document.createElement('div');
  wrapper.className = 'find-provider-form-wrap';
  form.replaceWith(wrapper);
  wrapper.append(form);
}

export default async function getBlockConfigs() {
  return {
    flags: {},
    variations: [],
    decorations: {
      afterDecorate: async (block) => {
        wrapForm(block);
        restructurePagination(block);
        observeResults(block);
      },
    },
  };
}
