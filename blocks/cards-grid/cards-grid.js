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

/** Mavyret HCP nurse-ambassador icon row (mavyret-common-cards.html). */
const MAVYRET_FLEX_ICON_RICH_CLASS = 'abbv-rich-text stacking-copy abbv-rich-text-common';

/**
 * Phase title after the icon must be a direct `<p class="subhead">` (no wrapper `div`).
 * UE/Word often inserts a `div`; replace it with one plain `p.subhead`.
 */
function ensureMavyretSubheadAfterIcon(iconP) {
  let next = iconP.nextElementSibling;
  while (next && next.tagName === 'SCRIPT') {
    next = next.nextElementSibling;
  }
  if (!next) return;

  if (next.tagName === 'P') {
    if (!next.classList.contains('subhead')) {
      next.classList.add('subhead');
    }
    return;
  }

  if (next.tagName !== 'DIV') return;

  const scopedPs = [...next.querySelectorAll(':scope > p')];
  let body = '';
  if (scopedPs.length >= 1) {
    body = (scopedPs[0].innerHTML || '').trim();
  }
  if (!body) {
    body = (next.innerHTML || '').trim();
  }
  const plain = (next.textContent || '').trim();
  if (!body && !plain) return;

  const sub = document.createElement('p');
  sub.className = 'subhead';
  if (body) {
    sub.innerHTML = body;
  } else {
    sub.textContent = plain;
  }
  next.replaceWith(sub);
}

/** UE table cells: icon in `div > picture`, title in `div > p`, list in `div > ul`. */
function isMavyretCellIconDiv(el) {
  if (!el || el.tagName !== 'DIV') return false;
  const hasMedia = el.querySelector(':scope > picture, :scope > img');
  if (!hasMedia) return false;
  return !el.querySelector(':scope > p');
}

/**
 * Flatten Franklin/UE cell wrappers into mavyret-common-cards.html stacking-copy markup.
 */
function normalizeMavyretFromTableCellRows(abbvRt) {
  const kids = [...abbvRt.children];
  if (!kids.some(isMavyretCellIconDiv)) return false;

  const iconIdx = kids.findIndex(isMavyretCellIconDiv);
  const iconDiv = kids[iconIdx];
  const legacyImg = iconDiv.querySelector('picture img') || iconDiv.querySelector('img');
  if (!legacyImg) return false;

  const src = (legacyImg.getAttribute('src') || legacyImg.currentSrc || '').trim();
  const alt = (legacyImg.getAttribute('alt') || '').trim();

  const iconP = document.createElement('p');
  iconP.className = 'text-center';
  if (src) {
    const imgEl = document.createElement('img');
    imgEl.src = src;
    imgEl.className = 'icon';
    imgEl.setAttribute('loading', 'lazy');
    if (alt) {
      imgEl.setAttribute('alt', alt);
    }
    const w = legacyImg.getAttribute('width');
    const h = legacyImg.getAttribute('height');
    if (w) imgEl.setAttribute('width', w);
    if (h) imgEl.setAttribute('height', h);
    iconP.append(imgEl);
  }

  const built = [iconP];
  let titleDone = false;

  for (let i = iconIdx + 1; i < kids.length; i += 1) {
    const el = kids[i];
    if (el.tagName === 'DIV') {
      const ulEl = el.querySelector(':scope > ul');
      if (ulEl) {
        ulEl.remove();
        built.push(ulEl);
        break;
      }

      const scopedPs = [...el.querySelectorAll(':scope > p')];
      const plain = (el.textContent || '').trim();
      if (plain || scopedPs.length > 0) {
        if (!titleDone) {
          const sub = document.createElement('p');
          sub.className = 'subhead';
          if (scopedPs.length >= 1) {
            sub.innerHTML = scopedPs[0].innerHTML.trim();
          } else {
            sub.textContent = plain;
          }
          built.push(sub);
          for (let j = 1; j < scopedPs.length; j += 1) {
            const p = document.createElement('p');
            p.innerHTML = scopedPs[j].innerHTML;
            built.push(p);
          }
          titleDone = true;
        } else {
          scopedPs.forEach((srcP) => {
            const p = document.createElement('p');
            p.innerHTML = srcP.innerHTML;
            built.push(p);
          });
          if (scopedPs.length === 0 && plain) {
            const p = document.createElement('p');
            p.textContent = plain;
            built.push(p);
          }
        }
      }
    }
  }

  abbvRt.replaceChildren(...built);
  return true;
}

