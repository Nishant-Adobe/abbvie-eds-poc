# Image Comparison Block: Pixel-Perfect CSS Analysis

## Skyrizi HCP vs Rinvoq DTC

**Analysis Date:** May 5, 2026  
**Purpose:** Detailed styling specifications for pixel-perfect CSS implementation

---

## Quick Comparison Table

| Feature            | Skyrizi         | Rinvoq             | Winner                |
| ------------------ | --------------- | ------------------ | --------------------- |
| Container Width    | 511px           | 540px              | Rinvoq (wider)        |
| Container Height   | 419px           | 419px              | Same                  |
| Aspect Ratio       | 1.219:1         | 1.289:1            | Skyrizi (more square) |
| Handle Width       | 1px             | 4px                | Rinvoq (more visible) |
| Handle Color       | rgba(0,0,0,0.5) | rgb(37,40,42)      | Rinvoq (solid)        |
| Label Font Size    | 12.8px          | 16px               | Rinvoq (larger)       |
| Label Color        | #214070 (blue)  | #252A2A (gray)     | Different branding    |
| Overlay Bar        | None            | #666869 70px bar   | Rinvoq only           |
| Instructional Text | Minimal         | Prominent + arrows | Rinvoq more helpful   |
| Tab System         | Week tabs       | Body part tabs     | Both different        |

---

## Detailed Styling Specifications

### 1. SKYRIZI - Container & Layout

```css
.image-compare-slider.parbase {
  width: 511px;
  height: 419px;
  padding: 0;
  margin: 0;
  position: static;
  overflow: visible;
  cursor: col-resize;
  background: transparent;
  user-select: none;
  touch-action: none;
}

.abbv-img-slider {
  position: relative;
  width: 100%;
  height: 100%;
  overflow: hidden;
}
```

### 2. RINVOQ - Container & Layout

```css
.image-compare-slider.parbase {
  width: 540px;
  height: 419px;
  padding: 0;
  margin: 0;
  position: static;
  overflow: visible;
  cursor: col-resize;
  background: transparent;
  user-select: none;
  touch-action: none;
}

.abbv-img-slider.ad-image-slider {
  position: relative;
  width: 100%;
  height: 100%;
  overflow: hidden;
}
```

---

## Handle Styling

### SKYRIZI Handle

```css
.slider-handle.abbv-icon-swap_horiz {
  /* Dimensions */
  width: 1px;
  height: 100%;

  /* Positioning */
  position: absolute;
  top: 0;
  bottom: 0;
  left: var(--compare-position, 50%);
  transform: translateX(-50%);

  /* Styling */
  background-color: rgba(0, 0, 0, 0.5); /* #00000080 */
  color: rgb(33, 64, 109); /* #214070 */

  /* Interaction */
  cursor: ew-resize;
  z-index: 2;

  /* Typography (for icon) */
  font-size: 12.8px;
  font-weight: 400;
}

/* Focus state */
.slider-handle:focus-visible {
  outline: 2px solid rgb(0, 87, 204); /* #0057cc */
  outline-offset: 2px;
}
```

### RINVOQ Handle

```css
.slider-handle.abbv-icon-code {
  /* Dimensions */
  width: 4px;
  height: 100%;

  /* Positioning */
  position: absolute;
  top: 0;
  bottom: 0;
  left: var(--compare-position, 50%);
  transform: translateX(-50%);

  /* Styling */
  background-color: rgb(37, 40, 42); /* #252A2A */
  color: rgb(37, 40, 42); /* #252A2A */

  /* Interaction */
  cursor: ew-resize;
  z-index: 2;

  /* Typography (for icon) */
  font-size: 16px;
  font-weight: 400;
}

/* Focus state */
.slider-handle:focus-visible {
  outline: 2px solid rgb(0, 87, 204); /* #0057cc */
  outline-offset: 2px;
}
```

---

## Text Labels & Overlays

### SKYRIZI Label Styling

```css
/* Before Label */
.image-compare-label.image-compare-label-before {
  position: absolute;
  left: 12px;
  bottom: 12px;

  content: "BEFORE | WEEK 0";
  color: rgb(33, 64, 109); /* #214070 */
  background-color: transparent;

  font-size: 12.8px;
  font-weight: 400;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;

  padding: 0;
  margin: 0;
  text-align: left;
  z-index: 1;
}

/* After Label */
.image-compare-label.image-compare-label-after {
  position: absolute;
  right: 12px;
  bottom: 12px;

  content: "AFTER | WEEK 16";
  color: rgb(33, 64, 109); /* #214070 */
  background-color: transparent;

  font-size: 12.8px;
  font-weight: 400;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;

  padding: 0;
  margin: 0;
  text-align: right;
  z-index: 1;
}
```

