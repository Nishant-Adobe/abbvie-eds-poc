export default function decorate(block) {
  const container = document.createElement('div');
  container.classList.add('cta-card-grid-container');
  block.append(container);
}