function normalizeMavyretFromIconParagraph(abbvRt) {
  const ps = [...abbvRt.querySelectorAll('p')];
  const idx = ps.findIndex((p) => p.querySelector('img'));
  if (idx < 0) return;

  const iconP = ps[idx];
  iconP.className = 'text-center';

  const legacyImg = iconP.querySelector('picture img') || iconP.querySelector('img');
  if (!legacyImg) return;

  const src = (legacyImg.getAttribute('src') || legacyImg.currentSrc || '').trim();
  const alt = (legacyImg.getAttribute('alt') || '').trim();

  if (src) {
    iconP.replaceChildren();
    const imgEl = document.createElement('img');
    imgEl.src = src;
    imgEl.className = 'icon';
    imgEl.setAttribute('loading', 'lazy');
    if (alt) {
      imgEl.setAttribute('alt', alt);
    }
    iconP.append(imgEl);
  } else {
    legacyImg.classList.add('icon');
    if (!legacyImg.getAttribute('loading')) {
      legacyImg.setAttribute('loading', 'lazy');
    }
  }

  ensureMavyretSubheadAfterIcon(iconP);
}

function normalizeMavyretStackingCopyDom(abbvRt) {
  if (normalizeMavyretFromTableCellRows(abbvRt)) {
    return;
  }
  normalizeMavyretFromIconParagraph(abbvRt);
}

function buildMavyretFlexIconColumn(wrapper) {
  const richTextOuter = document.createElement('div');
  richTextOuter.className = 'rich-text';

  const abbvRt = document.createElement('div');
  abbvRt.className = MAVYRET_FLEX_ICON_RICH_CLASS;

  const existingRt = wrapper.querySelector(':scope > .abbv-rich-text');
  if (existingRt) {
    abbvRt.innerHTML = existingRt.innerHTML;
  } else {
    while (wrapper.firstChild) {
      abbvRt.append(wrapper.firstChild);
    }
  }

  abbvRt.querySelectorAll('p').forEach((p) => {
    fixEncodedSupInParagraph(p);
  });

  normalizeMavyretStackingCopyDom(abbvRt);

  abbvRt.querySelectorAll('p').forEach((p) => {
    fixEncodedSupInParagraph(p);
  });

  richTextOuter.append(abbvRt);
  return richTextOuter;
}

/**
 * CTA anchor classes + AEM attrs (mavyret-cta-cards.html).
 * @param {HTMLAnchorElement} a
 */
function finalizeMavyretCtaAnchorFromUe(a) {
  if (!a || a.tagName !== 'A') return;
  if (!a.getAttribute('role')) {
    a.setAttribute('role', 'link');
  }
  a.setAttribute('aria-hidden', 'false');
  const href = (a.getAttribute('href') || '').trim();
  const isTel = /^tel:/i.test(href);
  if (isTel) {
    a.className = 'abbv-button-plain cta--phone';
    if (!a.hasAttribute('data-linktype')) {
      a.setAttribute('data-linktype', 'internal');
    }
    if (!a.hasAttribute('target')) {
      a.setAttribute('target', '_self');
    }
    return;
  }
  a.className = 'abbv-icon-keyboard_arrow_right abbv-button-primary i-a';
  const isHttp = /^https?:\/\//i.test(href);
  const isPdf = /\.pdf(\?|$)/i.test(href);
  if (!a.hasAttribute('data-linktype')) {
    if (isPdf) {
      a.setAttribute('data-linktype', 'download');
    } else if (isHttp) {
      a.setAttribute('data-linktype', 'external');
    } else if (href.startsWith('/')) {
      a.setAttribute('data-linktype', 'internal');
    }
  }
  if (!a.hasAttribute('target')) {
    if (isHttp || isPdf) {
      a.setAttribute('target', '_blank');
    } else {
      a.setAttribute('target', '_self');
    }
  }
  const lab = (a.textContent || '').trim();
  const opensNew = (a.getAttribute('target') || '').toLowerCase() === '_blank';
  if (lab && !a.getAttribute('aria-label')) {
    a.setAttribute('aria-label', opensNew ? `${lab}, Opens in a new window` : lab);
  }
}

/** Trailing "| 1" in card body HTML → `<sup>1</sup>` (keeps existing tags like strong). */
function mavyretSectionCardBodyInnerHtml(inner) {
  const t = (inner || '').trim();
  if (!t) return '';
  return t.replace(/\s*\|\s*1\s*$/i, '<sup>1</sup>');
}

/** First cell has a link (e.g. p.button-container > a.button). */
function isMavyretSectionCardUeRow(wrapper) {
  if (!wrapper || wrapper.tagName !== 'DIV') return false;
  const firstCell = wrapper.querySelector(':scope > div');
  if (!firstCell) return false;
  return !!firstCell.querySelector('a[href]');
}

