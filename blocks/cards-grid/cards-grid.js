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

export default function decorate(block) {
  if (isInUniversalEditor()) {
    return;
  }

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
