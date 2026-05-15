const isTouchDevice = () => window.matchMedia('(hover: none)').matches;

const registry = new Set();
let listenerController = null;

function createTooltipPanel(content, id) {
  const panel = document.createElement('span');
  panel.className = 'tooltip-panel';
  panel.id = id;
  panel.setAttribute('role', 'tooltip');
  panel.innerHTML = content;
  return panel;
}

function autoFlip(trigger, panel) {
  const rect = panel.getBoundingClientRect();
  const container = trigger.closest('.tooltip, .has-tooltip') || trigger;
  if (rect.top < 0) {
    container.classList.add('flip-bottom');
  }
  if (rect.left < 0) {
    panel.classList.add('flip-left');
  } else if (rect.right > window.innerWidth) {
    panel.classList.add('flip-right');
  }
}

function resetFlip(trigger, panel) {
  const container = trigger.closest('.tooltip, .has-tooltip') || trigger;
  container.classList.remove('flip-bottom');
  panel.classList.remove('flip-left', 'flip-right');
}

function removeFromRegistry(el) {
  registry.forEach((entry) => {
    if (entry.el === el) registry.delete(entry);
  });
  if (registry.size === 0 && listenerController) {
    listenerController.abort();
    listenerController = null;
  }
}

function closeAllTooltips(except) {
  registry.forEach((entry) => {
    if (entry.el === except) return;
    entry.el.classList.remove('is-visible');
    entry.trigger?.setAttribute('aria-expanded', 'false');
  });
}

function attachGlobalListener() {
  if (listenerController) return;
  listenerController = new AbortController();
  document.addEventListener('click', (e) => {
    if (!e.target.closest('.tooltip, .has-tooltip')) {
      closeAllTooltips();
    }
  }, { signal: listenerController.signal });
}

function bindTooltipEvents(el, triggerEl, panel, show, hide) {
  let pointerActivated = false;

  triggerEl.addEventListener('pointerdown', () => { pointerActivated = true; });

  triggerEl.addEventListener('focus', () => {
    if (!pointerActivated) show();
  });

  triggerEl.addEventListener('blur', () => {
    pointerActivated = false;
    hide();
  });

  triggerEl.addEventListener('click', (e) => {
    e.preventDefault();
    if (pointerActivated) {
      if (el.classList.contains('is-visible')) hide();
      else show();
    }
    pointerActivated = false;
  });

  if (!isTouchDevice()) {
    triggerEl.addEventListener('mouseenter', show);
    triggerEl.addEventListener('mouseleave', hide);
  }

  triggerEl.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') hide();
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      if (el.classList.contains('is-visible')) hide();
      else show();
    }
  });
}

export function wireInlineTooltips(scope = document) {
  scope.querySelectorAll('abbr[title]:not(.has-tooltip)').forEach((abbr, i) => {
    const id = `inline-tooltip-${Date.now()}-${i}`;
    const panel = createTooltipPanel(abbr.title, id);
    abbr.removeAttribute('title');
    abbr.setAttribute('aria-describedby', id);
    abbr.setAttribute('role', 'button');
    abbr.setAttribute('aria-expanded', 'false');
    abbr.classList.add('has-tooltip');
    abbr.setAttribute('tabindex', '0');
    abbr.append(panel);

    registry.add({ el: abbr, trigger: abbr });

    function show() {
      closeAllTooltips(abbr);
      abbr.setAttribute('aria-expanded', 'true');
      abbr.classList.add('is-visible');
      autoFlip(abbr, panel);
    }

    function hide() {
      abbr.setAttribute('aria-expanded', 'false');
      abbr.classList.remove('is-visible');
      resetFlip(abbr, panel);
      if (!abbr.isConnected) removeFromRegistry(abbr);
    }

    bindTooltipEvents(abbr, abbr, panel, show, hide);
  });

  attachGlobalListener();
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

  registry.add({ el: block, trigger });

  function show() {
    closeAllTooltips(block);
    block.classList.add('is-visible');
    trigger.setAttribute('aria-expanded', 'true');
    autoFlip(trigger, panel);
  }

  function hide() {
    block.classList.remove('is-visible');
    trigger.setAttribute('aria-expanded', 'false');
    resetFlip(trigger, panel);
    if (!block.isConnected) removeFromRegistry(block);
  }

  bindTooltipEvents(block, trigger, panel, show, hide);

  attachGlobalListener();
}
