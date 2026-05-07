const BRIGHTCOVE_ACCOUNT_ID = 'LINZESS_ACCOUNT_ID_PLACEHOLDER';
const BC_PLAYER_ID = 'default';
const loadedScripts = {};
let playerCounter = 0;

function loadBrightcoveScript(accountId, playerId) {
  const key = `${accountId}/${playerId}_default`;
  if (!loadedScripts[key]) {
    loadedScripts[key] = new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src = `https://players.brightcove.net/${key}/index.min.js`;
      script.onload = resolve;
      script.onerror = reject;
      document.head.append(script);
    });
  }
  return loadedScripts[key];
}

function getVideoJsPlayer(id) {
  return typeof window.videojs !== 'undefined' ? window.videojs.getPlayer(id) : null;
}

function isItemRow(row) {
  return row.children.length >= 2 && row.querySelector('picture');
}

function parseConfig(block) {
  const cfgRows = [...block.children].filter((r) => !isItemRow(r));
  // cfgRows[0] = classes/layout row; content fields start at index 1
  const cellText = (ri, ci = 0) => cfgRows[ri]?.children[ci]?.textContent?.trim() ?? '';
  return {
    sectionHeading: cellText(1),
    sectionDescription: cellText(2),
    maxVisible: parseInt(cellText(3), 10) || 0,
  };
}

function parseItems(block) {
  return [...block.children]
    .filter(isItemRow)
    .map((row) => {
      const cells = [...row.children];
      return {
        videoId: cells[0]?.textContent?.trim() ?? '',
        thumbnail: cells[1]?.querySelector('picture') ?? null,
        title: cells[2]?.textContent?.trim() ?? '',
        // cells[3] = transcriptHref (Rinvoq/base field, skipped by Linzess)
        transcriptCell: cells[4] ?? null,
        patientName: cells[5]?.textContent?.trim() ?? '',
        condition: cells[6]?.textContent?.trim() ?? '',
        quote: cells[7]?.textContent?.trim() ?? '',
      };
    })
    .filter(({ videoId }) => videoId);
}

function createTranscriptToggle(transcriptCell) {
  if (!transcriptCell?.textContent?.trim()) return null;

  const toggleBtn = document.createElement('button');
  toggleBtn.type = 'button';
  toggleBtn.className = 'cvp-transcript-toggle';
  toggleBtn.setAttribute('aria-expanded', 'false');
  toggleBtn.textContent = 'View Transcript';

  const panel = document.createElement('div');
  panel.className = 'cvp-transcript-panel';
  panel.hidden = true;
  [...transcriptCell.childNodes].forEach((n) => panel.append(n.cloneNode(true)));

  toggleBtn.addEventListener('click', () => {
    const expanding = panel.hidden;
    panel.hidden = !expanding;
    toggleBtn.textContent = expanding ? 'Hide Transcript' : 'View Transcript';
    toggleBtn.setAttribute('aria-expanded', String(expanding));
  });

  return { toggleBtn, panel };
}

function initBrightcovePlayer(container, videoId, autoplay = false) {
  playerCounter += 1;
  const id = `linz-cvp-${playerCounter}`;

  const videoEl = document.createElement('video-js');
  videoEl.id = id;
  videoEl.setAttribute('data-account', BRIGHTCOVE_ACCOUNT_ID);
  videoEl.setAttribute('data-player', BC_PLAYER_ID);
  videoEl.setAttribute('data-embed', 'default');
  videoEl.setAttribute('data-video-id', videoId);
  videoEl.setAttribute('controls', '');
  videoEl.className = 'video-js';
  container.append(videoEl);

  loadBrightcoveScript(BRIGHTCOVE_ACCOUNT_ID, BC_PLAYER_ID).then(() => {
    if (typeof window.bc === 'function') window.bc(videoEl);
    const poll = () => {
      const p = getVideoJsPlayer(id);
      if (p) {
        if (autoplay) p.ready(() => p.play());
      } else {
        requestAnimationFrame(poll);
      }
    };
    poll();
  });

  return id;
}

function switchVideo(playerId, videoId) {
  const p = getVideoJsPlayer(playerId);
  if (!p?.catalog) return;
  p.catalog.getVideo(videoId, (err, video) => {
    if (!err) {
      p.catalog.load(video);
      p.play();
    }
  });
}

// ── Cards layout (homepage) ──────────────────────────────────────────────────

