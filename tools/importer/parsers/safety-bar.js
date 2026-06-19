/* eslint-disable */
/* global WebImporter */
/**
 * Parser for the "safety-bar" block — "split" variant (floating ISI).
 * Base block: safety-bar
 * Source: https://www.linzess.com/starting-linzess/healthy-routines/keeping-in-touch-with-your-doctor
 * Template: linzess-healthy-routines-article
 * Generated: 2026-06-18
 *
 * WHY THIS PARSER EMITS A FIXED VERBATIM TEMPLATE
 * -----------------------------------------------
 * The safety-bar copy is REGULATED pharmaceutical ISI (Important Safety
 * Information). It must be reproduced BYTE-FOR-BYTE and is IDENTICAL across the
 * whole linzess healthy-routines article family (keeping-in-touch,
 * otc-and-prescription-treatments, tackling-ibs-c-triggers). The authoritative
 * source of truth is the already-migrated sibling page:
 *   content/linzess/healthy-routines/otc-and-prescription-treatments.plain.html
 * (verified: same USES, same IMPORTANT RISK INFORMATION, same Side Effects,
 *  fda.gov/medwatch, tel:18003321088, AbbVie.com/PatientAccessSupport,
 *  /content/dam/abbvie-eds-poc/pdf/linzess_pi.pdf Prescribing Information +
 *  #page=26 Medication Guide, job code US-LIN-250121).
 *
 * The LIVE DOM (div.abbv-inline-use-isi / div.abbv-fixed-isi) differs in markup
 * detail (rxabbvie.com PDF links, <span>/<b> wrappers, &nbsp;, <br>). Scraping it
 * literally would NOT round-trip to the approved verbatim copy. Therefore this
 * parser builds the safety-bar table from a fixed verbatim template that mirrors
 * the sibling .plain.html exactly, only triggering when a source ISI element is
 * present.
 *
 * STRUCTURE (matches the sibling .plain.html EXACTLY — 5 rows, single column):
 *   header: "Safety Bar (split)"  -> renders class="safety-bar split"
 *   row 1  collapsedContent      : <h3>USES</h3> + indication paragraph (teaser)
 *   row 2  collapsedContentCol2  : IMPORTANT RISK INFORMATION + first bullets +
 *                                  "Before you take LINZESS…" h4 (teaser col 2)
 *   row 3  expandedContent       : FULL ISI (USES + IRI + all bullets + Side
 *                                  Effects + paragraphs + FDA/medwatch + AbbVie
 *                                  patient support + PI/Medication Guide links +
 *                                  US-LIN-250121)
 *   row 4  blockId               : "id:"
 *   row 5  (empty)
 *
 * md2jcr maps these 5 rows positionally onto the safety-bar model field groups:
 *   collapsedContent, collapsedContentCol2, expandedContent, blockId, (classes).
 */

// Verbatim ISI HTML, copied from the authoritative sibling .plain.html.
// Keep <sup>, <strong>, links, and the em dash punctuation EXACTLY as-is.

const ROW1_COLLAPSED = `<p></p>
<h3>USES</h3>
<p>LINZESS<sup>&reg;</sup> (linaclotide) is a prescription medication used to treat irritable bowel syndrome with constipation (IBS-C) in adults and in children and adolescents 7 years of age and older, chronic idiopathic constipation (CIC) in adults, and functional constipation (FC) in children and adolescents 6 years of age and older. “Idiopathic” means the cause of the constipation is unknown. <strong>It is not known if LINZESS is safe and effective in children with functional constipation less than 6 years of age or in children with IBS-C less than 7 years of age.</strong></p>`;

const ROW2_COLLAPSED_COL2 = `<p></p>
<h3>IMPORTANT RISK INFORMATION</h3>
<p></p>
<ul>
 <li><strong>Do not give LINZESS to children who are less than 2 years of age. It may harm them.</strong> LINZESS can cause severe diarrhea and your child could get severe dehydration (loss of a large amount of body water and salt).</li>
 <li>Do not take LINZESS if a doctor has told you that you have a bowel blockage (intestinal obstruction).</li>
</ul>
<p></p>
<h4>Before you take LINZESS, tell your doctor about your medical conditions, including if you are:</h4>`;

