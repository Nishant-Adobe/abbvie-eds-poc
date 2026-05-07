const BRIGHTCOVE_ACCOUNTS = {
  linzess: 'LINZESS_ACCOUNT_ID_PLACEHOLDER',
  rinvoq: 'RINVOQ_ACCOUNT_ID_PLACEHOLDER',
  mavyret: 'MAVYRET_ACCOUNT_ID_PLACEHOLDER',
};

const BC_PLAYER_ID = 'default';
const loadedScripts = {};
let playerCounter = 0;

function getBrand() {
  const { classList } = document.body;
  return Object.keys(BRIGHTCOVE_ACCOUNTS).find((b) => classList.contains(b)) || 'linzess';
}

function getAccountId() {
  return BRIGHTCOVE_ACCOUNTS[getBrand()];
}

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
  if (row.children.length < 2) return false;
  if (row.querySelector('picture')) return true;
  const firstText = row.firstElementChild?.textContent?.trim() || '';
  return /^\d{8,}$/.test(firstText);
}

function parseConfig(block) {
  const cfgRows = [...block.children].filter((r) => !isItemRow(r));
  // cfgRows[0] = classes/layout row; cfgRows[1] = heading; cfgRows[2] = description
  const cellText = (i) => cfgRows[i]?.firstElementChild?.textContent?.trim() ?? '';
  return {
    heading: cellText(1),
    description: cellText(2),
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
        nameBanner: cells[2]?.textContent?.trim() ?? '',
        // cells[3] = transcriptHref (Rinvoq field, skipped for Linzess)
        transcript: cells[4] ?? null,
        patientName: cells[5]?.textContent?.trim() ?? '',
        prescribed: cells[6]?.textContent?.trim() ?? '',
        quote: cells[7]?.textContent?.trim() ?? '',
      };
    })
    .filter(({ videoId }) => videoId);
}

function initPlayer(container, videoId, autoplay) {
  const accountId = getAccountId();
  playerCounter += 1;
  const id = `linz-cvp-${playerCounter}`;

  const videoEl = document.createElement('video-js');
  videoEl.id = id;
  videoEl.setAttribute('data-account', accountId);
  videoEl.setAttribute('data-player', BC_PLAYER_ID);
  videoEl.setAttribute('data-embed', 'default');
  videoEl.setAttribute('data-video-id', videoId);
  videoEl.setAttribute('controls', '');
  videoEl.className = 'video-js vjs-fluid';
  container.append(videoEl);

  loadBrightcoveScript(accountId, BC_PLAYER_ID).then(() => {
    if (typeof window.bc === 'function') window.bc(videoEl);
    if (autoplay) {
      const poll = () => {
        const p = getVideoJsPlayer(id);
        if (p) p.ready(() => p.play());
        else requestAnimationFrame(poll);
      };
      poll();
    }
  });

  return id;
}

function switchVideo(playerId, videoId) {
  const p = getVideoJsPlayer(playerId);
  if (!p?.catalog) return;
  p.catalog.getVideo(videoId, (err, video) => {
    if (!err) { p.catalog.load(video); p.play(); }
  });
}

function createTranscriptToggle(transcriptCell, container) {
  if (!transcriptCell?.textContent?.trim()) return;

  const btn = document.createElement('button');
  btn.type = 'button';
  btn.className = 'cvp-transcript-toggle';
  btn.setAttribute('aria-expanded', 'false');
  btn.textContent = 'View Transcript';

  const panel = document.createElement('div');
  panel.className = 'cvp-transcript-panel';
  [...transcriptCell.childNodes].forEach((n) => panel.append(n.cloneNode(true)));

  btn.addEventListener('click', () => {
    const isOpen = panel.classList.contains('is-open');
    // Close all open transcript panels in the block
    const blockEl = container.closest('.carousel-video-playlist');
    if (blockEl) {
      blockEl.querySelectorAll('.cvp-transcript-panel.is-open').forEach((p) => {
        p.classList.remove('is-open');
        const toggleBtn = p.previousElementSibling;
        if (toggleBtn?.classList.contains('cvp-transcript-toggle')) {
          toggleBtn.setAttribute('aria-expanded', 'false');
          toggleBtn.textContent = 'View Transcript';
        }
      });
    }
    if (!isOpen) {
      panel.classList.add('is-open');
      btn.setAttribute('aria-expanded', 'true');
      btn.textContent = 'Hide Transcript';
    }
  });

  container.append(btn, panel);
}

