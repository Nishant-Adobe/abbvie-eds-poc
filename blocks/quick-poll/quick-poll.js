import { renderBlock, getBrandCode } from '../../scripts/multi-theme.js';
import { getConfigValue } from '../../scripts/config.js';

const COOKIE_DAYS = 365;

// Positional map for xwalk delivery — must match _quick-poll.json field order.
// Tab fields and the classes select produce no rows; all other fields produce one row each.
const XWALK_FIELDS = [
  'image', // 0
  'image-alt', // 1
  'master-campaign-id', // 2
  'poll-name', // 3
  'question-id', // 4
  'question-text', // 5
  'result-label', // 6
  'result-description', // 7
  'option', // 8
  'error-timeout', // 9
  'error-no-poll', // 10
  'error-fetch-results', // 11
  'error-save', // 12
];

async function getApiUrl(key) {
  const value = (await getConfigValue(key)) || '';
  return value.startsWith('http') ? value : '';
}

function getCookie(name) {
  return document.cookie.split('; ').find((c) => c.startsWith(`${name}=`))?.split('=')[1] ?? null;
}

function setCookie(name, value, days) {
  const expires = new Date(Date.now() + days * 864e5).toUTCString();
  document.cookie = `${name}=${value}; expires=${expires}; path=/; SameSite=Lax`;
}

function parseOption(text) {
  const parts = text.split('|').map((s) => s.trim());
  if (!parts[0]) return null;
  return {
    OptionId: parts[1] || parts[0].toLowerCase().replace(/\s+/g, '-'),
    OptionText: parts[0],
  };
}

