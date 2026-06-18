/* eslint-disable */
/* global WebImporter */

/**
 * ISI + safety-bar parser.
 *
 * The ISI/safety-bar are SHARED fragments identical across all linzess pages
 * (US-LIN-250121). This parser reproduces VERBATIM the two trailing blocks from
 * content/linzess/resources/index.plain.html:
 *   1. The ISI default-content (rendered as raw default content, NOT a block table)
 *   2. The `safety-bar split` block (5 rows: uses, iri-teaser, full-isi, "id:", empty)
 *
 * Verbatim regulated copy — zero paraphrase (pharma-content-fidelity hard rule).
 *
 * This parser builds an <hr> between the ISI default content and the safety-bar
 * so they land in two separate EDS sections (matching resources).
 *
 * @param {Element} element
 * @param {Object} ctx { document }
 */

const USES_FULL = 'LINZESS® (linaclotide) is a prescription medication used to treat irritable bowel syndrome with constipation (IBS-C) in adults and in children and adolescents 7 years of age and older, chronic idiopathic constipation (CIC) in adults, and functional constipation (FC) in children and adolescents 6 years of age and older. “Idiopathic” means the cause of the constipation is unknown. <strong>It is not known if LINZESS is safe and effective in children with functional constipation less than 6 years of age or in children with IBS-C less than 7 years of age.</strong>';

function isiDefaultContent(document) {
  const frag = document.createElement('div');
  frag.innerHTML = `
    <h3>USES</h3>
    <p>${USES_FULL}</p>
    <h3>IMPORTANT RISK INFORMATION</h3>
    <ul>
     <li><strong>Do not give LINZESS to children who are less than 2 years of age. It may harm them.</strong> LINZESS can cause severe diarrhea and your child could get severe dehydration (loss of a large amount of body water and salt).</li>
     <li>Do not take LINZESS if a doctor has told you that you have a bowel blockage (intestinal obstruction).</li>
    </ul>
    <h4>Before you take LINZESS, tell your doctor about your medical conditions, including if you are:</h4>
    <ul>
     <li>Pregnant or plan to become pregnant. It is not known if LINZESS will harm your unborn baby.</li>
     <li>Breastfeeding or plan to breastfeed. You and your doctor should decide if you will take LINZESS and breastfeed.</li>
    </ul>
    <p><strong>Tell your doctor about all the medicines you take,</strong> including prescription and over-the-counter medicines, vitamins, and herbal supplements.</p>
    <h5>Side Effects</h5>
    <p><strong>LINZESS can cause serious side effects, including diarrhea, which is the most common side effect and can sometimes be severe.</strong> Diarrhea often begins within the first 2 weeks of LINZESS treatment. <strong>Stop taking LINZESS and call your doctor right away if you get severe diarrhea during treatment with LINZESS.</strong></p>
    <p>Other common side effects of LINZESS in people with IBS-C and CIC include gas, stomach-area (abdomen) pain, and swelling, or a feeling of fullness or pressure in your abdomen (distention).</p>
    <strong>Call your doctor or go to the nearest hospital emergency room right away if you develop unusual or severe stomach-area (abdomen) pain, especially if you also have bright red, bloody stools or black stools that look like tar.</strong>
    <p>These are not all the possible side effects of LINZESS. For more information, ask your doctor or pharmacist.</p>
    <p><strong>You are encouraged to report negative side effects of prescription drugs to the FDA. Visit <a href="https://www.fda.gov/medwatch">www.fda.gov/medwatch</a> or call <a href="tel:18003321088">1-800-FDA-1088</a>.</strong> <strong>If you are having difficulty paying for your medicine, AbbVie and Ironwood may be able to help. Visit <a href="https://www.abbvie.com/patients/patient-support.html">AbbVie.com/PatientAccessSupport</a> to learn more.</strong> <strong>Please see full <a href="/content/dam/abbvie-eds-poc/pdf/linzess_pi.pdf">Prescribing Information</a>, including Boxed Warning, and <a href="https://www.rxabbvie.com/pdf/linzess_pi.pdf#page=26">Medication Guide</a>.</strong></p>
    <p>US-LIN-250121</p>
  `;
  return frag;
}

function safetyBarCell1(document) {
  const div = document.createElement('div');
  div.innerHTML = `<p></p>
<h3>USES</h3>
<p>${USES_FULL}</p>`;
  return div;
}

function safetyBarCell2(document) {
  const div = document.createElement('div');
  div.innerHTML = `<p></p>
<h3>IMPORTANT RISK INFORMATION</h3>
<p></p>
<ul>
 <li><strong>Do not give LINZESS to children who are less than 2 years of age. It may harm them.</strong> LINZESS can cause severe diarrhea and your child could get severe dehydration (loss of a large amount of body water and salt).</li>
 <li>Do not take LINZESS if a doctor has told you that you have a bowel blockage (intestinal obstruction).</li>
</ul>
<p><strong>Before you take LINZESS, tell your doctor about your medical conditions, including if you are:</strong></p>`;
  return div;
}

function safetyBarCell3(document) {
  const div = document.createElement('div');
  div.innerHTML = `<p></p>
<h3>USES</h3>
<p>${USES_FULL}</p>
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
<p><strong>Please see full</strong> <a href="/content/dam/abbvie-eds-poc/pdf/linzess_pi.pdf">Prescribing Information</a><strong>, including Boxed Warning, and</strong> <a href="https://www.rxabbvie.com/pdf/linzess_pi.pdf#page=26">Medication Guide</a><strong>.</strong></p>
<p>US-LIN-250121</p>`;
  return div;
}

export default function parse(element, { document }) {
  // 1. ISI default content section
  const isi = isiDefaultContent(document);

  // 2. safety-bar split block
  const cells = [
    ['Safety Bar (split)'],
    [safetyBarCell1(document)],
    [safetyBarCell2(document)],
    [safetyBarCell3(document)],
    ['id:'],
    [''],
  ];
  const safetyTable = WebImporter.DOMUtils.createTable(cells, document);

  // Replace placeholder element with: ISI default content + <hr> + safety-bar.
  const wrapper = document.createElement('div');
  wrapper.append(isi, document.createElement('hr'), safetyTable);
  element.replaceWith(wrapper);
}
