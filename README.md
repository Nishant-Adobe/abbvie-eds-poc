# EDS Multibrand boilerplate
EDS Multibrand is an innovative starter project that extends the Adobe AEM Boilerplate to provide comprehensive multi-brand support within a single AEM project.

## Environments
- Preview: https://main--eds-multi-brand--acs-ui.aem.page/
- Live: https://main--eds-multi-brand--acs-ui.aem.live/

### Agent Branches
| Branch | Purpose |
|--------|---------|
| [`ema-skills`](https://github.com/ACS-UI/eds-multi-brand/tree/ema-skills) | Skills for Experience Modernization Agent (EMA) — brand, theme, and brand-block support |
| [`agent-skills`](https://github.com/ACS-UI/eds-multi-brand/tree/agent-skills) | Skills + slash command library for coding agents (Claude Code, Cursor, etc.) |

## Documentation

### EDS Multibrand Project Documentation

📚 **[View Full Documentation](https://acs-ui.github.io/eds-multi-brand-docs/)**

Our comprehensive documentation covers:
- Getting started with EDS Multi-Brand
- Theme and brand management
- Block development
- Troubleshooting guide

### AEM Documentation

Before using the aem-boilerplate, we recommand you to go through the documentation on https://www.aem.live/docs/ and more specifically:
1. [Developer Tutorial](https://www.aem.live/developer/tutorial)
2. [The Anatomy of a Project](https://www.aem.live/developer/anatomy-of-a-project)
3. [Web Performance](https://www.aem.live/developer/keeping-it-100)
4. [Markup, Sections, Blocks, and Auto Blocking](https://www.aem.live/developer/markup-sections-blocks)

### Documentation Testing

The project includes automated documentation testing via GitHub Actions:

- **Trigger**: Pull requests with changes to `docs/` files
- **Scope**: Documentation-only validation
  - ✅ Documentation linting and type checking
  - ✅ Build verification
  - ✅ Internal documentation link validation (port 3030)
  - ❌ No application link validation (excludes port 3000)
- **Deployment**: Automatic deployment to GitHub Pages on merge to main

For detailed deployment rules, see [DEPLOYMENT-RULES.md](.github/workflows/DEPLOYMENT-RULES.md).

## Installation

```sh
npm i
```

## Start Dev Server

Start eds server and and serve merged CSS
```
npm start
```

## Theme Management

### Initiate new Brand Theme
Setup dev environment for a new brand theme
```
npm run scaffold:create
```

### Remove Brand Theme
Remove unwanted brand theme
```
npm run scaffold:remove
```

### Start Theme

Starts Gulp server to generate and serve merged CSS

```
npm run scaffold:start
```

### Build Theme

Generate and serve merged CSS

Configure BRANDS .env 
 BRANDS=brand1,brand2,brand3

```
npm run scaffold:build
```

## Environment Proxy
setup .env file to point to specific pages url

```
AEM_OPEN=/en/
AEM_PORT=3000
AEM_PAGES_URL=https://main--eds-multi-brand--acs-ui.aem.page/
```

## Linting

```sh
npm run lint
```

## Local development

1. Create a new repository based on the `aem-boilerplate` template and add a mountpoint in the `fstab.yaml`
2. Add the [AEM Code Sync GitHub App](https://github.com/apps/aem-code-sync) to the repository
3. Install the [AEM CLI](https://github.com/adobe/helix-cli): `npm install -g @adobe/aem-cli`
4. Start theme server and AEM Proxy: `npm start` (opens your browser at `http://localhost:3000`)
5. Open the `{repo}` directory in your favorite IDE and start coding :).

---

## AI Agent Support

This project is set up for AI-assisted development and works with most AI coding agents including EMA, [Claude Code](https://claude.ai/code), [Cursor](https://cursor.com), and others. Skills, agents, and slash commands are pre-configured to accelerate common workflows across these environments.

### Branches

Two dedicated branches provide agent-ready configurations for different use cases:

#### [`ema-skills`](https://github.com/ACS-UI/eds-multi-brand/tree/ema-skills) — Experience Modernization Agent (EMA)

Use this branch when working with the [Experience Modernization Agent (EMA)](https://www.aem.live/). It includes a focused set of skills that extend EMA with multi-brand structure support:

- Brand creation and configuration
- Theme creation and management
- Brand-level block creation and overrides

These skills enable EMA to scaffold, migrate, and style sites that follow the EDS Multi-Brand hierarchy.

#### EMA Prompt Workflow & Steps

> **Before you start:** Send the following instruction to the agent **once at the beginning of your session**, before running any prompts below. This loads the `building-brand-blocks` skill and ensures all block styling and migration work conforms to the project's CSS scoping, design token, naming, and JS decoration standards. This only needs to be sent once per session — not before every prompt.
> ```
> Load and follow the building-brand-blocks skill from .claude/skills/building-brand-blocks/SKILL.md for all block styling and CSS/JS work in this session.
> ```

**Base Site Migration**

Steps to onboard a new site at the root:

**Extract Design Tokens**
```
Extract theme-level style guide, tokens, and other style information from {{page url}}, following the W3C design token standard and conventions.
```

**Header and Footer Migration**
```
Migrate the header and footer blocks from {{page url}}, mapping style values using the design tokens from the theme.
```

**Header Styling**
```
Style the header and update its content to match the site, using the design tokens from the theme to map style values.
```
> _(Optional)_ Take a node screenshot from DevTools and attach it to the agent chat.
```
Refine the header styles based on the screenshot, using the design tokens from the theme to map style values.
```

**Footer Styling**
```
Style the footer and update its content to match the site, using the design tokens from the theme to map style values.
```
> _(Optional)_ Take a node screenshot from DevTools and attach it to the agent chat.
```
Refine the footer styles based on the screenshot, using the design tokens from the theme to map style values.
```

**Page Migration**
```
Migrate the page at {{page url}}, creating pages under root/, and map style values using the design tokens from the theme.
```
```
Style the blocks and update the content to match the site, using the design tokens from the theme to map style values.
```
> _(Optional)_ Take a node screenshot from DevTools and attach it to the agent chat.
```
Refine the page block styles based on the screenshot, using the design tokens from the theme to map style values.
```

---

**Brand Site Migration**

Steps to onboard a new site — each site is treated as a brand:

**Create a Brand**
```
Create a brand {{brand name}}.
```

**Extract Design Tokens**
```
Extract theme-level style guide, tokens, and other style information for {{brand name}} from {{page url}}, following the W3C design token standard and conventions.
```

**Header and Footer Migration**
```
Migrate the header and footer blocks from {{page url}} for {{brand name}}, creating content under the {{brand name}}/ hierarchy and mapping style values using the {{brand name}} theme design tokens.
```

**Header Styling**
```
Style the header and update its content to match the site, using the {{brand name}} theme design tokens to map style values.
```
> _(Optional)_ Take a node screenshot from DevTools and attach it to the agent chat.
```
Refine the header styles based on the screenshot, using the {{brand name}} theme design tokens to map style values.
```

**Footer Styling**
```
Style the footer and update its content to match the site, using the {{brand name}} theme design tokens to map style values.
```
> _(Optional)_ Take a node screenshot from DevTools and attach it to the agent chat.
```
Refine the footer styles based on the screenshot, using the {{brand name}} theme design tokens to map style values.
```

**Page Migration**
```
Migrate the page at {{page url}} for {{brand name}}, creating pages under the {{brand name}}/ hierarchy and mapping style values using the design tokens from the theme.
```
```
Style the blocks and update the content to match the site, using the {{brand name}} theme design tokens to map style values.
```
> _(Optional)_ Take a node screenshot from DevTools and attach it to the agent chat.
```
Refine the page block styles based on the screenshot, using the {{brand name}} theme design tokens to map style values.
```

#### [`agent-skills`](https://github.com/ACS-UI/eds-multi-brand/tree/agent-skills) — Coding Agents (Claude Code, Cursor, and others)

Use this branch when working with general-purpose coding agents. It includes:

- All skills from the [adobe/skills EDS repository](https://github.com/adobe/skills/tree/main/plugins/aem/edge-delivery-services/skills)
- Brand, theme, and brand-block creation skills for multi-brand structure support
- A **commands / prompt library** (`.claude/commands/`) providing slash commands for Claude Code, Cursor, and compatible agents

The prompt library ensures consistent output and a better developer experience when running commands like `/eds-migrate-page` or `/eds-style-brand-page` directly from the agent chat.

### Skills

Skills are step-by-step workflow guides stored in `.skills/`. Claude Code reads and follows them to perform complex tasks consistently.

> Source: [adobe/skills — EDS Skills](https://github.com/adobe/skills/tree/main/plugins/aem/edge-delivery-services/skills)

| Skill | Description |
|-------|-------------|
| `content-driven-development` | Apply a Content Driven Development process to AEM EDS. **Start here for all block tasks.** |
| `building-blocks` | Create new or modify existing AEM EDS blocks (JS, CSS, content model). |
| `building-brand-blocks` | Create/modify blocks with full brand and theme hierarchy support (multi-brand project). |
| `building-brand` | End-to-end guide for creating, configuring, and removing a brand (scaffold, tokens, fonts, overrides). |
| `building-themes` | Create/configure/manage brands and themes, including `brand-config.json` and the CSS build pipeline. |
| `testing-blocks` | Validate code changes before opening a PR — unit tests, browser tests, linting, performance. |
| `ue-component-model` | Create or edit Universal Editor component config (`component-definition.json`, `component-models.json`, `component-filters.json`). |
| `content-modeling` | Design effective content models for new or updated blocks. |
| `page-import` | Import a webpage from any URL to structured AEM EDS HTML (also triggered by "migrate"). |
| `page-decomposition` | Analyze section content sequences and identify block boundaries for import. |
| `identify-page-structure` | Identify section boundaries within a scraped page for import/migration. |
| `authoring-analysis` | Analyze content sequences and determine default content vs blocks; validates block selection. |
| `generate-import-html` | Generate structured HTML from authoring analysis for AEM EDS. |
| `preview-import` | Preview and verify imported content against the original page in the local dev server. |
| `scrape-webpage` | Scrape a webpage, extract metadata, download images, and prepare for import. |
| `block-inventory` | Survey available blocks from the local project and Block Collection. |
| `block-collection-and-party` | Find reference blocks from the AEM Block Collection / Block Party to use as a starting point. |
| `figma-implement-design` | Translate Figma nodes into production-ready code with 1:1 visual fidelity (requires Figma MCP). |
| `docs-search` | Search aem.live documentation when web search isn't returning relevant results. |

### Supported Agents

The following Claude Code agent types are supported via the `.agents/` directory:

| Agent | Purpose |
|-------|---------|
| `discover-skills` | Lists all available skills with names and descriptions — run at the start of a new conversation to orient the agent. |

### Available Commands (Slash Commands)

Slash commands are shortcuts for common workflows. They are supported in Claude Code, Cursor, and other agents that recognize `/command-name` syntax. Arguments are passed as `key=value` pairs after the command name.

#### Page Migration

| Command | Arguments | Description |
|---------|-----------|-------------|
| `/eds-migrate-page` | `url=<page_url>` | Migrate a full page from a URL to AEM EDS HTML. Scrapes, analyzes, and generates structured content. |
| `/eds-migrate-header-footer` | `url=<page_url>` | Migrate only the header and footer from a page URL. |
| `/eds-migrate-brand-page` | `brand=<name>` `url=<page_url>` | Migrate a full page and apply brand-specific design tokens and overrides. |
| `/eds-migrate-brand-header-footer` | `brand=<name>` `url=<page_url>` | Migrate the header and footer for a specific brand. |

#### Styling

| Command | Arguments | Description |
|---------|-----------|-------------|
| `/eds-style-page` | `url=<page_url>` | Style all blocks on a page using design tokens extracted from the URL. |
| `/eds-style-header` | `url=<page_url>` | Style the header block for the given page. |
| `/eds-style-footer` | `url=<page_url>` | Style the footer block for the given page. |
| `/eds-style-brand-page` | `brand=<name>` `url=<page_url>` | Style all blocks for a specific brand using brand design tokens. |
| `/eds-style-brand-header` | `brand=<name>` `url=<page_url>` | Style the header block for a specific brand. |
| `/eds-style-brand-footer` | `brand=<name>` `url=<page_url>` | Style the footer block for a specific brand. |

#### Design Tokens

| Command | Arguments | Description |
|---------|-----------|-------------|
| `/eds-extract-design-tokens` | `url=<page_url>` | Extract global design tokens (colors, typography, spacing) from a page URL. |
| `/eds-extract-brand-design-tokens` | `brand=<name>` `url=<page_url>` | Extract and map design tokens for a specific brand. |

#### Brand

| Command | Arguments | Description |
|---------|-----------|-------------|
| `/eds-create-brand` | `brand=<name>` | Scaffold a new brand — creates directory structure, tokens, fonts, and config entries. |

#### Screenshot & Refinement

| Command | Arguments | Description |
|---------|-----------|-------------|
| `/eds-capture-screenshots` | _(user action)_ | Capture screenshots of the current page state for comparison or refinement. |
| `/eds-refine-page-from-screenshot` | _(screenshot)_ | Refine page block styles based on a screenshot comparison. |
| `/eds-refine-header-from-screenshot` | _(screenshot)_ | Refine the header using a screenshot. |
| `/eds-refine-footer-from-screenshot` | _(screenshot)_ | Refine the footer using a screenshot. |
| `/eds-refine-brand-page-from-screenshot` | _(screenshot)_ | Refine brand page styles using a screenshot. |
| `/eds-refine-brand-header-from-screenshot` | _(screenshot)_ | Refine the brand header using a screenshot. |
| `/eds-refine-brand-footer-from-screenshot` | _(screenshot)_ | Refine the brand footer using a screenshot. |

#### How to Use Slash Commands

1. Open your AI agent (Claude Code, Cursor, or similar) in your terminal or IDE.
2. Type `/` followed by the command name, e.g. `/eds-migrate-page`.
3. Pass arguments inline: `/eds-style-brand-page brand=acme url=https://example.com/en/`.
4. If a required argument is missing, the agent will prompt you for it before proceeding.
5. Commands chain into skills automatically — no manual skill invocation needed.
