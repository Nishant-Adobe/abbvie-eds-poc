import { applyCommonProps } from '../../scripts/utils.js';

const SVG_NS = 'http://www.w3.org/2000/svg';
const SAFE_URL_RE = /^(https?:\/\/|\/)/i;

const PLATFORMS = {
  twitter: {
    label: 'Share on X (Twitter)',
    buildUrl: (url) => `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}`,
    paths: [
      { d: 'M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.747l7.73-8.835L1.254 2.25H8.08l4.253 5.622zm-1.161 17.52h1.833L7.084 4.126H5.117z' },
    ],
  },
  facebook: {
    label: 'Share on Facebook',
    buildUrl: (url) => `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
    paths: [
      { d: 'M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z' },
    ],
  },
  linkedin: {
    label: 'Share on LinkedIn',
    buildUrl: (url) => `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`,
    paths: [
      { d: 'M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z' },
    ],
  },
};

function buildSvgIcon(paths, viewBox = '0 0 24 24') {
  const svg = document.createElementNS(SVG_NS, 'svg');
  svg.setAttribute('viewBox', viewBox);
  svg.setAttribute('aria-hidden', 'true');
  svg.setAttribute('focusable', 'false');
  paths.forEach(({ d, fill = 'currentColor' }) => {
    const path = document.createElementNS(SVG_NS, 'path');
    path.setAttribute('d', d);
    path.setAttribute('fill', fill);
    svg.append(path);
  });
  return svg;
}

function buildEmailIcon() {
  return buildSvgIcon([
    { d: 'M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z' },
  ]);
}

function buildPrintIcon() {
  return buildSvgIcon([
    { d: 'M19 8H5c-1.66 0-3 1.34-3 3v6h4v4h12v-4h4v-6c0-1.66-1.34-3-3-3zm-3 11H8v-5h8v5zm3-7c-.55 0-1-.45-1-1s.45-1 1-1 1 .45 1 1-.45 1-1 1zm-1-9H6v4h12V3z' },
  ]);
}

function buildVisuallyHidden(text) {
  const span = document.createElement('span');
  span.className = 'social-share-visually-hidden';
  span.textContent = text;
  return span;
}

function buildPlatformItem(platformKey, config, shareUrl) {
  const li = document.createElement('li');
  li.className = 'social-share-item';

  const a = document.createElement('a');
  a.className = `social-share-link social-share-link-${platformKey}`;
  a.href = config.buildUrl(shareUrl);
  a.target = '_blank';
  a.rel = 'noopener noreferrer';
  a.setAttribute('aria-label', config.label);
  a.append(buildSvgIcon(config.paths));
  a.append(buildVisuallyHidden(config.label));

  li.append(a);
  return li;
}

function buildEmailItem(shareUrl) {
  const title = document.title || document.querySelector('h1')?.textContent?.trim() || '';
  const li = document.createElement('li');
  li.className = 'social-share-item';

  const a = document.createElement('a');
  a.className = 'social-share-link social-share-link-email';
  a.href = `mailto:?subject=${encodeURIComponent(title)}&body=${encodeURIComponent(shareUrl)}`;
  a.setAttribute('aria-label', 'Share via email');
  a.append(buildEmailIcon());
  a.append(buildVisuallyHidden('Share via email'));

  li.append(a);
  return li;
}

function buildPrintItem() {
  const li = document.createElement('li');
  li.className = 'social-share-item';

  const btn = document.createElement('button');
  btn.type = 'button';
  btn.className = 'social-share-link social-share-link-print';
  btn.setAttribute('aria-label', 'Print this page');
  btn.append(buildPrintIcon());
  btn.append(buildVisuallyHidden('Print this page'));
  btn.addEventListener('click', () => window.print());

  li.append(btn);
  return li;
}

function readFirstCellText(row) {
  if (!row) return '';
  const cell = row.firstElementChild;
  return (cell?.textContent ?? row.textContent ?? '').trim();
}

export default async function decorate(block) {
  applyCommonProps(block);

  const rows = [...block.children];
  const rawUrl = readFirstCellText(rows[0]);
  const rawPlatforms = readFirstCellText(rows[1]);

  const shareUrl = rawUrl && SAFE_URL_RE.test(rawUrl)
    ? rawUrl
    : window.location.href;

  const platformKeys = rawPlatforms
    ? rawPlatforms.split(',').map((s) => s.trim()).filter(Boolean)
    : Object.keys(PLATFORMS);

  rows.forEach((row) => row.remove());

  const list = document.createElement('ul');
  list.className = 'social-share-list';
  list.setAttribute('role', 'list');
  list.setAttribute('aria-label', 'Share this page');

  platformKeys.forEach((key) => {
    const config = PLATFORMS[key];
    if (config) list.append(buildPlatformItem(key, config, shareUrl));
  });

  if (block.classList.contains('social-share-email')) {
    list.append(buildEmailItem(shareUrl));
  }

  if (block.classList.contains('social-share-print')) {
    list.append(buildPrintItem());
  }

  block.append(list);
}
