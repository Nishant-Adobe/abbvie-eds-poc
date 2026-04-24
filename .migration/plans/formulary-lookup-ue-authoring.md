# Formulary Lookup Block — Universal Editor Authoring Guide

## Prerequisites

- Access to the AEM Cloud Author instance at `author-p160552-e1944799.adobeaemcloud.com`
- The updated codebase (with the enhanced formulary-lookup block) must be deployed to the GitHub repo connected to this AEM environment
- Code sync must complete so the UE picks up the new `component-definition.json`, `component-models.json`, and `component-filters.json`

## Pre-Deployment Checklist

Before authoring, confirm the block code is live on the connected branch:

- [ ] Commit all formulary-lookup changes to the branch connected to this AEM environment
- [ ] Verify code sync completed (check the AEM code sync status or wait ~2 minutes after push)
- [ ] Confirm `formulary-lookup` appears in the Universal Editor block palette (see Step 2 below)

## Step-by-Step: Adding a Formulary Lookup Block

### Step 1 — Open a Page in the Universal Editor

1. Navigate to **Sites Console**: `https://author-p160552-e1944799.adobeaemcloud.com/ui#/aem/sites.html/content/abbvie-eds-poc`
2. Select the page where you want to add the formulary lookup (e.g., a coverage/access page)
3. Click **Edit** to open the page in the Universal Editor
4. The page opens in WYSIWYG mode with the content tree panel on the left

### Step 2 — Insert the Formulary Lookup Block

1. In the **Content Tree** (left panel), click on the **Section** where you want to place the block
2. Click the **+ (Add)** button at the insertion point within the section
3. In the **component picker dialog**, scroll or search for **"Formulary Lookup"**
   - If it does not appear, code sync has not completed — wait and refresh
4. Click **Formulary Lookup** to insert it into the section
5. The block appears in the page with its default empty state

### Step 3 — Configure the Variant

1. Click on the inserted **Formulary Lookup** block to select it
2. Open the **Properties panel** (right side rail) — the block's fields appear organized in tabs
3. On the **Content** tab, set the **Variant** dropdown:

| Variant Option | When to Use | Brand Examples |
|---|---|---|
| **Default (State Dropdown)** | Simple state-based coverage lookup; user picks a state, results appear | Mavyret HCP (state dropdown formulary) |
| **Dynamic (State + County)** | Two-step cascading lookup; state first, then county populates from API | SkyriziHCP, RinvoqHCP (Apigee HDS coverage) |
| **ZIP Code** | ZIP code input with submit button | Venclexta (financial support page) |

### Step 4 — Fill in Content Fields (Content Tab)

| Field | Required | Description | Example Value |
|---|---|---|---|
| **Variant** | Yes | Select the lookup mode | `Default (State Dropdown)` |
| **Heading** | Recommended | Block heading displayed above the form | `Check Your Insurance Coverage` |
| **Description** | Optional | Introductory text below the heading | `Select your state to view formulary coverage for SKYRIZI.` |
| **State Dropdown Label** | Yes (Default/Dynamic) | Label shown above the state dropdown | `Select your state` |
| **County Dropdown Label** | Yes (Dynamic only) | Label for the county dropdown | `Select your county` |
| **ZIP Code Input Label** | Yes (ZIP only) | Label above the ZIP input | `Enter your ZIP code` |
| **Submit Button Label** | Yes (ZIP only) | Text on the submit button | `Search` or `Look Up` |

### Step 5 — Fill in Configuration Fields (Configuration Tab)

Switch to the **Configuration** tab in the Properties panel:

| Field | Required | Description | Example Value |
|---|---|---|---|
| **API Endpoint** | Yes | The formulary lookup API URL. Query params added automatically by variant. | `https://api.abbvie.com/formulary/v1/lookup` |
| **reCAPTCHA Site Key** | Optional | Google reCAPTCHA v3 site key. If set, a token is sent with each API request. | `6Lc...your-site-key` |
| **Results Per Page** | Optional | Number of results per page in the table (default: 10) | `10` |
| **No Results Message** | Recommended | Message shown when API returns no matching plans | `No coverage information found for your selection.` |
| **Error Message** | Recommended | Message shown on API failure or network error | `Unable to retrieve coverage data. Please try again later.` |
| **Analytics ID** | Optional | Value for `data-analytics` attribute on the form action | `formulary-lookup-skyrizi-derm` |

### Step 6 — Common Properties Tab

Switch to the **Common Properties** tab:

| Field | Required | Description | Example Value |
|---|---|---|---|
| **ID** | Auto-generated | Unique block ID (must start with `id:`) | `id:formulary-coverage` |
| **Custom Class** | Optional | Additional CSS class for brand-specific styling | Leave empty unless instructed |

