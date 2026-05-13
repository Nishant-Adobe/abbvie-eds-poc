# AbbVie EDS Block Development Prompts

---

## drcom-widget Block — X-Mod / Universal Editor Development Prompt

> **Purpose:** This prompt gives an AI coding agent (X-Mod / Amplify / Copilot) everything it needs to implement or reproduce the `drcom-widget` block end-to-end in the AbbVie EDS multi-brand project.

---

### CONTEXT & BACKGROUND

You are developing the **`drcom-widget`** block for an **AEM Edge Delivery Services (EDS)** project that supports multiple AbbVie pharmaceutical brand sites:

| Brand       | Body class   | Primary colour |
|-------------|-------------|----------------|
| AbbVie      | `.abbvie`   | `#071d49`      |
| BOTOX®      | `.botox`    | `#6b2fa0`      |
| RINVOQ®     | `.rinvoq`   | `#a50034`      |

The block integrates the **Doctor.com (Dr.com) physician/specialist directory finder** — a third-party custom element (`<directory-widget>`) loaded from:

```
https://widget.doctor.com/directory_v2/app.js
```

The widget accepts a `partner` attribute that identifies the brand's Dr.com account, plus an optional `api-env` attribute for staging/test environments.

---

### BLOCK FILE STRUCTURE

```
blocks/drcom-widget/
├── drcom-widget.js              ← Core decoration logic
├── drcom-widget.css             ← Base styles (spinner, layout, container queries)
├── _drcom-widget.json           ← Universal Editor (x-mod) component model
├── abbvie/
│   └── drcom-widget.css         ← AbbVie brand CSS override (navy #071d49)
├── botox/
│   └── drcom-widget.css         ← BOTOX® brand CSS override (purple #6b2fa0)
└── rinvoq/
    └── drcom-widget.css         ← RINVOQ® brand CSS override (crimson #a50034)
```

---

### FILE 1 — `blocks/drcom-widget/drcom-widget.js`

This is the **complete, production-ready JS** to use as-is:

```js
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
 *
 * UE data attributes take precedence over document-table rows.
 */
function readBlockFields(block) {
  const rows = [...block.querySelectorAll(':scope > div')];
  const getText = (row) => row?.querySelector('p')?.textContent.trim() || '';

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
```

**Key behaviours:**
- `readBlockFields()` checks `block.dataset.*` first (UE data attributes) then falls back to document-table `<p>` text — this dual-source pattern is required for UE + document authoring compatibility
- Script injection is guarded by `document.getElementById(SCRIPT_ID)` so it fires only once per page even if multiple instances exist
- `IntersectionObserver` with `threshold: 0.1` defers script load until the block is 10% visible
- Placeholder is removed either on the widget's `ready` event or after 8 s fallback

---

### FILE 2 — `blocks/drcom-widget/drcom-widget.css`

```css
/* =============================================================================
   drcom-widget — Base styles
   ============================================================================= */

.drcom-widget {
  container-type: inline-size;
  width: 100%;
}

/* Heading above the widget */
.drcom-widget .drcom-widget-heading {
  font-size: var(--heading-font-size-m, 1.5rem);
  font-weight: var(--font-weight-bold, 700);
  color: var(--color-heading, var(--text-color, #121212));
  margin-block-end: 1rem;
}

/* Widget custom element wrapper */
.drcom-widget directory-widget {
  display: block;
  width: 100%;
  min-height: 480px; /* prevent CLS while widget initialises */
}

/* =============================================================================
   Loading placeholder / spinner
   ============================================================================= */

.drcom-widget .drcom-widget-loading {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  min-height: 480px;
  background-color: var(--color-background-alt, #f5f5f5);
  border-radius: 4px;
}

/* Spinner using a pseudo-element — no extra markup required */
.drcom-widget .drcom-widget-loading::after {
  content: '';
  display: block;
  width: 48px;
  height: 48px;
  border-radius: 50%;
  border: 4px solid var(--color-border, #ccc);
  border-top-color: var(--color-brand-primary, #071d49);
  animation: drcom-spin 0.8s linear infinite;
}

@keyframes drcom-spin {
  to {
    transform: rotate(360deg);
  }
}

/* =============================================================================
   Error state (missing partner-id)
   ============================================================================= */

.drcom-widget .drcom-widget-error {
  padding: 1rem 1.25rem;
  background-color: #fff3cd;
  border: 1px solid #ffc107;
  border-radius: 4px;
  color: #664d03;
  font-size: var(--body-font-size-s, 0.875rem);
  font-weight: 500;
}

/* =============================================================================
   Responsive — container queries
   ============================================================================= */

/* Narrow container (< 480px) */
@container (max-width: 479px) {
  .drcom-widget .drcom-widget-heading {
    font-size: var(--heading-font-size-s, 1.25rem);
  }

  .drcom-widget directory-widget,
  .drcom-widget .drcom-widget-loading {
    min-height: 560px; /* taller on mobile as widget stacks vertically */
  }
}

/* Wide container (≥ 1024px) */
@container (min-width: 1024px) {
  .drcom-widget directory-widget,
  .drcom-widget .drcom-widget-loading {
    min-height: 420px;
  }
}
```

