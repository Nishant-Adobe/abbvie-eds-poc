function createTooltipPanel(content, id) {
  const panel = document.createElement('span');
  panel.className = 'tooltip-panel';
  panel.id = id;
  panel.setAttribute('role', 'tooltip');
  panel.innerHTML = content;
  return panel;
}

function wireInlineTooltips() {
  document.querySelectorAll('abbr[title]').forEach((abbr, i) => {
    const id = `inline-tooltip-${i}`;
    const panel = createTooltipPanel(abbr.title, id);
    abbr.removeAttribute('title');
    abbr.setAttribute('aria-describedby', id);
    abbr.classList.add('has-tooltip');
    abbr.setAttribute('tabindex', '0');
    abbr.append(panel);
  });
}

export default function decorate(block) {
  const rows = [...block.children];
  const [termRow, defRow] = rows;

  const term = termRow?.textContent.trim();
  const definition = defRow?.innerHTML || '';

  const id = `tooltip-${Math.random().toString(36).slice(2, 6)}`;

  const trigger = document.createElement('span');
  trigger.className = 'tooltip-trigger';
  trigger.setAttribute('tabindex', '0');
  trigger.setAttribute('aria-describedby', id);
  trigger.textContent = term;

  const panel = createTooltipPanel(definition, id);

  block.replaceChildren(trigger, panel);

  function show() { block.classList.add('is-visible'); }
  function hide() { block.classList.remove('is-visible'); }

  trigger.addEventListener('mouseenter', show);
  trigger.addEventListener('mouseleave', hide);
  trigger.addEventListener('focus', show);
  trigger.addEventListener('blur', hide);
  trigger.addEventListener('keydown', (e) => { if (e.key === 'Escape') hide(); });

  wireInlineTooltips();
}