/** Intro: rich-text > abbv-rich-text.section-narrow… (mavyret-section-cards.html). */
function buildMavyretSectionIntroFromWrapper(wrapper) {
  const richTextOuter = document.createElement('div');
  richTextOuter.className = 'rich-text';
  const abbvRt = document.createElement('div');
  abbvRt.className = (
    'abbv-rich-text section-narrow color-white text-center section-break-bottom '
    + 'abbv-rich-text-common'
  );
  abbvRt.innerHTML = wrapper.innerHTML.trim();
  abbvRt.querySelectorAll('p').forEach((p) => {
    fixEncodedSupInParagraph(p);
  });
  richTextOuter.append(abbvRt);
  return richTextOuter;
}

/**
 * One cta--card column (mavyret-section-cards.html). UE: [0] link cell, [2] body, [3] CTA label.
 * @param {HTMLElement} wrapper
 */
function buildMavyretSectionCardColumnFromUeRow(wrapper) {
  const cells = [...wrapper.querySelectorAll(':scope > div')];
  const linkEl = cells[0]?.querySelector('a[href]') || wrapper.querySelector('a[href]');
  let href = (linkEl?.getAttribute('href') || '').trim();
  if (!href) href = '#';

  const ctaP = cells[3]?.querySelector(':scope > p');
  let ctaLabel = (ctaP?.textContent || cells[3]?.textContent || '').trim();
  if (!ctaLabel) {
    ctaLabel = (linkEl?.textContent || '').trim() || 'Learn more';
  }

  const containerParbase = document.createElement('div');
  containerParbase.className = 'container parbase';
  const abbvInner = document.createElement('div');
  abbvInner.className = 'abbv-container cta--card';
  const richTextOuter = document.createElement('div');
  richTextOuter.className = 'rich-text';
  const abbvRt = document.createElement('div');
  abbvRt.className = 'abbv-rich-text abbv-rich-text-common';

  const bodyCell = cells[2];
  if (bodyCell) {
    const bodyPs = [...bodyCell.querySelectorAll(':scope > p')];
    if (bodyPs.length > 0) {
      bodyPs.forEach((srcP) => {
        const p = srcP.cloneNode(true);
        p.innerHTML = mavyretSectionCardBodyInnerHtml(p.innerHTML);
        fixEncodedSupInParagraph(p);
        abbvRt.append(p);
      });
    } else {
      const kids = [...bodyCell.children];
      if (kids.length > 0) {
        kids.forEach((k) => {
          abbvRt.append(k.cloneNode(true));
        });
      } else {
        const p = document.createElement('p');
        const raw = bodyCell.innerHTML.trim() || (bodyCell.textContent || '').trim();
        p.innerHTML = mavyretSectionCardBodyInnerHtml(raw);
        abbvRt.append(p);
      }
    }
  }

  abbvRt.querySelectorAll('p').forEach((p) => {
    fixEncodedSupInParagraph(p);
  });

  richTextOuter.append(abbvRt);
  abbvInner.append(richTextOuter);

  const ctaWrap = document.createElement('div');
  ctaWrap.className = 'cta parbase';
  const ctaA = document.createElement('a');
  ctaA.href = href;
  ctaA.textContent = ctaLabel;
  finalizeMavyretCtaAnchorFromUe(ctaA);
  ctaWrap.append(ctaA);
  abbvInner.append(ctaWrap);

  containerParbase.append(abbvInner);
  return containerParbase;
}

/**
 * UE column row → mavyret-cta-cards.html column (container > abbv-container > rich-text + cta).
 * Cell order: [0] link, [1] icon, [2] title, [3] body, [4] CTA label, …
 * @param {HTMLElement} wrapper
 */
