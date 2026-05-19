import { renderBlock } from '../../scripts/multi-theme.js';

const COOKIE_DAYS = 365;
const FALLBACK_URLS = {
  getAssessment: 'https://www.abbviebrandconsumer.com/BrandAPIGateway/api/Assessment/Get',
  saveAssessment: 'https://www.abbviebrandconsumer.com/BrandAPIGateway/api/Assessment/Save',
  getAggregated: 'https://www.abbviebrandconsumer.com/BrandAPIGateway/api/Assessment/GetAggregated',
};

let configPromise = null;
async function getApiUrl(key) {
  if (!configPromise) {
    configPromise = fetch('/ab-config.json')
      .then((r) => (r.ok ? r.json() : {}))
      .catch(() => ({}));
  }
  const cfg = await configPromise;
  return cfg?.data?.find((r) => r.key === key)?.value || FALLBACK_URLS[key] || '';
}

function getCookie(name) {
  return document.cookie.split('; ').find((c) => c.startsWith(`${name}=`))?.split('=')[1] ?? null;
}

function setCookie(name, value, days) {
  const expires = new Date(Date.now() + days * 864e5).toUTCString();
  document.cookie = `${name}=${value}; expires=${expires}; path=/; SameSite=Lax`;
}

export async function decorateBlock(block) {
  // ── SYNC PHASE ──────────────────────────────────────────────────────────────
  // Parse authored rows before touching the DOM or awaiting anything.
  // This ensures block.replaceChildren() is called synchronously, so the raw
  // authored table never flashes to the user when the section is revealed.

  const rows = [...block.children];
  const fields = {};
  const authoredOptions = [];
  rows.forEach((row) => {
    const cells = [...row.children];
    const key = cells[0]?.textContent.trim().toLowerCase();
    if (!key) return;
    if (key === 'option' && cells[1]) {
      const parts = cells[1].textContent.trim().split('|').map((p) => p.trim());
      if (parts[0]) {
        authoredOptions.push({
          OptionId: parts[1] || parts[0].toLowerCase().replace(/\s+/g, '-'),
          OptionText: parts[0],
        });
      }
    } else {
      fields[key] = cells[1] || null;
    }
  });

  const masterCampaignId = fields['master-campaign-id']?.textContent?.trim();
  const pollName = fields['poll-name']?.textContent?.trim();
  const questionId = fields['question-id']?.textContent?.trim() || '';
  const questionTextAuthored = fields['question-text']?.textContent?.trim() || '';
  const resultLabel = fields['result-label']?.textContent?.trim() || 'See how others responded';
  const resultDescCell = fields['result-description'] || null;
  const errors = {
    timeout: fields['error-timeout']?.textContent?.trim() || 'Request timed out. Please try again.',
    noPoll: fields['error-no-poll']?.textContent?.trim() || 'Poll is currently unavailable.',
    fetchResults: fields['error-fetch-results']?.textContent?.trim() || 'Results unavailable. Try again later.',
    save: fields['error-save']?.textContent?.trim() || 'Unable to save your response.',
  };

  if (!masterCampaignId || !pollName) {
    block.hidden = true;
    return;
  }

  // Build DOM immediately — clears the raw authored table before any await
  block.replaceChildren();

  const imageCell = fields.image;
  if (imageCell?.querySelector('img, picture')) {
    const imgWrap = document.createElement('div');
    imgWrap.className = 'qpoll-image';
    [...imageCell.childNodes].forEach((n) => imgWrap.append(n.cloneNode(true)));
    block.append(imgWrap);
  }

  const ia = document.createElement('div');
  ia.className = 'qpoll-ia';

  const qContainer = document.createElement('div');
  qContainer.className = 'qpoll-question-container';
  const qText = document.createElement('p');
  qText.className = 'qpoll-question';
  qText.setAttribute('role', 'heading');
  qText.setAttribute('aria-level', '2');
  qText.setAttribute('tabindex', '0');
  if (questionId) qText.dataset.questionid = questionId;
  qText.textContent = questionTextAuthored;
  const optionsWrap = document.createElement('div');
  optionsWrap.className = 'qpoll-options';
  qContainer.append(qText, optionsWrap);

  const resultsEl = document.createElement('div');
  resultsEl.className = 'qpoll-results';
  resultsEl.hidden = true;
  const resultsQ = document.createElement('p');
  resultsQ.className = 'qpoll-question';
  resultsQ.textContent = questionTextAuthored;
  const resultsLabel = document.createElement('p');
  resultsLabel.className = 'qpoll-results-label';
  resultsLabel.setAttribute('aria-live', 'assertive');
  resultsLabel.setAttribute('role', 'alert');
  resultsLabel.textContent = resultLabel;
  const resultSet = document.createElement('div');
  resultSet.className = 'qpoll-result-set';
  const resultsDesc = document.createElement('div');
  resultsDesc.className = 'qpoll-results-desc';
  if (resultDescCell) {
    [...resultDescCell.cloneNode(true).childNodes].forEach((n) => resultsDesc.append(n));
  }
  resultsEl.append(resultsQ, resultsLabel, resultSet, resultsDesc);

  const loadingEl = document.createElement('div');
  loadingEl.className = 'qpoll-loading';
  loadingEl.hidden = true;
  loadingEl.setAttribute('aria-live', 'polite');
  const spinner = document.createElement('span');
  spinner.className = 'qpoll-spinner';
  spinner.setAttribute('aria-hidden', 'true');
  const errorBox = document.createElement('div');
  errorBox.className = 'qpoll-error';
  errorBox.hidden = true;
  const errorMsg = document.createElement('p');
  errorMsg.className = 'qpoll-error-msg';
  const errorClose = document.createElement('button');
  errorClose.className = 'qpoll-error-close';
  errorClose.type = 'button';
  errorClose.setAttribute('aria-label', 'Close error');
  errorClose.textContent = '✕';
  errorBox.append(errorMsg, errorClose);
  loadingEl.append(spinner, errorBox);

  ia.append(qContainer, resultsEl, loadingEl);
  block.append(ia);

  // State helpers — defined after DOM is built
  function showLoading() {
    spinner.hidden = false;
    errorBox.hidden = true;
    loadingEl.hidden = false;
  }

  function hideLoading() {
    loadingEl.hidden = true;
  }

  function showError(msg) {
    errorMsg.textContent = msg;
    spinner.hidden = true;
    errorBox.hidden = false;
    loadingEl.hidden = false;
  }

  function buildOptionButtons(options) {
    optionsWrap.replaceChildren();
    resultSet.replaceChildren();
    options.forEach((opt) => {
      const btn = document.createElement('button');
      btn.className = 'qpoll-option';
      btn.type = 'button';
      btn.dataset.optionid = opt.OptionId;
      btn.textContent = opt.OptionText;
      optionsWrap.append(btn);

      const resItem = document.createElement('div');
      resItem.className = 'qpoll-result-item';
      // Lowercase so querySelector matches GetAggregated's QuestionOptionId (also lowercase)
      resItem.dataset.optionid = opt.OptionId.toLowerCase();
      const pct = document.createElement('span');
      pct.className = 'qpoll-pct';
      pct.textContent = '0';
      const label = document.createElement('p');
      label.textContent = opt.OptionText;
      resItem.append(pct, label);
      resultSet.append(resItem);
    });
  }

  // GetAggregated returns QuestionOptionId — match by ID not index
  function applyPercentages(questionOptions) {
    questionOptions.forEach((opt) => {
      const id = opt.QuestionOptionId?.toLowerCase();
      const item = id ? resultSet.querySelector(`[data-optionid="${id}"]`) : null;
      if (!item) return;
      item.querySelector('.qpoll-pct').textContent = String(
        Math.round(parseFloat(opt.PercentageOfUsersRespondedOnOption ?? 0)),
      );
      if (opt.OptionValue) item.querySelector('p').textContent = opt.OptionValue;
    });
  }

  function showLocalResults() {
    qContainer.hidden = true;
    hideLoading();
    resultsEl.hidden = false;
    if (!getCookie(pollName)) setCookie(pollName, '1', COOKIE_DAYS);
  }

  // Show spinner while we wait for config.json + API URLs
  showLoading();

  // ── ASYNC PHASE ─────────────────────────────────────────────────────────────
  // Fetch API URLs from /config.json (cached after first call).
  // DOM is already built above so the spinner is visible immediately.

  const [getAssessmentUrl, saveAssessmentUrl, getAggregatedUrl] = await Promise.all([
    getApiUrl('getAssessment'),
    getApiUrl('saveAssessment'),
    getApiUrl('getAggregated'),
  ]);

  async function fetchAggregated() {
    try {
      const url = new URL(getAggregatedUrl);
      url.searchParams.set('CampaignMasterId', masterCampaignId);
      const resp = await fetch(url.toString());
      if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
      const data = await resp.json();
      if (!data?.IsStatusSuccessful) throw new Error('API error');
      const questions = data?.ContentResult?.AssessmentQuestion ?? [];
      const qData = questionId
        ? questions.find((q) => q.QuestionId?.toUpperCase() === questionId.toUpperCase())
        : questions[0];
      if (!qData) throw new Error('No question data');
      if (!questionTextAuthored && qData.QuestionText) {
        resultsQ.textContent = qData.QuestionText;
      }
      applyPercentages(qData.QuestionOption ?? []);
      qContainer.hidden = true;
      hideLoading();
      resultsEl.hidden = false;
      if (!getCookie(pollName)) setCookie(pollName, '1', COOKIE_DAYS);
    } catch {
      if (resultSet.children.length > 0) {
        showLocalResults();
      } else {
        showError(errors.fetchResults);
      }
    }
  }

  async function submitAnswer(optionId) {
    showLoading();
    try {
      const resp = await fetch(saveAssessmentUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          CampaignMasterId: masterCampaignId,
          CompleteDate: null,
          ConsumerId: '',
          IndividualId: '',
          AssessmentQuestion: [{
            QuestionId: questionId,
            QuestionOptions: [{ OptionId: optionId, ResponseText: '' }],
          }],
          OtherInformation: { cid: '' },
        }),
      });
      const data = await resp.json();
      if (data?.IsStatusSuccessful) {
        await fetchAggregated();
      } else {
        showError(errors.save);
      }
    } catch {
      if (authoredOptions.length >= 2) {
        showLocalResults();
      } else {
        showError(errors.save);
      }
    }
  }

  async function loadQuestion(keepLoading = false) {
    showLoading();
    try {
      const url = new URL(getAssessmentUrl);
      url.searchParams.set('CampaignMasterId', masterCampaignId);
      if (questionId) url.searchParams.set('QuesId', questionId);
      const resp = await fetch(url.toString());
      if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
      const data = await resp.json();
      if (!data?.IsStatusSuccessful) throw new Error('API error');
      const questions = data?.ContentResult?.AssessmentQuestion ?? [];
      const qData = questionId
        ? questions.find((q) => q.QuestionId?.toUpperCase() === questionId.toUpperCase())
        : questions[0];
      if (!qData) throw new Error('No question data');
      if (!questionTextAuthored && qData.QuestionText) {
        qText.textContent = qData.QuestionText;
        resultsQ.textContent = qData.QuestionText;
      }
      buildOptionButtons(qData.QuestionOption ?? []);
      if (!keepLoading) hideLoading();
      return true;
    } catch (e) {
      if (authoredOptions.length >= 2) {
        buildOptionButtons(authoredOptions);
        if (!keepLoading) hideLoading();
        return true;
      }
      showError(e?.name === 'AbortError' ? errors.timeout : errors.noPoll);
      return false;
    }
  }

  // Event wiring
  optionsWrap.addEventListener('click', (e) => {
    const btn = e.target.closest('.qpoll-option');
    if (btn) submitAnswer(btn.dataset.optionid);
  });

  errorClose.addEventListener('click', hideLoading);

  // Init
  if (getCookie(pollName) === '1') {
    const ok = await loadQuestion(true);
    if (ok) await fetchAggregated();
  } else {
    await loadQuestion(false);
  }
}

export default async function decorate(block) {
  await renderBlock(block);
}
