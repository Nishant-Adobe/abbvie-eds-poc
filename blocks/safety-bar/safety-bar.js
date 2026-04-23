export default function decorate(block) {
  const rows = [...block.children];
  const isExpandable = block.classList.contains('expandable');

  const [abbreviated, fullContent] = rows;
  abbreviated.classList.add('safety-bar-abbreviated');

  if (fullContent) {
    fullContent.classList.add('safety-bar-full');
    fullContent.id = 'safety-bar-full-content';
  }

  const fade = document.createElement('div');
  fade.className = 'safety-bar-fade';
  abbreviated.append(fade);

  if (isExpandable && fullContent && abbreviated) {
    const toggle = document.createElement('button');
    toggle.className = 'safety-bar-toggle';
    toggle.setAttribute('aria-expanded', 'false');
    toggle.setAttribute('aria-controls', 'safety-bar-full-content');
    toggle.setAttribute('aria-label', 'Expand Important Safety Information');
    abbreviated.prepend(toggle);

    toggle.addEventListener('click', () => {
      const expanded = toggle.getAttribute('aria-expanded') === 'true';
      toggle.setAttribute('aria-expanded', String(!expanded));
      toggle.setAttribute('aria-label', expanded ? 'Expand Important Safety Information' : 'Collapse Important Safety Information');
      block.classList.toggle('is-expanded', !expanded);
    });
  }

  // Move block to body so it can be position: fixed
  const section = block.closest('.section');
  section.classList.add('safety-bar-section');
  document.body.append(section);

  // Hide bar when full ISI section enters viewport
  const fullISI = document.querySelector('[data-isi], .section.full-isi');
  if (fullISI) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          block.classList.toggle('is-hidden', entry.isIntersecting);
        });
      },
      { threshold: 0.1 },
    );
    observer.observe(fullISI);
  }
}
