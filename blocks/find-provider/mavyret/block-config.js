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
  if (!pagination || pagination.dataset.mavyretDone) return;
  pagination.dataset.mavyretDone = 'true';

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
    const topPagination = pagination.cloneNode(true);
    right.append(topPagination, header, resultsUL);
    resultsLayout.append(right);
  }
}

export default async function getBlockConfigs() {
  return {
    flags: {},
    variations: [],
    decorations: {
      afterDecorate: async (block) => {
        restructurePagination(block);
      },
    },
  };
}