function buildMavyretCtaCardsColumnFromUeRow(wrapper) {
  const cells = [...wrapper.querySelectorAll(':scope > div')];
  const linkEl = cells[0]?.querySelector('a[href]') || wrapper.querySelector('a[href]');
  let href = (linkEl?.getAttribute('href') || '').trim();
  if (!href) href = '#';

  const iconCell = cells.find((c, idx) => idx > 0 && c.querySelector('picture, img')) || cells[1];
  const titleText = (cells[2]?.textContent || '').trim();
  const bodyText = (cells[3]?.textContent || '').trim();
  let ctaLabel = (cells[4]?.textContent || '').trim();
  if (!ctaLabel) {
    ctaLabel = (linkEl?.textContent || '').trim() || 'Learn more';
  }

  const containerParbase = document.createElement('div');
  containerParbase.className = 'container parbase';
  const abbvInner = document.createElement('div');
  abbvInner.className = 'abbv-container ';
  const richTextOuter = document.createElement('div');
  richTextOuter.className = 'rich-text';
  const abbvRt = document.createElement('div');
  abbvRt.className = MAVYRET_FLEX_ICON_RICH_CLASS;

  const iconP = document.createElement('p');
  iconP.className = 'center';
  const pic = iconCell?.querySelector(':scope picture');
  const loneImg = iconCell?.querySelector(':scope > img');
  if (pic) {
    const picClone = pic.cloneNode(true);
    iconP.append(picClone);
    const im = iconP.querySelector('img');
    if (im) {
      im.classList.add('icon');
      if (!im.getAttribute('loading')) im.setAttribute('loading', 'lazy');
    }
  } else if (loneImg) {
    const legacyImg = loneImg;
    const src = (legacyImg.getAttribute('src') || legacyImg.currentSrc || '').trim();
    const alt = (legacyImg.getAttribute('alt') || '').trim();
    if (src) {
      const imgEl = document.createElement('img');
      imgEl.src = src;
      imgEl.className = 'icon';
      imgEl.setAttribute('loading', 'lazy');
      if (alt) imgEl.setAttribute('alt', alt);
      ['width', 'height'].forEach((attr) => {
        const v = legacyImg.getAttribute(attr);
        if (v) imgEl.setAttribute(attr, v);
      });
      iconP.append(imgEl);
    }
  }
  abbvRt.append(iconP);

  const sub = document.createElement('p');
  sub.className = 'subhead';
  sub.textContent = titleText;
  abbvRt.append(sub);

  if (bodyText) {
    const bp = document.createElement('p');
    bp.textContent = bodyText;
    abbvRt.append(bp);
  }

  abbvRt.querySelectorAll('p').forEach((p) => {
    fixEncodedSupInParagraph(p);
  });

  richTextOuter.append(abbvRt);
  abbvInner.append(richTextOuter);

  const ctaWrap = document.createElement('div');
  ctaWrap.className = 'cta parbase';
  const ctaA = document.createElement('a');
  ctaA.href = href;
  ctaA.textContent = ctaLabel;
  finalizeMavyretCtaAnchorFromUe(ctaA);
  ctaWrap.append(ctaA);
  abbvInner.append(ctaWrap);

  containerParbase.append(abbvInner);
  return containerParbase;
}

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
  } else if (block.classList.contains('cards-grid-mavyret-common-cards')) {
    const wrappers = [...block.querySelectorAll(':scope > div')];
    if (wrappers.length === 0) return;

    const outer = document.createElement('div');
    outer.className = 'abbv-container flex-icon';

    wrappers.forEach((wrapper) => {
      outer.append(buildMavyretFlexIconColumn(wrapper));
      wrapper.remove();
    });

    const demoWrap = document.createElement('div');
    demoWrap.className = 'demo-wrap';
    demoWrap.append(outer);
    block.append(demoWrap);
  } else if (block.classList.contains('cards-grid-mavyret-cta-cards')) {
    const wrappers = [...block.querySelectorAll(':scope > div')];
    if (wrappers.length === 0) return;

    const outer = document.createElement('div');
    outer.className = 'abbv-container flex-icon text-center flex-icon__cta-at-bottom';

    wrappers.forEach((w) => {
      outer.append(buildMavyretCtaCardsColumnFromUeRow(w));
      w.remove();
    });

    const demoWrap = document.createElement('div');
    demoWrap.className = 'demo-wrap';
    demoWrap.append(outer);
    block.append(demoWrap);
  } else if (block.classList.contains('cards-grid-mavyret-section-cards')) {
    const wrappers = [...block.querySelectorAll(':scope > div')];
    if (wrappers.length === 0) return;

    let cardStart = 0;
    if (wrappers.length > 0 && !isMavyretSectionCardUeRow(wrappers[0])) {
      buildMavyretSectionIntroFromWrapper(wrappers[0]);
      cardStart = 1;
    }

    const cardCols = [];
    for (let i = cardStart; i < wrappers.length; i += 1) {
      if (isMavyretSectionCardUeRow(wrappers[i])) {
        cardCols.push(buildMavyretSectionCardColumnFromUeRow(wrappers[i]));
      }
    }
    if (cardCols.length === 0) return;

    wrappers.forEach((w) => {
      w.remove();
    });

    const flexEven = document.createElement('div');
    flexEven.className = 'abbv-container flex-even section';
    cardCols.forEach((col) => {
      flexEven.append(col);
    });
    block.append(flexEven);
  }
}
