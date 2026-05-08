const LINE1_CLASS = 'card-grid-item-line-1 abbv-icon-keyboard_arrow_right i-a';
const LINE2_CLASS = 'card-grid-item-line-2';
const LINE3_CLASS = 'card-grid-item-line-3';
const LINE4_CLASS = 'card-grid-item-line-4';
const RISA_CLASS = 'card-grid-item-risa-pri';

function decorateLine1(card) {
  if (!card) return;
  const firstDiv = card.firstElementChild;
  if (firstDiv?.tagName !== 'DIV') return;
  const span = document.createElement('span');
  span.className = LINE1_CLASS;
  while (firstDiv.firstChild) {
    span.append(firstDiv.firstChild);
  }
  firstDiv.replaceWith(span);

  const innerP = span.querySelector('p');
  if (!innerP) return;

  const raw = innerP.textContent.trim();
  if (raw.includes('|')) {
    const segments = raw.split('|').map((s) => s.trim()).filter((s) => s.length > 0);
    const left = segments[0];
    const right = segments.slice(1).join(' ');
    innerP.remove();
    const risa = document.createElement('span');
    risa.className = RISA_CLASS;
    risa.textContent = left;
    span.append(risa);
    if (right) {
      span.append(document.createTextNode(` ${right}`));
    }
    return;
  }

  const innerSpan = document.createElement('span');
  innerSpan.className = RISA_CLASS;
  while (innerP.firstChild) {
    innerSpan.append(innerP.firstChild);
  }
  innerP.replaceWith(innerSpan);
}

/** Unwrap a single direct child `<p>` inside a line span (UE column markup). */
function unwrapDirectParagraph(span) {
  const lineP = span.querySelector(':scope > p');
  if (!lineP) return;
  while (lineP.firstChild) {
    span.insertBefore(lineP.firstChild, lineP);
  }
  lineP.remove();
}

function decorateLine2(card) {
  if (!card) return;
  const lineDiv = [...card.children].find((el) => el.tagName === 'DIV');
  if (!lineDiv) return;
  const span = document.createElement('span');
  span.className = LINE2_CLASS;
  while (lineDiv.firstChild) {
    span.append(lineDiv.firstChild);
  }
  lineDiv.replaceWith(span);
  unwrapDirectParagraph(span);
}

function decorateLine3(card) {
  if (!card) return;
  const lineDiv = [...card.children].find((el) => el.tagName === 'DIV');
  if (!lineDiv) return;
  const raw = lineDiv.innerHTML;
  if (raw.includes('&lt;sup')) {
    lineDiv.innerHTML = raw.replace(/&lt;sup&gt;([\s\S]*?)&lt;\/sup&gt;/gi, '<sup>$1</sup>');
  }
  const span = document.createElement('span');
  span.className = LINE3_CLASS;
  while (lineDiv.firstChild) {
    span.append(lineDiv.firstChild);
  }
  lineDiv.replaceWith(span);
  unwrapDirectParagraph(span);
}

function decorateLine4(card) {
  if (!card) return;
  const lineDiv = [...card.children].find((el) => el.tagName === 'DIV');
  if (!lineDiv) return;
  const span = document.createElement('span');
  span.className = LINE4_CLASS;
  while (lineDiv.firstChild) {
    span.append(lineDiv.firstChild);
  }
  lineDiv.replaceWith(span);
  unwrapDirectParagraph(span);
}

function createWrapperATag(wrapper) {
  const card = document.createElement('a');
  card.className = 'grid-card';
  const sourceLink = wrapper.querySelector('a[href]');

  if (sourceLink) {
    card.href = sourceLink.getAttribute('href') || '#';
    card.target = sourceLink.getAttribute('target') || '_self';
  }

  while (wrapper.firstChild) {
    card.append(wrapper.firstChild);
  }

  const firstDiv = card.firstElementChild;
  if (firstDiv?.tagName === 'DIV') {
    firstDiv.remove();
  }

  const gridWrap = document.createElement('div');
  gridWrap.className = 'card-grid-item';
  const p = document.createElement('p');
  p.append(card);
  gridWrap.append(p);

  return gridWrap;
}

function isInUniversalEditor() {
  return window.self !== window.top;
}