### Step 7 — Preview and Publish

1. Click **Preview** in the Universal Editor toolbar to test the block
2. Verify:
   - The correct variant renders (state dropdown, state+county, or ZIP input)
   - All authored labels and messages display correctly
   - Selecting a state / entering a ZIP triggers the API call
   - Results appear in a paginated table
   - Error/no-results messages display when appropriate
3. When satisfied, use **Publish** to push the page live

## Brand-Specific Configuration Reference

Use these API and configuration values per brand site:

### SkyriziHCP (`skyrizihcp.com/*/coverage-access`)
- **Variant**: `Dynamic (State + County)`
- **API Endpoint**: Apigee HDS formulary endpoint (obtain from SkyriziHCP brand team)
- **reCAPTCHA Site Key**: From `window.AbbViePageInfo.recaptchaSiteKey` in existing site
- **Heading**: `Check Your Insurance Coverage`
- **Analytics ID**: `formulary-lookup-skyrizi-derm`

### RinvoqHCP (`rinvoqhcp.com/dermatology/access`)
- **Variant**: `Dynamic (State + County)`
- **API Endpoint**: Apigee HDS formulary endpoint (obtain from RinvoqHCP brand team)
- **reCAPTCHA Site Key**: From existing site config
- **Heading**: `Coverage & Access`
- **Analytics ID**: `formulary-lookup-rinvoq-hcp`

### Venclexta (`venclexta.com/*/financial-and-treatment-support`)
- **Variant**: `Default (State Dropdown)` or `ZIP Code` (depending on page section)
- **API Endpoint**: Venclexta formulary API (obtain from Venclexta brand team)
- **Heading**: `Financial Support Lookup`
- **Analytics ID**: `formulary-lookup-venclexta`

### Mavyret HCP (`mavyret.com/hcp/access`)
- **Variant**: `Default (State Dropdown)`
- **API Endpoint**: Mavyret state-based formulary API
- **Heading**: `Formulary Coverage by State`
- **Description**: `Select a state to view Medicaid and commercial plan coverage.`
- **Results Per Page**: `10`
- **Analytics ID**: `formulary-lookup-mavyret-hcp`

## How the API Integration Works

The block appends query parameters based on the selected variant:

| Variant | API Call Format |
|---|---|
| Default | `{api}?state=CA` |
| Dynamic (state selected) | `{api}?state=CA&list=counties` → returns county list |
| Dynamic (county selected) | `{api}?state=CA&county=Los+Angeles` → returns plan results |
| ZIP Code | `{api}?zip=90210` |

The API must return JSON in one of these shapes:
```json
{ "plans": [{ "name": "Plan Name", "tier": "1", "detail": "Covered" }] }
{ "results": [{ "name": "Plan Name", "tier": "2", "detail": "Prior Auth Required" }] }
```

For the **Dynamic** variant's county fetch, the API must return:
```json
{ "counties": ["Los Angeles", "San Francisco", "San Diego"] }
```

If **reCAPTCHA Site Key** is provided, the block sends an `x-recaptcha-token` HTTP header with each API request. The backend must validate this token.

## Troubleshooting

| Issue | Cause | Fix |
|---|---|---|
| Block not in component picker | Code sync incomplete | Wait 2 min after push; refresh UE |
| Block renders but no dropdown/input | Wrong variant selected | Check the Variant field in Properties |
| "Lookup not configured" error | API Endpoint field empty | Enter the API URL in Configuration tab |
| API returns results but table empty | API response shape mismatch | API must return `plans` or `results` array with `name`, `tier`, `detail` keys |
| reCAPTCHA errors in console | Invalid site key | Verify the reCAPTCHA v3 site key matches the domain |
| County dropdown stays disabled | County API returns empty | Check API returns `counties` array for `?state=XX&list=counties` |

## Checklist — Authoring Workflow

- [ ] Ensure latest code is deployed and code sync is complete
- [ ] Open target page in Universal Editor from Sites Console
- [ ] Insert Formulary Lookup block into the appropriate section
- [ ] Select the correct **Variant** for the brand/page context
- [ ] Fill in **Heading** and **Description** with brand-approved copy
- [ ] Set the appropriate **label fields** for the chosen variant
- [ ] Enter the **API Endpoint** URL from the brand team
- [ ] Enter **reCAPTCHA Site Key** if the API requires it
- [ ] Set **Results Per Page** (default 10 is usually fine)
- [ ] Author **No Results** and **Error** messages with brand-approved copy
- [ ] Set **Analytics ID** following the brand's naming convention
- [ ] Preview the page and test all interactive states
- [ ] Verify results table renders and pagination works with real API data
- [ ] Publish the page
