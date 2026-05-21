import { renderBlock } from '../../scripts/multi-theme.js';

// Platform-managed user profile badges endpoint
const PROFILE_API = '/api/user/badges';

function cellText(row) {
  return row?.children?.[0]?.textContent?.trim() || '';
}

function cellHref(row) {
  const a = row?.querySelector('a');
  return a ? (a.getAttribute('href') || a.href) : cellText(row);
}

function cellNumber(row) {
  const n = parseInt(cellText(row), 10);
  return Number.isNaN(n) ? null : n;
}

function readConfig(block) {
  const rows = [...block.children];
  return {
    sectionTitle: cellText(rows[0]),
    seeAllLabel: cellText(rows[1]),
    seeAllHref: cellHref(rows[2]),
    certificateStatusLabel: cellText(rows[3]),
    maxBadges: cellNumber(rows[4]),
    pdfDownloadLabel: cellText(rows[5]),
  };
}

function buildStatusIcon(status) {
  const icon = document.createElement('span');
  const safeStatus = status.replace(/[^a-z0-9]/g, '-');
  icon.className = `badge-status-icon badge-status-icon-${safeStatus}`;
  icon.setAttribute('aria-hidden', 'true');
  return icon;
}

function buildBadgeItem(badge, cfg) {
  const li = document.createElement('li');
  li.className = 'badge-item';
  li.setAttribute('role', 'listitem');

  const img = document.createElement('img');
  img.className = 'badge-item-image';
  img.src = badge.imageUrl;
  img.alt = badge.imageAlt || badge.title;
  img.loading = 'lazy';
  img.width = 80;
  img.height = 80;

  const info = document.createElement('div');
  info.className = 'badge-item-info';

  const title = document.createElement('p');
  title.className = 'badge-item-title';
  title.textContent = badge.title;

  const statusWrap = document.createElement('p');
  statusWrap.className = 'badge-item-status';
  statusWrap.append(buildStatusIcon(badge.status));
  const statusText = document.createElement('span');
  statusText.className = 'badge-item-status-text';
  statusText.textContent = cfg.certificateStatusLabel
    ? `${cfg.certificateStatusLabel}: ${badge.status}`
    : badge.status;
  statusWrap.append(statusText);

  info.append(title, statusWrap);

  if (badge.certificateUrl && cfg.pdfDownloadLabel) {
    const pdfLink = document.createElement('a');
    pdfLink.className = 'badge-item-pdf';
    pdfLink.href = badge.certificateUrl;
    pdfLink.textContent = cfg.pdfDownloadLabel;
    pdfLink.target = '_blank';
    pdfLink.rel = 'noopener';
    info.append(pdfLink);
  }

  li.append(img, info);
  return li;
}

function buildGrid(badges, cfg) {
  const grid = document.createElement('ul');
  grid.className = 'badge-grid';
  grid.setAttribute('role', 'list');
  const limit = cfg.maxBadges || badges.length;
  badges.slice(0, limit).forEach((badge) => grid.append(buildBadgeItem(badge, cfg)));
  return grid;
}

export async function decorateBlock(block) {
  const cfg = readConfig(block);
  block.textContent = '';

  const header = document.createElement('div');
  header.className = 'badge-header';

  if (cfg.sectionTitle) {
    const heading = document.createElement('h2');
    heading.className = 'badge-title';
    heading.textContent = cfg.sectionTitle;
    header.append(heading);
  }

  if (cfg.seeAllLabel && cfg.seeAllHref) {
    const seeAll = document.createElement('a');
    seeAll.className = 'badge-see-all';
    seeAll.href = cfg.seeAllHref;
    seeAll.textContent = cfg.seeAllLabel;
    header.append(seeAll);
  }

  block.append(header);

  const loading = document.createElement('div');
  loading.className = 'badge-loading';
  loading.setAttribute('aria-live', 'polite');
  loading.setAttribute('aria-busy', 'true');
  block.append(loading);

  let badges;
  try {
    const res = await fetch(PROFILE_API, { credentials: 'include' });
    if (!res.ok) throw new Error(`API ${res.status}`);
    const data = await res.json();
    badges = data.badges || [];
  } catch {
    loading.remove();
    const msg = document.createElement('p');
    msg.className = 'badge-error';
    msg.textContent = 'Unable to load badges at this time.';
    block.append(msg);
    return;
  }

  loading.remove();

  if (!badges.length) {
    const empty = document.createElement('p');
    empty.className = 'badge-empty';
    empty.textContent = 'No badges earned yet.';
    block.append(empty);
    return;
  }

  block.append(buildGrid(badges, cfg));
}

export default async function decorate(block) {
  await renderBlock(block);
}