---

### FILE 3 — `blocks/drcom-widget/_drcom-widget.json`

This is the **Universal Editor component model** — create or replace this file exactly:

```json
{
  "definitions": [
    {
      "title": "Drcom Widget",
      "id": "drcom-widget",
      "plugins": {
        "xwalk": {
          "page": {
            "resourceType": "core/franklin/components/block/v1/block",
            "template": {
              "name": "Drcom Widget",
              "model": "drcom-widget"
            }
          }
        }
      }
    }
  ],
  "models": [
    {
      "id": "drcom-widget",
      "fields": [
        {
          "component": "text",
          "name": "heading",
          "label": "Heading",
          "valueType": "string",
          "required": false,
          "description": "Optional heading displayed above the widget (e.g. 'Find a Healthcare Provider')"
        },
        {
          "component": "text",
          "name": "partner-id",
          "label": "Partner ID",
          "valueType": "string",
          "required": true,
          "description": "The Doctor.com partner site ID (required). Provided by the Dr.com account team."
        },
        {
          "component": "select",
          "name": "api-env",
          "label": "API Environment",
          "valueType": "string",
          "required": false,
          "description": "Widget API environment. Use 'prod' for all live/published pages.",
          "options": [
            { "name": "Production", "value": "prod" },
            { "name": "Test / Staging", "value": "test" }
          ]
        }
      ]
    }
  ],
  "filters": []
}
```

> **Note:** The current file only has `partner-id`. You must **add** the `heading` and `api-env` fields as shown above.

---

### FILE 4 — `component-definition.json` (root level)

Add the following object to the `definitions` array. **Do not duplicate** if `"id": "drcom-widget"` already exists — update it instead.

```json
{
  "title": "Drcom Widget",
  "id": "drcom-widget",
  "plugins": {
    "xwalk": {
      "page": {
        "resourceType": "core/franklin/components/block/v1/block",
        "template": {
          "name": "Drcom Widget",
          "model": "drcom-widget"
        }
      }
    }
  }
}
```

---

### FILE 5 — `component-models.json` (root level)

Add the following object to the `models` array. **Do not duplicate** if `"id": "drcom-widget"` already exists — update it instead.

```json
{
  "id": "drcom-widget",
  "fields": [
    {
      "component": "text",
      "name": "heading",
      "label": "Heading",
      "valueType": "string",
      "required": false,
      "description": "Optional heading displayed above the widget"
    },
    {
      "component": "text",
      "name": "partner-id",
      "label": "Partner ID",
      "valueType": "string",
      "required": true,
      "description": "The Doctor.com partner site ID (required)"
    },
    {
      "component": "select",
      "name": "api-env",
      "label": "API Environment",
      "valueType": "string",
      "required": false,
      "description": "Widget API environment. Use 'prod' for all live/published pages.",
      "options": [
        { "name": "Production", "value": "prod" },
        { "name": "Test / Staging", "value": "test" }
      ]
    }
  ]
}
```

---

### FILE 6 — `component-filters.json` (root level)

Add `"drcom-widget"` to the `components` array of the `"section"` filter entry:

```json
{
  "id": "section",
  "components": [
    "...(all existing components)...",
    "drcom-widget"
  ]
}
```

---

### FILE 7 — Brand CSS Overrides

#### `blocks/drcom-widget/abbvie/drcom-widget.css`
```css
/* AbbVie corporate — navy primary colour */
.abbvie .drcom-widget .drcom-widget-heading {
  color: #071d49;
}

.abbvie .drcom-widget .drcom-widget-loading::after {
  border-top-color: #071d49;
}
```

#### `blocks/drcom-widget/botox/drcom-widget.css`
```css
/* BOTOX® — purple primary colour */
.botox .drcom-widget .drcom-widget-heading {
  color: #6b2fa0;
}

.botox .drcom-widget .drcom-widget-loading::after {
  border-top-color: #6b2fa0;
}
```

#### `blocks/drcom-widget/rinvoq/drcom-widget.css`
```css
/* RINVOQ® — crimson primary colour */
.rinvoq .drcom-widget .drcom-widget-heading {
  color: #a50034;
}

.rinvoq .drcom-widget .drcom-widget-loading::after {
  border-top-color: #a50034;
}
```

---

### HOW THE BLOCK WORKS END-TO-END

#### Universal Editor authoring flow
1. Author opens a page in the Universal Editor
2. Inserts **"Drcom Widget"** block from the component picker
3. The right-hand properties panel shows **3 editable fields**:
   - **Heading** *(text, optional)* — displayed as `<h2 class="drcom-widget-heading">` above the widget; e.g. "Find a Healthcare Provider"
   - **Partner ID** *(text, required)* — passed as the `partner` attribute on `<directory-widget>`; provided by the Dr.com account team
   - **API Environment** *(select: prod / test)* — controls whether the widget targets the production or staging Dr.com API