export async function decorateBlock(block) {
  // Parse authored rows synchronously before any await so block.replaceChildren()
  // fires before the section is revealed — prevents the raw table from flashing.
  const rows = [...block.children];
  const fields = {};
  const authoredOptions = [];

  // xwalk: single-cell rows (value only). Doc authoring: two-cell rows (key + value).
  const isXwalk = rows.length > 0 && !rows[0].children[1];

  if (isXwalk) {
    rows.forEach((row, idx) => {
      const fieldName = XWALK_FIELDS[idx];
      if (!fieldName) return;
      const cell = row.children[0] || null;
      if (fieldName === 'option' && cell) {
        [...cell.querySelectorAll('p')]
          .map((p) => p.textContent.trim())
          .filter(Boolean)
          .forEach((line) => {
            const opt = parseOption(line);
            if (opt) authoredOptions.push(opt);
          });
      } else {
        fields[fieldName] = cell;
      }
    });
  } else {
    rows.forEach((row) => {
      const cells = [...row.children];
      const key = cells[0]?.textContent.trim().toLowerCase();
      if (!key) return;
      if (key === 'option' && cells[1]) {
        const opt = parseOption(cells[1].textContent.trim());
        if (opt) authoredOptions.push(opt);
      } else {
        fields[key] = cells[1] || null;
      }
    });
  }

  const getText = (key, fallback = '') => fields[key]?.textContent?.trim() || fallback;

  const masterCampaignId = getText('master-campaign-id');
  const pollName = getText('poll-name');
  const questionId = getText('question-id');
  const questionTextAuthored = getText('question-text');
  const resultLabel = getText('result-label', 'See how others responded');
  const resultDescEl = fields['result-description'] || null;
  const errors = {
    timeout: getText('error-timeout', 'Request timed out. Please try again.'),
    noPoll: getText('error-no-poll', 'Poll is currently unavailable.'),
    fetchResults: getText('error-fetch-results', 'Results unavailable. Try again later.'),
    save: getText('error-save', 'Unable to save your response.'),
  };

  if (!masterCampaignId || !pollName) {
    block.hidden = true;
    return;
  }

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

  const qText = document.createElement('p');
  qText.className = 'qpoll-question';
  qText.setAttribute('role', 'heading');
  qText.setAttribute('aria-level', '2');
  qText.setAttribute('tabindex', '0');
  if (questionId) qText.dataset.questionid = questionId;
  qText.textContent = questionTextAuthored;

  const resultsLabel = document.createElement('p');
  resultsLabel.className = 'qpoll-results-label';
  resultsLabel.textContent = resultLabel;

  const optionsWrap = document.createElement('div');
  optionsWrap.className = 'qpoll-options';

  const resultsEl = document.createElement('div');
  resultsEl.className = 'qpoll-results';
  resultsEl.hidden = true;
  const resultSet = document.createElement('div');
  resultSet.className = 'qpoll-result-set';
  const resultsDesc = document.createElement('div');
  resultsDesc.className = 'qpoll-results-desc';
  if (resultDescEl) {
    [...resultDescEl.cloneNode(true).childNodes].forEach((n) => resultsDesc.append(n));
  }
  resultsEl.append(resultSet, resultsDesc);

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

  ia.append(qText, resultsLabel, optionsWrap, resultsEl, loadingEl);
  block.append(ia);

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
    optionsWrap.hidden = true;
    hideLoading();
    resultsEl.hidden = false;
    if (!getCookie(pollName)) setCookie(pollName, '1', COOKIE_DAYS);
  }

  // Tracks the real QuestionId returned by the API (may differ from authored questionId)
  let activeQuestionId = questionId;

  showLoading();

  const brandCode = getBrandCode();

  const [getAssessmentUrl, saveAssessmentUrl, getAggregatedUrl] = await Promise.all([
    getApiUrl('getAssessment'),
    getApiUrl('saveAssessment'),
    getApiUrl('getAggregated'),
  ]);

  function findQuestion(questions) {
    return (questionId
      ? questions.find((q) => q.QuestionId?.toUpperCase() === questionId.toUpperCase())
      : null) ?? questions[0];
  }

  async function fetchAggregated() {
    try {
      const url = new URL(getAggregatedUrl, window.location.origin);
      url.searchParams.set('brand', brandCode);
      url.searchParams.set('CampaignMasterId', masterCampaignId);
      const resp = await fetch(url.toString());
      if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
      const data = await resp.json();
      if (!data?.IsStatusSuccessful) throw new Error('API error');
      const qData = findQuestion(data?.ContentResult?.AssessmentQuestion ?? []);
      if (!qData) throw new Error('No question data');
      activeQuestionId = qData.QuestionId ?? activeQuestionId;
      if (!questionTextAuthored && qData.QuestionText) qText.textContent = qData.QuestionText;
      applyPercentages(qData.QuestionOption ?? []);
      optionsWrap.hidden = true;
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
      const saveUrl = new URL(saveAssessmentUrl, window.location.origin);
      saveUrl.searchParams.set('brand', brandCode);
      const resp = await fetch(saveUrl.toString(), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          CampaignMasterId: masterCampaignId,
          CompleteDate: null,
          ConsumerId: '',
          IndividualId: '',
          AssessmentQuestion: [{
            QuestionId: activeQuestionId,
            QuestionOptions: [{ OptionId: optionId, ResponseText: '' }],
          }],
          OtherInformation: { cid: '' },
        }),
      });
      if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
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
      const url = new URL(getAssessmentUrl, window.location.origin);
      url.searchParams.set('brand', brandCode);
      url.searchParams.set('CampaignMasterId', masterCampaignId);
      if (questionId) url.searchParams.set('QuesId', questionId);
      const resp = await fetch(url.toString());
      if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
      const data = await resp.json();
      if (!data?.IsStatusSuccessful) throw new Error('API error');
      const qData = findQuestion(data?.ContentResult?.AssessmentQuestion ?? []);
      if (!qData) throw new Error('No question data');
      activeQuestionId = qData.QuestionId ?? activeQuestionId;
      if (!questionTextAuthored && qData.QuestionText) qText.textContent = qData.QuestionText;
      buildOptionButtons(qData.QuestionOption ?? []);
      if (!keepLoading) hideLoading();
      return true;
    } catch {
      if (authoredOptions.length >= 2) {
        buildOptionButtons(authoredOptions);
        if (!keepLoading) hideLoading();
        return true;
      }
      showError(errors.noPoll);
      return false;
    }
  }

  optionsWrap.addEventListener('click', (e) => {
    const btn = e.target.closest('.qpoll-option');
    if (btn) submitAnswer(btn.dataset.optionid).catch(() => {});
  });

  errorClose.addEventListener('click', hideLoading);

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
