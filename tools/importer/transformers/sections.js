export default function transform(hookName, element, payload) {
  if (hookName === 'afterTransform') {
    const { document } = payload;

    // Map dark purple background sections to style: dark
    document.querySelectorAll('.background-dark-purple, .abbv-container.background-dark-purple').forEach((el) => {
      el.setAttribute('data-section-style', 'dark');
    });
  }
}
