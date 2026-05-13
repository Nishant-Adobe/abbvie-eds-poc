/**
 * drcom-widget block
 * Lazy-loads the Doctor.com directory finder widget via IntersectionObserver.
 *
 * Document authoring row → UE field mapping:
 *   Row 1  →  partner-id  (required)
 *   Row 2  →  heading     (optional)
 */

const SCRIPT_ID = 'directory-widget';
const SCRIPT_SRC_PROD = 'https://widget.doctor.com/directory_v2/app.js';
const SCRIPT_SRC_TEST = 'https://widget.doctor.com/directory_v2/app.js'; // update if a staging URL exists
const READY_TIMEOUT_MS = 8000;

/**
 * Reads all <p> text values from block rows.
 * Row layout (document authoring):
 *   Row 0 → partner-id
 *   Row 1 → heading
 */
function readBlockFields(block) {
  const rows = [...block.querySelectorAll(':scope > div')];
  const getText = (row) => row?.querySelector('p')?.textContent.trim() || '';

  // UE data attributes take precedence over document-table rows
  const partnerId = block.dataset.partnerId || getText(rows[0]);
  const heading = block.dataset.heading || getText(rows[1]);
  const showHeading = block.dataset.showHeading !== 'false';
  const apiEnv = block.dataset.apiEnv || 'prod';

  return {
    partnerId, heading, showHeading, apiEnv,
  };
}

/**
 * Creates and returns the loading placeholder element.
 */
function createLoadingPlaceholder() {
  const placeholder = document.createElement('div');
  placeholder.className = 'drcom-widget-loading';
  placeholder.setAttribute('aria-label', 'Loading physician finder…');
  placeholder.setAttribute('role', 'status');
  return placeholder;
}

/**
 * Creates the optional heading element.
 */
function createHeading(text) {
  const h2 = document.createElement('h2');
  h2.className = 'drcom-widget-heading';
  h2.textContent = text;
  return h2;
}

/**
 * Creates the <directory-widget> custom element.
 */
function createDirectoryWidget(partnerId, apiEnv) {
  const widget = document.createElement('directory-widget');
  widget.setAttribute('partner', partnerId);
  if (apiEnv && apiEnv !== 'prod') {
    widget.setAttribute('api-env', apiEnv);
  }
  return widget;
}

/**
 * Injects the Doctor.com script into <head> if not already present.
 */
function injectScript(src) {
  if (document.getElementById(SCRIPT_ID)) return;

  const script = document.createElement('script');
  script.id = SCRIPT_ID;
  script.src = src;
  script.defer = true;
  document.head.appendChild(script);
}

/**
 * Removes the loading placeholder once the widget signals it is ready,
 * or after a fallback timeout.
 */
function removePlaceholderOnReady(placeholder, widget) {
  const removePlaceholder = () => {
    placeholder.remove();
  };

  // Listen for a custom "ready" event from <directory-widget>
  widget.addEventListener('ready', removePlaceholder, { once: true });

  // Fallback: remove after READY_TIMEOUT_MS regardless
  setTimeout(removePlaceholder, READY_TIMEOUT_MS);
}

/**
 * Main block decorator.
 */
export default function decorate(block) {
  const {
    partnerId, heading, showHeading, apiEnv,
  } = readBlockFields(block);

  // Clear existing block content (document-table rows)
  block.innerHTML = '';

  // --- Missing partner-id guard ---
  if (!partnerId) {
    // eslint-disable-next-line no-console
    console.warn('[drcom-widget] No partner-id provided. Block will not render the widget.');
    const error = document.createElement('p');
    error.className = 'drcom-widget-error';
    error.textContent = '⚠ drcom-widget: A "Partner ID" is required. Please set it in the block properties.';
    block.appendChild(error);
    return;
  }

  // --- Optional heading ---
  if (heading && showHeading) {
    block.appendChild(createHeading(heading));
  }

  // --- Loading placeholder ---
  const placeholder = createLoadingPlaceholder();
  block.appendChild(placeholder);

  // --- Lazy-load via IntersectionObserver ---
  const observer = new IntersectionObserver(
    (entries, obs) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;

        obs.disconnect();

        const scriptSrc = apiEnv === 'test' ? SCRIPT_SRC_TEST : SCRIPT_SRC_PROD;
        injectScript(scriptSrc);

        const widget = createDirectoryWidget(partnerId, apiEnv);
        block.appendChild(widget);

        removePlaceholderOnReady(placeholder, widget);
      });
    },
    { threshold: 0.1 },
  );

  observer.observe(block);
}
