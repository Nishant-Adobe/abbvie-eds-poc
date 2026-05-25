import { renderBlock } from '../../scripts/multi-theme.js';

function readConfig(block) {
  const cells = [...block.querySelectorAll(':scope > div > div')];
  const get = (i) => cells[i]?.textContent.trim() || '';
  return {
    sectionName: get(0),
    seeAllButtonText: get(1),
    seeAllUrl: get(2),
    statusLabel: get(3) || 'Status:',
    pdfLabel: get(4) || 'PDF',
    apiEndpoint: get(5),
    dashboardMode: get(6) === 'true',
    maxBadges: parseInt(get(7), 10) || 6,
  };
}

function renderCard(badge, config) {
  const achieved = badge.badgeStatus === 'Completed';
  const card = document.createElement('div');
  card.className = 'badge-card';
  if (!achieved) card.classList.add('badge-card--inprogress');

  const dateText = badge.dateAchieved
    ? `${badge.badgeStatus} ${badge.courseName} on ${badge.dateAchieved}${badge.expiryDate ? ` · Valid until ${badge.expiryDate}` : ''}`
    : `Complete ${badge.courseName} to achieve this badge`;

  card.innerHTML = `
    <div class="badge-card__top">
      <div class="badge-card__image">
        <img src="${badge.badgeImgUrl}" alt="${badge.badgeName}">
      </div>
      <div class="badge-card__info">
        <h4 class="badge-card__name">${badge.badgeName}</h4>
        <p class="badge-card__desc">${dateText}</p>
      </div>
    </div>
    <div class="badge-card__bottom">
      <div class="badge-card__status">
        <span class="badge-card__status-label">${config.statusLabel}</span>
        <span class="badge-card__status-value">${achieved ? 'Achieved' : 'In Progress'}</span>
      </div>
      <div class="badge-card__actions${achieved ? '' : ' badge-card__actions--inprogress'}">
        <a class="badge-card__pdf${achieved ? '' : ' badge-card__pdf--disabled'}"
           href="${achieved ? badge.s3PdfUrl : '#'}"
           aria-label="Download certificate PDF"
           ${achieved ? '' : 'aria-disabled="true" tabindex="-1"'}>
          ${config.pdfLabel}
        </a>
        <span class="badge-card__certificate${achieved ? '' : ' badge-card__certificate--inprogress'}">
          Certificate
        </span>
      </div>
    </div>`;
  return card;
}

function renderError(container) {
  container.innerHTML = '<p class="badge-error">Unable to load badges. Please try again later.</p>';
}

export async function decorateBlock(block) {
  const config = readConfig(block);
  block.textContent = '';

  if (!config.apiEndpoint) {
    block.innerHTML = '<p class="badge-error">No API endpoint configured.</p>';
    return;
  }

  const header = document.createElement('div');
  header.className = 'badge-header';
  header.innerHTML = `<h3 class="badge-title">${config.sectionName}</h3>`;
  if (config.dashboardMode && config.seeAllUrl) {
    const btn = document.createElement('a');
    btn.className = 'badge-seeall';
    btn.href = config.seeAllUrl;
    btn.textContent = config.seeAllButtonText || 'See All';
    header.appendChild(btn);
  }
  block.appendChild(header);

  const grid = document.createElement('div');
  grid.className = 'badge-grid';
  grid.innerHTML = '<p class="badge-loading">Loading badges…</p>';
  block.appendChild(grid);

  try {
    const res = await fetch(config.apiEndpoint, { credentials: 'include' });
    if (!res.ok) throw new Error(`API ${res.status}`);
    const data = await res.json();

    let badges = Array.isArray(data) ? data : data.badges || [];
    if (config.dashboardMode && config.maxBadges) {
      badges = badges.slice(0, config.maxBadges);
    }

    grid.textContent = '';
    if (!badges.length) {
      grid.innerHTML = '<p class="badge-empty">No badges found.</p>';
      return;
    }

    badges.forEach((badge) => grid.appendChild(renderCard(badge, config)));
  } catch {
    renderError(grid);
  }
}

export default async function decorate(block) {
  await renderBlock(block);
}
