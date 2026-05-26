# Linzess Pages Migration Plan

## Overview
Migrate 56 Linzess pages from AEM Platform C (linzess.com) to AEM Edge Delivery Services using existing developed blocks and Linzess brand overrides.

## Existing Linzess Infrastructure

### Brand Setup (Ready)
- `styles/linzess/tokens.css` — brand colors, typography, spacing
- `styles/linzess/fonts.css` — brand fonts
- `styles/linzess/styles.css` — global overrides
- `brand-config.json` — Linzess registered as brand

### Blocks with Linzess Overrides (Ready)
| Block | Status |
|---|---|
| Header | ✅ Brand CSS ready |
| Footer | ✅ Brand CSS + block-config.js |
| Hero | ✅ Brand CSS ready |
| Accordion | ✅ Brand CSS ready |
| Cards Grid | ✅ Brand CSS ready |
| CTA | ✅ Brand CSS ready |
| Tabs | ✅ Brand CSS ready |
| Safety Bar | ✅ Brand CSS ready |
| Section Nav | ✅ Brand CSS ready |
| Flexbox | ✅ Base CSS (no brand override yet) |

### Blocks Available (Base Only — May Need Linzess Overrides)
- Carousel Video Playlist
- Columns
- Rich Text
- Image Compare
- Modal
- Brightcove Video
- Text Container
- Dismiss

---

## Page Categories & Estimation

### Phase 1: Foundation & Templates (Days 1–2)
Set up page templates, nav, footer fragments, and ISI for Linzess.

| Task | Effort |
|---|---|
| Linzess nav fragment (header) | 2h |
| Linzess footer fragment | 2h |
| ISI / Safety Bar content | 2h |
| Page template setup (metadata, brand) | 1h |
| **Phase 1 Total** | **7h (~1 day)** |

### Phase 2: Simple Pages (Days 2–3)
Mostly text content, transcript pages — minimal block usage.

| Page | Complexity | Est. |
|---|---|---|
| Sitemap | Simple | 0.5h |
| Legal Policy | Simple | 0.5h |
| Reminder Terms & Conditions | Simple | 0.5h |
| Savings Card Terms | Simple | 0.5h |
| Savings Card Activate | Simple | 0.5h |
| Savings Card Savings | Simple | 0.5h |
| Community Support | Simple | 0.5h |
| 15× Transcript pages | Simple | 0.5h each = 7.5h |
| **Phase 2 Total** | **18 pages** | **~11h (1.5 days)** |

### Phase 3: Medium Pages (Days 3–5)
Content-heavy pages with multiple blocks (accordion, tabs, cards, video).

| Page | Complexity | Est. |
|---|---|---|
| Patient Stories | Medium | 2h |
| Patient Experiences | Medium | 2h |
| Tips for Managing Constipation | Medium | 2h |
| Savings Card | Medium | 1.5h |
| FAQs | Medium | 2h |
| From the Gut | Medium | 2h |
| How to Take LINZESS (support) | Medium | 1.5h |
| OTC and Prescription Treatments | Medium | 1.5h |
| Tackling IBS-C Triggers | Medium | 1.5h |
| Keeping in Touch with Your Doctor | Medium | 1.5h |
| Low FODMAP Diet | Medium | 1.5h |
| Flavorful Food Swaps | Medium | 1.5h |
| Game Plan for IBS-C | Medium | 1.5h |
| 5 Holiday Low FODMAP Recipes | Medium | 1.5h |
| FODMAP-Friendly Pantry | Medium | 1.5h |
| **Phase 3 Total** | **15 pages** | **~25h (3 days)** |

### Phase 4: Complex Pages (Days 5–9)
Rich layouts with hero, flexbox, interactive components, quizzes, forms.

