import { getConfigValue } from '../../scripts/config.js';
import { isUniversalEditor } from '../../scripts/utils.js';

/**
 * Embed Form Block
 * Renders an AEM adaptive form using its published path.
 * Supports two modes:
 *   1. Fetch mode (default) — fetches form HTML via AJAX and injects into page
 *   2. Iframe mode (fallback) — embeds form in a responsive iframe when fetch fails
 */
export default async function decorate(block) {
  if (!block) return;

  const formLink = block.querySelector('a');
  if (!formLink?.href) return;

  // Extract authored title and anchorId from block rows
  const rows = [...block.querySelectorAll(':scope > div')];
  let title = '';
  let anchorId = '';

  rows.forEach((row) => {
    const cells = [...row.children];
    if (cells.length >= 2) {
      const label = cells[0]?.textContent?.trim().toLowerCase();
      const value = cells[1]?.textContent?.trim();
      if (label === 'title') title = value;
      if (label === 'anchorid' || label === 'anchor id') anchorId = value;
    }
  });

  if (anchorId) block.id = anchorId;

  // Resolve form URL — no hardcoded fallback
  let finalFormPath = '';
  let { href } = formLink;

  if ((href.startsWith('http://') || href.startsWith('https://')) && (formLink.host !== window.location.host)) {
    finalFormPath = href;
  }

  if (isUniversalEditor()) {
    finalFormPath = href;
  }

  if ((formLink.host === window.location.host) && !isUniversalEditor()) {
    href = formLink.pathname + formLink.search + formLink.hash;
  }

  if (href.startsWith('/content/forms')) {
    const host = await getConfigValue('aemPublishUrl');
    if (!host) {
      block.innerHTML = '<p class="embed-form-error">Form configuration missing. Please set aemPublishUrl in site config.</p>';
      return;
    }
    if (!href.endsWith('.html')) {
      href = `${href}.html`;
    }
    finalFormPath = `${host}${href}`;
  }

  if (!finalFormPath) {
    block.innerHTML = '<p class="embed-form-error">No valid form URL provided.</p>';
    return;
  }

  const formUrlObj = new URL(finalFormPath);
  const formUrlHost = formUrlObj.hostname;

  // Container for form
  const formContainer = document.createElement('div');
  formContainer.className = 'embed-form-container';
  block.replaceChildren(formContainer);

  /**
   * Iframe fallback mode — renders form in a responsive iframe
   */
  const renderIframe = () => {
    formContainer.innerHTML = '';
    const iframe = document.createElement('iframe');
    iframe.src = finalFormPath;
    iframe.className = 'embed-form-iframe';
    iframe.title = title || 'Embedded form';
    iframe.setAttribute('loading', 'lazy');
    iframe.setAttribute('frameborder', '0');
    iframe.setAttribute('allowfullscreen', '');
    formContainer.appendChild(iframe);

    const resizeHandler = (event) => {
      if (event.origin !== formUrlObj.origin) return;
      const { height } = event.data || {};
      if (height && typeof height === 'number') {
        iframe.style.height = `${height}px`;
      }
    };
    window.addEventListener('message', resizeHandler);

    // Clean up listener if iframe is removed from DOM
    const observer = new MutationObserver(() => {
      if (!document.contains(iframe)) {
        window.removeEventListener('message', resizeHandler);
        observer.disconnect();
      }
    });
    observer.observe(block.parentElement || document.body, { childList: true, subtree: true });

    document.dispatchEvent(
      new CustomEvent('adaptiveform:loaded', {
        detail: { finalFormPath, container: formContainer, mode: 'iframe' },
      }),
    );
  };

  /**
   * Fetch mode — loads form HTML via AJAX and injects into page
   */
  const loadAdaptiveForm = async () => {
    formContainer.innerHTML = '<div class="embed-form-loading"><span class="embed-form-spinner"></span>Loading form...</div>';

    try {
      const params = isUniversalEditor() ? '?wcmmode=disabled' : '';
      const response = await fetch(`${finalFormPath}${params}`, {
        credentials: 'omit',
      });

      if (!response.ok) throw new Error(`HTTP ${response.status}`);

      const data = await response.text();
      formContainer.innerHTML = data;

      if (title) {
        const form = formContainer.querySelector('form, [data-cmp-path]');
        if (form) form.setAttribute('aria-label', title);
      }

      // Rewrite resource URLs to AEM host
      const elements = formContainer.querySelectorAll('script, link');
      elements.forEach((element) => {
        const attr = element.tagName.toLowerCase() === 'script' ? 'src' : 'href';
        const value = element[attr];
        if (value) {
          try {
            const parsedUrl = new URL(value);
            if (parsedUrl.host === window.location.host) {
              element[attr] = `${formUrlObj.protocol}//${formUrlHost}${parsedUrl.pathname}`;
            }
          } catch { /* ignore invalid URLs */ }
        }
      });

      // Re-execute scripts
      const scripts = formContainer.querySelectorAll('script');
      scripts.forEach((oldScript) => {
        const newScript = document.createElement('script');
        if (oldScript.src) {
          newScript.src = oldScript.src;
        } else {
          newScript.textContent = oldScript.textContent;
        }
        oldScript.replaceWith(newScript);
      });

      const form = formContainer.querySelector('[data-cmp-path]');
      if (form) {
        form.setAttribute('data-cmp-context-path', `${formUrlObj.protocol}//${formUrlHost}`);
      }

      document.dispatchEvent(
        new CustomEvent('adaptiveform:loaded', {
          detail: { finalFormPath, container: formContainer, mode: 'fetch' },
        }),
      );
    } catch (error) {
      document.dispatchEvent(
        new CustomEvent('adaptiveform:error', {
          detail: { finalFormPath, error, container: formContainer },
        }),
      );
      renderIframe();
    }
  };

  loadAdaptiveForm();
}
