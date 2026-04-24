/**
 * Promo Block — promotional banner with image, eyebrow, title, description, and CTA
 *
 * Content model (rows, 1 col each — xwalk field-per-row):
 *   Row 0: image       (<picture> or <img>)
 *   Row 1: eyebrow     (<p>text</p>)
 *   Row 2: title       (<h2>heading</h2>)
 *   Row 3: description (<p>text</p>)
 *   Row 4: buttonText  (<p>text</p>)
 *   Row 5: buttonURL   (<p><a href="...">url</a></p> or <p>url</p>)
 *   Row 6: buttonType  (<p>primary|secondary|link-external</p>)
 *
 * Decorated structure:
 *   .promo
 *     .promo-image
 *     .promo-body
 *       .promo-eyebrow
 *       .promo-title
 *       .promo-description
 *       .promo-cta (optional)
 */
export default function decorate(block) {
  const rows = [...block.querySelectorAll(':scope > div')];
  if (rows.length < 3) return;

  // Extract fields
  const imageEl = rows[0]?.querySelector('picture, img');
  const eyebrowText = rows[1]?.querySelector('p > strong')?.textContent
    || rows[1]?.querySelector('p')?.textContent
    || rows[1]?.textContent?.trim();
  const titleEl = rows[2]?.querySelector('h1, h2, h3, h4, h5, h6');
  const descriptionEl = rows[3]?.querySelector('p');
  const buttonText = rows[4]?.textContent?.trim();
  const buttonURLEl = rows[5]?.querySelector('a');
  const buttonURL = buttonURLEl?.href || rows[5]?.textContent?.trim();
  const buttonType = rows[6]?.textContent?.trim() || 'primary';

  // Clear existing rows
  block.innerHTML = '';

  // Image section
  if (imageEl) {
    const imageDiv = document.createElement('div');
    imageDiv.classList.add('promo-image');
    imageDiv.appendChild(imageEl.closest('picture') || imageEl);
    block.appendChild(imageDiv);
  }

  // Body section
  const bodyDiv = document.createElement('div');
  bodyDiv.classList.add('promo-body');

  if (eyebrowText) {
    const eyebrow = document.createElement('p');
    eyebrow.classList.add('promo-eyebrow');
    eyebrow.textContent = eyebrowText;
    bodyDiv.appendChild(eyebrow);
  }

  if (titleEl) {
    titleEl.classList.add('promo-title');
    bodyDiv.appendChild(titleEl);
  }

  if (descriptionEl) {
    descriptionEl.classList.add('promo-description');
    bodyDiv.appendChild(descriptionEl);
  }

  if (buttonText && buttonURL) {
    const ctaP = document.createElement('p');
    ctaP.classList.add('button-container');
    const link = document.createElement('a');
    link.href = buttonURL;
    link.textContent = buttonText;
    link.classList.add('button', buttonType);
    if (buttonType === 'link-external' || buttonURLEl?.target === '_blank') {
      link.target = '_blank';
      link.rel = 'noopener noreferrer';
    }
    ctaP.appendChild(link);
    bodyDiv.appendChild(ctaP);
  }

  block.appendChild(bodyDiv);
}
