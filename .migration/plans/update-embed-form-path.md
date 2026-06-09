# Update Embed-Form Path Plan

## Context

The user provided a `data-cmp-adaptiveformcontainer-path` attribute from the live site's AEM adaptive form radio button component:

```
/abbviecloud/content/forms/af/admp/linzess/allergan-common-savings-card-forms/2023-privacy-update/linzess-savings-program/jcr:content/guideContainer
```

The current embed-form block references:
```
/content/forms/af/admp/linzess/allergan-common-savings-card-forms/2023-privacy-update/linzess-savings-program.html
```

The correct path prefix for the AbbVie Cloud forms is `/abbviecloud/content/forms/...` (without the `/jcr:content/guideContainer` suffix and with `.html` extension).

## Updated Path

```
/abbviecloud/content/forms/af/admp/linzess/allergan-common-savings-card-forms/2023-privacy-update/linzess-savings-program.html
```

## Files to Update

1. `content/savings-card-hero.plain.html` (line 55)
2. `content/savings-card/activate.plain.html` (same embed-form block)

## Checklist

- [ ] Update embed-form path in `content/savings-card-hero.plain.html`
- [ ] Update embed-form path in `content/savings-card/activate.plain.html`
- [ ] Run md2jcr validation on both files
- [ ] Verify preview loads correctly
