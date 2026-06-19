# RINVOQ HCP /rheumatoid-arthritis — Migration Analysis

Source: https://www.rinvoqhcp.com/rheumatoid-arthritis
Title: RINVOQ® (upadacitinib) for Rheumatoid Arthritis
Archetype: HCP brand/condition landing (homepage-like). Brand: rinvoq-hcp.
Job codes: US-RNQ-250017 (ISI), US-RNQR-260103 (footer/page).
Nav fragment: rheumatology nav (use /rinvoq-hcp/nav or a rheum-specific nav — check; dermatology pages use /rinvoq-hcp/dermatology-nav). Header indication line: "For adult TNFi-IR patients with moderate to severe active rheumatoid arthritis (RA)¹".

## Content sections (main has 6, in order)
1. **HERO** (background-container, bg photo `ra-marquee-hiking.jpg` cover 50% 50%, ~488px tall desktop):
   - Coverage badge img top-right: `rheum-ra-access-bug-desktop--2.svg` (alt: "Payers cover RINVOQ after the trial of 1 TNFi… ~99% preferred… as of May 2025 in RA.")
   - Headline = IMAGE `headline-double-arrows.png` (desktop 1680x296) / `headline-double-arrows-mobile--2.svg` (≤984px). alt="Control's that fast and shown to last." (live alt: "Control's that fast and shown to last.")
   - H2 (white, Graphik Semibold 13px): "RA patients met **ACR20 at Week 12 or 14** (primary endpoints) and disease control through remission (DAS28-CRP <2.6)‡ at Weeks 12 or 14 and observed up to 5 years.¹,³⁻⁶"
   - CTA1 "Explore the Data" → /rheumatoid-arthritis/efficacy (plum pill #90124a, white, radius 100px)
   - CTA2 "See H2H Data from SELECT-SWITCH at 12 Weeks" → /rheumatoid-arthritis/efficacy/rinvoq-vs-humira/select-switch-study (plum pill)
   - Maps to: hero `no-padding` variant (matches homepage/dosing/real-patients). Hero text uses image headline + handwriting pattern.

2. **FOOTNOTES/ABBREVIATIONS** (container, default content): ‡ "Clinical remission does not mean drug-free remission or complete absence of disease activity." + ACR/bDMARD/CRP/DAS28-CRP/NPA/NSP/tsDMARD abbreviations paragraph. → default content (text-container legal or plain).

3. **INDICATION callout** (container, dismissible): "INDICATION" + indication paragraph + "Limitations of Use:" paragraph. Has a close button (×). → text-container (boxed-warning style) OR custom indication callout. Verbatim regulatory copy.

4. **BENEFIT CARDS + ACCESS SUPPORT** (container):
   - 3-up cards (white bg, 1px #c9c9ca border, radius 20px, ~377px, flex gap 12px), each h3 (Graphik Bold 24px #46484a) + bullet list + a "See …" link:
     - **Rapid Relief¹,⁷,⁸** — ACR20 at Week 12 (primary endpoint), response as early as Week 1 in SELECT-BEYOND; LDA (DAS28-CRP ≤3.2) at Week 12 in SELECT-SWITCH → "See Remission Data at Weeks 12 and 14" → /rheumatoid-arthritis/efficacy#remission-lda
     - **Durable Control¹,⁴,⁵** — Remission rates out to 5 years with or without MTX → "See Remission Data up to ~5 Years" → /rheumatoid-arthritis/efficacy#durable-remission
     - **Well-Studied Safety¹,⁹,¹⁰** — ~9.5 yrs max exposure in RA (~4.2 median) to RINVOQ 15 mg as of 08/2025‡; 27 trials across 9 indications incl older pop (mean age 71) GCA → "See Safety Profile" → /rheumatology/safety
   - **Exceptional Patient and Access Support¹¹** (h3) — bullets (~99% preferred coverage Nov 2025§||; 1:1 support; RINVOQ Complete enrollment) + 2 CTAs "Explore Access Information" → /rheumatology/access, "Learn About Patient Support" → /patient-support
   - Footnotes ‡ § || + abbreviations paragraph.
   - Maps to: `cards-grid cards-grid-cta-card` (homepage uses 2× cards-grid-cta-card) + columns/flexbox for access support. Verify against homepage pattern.

5. **ISI LEAD-IN** (container, default content): "Please see Important Safety Information, including BOXED WARNING on Serious Infections, Mortality, Malignancies, Major Adverse Cardiovascular Events, and Thrombosis, below." + link "Learn more… below" → #abbv_use_statement.

6. **PRIMARY ENDPOINTS CHART** (container):
   - H2 (with sup ¹,³,⁷,⁸,¹²): "RINVOQ (upadacitinib) Met Its Primary Endpoints in 4 Trials Across Patient Populations and Comparators"
   - "Primary Endpoint Results (Week 12 or 14)" label
   - Chart IMAGE `chart-ra-acr20-week12-desktop.png` (alt "Primary Endpoint Results (Week 12/14).")
   - Chart footnotes (*NRI-MI; †P≤0.001; ‡P<0.001 vs HUMIRA; §P=0.0001…)
   - Comparator disclaimer paragraphs (RINVOQ indicated…; Boxed Warning…; HUMIRA indicated…; clinical decisions…) + "HUMIRA Indication and Important Safety Information" modal link + HUMIRA PI link
   - 4 SELECT study cards (verbatim): SELECT-BEYOND (RA-V), SELECT-COMPARE (RA-IV), SELECT-MONOTHERAPY (RA-II), SELECT-SWITCH — each + "See Study Details" modal link (study-design images downloaded)
   - "See ACR Response Criteria" modal link + abbreviations paragraph.
   - Maps to: default content H2 + image + text-container(s); study cards = cards-grid or columns. Study-detail modals = modal block (or omit per homepage approach — check approved pages).

## Shared regulatory skeleton (reuse verbatim from approved rinvoq-hcp pages)
- ISI region (text-container boxed-warning + legal) — full RINVOQ ISI ending US-RNQ-250017. INDICATION for RA differs slightly (TNF blockers wording) — verify against live (captured above).
- References (ordered list, 13 refs — captured verbatim in scrape).
- safety-bar split (inline floating ISI).
- metadata block (brand=rinvoq-hcp, nav, footer, title, description) WRAPPED in section div.

## Images (in content/content/dam/abbvie-eds-poc/ — runtime path /content/dam/abbvie-eds-poc/)
Content: rheum-ra-access-bug-desktop--2.svg, headline-double-arrows.png, headline-double-arrows-mobile--2.svg, chart-ra-acr20-week12-desktop.png, study-design-select-{beyong-v0a,compare,mono,switch,early,next}.png
BG (CSS → base64 per req #9): ra-marquee-hiking.jpg (hero), stroke--heading.svg, stroke--subheading.svg (ISI/footer decorations — already in DAM from prior pages)

## md2jcr rules to apply
- Superscripts: Unicode (¹²³ ‡ § || † *), NOT <sup>.
- Metadata block wrapped in section div.
- If any Table block used: needs table-N-columns + table-col-N markers.
- Verbatim ISI/references/study copy.

## REFERENCES (verbatim, 13 — ‼ note live shows 1-13 but body cites 1,3-13)
1. RINVOQ [package insert]. North Chicago, IL: AbbVie Inc.
2. Data on file. AbbVie Inc. #1 Badge. 2025.
3. Smolen JS, Pangan AL, Emery P, et al. … (SELECT-MONOTHERAPY) … Lancet. 2019;393(10188):2303-2311. doi:10.1016/S0140-6736(19)30419-2
4. Smolen JS, Emery P, Rigby W, et al. … 260 weeks from SELECT-MONOTHERAPY … EULAR May 31-June 3, 2023; Milan, Italy.
5. Fleischmann R, Meerwein S, Charles-Schoeman C, et al. … 5 years from SELECT-BEYOND … RMD Open. 2024:10(3):e003918. doi:10.1136/rmdopen-2023-003918
6. Data on File. ABVRRTI72945.
7. Genovese MC, Fleischmann R, Combe B, et al. … (SELECT-BEYOND) … Lancet. 2018;391(10139):2513-2524.
8. Data on File. ABVRRTI82077.
9. Data on File. ABVRRTI81830.
10. Blockmans D, Penn SK, Setty AR, et al. … giant-cell arteritis. NEJM. 2025;1-11. doi:10.1056/NEJMoa2413449
11. Data on File, AbbVie Inc. Source: AbbVie internal analytics and MMIT. Database as of November 2025.
12. Fleischmann R, Pangan AL, Song I-H, et al. … Arthritis Rheumatol. 2019;71(11):1788-1800. doi:10.1002/art.41032
13. AbbVie Inc. Protocol M23-700. SELECT-SWITCH. EUCT number 2022-502578-18-00. Accessed November 21, 2025.