/** Skyrizi access-enroll column image utility classes (match live AEM image-text instance ids). */
const IMAGE_TEXT_IMG_CLASSES = [
  'abbv-image-text-img abbv-image-text-v1-1700201083-large',
  'abbv-image-text-img abbv-image-text-v1-880735932-large',
  'abbv-image-text-img abbv-image-text-v1-1752480423-large',
];

const IMAGE_TEXT_TITLE_CLASSES = [
  'abbv-rich-text h1 mb2 tc fs-20 fs-26-md abbv-rich-text-common',
  'abbv-rich-text h1 mb2 tc tc-sm fs-20 fs-26-md abbv-rich-text-common',
  'abbv-rich-text h1 mb2 tc fs-20 fs-26-md abbv-rich-text-common',
];

const IMAGE_TEXT_BODY_CLASSES = [
  'abbv-rich-text tc pl4-sm pr4-sm fs-16 fs-22-md abbv-rich-text-common',
  'abbv-rich-text tc tc-sm pl4-sm pr4-sm fs-16 fs-22-md abbv-rich-text-common',
  'abbv-rich-text tc pl4-sm pr4-sm fs-16 fs-22-md abbv-rich-text-common',
];

function fixEncodedSupInParagraph(p) {
  if (!p) return;
  let html = p.innerHTML;
  if (html.includes('&lt;sup')) {
    html = html.replace(/&lt;sup&gt;([\s\S]*?)&lt;\/sup&gt;/gi, '<sup>$1</sup>');
    p.innerHTML = html;
  }
}

/** Decode escaped `<b>` / `</b>` from UE/plain export before sup fix. */
function fixLinzessEncodedBoldInParagraph(p) {
  if (!p) return;
  let html = p.innerHTML;
  if (!html.includes('&lt;')) return;
  html = html.replace(/&lt;b&gt;/gi, '<b>').replace(/&lt;\/b&gt;/gi, '</b>');
  p.innerHTML = html;
}

