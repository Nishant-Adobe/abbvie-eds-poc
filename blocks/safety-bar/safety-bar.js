export default function decorate(block) {
  const rows = [...block.children];
  const isExpandable = block.classList.contains('expandable');

  const [abbreviated, fullContent] = rows;
  abbreviated.classList.add('safety-bar-abbreviated');

  if (fullContent) {
    fullContent.classList.add('safety-bar-full');
    fullContent.id = 'safety-bar-full-content';
  }

  if (isExpandable && fullContent && abbreviated) {
    const toggle = document.createElement('button');
    toggle.className = 'safety-bar-toggle';
    toggle.setAttribute('aria-expanded', 'false');
    toggle.setAttribute('aria-controls', 'safety-bar-full-content');
    abbreviated.prepend(toggle);

    toggle.addEventListener('click', () => {
      const expanded = toggle.getAttribute('aria-expanded') === 'true';
      toggle.setAttribute('aria-expanded', String(!expanded));
      block.classList.toggle('is-expanded', !expanded);
    });
  }

  // Move block to body so it can be position: fixed
  document.body.append(block.closest('.section'));
  block.closest('.section').classList.add('safety-bar-section');

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
