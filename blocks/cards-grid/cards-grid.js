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
    // Decode Platform-C HTML-encoded sup tags. Strip any markup from the captured
    // text so only plain text enters the <sup> element, preventing injection.
    lineDiv.innerHTML = raw.replace(
      /&lt;sup&gt;([\s\S]*?)&lt;\/sup&gt;/gi,
      (_, text) => `<sup>${text.replace(/<[^>]+>/g, '')}</sup>`,
    );
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
  return !!window.hlx?.uePreview;
}

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
    // Strip any markup from captured text to prevent injection via authored content.
    html = html.replace(
      /&lt;sup&gt;([\s\S]*?)&lt;\/sup&gt;/gi,
      (_, text) => `<sup>${text.replace(/<[^>]+>/g, '')}</sup>`,
    );
    p.innerHTML = html;
  }
}

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

const RINVOQ_COMMON_FLEX_CONTAINER_CLASS = (
  'abbv-flex-container-v2 flexbox--break-row-column'
);

const MAVYRET_FLEX_ICON_RICH_CLASS = 'abbv-rich-text stacking-copy abbv-rich-text-common';

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

function isMavyretCellIconDiv(el) {
  if (!el || el.tagName !== 'DIV') return false;
  const hasMedia = el.querySelector(':scope > picture, :scope > img');
  if (!hasMedia) return false;
  return !el.querySelector(':scope > p');
}

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

function mavyretSectionCardBodyInnerHtml(inner) {
  const t = (inner || '').trim();
  if (!t) return '';
  return t.replace(/\s*\|\s*1\s*$/i, '<sup>1</sup>');
}

function isMavyretSectionCardUeRow(wrapper) {
  if (!wrapper || wrapper.tagName !== 'DIV') return false;
  const firstCell = wrapper.querySelector(':scope > div');
  if (!firstCell) return false;
  return !!firstCell.querySelector('a[href]');
}

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
  abbvInner.className = 'abbv-container';
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

function isVenclextaCalloutUeRow(wrapper) {
  if (!wrapper || wrapper.tagName !== 'DIV') return false;
  const cells = [...wrapper.querySelectorAll(':scope > div')];
  if (cells.length < 5) return false;
  if (cells[0]?.querySelector('a[href]')) return false;
  const phoneA = cells[4]?.querySelector('a[href], .button-container a[href]');
  if (!phoneA) return false;
  const titleRaw = (cells[2]?.textContent || '').trim();
  return titleRaw.length > 0;
}

function venclextaCalloutModalDataId(titleText) {
  const compact = (titleText || '').replace(/[^a-zA-Z0-9]/g, '');
  const base = compact.length > 0 ? compact : 'Resource';
  return `linkTo${base.charAt(0).toUpperCase()}${base.slice(1)}`;
}

/** Plain `Cancer|Care` (no tags) → Cancer<em>Care</em> (author uses `|` in UE). */
function venclextaCalloutPipeTitleToEmHtml(inner) {
  const trimmed = inner.trim();
  if (/^[^<]+\|[^<]+$/.test(trimmed)) {
    const [left, right] = trimmed.split('|').map((s) => s.trim());
    return `${left}<em>${right}</em>`;
  }
  return trimmed;
}

function venclextaCalloutHeadingInnerHtml(titleCell) {
  if (!titleCell) return '';
  const ps = [...titleCell.querySelectorAll(':scope > p')].filter((p) => p.textContent.trim());
  if (ps.length === 0) {
    const raw = titleCell.innerHTML.trim();
    return venclextaCalloutPipeTitleToEmHtml(raw);
  }
  if (ps.length === 1) {
    const raw = ps[0].innerHTML.trim();
    return venclextaCalloutPipeTitleToEmHtml(raw);
  }
  return ps.map((p) => p.innerHTML.trim()).join('<br />');
}