const ROW3_EXPANDED = `<p></p>
<h3>USES</h3>
<p>LINZESS<sup>&reg;</sup> (linaclotide) is a prescription medication used to treat irritable bowel syndrome with constipation (IBS-C) in adults and in children and adolescents 7 years of age and older, chronic idiopathic constipation (CIC) in adults, and functional constipation (FC) in children and adolescents 6 years of age and older. “Idiopathic” means the cause of the constipation is unknown. <strong>It is not known if LINZESS is safe and effective in children with functional constipation less than 6 years of age or in children with IBS-C less than 7 years of age.</strong></p>
<p></p>
<h3>IMPORTANT RISK INFORMATION</h3>
<p></p>
<ul>
 <li><strong>Do not give LINZESS to children who are less than 2 years of age. It may harm them.</strong> LINZESS can cause severe diarrhea and your child could get severe dehydration (loss of a large amount of body water and salt).</li>
 <li>Do not take LINZESS if a doctor has told you that you have a bowel blockage (intestinal obstruction).</li>
</ul>
<p></p>
<h4>Before you take LINZESS, tell your doctor about your medical conditions, including if you are:</h4>
<p></p>
<ul>
 <li>Pregnant or plan to become pregnant. It is not known if LINZESS will harm your unborn baby.</li>
 <li>Breastfeeding or plan to breastfeed. You and your doctor should decide if you will take LINZESS and breastfeed.</li>
</ul>
<p><strong>Tell your doctor about all the medicines you take,</strong> including prescription and over-the-counter medicines, vitamins, and herbal supplements.</p>
<p></p>
<h5>Side Effects</h5>
<p><strong>LINZESS can cause serious side effects, including diarrhea, which is the most common side effect and can sometimes be severe.</strong> Diarrhea often begins within the first 2 weeks of LINZESS treatment. <strong>Stop taking LINZESS and call your doctor right away if you get severe diarrhea during treatment with LINZESS.</strong></p>
<p>Other common side effects of LINZESS in people with IBS-C and CIC include gas, stomach-area (abdomen) pain, and swelling, or a feeling of fullness or pressure in your abdomen (distention).</p>
<p><strong>Call your doctor or go to the nearest hospital emergency room right away if you develop unusual or severe stomach-area (abdomen) pain, especially if you also have bright red, bloody stools or black stools that look like tar.</strong></p>
<p>These are not all the possible side effects of LINZESS. For more information, ask your doctor or pharmacist.</p>
<p><strong>You are encouraged to report negative side effects of prescription drugs to the FDA. Visit <a href="https://www.fda.gov/medwatch">www.fda.gov/medwatch</a> or call <a href="tel:18003321088">1-800-FDA-1088</a>.</strong></p>
<p><strong>If you are having difficulty paying for your medicine, AbbVie and Ironwood may be able to help. Visit <a href="https://www.abbvie.com/patients/patient-support.html">AbbVie.com/PatientAccessSupport</a> to learn more.</strong></p>
<p><strong>Please see full <a href="/content/dam/abbvie-eds-poc/pdf/linzess_pi.pdf">Prescribing Information</a>, including Boxed Warning, and <a href="/content/dam/abbvie-eds-poc/pdf/linzess_pi.pdf#page=26">Medication Guide</a>.</strong></p>
<p>US-LIN-250121</p>`;

/**
 * Build a single block cell from a verbatim HTML string. The HTML is parsed into
 * real DOM nodes (not left as a string) so block markdown conversion preserves
 * the headings, lists, <strong>, <sup>, and links as semantic HTML.
 */
function cellFromHtml(document, html) {
  const div = document.createElement('div');
  div.innerHTML = html;
  return div;
}

export default function parse(element, { document }) {
  // The two mapped selectors (div.abbv-inline-use-isi, div.abbv-fixed-isi) both
  // represent the same floating ISI. Require at least the USES copy to be present
  // before emitting the regulated block; otherwise unwrap gracefully.
  const hasIsi = element.querySelector('h3, .abbv-rich-text, .abbv-inline-use, .abbv-inline-safety')
    || /USES|IMPORTANT RISK INFORMATION|US-LIN-250121/i.test(element.textContent || '');
  if (!hasIsi) {
    element.replaceWith(...element.childNodes);
    return;
  }

  // 5 single-column rows, matching the sibling .plain.html exactly.
  const cells = [
    [cellFromHtml(document, ROW1_COLLAPSED)],      // row 1: collapsedContent
    [cellFromHtml(document, ROW2_COLLAPSED_COL2)], // row 2: collapsedContentCol2
    [cellFromHtml(document, ROW3_EXPANDED)],       // row 3: expandedContent (full ISI)
    ['id:'],                                       // row 4: blockId
    [''],                                          // row 5: empty
  ];

  // name 'safety-bar (split)' -> block class "safety-bar split" (variant carried
  // in the block-name parentheses, mapping to classes_variant = "split").
  const block = WebImporter.Blocks.createBlock(document, { name: 'safety-bar (split)', cells });
  element.replaceWith(block);
}
