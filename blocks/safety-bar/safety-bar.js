function buildToggle(stickyBlock, abbrevEl) {
  const toggle = document.createElement('button');
  toggle.className = 'safety-bar-toggle';
  toggle.setAttribute('aria-expanded', 'false');
  toggle.setAttribute('aria-controls', 'safety-bar-full-content');
  toggle.setAttribute('aria-label', 'Expand Important Safety Information');
  abbrevEl.append(toggle);

  toggle.addEventListener('click', () => {
    const expanded = toggle.getAttribute('aria-expanded') === 'true';
    toggle.setAttribute('aria-expanded', String(!expanded));
    toggle.setAttribute(
      'aria-label',
      expanded ? 'Expand Important Safety Information' : 'Collapse Important Safety Information',
    );
    stickyBlock.classList.toggle('is-expanded', !expanded);
  });
}

export default function decorate(block) {
  const rows = [...block.children];
  const isSplit = block.classList.contains('split');

  // Row order: [collapsed, (col2 if split,) expanded]
  let collapsed, collapsedCol2, expanded;
  if (isSplit) {
    [collapsed, collapsedCol2, expanded] = rows;
  } else {
    [collapsed, expanded] = rows;
  }

  // Mark inline section — CSS hides abbreviated row, shows only full content
  const inlineSection = block.closest('.section');
  inlineSection.classList.add('safety-bar-inline');

  if (collapsed) collapsed.classList.add('safety-bar-abbreviated');
  if (collapsedCol2) collapsedCol2.classList.add('safety-bar-abbreviated-col2');
  if (expanded) expanded.classList.add('safety-bar-full');

  // Build the sticky floating bar cloned from this block
  const stickySection = document.createElement('div');
  stickySection.className = 'section safety-bar-section';

  const stickyBlock = document.createElement('div');
  stickyBlock.className = [...block.classList].join(' ');

  const abbrevEl = document.createElement('div');
  abbrevEl.className = 'safety-bar-abbreviated';

  if (isSplit && collapsedCol2) {
    const col1Div = document.createElement('div');
    col1Div.className = 'safety-bar-col1';
    col1Div.innerHTML = collapsed ? collapsed.innerHTML : '';

    const col2Div = document.createElement('div');
    col2Div.className = 'safety-bar-col2';
    col2Div.innerHTML = collapsedCol2.innerHTML;

    abbrevEl.append(col1Div, col2Div);
  } else if (collapsed) {
    abbrevEl.innerHTML = collapsed.innerHTML;
  }

  buildToggle(stickyBlock, abbrevEl);
  stickyBlock.append(abbrevEl);

  if (expanded) {
    const fullEl = expanded.cloneNode(true);
    fullEl.className = 'safety-bar-full';
    fullEl.id = 'safety-bar-full-content';
    stickyBlock.append(fullEl);
  }

  stickySection.append(stickyBlock);
  document.body.append(stickySection);

  // Hide sticky bar when the inline ISI section scrolls into view
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        stickyBlock.classList.toggle('is-hidden', entry.isIntersecting);
      });
    },
    { threshold: 0.1 },
  );
  observer.observe(inlineSection);
}