4. Author saves and previews/publishes the page

#### Runtime rendering flow
1. EDS serves the page; `drcom-widget.js` `decorate()` is called
2. `readBlockFields()` reads `block.dataset.*` (UE-injected) or falls back to document-table `<p>` text
3. If `partner-id` is missing → renders an amber warning `<p>` and exits
4. If `heading` is set → prepends `<h2 class="drcom-widget-heading">` to the block
5. Renders `<div class="drcom-widget-loading">` spinner placeholder
6. `IntersectionObserver` watches the block; when ≥10% visible → injects `<script src="https://widget.doctor.com/directory_v2/app.js" defer>` (once per page) and appends `<directory-widget partner="[id]">`
7. Placeholder removed when `<directory-widget>` emits `ready` event, or after 8 s fallback

#### Rendered DOM (published page)
```html
<div class="drcom-widget block" data-block-name="drcom-widget"
     data-partner-id="my-partner-id" data-heading="Find a Healthcare Provider" data-api-env="prod">
  <h2 class="drcom-widget-heading">Find a Healthcare Provider</h2>
  <directory-widget partner="my-partner-id"></directory-widget>
</div>
```

---

### DOCUMENT AUTHORING TABLE FORMAT (Google Docs / SharePoint)

For brands using document-based authoring (non-UE), the block table format is:

| drcom-widget |                              |
|--------------|------------------------------|
| `partner-id` | `my-partner-id`              |
| `heading`    | Find a Healthcare Provider   |

> Row order matters: Row 0 = `partner-id`, Row 1 = `heading`. The `api-env` defaults to `prod` and is only needed for test environments.

---

### BRAND USAGE REFERENCE

| Brand   | Example page URL                          | Heading text                   | Partner ID source |
|---------|-------------------------------------------|--------------------------------|-------------------|
| AbbVie  | `/en/find-a-healthcare-provider`          | Find a Healthcare Provider     | AbbVie Dr.com account |
| BOTOX®  | `/en/find-a-botox-specialist`             | Find a BOTOX® Specialist       | BOTOX Dr.com account  |
| RINVOQ® | `/en/find-a-doctor`                       | Find a Doctor                  | RINVOQ Dr.com account |

---

### ACCEPTANCE CRITERIA

- [ ] `blocks/drcom-widget/_drcom-widget.json` has **3 UE fields**: `heading` (text, optional), `partner-id` (text, required), `api-env` (select, optional)
- [ ] Root `component-models.json` includes a `drcom-widget` model entry with the same 3 fields
- [ ] Root `component-definition.json` includes a `drcom-widget` definition entry
- [ ] Root `component-filters.json` lists `"drcom-widget"` in the section `components` array
- [ ] `blocks/drcom-widget/abbvie/drcom-widget.css` exists and sets heading + spinner color to `#071d49`
- [ ] `blocks/drcom-widget/botox/drcom-widget.css` exists and sets heading + spinner color to `#6b2fa0`
- [ ] `blocks/drcom-widget/rinvoq/drcom-widget.css` exists and sets heading + spinner color to `#a50034`
- [ ] Block renders `<directory-widget partner="[id]">` when `partner-id` is set
- [ ] Block renders `<h2 class="drcom-widget-heading">` when `heading` is set
- [ ] Amber warning `<p class="drcom-widget-error">` shown when `partner-id` is missing
- [ ] Loading spinner shown while Dr.com script lazy-loads; removed on `ready` event or 8 s timeout
- [ ] Dr.com script `<script id="directory-widget">` injected only **once** per page regardless of how many instances exist
- [ ] No JS errors in browser console on page load
- [ ] `min-height` responsive: 560 px mobile (`< 480px`), 480 px default, 420 px desktop (`≥ 1024px`)
- [ ] Spinner `border-top-color` matches brand primary via brand CSS override file

---

### IMPORTANT IMPLEMENTATION NOTES

1. **`readBlockFields()` dual-source pattern** — always read `block.dataset.fieldName` first, fall back to `<p>` text content. This is the EDS standard for UE + document authoring compatibility. The dataset property name is camelCase (`partnerId`) but the HTML attribute is kebab-case (`data-partner-id`).

2. **Script singleton guard** — use `document.getElementById('directory-widget')` before injecting; never add the script twice.

3. **Do NOT use `loadScript()` from `aem.js`** for this block — the `IntersectionObserver` pattern with manual `<script>` injection gives more control over timing and deduplication.

4. **`api-env` attribute** — only set `widget.setAttribute('api-env', apiEnv)` when `apiEnv !== 'prod'`; the Dr.com widget defaults to production when the attribute is absent.

5. **Brand CSS files** — these are loaded automatically by the EDS multi-brand CSS pipeline when the brand class is present on `<body>`. No JS wiring is needed.

6. **Container queries** — the base CSS uses `container-type: inline-size` on `.drcom-widget` so `@container` queries are scoped to the block width, not the viewport. This is correct EDS practice.

---

*Generated by ACS Amplify Agent — AbbVie EDS POC*
