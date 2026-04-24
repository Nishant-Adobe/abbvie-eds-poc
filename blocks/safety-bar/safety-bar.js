export default function decorate(block) {
  const rows = [...block.children];
  const isExpandable = block.classList.contains('expandable');
  const [abbreviated, fullContent] = rows;

  // Keep the original section in page flow as the full inline ISI
  const inlineSection = block.closest('.section');
  inlineSection.classList.add('safety-bar-inline');
  abbreviated.classList.add('safety-bar-abbreviated');
  if (fullContent) {
    fullContent.classList.add('safety-bar-full');
  }

  // Build a separate floating sticky bar from cloned content
  const stickySection = document.createElement('div');
  stickySection.className = 'section safety-bar-section';

  const stickyBlock = document.createElement('div');
  stickyBlock.className = [...block.classList].join(' ');

  const abbrevClone = abbreviated.cloneNode(true);
  abbrevClone.classList.add('safety-bar-abbreviated');

  const fade = document.createElement('div');
  fade.className = 'safety-bar-fade';
  abbrevClone.append(fade);

  stickyBlock.append(abbrevClone);

  if (isExpandable && fullContent) {
    const fullClone = fullContent.cloneNode(true);
    fullClone.classList.add('safety-bar-full');
    fullClone.id = 'safety-bar-full-content';
    stickyBlock.append(fullClone);

    const toggle = document.createElement('button');
    toggle.className = 'safety-bar-toggle';
    toggle.setAttribute('aria-expanded', 'false');
    toggle.setAttribute('aria-controls', 'safety-bar-full-content');
    toggle.setAttribute('aria-label', 'Expand Important Safety Information');
    abbrevClone.prepend(toggle);

    toggle.addEventListener('click', () => {
      const expanded = toggle.getAttribute('aria-expanded') === 'true';
      toggle.setAttribute('aria-expanded', String(!expanded));
      toggle.setAttribute('aria-label', expanded ? 'Expand Important Safety Information' : 'Collapse Important Safety Information');
      stickyBlock.classList.toggle('is-expanded', !expanded);
    });
  }

  stickySection.append(stickyBlock);
  document.body.append(stickySection);

  // Hide the floating bar when the inline ISI section enters viewport
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