### RINVOQ Overlay Bar & Labels

```css
/* Full-Width Overlay Bar */
.image-text-overlay-container {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;

  width: 100%;
  height: 70px;
  padding: 5px 10px;

  background-color: rgb(102, 104, 105); /* #666869 */
  z-index: 11;

  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

/* Overlay Text Content */
.image-text-overlay-content {
  color: rgb(255, 255, 255); /* #FFFFFF */
  background-color: rgb(102, 104, 105); /* #666869 */

  font-family: "Helvetica Neue LT W05_55 Roman", Arial, sans-serif;
  font-size: 16px;
  font-weight: 400;
  line-height: 20px;
  text-align: center;

  padding: 5px 10px;
  margin: 0;
}

/* Paragraph in Overlay */
.image-text-overlay-content p {
  font-family: "Helvetica Neue LT W05_75 Bold";
  font-size: 16px;
  font-weight: 700;
  line-height: 20px;
  color: rgb(255, 255, 255); /* #FFFFFF */
  margin: 0;
  padding: 0;
}

/* First Line */
.image-text-overlay-content p:first-child {
  margin-bottom: 5px;
}
```

---

## Color Palette Reference

### SKYRIZI Color Scheme

```
Primary Blue:        #214070  rgb(33, 64, 109)
Handle Overlay:      #00000080 rgba(0, 0, 0, 0.5)
Text:                #214070  rgb(33, 64, 109)
Background:          transparent
Focus Outline:       #0057cc  rgb(0, 87, 204)
```

### RINVOQ Color Scheme

```
Primary Gray:        #252A2A  rgb(37, 40, 42)
Handle:              #252A2A  rgb(37, 40, 42)
Overlay Background:  #666869  rgb(102, 104, 105)
Overlay Text:        #FFFFFF  rgb(255, 255, 255)
Tab Active:          #901A4A  rgb(144, 18, 74)
Focus Outline:       #0057cc  rgb(0, 87, 204)
```

---

## Image Configuration

### SKYRIZI Images

```css
.image-compare-after img {
  width: 511px;
  height: 419px;
  display: block;
  line-height: 0;

  alt: "Patient results after 2 doses of SKYRIZI® at Week 16.";
}

.image-compare-before img {
  width: 100%;
  height: 100%;
  display: block;
  object-fit: cover;
  object-position: left;

  alt: "Patient condition before starting SKYRIZI® at Week 0.";
}
```

### RINVOQ Images

```css
.image-compare-after img {
  width: 540px;
  height: 359px;
  display: block;
  line-height: 0;
}

.image-compare-before img {
  width: 100%;
  height: 346px;
  display: block;
  object-fit: cover;
  object-position: left;
}
```

---

## Spacing & Measurements

### SKYRIZI Spacing

| Element               | Measurement |
| --------------------- | ----------- |
| Container Width       | 511px       |
| Container Height      | 419px       |
| Label Left Distance   | 12px        |
| Label Bottom Distance | 12px        |
| Label Right Distance  | 12px        |
| Padding               | 0px         |
| Margin                | 0px         |
| Font Size (labels)    | 12.8px      |

### RINVOQ Spacing

| Element            | Measurement |
| ------------------ | ----------- |
| Container Width    | 540px       |
| Container Height   | 419px       |
| Overlay Height     | 70px        |
| Overlay Padding    | 5px 10px    |
| Label Padding      | 12px        |
| Padding            | 0px         |
| Margin             | 0px         |
| Font Size (labels) | 16px        |

---

## Typography Details

### SKYRIZI Typography

```
Font Family:    System fonts (default sans-serif)
Label Size:     12.8px
Label Weight:   400 (regular)
Line Height:    normal (12.8px * 1)
Text Transform: None (natural case)
```

### RINVOQ Typography

```
Font Family:    Helvetica Neue LT W05_55 Roman
Bold Family:    Helvetica Neue LT W05_75 Bold
Label Size:     16px
Label Weight:   400 / 700 (bold)
Line Height:    20px
Text Transform: Uppercase for "CLICK AND DRAG"
Letter Spacing: None
```

---

## Responsive Behavior

### Desktop (611px+)

- **Skyrizi**: 511px × 419px container, labels visible, handle interactive
- **Rinvoq**: 540px × 419px container, full overlay bar visible, instructions clear

### Tablet (768px viewports)

- Both containers scale to fit parent context
- Handle remains proportional
- Labels remain visible
- Overlay bar maintains 70px height on Rinvoq