// ── Grid mode (homepage) ─────────────────────────────────────────────────────

function buildGridMode(block, cfg, items) {
  if (cfg.heading || cfg.description) {
    const header = document.createElement('div');
    header.className = 'cvp-header';
    if (cfg.heading) {
      const accent = document.createElement('span');
      accent.className = 'cvp-accent-line';
      header.append(accent);
      const h2 = document.createElement('h2');
      h2.className = 'cvp-heading';
      h2.textContent = cfg.heading;
      header.append(h2);
    }
    if (cfg.description) {
      const p = document.createElement('p');
      p.className = 'cvp-description';
      p.textContent = cfg.description;
      header.append(p);
    }
    block.append(header);
  }

  const grid = document.createElement('div');
  grid.className = 'cvp-grid';

  items.forEach((item) => {
    const card = document.createElement('div');
    card.className = 'cvp-card';

    const playerWrap = document.createElement('div');
    playerWrap.className = 'cvp-player-wrap';

    if (item.thumbnail) {
      const thumbImg = document.createElement('div');
      thumbImg.className = 'cvp-thumb-img';
      thumbImg.append(item.thumbnail.cloneNode(true));
      playerWrap.append(thumbImg);
    }

    if (item.nameBanner) {
      const banner = document.createElement('div');
      banner.className = 'cvp-name-banner';
      banner.textContent = item.nameBanner;
      playerWrap.append(banner);
    }

    const playBtn = document.createElement('button');
    playBtn.type = 'button';
    playBtn.className = 'cvp-play-btn';
    playBtn.setAttribute('aria-label', `Play ${item.nameBanner || 'video'}`);
    playBtn.innerHTML = '&#9654;';
    playerWrap.append(playBtn);

    card.append(playerWrap);

    const footer = document.createElement('div');
    footer.className = 'cvp-card-footer';

    if (item.nameBanner) {
      const title = document.createElement('span');
      title.className = 'cvp-title';
      title.textContent = item.nameBanner;
      footer.append(title);
    }

    card.append(footer);
    createTranscriptToggle(item.transcript, footer);

    // Lazy-preload BC script when card enters viewport
    const preloadObs = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        preloadObs.disconnect();
        loadBrightcoveScript(getAccountId(), BC_PLAYER_ID);
      }
    }, { rootMargin: '300px' });
    preloadObs.observe(card);

    // Play → initialise player inline
    let initialized = false;
    playBtn.addEventListener('click', () => {
      if (initialized) return;
      initialized = true;
      preloadObs.disconnect();
      const thumbImg = playerWrap.querySelector('.cvp-thumb-img');
      if (thumbImg) thumbImg.hidden = true;
      playBtn.hidden = true;
      initPlayer(playerWrap, item.videoId, true);
    });

    grid.append(card);
  });

  block.append(grid);

  // Mobile touch swipe
  let touchStartX = 0;
  grid.addEventListener('touchstart', (e) => {
    touchStartX = e.touches[0].clientX;
  }, { passive: true });
  grid.addEventListener('touchend', (e) => {
    const diff = touchStartX - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 40) {
      const w = grid.firstElementChild?.offsetWidth ?? 300;
      grid.scrollBy({ left: diff > 0 ? w + 16 : -(w + 16), behavior: 'smooth' });
    }
  });
}

// ── Featured mode (patient experiences) ─────────────────────────────────────

