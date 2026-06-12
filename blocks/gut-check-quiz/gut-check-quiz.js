import { renderBlock } from '../../scripts/multi-theme.js';

function buildQuizHTML(questions, emailConfig, recaptchaImg) {
  const stepsHTML = questions.map((q, idx) => `
    <div class="quiz-step" data-step="${idx}" data-type="${q.type}">
      <div class="quiz-step-indicator">
        <span class="step-number">${idx + 1}</span>
      </div>
      <div class="quiz-step-content">
        ${q.icon ? `<div class="quiz-step-icon">${q.icon}</div>` : ''}
        <div class="quiz-question-title">${q.title}</div>
        ${q.instruction ? `<p class="quiz-instruction">${q.instruction}</p>` : ''}
        <div class="quiz-options ${q.type}-group">
          ${q.options.map((opt, oi) => `
            <button type="button" class="quiz-option" data-index="${oi}" aria-pressed="false">
              <span class="option-indicator">${q.bristolImages ? oi + 1 : ''}</span>
              <span class="option-text">${opt}</span>
            </button>
          `).join('')}
        </div>
        ${q.image ? `<div class="quiz-step-image">${q.image}</div>` : ''}
      </div>
    </div>
  `).join('');

  const emailHTML = emailConfig.heading ? `
    <div class="quiz-email-section">
      <div class="quiz-email-heading">${emailConfig.heading}</div>
      ${emailConfig.body ? `<div class="quiz-email-body">${emailConfig.body}</div>` : ''}
      <div class="quiz-email-fields">
        <div class="quiz-field">
          <label for="quiz-email">Email Address*</label>
          <input type="email" id="quiz-email" placeholder="Please enter your Email Address" required>
        </div>
        <div class="quiz-field">
          <label for="quiz-email-confirm">Confirm Email Address*</label>
          <input type="email" id="quiz-email-confirm" placeholder="Please confirm your Email Address" required>
        </div>
      </div>
      <div class="quiz-signup-option">
        <label class="quiz-checkbox-label">
          <input type="checkbox" id="quiz-signup">
          <span class="checkbox-custom"></span>
          <span>Sign up for resources and support</span>
        </label>
      </div>
      ${emailConfig.body ? `<div class="quiz-consent">
        <div class="quiz-consent-text">${emailConfig.body}</div>
        <button type="button" class="quiz-consent-toggle">+ Expand for more information</button>
        <div class="quiz-consent-expanded" hidden></div>
      </div>` : ''}
      ${recaptchaImg ? `<div class="quiz-recaptcha">${recaptchaImg}</div>` : ''}
      <button type="button" class="quiz-submit-btn">
        <span>Email My Results</span>
        <span class="btn-arrow">›</span>
      </button>
      <p class="quiz-note">You can also take a screenshot of your summary to share at your next appointment.</p>
    </div>
  ` : '';

  return `
    <div class="quiz-container">
      <div class="quiz-steps">${stepsHTML}</div>
      ${emailHTML}
    </div>
  `;
}

function collectAnswers(block) {
  const steps = block.querySelectorAll('.quiz-step');
  const answers = [];
  steps.forEach((step) => {
    const selected = [...step.querySelectorAll('.quiz-option.selected')];
    answers.push(selected.map((s) => s.querySelector('.option-text')?.textContent?.trim()));
  });
  return answers;
}

function showError(block, message) {
  let errorEl = block.querySelector('.quiz-error');
  if (!errorEl) {
    errorEl = document.createElement('p');
    errorEl.className = 'quiz-error';
    block.querySelector('.quiz-email-fields')?.after(errorEl);
  }
  errorEl.textContent = message;
  setTimeout(() => { errorEl.textContent = ''; }, 3000);
}

function showSuccess(block) {
  const emailSection = block.querySelector('.quiz-email-section');
  if (emailSection) {
    emailSection.innerHTML = `
      <div class="quiz-success">
        <h3>Thank you!</h3>
        <p>Your results have been sent to your email. You can also take a screenshot of your summary to share at your next appointment.</p>
      </div>
    `;
  }
}

function initQuiz(block) {
  const options = block.querySelectorAll('.quiz-option');

  options.forEach((option) => {
    option.addEventListener('click', () => {
      const step = option.closest('.quiz-step');
      const { type } = step.dataset;

      if (type === 'radio') {
        step.querySelectorAll('.quiz-option').forEach((o) => {
          o.classList.remove('selected');
          o.setAttribute('aria-pressed', 'false');
        });
        option.classList.add('selected');
        option.setAttribute('aria-pressed', 'true');
      } else {
        option.classList.toggle('selected');
        const isSelected = option.classList.contains('selected');
        option.setAttribute('aria-pressed', String(isSelected));
      }
    });
  });

  // Consent expandable toggle
  const consentToggle = block.querySelector('.quiz-consent-toggle');
  if (consentToggle) {
    consentToggle.addEventListener('click', () => {
      const expanded = block.querySelector('.quiz-consent-expanded');
      const isHidden = expanded.hidden;
      expanded.hidden = !isHidden;
      consentToggle.textContent = isHidden ? '- Collapse information' : '+ Expand for more information';
    });
  }

  const submitBtn = block.querySelector('.quiz-submit-btn');
  if (submitBtn) {
    submitBtn.addEventListener('click', () => {
      const email = block.querySelector('#quiz-email')?.value;
      const confirmEmail = block.querySelector('#quiz-email-confirm')?.value;

      if (!email || !confirmEmail) {
        showError(block, 'Please fill in all required fields.');
        return;
      }
      if (email !== confirmEmail) {
        showError(block, 'Email addresses do not match.');
        return;
      }

      collectAnswers(block);
      submitBtn.textContent = 'Submitting...';
      submitBtn.disabled = true;

      setTimeout(() => {
        submitBtn.innerHTML = '<span>Email My Results</span><span class="btn-arrow">›</span>';
        submitBtn.disabled = false;
        showSuccess(block);
      }, 1500);
    });
  }
}

