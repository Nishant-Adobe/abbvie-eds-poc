# Fix Form Section — Add "Please tell us about yourself" Heading

## Analysis

Looking at the live site screenshot, the form section (left side, beside the savings card image) shows:

1. **"Please tell us about yourself to help us send you the most relevant information."** — This heading text appears above the form fields on the left side
2. Below that are the form fields (First Name, Last Name, etc.)

The current migrated page only has the `embed-form` block in the left column — it's missing the heading text above the form. The live site shows this text as a prominent heading before the form fields begin.

## Current State (line 52-57)

The left column currently contains only the `embed-form` block with no introductory text.

## Required Change

Add the heading paragraph **before** the embed-form block inside the left column:
```html
<p><strong>Please tell us about yourself to help us send you the most relevant information.</strong></p>
```

## Checklist

- [ ] Add "Please tell us about yourself to help us send you the most relevant information." heading text above the embed-form block in the left column of `content/savings-card-hero.plain.html`
- [ ] Add the same heading in `content/savings-card/activate.plain.html`
- [ ] Verify md2jcr validation passes
- [ ] Preview to confirm text appears above form
