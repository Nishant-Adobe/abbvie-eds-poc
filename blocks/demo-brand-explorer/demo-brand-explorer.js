export default function decorate(block) {
  const rows = [...block.children];
  if (!rows.length) return;

  const [barRow, ...restRows] = rows;

  // Parse bar row: bar label text
  const barLabel = barRow.textContent.trim() || 'Immunology Therapies';

  // Parse brand groups: each group starts with a row containing an image
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

  // Build bar
  const bar = document.createElement('div');
  bar.className = 'demo-brand-explorer-bar';

  const barLeft = document.createElement('div');
  barLeft.className = 'demo-brand-explorer-left';

  const browseBtn = document.createElement('button');
  browseBtn.className = 'demo-brand-explorer-browse';
  browseBtn.setAttribute('aria-expanded', 'false');
  browseBtn.setAttribute('aria-controls', 'demo-brand-explorer-content');
  browseBtn.textContent = barLabel;
  barLeft.append(browseBtn);

  const barRight = document.createElement('div');
  barRight.className = 'demo-brand-explorer-right';

  bar.append(barLeft, barRight);

  // Build content panel
  const content = document.createElement('div');
  content.className = 'demo-brand-explorer-content';
  content.id = 'demo-brand-explorer-content';
  content.hidden = true;

  const closeBtn = document.createElement('button');
  closeBtn.className = 'demo-brand-explorer-close';
  closeBtn.setAttribute('aria-label', 'Close brand explorer');
  closeBtn.textContent = 'Close';
  content.append(closeBtn);

  // Build accordions container
  const accordions = document.createElement('div');
  accordions.className = 'demo-brand-explorer-accordions';

  brands.forEach((brand) => {
    const brandSlug = brand.name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    const accordion = document.createElement('div');
    accordion.className = `demo-brand-explorer-accordion demo-brand-explorer-accordion--${brandSlug}`;

    // Blade (brand header)
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
    blade.append(separator);

    accordion.append(blade);

    // Links container
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

    // Visit link
    const visitLink = document.createElement('a');
    visitLink.href = brand.url;
    visitLink.className = 'demo-brand-explorer-visit';
    visitLink.textContent = `Visit ${brand.name}`;
    links.append(visitLink);

    accordion.append(links);
    accordions.append(accordion);
  });

  content.append(accordions);

  // Replace block content
  block.replaceChildren(bar, content);

  // Move to body bottom and fix position
  const section = block.closest('.section');
  if (section) {
    section.classList.add('demo-brand-explorer-section');
    document.body.append(section);
  }

  // Toggle logic
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

  // Close on outside click
  document.addEventListener('click', (e) => {
    if (block.classList.contains('is-open') && !block.contains(e.target)) {
      close();
    }
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && block.classList.contains('is-open')) close();
  });

  // Mobile accordion behavior
  const mobileBreakpoint = 896;
  accordions.addEventListener('click', (e) => {
    if (window.innerWidth >= mobileBreakpoint) return;
    const clickedBlade = e.target.closest('.demo-brand-explorer-blade');
    if (!clickedBlade) return;
    e.preventDefault();

    const parentAccordion = clickedBlade.closest('.demo-brand-explorer-accordion');
    const wasActive = parentAccordion.classList.contains('is-active');

    accordions.querySelectorAll('.demo-brand-explorer-accordion').forEach((acc) => {
      acc.classList.remove('is-active');
    });

    if (!wasActive) {
      parentAccordion.classList.add('is-active');
    }
  });
}
