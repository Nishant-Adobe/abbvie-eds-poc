# EDS Multi-Brand Project

## Custom Skill Selection Guide

**CRITICAL: When user requests match these patterns, invoke the corresponding skill immediately.**

### Brand Creation/Management Tasks
**Skill:** `building-brand`

**Trigger Patterns:**
- User says: "add brand", "create brand", "new brand", "setup brand", "configure brand", "remove brand", "delete brand"
- Combined with: brand names, identity, tokens, design tokens, fonts, colors
- Examples:
  - "add a new brand called roy"
  - "create brand identity for acme"
  - "setup a new brand"
  - "remove brand roy"
  - "configure brand tokens"
  - "add brand fonts"

### Block Development with Brand/Theme Support
**Skill:** `building-brand-blocks`

**Trigger Patterns:**
- User says: "create block", "build block", "implement block", "modify block", "new block", "block override", "block CSS"
- Combined with: brand, theme, multi-brand, override, variant, decoration, block-config
- Examples:
  - "create a new hero block with brand support"
  - "add brand override for the cards block"
  - "implement block-level CSS for roy brand"
  - "modify the tabs block decoration"
  - "add theme override CSS for the hero block"
  - "create a new block for the brand"

### Theme Creation/Management Tasks
**Skill:** `building-themes`

**Trigger Patterns:**
- User says: "add theme", "create theme", "new theme", "setup theme", "configure theme", "remove theme", "dark theme", "bright theme"
- Combined with: tokens, styles, CSS, override, variant
- Examples:
  - "add a dark theme"
  - "create a new theme called bright"
  - "configure theme tokens"
  - "add theme override styles"
  - "setup a new theme for brand roy"
  - "remove theme bright"
  - "customize theme colors"

### Quick Reference

| Task Pattern | Skill | Purpose |
|---|---|---|
| "Add/create/remove brand", "brand tokens", "brand fonts" | `building-brand` | Full brand lifecycle: scaffold, tokens, fonts, styles, removal |
| "Create/modify block", "block override", "brand block CSS" | `building-brand-blocks` | Block development with multi-brand/theme CSS cascade |
| "Add/create/remove theme", "theme tokens", "dark/bright theme" | `building-themes` | Theme lifecycle: scaffold, tokens, styles, cross-brand themes |