### Mobile (< 360px)

- Containers scale to parent width (typically 100%)
- Handle scales proportionally
- Labels may overlap at very small sizes
- Overlay text may need reduced font-size

---

## Accessibility Features

### Both Implementations

```css
.slider-handle {
  role: "separator";
  tabindex: 0;

  /* Focus visible outline */
  outline: 2px solid #0057cc;
  outline-offset: 2px;
}
```

### Keyboard Navigation

- **Tab**: Focus on handle
- **Left Arrow**: Move handle left (decrease percentage)
- **Right Arrow**: Move handle right (increase percentage)
- **Enter/Space**: Activate handle (JavaScript dependent)

### Screen Reader Support

- Slider handle labeled as "separator"
- Alt text provided for images
- Overlay instructions text read aloud

---

## JavaScript Integration

### Position Tracking

```javascript
// CSS Custom Property Update
--compare-position: 50% (default)

// On drag:
--compare-position: 45%  // Example during drag
--compare-position: 62%  // Example at different position
```

### Event Handlers

```javascript
Events:
- pointerdown   (start drag)
- pointermove   (during drag)
- pointerup     (end drag)
- keydown       (arrow key navigation)
- resize        (window resize - recalculate)
- load          (image load - adjust dimensions)
```

---

## Implementation Checklist

### Essential CSS Properties

- [ ] Container position: relative
- [ ] Container overflow: hidden
- [ ] Handle position: absolute
- [ ] Handle transform: translateX(-50%)
- [ ] Before image position: absolute with inset: 0
- [ ] Before image width: var(--compare-position)
- [ ] CSS custom property: --compare-position
- [ ] Z-index hierarchy: Before (0) < Labels (1) < Handle (2) < Overlay (11)

### Essential JavaScript

- [ ] Drag detection (pointerdown/pointermove/pointerup)
- [ ] Position calculation (mouse/touch position %)
- [ ] Update CSS custom property: --compare-position
- [ ] Boundary clamping (0% to 100%)
- [ ] Image resize handling
- [ ] Keyboard navigation (arrow keys)
- [ ] Touch support (touch-action: none)

### Essential HTML Structure

```html
<div class="image-compare-slider">
  <div class="image-compare-container">
    <!-- After image -->
    <div class="image-compare-after">
      <img src="after.jpg" alt="..." />
    </div>

    <!-- Before image (clipped) -->
    <div class="image-compare-before">
      <img src="before.jpg" alt="..." />
    </div>

    <!-- Handle/slider control -->
    <span class="slider-handle" role="separator" tabindex="0"></span>

    <!-- Labels (optional) -->
    <div class="image-compare-label image-compare-label-before">BEFORE</div>
    <div class="image-compare-label image-compare-label-after">AFTER</div>
  </div>

  <!-- Overlay bar (Rinvoq only) -->
  <div class="image-text-overlay-container">
    <div class="image-text-overlay-content">
      <p>Many patients saw 75% skin clearance...</p>
      <p>Individual results may vary.</p>
    </div>
  </div>
</div>
```

---

## Key Differences Summary

1. **Handle Prominence**: Skyrizi subtle (1px), Rinvoq bold (4px)
2. **Label Strategy**: Skyrizi corner labels, Rinvoq overlay bar with instructions
3. **Color Scheme**: Skyrizi blue (#214070), Rinvoq gray (#252A2A)
4. **Instructional Content**: Skyrizi minimal, Rinvoq descriptive with arrows
5. **Font Size**: Skyrizi 12.8px, Rinvoq 16px (larger, more readable)
6. **Overlay Bar**: Skyrizi none, Rinvoq full-width gray bar
7. **Tab System**: Skyrizi weeks (16/52), Rinvoq body parts (arms/legs/back/feet)
8. **Typography**: Skyrizi default sans, Rinvoq explicit Helvetica Neue

---

## Pixel-Perfect CSS Matching Goals

### Must Match

- Container dimensions (width/height)
- Handle width and positioning
- Label positioning (top/bottom/left/right)
- Colors (exact hex values)
- Font sizes and weights
- Z-index stacking order
- Focus outline specifications

### Should Match

- Spacing/padding/margins
- Border-radius (if any)
- Box shadows (if any)
- Cursor states
- Overflow behavior
- Touch interaction response

### May Vary

- Font families (can use web-safe alternatives)
- Icon styling (can use different icons)
- Animation/transition timing
- Image aspect ratios (use actual images)

---

**Document Version:** 1.0  
**Last Updated:** May 5, 2026  
**Status:** Ready for Implementation