function normalizeVenclextaTelHref(href) {
  const t = (href || '').trim();
  if (!t || t === '#') return '#';
  if (/^https?:\/\//i.test(t)) return t;
  if (/^tel:/i.test(t)) return t;
  const digits = t.replace(/\D/g, '');
  return digits.length > 0 ? `tel:${digits}` : t;
}

function buildVenclextaCalloutCardColumnFromUeRow(wrapper) {
  const cells = [...wrapper.querySelectorAll(':scope > div')];
  const titleCell = cells[2];
  const websiteCell = cells[3];
  const phoneCell = cells[4];
  const titlePlain = (titleCell?.textContent || '').trim();
  const phoneA = phoneCell?.querySelector('a[href], .button-container a[href]');
  let phoneHref = normalizeVenclextaTelHref(phoneA?.getAttribute('href') || '');
  if (phoneHref === '#') phoneHref = normalizeVenclextaTelHref(phoneA?.textContent || '');
  const phoneLabel = (phoneA?.getAttribute('aria-label') || phoneA?.textContent || '').trim()
    || phoneHref.replace(/^tel:/i, '');

  const websiteFromUe = cells[0]?.querySelector('a[href]') || websiteCell?.querySelector('a[href]');
  const websiteLabel = (websiteCell?.textContent || '').trim() || 'Website';

  const colItem = document.createElement('div');
  colItem.className = 'abbv-flex-item d-flex flex-col-xl-4 flex-justify_center';

  const flexboxParbaseOuter = document.createElement('div');
  flexboxParbaseOuter.className = 'flexbox parbase';

  const cardContainer = document.createElement('div');
  cardContainer.className = (
    'abbv-flex-container venclexta-gray-yellow-border-call-out flex-column '
    + 'abv-custom-bgcolor-white venxcleta-yellow-border-card'
  );

  const titleItem = document.createElement('div');
  titleItem.className = 'abbv-flex-item';
  const richTextOuter = document.createElement('div');
  richTextOuter.className = 'rich-text';
  const abbvRt = document.createElement('div');
  abbvRt.className = 'abbv-rich-text abbv-rich-text-common';
  const h3 = document.createElement('h3');
  h3.innerHTML = venclextaCalloutHeadingInnerHtml(titleCell);
  abbvRt.append(h3);
  richTextOuter.append(abbvRt);
  titleItem.append(richTextOuter);
  cardContainer.append(titleItem);

  const ctaRowItem = document.createElement('div');
  ctaRowItem.className = 'abbv-flex-item';
  const flexboxParbaseInner = document.createElement('div');
  flexboxParbaseInner.className = 'flexbox parbase';
  const leukemiaRow = document.createElement('div');
  leukemiaRow.className = 'abbv-flex-container leukemia-flex-wrap flex-row';

  const websiteCol = document.createElement('div');
  websiteCol.className = 'abbv-flex-item d-flex flex-col-6 flex-justify_center';
  const websiteCtaWrap = document.createElement('div');
  websiteCtaWrap.className = 'cta parbase';
  const websiteA = document.createElement('a');
  if (websiteFromUe) {
    websiteA.href = websiteFromUe.getAttribute('href') || '#';
    const tgt = websiteFromUe.getAttribute('target');
    if (tgt) websiteA.target = tgt;
    websiteA.textContent = (websiteFromUe.textContent || '').trim() || websiteLabel;
    websiteA.className = 'abbv-button-tertiary i-a material-font-ctas leukemia-min-width';
    websiteA.setAttribute('role', 'link');
  } else {
    websiteA.href = '#';
    websiteA.className = (
      'abbv-modal-open abbv-icon-call_made abbv-button-tertiary i-a material-font-ctas leukemia-min-width'
    );
    websiteA.setAttribute('data-id', venclextaCalloutModalDataId(titlePlain));
    websiteA.setAttribute('role', 'link');
    websiteA.setAttribute('aria-label', `${websiteLabel}, Opens in a new modal`);
    websiteA.setAttribute('tabindex', '0');
    websiteA.setAttribute('target', 'new-modal');
    websiteA.setAttribute('data-linktype', 'external');
    websiteA.setAttribute('aria-hidden', 'false');
    websiteA.textContent = websiteLabel;
  }
  websiteCtaWrap.append(websiteA);
  websiteCol.append(websiteCtaWrap);

  const phoneCol = document.createElement('div');
  phoneCol.className = 'abbv-flex-item d-flex flex-col-6 flex-justify_center';
  const phoneCtaWrap = document.createElement('div');
  phoneCtaWrap.className = 'cta parbase';
  const phoneLink = document.createElement('a');
  phoneLink.className = 'abbv-button-tertiary material-font-ctas leukemia-min-width pl-0 pr-0';
  phoneLink.href = phoneHref;
  phoneLink.setAttribute('role', 'link');
  phoneLink.setAttribute('aria-label', phoneLabel);
  phoneLink.setAttribute('target', '_self');
  phoneLink.setAttribute('data-linktype', 'internal');
  phoneLink.setAttribute('aria-hidden', 'false');
  phoneLink.textContent = (phoneA?.textContent || '').trim() || phoneLabel.replace(/\D/g, '');
  phoneCtaWrap.append(phoneLink);
  phoneCol.append(phoneCtaWrap);

  leukemiaRow.append(websiteCol);
  leukemiaRow.append(phoneCol);
  flexboxParbaseInner.append(leukemiaRow);
  ctaRowItem.append(flexboxParbaseInner);
  cardContainer.append(ctaRowItem);

  flexboxParbaseOuter.append(cardContainer);
  colItem.append(flexboxParbaseOuter);
  return colItem;
}

const RINVOQ_SLIDER_THUMB_DEFAULT_HASH = '#body-parts-container';

function isRinvoqSliderThumbnailUeRow(wrapper) {
  if (!wrapper || wrapper.tagName !== 'DIV') return false;
  const cells = [...wrapper.querySelectorAll(':scope > div')];
  if (cells.length < 4) return false;
  const mediaCell = cells[1];
  if (!mediaCell?.querySelector('picture, img')) return false;
  const titleRaw = (cells[2]?.textContent || '').trim();
  return titleRaw.length > 0;
}

function rinvoqSliderThumbnailAdultsPercentageClass(subtitleText) {
  const m = (subtitleText || '').match(/(\d+)\s*%/);
  if (!m) return 'adults-percentage-75';
  const n = parseInt(m[1], 10);
  if (Number.isNaN(n)) return 'adults-percentage-75';
  if (n >= 90) return 'adults-percentage-90';
  if (n >= 75) return 'adults-percentage-75';
  return `adults-percentage-${n}`;
}

function rinvoqSliderThumbnailFlexItemClass(index, total) {
  const base = 'abbv-flex-item p-0 max-width-110 max-width-md-120';
  if (total <= 1) return `${base} ml-0 ml-0 mr-md-10 mr-0`;
  if (index === 0) return `${base} ml-0 ml-0 mr-md-10 mr-0`;
  if (index === total - 1) return `${base} ml-md-5 ml-lg-10 ml-0 mt-md-10`;
  return `${base} ml-md-10 ml-0 mr-md-10 mr-0`;
}

function clonePictureFromRinvoqSliderThumbnailUeCell(mediaCell) {
  if (!mediaCell) return null;
  const pic = mediaCell.querySelector('picture');
  if (pic) {
    const clone = /** @type {HTMLPictureElement} */ (pic.cloneNode(true));
    clone.querySelectorAll('source').forEach((s) => {
      if (!(s.getAttribute('srcset') || '').trim()) s.remove();
    });
    return clone;
  }
  const img = mediaCell.querySelector('img');
  if (!img) return null;
  const picture = document.createElement('picture');
  picture.append(img.cloneNode(true));
  return picture;
}

function extractRinvoqSliderThumbnailLinkFromUeCells(cells) {
  for (let i = 0; i < cells.length; i += 1) {
    const a = cells[i]?.querySelector('a[href]');
    if (a) {
      const href = (a.getAttribute('href') || '').trim();
      if (href) return { href, anchor: a };
    }
  }
  return { href: RINVOQ_SLIDER_THUMB_DEFAULT_HASH, anchor: null };
}

function rinvoqSliderThumbnailLinkDisplayTitle(titleText, subtitleText, anchor) {
  const fromUe = (anchor?.getAttribute('title') || anchor?.textContent || '').trim();
  if (fromUe) return fromUe;
  const combined = `${titleText} ${subtitleText}`.trim().toLowerCase();
  return combined || 'thumbnail selection';
}

function buildRinvoqSliderThumbnailFlexItemFromUeRow(wrapper, index, total) {
  const cells = [...wrapper.querySelectorAll(':scope > div')];
  const mediaCell = cells[1];
  const titleText = (cells[2]?.textContent || '').trim();
  const subtitleText = (cells[3]?.textContent || '').trim();
  const pctClass = rinvoqSliderThumbnailAdultsPercentageClass(subtitleText);
  const { href, anchor } = extractRinvoqSliderThumbnailLinkFromUeCells(cells);
  const displayTitle = rinvoqSliderThumbnailLinkDisplayTitle(titleText, subtitleText, anchor);

  const flexItem = document.createElement('div');
  flexItem.className = rinvoqSliderThumbnailFlexItemClass(index, total);

  const parbase = document.createElement('div');
  parbase.className = 'image-text-v2 parbase';

  const cardRoot = document.createElement('div');
  cardRoot.className = (
    `width-100-percent trigger1-slider${index + 1} thumbnail1-${index + 1} `
    + `image-text-clickable ${pctClass} abbv-image-text-v2 abbv-image-swap`
  );
  if (index === 0) cardRoot.classList.add('border-thumbnails-active');

  const imgWrap = document.createElement('div');
  imgWrap.className = 'abbv-image-content-container-v2';
  const picture = clonePictureFromRinvoqSliderThumbnailUeCell(mediaCell);
  if (picture) imgWrap.append(picture);

  const contentOuter = document.createElement('div');
  contentOuter.className = 'abbv-image-text-content-container-v2 bottom-left';

  const contentInner = document.createElement('div');
  contentInner.className = 'abbv-image-text-content-v2';

  const display = document.createElement('div');
  display.className = 'abbv-image-text-display-v2';

  const body = document.createElement('div');
  body.className = 'abbv-stretched-card-body';

  const txt = document.createElement('div');
  txt.className = 'abv-custom-txtcolor-white image-text-clickable__txtcontent';

  const titleP = document.createElement('p');
  titleP.className = 'mb-0 font-line-height-14px font-helveticaMedium';
  const titleB = document.createElement('b');
  titleB.className = 'h3 font-14px font-md-16px font-helveticaBold';
  titleB.textContent = titleText;
  titleP.append(titleB);

  const subP = document.createElement('p');
  subP.className = 'mb-0 font-md-16px';
  subP.textContent = subtitleText;

  txt.append(titleP);
  txt.append(subP);

  const link = document.createElement('a');
  link.className = 'abbv-button-primary abbv-image-text-link abbv-stretched-link';
  link.href = href;
  link.setAttribute('title', displayTitle);
  link.setAttribute('target', '_self');
  link.textContent = displayTitle;

  body.append(txt);
  body.append(link);
  display.append(body);
  contentInner.append(display);
  contentOuter.append(contentInner);
  cardRoot.append(imgWrap);
  cardRoot.append(contentOuter);
  parbase.append(cardRoot);
  flexItem.append(parbase);
  return flexItem;
}

function wireRinvoqSliderThumbnailSelection(block) {
  const row = block.querySelector(':scope .abbv-flex-container.slider-thumbnails.adults');
  if (!row) return;
  row.addEventListener('click', (ev) => {
    const card = ev.target.closest('.abbv-image-text-v2.image-text-clickable');
    if (!card || !row.contains(card)) return;
    ev.preventDefault();
    row.querySelectorAll('.abbv-image-text-v2.image-text-clickable').forEach((c) => {
      c.classList.remove('border-thumbnails-active');
    });
    card.classList.add('border-thumbnails-active');
  }, true);
}

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
  const temp = document.createElement('div');
  temp.innerHTML = parts.join('');
  p.replaceChildren(...temp.childNodes);
}

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
    h.classList.add('text-align-center');
    h.textContent = titleP.textContent?.trim() || '';
    bodyStretch.append(h);
  }

  if (bodyP) {
    const bp = document.createElement('p');
    bp.classList.add('text-align-center');
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
    let introEl = null;
    if (wrappers.length > 0 && !isMavyretSectionCardUeRow(wrappers[0])) {
      introEl = buildMavyretSectionIntroFromWrapper(wrappers[0]);
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

    if (introEl) block.append(introEl);

    const flexEven = document.createElement('div');
    flexEven.className = 'abbv-container flex-even section';
    cardCols.forEach((col) => {
      flexEven.append(col);
    });
    block.append(flexEven);
  } else if (block.classList.contains('cards-grid-venclexta-callout-cards')) {
    const wrappers = [...block.querySelectorAll(':scope > div')];
    if (wrappers.length === 0) return;

    const cardCols = [];
    wrappers.forEach((w) => {
      if (isVenclextaCalloutUeRow(w)) {
        cardCols.push(buildVenclextaCalloutCardColumnFromUeRow(w));
      }
    });
    if (cardCols.length === 0) return;

    wrappers.forEach((w) => {
      w.remove();
    });

    const outer = document.createElement('div');
    outer.className = (
      'abbv-flex-container flex-col-xl-10 flex-justify_center flex-column '
      + 'flex-xl-row m-xl-auto learn-more-callouts-flexbox'
    );
    cardCols.forEach((col) => {
      outer.append(col);
    });
    block.append(outer);
  } else if (block.classList.contains('cards-grid-slider-thumbnails')) {
    const wrappers = [...block.querySelectorAll(':scope > div')];
    if (wrappers.length === 0) return;

    const thumbRows = wrappers.filter((w) => isRinvoqSliderThumbnailUeRow(w));
    if (thumbRows.length === 0) return;

    wrappers.forEach((w) => {
      w.remove();
    });

    const abbvContent = document.createElement('div');
    abbvContent.className = 'abbv-content';

    const flexRow = document.createElement('div');
    flexRow.className = (
      'abbv-flex-container pl-15 pr-15 pl-md-0 pr-md-0 m-auto max-width-400 '
      + 'max-width-md-540 max-width-lg-960 slider-thumbnails adults flex-wrap-wrap flex-direction-row'
    );

    const total = thumbRows.length;
    thumbRows.forEach((w, index) => {
      flexRow.append(buildRinvoqSliderThumbnailFlexItemFromUeRow(w, index, total));
    });

    abbvContent.append(flexRow);
    block.append(abbvContent);
    wireRinvoqSliderThumbnailSelection(block);
  }
}
