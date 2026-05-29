export default function transform(hookName, element, payload) {
  if (hookName === 'beforeTransform') {
    const { document } = payload;

    const selectorsToRemove = [
      'script',
      'style',
      'noscript',
      'iframe',
      '[data-digitaldata]',
      '.abbv-dimmer',
      '.abbv-modal',
      '.onetrust-pc-dark-filter',
      '.otPcCenter',
      '#onetrust-consent-sdk',
      '[class*="onetrust"]',
      '.abbv-skip-to-main-content',
      '[data-stick-anchor-pos]',
      'header',
      'footer',
      '.abbv-header-v2',
      '.abbv-footer',
      '.abbv-safety-bar',
      '.abbv-safety-bar-fade',
      '.abbv-search-navigation',
    ];

    selectorsToRemove.forEach((selector) => {
      document.querySelectorAll(selector).forEach((el) => el.remove());
    });

    document.querySelectorAll('*').forEach((el) => {
      const attrs = [...el.attributes];
      attrs.forEach((attr) => {
        if (
          attr.name.startsWith('data-')
          && !['data-video-id', 'data-account', 'data-player'].includes(attr.name)
        ) {
          el.removeAttribute(attr.name);
        }
      });
    });
  }
}
