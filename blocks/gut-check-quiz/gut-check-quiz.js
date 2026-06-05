import { renderBlock } from '../../scripts/multi-theme.js';

export default async function decorate(block) {
  const rows = [...block.children];
  const questions = [];
  let emailConfig = {};
  let apiConfig = '';

  // Parse authored rows into structured data
  let i = 0;
  while (i < rows.length) {
    const cells = [...rows[i].children];
    const firstCellText = cells[0]?.textContent?.trim() || '';

    if (firstCellText.startsWith('type:')) {
      const type = firstCellText.replace('type:', '').trim();
      const titleRow = rows[i + 1];
      const optionsRow = rows[i + 2];
      const question = {
        type,
        title: titleRow?.children[0]?.innerHTML || '',
        options: [],
        instruction: '',
        image: null,
      };

      // Check for instruction in title
      const titleEl = titleRow?.children[0];
      const instrEl = titleEl?.querySelector('p:nth-child(2), .instruction');
      if (instrEl) {
        question.instruction = instrEl.textContent.trim();
      }

      // Parse options from list
      const list = optionsRow?.querySelector('ul, ol');
      if (list) {
        question.options = [...list.querySelectorAll('li')].map((li) => li.innerHTML.trim());
      }

      // Check for image in next row
      if (rows[i + 3]) {
        const imgCell = rows[i + 3].children[0];
        const img = imgCell?.querySelector('img, picture');
        if (img) {
          question.image = img.closest('picture')?.outerHTML || img.outerHTML;
          i += 1;
        }
      }

      questions.push(question);
      i += 3;
    } else if (firstCellText.includes('email') || firstCellText.includes('Email') || cells[0]?.querySelector('h2, h3, strong')) {
      emailConfig = {
        heading: cells[0]?.innerHTML || '',
        body: rows[i + 1]?.children[0]?.innerHTML || '',
      };
      i += 2;
    } else if (firstCellText.startsWith('endpoint:') || firstCellText.startsWith('http')) {
      apiConfig = firstCellText.replace('endpoint:', '').trim();
      i += 1;
    } else {
      i += 1;
    }
  }

  // Build quiz UI
  block.textContent = '';
  block.innerHTML = buildQuizHTML(questions, emailConfig, apiConfig);

  // Initialize interactivity
  initQuiz(block, questions, apiConfig);

  try {
    await renderBlock(block);
  } catch { /* brand block-config optional */ }
}

function buildQuizHTML(questions, emailConfig) {
  const stepsHTML = questions.map((q, idx) => `
    <div class="quiz-step" data-step="${idx}" data-type="${q.type}">
      <div class="quiz-step-indicator">
        <span class="step-number">${idx + 1}</span>
      </div>
      <div class="quiz-step-content">
        <div class="quiz-question-title">${q.title}</div>
        ${q.instruction ? `<p class="quiz-instruction">${q.instruction}</p>` : ''}
        <div class="quiz-options ${q.type}-group">
          ${q.options.map((opt, oi) => `
            <button type="button" class="quiz-option" data-index="${oi}" aria-pressed="false">
              <span class="option-indicator"></span>
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

function initQuiz(block) {
  const options = block.querySelectorAll('.quiz-option');

  options.forEach((option) => {
    option.addEventListener('click', () => {
      const step = option.closest('.quiz-step');
      const type = step.dataset.type;

      if (type === 'radio') {
        // Single select - deselect others
        step.querySelectorAll('.quiz-option').forEach((o) => {
          o.classList.remove('selected');
          o.setAttribute('aria-pressed', 'false');
        });
        option.classList.add('selected');
        option.setAttribute('aria-pressed', 'true');
      } else {
        // Multi select - toggle
        option.classList.toggle('selected');
        const isSelected = option.classList.contains('selected');
        option.setAttribute('aria-pressed', String(isSelected));
      }
    });
  });

  // Submit button
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

      // Collect answers
      const answers = collectAnswers(block);
      submitBtn.textContent = 'Submitting...';
      submitBtn.disabled = true;

      // POST to endpoint (placeholder - will use authored endpoint)
      setTimeout(() => {
        submitBtn.innerHTML = '<span>Email My Results</span><span class="btn-arrow">›</span>';
        submitBtn.disabled = false;
        showSuccess(block);
      }, 1500);
    });
  }
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
