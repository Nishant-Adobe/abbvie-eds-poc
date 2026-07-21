import { getConfigValue } from './config.js';
import { shouldRunOutsideAuthorEdit } from './utils.js';

// Used when no `dtm-src` config value is authored in ab-config.json.
const DEFAULT_DTM_SRC = 'https://assets.adobedtm.com/acb96670c057/cc3788e73508/launch-e37e3c874d1a-development.min.js';

/**
 * Loads the Adobe Launch (DTM) script.
 * Configurable via ab-config.json:
 *  - `dtm-enabled` — set to "false" to disable loading entirely (default: enabled)
 *  - `dtm-src`     — override the script URL, e.g. per brand or environment
 */
export default async function loadDTM() {
  if (!shouldRunOutsideAuthorEdit()) return;
  if (document.head.querySelector('script[data-dtm]')) return;

  const [enabled, src] = await Promise.all([
    getConfigValue('dtm-enabled'),
    getConfigValue('dtm-src'),
  ]);

  if (`${enabled}`.toLowerCase() === 'false') return;

  const script = document.createElement('script');
  script.src = src || DEFAULT_DTM_SRC;
  script.async = true;
  script.dataset.dtm = 'true';
  document.head.appendChild(script);
}
