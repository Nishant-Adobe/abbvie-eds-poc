// v2.2 — skip decoration in UE edit mode so authors can add child items
import { shouldRunOutsideAuthorEdit } from '../../scripts/utils.js';

export default function decorate(block) {
  if (!shouldRunOutsideAuthorEdit()) return;

  const rows = [...block.children];
  if (!rows.length) return;

  const [barRow, ...restRows] = rows;
  const barCells = [...barRow.children];
  const barLabel = barCells[0]?.textContent.trim() || 'Immunology Therapies';

  const utilityLinks = [];
  for (let i = 1; i < barCells.length; i += 1) {
    const a = barCells[i]?.querySelector('a');
    if (a) utilityLinks.push({ text: a.textContent.trim(), href: a.href, target: a.target || '_self' });
  }

  // UE xwalk stores fields as separate rows — try reading utility links from block rows
  if (!utilityLinks.length && rows.length > 3) {
    const fieldTexts = rows.map((r) => r.textContent.trim());
    for (let i = 0; i < fieldTexts.length - 1; i += 1) {
      const text = fieldTexts[i];
      const nextVal = fieldTexts[i + 1];
      if (text && nextVal && (nextVal.startsWith('http') || nextVal.startsWith('/'))) {
        if (['Contact Medical Info', 'Full Prescribing Information', 'Patient Site'].includes(text)) {
          utilityLinks.push({ text, href: nextVal, target: text.includes('Contact') ? '_self' : '_blank' });
        }
      }
    }
  }

  if (!utilityLinks.length) {
    utilityLinks.push(
      { text: 'Contact Medical Info', href: '#', target: '_self' },
      { text: 'Full Prescribing Information', href: '/prescribinginfo', target: '_blank' },
      { text: 'Patient Site', href: '/patientsite', target: '_blank' },
    );
  }

  const brands = [];
  let currentBrand = null;

  restRows.forEach((row) => {
    const cells = [...row.children];
    const hasImage = cells[0]?.querySelector('img, picture');

    if (hasImage) {
      currentBrand = {
        image: hasImage.cloneNode(true),
        name: cells[1]?.textContent.trim() || '',
        safetyText: cells[2]?.innerHTML.trim() || '',
        url: cells[3]?.textContent.trim() || '#',
        color: cells[4]?.textContent.trim() || '',
        indications: [],
      };
      brands.push(currentBrand);
    } else if (currentBrand) {
      const indicationName = cells[0]?.textContent.trim();
      const indicationUrl = cells[1]?.textContent.trim() || '#';
      const severity = cells[2]?.textContent.trim().toLowerCase() || '';
      if (indicationName) {
        currentBrand.indications.push({ name: indicationName, url: indicationUrl, severity });
      }
    }
  });

  // Bar
  const bar = document.createElement('div');
  bar.className = 'demo-brand-explorer-bar';

  const barLeft = document.createElement('div');
  barLeft.className = 'demo-brand-explorer-left';

  const logoLink = document.createElement('a');
  logoLink.href = 'https://www.abbvie.com';
  logoLink.target = '_blank';
  logoLink.className = 'demo-brand-explorer-logo-link';
  logoLink.setAttribute('aria-label', 'AbbVie');
  logoLink.innerHTML = '<svg viewBox="0 0 124.4 21.5" class="demo-brand-explorer-abbvie-logo"><g><path fill="currentColor" d="M123.8,20.8c0-1.3-0.8-1.8-2-1.8c-0.7,0-9.2,0-9.2,0c-4.5,0-5.6-2.7-5.8-4.4c0,0,9.5,0,12.5,0c3.8,0,5-2.8,5-4.6c0-1.9-1.2-4.6-5-4.6c-3.4,0-6.9,0-6.9,0c-6.5,0-8.6,4.4-8.6,8c0,3.9,2.4,8,8.6,8h11.4C123.8,21.5,123.8,20.9,123.8,20.8z M112.6,7.8c1,0,4.6,0,6,0c2.2,0,2.7,1.3,2.7,2.2c0,0.8-0.5,2.2-2.7,2.2c-1.5,0-12,0-12,0C106.8,10.8,108.1,7.8,112.6,7.8z M85.9,20.5c-0.7,0.9-1,1.3-1.7,1.3c-0.9,0-1.1-0.4-1.7-1.3c-1.4-2-9.8-15-9.8-15s0.6,0,1.2,0c2,0,2.6,0.9,3.2,1.9c0.5,0.8,7.3,11.2,7.3,11.2s6.4-9.9,7.3-11.3c0.6-0.9,1.4-1.8,3.3-1.8c0.4,0,0.9,0,0.9,0S87.1,18.9,85.9,20.5z M22.8,21.5c-1.5,0-2.1-0.6-2.3-1.8L20.1,18c-0.4,0.7-2.4,3.5-6.8,3.5c0,0-2.2,0-4.5,0c-6.8,0-8.7-4.6-8.7-8c0-3.8,2.3-8,8.7-8c1.3,0,2.7,0,4.8,0c4.9,0,7.6,2.8,8.2,6.3c0.5,2.9,1.8,9.7,1.8,9.7S23.3,21.5,22.8,21.5z M12.9,8c-1.6,0-2,0-3.8,0C4.5,8,3,10.9,3,13.5S4.5,19,9.1,19c1.9,0,2.5,0,3.8,0c4.8,0,6.1-3,6.1-5.5C19,11.3,17.8,8,12.9,8z M99,2.9c0.7,0,1.4-0.4,1.4-1.3c0-0.2,0-0.4,0-0.5c0-0.8-0.7-1.3-1.4-1.3c-0.7,0-1.4,0.4-1.4,1.3c0,0.1,0,0.3,0,0.5C97.6,2.5,98.3,2.9,99,2.9z M97.7,5.5c0,0,0.4,0,0.6,0c1.3,0,2.1,0.7,2.1,2.1c0,0.2,0,13.9,0,13.9s-0.3,0-0.6,0c-1.3,0-2.1-0.8-2.1-2.2C97.7,19.2,97.7,5.5,97.7,5.5z M28.1,7.8c0.6-0.6,2.4-2.3,5.9-2.3c0,0,2.2,0,4.5,0c6.8,0,8.8,4.6,8.8,8c0,3.8-2.4,8-8.8,8c-1.3,0-2.7,0-4.8,0c-4.9,0-8.4-3.1-8.4-8c0-1.6,0-13.4,0-13.4s0.5,0,0.8,0c1.4,0,2,0.7,2,1.9C28.1,2.2,28.1,7.8,28.1,7.8z M34.4,19c1.6,0,2,0,3.8,0c4.5,0,6.1-2.9,6.1-5.5S42.8,8,38.2,8c-1.9,0-2.5,0-3.8,0c-4.8,0-6.1,3-6.1,5.5C28.2,15.7,29.5,19,34.4,19z M53.2,7.8c0.6-0.6,2.4-2.3,5.9-2.3c0,0,2.2,0,4.5,0c6.8,0,8.7,4.6,8.7,8c0,3.8-2.3,8-8.7,8c-1.3,0-2.7,0-4.8,0c-4.9,0-8.4-3.1-8.4-8c0-1.6,0-13.4,0-13.4s0.5,0,0.8,0c1.4,0,2,0.7,2,1.9C53.2,2.2,53.2,7.8,53.2,7.8z M59.5,19c1.6,0,2,0,3.8,0c4.6,0,6.1-2.9,6.1-5.5S67.9,8,63.3,8c-1.9,0-2.4,0-3.8,0c-4.8,0-6.1,3-6.1,5.5C53.3,15.7,54.6,19,59.5,19z"/></g></svg>';
  barLeft.append(logoLink);

  const browseBtn = document.createElement('button');
  browseBtn.className = 'demo-brand-explorer-browse';
  browseBtn.setAttribute('aria-expanded', 'false');
  browseBtn.setAttribute('aria-controls', 'demo-brand-explorer-content');
  browseBtn.innerHTML = `<span>${barLabel}</span><span class="demo-brand-explorer-browse-icon"></span>`;
  barLeft.append(browseBtn);

  const barRight = document.createElement('div');
  barRight.className = 'demo-brand-explorer-right';

  utilityLinks.forEach((link) => {
    const a = document.createElement('a');
    a.href = link.href;
    a.textContent = link.text;
    a.target = link.target;
    if (link.text.toLowerCase().includes('contact medical')) {
      a.href = '#';
      a.dataset.modal = 'contact-medical';
    }
    barRight.append(a);
  });

  bar.append(barLeft, barRight);

  // Contact Medical Info modal
  const modal = document.createElement('div');
  modal.className = 'demo-brand-explorer-modal';
  modal.hidden = true;
  modal.setAttribute('role', 'dialog');
  modal.setAttribute('aria-modal', 'true');
  modal.innerHTML = `
    <div class="demo-brand-explorer-modal-overlay"></div>
    <div class="demo-brand-explorer-modal-dialog">
      <button class="demo-brand-explorer-modal-close" aria-label="Close modal"></button>
      <h2 class="demo-brand-explorer-modal-title">You are about to enter a site that is for U.S. Healthcare Professionals Only.</h2>
      <p class="demo-brand-explorer-modal-text">By selecting "Yes" below, you certify that you are a Healthcare Professional and that you wish to proceed to the Healthcare Professionals Only section on the AbbVie Medical Information site. Products or treatments described on this site are available in the U.S. but may not be available in all other countries. I am a licensed Healthcare Professional and wish to proceed to the Healthcare Professionals Only AbbVie Medical Information Site.</p>
      <div class="demo-brand-explorer-modal-actions">
        <a class="demo-brand-explorer-modal-btn demo-brand-explorer-modal-yes" href="https://www.abbviemedinfo.com" target="_blank">YES</a>
        <button class="demo-brand-explorer-modal-btn demo-brand-explorer-modal-no">NO</button>
      </div>
    </div>
  `;
  document.body.append(modal);

  function openModal() {
    modal.hidden = false;
    document.body.style.overflow = 'hidden';
  }

  function closeModal() {
    modal.hidden = true;
    document.body.style.overflow = '';
  }

  modal.querySelector('.demo-brand-explorer-modal-close').addEventListener('click', closeModal);
  modal.querySelector('.demo-brand-explorer-modal-no').addEventListener('click', closeModal);
  modal.querySelector('.demo-brand-explorer-modal-overlay').addEventListener('click', closeModal);
  modal.querySelector('.demo-brand-explorer-modal-yes').addEventListener('click', closeModal);

  barRight.addEventListener('click', (e) => {
    const trigger = e.target.closest('[data-modal="contact-medical"]');
    if (trigger) {
      e.preventDefault();
      openModal();
    }
  });

  // Content panel
  const content = document.createElement('div');
  content.className = 'demo-brand-explorer-content';
  content.id = 'demo-brand-explorer-content';
  content.hidden = true;

  const closeBtn = document.createElement('button');
  closeBtn.className = 'demo-brand-explorer-close';
  closeBtn.setAttribute('aria-label', 'Close brand explorer');
  closeBtn.innerHTML = 'Close <span class="demo-brand-explorer-close-icon"></span>';
  content.append(closeBtn);

  // Accordions
  const accordions = document.createElement('div');
  accordions.className = 'demo-brand-explorer-accordions';

  brands.forEach((brand) => {
    const brandSlug = brand.name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    const accordion = document.createElement('div');
    accordion.className = `demo-brand-explorer-accordion demo-brand-explorer-accordion--${brandSlug}`;

    const blade = document.createElement('div');
    blade.className = 'demo-brand-explorer-blade';

    const bladeLink = document.createElement('a');
    bladeLink.href = brand.url;
    bladeLink.className = 'demo-brand-explorer-blade-link';

    const img = brand.image.tagName === 'IMG' ? brand.image : brand.image.querySelector('img');
    if (img) {
      img.className = 'demo-brand-explorer-brand-img';
      img.loading = 'lazy';
      bladeLink.append(img);
    }
    blade.append(bladeLink);

    if (brand.safetyText) {
      const subtitle = document.createElement('div');
      subtitle.className = 'demo-brand-explorer-subtitle';
      subtitle.innerHTML = brand.safetyText;
      blade.append(subtitle);
    }

    const separator = document.createElement('hr');
    separator.className = 'demo-brand-explorer-separator';
    if (brand.color) separator.style.backgroundColor = brand.color;
    blade.append(separator);

    accordion.append(blade);

    const links = document.createElement('div');
    links.className = 'demo-brand-explorer-links';

    brand.indications.forEach((ind) => {
      const a = document.createElement('a');
      a.href = ind.url;
      a.className = 'demo-brand-explorer-indication';
      if (ind.severity) {
        a.classList.add(`demo-brand-explorer-indication--${ind.severity}`);
      }
      a.textContent = ind.name;
      links.append(a);
    });

    const visitLink = document.createElement('a');
    visitLink.href = brand.url;
    visitLink.className = 'demo-brand-explorer-visit';
    visitLink.innerHTML = `Visit ${brand.name} <span class="demo-brand-explorer-visit-arrow" ${brand.color ? `style="background-color:${brand.color}"` : ''}></span>`;
    links.append(visitLink);

    accordion.append(links);
    accordions.append(accordion);
  });

  content.append(accordions);

  const projectNum = document.createElement('div');
  projectNum.className = 'demo-brand-explorer-project-number';
  projectNum.textContent = 'US-MULT-250253';
  content.append(projectNum);

  block.replaceChildren(content, bar);

  const section = block.closest('.section');
  if (section) {
    section.classList.add('demo-brand-explorer-section');
  }

  // Toggle
  function open() {
    content.hidden = false;
    requestAnimationFrame(() => {
      block.classList.add('is-open');
      browseBtn.setAttribute('aria-expanded', 'true');
      closeBtn.focus();
    });
  }

  function close() {
    block.classList.remove('is-open');
    browseBtn.setAttribute('aria-expanded', 'false');
    content.addEventListener('transitionend', () => { content.hidden = true; }, { once: true });
    browseBtn.focus();
  }

  browseBtn.addEventListener('click', () => {
    if (block.classList.contains('is-open')) close();
    else open();
  });

  closeBtn.addEventListener('click', close);

  document.addEventListener('click', (e) => {
    if (block.classList.contains('is-open') && !block.contains(e.target)) close();
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && block.classList.contains('is-open')) close();
  });

  // Mobile accordion
  accordions.addEventListener('click', (e) => {
    if (window.innerWidth >= 896) return;
    const clickedBlade = e.target.closest('.demo-brand-explorer-blade');
    if (!clickedBlade) return;
    e.preventDefault();

    const parentAccordion = clickedBlade.closest('.demo-brand-explorer-accordion');
    const wasActive = parentAccordion.classList.contains('is-active');

    accordions.querySelectorAll('.demo-brand-explorer-accordion').forEach((acc) => {
      acc.classList.remove('is-active');
    });

    if (!wasActive) parentAccordion.classList.add('is-active');
  });
}
