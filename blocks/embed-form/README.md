# Embed Form Block

Embeds an AEM Adaptive Form (AEM Forms Cloud Service) into an EDS page. Fetches form HTML via native `fetch()` and injects it into the DOM, with an iframe fallback when CORS blocks the request.

## Usage

### Document-based authoring

```html
<div class="embed-form">
  <div>
    <div><a href="/content/forms/af/myform">Form Link</a></div>
  </div>
  <div>
    <div>title</div>
    <div>Sign Up Form</div>
  </div>
  <div>
    <div>anchorId</div>
    <div>signup</div>
  </div>
</div>
```

### Universal Editor

The block uses the `aem-content` picker for the form link. Authors select the form from the content browser.

## Configuration

### Site config (ab-config.json)

The block requires `aemPublishUrl` in your site config:

```json
{
  "data": [
    { "key": "aemPublishUrl", "value": "https://publish-pXXXXX-eYYYYYY.adobeaemcloud.com" }
  ]
}
```

### Block fields

| Field | Required | Description |
|-------|----------|-------------|
| `formLink` | Yes | Path to the AEM Adaptive Form (e.g., `/content/forms/af/brand/formname`) |
| `title` | No | Accessibility label set as `aria-label` on the form element |
| `anchorId` | No | Sets `block.id` for in-page anchor linking |

## Modes

1. **Fetch mode** (default) — fetches form HTML, rewrites resource URLs to AEM host, re-executes scripts, sets `data-cmp-context-path` for AF runtime
2. **Iframe mode** (fallback) — renders form in a responsive iframe when fetch fails (CORS, network error)

## Cross-Domain (CORS) Requirements

The fetch to AEM publish will fail without CORS. Configure the AEM publish instance:

```
alloworigin: ["https://your-eds-domain.com", "https://main--repo--org.aem.live"]
allowedpaths: ["/content/forms/af/.*"]
supportedmethods: ["GET", "POST"]
```

If CORS is not configured, the block automatically falls back to iframe mode.

## jQuery

This block does NOT use jQuery. It uses native `fetch()` for form retrieval. If the AEM Adaptive Forms runtime clientlibs require jQuery at execution time, the form may need jQuery loaded separately (e.g., via `scripts.js` or a delayed load). Monitor browser console for `$ is not defined` errors after form injection.

## Events

| Event | When | Detail |
|-------|------|--------|
| `adaptiveform:loaded` | Form injected (fetch or iframe) | `{ finalFormPath, container, mode }` |
| `adaptiveform:error` | Fetch failed (before iframe fallback) | `{ finalFormPath, error, container }` |

```javascript
document.addEventListener('adaptiveform:loaded', ({ detail }) => {
  console.log('Form loaded via', detail.mode);
});

document.addEventListener('adaptiveform:error', ({ detail }) => {
  console.warn('Fetch failed, using iframe:', detail.error);
});
```