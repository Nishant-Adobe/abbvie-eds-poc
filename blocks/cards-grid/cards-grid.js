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

function removeLeadingEmptyLineDivs(container) {
  if (!container) return;
  let el = container.firstElementChild;
  while (el && el.tagName === 'DIV') {
    const text = el.textContent.replace(/\u00a0/g, ' ').trim();
    const hasMedia = el.querySelector('img, picture, iframe, svg, video');
    if (text.length > 0 || hasMedia) break;
    const next = el.nextElementSibling;
    el.remove();
    el = next;
  }
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

const LINZESS_FLEX_CONTAINER_CLASS = (
  'abbv-flex-container-v2 flexbox-column-mobile flexbox-cards margin-top-80 savings-card-cards'
);

/** Resources article row — matches linzess.com/resources flashcard strip. */
const LINZESS_ARTICLE_FLEX_CONTAINER_CLASS = (
  'abbv-flex-container-v2 flexbox-column-mobile flexbox-cards flexbox-article-cards '
  + 'article-flashcards resources-flexbox-column'
);

const LINZESS_ARTICLE_FLEX_ITEM_CLASS = 'abbv-flex-item-v2 background-light-purple rounded-corners';

/** Rinvoq HCP flex columns (e.g. real-patients MEASURE UP 1 / 2). */
const RINVOQ_COMMON_FLEX_CONTAINER_CLASS = (
  'abbv-flex-container-v2 flexbox--break-row-column'
);

/** If no bold tags, wrap MEASURE UP / stat lead segments (split by br) in strong. */
function ensureRinvoqStatLineStrongTags(p) {
  if (!p || /<strong\b|<b\b/i.test(p.innerHTML)) return;
  const parts = p.innerHTML.split(/(<br\s*\/?>)/i);
  for (let i = 0; i < parts.length; i += 2) {
    const chunk = parts[i];
    if (chunk && chunk.trim()) {
      const plain = chunk.replace(/<[^>]+>/g, '').trim();
      const isTitle = /^MEASURE UP\s*\d/i.test(plain);
      const isStat = /^\d+%\*/.test(plain) || /^\d+%\s*\(/.test(plain);
      if (isTitle || isStat) {
        parts[i] = `<strong>${chunk.trim()}</strong>`;
      }
    }
  }
  p.innerHTML = parts.join('');
}

/** RTE column: rich-text / abbv-rich-text-common; col 0 adds section-padding-right on first p. */
function buildRinvoqCommonRichTextColumn(wrapper, columnIndex) {
  const richTextOuter = document.createElement('div');
  richTextOuter.className = 'rich-text';

  const abbvRt = document.createElement('div');
  abbvRt.className = 'abbv-rich-text abbv-rich-text-common';

  let paragraphs = [...wrapper.querySelectorAll(':scope > p')];
  if (paragraphs.length === 0) {
    paragraphs = [...wrapper.querySelectorAll('p')];
  }

  const addSectionPadding = columnIndex === 0;

  if (paragraphs.length > 0) {
    paragraphs.forEach((srcP, pi) => {
      const p = srcP.cloneNode(true);
      if (addSectionPadding && pi === 0) {
        p.classList.add('section-padding-right');
      }
      fixEncodedSupInParagraph(p);
      ensureRinvoqStatLineStrongTags(p);
      abbvRt.append(p);
    });
  } else {
    abbvRt.innerHTML = wrapper.innerHTML.trim();
    abbvRt.querySelectorAll('p').forEach((p) => {
      fixEncodedSupInParagraph(p);
      ensureRinvoqStatLineStrongTags(p);
    });
  }

  richTextOuter.append(abbvRt);
  return richTextOuter;
}

function resolveLinzessArticleCta(ctaDiv) {
  if (!ctaDiv) return { href: '#', label: 'Read the article' };
  const a = ctaDiv.querySelector('a[href]');
  if (a) {
    return {
      href: a.getAttribute('href') || '#',
      label: (a.textContent || '').trim() || 'Read the article',
    };
  }
  const href = resolveLinzessCtaHref(ctaDiv);
  const label = (ctaDiv.textContent || '').trim() || 'Read the article';
  return { href, label };
}

function buildLinzessArticleCardColumn(wrapper) {
  const directDivs = [...wrapper.children].filter((c) => c.tagName === 'DIV');
  let pictureDiv;
  let titleDiv;
  let bodyDiv;
  let ctaDiv;
  if (directDivs.length >= 5) {
    [, pictureDiv, titleDiv, bodyDiv, ctaDiv] = directDivs;
  } else {
    [pictureDiv, titleDiv, bodyDiv, ctaDiv] = directDivs;
  }

  const { href, label } = resolveLinzessArticleCta(ctaDiv);

  const col = document.createElement('div');
  col.className = 'flexboxitem-v2 parbase';

  const flexItem = document.createElement('div');
  flexItem.className = LINZESS_ARTICLE_FLEX_ITEM_CLASS;

  const imageTextParbase = document.createElement('div');
  imageTextParbase.className = 'image-text-v2 parbase';

  const rootImageText = document.createElement('div');
  rootImageText.className = 'abbv-image-text-v2 abbv-image-scale';

  const imgContainer = document.createElement('div');
  imgContainer.className = 'abbv-image-content-container-v2';

  if (pictureDiv) {
    const picture = pictureDiv.querySelector('picture');
    const loneImg = pictureDiv.querySelector(':scope > img');
    if (picture) {
      imgContainer.append(picture);
    } else if (loneImg) {
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

  const titleP = titleDiv?.querySelector('p');
  if (titleP) {
    const tp = document.createElement('p');
    tp.className = 'c-linz-dark-purple';
    const rawHtml = titleP.innerHTML?.trim() || '';
    const hasBoldTag = /<b\b|<strong\b/i.test(rawHtml) || rawHtml.includes('&lt;b');
    if (hasBoldTag) {
      tp.innerHTML = titleP.innerHTML;
    } else {
      const b = document.createElement('b');
      b.textContent = titleP.textContent?.trim() || '';
      tp.append(b);
    }
    fixLinzessEncodedBoldInParagraph(tp);
    fixEncodedSupInParagraph(tp);
    bodyStretch.append(tp);
  }

  if (bodyDiv) {
    bodyDiv.querySelectorAll(':scope > p').forEach((srcP) => {
      const bp = document.createElement('p');
      bp.className = srcP.className;
      bp.innerHTML = srcP.innerHTML;
      fixLinzessEncodedBoldInParagraph(bp);
      fixEncodedSupInParagraph(bp);
      bodyStretch.append(bp);
    });
  }

  const ctaA = document.createElement('a');
  ctaA.className = 'abbv-button-primary abbv-image-text-link';
  ctaA.href = href;
  ctaA.target = '_self';
  ctaA.title = label;
  ctaA.setAttribute('role', 'link');
  ctaA.setAttribute('aria-label', label);
  ctaA.textContent = label;
  bodyStretch.append(ctaA);

  displayV2.append(bodyStretch);
  contentV2.append(displayV2);
  outContainer.append(contentV2);
  rootImageText.append(imgContainer, outContainer);
  imageTextParbase.append(rootImageText);
  flexItem.append(imageTextParbase);
  col.append(flexItem);

  return col;
}

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

  const linzIdx = columnIndex % LINZESS_FLEX_ITEM_CLASSES.length;
  const flexItemClass = LINZESS_FLEX_ITEM_CLASSES[linzIdx];
  const imageTextRootClass = LINZESS_IMAGE_TEXT_ROOT_CLASSES[linzIdx];
  const headingClass = LINZESS_HEADING_CLASS[linzIdx];
  const buttonClass = LINZESS_BUTTON_CLASSES[linzIdx];

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
      removeLeadingEmptyLineDivs(anchor);
      decorateLine1(anchor);
      decorateLine2(anchor);
      decorateLine3(anchor);
      decorateLine4(anchor);

      wrapper.replaceWith(gridItem);
    });
  } else if (block.classList.contains('cards-grid-image-text')) {
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
  } else if (block.classList.contains('cards-grid-linzess-icon-image-card')) {
    const wrappers = [...block.querySelectorAll(':scope > div')];
    if (wrappers.length === 0) return;

    const demoWrap = document.createElement('div');
    demoWrap.className = 'demo-wrap';
    const flexboxV2 = document.createElement('div');
    flexboxV2.className = 'flexbox-v2 parbase';

    const flexContainer = document.createElement('div');
    flexContainer.className = LINZESS_FLEX_CONTAINER_CLASS;

    wrappers.forEach((wrapper, index) => {
      flexContainer.append(buildLinzessIconImageCardColumn(wrapper, index));
      wrapper.remove();
    });

    flexboxV2.append(flexContainer);
    demoWrap.append(flexboxV2);
    block.append(demoWrap);
  } else if (block.classList.contains('cards-grid-linzess-article-cards')) {
    const wrappers = [...block.querySelectorAll(':scope > div')];
    if (wrappers.length === 0) return;

    const demoWrap = document.createElement('div');
    demoWrap.className = 'demo-wrap';
    const flexboxV2 = document.createElement('div');
    flexboxV2.className = 'flexbox-v2 parbase';

    const flexContainer = document.createElement('div');
    flexContainer.className = LINZESS_ARTICLE_FLEX_CONTAINER_CLASS;

    wrappers.forEach((wrapper) => {
      flexContainer.append(buildLinzessArticleCardColumn(wrapper));
      wrapper.remove();
    });

    flexboxV2.append(flexContainer);
    demoWrap.append(flexboxV2);
    block.append(demoWrap);
  } else if (block.classList.contains('cards-grid-rinvoq-common-cards')) {
    const wrappers = [...block.querySelectorAll(':scope > div')];
    if (wrappers.length === 0) return;

    let introWrapper = null;
    let columnWrappers;
    if (wrappers[0]?.classList.contains('rinvoq-common-intro')) {
      [introWrapper, ...columnWrappers] = wrappers;
    } else {
      columnWrappers = wrappers;
    }
    if (columnWrappers.length === 0) return;

    const outer = document.createElement('div');
    outer.className = 'flexboxitem-v2 parbase';

    const flexItem = document.createElement('div');
    flexItem.className = 'abbv-flex-item-v2';

    if (introWrapper) {
      flexItem.append(buildRinvoqCommonRichTextColumn(introWrapper, -1));
      introWrapper.remove();
    }

    const flexboxV2 = document.createElement('div');
    flexboxV2.className = 'flexbox-v2 parbase';

    const flexContainer = document.createElement('div');
    flexContainer.className = RINVOQ_COMMON_FLEX_CONTAINER_CLASS;

    columnWrappers.forEach((wrapper, index) => {
      flexContainer.append(buildRinvoqCommonRichTextColumn(wrapper, index));
      wrapper.remove();
    });

    flexboxV2.append(flexContainer);
    flexItem.append(flexboxV2);
    outer.append(flexItem);
    block.append(outer);
  }
}
