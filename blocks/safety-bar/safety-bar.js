function buildToggle(stickyBlock, abbrevClone) {
  const toggle = document.createElement('button');
  toggle.className = 'safety-bar-toggle';
  toggle.setAttribute('aria-expanded', 'false');
  toggle.setAttribute('aria-controls', 'safety-bar-full-content');
  toggle.setAttribute('aria-label', 'Expand Important Safety Information');
  abbrevClone.prepend(toggle);

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
  const isInline = block.classList.contains('inline');
  const isExpandable = block.classList.contains('expandable');
  const isSplit = block.classList.contains('split');
  const isIndicationSwap = block.classList.contains('indication-swap');

  // Row mapping depends on variant:
  // split:            row[0]=col1 abbreviated, row[1]=col2 abbreviated, row[2]=full content
  // indication-swap:  row[0]=abbreviated, row[1..n-2]=full content sections, row[n-1]=indication target text
  // default/other:    row[0]=abbreviated, row[1]=full content
  let abbreviated, col2, fullContent, indicationTarget;

  if (isSplit) {
    [abbreviated, col2, fullContent] = rows;
  } else if (isIndicationSwap) {
    abbreviated = rows[0];
    indicationTarget = rows.at(-1)?.textContent?.trim();
    fullContent = rows.length > 2 ? rows[1] : null;
  } else {
    [abbreviated, fullContent] = rows;
  }

  // Keep the original section in page flow as inline ISI
  const inlineSection = block.closest('.section');
  inlineSection.classList.add('safety-bar-inline');

  if (abbreviated) abbreviated.classList.add('safety-bar-abbreviated');
  if (col2) col2.classList.add('safety-bar-abbreviated-col2');
  if (fullContent) fullContent.classList.add('safety-bar-full');

  // Inline-only variant: no sticky floating bar
  if (isInline) return;

  // Build the floating sticky bar
  const stickySection = document.createElement('div');
  stickySection.className = 'section safety-bar-section';

  const stickyBlock = document.createElement('div');
  stickyBlock.className = [...block.classList].join(' ');

  // Build abbreviated area
  const abbrevClone = document.createElement('div');
  abbrevClone.className = 'safety-bar-abbreviated';

  if (isSplit && col2) {
    const col1Div = document.createElement('div');
    col1Div.className = 'safety-bar-col1';
    col1Div.innerHTML = abbreviated.innerHTML;

    const col2Div = document.createElement('div');
    col2Div.className = 'safety-bar-col2';
    col2Div.innerHTML = col2.innerHTML;

    abbrevClone.append(col1Div, col2Div);
  } else {
    abbrevClone.innerHTML = abbreviated.innerHTML;
  }

  const fade = document.createElement('div');
  fade.className = 'safety-bar-fade';
  abbrevClone.append(fade);

  stickyBlock.append(abbrevClone);

  if (isExpandable && fullContent) {
    const fullClone = fullContent.cloneNode(true);
    fullClone.className = 'safety-bar-full';
    fullClone.id = 'safety-bar-full-content';
    stickyBlock.append(fullClone);
    buildToggle(stickyBlock, abbrevClone);
  }

  // For indication-swap, set target and start hidden until an indication activates it
  if (isIndicationSwap && indicationTarget) {
    stickyBlock.dataset.indicationTarget = indicationTarget;
    stickyBlock.classList.add('is-hidden');

    document.addEventListener('safety-bar:indication-change', (e) => {
      const active = e.detail?.indication;
      stickyBlock.classList.toggle('is-hidden', active !== indicationTarget);
    });
  }

  stickySection.append(stickyBlock);
  document.body.append(stickySection);

  // Hide floating bar when the inline ISI section enters the viewport
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!isIndicationSwap) {
          stickyBlock.classList.toggle('is-hidden', entry.isIntersecting);
        }
      });
    },
    { threshold: 0.1 },
  );
  observer.observe(inlineSection);
}
