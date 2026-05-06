export default async function decorate(block) {
  const section = block.closest('.section');

  // ── Section helper classes
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

  // ── Extract rows via block.children
  // UE authoring: one row per content field. classes_* fields → CSS classes, no DOM row.
  // Model field order: image, imageAlt, mobileImage, mobileImageAlt, eyebrow, text, layers, video
  const rows = Array.from(block.children);

  // Video row: any row whose only content is a DAM video reference link
  const videoRow = rows.find((row) => {
    const link = row.firstElementChild?.querySelector('a[href]');
    if (!link) return false;
    const { href } = link;
    return (
      /\.(mp4|webm|mov|m4v)(\?.*)?$/i.test(href)
      || (/\/content\/dam\//i.test(href) && !/\.(jpg|jpeg|png|gif|webp|svg|pdf|html)(\?.*)?$/i.test(href))
    );
  });

  // Image row: always the first row (may be empty when only video is authored)
  const imageRow = rows[0];
  const imageCell = imageRow?.firstElementChild;

  // Text row: first non-image, non-video row that contains a heading or a CTA link
  const textRow = rows.slice(1).find((row) => {
    if (row === videoRow) return false;
    const cell = row.firstElementChild;
    return cell?.querySelector('h1,h2,h3,h4,h5,h6') || cell?.querySelector('a[href]');
  });
  const textCell = textRow?.firstElementChild;

  // Mobile image row: a remaining row (not text, not video) that carries a picture
  const mobileImageRow = rows.slice(1).find((row) => {
    if (row === textRow || row === videoRow) return false;
    return row.firstElementChild?.querySelector('picture,img');
  });

  // ── Text panel: add classes for CSS targeting
  if (textCell) {
    textCell.parentElement.classList.add('hero-text-container');
    textCell.classList.add('cmp-container-x-large');
  }

  // ── Absorb breadcrumb into text panel
  // The breadcrumb may live in the same section or in the immediately preceding section.
  if (section && textCell) {
    let breadcrumbWrapper = section.querySelector('.breadcrumb-wrapper');
    if (!breadcrumbWrapper) {
      const prevSection = section.previousElementSibling;
      if (prevSection?.classList.contains('section')) {
        breadcrumbWrapper = prevSection.querySelector('.breadcrumb-wrapper');
      }
    }
    if (breadcrumbWrapper) {
      const breadcrumbBlock = breadcrumbWrapper.querySelector('.breadcrumb');
      if (breadcrumbBlock) {
        textCell.prepend(breadcrumbBlock);
        breadcrumbWrapper.remove();
        const prevSection = section.previousElementSibling;
        if (prevSection?.classList.contains('section') && !prevSection.children.length) {
          prevSection.remove();
        }
      }
    }
  }

  // ── Eyebrow: first <p> before <h1>/<h2> with no links or images → .hero-eyebrow
  if (textCell) {
    const firstP = textCell.querySelector('p:first-child');
    if (firstP && !firstP.querySelector('a') && !firstP.querySelector('img')) {
      const next = firstP.nextElementSibling;
      if (next?.tagName === 'H1' || next?.tagName === 'H2') {
        firstP.classList.add('hero-eyebrow');
      }
    }
  }

  // ── Mobile image: merge desktop + mobile into one responsive <picture>
  if (imageCell) {
    let desktopPicture = null;
    let mobilePicture = null;

    // Case 1: two <picture> elements inline in the image cell
    const inlinePics = imageCell.querySelectorAll('picture');
    if (inlinePics.length >= 2) {
      [desktopPicture, mobilePicture] = inlinePics;
    }

    // Case 2: mobile image authored as a separate UE field row
    if (!desktopPicture && mobileImageRow) {
      desktopPicture = imageCell.querySelector('picture');
      mobilePicture = mobileImageRow.firstElementChild?.querySelector('picture');
    }

    if (desktopPicture && mobilePicture) {
      const desktopImg = desktopPicture.querySelector('img');
      const mobileImg = mobilePicture.querySelector('img');
      if (desktopImg && mobileImg) {
        const combined = document.createElement('picture');
        const source = document.createElement('source');
        source.media = '(min-width: 744px)';
        source.srcset = desktopImg.src;
        combined.appendChild(source);
        combined.appendChild(mobileImg.cloneNode(true));
        desktopPicture.replaceWith(combined);
        if (mobileImageRow) mobileImageRow.remove();
        else mobilePicture.closest('div')?.remove();
      }
    }
  }

  // ── Background image: AEM Author renders a reference field as <a>; convert to <img>
  if (imageCell && !imageCell.querySelector('img')) {
    const link = imageCell.querySelector('a[href]');
    if (link?.href) {
      const img = document.createElement('img');
      img.src = link.href;
      img.alt = link.title || link.textContent || '';
      (link.closest('.button-container') || link.closest('p') || link).replaceWith(img);
    }
  }

  // ── Landing: absorb press-releases block from the same section
  if (block.classList.contains('landing') && textCell) {
    const pressReleasesWrapper = section?.querySelector('.press-releases-wrapper');
    if (pressReleasesWrapper) {
      const pressReleasesBlock = pressReleasesWrapper.querySelector('.press-releases');
      if (pressReleasesBlock) {
        const container = document.createElement('div');
        container.classList.add('hero-press-releases-container');
        container.appendChild(pressReleasesBlock);
        textCell.appendChild(container);
        pressReleasesWrapper.remove();
      }
    }
  }

  // ── Multilayer: toggle layers on abbv:buddy:stateChange events
  // Each child of the image cell with [data-buddy-state] is a layer; only the
  // matching one gets .is-active.
  if (block.classList.contains('multilayer') && imageCell) {
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

  // ── Video: remove the video reference row; inject a native <video> into the image cell
  // The video field is authored as a DAM asset reference and appears as its own row.
  // Video is hidden on mobile (< 744px); the poster image in the image row acts as fallback.
  if (block.classList.contains('video') && videoRow) {
    const videoLink = videoRow.firstElementChild?.querySelector('a[href]');
    const videoSrc = videoLink?.href;
    videoRow.remove();

    if (videoSrc && window.matchMedia('(min-width: 744px)').matches) {
      const videoContainer = document.createElement('div');
      videoContainer.classList.add('hero-video-bg');

      const videoEl = document.createElement('video');
      videoEl.setAttribute('autoplay', '');
      videoEl.setAttribute('muted', '');
      videoEl.setAttribute('loop', '');
      videoEl.setAttribute('playsinline', '');
      videoEl.setAttribute('preload', 'none');

      const sourceEl = document.createElement('source');
      sourceEl.src = videoSrc;
      sourceEl.type = /\.webm(\?.*)?$/i.test(videoSrc) ? 'video/webm' : 'video/mp4';
      videoEl.appendChild(sourceEl);
      videoContainer.appendChild(videoEl);
      (imageCell || block.firstElementChild).appendChild(videoContainer);
    }
  }
}
