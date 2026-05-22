import { getConfigValue } from '../../scripts/config.js';
import { isUniversalEditor } from '../../scripts/utils.js';

const DEFAULT_HOST = 'https://publish-p157365-e1665798.adobeaemcloud.com';

/**
 * Rewrites same-page-origin resource URLs (script src / link href) inside the
 * fetched form HTML so they resolve against the AEM publish host, not the EDS host.
 * @param {Element} container
 * @param {URL} formUrlObj
 */
function rewriteResourceUrls(container, formUrlObj) {
  container.querySelectorAll('script[src], link[href]').forEach((el) => {
    const attr = el.tagName.toLowerCase() === 'script' ? 'src' : 'href';
    try {
      const parsed = new URL(el[attr]);
      if (parsed.host === window.location.host) {
        el[attr] = `${formUrlObj.protocol}//${formUrlObj.hostname}${parsed.pathname}`;
      }
    } catch {
      // relative or invalid URLs — leave as-is
    }
  });
}

/**
 * Re-executes <script> elements in the injected HTML.
 * Plain innerHTML assignment does not run scripts; replacing each node forces execution.
 * All attributes (type, src, etc.) are preserved.
 * @param {Element} container
 */
function reExecuteScripts(container) {
  container.querySelectorAll('script').forEach((oldScript) => {
    const newScript = document.createElement('script');
    [...oldScript.attributes].forEach((attr) => newScript.setAttribute(attr.name, attr.value));
    newScript.textContent = oldScript.textContent;
    oldScript.replaceWith(newScript);
  });
}

/** Loads jQuery from CDN if not already present. */
const ensureJQuery = () => new Promise((resolve) => {
  if (window.jQuery) { resolve(); return; }
  const script = document.createElement('script');
  script.src = 'https://ajax.googleapis.com/ajax/libs/jquery/3.3.1/jquery.min.js';
  script.onload = resolve;
  document.head.appendChild(script);
});

/**
 * Embed Form Block
 * Renders an AEM Adaptive Form by fetching its published HTML and injecting it
 * into the page. Mirrors the AEM forms-embed component behaviour.
 */
export default async function decorate(block) {
  if (!block) return;

  const formLink = block.querySelector('a');
  if (!formLink?.href) return;

  // Resolve the AEM publish host from site config (falls back to default)
  const aemHost = (await getConfigValue('aemPublishUrl')) || DEFAULT_HOST;

  let { href } = formLink;
  let finalFormPath = '';

  if (isUniversalEditor()) {
    // In UE, use the raw authored href (wcmmode=disabled added as query param below)
    finalFormPath = href;
  } else if (formLink.host !== window.location.host) {
    // Absolute URL pointing to a different host — use directly
    finalFormPath = href;
  } else {
    // Same-host link: strip origin so we can inspect the pathname
    href = formLink.pathname + formLink.search + formLink.hash;

    if (href.startsWith('/content/forms')) {
      if (!href.endsWith('.html')) href = `${href}.html`;
      finalFormPath = `${aemHost}${href}`;
    } else {
      // Non-forms same-host path — use as-is (relative to current origin)
      finalFormPath = `${window.location.origin}${href}`;
    }
  }

  const formUrlObj = new URL(finalFormPath);

  // Replace block content with the form container
  const formContainer = document.createElement('div');
  formContainer.className = 'embed-form-container';
  block.querySelector(':scope div').replaceWith(formContainer);

  const loadAdaptiveForm = () => {
    formContainer.innerHTML = '<div class="embed-form-loading">Loading form…</div>';

    const ajaxData = isUniversalEditor() ? { wcmmode: 'disabled' } : {};

    window.jQuery.ajax({
      url: finalFormPath,
      type: 'GET',
      data: ajaxData,
      success(data) {
        formContainer.innerHTML = data;
        rewriteResourceUrls(formContainer, formUrlObj);
        reExecuteScripts(formContainer);

        // Let AEM adaptive-form JS resolve assets relative to the publish host
        const form = formContainer.querySelector('[data-cmp-path]');
        if (form) {
          form.setAttribute('data-cmp-context-path', formUrlObj.origin);
        }

        document.dispatchEvent(new CustomEvent('adaptiveform:loaded', {
          detail: { finalFormPath, container: formContainer },
        }));
      },
      error(error) {
        formContainer.innerHTML = '<p class="embed-form-error">Error loading form. Please try again later.</p>';
        document.dispatchEvent(new CustomEvent('adaptiveform:error', {
          detail: { finalFormPath, error },
        }));
      },
    });
  };

  await ensureJQuery();
  loadAdaptiveForm();
}
