export default async function decorate(block) {
  const section = block.closest('.section');

  // Add helper classes for CSS specificity reduction
  if (section) {
    if (section.classList.contains('navy-overlap') && section.classList.contains('hero-container')) {
      section.classList.add('hero-navy');
    }
    if (section.classList.contains('hero-container') && block.classList.contains('profile')) {
      section.classList.add('hero-profile-section');
    }
    if (section.classList.contains('hero-container') && block.classList.contains('landing')) {
      section.classList.add('hero-landing-section');
    }
  }

  // Absorb a breadcrumb block into the hero text panel.
  // The breadcrumb may be in the same section or in the immediately
  // preceding sibling section (separate section break in authoring).
  const textPanel = block.querySelector(':scope > div:nth-child(2) > div');
  textPanel.parentElement.classList.add('hero-text-container');
  textPanel.classList.add('cmp-container-x-large');
  if (section && textPanel) {
    let breadcrumbWrapper = section.querySelector('.breadcrumb-wrapper');
    // Also check the previous sibling section
    if (!breadcrumbWrapper) {
      const prevSection = section.previousElementSibling;
      if (prevSection?.classList.contains('section')) {
        breadcrumbWrapper = prevSection.querySelector('.breadcrumb-wrapper');
      }
    }
    if (breadcrumbWrapper) {
      const breadcrumbBlock = breadcrumbWrapper.querySelector('.breadcrumb');
      if (breadcrumbBlock) {
        textPanel.prepend(breadcrumbBlock);
        breadcrumbWrapper.remove();
        // Remove the previous section if it's now empty
        const prevSection = section.previousElementSibling;
        if (prevSection?.classList.contains('section') && !prevSection.children.length) {
          prevSection.remove();
        }
      }
    }
  }

  // Eyebrow detection: first <p> before <h1>/<h2> with no links/images → .hero-eyebrow
  const firstP = textPanel?.querySelector('p:first-child');
  if (firstP && !firstP.querySelector('a') && !firstP.querySelector('img')) {
    const nextEl = firstP.nextElementSibling;
    if (nextEl?.tagName === 'H1' || nextEl?.tagName === 'H2') {
      firstP.classList.add('hero-eyebrow');
    }
  }

  // Mobile image swap: two pictures authored = desktop + mobile responsive swap.
  // Plain authoring: two <picture> tags in the same first-row div.
  // UE authoring: two separate div rows in the image cell (mobileImage field).
  const imgCell = block.querySelector(':scope > div:first-child');
  if (imgCell) {
    let desktopPicture = null;
    let mobilePicture = null;

    const firstRow = imgCell.querySelector(':scope > div');
    if (firstRow) {
      const pics = firstRow.querySelectorAll('picture');
      if (pics.length === 2) {
        [desktopPicture, mobilePicture] = pics;
      }
    }

    if (!desktopPicture) {
      const rows = imgCell.querySelectorAll(':scope > div');
      if (rows.length >= 2) {
        desktopPicture = rows[0].querySelector('picture');
        mobilePicture = rows[1].querySelector('picture');
      }
    }

    if (desktopPicture && mobilePicture) {
      const desktopImg = desktopPicture.querySelector('img');
      const mobileImg = mobilePicture.querySelector('img');
      if (desktopImg && mobileImg) {
        const combinedPicture = document.createElement('picture');
        const desktopSource = document.createElement('source');
        desktopSource.media = '(min-width: 744px)';
        desktopSource.srcset = desktopImg.src;
        combinedPicture.appendChild(desktopSource);
        combinedPicture.appendChild(mobileImg.cloneNode(true));
        desktopPicture.replaceWith(combinedPicture);
        mobilePicture.closest('div')?.remove();
      }
    }
  }

  // Promote hero image for default/profile/landing variants.
  // Local/import: first cell has an <img> tag.
  // AEM Author: first cell has a reference <a> link (no <img>).
  // Converts the reference link to an <img> spacer so CSS aspect-ratio preserves height.
  if (section) {
    const imgCellInner = block.querySelector(':scope > div:first-child');
    const img = imgCellInner?.querySelector('img');

    if (!img) {
      const link = imgCellInner?.querySelector('a');
      if (link?.href) {
        const spacer = document.createElement('img');
        spacer.src = link.href;
        spacer.alt = link.title || link.textContent || '';
        const container = link.closest('.button-container') || link.closest('p') || link;
        container.replaceWith(spacer);
      }
    }
  }

  // Landing hero: absorb press-releases block from the same section.
  if (block.closest('.section') && textPanel && block.classList.contains('landing')) {
    const pressReleasesWrapper = block.closest('.section').querySelector('.press-releases-wrapper');
    if (pressReleasesWrapper) {
      const pressReleasesBlock = pressReleasesWrapper.querySelector('.press-releases');
      if (pressReleasesBlock) {
        const pressReleasesContainer = document.createElement('div');
        pressReleasesContainer.classList.add('hero-press-releases-container');
        pressReleasesContainer.appendChild(pressReleasesBlock);
        textPanel.appendChild(pressReleasesContainer);
        pressReleasesWrapper.remove();
      }
    }
  }

  // Multilayer hero: toggle layers on abbv:buddy:stateChange events.
  // Each direct-child div of the image cell that has [data-buddy-state]
  // is a layer; only the matching one gets .is-active.
  if (block.classList.contains('multilayer')) {
    const imageCell = block.querySelector(':scope > div:first-child');
    if (imageCell) {
      const layers = [...imageCell.children].filter((el) => el.dataset.buddyState);
      if (layers.length > 0) {
        layers.forEach((layer) => layer.classList.add('hero-layer'));
        layers[0].classList.add('is-active');
        document.addEventListener('abbv:buddy:stateChange', (e) => {
          const { state } = e.detail || {};
          if (!state) return;
          layers.forEach((layer) => {
            layer.classList.toggle('is-active', layer.dataset.buddyState === state);
          });
        });
      }
    }
  }

  // Video hero: initialize Brightcove player for background video variant.
  // Authoring: the last <p> in the image cell must contain only the Brightcove video ID
  // (a numeric string, e.g. "6369925747112"). The fallback poster image is authored
  // as a <picture> before the ID paragraph. On mobile the video is suppressed.
  // Override the Brightcove account by adding data-brightcove-account on the block element.
  if (block.classList.contains('video')) {
    const videoImgCell = block.querySelector(':scope > div:first-child');
    const videoIdEl = videoImgCell?.querySelector('p:last-of-type');
    const videoId = videoIdEl?.textContent?.trim();

    if (videoId && /^\d+$/.test(videoId)) {
      videoIdEl.remove();
      const brightcoveAccount = block.dataset.brightcoveAccount || '2157889328001';

      if (window.matchMedia('(min-width: 744px)').matches) {
        const videoContainer = document.createElement('div');
        videoContainer.classList.add('hero-video-bg');

        const videoEl = document.createElement('video');
        videoEl.setAttribute('autoplay', '');
        videoEl.setAttribute('muted', '');
        videoEl.setAttribute('loop', '');
        videoEl.setAttribute('playsinline', '');
        videoEl.setAttribute('data-video-id', videoId);
        videoEl.setAttribute('data-account', brightcoveAccount);
        videoEl.setAttribute('data-player', 'default');
        videoEl.classList.add('video-js');
        videoContainer.appendChild(videoEl);

        const firstRow = videoImgCell.querySelector(':scope > div') || videoImgCell;
        firstRow.appendChild(videoContainer);

        const script = document.createElement('script');
        script.src = `https://players.brightcove.net/${brightcoveAccount}/default_default/index.min.js`;
        script.defer = true;
        document.head.appendChild(script);
      }
    }
  }
}