function buildFeaturedMode(block, items) {
  if (!items.length) return;

  let activePlayerId = null;
  let currentIndex = 0;
  let featuredInitialized = false;

  // ── Part A: Featured video + quote panel ──────────────────────
  const featuredRow = document.createElement('div');
  featuredRow.className = 'cvp-featured-row';

  // Left: video player (70%)
  const featuredPlayer = document.createElement('div');
  featuredPlayer.className = 'cvp-featured-player';

  const featuredWrap = document.createElement('div');
  featuredWrap.className = 'cvp-player-wrap';

  if (items[0].thumbnail) {
    const thumbImg = document.createElement('div');
    thumbImg.className = 'cvp-thumb-img';
    thumbImg.append(items[0].thumbnail.cloneNode(true));
    featuredWrap.append(thumbImg);
  }

  const featuredBanner = document.createElement('div');
  featuredBanner.className = 'cvp-name-banner';
  featuredBanner.textContent = items[0].nameBanner || '';
  featuredWrap.append(featuredBanner);

  const featuredPlayBtn = document.createElement('button');
  featuredPlayBtn.type = 'button';
  featuredPlayBtn.className = 'cvp-play-btn';
  featuredPlayBtn.setAttribute('aria-label', 'Play video');
  featuredPlayBtn.innerHTML = '&#9654;';
  featuredWrap.append(featuredPlayBtn);

  featuredPlayer.append(featuredWrap);
  featuredRow.append(featuredPlayer);

  // Right: quote panel (30%)
  const quotePanel = document.createElement('div');
  quotePanel.className = 'cvp-quote-panel';

  const quoteEl = document.createElement('p');
  quoteEl.className = 'cvp-quote';
  quoteEl.textContent = items[0].quote ? `“${items[0].quote}”` : '';

  const patientNameEl = document.createElement('p');
  patientNameEl.className = 'cvp-patient-name';
  patientNameEl.textContent = items[0].patientName || '';

  const prescribedEl = document.createElement('p');
  prescribedEl.className = 'cvp-prescribed';
  prescribedEl.textContent = items[0].prescribed || '';

  quotePanel.append(quoteEl, patientNameEl, prescribedEl);
  createTranscriptToggle(items[0].transcript, quotePanel);
  featuredRow.append(quotePanel);
  block.append(featuredRow);

  function updateQuotePanel(item) {
    quoteEl.textContent = item.quote ? `“${item.quote}”` : '';
    patientNameEl.textContent = item.patientName || '';
    prescribedEl.textContent = item.prescribed || '';
    quotePanel.querySelectorAll('.cvp-transcript-toggle, .cvp-transcript-panel')
      .forEach((el) => el.remove());
    createTranscriptToggle(item.transcript, quotePanel);
    featuredBanner.textContent = item.nameBanner || '';
  }

  function updateFeaturedThumb(item) {
    const existing = featuredWrap.querySelector('.cvp-thumb-img');
    if (existing) existing.remove();
    if (item.thumbnail) {
      const thumbImg = document.createElement('div');
      thumbImg.className = 'cvp-thumb-img';
      thumbImg.append(item.thumbnail.cloneNode(true));
      featuredWrap.prepend(thumbImg);
    }
  }

  // Featured play button → init player
  featuredPlayBtn.addEventListener('click', () => {
    if (featuredInitialized) return;
    featuredInitialized = true;
    const thumbImg = featuredWrap.querySelector('.cvp-thumb-img');
    if (thumbImg) thumbImg.hidden = true;
    featuredPlayBtn.hidden = true;
    activePlayerId = initPlayer(featuredWrap, items[currentIndex].videoId, true);
  });

  // ── Part B: Thumbnail playlist row ───────────────────────────
  const playlistRow = document.createElement('div');
  playlistRow.className = 'cvp-playlist-row';

  const prevBtn = document.createElement('button');
  prevBtn.type = 'button';
  prevBtn.className = 'cvp-prev';
  prevBtn.setAttribute('aria-label', 'Previous');
  prevBtn.innerHTML = '&#8249;';

  const thumbnails = document.createElement('div');
  thumbnails.className = 'cvp-thumbnails';
  thumbnails.setAttribute('role', 'tablist');
  thumbnails.setAttribute('aria-label', 'Video playlist');

  const nextBtn = document.createElement('button');
  nextBtn.type = 'button';
  nextBtn.className = 'cvp-next';
  nextBtn.setAttribute('aria-label', 'Next');
  nextBtn.innerHTML = '&#8250;';

  items.forEach((item, index) => {
    const thumb = document.createElement('div');
    thumb.className = 'cvp-thumb';
    thumb.setAttribute('role', 'tab');
    thumb.setAttribute('tabindex', index === 0 ? '0' : '-1');
    thumb.setAttribute('aria-selected', index === 0 ? 'true' : 'false');
    thumb.setAttribute('aria-label', item.nameBanner || `Video ${index + 1}`);
    if (index === 0) thumb.classList.add('active');

    const thumbWrap = document.createElement('div');
    thumbWrap.className = 'cvp-thumb-wrap';

    if (item.thumbnail) {
      const img = item.thumbnail.querySelector('img')?.cloneNode(true);
      if (img) {
        img.alt = item.nameBanner || '';
        thumbWrap.append(img);
      }
    }

    const thumbBanner = document.createElement('div');
    thumbBanner.className = 'cvp-name-banner';
    thumbBanner.textContent = item.nameBanner || '';
    thumbWrap.append(thumbBanner);

    const thumbPlayIcon = document.createElement('span');
    thumbPlayIcon.className = 'cvp-play-btn';
    thumbPlayIcon.setAttribute('aria-hidden', 'true');
    thumbPlayIcon.innerHTML = '&#9654;';
    thumbWrap.append(thumbPlayIcon);

    thumb.append(thumbWrap);

    const thumbTitle = document.createElement('p');
    thumbTitle.className = 'cvp-thumb-title';
    thumbTitle.textContent = item.nameBanner || '';
    thumb.append(thumbTitle);

    function selectThumb() {
      currentIndex = index;
      thumbnails.querySelectorAll('.cvp-thumb').forEach((t, i) => {
        t.classList.toggle('active', i === index);
        t.setAttribute('aria-selected', i === index ? 'true' : 'false');
        t.setAttribute('tabindex', i === index ? '0' : '-1');
      });
      updateQuotePanel(item);

      if (featuredInitialized && activePlayerId) {
        switchVideo(activePlayerId, item.videoId);
      } else {
        updateFeaturedThumb(item);
      }
    }

    thumb.addEventListener('click', selectThumb);
    thumb.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); selectThumb(); }
    });

    thumbnails.append(thumb);
  });

  const scrollAmt = 200;

  prevBtn.addEventListener('click', () => {
    thumbnails.scrollBy({ left: -scrollAmt, behavior: 'smooth' });
  });
  nextBtn.addEventListener('click', () => {
    thumbnails.scrollBy({ left: scrollAmt, behavior: 'smooth' });
  });

  // Keyboard: arrow keys navigate thumbnails
  thumbnails.addEventListener('keydown', (e) => {
    const thumbEls = [...thumbnails.querySelectorAll('.cvp-thumb')];
    const idx = thumbEls.indexOf(document.activeElement);
    let next = -1;
    if (e.key === 'ArrowRight') next = (idx + 1) % thumbEls.length;
    if (e.key === 'ArrowLeft') next = (idx - 1 + thumbEls.length) % thumbEls.length;
    if (next >= 0) { e.preventDefault(); thumbEls[next].focus(); }
  });

  // Touch swipe on thumbnail row
  let touchStartX = 0;
  thumbnails.addEventListener('touchstart', (e) => {
    touchStartX = e.touches[0].clientX;
  }, { passive: true });
  thumbnails.addEventListener('touchend', (e) => {
    const diff = touchStartX - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 30) {
      thumbnails.scrollBy({ left: diff > 0 ? scrollAmt : -scrollAmt, behavior: 'smooth' });
    }
  });

  playlistRow.append(prevBtn, thumbnails, nextBtn);
  block.append(playlistRow);
}

// ── Main entry ───────────────────────────────────────────────────────────────

async function decorateBlock(block) {
  const isFeatured = block.classList.contains('featured');

  const cfg = parseConfig(block);
  const items = parseItems(block);

  block.textContent = '';

  if (!items.length) {
    const msg = document.createElement('p');
    msg.className = 'cvp-placeholder';
    msg.textContent = 'Add video items: Video ID | Thumbnail | Name Banner | Quote | Patient Name | Prescribed | Transcript';
    block.append(msg);
    return;
  }

  if (isFeatured) {
    buildFeaturedMode(block, items);
  } else {
    buildGridMode(block, cfg, items);
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
