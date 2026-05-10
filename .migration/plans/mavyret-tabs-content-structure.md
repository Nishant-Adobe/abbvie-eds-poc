# Mavyret Tabs — Factoid Styling Plan

## Current Authored Structure (from screenshot)

Content tree shows:
```
Cure Rates (section)
├── Text Container
│   └── Text Container Text: "Acute HCV1,2"
│   └── Text Container Text: "96%|IIT|Cure Rate|(n=275/286)|ITT|100%|miTT|Cure Rate|(n=275/275)|bullets..."
├── Text Container (more content)
```

Both factoids (96% ITT + 100% mITT) are in the **same** Text Container Text field.

---

## DOM Structure in UE

Based on the screenshot, the rendered HTML inside `.text-container-text` is:

```html
<div class="text-container-text">
  <h1>96%</h1>        ← large percentage (styled as H1 by author)
  <h5>IIT</h5>        ← label
  <h6>Cure Rate</h6>  ← sub-label
  <p>(n=275/286)</p>  ← sample size
  <h5>ITT</h5>        ← second factoid starts
  <h1>100%</h1>       ← large percentage
  <h5>miTT</h5>
  <h6>Cure Rate</h6>
  <p>(n=275/275)</p>
  <ul>                ← bullet points
    <li>0% on-treatment...</li>
    <li>0% relapse...</li>
  </ul>
  <p>Single-arm, open-label study...</p>
</div>
```

---

## Styling Approach

Target elements by tag inside `.tabs-panel .text-container-text`:

| Element | Style | Purpose |
|---------|-------|---------|
| `h1` | Large font (~70px), orange/green color, inline-block | Big percentage number |
| `h5` | Small uppercase, bold | "ITT" / "mITT" label |
| `h6` | Medium bold, green underline below | "Cure Rate" |
| `p` (after h6) | Small gray text | Sample size "(n=275/286)" |
| `ul` | Bullet list with green bullet markers | Study findings |

**Layout:** The factoids (h1 + h5 + h6 + p) need to display as inline-flex groups side by side. Since we can't wrap them in divs via authoring, CSS needs to use a grid or flex approach on the parent container.

**Challenge:** Without wrapper divs, we can't easily pair "96% + ITT + Cure Rate + (n=275/286)" as a group separate from "100% + mITT + Cure Rate + (n=275/275)". All elements are flat siblings.

**Solution:** Use CSS Grid on `.text-container-text` with named grid areas, OR use a simpler approach where:
- The container is `display: flex; flex-wrap: wrap`
- h1 elements get a large width allocation
- h5/h6/p get `width: auto` and group naturally

**Simpler alternative:** Style everything stacked (as it currently appears) since the author put both factoids in one container. The CSS makes them look good vertically with proper spacing, colors, and the green underline — matching the mobile view of the original site.

For the **desktop side-by-side layout**, the author should use **two separate Text Containers** placed in two sections with the same name (8+4 or 6+6 grid).

---

## CSS to Add (in `blocks/tabs/mavyret/tabs.css`)

```css
/* ── Factoid styling inside tab panels ── */
.tabs-panel .text-container-text h1 {
  font-size: var(--font-size-h2);
  font-family: var(--heading-font-family-bold);
  color: var(--color-fiesta);
  line-height: 1;
  margin: 0 0 var(--spacing-04);
}

.tabs-panel .text-container-text h5 {
  font-size: var(--font-size-14);
  font-family: var(--heading-font-family-bold);
  color: var(--color-text-heading);
  text-transform: uppercase;
  margin: 0;
  line-height: var(--line-height-20);
}

.tabs-panel .text-container-text h6 {
  font-size: var(--font-size-h4);
  font-family: var(--heading-font-family-bold);
  color: var(--color-text-heading);
  margin: 0;
  padding-bottom: var(--spacing-06);
  border-bottom: var(--spacing-03) solid var(--color-green-flash);
  display: inline-block;
}

.tabs-panel .text-container-text p {
  font-size: var(--font-size-body);
  color: var(--color-text-secondary);
  margin: var(--spacing-04) 0;
}

.tabs-panel .text-container-text h2 {
  font-size: var(--font-size-h4);
  font-family: var(--heading-font-family-bold);
  color: var(--color-text-heading);
  text-align: center;
  margin: var(--spacing-24) 0 var(--spacing-16);
}

.tabs-panel .text-container-text ul {
  padding-left: var(--spacing-16);
  margin: var(--spacing-16) 0;
}

.tabs-panel .text-container-text ul li {
  font-size: var(--font-size-body);
  color: var(--color-text-heading);
  margin-bottom: var(--spacing-04);
}

.tabs-panel .text-container-text ul li::marker {
  color: var(--color-green-flash);
}
```

---

## Tokens Used (all from `styles/mavyret/tokens.css`)

| Token | Value | Used for |
|-------|-------|----------|
| `--font-size-h2` | 70px | Large percentage numbers |
| `--color-fiesta` | #e65400 | Orange percentage color |
| `--color-green-flash` | #76bd22 | Green underline / bullet markers |
| `--color-text-heading` | #071d49 | Dark navy heading text |
| `--color-text-secondary` | #50535c | Gray sample size text |
| `--heading-font-family-bold` | Univers LT W01_67 Bold | All headings |
| `--font-size-h4` | 20px | "Cure Rate" label |

---

## Checklist

- [x] Mavyret tabs brand CSS created (`blocks/tabs/mavyret/tabs.css`)
- [x] Block config created
- [x] Determine approach: Text Container with semantic HTML + CSS styling
- [ ] Add factoid styling to `blocks/tabs/mavyret/tabs.css`
  - [ ] h1 → large orange percentage
  - [ ] h5 → uppercase label (ITT/mITT)
  - [ ] h6 → "Cure Rate" with green underline
  - [ ] p → gray sample size
  - [ ] h2 → centered section heading ("Acute HCV", "Chronic HCV")
  - [ ] ul/li → green bullet markers
- [ ] Author "Cure Rates" tab content (done per screenshot)
- [ ] Author "Viral Suppression" tab content
- [ ] Author "Adherence" tab content
- [ ] Add `brand` = `mavyret` to metadata spreadsheet
- [ ] Test in UE and preview

---

*Implementation requires Execute mode.*
