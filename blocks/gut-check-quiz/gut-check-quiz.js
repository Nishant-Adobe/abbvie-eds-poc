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
            <button type="button" class="quiz-option" data-index="${oi}" aria-pressed="false"${q.bristolImages ? ` style="background-image:url(${q.bristolImages[oi]});background-size:90px;background-position:center 10px;background-repeat:no-repeat;padding-top:108px"` : ''}>
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

export default async function decorate(block) {
  const rows = [...block.children];
  const questions = [];
  let emailConfig = {};
  let recaptchaImg = '';

  let i = 0;
  while (i < rows.length) {
    const cells = [...rows[i].children];
    const firstCellText = cells[0]?.textContent?.trim() || '';
    const hasImage = cells[0]?.querySelector('img, picture');

    if (firstCellText.startsWith('type:')) {
      const type = firstCellText.replace('type:', '').trim();
      const question = {
        type,
        icon: null,
        title: '',
        options: [],
        instruction: '',
        image: null,
      };

      i += 1;

      // Check for icon image row (row after type)
      if (rows[i]) {
        const iconImg = rows[i].children[0]?.querySelector('img, picture');
        if (iconImg) {
          question.icon = iconImg.closest('picture')?.outerHTML || iconImg.outerHTML;
          i += 1;
        }
      }

      // Title row
      if (rows[i]) {
        question.title = rows[i].children[0]?.innerHTML || '';
        const instrEl = rows[i].children[0]?.querySelector('p:nth-child(2)');
        if (instrEl) {
          question.instruction = instrEl.textContent.trim();
        }
        i += 1;
      }

      // Options row (has ul/ol)
      if (rows[i]) {
        const list = rows[i].children[0]?.querySelector('ul, ol');
        if (list) {
          question.options = [...list.querySelectorAll('li')].map((li) => li.innerHTML.trim());
          i += 1;
        }
      }

      // Check for trailing image (e.g., Bristol chart scale)
      if (rows[i]) {
        const trailingImg = rows[i].children[0]?.querySelector('img, picture');
        const trailingText = rows[i].children[0]?.textContent?.trim() || '';
        if (trailingImg && !trailingText.startsWith('type:') && !trailingText.startsWith('endpoint:')) {
          question.image = trailingImg.closest('picture')?.outerHTML || trailingImg.outerHTML;
          i += 1;
        }
      }

      // If Q3 (bowel movements) add Bristol images
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
    } else if (cells[0]?.querySelector('h2, h3, strong') || firstCellText.includes('Get your summary')) {
      emailConfig = {
        heading: cells[0]?.innerHTML || '',
        body: '',
      };
      i += 1;
      // Next row is consent text
      if (rows[i] && !rows[i].children[0]?.textContent?.trim().startsWith('endpoint:')) {
        emailConfig.body = rows[i].children[0]?.innerHTML || '';
        i += 1;
      }
    } else if (hasImage && !firstCellText.startsWith('type:')) {
      // reCAPTCHA image or other standalone image
      const img = cells[0]?.querySelector('picture') || cells[0]?.querySelector('img');
      if (img) {
        recaptchaImg = img.closest('picture')?.outerHTML || img.outerHTML;
      }
      i += 1;
    } else if (firstCellText.startsWith('endpoint:') || firstCellText.startsWith('http')) {
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
