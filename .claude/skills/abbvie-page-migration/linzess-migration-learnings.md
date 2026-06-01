# Linzess Migration Learnings (2026-06-01)

Supplementary reference for the `abbvie-page-migration` skill, documenting
critical lessons from the Linzess DTC 11-page migration.

---

## Critical: md2jcr Row Mapping for xwalk

The `.plain.html` → md2jcr pipeline for xwalk projects requires **exact** field-to-row alignment. These rules MUST be followed:

### Fields that become rows:
- `text`, `richtext`, `reference`, `aem-content`, `boolean`, `number`, non-classes `select`

### Fields that do NOT become rows:
- `tab` — UI markers only
- `classes` (multiselect) — goes in block `class=""` attribute
- `classes_*` (any field with this prefix) — goes in class attribute
- Example: `classes_textAlign`, `classes_textColor`, `classes_variant`, `classes_theme`

### Special row formats:
- `blockId` → emit as `id:VALUE`
- `language` → emit as `lang:VALUE`

### Validation formula:
```
row_count = total_fields - tab_fields - classes_*_fields
```

---

## Hero Block — Correct Format (8 rows)

From working UE-authored `/linzess/hero.plain.html`:

```html
<div class="hero no-padding text-left linzess-behind-nav-linzess-cta-hero">
  <div><div><picture><img src="..." alt=""></picture></div></div>  <!-- image -->
  <div><div></div></div>                                           <!-- imageAlt -->
  <div><div></div></div>                                           <!-- mobileImage -->
  <div><div></div></div>                                           <!-- mobileImageAlt -->
  <div><div><p>eyebrow</p><h1>heading</h1><p>body</p><p><a>CTA</a></p></div></div>  <!-- text (richtext) -->
  <div><div></div></div>                                           <!-- indication -->
  <div><div></div></div>                                           <!-- video -->
  <div><div>Actor portrayal</div></div>                            <!-- imageCaption -->
</div>
```

**Key insights:**
- Variants (`no-padding`, `text-left`, `linzess-behind-nav-linzess-cta-hero`) go in class attr
- `eyebrow` is folded INTO the `text` richtext field as the first `<p>`
- `layers`, `textAlign`, `textColor`, `customClass` are all `classes_*` → NOT rows
- Total: 8 rows for 8 non-classes non-tab fields

---

## Safety Bar — Correct Format (3 rows)

```html
<div class="safety-bar split">
  <div><div><!-- collapsedContent: USES section --></div></div>
  <div><div><!-- collapsedContentCol2: empty or RISK INFO summary --></div></div>
  <div><div><!-- expandedContent: full ISI --></div></div>
</div>
```

**Key insights:**
- `split` variant goes in class attr (for two-column collapsed layout)
- Live site shows USES left + IMPORTANT RISK INFO right = split variant
- Verbatim ISI from live DOM — zero changes (pharma compliance)
- `<sup>®</sup>` must stay inline in `<p>` (md2jcr can break it into separate elements)

---

## Carousel Video Playlist — Correct Format (8 config + 7-cell items)

```html
<div class="carousel-video-playlist">
  <div><div></div></div>          <!-- sectionHeading -->
  <div><div></div></div>          <!-- sectionDescription -->
  <div><div>0</div></div>         <!-- maxVisible -->
  <div><div>1029485116001</div></div>  <!-- accountId -->
  <div><div></div></div>          <!-- playlistId -->
  <div><div>Mcp9TXMkPT</div></div>    <!-- playerId -->
  <div><div>false</div></div>     <!-- playMode -->
  <div><div></div></div>          <!-- empty -->
  <!-- Item rows: 7 cells each -->
  <div>
    <div>VIDEO_ID</div>
    <div>TITLE</div>
    <div>TRANSCRIPT_URL</div>
    <div></div>
    <div>PATIENT_NAME</div>
    <div>CONDITION</div>
    <div>QUOTE</div>
  </div>
</div>
```

---

## Columns — Correct Format (2 config + 3-cell items)

```html
<div class="columns">
  <div><div></div></div>  <!-- classes (select, NOT classes_*) -->
  <div><div></div></div>  <!-- anchorId -->
  <!-- Item rows: 3 cells each (content, image, imageAlt) -->
  <div>
    <div><p>text content + CTA links</p></div>
    <div><picture><img src="..."></picture></div>
    <div></div>
  </div>
</div>
```

---

## Section Metadata

**MUST be the LAST element** in a section `<div>`:
```html
<div>
  <!-- section content here -->
  <div class="section-metadata">
    <div><div>style</div><div>dark</div></div>
  </div>
</div>
```

If placed at the start, EDS won't process it.

---

## Content Delivery Issues

1. **fstab.yaml** determines content delivery path. Branch in URL uses CODE from that branch but CONTENT from the fstab path.
2. **Publishing** from UE is required for `*.aem.page` — content in JCR doesn't auto-appear at CDN.
3. **Bulk metadata** at `/metadata.json` handles `brand`, `nav`, `footer` routing — don't put metadata div in content.
4. **Images** using external source URLs (linzess.com/content/dam/) will 404 — must upload to project DAM.

---

## What's Needed for 95% Match

After content is correctly authored (using above formats), these are the remaining gaps:

| Issue | Fix Location | Effort |
|---|---|---|
| Hero background image | Upload to DAM, set in UE | Low |
| Column card images | Upload to DAM, set in UE | Low |
| Safety-bar split layout | Set variant in UE properties | Low |
| Safety-bar floating position | Block JS should handle — verify decoration | Medium |
| Dark section background | section-metadata at END of section | Low (done) |
| Button variants (outlined) | Set in UE block properties | Low |
| Font loading for Bebas Neue | Verify fonts.css includes all needed weights | Low |
| Video thumbnails from Brightcove | Automatic via Brightcove API | None |
| Responsive layout at 390px | Brand CSS partials if needed | Medium |
| Header nav structure | Already authored in /linzess/nav | Low |
| Footer links | Already authored in /linzess/footer | Low |

**Estimated effort to reach 95%:** ~2 hours of UE authoring (images, variants, properties) + ~1 hour CSS fixes if needed.

---

## Workflow for 95% Match (using PR #83 skills)

1. **Use `aemcoder-migration-orchestrator`** — it executes directly in UE
2. **Per section:** apply `aemcoder-section-fix-loop` (8-step diff → fix cycle)
3. **For ISI:** `pharma-content-fidelity` ensures verbatim compliance
4. **Block fit:** reference `abbvie-page-templates` for canonical composition
5. **Row mapping:** reference `abbvie-block-analysis` for exact field structure
6. **CSS fixes:** `building-brand-blocks` for `_*.css` partials only

The key shift from our failed approach: **don't import via .plain.html** for complex blocks. Instead, use UE to author hero/accordion/CTA blocks directly. Only use .plain.html import for simple blocks (carousel-video-playlist, safety-bar, columns with exact field counts).