// Normalize content into a flat, ordered list of elements regardless of how it
// was authored: as multiple doc-table rows (one logical unit per cell) or as a
// single rich-text field (xwalk/UE) holding every element in one cell.
function collectElements(block) {
  const out = [];
  [...block.children].forEach((row) => {
    [...row.children].forEach((cell) => {
      const kids = [...cell.children];
      if (kids.length === 0) {
        out.push(cell); // text-only cell (e.g. a bare "type:checkbox" marker)
      } else {
        kids.forEach((k) => out.push(k));
      }
    });
  });
  return out;
}

const isImageEl = (el) => !!el && (el.matches?.('picture, img') || !!el.querySelector?.('picture, img'));
const isListEl = (el) => !!el && (el.matches?.('ul, ol') || !!el.querySelector?.('ul, ol'));
const imgHTML = (el) => {
  const pic = el.matches?.('picture') ? el : el.querySelector?.('picture');
  if (pic) return pic.outerHTML;
  const img = el.matches?.('img') ? el : el.querySelector?.('img');
  return img ? img.outerHTML : '';
};

export default async function decorate(block) {
  const els = collectElements(block);
  const questions = [];
  let emailConfig = {};
  let recaptchaImg = '';

  let i = 0;
  while (i < els.length) {
    const el = els[i];
    const text = (el.textContent || '').trim();

    if (text.startsWith('type:')) {
      const question = {
        type: text.replace('type:', '').trim(),
        icon: null,
        title: '',
        options: [],
        instruction: '',
        image: null,
      };
      i += 1;

      // Optional icon image directly after the type marker
      if (i < els.length && isImageEl(els[i]) && !isListEl(els[i])) {
        question.icon = imgHTML(els[i]);
        i += 1;
      }

      // Title + optional instruction: consecutive paragraphs before list/image/next type
      const paras = [];
      while (i < els.length) {
        const e = els[i];
        const et = (e.textContent || '').trim();
        if (et.startsWith('type:') || isImageEl(e) || isListEl(e)) break;
        paras.push(e);
        i += 1;
      }
      if (paras.length) {
        question.title = paras[0].outerHTML || paras[0].innerHTML || '';
        if (paras.length > 1) {
          question.instruction = paras.slice(1).map((p) => p.textContent.trim()).join(' ');
        }
      }

      // Options list
      if (i < els.length && isListEl(els[i])) {
        const e = els[i];
        const list = e.matches?.('ul, ol') ? e : e.querySelector('ul, ol');
        question.options = [...list.querySelectorAll('li')].map((li) => li.innerHTML.trim());
        i += 1;
      }

      // Optional trailing image (e.g., Bristol chart scale)
      if (i < els.length && isImageEl(els[i]) && !(els[i].textContent || '').trim().startsWith('type:')) {
        question.image = imgHTML(els[i]);
        i += 1;
      }

      if (question.title.includes('bowel movements')) {
        question.bristolImages = [
          '/content/dam/abbvie-eds-poc/linzess/images/bristol1.png',
          '/content/dam/abbvie-eds-poc/linzess/images/bristol2.png',
          '/content/dam/abbvie-eds-poc/linzess/images/bristol3.png',
          '/content/dam/abbvie-eds-poc/linzess/images/bristol4.png',
          '/content/dam/abbvie-eds-poc/linzess/images/bristol5.png',
          '/content/dam/abbvie-eds-poc/linzess/images/bristol6.png',
          '/content/dam/abbvie-eds-poc/linzess/images/bristol7.png',
        ];
      }

      questions.push(question);
    } else if (el.matches?.('h2, h3') || el.querySelector?.('h2, h3') || text.includes('Get your summary')) {
      emailConfig = { heading: el.outerHTML || el.innerHTML || '', body: '' };
      i += 1;
      if (i < els.length && !(els[i].textContent || '').trim().startsWith('endpoint:')) {
        emailConfig.body = els[i].outerHTML || els[i].innerHTML || '';
        i += 1;
      }
    } else if (isImageEl(el)) {
      recaptchaImg = imgHTML(el);
      i += 1;
    } else {
      i += 1;
    }
  }

  block.textContent = '';
  block.innerHTML = buildQuizHTML(questions, emailConfig, recaptchaImg);
  initQuiz(block);

  try {
    await renderBlock(block);
  } catch { /* brand block-config optional */ }
}