function resolveLinzessCtaHref(linkCell) {
  if (!linkCell) return '#';
  const a = linkCell.querySelector('a[href]');
  const fromA = a?.getAttribute('href');
  if (fromA) return fromA;
  const raw = linkCell.textContent?.trim() || '';
  if (!raw) return '#';
  if (/^https?:\/\//i.test(raw)) return raw;
  if (/^sms:/i.test(raw)) return raw;
  if (/^tel:/i.test(raw)) return raw;
  const smsDigits = raw.match(/^sms:?\s*(\d+)$/i);
  if (smsDigits) return `sms:${smsDigits[1]}`;
  return raw;
}

const LINZESS_FLEX_ITEM_CLASSES = [
  'abbv-flex-item-v2 background-light-purple rounded-corners text-align-center col-2-card icon-image-card',
  'abbv-flex-item-v2 background-dark-purple rounded-corners text-align-center col-2-card icon-image-card',
  'abbv-flex-item-v2 background-light-purple rounded-corners text-align-center col-2-card icon-image-card',
];

const LINZESS_IMAGE_TEXT_ROOT_CLASSES = [
  'abbv-image-text-v2 abbv-image-scale',
  'c-linz-white abbv-image-text-v2 abbv-image-scale',
  'abbv-image-text-v2 abbv-image-scale',
];

const LINZESS_HEADING_CLASS = ['heading-2 c-linz-dark-purple', 'heading-2', 'heading-2 c-linz-dark-purple'];

const LINZESS_BUTTON_CLASSES = [
  'abbv-icon-keyboard_arrow_right abbv-button-primary i-a abbv-button-primary',
  'abbv-icon-keyboard_arrow_right abbv-button-secondary i-a abbv-button-primary',
  'abbv-icon-keyboard_arrow_right abbv-button-primary i-a abbv-button-primary',
];

function buildLinzessIconImageCardColumn(wrapper, columnIndex) {
  const directDivs = [...wrapper.children].filter((c) => c.tagName === 'DIV');
  const linkCell = directDivs[0];
  const pictureDiv = directDivs[1];
  const titleDiv = directDivs[2];
  const bodyDiv = directDivs[3];
  const ctaDiv = directDivs[4];

  const href = resolveLinzessCtaHref(linkCell);
  const ctaP = ctaDiv?.querySelector('p');
  const ctaLabel = ctaP?.textContent?.trim() || 'Sign up';
  const titleP = titleDiv?.querySelector('p');
  const bodyP = bodyDiv?.querySelector('p');

  const flexItemClass = LINZESS_FLEX_ITEM_CLASSES[columnIndex % LINZESS_FLEX_ITEM_CLASSES.length];
  const imageTextRootClass = LINZESS_IMAGE_TEXT_ROOT_CLASSES[columnIndex % LINZESS_IMAGE_TEXT_ROOT_CLASSES.length];
  const headingClass = LINZESS_HEADING_CLASS[columnIndex % LINZESS_HEADING_CLASS.length];
  const buttonClass = LINZESS_BUTTON_CLASSES[columnIndex % LINZESS_BUTTON_CLASSES.length];

  const col = document.createElement('div');
  col.className = 'flexboxitem-v2 parbase';

  const flexItem = document.createElement('div');
  flexItem.className = flexItemClass;

  const imageTextParbase = document.createElement('div');
  imageTextParbase.className = 'image-text-v2 parbase';

  const rootImageText = document.createElement('div');
  rootImageText.className = imageTextRootClass;

  const imgContainer = document.createElement('div');
  imgContainer.className = 'abbv-image-content-container-v2';

  if (pictureDiv) {
    const picture = pictureDiv.querySelector('picture');
    const loneImg = pictureDiv.querySelector(':scope > img');
    if (picture) {
      imgContainer.append(picture);
      const im = picture.querySelector('img');
      if (im) {
        im.setAttribute('width', '105');
        im.setAttribute('height', '105');
      }
    } else if (loneImg) {
      loneImg.setAttribute('width', '105');
      loneImg.setAttribute('height', '105');
      imgContainer.append(loneImg);
    }
  }

  const outContainer = document.createElement('div');
  outContainer.className = 'abbv-image-text-content-container-v2 abbv-image-text-out';
  const contentV2 = document.createElement('div');
  contentV2.className = 'abbv-image-text-content-v2';
  const displayV2 = document.createElement('div');
  displayV2.className = 'abbv-image-text-display-v2';
  const bodyStretch = document.createElement('div');
  bodyStretch.className = 'abbv-stretched-card-body';

  if (titleP) {
    const h = document.createElement('p');
    h.className = headingClass;
    h.style.textAlign = 'center';
    h.textContent = titleP.textContent?.trim() || '';
    bodyStretch.append(h);
  }

  if (bodyP) {
    const bp = document.createElement('p');
    bp.style.textAlign = 'center';
    bp.innerHTML = bodyP.innerHTML;
    fixLinzessEncodedBoldInParagraph(bp);
    fixEncodedSupInParagraph(bp);
    bodyStretch.append(bp);
  }

  displayV2.append(bodyStretch);
  contentV2.append(displayV2);
  outContainer.append(contentV2);
  rootImageText.append(imgContainer, outContainer);
  imageTextParbase.append(rootImageText);

  const ctaWrap = document.createElement('div');
  ctaWrap.className = 'cta parbase';
  const ctaA = document.createElement('a');
  ctaA.className = buttonClass;
  ctaA.setAttribute('role', 'link');
  ctaA.setAttribute('aria-label', ctaLabel);
  ctaA.href = href;
  ctaA.target = '_self';
  ctaA.textContent = ctaLabel;

  ctaWrap.append(ctaA);
  flexItem.append(imageTextParbase, ctaWrap);
  col.append(flexItem);

  return col;
}

function buildImageTextColumn(wrapper, columnIndex) {
  const directDivs = [...wrapper.children].filter((c) => c.tagName === 'DIV');
  const pictureDiv = directDivs.find((d) => d.querySelector('picture, img'));
  const picIdx = pictureDiv ? directDivs.indexOf(pictureDiv) : -1;
  const titleDiv = picIdx >= 0 ? directDivs[picIdx + 1] : null;
  const bodyDiv = picIdx >= 0 ? directDivs[picIdx + 2] : null;

  const imgClass = IMAGE_TEXT_IMG_CLASSES[columnIndex % IMAGE_TEXT_IMG_CLASSES.length];
  const titleClass = IMAGE_TEXT_TITLE_CLASSES[columnIndex % IMAGE_TEXT_TITLE_CLASSES.length];
  const bodyClass = IMAGE_TEXT_BODY_CLASSES[columnIndex % IMAGE_TEXT_BODY_CLASSES.length];

  const col = document.createElement('div');
  col.className = 'abbv-col abbv-col-4';

  const outerContainer = document.createElement('div');
  outerContainer.className = 'container parbase';
  const outerAbbv = document.createElement('div');
  outerAbbv.className = 'abbv-container';

  const imageTextParbase = document.createElement('div');
  imageTextParbase.className = 'image-text parbase';
  const abbvImageText = document.createElement('div');
  abbvImageText.className = 'abbv-image-text abbv-image-text--icon tc mr3 mr0-sm mb3';
  const imgWrap = document.createElement('div');
  imgWrap.className = 'abbv-image-content-container i-b';

  if (pictureDiv) {
    const picture = pictureDiv.querySelector('picture');
    const loneImg = pictureDiv.querySelector(':scope > img');
    if (picture) {
      imgWrap.append(picture);
      const im = picture.querySelector('img');
      if (im) {
        im.className = imgClass;
      }
    } else if (loneImg) {
      loneImg.className = imgClass;
      imgWrap.append(loneImg);
    }
  }

  abbvImageText.append(imgWrap);
  imageTextParbase.append(abbvImageText);
  outerAbbv.append(imageTextParbase);

  const innerContainer = document.createElement('div');
  innerContainer.className = 'container parbase';
  const innerAbbv = document.createElement('div');
  innerAbbv.className = 'abbv-container';

  const richTitle = document.createElement('div');
  richTitle.className = 'rich-text';
  const titleRt = document.createElement('div');
  titleRt.className = titleClass;
  const titleP = titleDiv?.querySelector('p');
  if (titleP) {
    titleRt.append(titleP);
  }

  const richBody = document.createElement('div');
  richBody.className = 'rich-text';
  const bodyRt = document.createElement('div');
  bodyRt.className = bodyClass;
  const bodyP = bodyDiv?.querySelector('p');
  if (bodyP) {
    fixEncodedSupInParagraph(bodyP);
    bodyRt.append(bodyP);
  }

  richTitle.append(titleRt);
  richBody.append(bodyRt);
  innerAbbv.append(richTitle, richBody);
  innerContainer.append(innerAbbv);
  outerAbbv.append(innerContainer);
  outerContainer.append(outerAbbv);
  col.append(outerContainer);

  return col;
}

export default function decorate(block) {
  if (isInUniversalEditor()) {
    return;
  }

  if (block.classList.contains('cards-grid-cta-card')) {
    const wrappers = [...block.querySelectorAll(':scope > div')];
    wrappers.forEach((wrapper) => {
      const gridItem = createWrapperATag(wrapper);
      const anchor = gridItem.querySelector('a.grid-card');
  
      decorateLine1(anchor);
      decorateLine2(anchor);
      decorateLine3(anchor);
      decorateLine4(anchor);
  
      wrapper.replaceWith(gridItem);
    });
  }
  else if (block.classList.contains('cards-grid-image-text')) {
    const wrappers = [...block.querySelectorAll(':scope > div')];
    if (wrappers.length === 0) return;

    block.classList.add('abbv-row-container', 'mb5-sm', 'access-enroll-container');

    const row = document.createElement('div');
    row.className = 'abbv-row abbv-row-flush';

    wrappers.forEach((wrapper, index) => {
      row.append(buildImageTextColumn(wrapper, index));
      wrapper.remove();
    });

    block.append(row);
  }
  else if (block.classList.contains('cards-grid-linzess-icon-image-card')) {
    const wrappers = [...block.querySelectorAll(':scope > div')];
    if (wrappers.length === 0) return;

    const demoWrap = document.createElement('div');
    demoWrap.className = 'demo-wrap';
    const flexboxV2 = document.createElement('div');
    flexboxV2.className = 'flexbox-v2 parbase';

    const flexContainer = document.createElement('div');
    flexContainer.className =
      'abbv-flex-container-v2 flexbox-column-mobile flexbox-cards margin-top-80 savings-card-cards';

    wrappers.forEach((wrapper, index) => {
      flexContainer.append(buildLinzessIconImageCardColumn(wrapper, index));
      wrapper.remove();
    });

    flexboxV2.append(flexContainer);
    demoWrap.append(flexboxV2);
    block.append(demoWrap);
  }
}
