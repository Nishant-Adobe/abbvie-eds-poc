function buildToggle(stickyBlock) {
  const toggle = document.createElement('button');
  toggle.className = 'safety-bar-toggle';
  toggle.setAttribute('aria-expanded', 'false');
  toggle.setAttribute('aria-controls', 'safety-bar-full-content');
  toggle.setAttribute('aria-label', 'Expand Important Safety Information');

  toggle.addEventListener('click', () => {
    const expanded = toggle.getAttribute('aria-expanded') === 'true';
    toggle.setAttribute('aria-expanded', String(!expanded));
    toggle.setAttribute(
      'aria-label',
      expanded ? 'Expand Important Safety Information' : 'Collapse Important Safety Information',
    );
    stickyBlock.classList.toggle('is-expanded', !expanded);
  });

  return toggle;
}

function getNonNestedProp(block, name) {
  return [...block.querySelectorAll(`[data-aue-prop="${name}"]`)]
    .find((el) => !el.parentElement?.closest(`[data-aue-prop="${name}"]`)) || null;
}

function extractContentFields(block, isSplit) {
  const hasAueProps = block.querySelector('[data-aue-prop]');

  if (hasAueProps) {
    return {
      collapsed: getNonNestedProp(block, 'collapsedContent'),
      collapsedCol2: isSplit ? getNonNestedProp(block, 'collapsedContentCol2') : null,
      expanded: getNonNestedProp(block, 'expandedContent'),
    };
  }

  const rows = [...block.querySelectorAll(':scope > div')];
  const hasRenderableContent = (el) => {
    if (!el) return false;
    return !!el.textContent?.trim() || !!el.querySelector('img, picture, video, iframe, ul, ol, table');
  };

  return {
    collapsed: rows[0] || null,
    collapsedCol2: isSplit ? rows[1] || null : null,
    expanded: isSplit
      ? rows[2] || null
      : rows.slice(1).findLast(hasRenderableContent) || rows[1] || null,
  };
}

export default function decorate(block) {
  const isSplit = block.classList.contains('split');
  const { collapsed, collapsedCol2, expanded } = extractContentFields(block, isSplit);

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

  stickyBlock.append(abbrevEl);

  if (expanded) {
    const fullEl = document.createElement('div');
    fullEl.className = 'safety-bar-full';
    fullEl.id = 'safety-bar-full-content';
    fullEl.innerHTML = expanded.innerHTML;
    stickyBlock.append(fullEl);
  }

  stickyBlock.append(buildToggle(stickyBlock));

  stickySection.append(stickyBlock);
  document.body.append(stickySection);

  // Hide sticky bar while any part of the inline ISI section is in view.
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        stickySection.classList.toggle('is-hidden', entry.isIntersecting && entry.intersectionRatio > 0);
      });
    },
    { threshold: 0 },
  );
  observer.observe(inlineSection);
}