| Page | Complexity | Est. |
|---|---|---|
| Homepage | Complex | 4h |
| Resources | Complex | 3h |
| Find Relief | Complex | 3h |
| Understanding Constipation | Complex | 3h |
| Savings & Support [stretch] | Complex | 3h |
| Why LINZESS | Complex | 3h |
| How LINZESS Can Help | Complex | 3h |
| How LINZESS Works | Complex | 3h |
| Side Effects | Complex | 3h |
| Types of Constipation | Complex | 3h |
| What Is IBS-C | Complex | 3h |
| What Is CIC | Complex | 3h |
| Constipation Treatment Options | Complex | 3h |
| Talk to a Doctor | Complex | 3h |
| Gut Check Quiz | Complex | 4h |
| How to Take LINZESS | Complex | 3h |
| En Español | Complex | 4h |
| **Phase 4 Total** | **17 pages** | **~52h (6.5 days)** |

### Phase 5: QA & Visual Polish (Days 9–10)
Cross-page visual regression, responsive testing, ISI verification.

| Task | Effort |
|---|---|
| Visual comparison vs source (all pages) | 4h |
| Mobile responsive QA | 3h |
| ISI/safety bar across pages | 2h |
| Fix brand CSS deltas | 4h |
| Accessibility check (headings, alt, aria) | 2h |
| **Phase 5 Total** | **~15h (2 days)** |

---

## Summary

| Phase | Pages | Effort | Calendar Days |
|---|---|---|---|
| 1. Foundation & Templates | — | 7h | 1 |
| 2. Simple Pages | 18 | 11h | 1.5 |
| 3. Medium Pages | 15 | 25h | 3 |
| 4. Complex Pages | 17 | 52h | 6.5 |
| 5. QA & Polish | — | 15h | 2 |
| **Total** | **56 pages** | **~110h** | **~14 working days (3 weeks)** |

### Assumptions
- 8h/day productive work
- Single developer
- All blocks already developed (no new block creation needed)
- Linzess brand tokens and overrides already exist
- Import tooling (parsers/transformers) may need minor adjustments per page template
- Gut Check Quiz may require custom interactive JS (add ~2h buffer)
- En Español requires separate nav/footer fragments

### Risks & Dependencies
- **Gut Check Quiz**: May need a new interactive form block if not covered by existing `eds-form`
- **Savings Card flow**: Activate/savings pages may require API integration or redirect logic
- **En Español**: Full duplicate nav/footer in Spanish — doubles fragment work
- **Transcript pages**: High volume but templated — can batch-import after first one is validated

---

## Checklist

- [ ] Phase 1: Create Linzess nav fragment
- [ ] Phase 1: Create Linzess footer fragment
- [ ] Phase 1: Create ISI/safety bar fragment
- [ ] Phase 1: Set up page template metadata
- [ ] Phase 2: Migrate sitemap page
- [ ] Phase 2: Migrate legal/terms pages (3 pages)
- [ ] Phase 2: Migrate savings card sub-pages (3 pages)
- [ ] Phase 2: Migrate transcript pages (15 pages) — batch after template validated
- [ ] Phase 3: Migrate Patient Stories & Experiences (2 pages)
- [ ] Phase 3: Migrate FAQs page
- [ ] Phase 3: Migrate Savings Card main page
- [ ] Phase 3: Migrate wellness/healthy routines pages (10 pages)
- [ ] Phase 4: Migrate Homepage
- [ ] Phase 4: Migrate Why LINZESS section (4 pages)
- [ ] Phase 4: Migrate Understanding Constipation section (4 pages)
- [ ] Phase 4: Migrate Find Relief section (3 pages)
- [ ] Phase 4: Migrate Savings & Support (stretch)
- [ ] Phase 4: Migrate Gut Check Quiz
- [ ] Phase 4: Migrate En Español
- [ ] Phase 5: Visual comparison QA
- [ ] Phase 5: Mobile responsive testing
- [ ] Phase 5: ISI/safety bar verification
- [ ] Phase 5: Accessibility audit
- [ ] Phase 5: Fix remaining brand CSS deltas
