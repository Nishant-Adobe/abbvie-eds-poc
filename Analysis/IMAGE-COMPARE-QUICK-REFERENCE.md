# Image Comparison Block - Quick Reference Card

## Side-by-Side Specifications

| Property               | Skyrizi         | Rinvoq         |
| ---------------------- | --------------- | -------------- |
| **Container Width**    | 511px           | 540px          |
| **Container Height**   | 419px           | 419px          |
| **Handle Width**       | 1px             | 4px            |
| **Handle Color**       | rgba(0,0,0,0.5) | rgb(37,40,42)  |
| **Label Font Size**    | 12.8px          | 16px           |
| **Label Color**        | rgb(33,64,109)  | rgb(37,40,42)  |
| **Label Position**     | Bottom corners  | Bottom corners |
| **Overlay Bar**        | None            | Gray #666869   |
| **Overlay Height**     | —               | 70px           |
| **Primary Text Color** | #214070         | #252A2A        |
| **Icon Type**          | swap_horiz      | code           |

---

## Color Palette - Copy/Paste Values

### Skyrizi Colors

```
Primary Blue:       #214070
RGB:                rgb(33, 64, 109)
Handle Overlay:     rgba(0, 0, 0, 0.5)
Focus Outline:      #0057cc
Text:               #214070
Background:         transparent
```

### Rinvoq Colors

```
Primary Gray:       #252A2A
RGB:                rgb(37, 40, 42)
Handle:             #252A2A
RGB:                rgb(37, 40, 42)
Overlay:            #666869
RGB:                rgb(102, 104, 105)
Overlay Text:       #FFFFFF
Tab Active:         #901A4A
Focus Outline:      #0057cc
```

---

## CSS Quick Copy

### Skyrizi Handle

```css
width: 1px;
background-color: rgba(0, 0, 0, 0.5);
color: rgb(33, 64, 109);
```

### Rinvoq Handle

```css
width: 4px;
background-color: rgb(37, 40, 42);
color: rgb(37, 40, 42);
```

### Skyrizi Label

```css
font-size: 12.8px;
font-weight: 400;
color: rgb(33, 64, 109);
background: transparent;
left: 12px;
bottom: 12px;
```

### Rinvoq Label

```css
font-size: 16px;
font-weight: 400;
color: rgb(37, 40, 42);
background: transparent;
left: 12px;
bottom: 12px;
```

### Rinvoq Overlay

```css
position: absolute;
bottom: 0;
width: 100%;
height: 70px;
padding: 5px 10px;
background-color: rgb(102, 104, 105);
z-index: 11;
```

---

## Font References

### Skyrizi

- **Font**: System fonts (-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif)
- **Label Size**: 12.8px
- **Weight**: 400

### Rinvoq

- **Font**: Helvetica Neue LT W05_55 Roman
- **Bold**: Helvetica Neue LT W05_75 Bold
- **Label Size**: 16px
- **Weight**: 400 (regular) / 700 (bold)
- **Line Height**: 20px

---

## Focus States (Both)

```css
outline: 2px solid #0057cc;
outline-offset: 2px;
```

---

## Mobile Breakpoints

### Tablet (≤1024px)

- Width: 100% (max-width: 511px for Skyrizi, 540px for Rinvoq)
- Height: Auto (maintain aspect ratio)

### Mobile (≤480px)

- Font size: 0.7rem-0.75rem
- Padding: 4-6px
- Label distance: 8px

---

## Image Dimensions

### Skyrizi

- After: 511×419 px
- Before: 511×419 px

### Rinvoq

- After: 540×359 px
- Before: 540×346 px

---

## Essential CSS Properties

```css
/* Container */
position: relative;
overflow: hidden;
cursor: col-resize;
user-select: none;
touch-action: none;

/* Before Image */
position: absolute;
inset: 0;
overflow: hidden;
width: var(--compare-position);
object-fit: cover;

/* Handle */
position: absolute;
left: var(--compare-position);
transform: translateX(-50%);
cursor: col-resize;
z-index: 2;
```

---

## Z-Index Stack Order

1. Images/Container: 0
2. Labels: 1
3. Handle: 2
4. Hover Instructions: 3
5. Overlay Bar: 11

---

## Keyboard Navigation

| Key         | Action            |
| ----------- | ----------------- |
| Tab         | Focus handle      |
| ←           | Move handle left  |
| →           | Move handle right |
| Home        | Move to 0%        |
| End         | Move to 100%      |
| Space/Enter | Toggle (optional) |

---

## Accessibility Attributes

```html
<span
  class="slider-handle"
  role="separator"
  tabindex="0"
  aria-label="Image comparison slider"
>
</span>
```

---

## JavaScript Events to Handle

```javascript
pointerdown; // Start drag
pointermove; // Update position
pointerup; // End drag
keydown; // Arrow keys
resize; // Window resize
load; // Image load
```

---

## Performance Tips

1. ✅ Use CSS custom properties (--compare-position)
2. ✅ Avoid transitions during drag
3. ✅ Debounce resize events
4. ✅ Cache DOM references
5. ✅ Use object-fit for image scaling
6. ✅ Lazy load images
7. ❌ Don't use complex shadows
8. ❌ Don't animate on every pixel change

---

## Testing Checklist

- [ ] Visual: Colors match spec
- [ ] Visual: Fonts render correctly
- [ ] Visual: Spacing is accurate
- [ ] Interaction: Drag works smoothly
- [ ] Interaction: Touch works on mobile
- [ ] Keyboard: Arrow keys work
- [ ] Focus: Outline visible at #0057cc
- [ ] Accessibility: Screen reader announces slider
- [ ] Responsive: Works at 480px, 768px, 1024px+
- [ ] Performance: Smooth 60fps dragging

---

## File Structure

```
blocks/
  image-compare/
    image-compare.css          (shared base)
    image-compare.js           (shared logic)
    skyrizi-hcp/
      image-compare.css        (Skyrizi variant)
    rinvoq-dtc/
      image-compare.css        (Rinvoq variant)
```

---

## Common Issues & Solutions

| Issue                    | Solution                                         |
| ------------------------ | ------------------------------------------------ |
| Handle not dragging      | Check `touch-action: none` and JavaScript events |
| Colors wrong             | Verify RGB values, not hex (though both work)    |
| Labels overlap on mobile | Reduce font-size at breakpoint                   |
| Focus ring not visible   | Check `outline-color` and z-index                |
| Images not covering      | Use `object-fit: cover`                          |
| Blurry on retina         | Use vector graphics/SVG for icons                |

---

## Browser Support

| Browser           | Support |
| ----------------- | ------- |
| Chrome 90+        | ✅ Full |
| Firefox 88+       | ✅ Full |
| Safari 14+        | ✅ Full |
| Edge 90+          | ✅ Full |
| Mobile Safari 14+ | ✅ Full |
| Mobile Chrome     | ✅ Full |

---

**Version:** 1.0  
**Date:** May 5, 2026  
**Format:** Quick Reference  
**For:** Developers implementing pixel-perfect CSS

---

## Additional Resources

📄 Full Specifications: `image-compare-detailed-analysis.json`  
📖 Implementation Guide: `IMAGE-COMPARE-DETAILED-GUIDE.md`  
💻 CSS Template: `image-compare-css-template.css`  
🔗 Live Sites:

- Skyrizi: https://www.skyrizihcp.com/dermatology/psoriasis-efficacy/before-and-after
- Rinvoq: https://www.rinvoq.com/atopic-dermatitis/rinvoq-results/eczema-pictures