function buildCardItem(item) {
  const card = document.createElement('div');
  card.className = 'cvp-card';

  // Thumbnail
  const thumbWrap = document.createElement('div');
  thumbWrap.className = 'cvp-card-thumb';
  if (item.thumbnail) thumbWrap.append(item.thumbnail.cloneNode(true));

  const playBtn = document.createElement('button');
  playBtn.type = 'button';
  playBtn.className = 'cvp-card-play-btn';
  playBtn.setAttribute('aria-label', `Play ${item.title || 'video'}`);
  thumbWrap.append(playBtn);

  if (item.title) {
    const overlayTitle = document.createElement('span');
    overlayTitle.className = 'cvp-card-overlay-title';
    overlayTitle.textContent = item.title;
    thumbWrap.append(overlayTitle);
  }
  card.append(thumbWrap);

  // Inline player (shown after play click)
  const playerWrap = document.createElement('div');
  playerWrap.className = 'cvp-card-player';
  playerWrap.hidden = true;
  card.append(playerWrap);

  // Footer: story title left + transcript toggle right
  const footer = document.createElement('div');
  footer.className = 'cvp-card-footer';

  if (item.title) {
    const titleEl = document.createElement('span');
    titleEl.className = 'cvp-card-title';
    titleEl.textContent = item.title;
    footer.append(titleEl);
  }

  const transcript = createTranscriptToggle(item.transcriptCell);
  if (transcript) footer.append(transcript.toggleBtn);
  card.append(footer);
  if (transcript) card.append(transcript.panel);

  // Activate inline player on play button click
  let playerInitialized = false;
  playBtn.addEventListener('click', () => {
    thumbWrap.hidden = true;
    playerWrap.hidden = false;
    if (!playerInitialized) {
      playerInitialized = true;
      initBrightcovePlayer(playerWrap, item.videoId, true);
    }
  });

  // Lazy-preload BC script when card enters viewport
  const observer = new IntersectionObserver(
    (entries) => {
      if (entries[0].isIntersecting) {
        observer.disconnect();
        loadBrightcoveScript(BRIGHTCOVE_ACCOUNT_ID, BC_PLAYER_ID);
      }
    },
    { rootMargin: '300px' },
  );
  observer.observe(card);

  return card;
}

function decorateCardsLayout(block, cfg, items) {
  if (cfg.sectionHeading) {
    const h = document.createElement('h2');
    h.className = 'cvp-section-heading';
    h.textContent = cfg.sectionHeading;
    block.append(h);
  }
  if (cfg.sectionDescription) {
    const d = document.createElement('p');
    d.className = 'cvp-section-desc';
    d.textContent = cfg.sectionDescription;
    block.append(d);
  }

  const grid = document.createElement('div');
  grid.className = 'cvp-grid';

  items.forEach((item, i) => {
    const card = buildCardItem(item);
    if (cfg.maxVisible > 0 && i >= cfg.maxVisible) card.classList.add('cvp-hidden');
    grid.append(card);
  });
  block.append(grid);

  // Mobile touch swipe
  let touchStartX = 0;
  grid.addEventListener('touchstart', (e) => { touchStartX = e.touches[0].clientX; }, { passive: true });
  grid.addEventListener('touchend', (e) => {
    const diff = touchStartX - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 40) {
      const w = grid.firstElementChild?.offsetWidth ?? 300;
      grid.scrollBy({ left: diff > 0 ? w + 16 : -(w + 16), behavior: 'smooth' });
    }
  });
}

// ── Bottom layout (patient experiences) ─────────────────────────────────────

function buildPatientInfo(item) {
  const panel = document.createElement('div');
  panel.className = 'cvp-patient-info';

  if (item.quote) {
    const quote = document.createElement('blockquote');
    quote.className = 'cvp-patient-quote';
    quote.textContent = `“${item.quote}”`;
    panel.append(quote);
  }
  if (item.patientName) {
    const name = document.createElement('p');
    name.className = 'cvp-patient-name';
    name.textContent = item.patientName;
    panel.append(name);
  }
  if (item.condition) {
    const cond = document.createElement('p');
    cond.className = 'cvp-patient-condition';
    cond.textContent = item.condition;
    panel.append(cond);
  }

  return panel;
}

function updatePatientInfo(infoPanel, item) {
  infoPanel.innerHTML = '';

  if (item.quote) {
    const quote = document.createElement('blockquote');
    quote.className = 'cvp-patient-quote';
    quote.textContent = `“${item.quote}”`;
    infoPanel.append(quote);
  }
  if (item.patientName) {
    const name = document.createElement('p');
    name.className = 'cvp-patient-name';
    name.textContent = item.patientName;
    infoPanel.append(name);
  }
  if (item.condition) {
    const cond = document.createElement('p');
    cond.className = 'cvp-patient-condition';
    cond.textContent = item.condition;
    infoPanel.append(cond);
  }

  const transcript = createTranscriptToggle(item.transcriptCell);
  if (transcript) infoPanel.append(transcript.toggleBtn, transcript.panel);
}

