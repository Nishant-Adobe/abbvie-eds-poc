export default function decorate(block) {
  const rows = [...block.children];
  if (!rows.length) return;

  const figure = document.createElement('figure');
  figure.className = 'clinical-data-panel-figure';

  let title = '';
  let chartAlt = '';
  let footnotes = '';
  let studyDesignLabel = '';
  let studyDesignLink = '';
  const images = { desktop: null, tablet: null, mobile: null };

  const firstRowCells = rows[0]?.children?.length || 0;
  const isTableFormat = firstRowCells > 1;

  if (isTableFormat) {
    rows.forEach((row) => {
      const cells = [...row.children];
      const img = cells[0]?.querySelector('img, picture');
      if (img) {
        if (!images.desktop) images.desktop = img.cloneNode(true);
        else if (!images.tablet) images.tablet = img.cloneNode(true);
        else if (!images.mobile) images.mobile = img.cloneNode(true);
      } else {
        const text = cells[0]?.textContent.trim() || '';
        const value = cells[1]?.innerHTML?.trim() || cells[1]?.textContent?.trim() || '';
        const key = text.toLowerCase();
        if (key === 'title') title = value;
        else if (key === 'alt' || key === 'chartalt') chartAlt = value;
        else if (key === 'footnotes') footnotes = value;
        else if (key === 'studydesignlabel') studyDesignLabel = value;
        else if (key === 'studydesignlink') studyDesignLink = value;
      }
    });
  } else {
    const flatValues = rows.map((row) => ({
      img: row.querySelector('img, picture'),
      text: row.textContent.trim(),
      html: row.innerHTML.trim(),
    }));

    flatValues.forEach((val) => {
      if (val.img) {
        const imgEl = val.img.tagName === 'IMG' ? val.img : val.img.querySelector('img');
        if (!images.desktop) {
          images.desktop = val.img.cloneNode(true);
          if (imgEl?.alt) chartAlt = imgEl.alt;
        } else if (!images.tablet) images.tablet = val.img.cloneNode(true);
        else if (!images.mobile) images.mobile = val.img.cloneNode(true);
      }
    });

    const texts = flatValues.filter((v) => !v.img && v.text);
    if (texts.length > 0) title = texts[0].text;
    if (texts.length > 1) footnotes = texts[1].html;
    if (texts.length > 2) studyDesignLabel = texts[2].text;
    if (texts.length > 3) studyDesignLink = texts[3].text;
  }

  rows.forEach((row) => { row.style.display = 'none'; });

  if (title) {
    const heading = document.createElement('p');
    heading.className = 'clinical-data-panel-title';
    heading.textContent = title;
    figure.append(heading);
  }

  const picture = document.createElement('picture');

  if (images.mobile) {
    const mobileSrc = images.mobile.tagName === 'IMG' ? images.mobile : images.mobile.querySelector('img');
    if (mobileSrc) {
      const source = document.createElement('source');
      source.media = '(max-width: 600px)';
      source.srcset = mobileSrc.src;
      picture.append(source);
    }
  }

  if (images.tablet) {
    const tabletSrc = images.tablet.tagName === 'IMG' ? images.tablet : images.tablet.querySelector('img');
    if (tabletSrc) {
      const source = document.createElement('source');
      source.media = '(max-width: 984px)';
      source.srcset = tabletSrc.src;
      picture.append(source);
    }
  }

  if (images.desktop) {
    const desktopSrc = images.desktop.tagName === 'IMG' ? images.desktop : images.desktop.querySelector('img');
    if (desktopSrc) {
      const img = document.createElement('img');
      img.src = desktopSrc.src;
      img.alt = chartAlt || desktopSrc.alt || '';
      img.loading = 'lazy';
      img.className = 'clinical-data-panel-chart';
      picture.append(img);
      figure.append(picture);
    }
  }

  if (footnotes) {
    const figcaption = document.createElement('figcaption');
    figcaption.className = 'clinical-data-panel-footnotes';
    figcaption.innerHTML = footnotes;
    figure.append(figcaption);
  }

  if (studyDesignLabel && studyDesignLink) {
    const cta = document.createElement('a');
    cta.className = 'clinical-data-panel-cta';
    cta.textContent = studyDesignLabel;
    if (studyDesignLink.startsWith('#')) {
      cta.href = '#';
      cta.dataset.modalId = studyDesignLink.substring(1);
    } else {
      cta.href = studyDesignLink;
    }
    figure.append(cta);
  }

  block.append(figure);
}
