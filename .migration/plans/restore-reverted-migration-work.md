# Reconstruct All Changes from Chat History

## Summary of Work to Reconstruct

Based on the full chat history, the following was completed before the revert:

### 1. Migration Infrastructure
- `.migration/project.json` — xwalk project type config
- `tools/importer/page-templates.json` — 2 templates with block mappings
- `tools/importer/parsers/accordion.js` — Accordion parser (14 config rows + 7-col items)
- `tools/importer/parsers/form.js` — Form parser
- `tools/importer/transformers/linzess-cleanup.js` — DOM cleanup transformer
- `tools/importer/transformers/linzess-sections.js` — Section breaks transformer
- `tools/importer/import-savings-card-landing.js` — Landing page import script
- `tools/importer/import-savings-card-subpage.js` — Subpage import script
- `tools/importer/urls-savings-card-landing.txt`
- `tools/importer/urls-savings-card-subpage.txt`
- `migration-work/` — Analysis artifacts (metadata, cleaned HTML, images, etc.)

### 2. New Blocks
- `blocks/callout/callout.js` + `callout.css` + `_callout.json`
- `blocks/steps/steps.js` + `steps.css`

### 3. Modified CSS Files
- `blocks/hero/linzess/hero.css` — Added split.dual-cta button styling
- `blocks/footer/linzess/footer.css` — Added `.footer p a` color:inherit fix
- `styles/linzess/themes.css` — Typography overrides (H1 32px, H2 24px Lato, ISI styles)
- `styles/styles.css` — Added utility-bar, dark-purple, page-title, white-arc, form fields, radio, reCAPTCHA, CTA buttons, ISI spacing/PDF icons, 60/40 columns, H2/ISI overrides

### 4. Content Files
- `content/savings-card-hero.plain.html` — Full redesigned page (8 rows hero, 14+7col accordions, form section, all ISI content)

### 5. Component Registration
- `component-definition.json` — Added Callout block
- `component-models.json` — Added callout model
- `component-filters.json` — Added callout to section filter

## Checklist

- [ ] Create .migration/project.json
- [ ] Create blocks/callout/ (JS + CSS + model JSON)
- [ ] Create blocks/steps/ (JS + CSS)
- [ ] Modify blocks/hero/linzess/hero.css (split.dual-cta buttons)
- [ ] Modify blocks/footer/linzess/footer.css (p a color fix)
- [ ] Modify styles/linzess/themes.css (typography + ISI)
- [ ] Modify styles/styles.css (all section styles appended)
- [ ] Create content/savings-card-hero.plain.html
- [ ] Create tools/importer/ infrastructure (parsers, transformers, scripts, URLs)
- [ ] Create migration-work/ artifacts
- [ ] Update component-definition.json (add Callout)
- [ ] Update component-models.json (add callout model)
- [ ] Update component-filters.json (add callout to section)
- [ ] Verify page renders at localhost:3000
- [ ] Run npm run build:json to validate

---

> **Ready for execution.** Proceeding with full reconstruction now.
