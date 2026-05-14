const bcScripts = {};
let playerCount = 0;
let transcriptModal = null;

function loadBrightcoveScript(account, player) {
  const key = `${account}/${player}_default`;
  if (!bcScripts[key]) {
    bcScripts[key] = new Promise((resolve, reject) => {
      const s = document.createElement('script');
      s.src = `https://players.brightcove.net/${key}/index.min.js`;
      s.onload = resolve;
      s.onerror = reject;
      document.head.append(s);
    });
  }
  return bcScripts[key];
}

function getTranscriptModal() {
  if (transcriptModal) return transcriptModal;

  const overlay = document.createElement('div');
  overlay.className = 'cvp-transcript-modal-overlay';

  const dialog = document.createElement('div');
  dialog.className = 'cvp-transcript-modal-dialog';
  dialog.setAttribute('role', 'dialog');
  dialog.setAttribute('aria-modal', 'true');

  const closeBtn = document.createElement('button');
  closeBtn.type = 'button';
  closeBtn.className = 'cvp-transcript-modal-close';
  closeBtn.textContent = 'Close Transcript';

  const body = document.createElement('div');
  body.className = 'cvp-transcript-modal-body';

  dialog.append(closeBtn, body);
  overlay.append(dialog);
  document.body.append(overlay);

  const close = () => {
    overlay.classList.remove('is-open');
    document.body.classList.remove('cvp-modal-is-open');
  };

  closeBtn.addEventListener('click', close);
  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) close();
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape'
      && overlay.classList.contains('is-open')) close();
  });

  transcriptModal = { overlay, body };
  return transcriptModal;
}

function openTranscript(content) {
  const modal = getTranscriptModal();
  modal.body.innerHTML = '';
  if (typeof content === 'string') {
    modal.body.innerHTML = content;
  } else if (content?.innerHTML) {
    modal.body.innerHTML = content.innerHTML;
  }
  modal.overlay.classList.add('is-open');
  document.body.classList.add('cvp-modal-is-open');
}

function isItemRow(row) {
  if (row.children.length < 2) return false;
  if (row.querySelector('picture')) return true;
  const first = row.firstElementChild?.textContent?.trim();
  return /^\d{8,}$/.test(first);
}

function readConfig(block) {
  const rows = [...block.children];
  const cfgRows = rows.filter((r) => !isItemRow(r));
  const val = (i) => {
    const t = cfgRows[i]?.firstElementChild?.textContent?.trim();
    return t || '';
  };
  const layouts = ['cards', 'bottom', 'top', 'left', 'right'];
  const first = val(0);
  const cl = layouts.find((l) => block.classList.contains(l));
  return {
    layout: layouts.includes(first) ? first : (cl || 'cards'),
    accountId: val(3) || val(1) || '',
    playerId: val(5) || val(3) || 'default',
  };
}

function parseItems(block) {
  return [...block.children]
    .filter(isItemRow)
    .map((row) => {
      const cells = [...row.children];
      const get = (i) => cells[i]?.textContent?.trim() ?? '';
      return {
        videoId: get(0),
        title: get(1),
        transcriptHref: get(2),
        transcript: cells[3] ?? null,
        description: cells[7] ?? null,
      };
    })
    .filter(({ videoId }) => videoId);
}

function buildCard(item, accountId, playerId) {
  const card = document.createElement('div');
  card.className = 'cvp-venclexta-card';

  const playerWrap = document.createElement('div');
  playerWrap.className = 'cvp-player-wrap';

  const playBtn = document.createElement('button');
  playBtn.type = 'button';
  playBtn.className = 'cvp-play-btn';
  playBtn.setAttribute('aria-label', `Play ${item.title}`);
  playerWrap.append(playBtn);

  card.append(playerWrap);

  const content = document.createElement('div');
  content.className = 'cvp-card-content';

  const desc = document.createElement('div');
  desc.className = 'cvp-card-desc';
  if (item.description?.innerHTML) {
    desc.innerHTML = item.description.innerHTML;
  } else if (item.description?.textContent?.trim()) {
    desc.textContent = item.description.textContent.trim();
  }
  content.append(desc);

  const hasTranscript = item.transcript
    ?.textContent?.trim();
  const link = document.createElement('button');
  link.type = 'button';
  link.className = 'cvp-transcript-link';
  link.textContent = 'View Transcript';
  link.style.display = (hasTranscript || item.transcriptHref)
    ? '' : 'none';
  link.addEventListener('click', () => {
    if (hasTranscript) {
      openTranscript(item.transcript);
    } else if (item.transcriptHref) {
      window.open(item.transcriptHref, '_blank');
    }
  });
  content.append(link);

  card.append(content);

  playerCount += 1;
  const id = `venclexta-cvp-${playerCount}`;
  const vid = document.createElement('video-js');
  vid.id = id;
  vid.setAttribute('data-account', accountId);
  vid.setAttribute('data-player', playerId);
  vid.setAttribute('data-embed', 'default');
  vid.setAttribute('data-video-id', item.videoId);
  vid.setAttribute('preload', 'metadata');
  vid.setAttribute('controls', '');
  vid.className = 'video-js cvp-poster-video';
  playerWrap.prepend(vid);

  function initPlayer() {
    return loadBrightcoveScript(accountId, playerId).then(() => {
      if (typeof window.bc === 'function') window.bc(vid);
      return new Promise((resolve) => {
        const poll = () => {
          const p = window.videojs?.getPlayer(id);
          if (!p) { requestAnimationFrame(poll); return; }
          p.ready(function onReady() {
            const mi = this.mediainfo;
            if (mi?.name && !playerWrap.querySelector('.cvp-card-title-overlay')) {
              const titleEl = document.createElement('div');
              titleEl.className = 'cvp-card-title-overlay';
              titleEl.textContent = mi.name;
              playerWrap.append(titleEl);
            }
            if (mi?.description && !desc.textContent) {
              desc.textContent = mi.description;
            }
            if (mi?.longDescription) {
              link.style.display = '';
              link.addEventListener('click', () => {
                window.open(mi.longDescription, '_blank');
              }, { once: true });
            }
            resolve();
          });
        };
        poll();
      });
    });
  }
  card.initPlayer = initPlayer;

  playBtn.addEventListener('click', () => {
    playBtn.hidden = true;
    const videoEl = playerWrap.querySelector('video-js');
    if (!videoEl) return;
    const startPlay = () => {
      const p = window.videojs?.getPlayer(videoEl.id);
      if (p) p.ready(() => p.play());
      else requestAnimationFrame(startPlay);
    };
    loadBrightcoveScript(accountId, playerId).then(startPlay);
  });

  return card;
}

export default async function getBlockConfigs() {
  return {
    flags: {},
    variations: [],
    decorations: {
      decorate: async (block) => {
        if (window.self !== window.top) return;

        const cfg = readConfig(block);
        const items = parseItems(block);
        const { accountId, playerId } = cfg;

        block.textContent = '';
        block.classList.add('cvp-venclexta-stories');

        if (!items.length || !accountId) {
          const msg = document.createElement('p');
          msg.className = 'cvp-placeholder';
          msg.textContent = 'No videos configured.';
          block.append(msg);
          return;
        }

        const grid = document.createElement('div');
        grid.className = 'cvp-grid';

        const cards = items.map((item) => {
          const card = buildCard(item, accountId, playerId);
          grid.append(card);
          return card;
        });

        block.append(grid);

        // Initialize BC players sequentially so dock loads for all
        await cards.reduce(
          (chain, card) => chain.then(() => card.initPlayer()),
          Promise.resolve(),
        );
      },
    },
  };
}
