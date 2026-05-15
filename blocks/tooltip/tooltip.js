function createTooltipPanel(content, id) {
  const panel = document.createElement('span');
  panel.className = 'tooltip-panel';
  panel.id = id;
  panel.setAttribute('role', 'tooltip');
  panel.innerHTML = content;
  return panel;
}

export function wireInlineTooltips(scope = document) {
  scope.querySelectorAll('abbr[title]:not(.has-tooltip)').forEach((abbr, i) => {
    const id = `inline-tooltip-${Date.now()}-${i}`;
    const panel = createTooltipPanel(abbr.title, id);
    abbr.removeAttribute('title');
    abbr.setAttribute('aria-describedby', id);
    abbr.setAttribute('aria-expanded', 'false');
    abbr.setAttribute('role', 'button');
    abbr.classList.add('has-tooltip');
    abbr.setAttribute('tabindex', '0');
    abbr.append(panel);

    abbr.addEventListener('mouseenter', () => {
      abbr.setAttribute('aria-expanded', 'true');
    });
    abbr.addEventListener('mouseleave', () => {
      abbr.setAttribute('aria-expanded', 'false');
    });
    abbr.addEventListener('focus', () => {
      abbr.setAttribute('aria-expanded', 'true');
    });
    abbr.addEventListener('blur', () => {
      abbr.setAttribute('aria-expanded', 'false');
    });
    abbr.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        abbr.setAttribute('aria-expanded', 'false');
        abbr.classList.remove('is-visible');
      }
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        const expanded = abbr.getAttribute('aria-expanded') === 'true';
        abbr.setAttribute('aria-expanded', String(!expanded));
        abbr.classList.toggle('is-visible', !expanded);
      }
    });
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
  trigger.setAttribute('role', 'button');
  trigger.setAttribute('tabindex', '0');
  trigger.setAttribute('aria-expanded', 'false');
  trigger.setAttribute('aria-describedby', id);
  trigger.textContent = term;

  const panel = createTooltipPanel(definition, id);

  block.replaceChildren(trigger, panel);

  function show() {
    block.classList.add('is-visible');
    trigger.setAttribute('aria-expanded', 'true');
  }

  function hide() {
    block.classList.remove('is-visible');
    trigger.setAttribute('aria-expanded', 'false');
  }

  trigger.addEventListener('mouseenter', show);
  trigger.addEventListener('mouseleave', hide);
  trigger.addEventListener('focus', show);
  trigger.addEventListener('blur', hide);
  trigger.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      hide();
    }
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      if (block.classList.contains('is-visible')) {
        hide();
      } else {
        show();
      }
    }
  });

  wireInlineTooltips();
}
