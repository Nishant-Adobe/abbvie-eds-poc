/* eslint-disable */
var CustomImportScript = (() => {
  var __defProp = Object.defineProperty;
  var __defProps = Object.defineProperties;
  var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
  var __getOwnPropDescs = Object.getOwnPropertyDescriptors;
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __getOwnPropSymbols = Object.getOwnPropertySymbols;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
  var __propIsEnum = Object.prototype.propertyIsEnumerable;
  var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
  var __spreadValues = (a, b) => {
    for (var prop in b || (b = {}))
      if (__hasOwnProp.call(b, prop))
        __defNormalProp(a, prop, b[prop]);
    if (__getOwnPropSymbols)
      for (var prop of __getOwnPropSymbols(b)) {
        if (__propIsEnum.call(b, prop))
          __defNormalProp(a, prop, b[prop]);
      }
    return a;
  };
  var __spreadProps = (a, b) => __defProps(a, __getOwnPropDescs(b));
  var __export = (target, all) => {
    for (var name in all)
      __defProp(target, name, { get: all[name], enumerable: true });
  };
  var __copyProps = (to, from, except, desc) => {
    if (from && typeof from === "object" || typeof from === "function") {
      for (let key of __getOwnPropNames(from))
        if (!__hasOwnProp.call(to, key) && key !== except)
          __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
    }
    return to;
  };
  var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

  // tools/importer/import-rinvoq-ra.js
  var import_rinvoq_ra_exports = {};
  __export(import_rinvoq_ra_exports, {
    default: () => import_rinvoq_ra_default
  });

  // tools/importer/parsers/ra-page.js
  function parse(element, { document }) {
    const DAM = "/content/dam/abbvie-eds-poc";
    const picture = (src, opts = {}) => {
      const pic = document.createElement("picture");
      const img = document.createElement("img");
      img.setAttribute("src", src);
      img.setAttribute("alt", opts.alt || "");
      if (opts.width) img.setAttribute("width", String(opts.width));
      if (opts.height) img.setAttribute("height", String(opts.height));
      pic.append(img);
      return pic;
    };
    const para = (html) => {
      const el = document.createElement("p");
      el.innerHTML = html;
      return el;
    };
    const heading = (level, html) => {
      const el = document.createElement(level);
      el.innerHTML = html;
      return el;
    };
    const anchor = (href, text) => {
      const a = document.createElement("a");
      a.setAttribute("href", href);
      a.textContent = text;
      return a;
    };
    const div = (...nodes) => {
      const d = document.createElement("div");
      nodes.forEach((n) => {
        if (n != null) d.append(n);
      });
      return d;
    };
    const hr = () => document.createElement("hr");
    const table = (cells) => WebImporter.DOMUtils.createTable(cells, document);
    const fromHTML = (html) => {
      const d = document.createElement("div");
      d.innerHTML = html;
      return d;
    };
    const blockFromDiv = (rootDiv, blockName) => {
      const rows = [...rootDiv.children].map(
        (rowDiv) => [...rowDiv.children].map((cellDiv) => [...cellDiv.childNodes])
      );
      return table([[blockName], ...rows]);
    };
    const sectionMeta = (customClass) => table([
      ["Section Metadata"],
      ["classes_customClass", customClass]
    ]);
    const out = document.createElement("div");
    const brandExplorer = fromHTML(`
<div class="brand-explorer">
    <div>
        <div></div>
    </div>
    <div>
        <div>Immunology Therapies</div>
    </div>
    <div>
        <div>US-MULT-250253</div>
    </div>
    <div>
        <div>Contact Medical Info</div>
    </div>
    <div>
        <div><a href="#">#</a></div>
    </div>
    <div>
        <div>Full Prescribing Information</div>
    </div>
    <div>
        <div><a href="https://www.rxabbvie.com/pdf/rinvoq_pi.pdf">https://www.rxabbvie.com/pdf/rinvoq_pi.pdf</a></div>
    </div>
    <div>
        <div>Patient Site</div>
    </div>
    <div>
        <div><a href="https://www.rinvoq.com">https://www.rinvoq.com</a></div>
    </div>
    <div>
        <div>id:</div>
    </div>
    <div>
        <div></div>
    </div>
    <div>
        <div>lang:none</div>
    </div>
    <div>
        <div><picture><img src="/content/dam/abbvie-eds-poc/brand-explorer-product-rinvoq.png" alt="RINVOQ product logo"></picture></div>
        <div>RINVOQ product logo</div>
        <div>RINVOQ</div>
        <div>Immunology</div>
        <div></div>
        <div><a href="https://www.rinvoqhcp.com/">https://www.rinvoqhcp.com/</a></div>
        <div><strong>Please see Important Safety Information, including BOXED WARNING on Serious Infections, Mortality, Malignancies, Major Adverse Cardiovascular Events, and Thrombosis.</strong></div>
        <div>Rheumatoid Arthritis|/rheumatoid-arthritis|moderate
Psoriatic Arthritis|/psoriatic-arthritis|active
Ankylosing Spondylitis|/axspa|active
Atopic Dermatitis|/atopic-dermatitis|refractory
Ulcerative Colitis|/ulcerative-colitis|moderate
Crohn's Disease|/crohns-disease|moderate</div>
    </div>
    <div>
        <div><picture><img src="/content/dam/abbvie-eds-poc/brand-explorer-product-skyrizi.png" alt="SKYRIZI product logo"></picture></div>
        <div>SKYRIZI product logo</div>
        <div>SKYRIZI</div>
        <div>Immunology</div>
        <div></div>
        <div><a href="https://www.skyrizihcp.com/">https://www.skyrizihcp.com/</a></div>
        <div><strong>Please see Important Safety Information.</strong></div>
        <div>Plaque Psoriasis|https://www.skyrizihcp.com/plaque-psoriasis|moderate
Psoriatic Arthritis|https://www.skyrizihcp.com/psoriatic-arthritis|active
Crohn's Disease|https://www.skyrizihcp.com/crohns-disease|moderate
Ulcerative Colitis|https://www.skyrizihcp.com/ulcerative-colitis|moderate</div>
    </div>
    <div>
        <div><picture><img src="/content/dam/abbvie-eds-poc/brand-explorer-product-humira.png" alt="HUMIRA product logo"></picture></div>
        <div>HUMIRA product logo</div>
        <div>HUMIRA</div>
        <div>Immunology</div>
        <div></div>
        <div><a href="https://www.humira.com/hcp">https://www.humira.com/hcp</a></div>
        <div><strong>Please see Important Safety Information, including BOXED WARNING.</strong></div>
        <div>Rheumatoid Arthritis|https://www.humira.com/hcp/ra|moderate
Crohn's Disease|https://www.humira.com/hcp/cd|moderate
Ulcerative Colitis|https://www.humira.com/hcp/uc|moderate</div>
    </div>
</div>`);
    out.append(blockFromDiv(brandExplorer.firstElementChild, "Brand Explorer"));
    out.append(hr());
    const heroHeadline = picture(`${DAM}/headline-double-arrows.png`, {
      alt: "Control that's fast and shown to last.",
      width: 1680,
      height: 296
    });
    const heroHeadlineMobile = picture(`${DAM}/headline-double-arrows-mobile--2.svg`, {
      alt: "Control that's fast and shown to last."
    });
    const heroH2 = heading("h2", "RA patients met <strong>ACR20 at Week 12 or 14</strong> (primary endpoints) and disease control through remission (DAS28-CRP &lt;2.6)\u2021 at Weeks 12 or 14 and observed up to 5 years.\xB9,\xB3\u207B\u2076");
    const heroCta1 = para("");
    heroCta1.append(anchor("/rheumatoid-arthritis/efficacy", "Explore the Data"));
    const heroCta2 = para("");
    heroCta2.append(anchor("/rheumatoid-arthritis/efficacy/rinvoq-vs-humira/select-switch-study", "See H2H Data from SELECT-SWITCH at 12 Weeks"));
    const heroText = div(
      para("")
    );
    heroText.firstElementChild.append(heroHeadline, heroHeadlineMobile);
    heroText.append(heroH2, heroCta1, heroCta2);
    const heroBadge = picture(`${DAM}/rheum-ra-access-bug-desktop--2.svg`, {
      alt: "Payers cover RINVOQ after the trial of 1 TNFi. ~99% preferred coverage as of May 2025 in RA."
    });
    out.append(table([
      ["Hero (no-padding)"],
      [picture(`${DAM}/ra-marquee-hiking.jpg`, { alt: "" })],
      [""],
      [""],
      [""],
      [heroText],
      [heroBadge],
      [""],
      [""]
    ]));
    out.append(sectionMeta("ra-hero"));
    out.append(hr());
    out.append(para("\u2021Clinical remission does not mean drug-free remission or complete absence of disease activity."));
    out.append(para("ACR20=20% improvement in American College of Rheumatology response criteria; bDMARD=biologic disease-modifying antirheumatic drug; CRP=C-reactive protein; DAS28-CRP=Disease Activity Score in 28 joints based on C-reactive protein; LDA=low disease activity; MTX=methotrexate; TNF=tumor necrosis factor; TNFi=tumor necrosis factor inhibitor; TNFi-IR=tumor necrosis factor inhibitor-inadequate responder."));
    out.append(sectionMeta("ra-hero-footnotes"));
    out.append(hr());
    const indicationRich = fromHTML(`<div><div><h3>INDICATION</h3>
<p>RINVOQ is indicated for the treatment of adults with moderately to severely active rheumatoid arthritis (RA) who have had an inadequate response or intolerance to one or more tumor necrosis factor (TNF) blockers.</p>
<p><strong>Limitations of Use:</strong> RINVOQ is not recommended for use in combination with other Janus kinase (JAK) inhibitors, biologic disease-modifying antirheumatic drugs (bDMARDs), or with potent immunosuppressants such as azathioprine and cyclosporine.</p></div></div>`);
    out.append(table([
      ["Text Container (boxed-warning)"],
      ["-"],
      ["none"],
      ["-"],
      [indicationRich.firstElementChild]
    ]));
    out.append(sectionMeta("ra-indication"));
    out.append(hr());
    const benefitCards = [
      {
        title: "Rapid Relief\xB9,\u2077,\u2078",
        body: `<ul>
<li>ACR20 achieved at Week 12 (primary endpoint), with response seen as early as Week 1 in SELECT-BEYOND</li>
<li>LDA (DAS28-CRP \u22643.2) at Week 12 in SELECT-SWITCH</li>
</ul>`,
        cta: { text: "See Remission Data at Weeks 12 and 14", href: "/rheumatoid-arthritis/efficacy#remission-lda" }
      },
      {
        title: "Durable Control\xB9,\u2074,\u2075",
        body: `<ul>
<li>Remission rates out to 5 years with or without MTX</li>
</ul>`,
        cta: { text: "See Remission Data up to ~5 Years", href: "/rheumatoid-arthritis/efficacy#durable-remission" }
      },
      {
        title: "Well-Studied Safety\xB9,\u2079,\xB9\u2070",
        body: `<ul>
<li>~9.5 years maximum exposure in RA (~4.2 years median) to RINVOQ 15 mg as of 08/2025\u2021</li>
<li>27 clinical trials across 9 indications, including an older population (mean age 71) in GCA</li>
</ul>`,
        cta: { text: "See Safety Profile", href: "/rheumatology/safety" }
      }
    ];
    const benefitCells = [["Cards Grid (cards-grid-cta-card)"]];
    benefitCards.forEach((c) => {
      const title = document.createElement("p");
      const strong = document.createElement("strong");
      strong.innerHTML = c.title;
      title.append(strong);
      const body = fromHTML(c.body);
      const ctaP = para("");
      ctaP.append(anchor(c.cta.href, c.cta.text));
      body.append(ctaP);
      benefitCells.push(["", "", title, body, "", ""]);
    });
    out.append(table(benefitCells));
    out.append(sectionMeta("ra-benefits"));
    out.append(hr());
    out.append(heading("h3", "Exceptional Patient and Access Support\xB9\xB9"));
    out.append(fromHTML(`<ul>
<li>~99% preferred combined National commercial and Medicare Part D formulary coverage under the pharmacy benefit as of November 2025 in RA\xA7||</li>
<li>1:1 support to help RA patients start and stay on track with their prescribed treatment plan</li>
<li>Get patients started on RINVOQ Complete by downloading the enrollment form</li>
</ul>`).firstElementChild);
    const accessCta1 = para("");
    accessCta1.append(anchor("/rheumatology/access", "Explore Access Information"));
    out.append(accessCta1);
    const accessCta2 = para("");
    accessCta2.append(anchor("/patient-support", "Learn About Patient Support"));
    out.append(accessCta2);
    out.append(sectionMeta("ra-access-support"));
    out.append(hr());
    out.append(para("\u2021As of 08/2025: In PsA, ~6.4 years maximum exposure (~3.6 years median) to RINVOQ 15 mg; in AS, ~3.8 years maximum exposure (~1.8 years median) to RINVOQ 15 mg; in nr-axSpA, ~2.3 years maximum exposure (~1.0 years median) to RINVOQ 15 mg.\u2079"));
    out.append(para("\xA7RINVOQ is on a preferred tier or otherwise has preferred status on the plan\u2019s formulary."));
    out.append(para("||Coverage requirements and benefit designs vary by payer and may change over time. Please consult with payers directly for the most current reimbursement policies."));
    out.append(para("ACR20=20% improvement in American College of Rheumatology response criteria; CRP=C-reactive protein; DAS28-CRP=Disease Activity Score in 28 joints based on C-reactive protein; GCA=giant cell arteritis; LDA=low disease activity; MTX=methotrexate; TNFi=tumor necrosis factor inhibitor."));
    out.append(sectionMeta("ra-access-footnotes"));
    out.append(hr());
    out.append(para("Please see Important Safety Information, including BOXED WARNING on Serious Infections, Mortality, Malignancies, Major Adverse Cardiovascular Events, and Thrombosis, below."));
    const leadInLink = para("");
    leadInLink.append(anchor("#abbv_use_statement", "Learn more about these and the full Important Safety Information below"));
    out.append(leadInLink);
    out.append(sectionMeta("ra-isi-leadin"));
    out.append(hr());
    out.append(heading("h2", "RINVOQ (upadacitinib) Met Its Primary Endpoints in 4 Trials Across Patient Populations and Comparators\xB9,\xB3,\u2077,\u2078,\xB9\xB2"));
    out.append(sectionMeta("ra-endpoints-heading"));
    out.append(hr());
    out.append(para("Primary Endpoint Results (Week 12 or 14)"));
    const chartP = para("");
    chartP.append(picture(`${DAM}/chart-ra-acr20-week12-desktop.png`, { alt: "Primary Endpoint Results (Week 12/14)." }));
    out.append(chartP);
    out.append(para("*NRI-MI (non-responder imputation incorporating multiple imputation). \u2020P\u22640.001 vs placebo. \u2021P&lt;0.001 vs HUMIRA. \xA7P=0.0001 vs methotrexate."));
    const comparatorRich = fromHTML(`<div><div><p>RINVOQ is indicated for moderate to severe RA in adult TNFi-IR patients.<br>RINVOQ has a Boxed Warning on Serious Infections, Mortality, Malignancy, Major Adverse Cardiovascular Events, and Thrombosis.<br>HUMIRA is indicated in adults with moderate to severe active RA.<br>HUMIRA has a Boxed Warning for Serious Infections and Malignancy.<br>Details about these Boxed Warnings and other risks can be found throughout.</p></div></div>`);
    out.append(table([
      ["Text Container (boxed-warning)"],
      ["-"],
      ["none"],
      ["-"],
      [comparatorRich.firstElementChild]
    ]));
    out.append(para("<strong>Clinical decisions regarding treatment selection should take into account all relevant information, including full benefit/risk profiles in each product\u2019s PI.</strong>"));
    const humiraPiLink = para("");
    humiraPiLink.append(anchor("https://www.rxabbvie.com/pdf/humira.pdf", "HUMIRA Prescribing Information"));
    out.append(humiraPiLink);
    const studyCards = [
      {
        title: "SELECT-BEYOND (RA-V)",
        body: "A randomized, double-blind, placebo-controlled trial evaluating RINVOQ 15 mg in adults with moderately to severely active RA who had an inadequate response or intolerance to bDMARDs.",
        href: `${DAM}/study-design-select-beyong-v0a.png`
      },
      {
        title: "SELECT-COMPARE (RA-IV)",
        body: "A randomized, double-blind, placebo- and active-controlled trial evaluating RINVOQ 15 mg vs placebo and vs HUMIRA in adults with moderately to severely active RA on background methotrexate.",
        href: `${DAM}/study-design-select-compare.png`
      },
      {
        title: "SELECT-MONOTHERAPY (RA-II)",
        body: "A randomized, double-blind trial evaluating RINVOQ 15 mg monotherapy vs continued methotrexate in adults with moderately to severely active RA who had an inadequate response to methotrexate.",
        href: `${DAM}/study-design-select-mono.png`
      },
      {
        title: "SELECT-SWITCH",
        body: "A head-to-head trial evaluating RINVOQ 15 mg vs HUMIRA in adults with moderately to severely active RA who had an inadequate response to a prior TNF blocker.",
        href: `${DAM}/study-design-select-switch.png`
      }
    ];
    const studyCells = [["Cards Grid (cards-grid-cta-card)"]];
    studyCards.forEach((c) => {
      const title = document.createElement("p");
      const strong = document.createElement("strong");
      strong.textContent = c.title;
      title.append(strong);
      const body = div(para(c.body));
      const ctaP = para("");
      ctaP.append(anchor(c.href, "See Study Details"));
      body.append(ctaP);
      studyCells.push(["", "", title, body, "", ""]);
    });
    out.append(table(studyCells));
    const acrLink = para("");
    acrLink.append(anchor("#", "See ACR Response Criteria"));
    out.append(acrLink);
    out.append(para("ACR20=20% improvement in American College of Rheumatology response criteria; bDMARD=biologic disease-modifying antirheumatic drug; NRI-MI=non-responder imputation incorporating multiple imputation; RA=rheumatoid arthritis; TNF=tumor necrosis factor."));
    out.append(sectionMeta("ra-primary-endpoints"));
    out.append(hr());
    const isiBoxedRich = fromHTML(`<div><div><h3>IMPORTANT SAFETY INFORMATION &amp; INDICATIONS</h3>
<h3>INDICATIONS\xB9</h3>
<p><strong>RINVOQ is indicated for the treatment of:</strong></p>
<ul>
<li><strong>Moderately to severely active rheumatoid arthritis (RA)</strong> in adults who have had an inadequate response or intolerance to one or more tumor necrosis factor (TNF) blockers.</li>
<li><strong>Active ankylosing spondylitis (AS)</strong> in adults who have had an inadequate response or intolerance to one or more TNF blockers.</li>
<li><strong>Active non-radiographic axial spondyloarthritis (nr-axSpA)</strong> with objective signs of inflammation in adults who have had an inadequate response or intolerance to TNF blocker therapy.</li>
<li><strong>Giant cell arteritis (GCA)</strong> in adults.</li>
</ul>
<p><strong>Limitations of Use:</strong> RINVOQ is not recommended for use in combination with other Janus kinase (JAK) inhibitors, biologic disease-modifying antirheumatic drugs (bDMARDs), or with potent immunosuppressants such as azathioprine and cyclosporine.</p>
<ul>
<li><strong>Refractory, moderate to severe atopic dermatitis (AD)</strong> in adults and pediatric patients 12 years of age and older whose disease is not adequately controlled with other systemic drug products, including biologics, or when use of those therapies is inadvisable.</li>
</ul>
<p><strong>Limitations of Use:</strong> RINVOQ is not recommended for use in combination with other JAK inhibitors, biologic immunomodulators, or other immunosuppressants.</p>
<ul>
<li><strong>Moderately to severely active ulcerative colitis (UC)</strong> in adults who have had an inadequate response or intolerance to one or more TNF blockers.</li>
<li><strong>Moderately to severely active Crohn's disease (CD)</strong> in adults who have had an inadequate response or intolerance to one or more TNF blockers.</li>
</ul>
<p><strong>Limitations of Use:</strong> RINVOQ is not recommended for use in combination with other JAK inhibitors, biological therapies for UC or CD, or with potent immunosuppressants such as azathioprine and cyclosporine.</p>
<p><strong>RINVOQ/RINVOQ LQ is indicated for the treatment of:</strong></p>
<ul>
<li><strong>Active psoriatic arthritis (PsA)</strong> in adults and pediatric patients 2 years of age and older who have had an inadequate response or intolerance to one or more TNF blockers.</li>
<li><strong>Active polyarticular juvenile idiopathic arthritis (pJIA)</strong> in patients 2 years of age and older who have had an inadequate response or intolerance to one or more TNF blockers.</li>
</ul>
<p><strong>Limitations of Use:</strong> RINVOQ/RINVOQ LQ is not recommended for use in combination with other JAK inhibitors, bDMARDs, or with potent immunosuppressants such as azathioprine and cyclosporine.</p></div></div>`);
    out.append(table([
      ["Text Container (boxed-warning)"],
      ["-"],
      ["none"],
      ["-"],
      [isiBoxedRich.firstElementChild]
    ]));
    out.append(hr());
    const isiLegal = fromHTML(`<div class="text-container legal">
    <div><div>legal</div></div>
    <div><div>-</div></div>
    <div><div>none</div></div>
    <div><div>-</div></div>
    <div><div><div><h3>IMPORTANT SAFETY INFORMATION FOR RINVOQ/RINVOQ LQ (upadacitinib)</h3>
<h4>SERIOUS INFECTIONS</h4>
<p><strong>Patients treated with RINVOQ are at increased risk for developing serious infections that may lead to hospitalization or death. Most patients who developed these infections were taking concomitant immunosuppressants, such as methotrexate or corticosteroids. If a serious infection develops, interrupt RINVOQ until the infection is controlled.</strong></p>
<p><strong>Reported infections include:</strong></p>
<ul>
<li><strong>Active tuberculosis (TB), which may present with pulmonary or extrapulmonary disease.</strong></li>
<li><strong>Invasive fungal infections, including cryptococcosis and pneumocystosis.</strong></li>
<li><strong>Bacterial, viral, including herpes zoster, and other infections due to opportunistic pathogens.</strong></li>
</ul>
<p><strong>Carefully consider the risks and benefits of treatment with RINVOQ prior to initiating therapy in patients with chronic or recurrent infection.</strong></p>
<h4>MORTALITY</h4>
<p><strong>In a large, randomized, postmarketing safety study comparing another JAK inhibitor with TNF blockers in RA patients &ge;50 years old with at least one cardiovascular risk factor, a higher rate of all-cause mortality, including sudden CV death, was observed with the JAK inhibitor.</strong></p>
<h4>MALIGNANCIES</h4>
<p><strong>Lymphoma and other malignancies have been observed in patients treated with RINVOQ. In a large, randomized, postmarketing safety study comparing another JAK inhibitor with TNF blockers in RA patients, a higher rate of malignancies (excluding NMSC), lymphomas, and lung cancer (in current or past smokers) was observed with the JAK inhibitor.</strong></p>
<h4>MAJOR ADVERSE CARDIOVASCULAR EVENTS (MACE)</h4>
<p><strong>In a large, randomized, postmarketing study comparing another JAK inhibitor with TNF blockers in RA patients &ge;50 years old with at least one CV risk factor, a higher rate of MACE was observed with the JAK inhibitor. Discontinue RINVOQ in patients that have experienced a myocardial infarction or stroke.</strong></p>
<h4>THROMBOSIS</h4>
<p><strong>Thromboses, including deep venous thrombosis, pulmonary embolism, and arterial thrombosis, have occurred in patients treated for inflammatory conditions with JAK inhibitors, including RINVOQ. Many of these adverse events were serious and some resulted in death.</strong></p>
<h4>HYPERSENSITIVITY</h4>
<p>RINVOQ is <strong>contraindicated</strong> in patients with known hypersensitivity to upadacitinib or any of its excipients.</p>
<h4>GASTROINTESTINAL PERFORATIONS</h4>
<p>Gastrointestinal (GI) perforations have been reported in clinical trials with RINVOQ.</p>
<h4>LABORATORY ABNORMALITIES</h4>
<p><strong>Neutropenia:</strong> Treatment with RINVOQ was associated with an increased incidence of neutropenia (ANC &lt;1000 cells/mm\xB3).</p>
<p><strong>Lymphopenia:</strong> ALC &lt;500 cells/mm\xB3 were reported in RINVOQ-treated patients.</p>
<p><strong>Anemia:</strong> Decreases in hemoglobin levels to &lt;8 g/dL were reported.</p>
<p><strong>Lipids:</strong> Treatment with RINVOQ was associated with increases in lipid parameters.</p>
<p><strong>Liver enzyme elevations:</strong> Treatment with RINVOQ was associated with increased incidence of liver enzyme elevation.</p>
<h4>EMBRYO-FETAL TOXICITY</h4>
<p>Based on findings in animal studies, RINVOQ may cause fetal harm when administered to a pregnant woman.</p>
<h4>VACCINATION</h4>
<p>Avoid use of live vaccines during, or immediately prior to, RINVOQ therapy.</p>
<h4>MEDICATION RESIDUE IN STOOL</h4>
<p>Reports of medication residue in stool or ostomy output have occurred in patients taking RINVOQ.</p>
<h4>LACTATION</h4>
<p>Breastfeeding is not recommended during treatment with RINVOQ and for 6 days after the last dose.</p>
<h4>HEPATIC IMPAIRMENT</h4>
<p>RINVOQ is not recommended for use in patients with severe hepatic impairment.</p>
<h4>ADVERSE REACTIONS</h4>
<p>The most common adverse reactions in RINVOQ clinical trials were upper respiratory tract infections, herpes zoster, herpes simplex, bronchitis, nausea, cough, pyrexia, acne, headache, peripheral edema, increased blood creatine phosphokinase, hypersensitivity, folliculitis, abdominal pain, increased weight, influenza, fatigue, neutropenia, myalgia, influenza-like illness, elevated liver enzymes, rash, and anemia.</p>
<p><strong>Dosage Forms and Strengths:</strong> RINVOQ is available in 15 mg, 30 mg, and 45 mg extended-release tablets. RINVOQ LQ is available in a 1 mg/mL oral solution.</p>
<p>US-RNQ-250017</p>
<p>Please see full <a href="https://www.rxabbvie.com/pdf/rinvoq_pi.pdf">Prescribing Information</a>.</p></div></div></div>
</div>`);
    {
      const legalRoot = isiLegal.firstElementChild;
      legalRoot.removeChild(legalRoot.firstElementChild);
      out.append(blockFromDiv(legalRoot, "Text Container (legal)"));
    }
    out.append(hr());
    const referencesRich = fromHTML(`<div><div><div><p><strong>REFERENCES:</strong></p>
<ol>
<li>RINVOQ [package insert]. North Chicago, IL: AbbVie Inc.</li>
<li>Data on file. AbbVie Inc. #1 Badge. 2025.</li>
<li>Smolen JS, Pangan AL, Emery P, et al. Upadacitinib as monotherapy in patients with active rheumatoid arthritis and inadequate response to methotrexate (SELECT-MONOTHERAPY): a randomised, placebo-controlled, double-blind phase 3 study. <em>Lancet</em>. 2019;393(10188):2303-2311. doi:10.1016/S0140-6736(19)30419-2</li>
<li>Smolen JS, Emery P, Rigby W, et al. Long-term efficacy and safety of upadacitinib through 260 weeks from SELECT-MONOTHERAPY. EULAR May 31-June 3, 2023; Milan, Italy.</li>
<li>Fleischmann R, Meerwein S, Charles-Schoeman C, et al. Long-term safety and efficacy of upadacitinib over 5 years from SELECT-BEYOND. <em>RMD Open</em>. 2024:10(3):e003918. doi:10.1136/rmdopen-2023-003918</li>
<li>Data on File. ABVRRTI72945.</li>
<li>Genovese MC, Fleischmann R, Combe B, et al. Safety and efficacy of upadacitinib in patients with active rheumatoid arthritis refractory to biologic disease-modifying anti-rheumatic drugs (SELECT-BEYOND): a double-blind, randomised controlled phase 3 trial. <em>Lancet</em>. 2018;391(10139):2513-2524.</li>
<li>Data on File. ABVRRTI82077.</li>
<li>Data on File. ABVRRTI81830.</li>
<li>Blockmans D, Penn SK, Setty AR, et al. Upadacitinib in patients with giant-cell arteritis. <em>NEJM</em>. 2025;1-11. doi:10.1056/NEJMoa2413449</li>
<li>Data on File, AbbVie Inc. Source: AbbVie internal analytics and MMIT. Database as of November 2025.</li>
<li>Fleischmann R, Pangan AL, Song I-H, et al. Upadacitinib versus placebo or adalimumab in patients with rheumatoid arthritis and an inadequate response to methotrexate: results of a phase 3, double-blind, randomized controlled trial. <em>Arthritis Rheumatol</em>. 2019;71(11):1788-1800. doi:10.1002/art.41032</li>
<li>AbbVie Inc. Protocol M23-700. SELECT-SWITCH. EUCT number 2022-502578-18-00. Accessed November 21, 2025.</li>
</ol></div></div></div>`);
    out.append(table([
      ["Text Container (references)"],
      ["-"],
      ["none"],
      ["-"],
      [referencesRich.firstElementChild]
    ]));
    out.append(hr());
    const safetyBar = fromHTML(`<div class="safety-bar split">
    <div>
        <div><p><strong>INDICATIONS &amp; IMPORTANT SAFETY INFORMATION:</strong></p></div>
    </div>
    <div>
        <div><p><strong>WARNING:</strong> Serious Infections, Mortality, Malignancies, Major Adverse Cardiovascular Events, and Thrombosis</p></div>
    </div>
    <div>
        <div><p><strong>IMPORTANT SAFETY INFORMATION &amp; INDICATIONS\xB9</strong></p>
<h3>INDICATIONS\xB9</h3>
<p><strong>RINVOQ is indicated for the treatment of:</strong></p>
<ul>
<li><strong>Moderately to severely active rheumatoid arthritis (RA)</strong> in adults who have had an inadequate response or intolerance to one or more tumor necrosis factor (TNF) blockers.</li>
<li><strong>Active ankylosing spondylitis (AS)</strong> in adults who have had an inadequate response or intolerance to one or more TNF blockers.</li>
<li><strong>Active non-radiographic axial spondyloarthritis (nr-axSpA)</strong> with objective signs of inflammation in adults who have had an inadequate response or intolerance to TNF blocker therapy.</li>
<li><strong>Giant cell arteritis (GCA)</strong> in adults.</li>
</ul>
<p><strong>Limitations of Use:</strong> RINVOQ is not recommended for use in combination with other Janus kinase (JAK) inhibitors, biologic disease-modifying antirheumatic drugs (bDMARDs), or with potent immunosuppressants such as azathioprine and cyclosporine.</p>
<ul>
<li><strong>Refractory, moderate to severe atopic dermatitis (AD)</strong> in adults and pediatric patients 12 years of age and older whose disease is not adequately controlled with other systemic drug products, including biologics, or when use of those therapies is inadvisable.</li>
</ul>
<p><strong>Limitations of Use:</strong> RINVOQ is not recommended for use in combination with other JAK inhibitors, biologic immunomodulators, or other immunosuppressants.</p>
<ul>
<li><strong>Moderately to severely active ulcerative colitis (UC)</strong> in adults who have had an inadequate response or intolerance to one or more TNF blockers. If TNF blockers are clinically inadvisable, patients should have received at least one approved systemic therapy prior to use of RINVOQ.</li>
<li><strong>Moderately to severely active Crohn's disease (CD)</strong> in adults who have had an inadequate response or intolerance to one or more TNF blockers. If TNF blockers are clinically inadvisable, patients should have received at least one approved systemic therapy prior to use of RINVOQ.</li>
</ul>
<p><strong>Limitations of Use:</strong> RINVOQ is not recommended for use in combination with other JAK inhibitors, biological therapies for UC or CD, or with potent immunosuppressants such as azathioprine and cyclosporine.</p>
<p><strong>RINVOQ/RINVOQ LQ is indicated for the treatment of:</strong></p>
<ul>
<li><strong>Active psoriatic arthritis (PsA)</strong> in adults and pediatric patients 2 years of age and older who have had an inadequate response or intolerance to one or more TNF blockers.</li>
<li><strong>Active polyarticular juvenile idiopathic arthritis (pJIA)</strong> in patients 2 years of age and older who have had an inadequate response or intolerance to one or more TNF blockers.</li>
</ul>
<p><strong>Limitations of Use:</strong> RINVOQ/RINVOQ LQ is not recommended for use in combination with other JAK inhibitors, bDMARDs, or with potent immunosuppressants such as azathioprine and cyclosporine.</p>
<h3>IMPORTANT SAFETY INFORMATION FOR RINVOQ/RINVOQ LQ (upadacitinib)</h3>
<h4>SERIOUS INFECTIONS</h4>
<p><strong>Patients treated with RINVOQ* are at increased risk for developing serious infections that may lead to hospitalization or death. Most patients who developed these infections were taking concomitant immunosuppressants, such as methotrexate or corticosteroids. If a serious infection develops, interrupt RINVOQ until the infection is controlled.</strong></p>
<p><strong>Reported infections include:</strong></p>
<ul>
<li><strong>Active tuberculosis (TB), which may present with pulmonary or extrapulmonary disease. Test patients for latent TB before RINVOQ use and during therapy. Consider treatment for latent TB infection prior to RINVOQ use.</strong></li>
<li><strong>Invasive fungal infections, including cryptococcosis and pneumocystosis.</strong></li>
<li><strong>Bacterial, viral, including herpes zoster, and other infections due to opportunistic pathogens.</strong></li>
</ul>
<p><strong>Carefully consider the risks and benefits of treatment with RINVOQ prior to initiating therapy in patients with chronic or recurrent infection. Monitor patients closely for the development of signs and symptoms of infection during and after treatment with RINVOQ, including the possible development of TB in patients who tested negative for latent TB infection prior to initiating therapy.</strong></p>
<h4>MORTALITY</h4>
<p><strong>In a large, randomized, postmarketing safety study comparing another Janus kinase (JAK) inhibitor with tumor necrosis factor (TNF) blockers in rheumatoid arthritis (RA) patients &ge;50 years old with at least one cardiovascular (CV) risk factor, a higher rate of all-cause mortality, including sudden CV death, was observed with the JAK inhibitor.</strong> Consider the benefits and risks for the individual patient prior to initiating or continuing therapy with RINVOQ.</p>
<h4>MALIGNANCIES</h4>
<p><strong>Lymphoma and other malignancies have been observed in patients treated with RINVOQ.</strong></p>
<p><strong>In a large, randomized, postmarketing safety study comparing another JAK inhibitor with TNF blockers in RA patients, a higher rate of malignancies (excluding non-melanoma skin cancer [NMSC]), lymphomas, and lung cancer (in current or past smokers) was observed with the JAK inhibitor. Patients who are current or past smokers are at additional increased risk.</strong></p>
<p>With RINVOQ, consider the benefits and risks for the individual patient prior to initiating or continuing therapy, particularly in patients with a known malignancy (other than a successfully treated NMSC), patients who develop a malignancy when on treatment, and patients who are current or past smokers. NMSCs have been reported in patients treated with RINVOQ. Periodic skin examination is recommended for patients who are at increased risk for skin cancer. Advise patients to limit sunlight exposure by wearing protective clothing and using sunscreen.</p>
<h4>MAJOR ADVERSE CARDIOVASCULAR EVENTS (MACE)</h4>
<p><strong>In a large, randomized, postmarketing study comparing another JAK inhibitor with TNF blockers in RA patients &ge;50 years old with at least one CV risk factor, a higher rate of MACE (defined as cardiovascular death, myocardial infarction, and stroke) was observed with the JAK inhibitor. Patients who are current or past smokers are at additional increased risk. Discontinue RINVOQ in patients that have experienced a myocardial infarction or stroke.</strong></p>
<p>Consider the benefits and risks for the individual patient prior to initiating or continuing therapy with RINVOQ, particularly in patients who are current or past smokers and patients with other CV risk factors. Patients should be informed about the symptoms of serious CV events and the steps to take if they occur.</p>
<h4>THROMBOSIS</h4>
<p><strong>Thromboses, including deep venous thrombosis, pulmonary embolism, and arterial thrombosis, have occurred in patients treated for inflammatory conditions with JAK inhibitors, including RINVOQ. Many of these adverse events were serious and some resulted in death.</strong></p>
<p><strong>In a large, randomized, postmarketing study comparing another JAK inhibitor to TNF blockers in RA patients &ge;50 years old with at least one CV risk factor, a higher rate of thrombosis was observed with the JAK inhibitor. Avoid RINVOQ in patients at risk. Patients with symptoms of thrombosis should discontinue RINVOQ and be promptly evaluated.</strong></p>
<h4>HYPERSENSITIVITY</h4>
<p>RINVOQ is <strong>contraindicated</strong> in patients with known hypersensitivity to upadacitinib or any of its excipients. Serious hypersensitivity reactions, such as anaphylaxis and angioedema, were reported in patients receiving RINVOQ in clinical trials. If a clinically significant hypersensitivity reaction occurs, discontinue RINVOQ and institute appropriate therapy.</p>
<h4>GASTROINTESTINAL PERFORATIONS</h4>
<p>Gastrointestinal (GI) perforations have been reported in clinical trials with RINVOQ. Monitor RINVOQ-treated patients who may be at risk for GI perforation (e.g., patients with a history of diverticulitis and patients taking NSAIDs or corticosteroids). Promptly evaluate patients presenting with new onset abdominal pain for early identification of GI perforation.</p>
<h4>LABORATORY ABNORMALITIES</h4>
<p><strong>Neutropenia</strong><br>Treatment with RINVOQ was associated with an increased incidence of neutropenia (absolute neutrophil count [ANC] &lt;1000 cells/mm\xB3). Treatment with RINVOQ is not recommended in patients with an ANC &lt;1000 cells/mm\xB3. Evaluate neutrophil counts at baseline and thereafter according to routine patient management.</p>
<p><strong>Lymphopenia</strong><br>Absolute lymphocyte counts (ALC) &lt;500 cells/mm\xB3 were reported in RINVOQ-treated patients. Treatment with RINVOQ is not recommended in patients with an ALC &lt;500 cells/mm\xB3. Evaluate at baseline and thereafter according to routine patient management.</p>
<p><strong>Anemia</strong><br>Decreases in hemoglobin levels to &lt;8 g/dL were reported in RINVOQ-treated patients. Treatment should not be initiated or should be interrupted in patients with hemoglobin levels &lt;8 g/dL. Evaluate at baseline and thereafter according to routine patient management.</p>
<p><strong>Lipids</strong><br>Treatment with RINVOQ was associated with increases in lipid parameters, including total cholesterol, low-density lipoprotein (LDL) cholesterol, and high-density lipoprotein (HDL) cholesterol. Manage patients according to clinical guidelines for the management of hyperlipidemia. Evaluate patients 12 weeks after initiation of treatment and thereafter according to the clinical guidelines for hyperlipidemia.</p>
<p><strong>Liver enzyme elevations</strong><br>Treatment with RINVOQ was associated with increased incidence of liver enzyme elevation compared to placebo. Evaluate at baseline and thereafter according to routine patient management. Prompt investigation of the cause of liver enzyme elevation is recommended to identify potential cases of drug-induced liver injury. If increases in aspartate aminotransferase (AST) or alanine aminotransferase (ALT) are observed during routine patient management and drug-induced liver injury is suspected, RINVOQ should be interrupted until this diagnosis is excluded.</p>
<h4>EMBRYO-FETAL TOXICITY</h4>
<p>Based on findings in animal studies, RINVOQ may cause fetal harm when administered to a pregnant woman. Advise pregnant women of the potential risk to a fetus. Advise females of reproductive potential to use effective contraception during treatment with RINVOQ and for 4 weeks after the final dose. Verify pregnancy status of females of reproductive potential prior to starting treatment with RINVOQ.</p>
<h4>VACCINATION</h4>
<p>Avoid use of live vaccines during, or immediately prior to, RINVOQ therapy. Prior to initiating RINVOQ, patients should be brought up to date on all immunizations, including prophylactic varicella zoster or herpes zoster vaccinations, in agreement with current immunization guidelines.</p>
<h4>MEDICATION RESIDUE IN STOOL</h4>
<p>Reports of medication residue in stool or ostomy output have occurred in patients taking RINVOQ. Most reports described anatomic or functional GI conditions with shortened GI transit times. Instruct patients to contact their healthcare provider if medication residue is observed repeatedly. Monitor patients clinically and consider alternative treatment if there is an inadequate therapeutic response.</p>
<h4>LACTATION</h4>
<p>There are no data on the presence of RINVOQ in human milk, the effects on the breastfed infant, or the effects on milk production. Available data in animals have shown the excretion of RINVOQ in milk. Advise patients that breastfeeding is not recommended during treatment with RINVOQ and for 6 days after the last dose.</p>
<h4>HEPATIC IMPAIRMENT</h4>
<p>RINVOQ is not recommended for use in patients with severe hepatic impairment.</p>
<h4>ADVERSE REACTIONS</h4>
<p>The most common adverse reactions in RINVOQ clinical trials were upper respiratory tract infections, herpes zoster, herpes simplex, bronchitis, nausea, cough, pyrexia, acne, headache, peripheral edema, increased blood creatine phosphokinase, hypersensitivity, folliculitis, abdominal pain, increased weight, influenza, fatigue, neutropenia, myalgia, influenza-like illness, elevated liver enzymes, rash, and anemia.</p>
<p>Inform patients that retinal detachment has been reported in clinical trials with RINVOQ. Advise patients to immediately inform their healthcare provider if they develop any sudden changes in vision while receiving RINVOQ.</p>
<p><strong>Dosage Forms and Strengths:</strong> RINVOQ is available in 15 mg, 30 mg, and 45 mg extended-release tablets. RINVOQ LQ is available in a 1 mg/mL oral solution.</p>
<p>*Unless otherwise stated, &ldquo;RINVOQ&rdquo; in the IMPORTANT SAFETY INFORMATION refers to RINVOQ and RINVOQ LQ.</p>
<p>US-RNQ-250017</p>
<p>Please see full <a href="https://www.rxabbvie.com/pdf/rinvoq_pi.pdf">Prescribing Information</a>.</p></div>
    </div>
    <div>
        <div>split</div>
    </div>
    <div>
        <div>id:rinvoq-hcp-ra-safety-bar</div>
    </div>
    <div>
        <div>lang:none</div>
    </div>
</div>`);
    out.append(blockFromDiv(safetyBar.firstElementChild, "Safety Bar (split)"));
    element.replaceChildren(...out.childNodes);
  }

  // tools/importer/transformers/cleanup.js
  function transform(hookName, element, payload) {
    const { document } = payload;
    if (hookName === "beforeTransform") {
      WebImporter.DOMUtils.remove(element, [
        "header",
        "footer",
        "nav",
        ".header",
        ".footer",
        ".navigation",
        "script",
        "style",
        "noscript",
        'link[rel="stylesheet"]',
        "iframe",
        // cookie / consent
        "#onetrust-consent-sdk",
        "#onetrust-banner-sdk",
        ".onetrust-pc-dark-filter",
        ".ot-sdk-container",
        // modals / overlays
        ".modal.parbase",
        ".modal",
        ".overlay",
        // brand chrome / floating bars / save-on-linzess top bar
        ".brand-explorer",
        ".save-on-linzess",
        ".isi-tray",
        ".floating-isi",
        ".sticky-isi",
        ".safety-bar-floating"
      ]);
      return;
    }
    if (hookName === "afterTransform") {
      element.querySelectorAll("[style]").forEach((el) => el.removeAttribute("style"));
      element.querySelectorAll("[class]").forEach((el) => {
        if (el.tagName === "TABLE" || el.closest("table")) return;
      });
    }
  }

  // tools/importer/transformers/sections.js
  function transform2(hookName, element, payload) {
    if (hookName !== "afterTransform") return;
    const hrs = [...element.querySelectorAll(":scope > hr")];
    hrs.forEach((hr) => {
      let next = hr.nextElementSibling;
      while (next && next.tagName === "HR") {
        const toRemove = next;
        next = next.nextElementSibling;
        toRemove.remove();
      }
    });
    const first = element.firstElementChild;
    if (first && first.tagName === "HR") first.remove();
    const last = element.lastElementChild;
    if (last && last.tagName === "HR") last.remove();
  }

  // tools/importer/import-rinvoq-ra.js
  var parsers = {
    "ra-page": parse
  };
  var PAGE_TEMPLATE = {
    name: "rinvoq-ra",
    description: "RINVOQ HCP Rheumatoid Arthritis condition landing page (single page migration). brand-explorer + hero(no-padding) + footnotes + indication(boxed-warning) + benefit cards(cards-grid-cta-card) + access support + ISI lead-in + primary endpoints chart + study cards + ISI(boxed-warning/legal) + references + safety-bar split + metadata.",
    urls: [
      "https://www.rinvoqhcp.com/rheumatoid-arthritis"
    ],
    blocks: [
      {
        name: "ra-page",
        // No <main> on the live page; `body` is the single deterministic anchor.
        instances: ["body"]
      }
    ],
    sections: [
      { id: "brand-explorer", name: "Brand Explorer", style: "" },
      { id: "ra-hero", name: "Hero", style: "ra-hero" },
      { id: "ra-hero-footnotes", name: "Hero Footnotes", style: "ra-hero-footnotes" },
      { id: "ra-indication", name: "Indication", style: "ra-indication" },
      { id: "ra-benefits", name: "Benefits", style: "ra-benefits" },
      { id: "ra-isi-leadin", name: "ISI Lead-in", style: "ra-isi-leadin" },
      { id: "ra-primary-endpoints", name: "Primary Endpoints", style: "ra-primary-endpoints" },
      { id: "isi-boxed-warning", name: "ISI Boxed Warning", style: "" },
      { id: "isi-legal", name: "ISI Legal", style: "" },
      { id: "references", name: "References", style: "" },
      { id: "safety-bar", name: "Safety Bar", style: "" }
    ]
  };
  var transformers = [
    transform,
    ...PAGE_TEMPLATE.sections && PAGE_TEMPLATE.sections.length > 1 ? [transform2] : []
  ];
  function executeTransformers(hookName, element, payload) {
    const enhancedPayload = __spreadProps(__spreadValues({}, payload), { template: PAGE_TEMPLATE });
    transformers.forEach((transformerFn) => {
      try {
        transformerFn.call(null, hookName, element, enhancedPayload);
      } catch (e) {
        console.error(`Transformer failed at ${hookName}:`, e);
      }
    });
  }
  function findBlocksOnPage(document, template) {
    const pageBlocks = [];
    template.blocks.forEach((blockDef) => {
      blockDef.instances.forEach((selector) => {
        const elements = document.querySelectorAll(selector);
        if (elements.length === 0) {
          console.warn(`Block "${blockDef.name}" selector not found: ${selector}`);
        }
        elements.forEach((element) => {
          pageBlocks.push({
            name: blockDef.name,
            selector,
            element,
            section: blockDef.section || null
          });
        });
      });
    });
    console.log(`Found ${pageBlocks.length} block instances on page`);
    return pageBlocks;
  }
  function appendMetadata(main, document) {
    const cells = [
      ["Metadata"],
      ["brand", "rinvoq-hcp"],
      ["nav", "/rinvoq-hcp/nav"],
      ["footer", "/rinvoq-hcp/footer"],
      ["title", "RINVOQ\xAE (upadacitinib) for Rheumatoid Arthritis"],
      ["description", "RINVOQ (upadacitinib) is indicated for moderate to severe RA in adult TNFi-IR patients. Met primary endpoints in 4 trials. See full PI and Important Safety Information, including BOXED WARNING."]
    ];
    const block = WebImporter.DOMUtils.createTable(cells, document);
    const section = document.createElement("div");
    section.append(block);
    main.append(section);
  }
  var import_rinvoq_ra_default = {
    transform: (payload) => {
      const { document, url, params } = payload;
      const main = document.body;
      executeTransformers("beforeTransform", main, payload);
      const pageBlocks = findBlocksOnPage(document, PAGE_TEMPLATE);
      pageBlocks.forEach((block) => {
        if (!block.element.parentNode && block.element !== document.body) return;
        const parser = parsers[block.name];
        if (parser) {
          try {
            parser(block.element, { document, url, params });
          } catch (e) {
            console.error(`Failed to parse ${block.name} (${block.selector}):`, e);
          }
        } else {
          console.warn(`No parser found for block: ${block.name}`);
        }
      });
      executeTransformers("afterTransform", main, payload);
      const hr = document.createElement("hr");
      main.appendChild(hr);
      appendMetadata(main, document);
      WebImporter.rules.transformBackgroundImages(main, document);
      WebImporter.rules.adjustImageUrls(main, url, params.originalURL);
      const sourcePath = new URL(params.originalURL).pathname.replace(/\/$/, "").replace(/\.html$/, "");
      const path = WebImporter.FileUtils.sanitizePath(`/rinvoq-hcp${sourcePath}`);
      return [{
        element: main,
        path,
        report: {
          title: document.title,
          template: PAGE_TEMPLATE.name,
          blocks: pageBlocks.map((b) => b.name)
        }
      }];
    }
  };
  return __toCommonJS(import_rinvoq_ra_exports);
})();