function buildPlaylistItem(item, isActive) {
  const btn = document.createElement('button');
  btn.type = 'button';
  btn.className = 'cvp-playlist-item';
  if (isActive) btn.classList.add('is-active');
  btn.setAttribute('role', 'tab');
  btn.setAttribute('aria-selected', String(isActive));
  btn.setAttribute('aria-label', `Play ${item.title || 'video'}`);

  const thumb = document.createElement('div');
  thumb.className = 'cvp-playlist-thumb';
  if (item.thumbnail) thumb.append(item.thumbnail.cloneNode(true));

  const playIcon = document.createElement('span');
  playIcon.className = 'cvp-play-icon';
  playIcon.setAttribute('aria-hidden', 'true');
  thumb.append(playIcon);

  if (item.title) {
    const overlayTitle = document.createElement('span');
    overlayTitle.className = 'cvp-playlist-overlay-title';
    overlayTitle.textContent = item.title;
    thumb.append(overlayTitle);
  }
  btn.append(thumb);

  if (item.title) {
    const itemTitle = document.createElement('span');
    itemTitle.className = 'cvp-playlist-item-title';
    itemTitle.textContent = item.title;
    btn.append(itemTitle);
  }

  return btn;
}

function decorateBottomLayout(block, cfg, items) {
  if (cfg.sectionHeading) {
    const h = document.createElement('h2');
    h.className = 'cvp-section-heading';
    h.textContent = cfg.sectionHeading;
    block.append(h);
  }
  if (cfg.sectionDescription) {
    const d = document.createElement('p');
    d.className = 'cvp-section-desc';
    d.textContent = cfg.sectionDescription;
    block.append(d);
  }

  // Player area: video (left) + patient info (right)
  const playerArea = document.createElement('div');
  playerArea.className = 'cvp-player-area';

  const videoContainer = document.createElement('div');
  videoContainer.className = 'cvp-video-container';
  playerArea.append(videoContainer);

  const infoPanel = buildPatientInfo(items[0]);
  const firstTranscript = createTranscriptToggle(items[0].transcriptCell);
  if (firstTranscript) infoPanel.append(firstTranscript.toggleBtn, firstTranscript.panel);
  playerArea.append(infoPanel);
  block.append(playerArea);

  // Init first video (no autoplay)
  const activePlayerId = items[0].videoId
    ? initBrightcovePlayer(videoContainer, items[0].videoId, false)
    : null;

  // Thumbnail carousel
  const carouselWrapper = document.createElement('div');
  carouselWrapper.className = 'cvp-carousel-wrapper';

  const prevBtn = document.createElement('button');
  prevBtn.type = 'button';
  prevBtn.className = 'cvp-carousel-prev';
  prevBtn.setAttribute('aria-label', 'Previous video');

  const playlist = document.createElement('div');
  playlist.className = 'cvp-playlist';
  playlist.setAttribute('role', 'tablist');
  playlist.setAttribute('aria-label', 'Video playlist');

  const nextBtn = document.createElement('button');
  nextBtn.type = 'button';
  nextBtn.className = 'cvp-carousel-next';
  nextBtn.setAttribute('aria-label', 'Next video');

  items.forEach((item, index) => {
    const btn = buildPlaylistItem(item, index === 0);

    btn.addEventListener('click', () => {
      playlist.querySelectorAll('.cvp-playlist-item').forEach((b) => {
        b.classList.remove('is-active');
        b.setAttribute('aria-selected', 'false');
      });
      btn.classList.add('is-active');
      btn.setAttribute('aria-selected', 'true');

      if (activePlayerId) switchVideo(activePlayerId, item.videoId);
      updatePatientInfo(infoPanel, item);
    });

    playlist.append(btn);
  });

  prevBtn.addEventListener('click', () => {
    const w = playlist.firstElementChild?.offsetWidth ?? 220;
    playlist.scrollBy({ left: -(w + 16), behavior: 'smooth' });
  });
  nextBtn.addEventListener('click', () => {
    const w = playlist.firstElementChild?.offsetWidth ?? 220;
    playlist.scrollBy({ left: w + 16, behavior: 'smooth' });
  });

  carouselWrapper.append(prevBtn, playlist, nextBtn);
  block.append(carouselWrapper);
}

// ── Main entry point ─────────────────────────────────────────────────────────

async function decorateBlock(block) {
  const isBottom = block.classList.contains('bottom');
  block.classList.add(isBottom ? 'cvp-layout-bottom' : 'cvp-layout-cards');

  const cfg = parseConfig(block);
  const items = parseItems(block);

  block.textContent = '';

  if (!items.length) {
    const msg = document.createElement('p');
    msg.className = 'cvp-placeholder';
    msg.textContent = 'Add video rows: Video ID | Thumbnail | Title | Transcript | Patient Name | Condition | Quote';
    block.append(msg);
    return;
  }

  if (isBottom) {
    decorateBottomLayout(block, cfg, items);
  } else {
    decorateCardsLayout(block, cfg, items);
  }
}

export default async function getBlockConfigs() {
  return {
    flags: {},
    variations: [],
    decorations: {
      decorate: async (ctx) => decorateBlock(ctx),
    },
  };
}
