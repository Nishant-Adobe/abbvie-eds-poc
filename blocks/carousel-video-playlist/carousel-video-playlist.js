import { renderBlock } from '../../scripts/multi-theme.js';

const DEFAULT_PLAYER = 'default';
const bcScripts = {};
let playerCount = 0;

function loadBrightcoveScript(account, player) {
  const key = `${account}/${player}_default`;
  if (!bcScripts[key]) {
    bcScripts[key] = new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src = `https://players.brightcove.net/${key}/index.min.js`;
      script.onload = resolve;
      script.onerror = reject;
      document.head.append(script);
    });
  }
  return bcScripts[key];
}

function getPlayer(id) {
  if (typeof window.videojs !== 'undefined') {
    return window.videojs.getPlayer(id);
  }
  return null;
}

function buildThumbnailCard(item, index, isActive, isCardsLayout) {
  const card = document.createElement('button');
  card.type = 'button';
  card.className = 'cvp-playlist-item';
  if (isActive) card.classList.add('is-active');
  card.setAttribute('aria-label', `Play ${item.title || `Video ${index + 1}`}`);
  card.dataset.index = index;

  if (item.thumbnail) {
    const thumbWrap = document.createElement('div');
    thumbWrap.className = 'cvp-playlist-thumb';
    thumbWrap.append(item.thumbnail.cloneNode(true));

    const playIcon = document.createElement('span');
    playIcon.className = 'cvp-playlist-play-icon';
    playIcon.setAttribute('aria-hidden', 'true');
    thumbWrap.append(playIcon);

    if (isCardsLayout && item.title) {
      const overlayTitle = document.createElement('span');
      overlayTitle.className = 'cvp-playlist-overlay-title';
      overlayTitle.textContent = item.title;
      thumbWrap.append(overlayTitle);
    }

    card.append(thumbWrap);
  }

  if (!isCardsLayout && item.title) {
    const title = document.createElement('span');
    title.className = 'cvp-playlist-item-title';
    title.textContent = item.title;
    card.append(title);
  }

  return card;
}

function getCellText(row) {
  return row?.firstElementChild?.textContent?.trim() || '';
}

function readBlockConfig(block) {
  const rows = [...block.children];
  return {
    playlistLayout: getCellText(rows[0]) || 'cards',
    accountId: getCellText(rows[1]) || '',
    playerId: getCellText(rows[2]) || DEFAULT_PLAYER,
    enableCaptions: getCellText(rows[3]) === 'true',
    anchorId: getCellText(rows[4]) || '',
  };
}

function parsePlaylistItems(block) {
  const items = [];
  const rows = [...block.children];
  const configFieldCount = 4;

  rows.slice(configFieldCount).forEach((row) => {
    const cells = [...row.children];
    if (cells.length < 2) return;

    const videoId = cells[0]?.textContent?.trim() || '';
    if (!videoId) return;

    const thumbnail = cells[1]?.querySelector('picture') || null;
    const title = cells[2]?.textContent?.trim() || '';
    const transcriptHref = cells[3]?.querySelector('a')?.href
      || cells[3]?.textContent?.trim() || '';

    items.push({
      videoId, thumbnail, title, transcriptHref,
    });
  });

  return items;
}

function initPlayer(container, account, player, videoId, enableCaptions) {
  if (container.querySelector('video-js')) return;

  playerCount += 1;
  const playerId = `cvp-player-${playerCount}`;

  const videoEl = document.createElement('video-js');
  videoEl.id = playerId;
  videoEl.setAttribute('data-account', account);
  videoEl.setAttribute('data-player', player);
  videoEl.setAttribute('data-embed', 'default');
  videoEl.setAttribute('data-video-id', videoId);
  videoEl.setAttribute('controls', '');
  videoEl.className = 'video-js cvp-player';

  container.append(videoEl);

  loadBrightcoveScript(account, player).then(() => {
    if (typeof window.bc === 'function') {
      window.bc(videoEl);
    }

    const configure = () => {
      const bcPlayer = getPlayer(playerId);
      if (!bcPlayer) {
        requestAnimationFrame(configure);
        return;
      }
      bcPlayer.ready(function onReady() {
        if (!enableCaptions) {
          const tracks = this.textTracks();
          if (tracks) {
            for (let i = 0; i < tracks.length; i += 1) {
              if (tracks[i].kind === 'captions' || tracks[i].kind === 'subtitles') {
                tracks[i].mode = 'disabled';
              }
            }
          }
        }
      });
    };
    configure();
  });
}

function switchVideo(container, videoId) {
  const videoEl = container.querySelector('video-js');
  if (!videoEl) return;

  const bcPlayer = getPlayer(videoEl.id);
  if (!bcPlayer) return;

  bcPlayer.catalog.getVideo(videoId, (error, video) => {
    if (!error) {
      bcPlayer.catalog.load(video);
      bcPlayer.play();
    }
  });
}

export async function decorateBlock(block) {
  const cfg = readBlockConfig(block);
  const {
    accountId, playerId, enableCaptions, playlistLayout,
  } = cfg;
  const isCardsLayout = playlistLayout === 'cards';

  const items = parsePlaylistItems(block);
  if (!items.length) return;

  block.textContent = '';
  block.classList.add(`cvp-layout-${playlistLayout}`);

  // Main player area
  const playerArea = document.createElement('div');
  playerArea.className = 'cvp-player-area';

  const videoContainer = document.createElement('div');
  videoContainer.className = 'cvp-video-container';
  playerArea.append(videoContainer);

  // Active video title
  const activeTitle = document.createElement('h3');
  activeTitle.className = 'cvp-active-title';
  activeTitle.textContent = items[0].title || '';
  playerArea.append(activeTitle);

  // Transcript link for active video
  const transcriptLink = document.createElement('a');
  transcriptLink.className = 'cvp-transcript-link';
  transcriptLink.target = '_blank';
  transcriptLink.rel = 'noopener noreferrer';
  transcriptLink.textContent = 'View Transcript';
  if (items[0].transcriptHref) {
    transcriptLink.href = items[0].transcriptHref;
  } else {
    transcriptLink.hidden = true;
  }
  playerArea.append(transcriptLink);

  // Playlist area
  const playlistArea = document.createElement('div');
  playlistArea.className = 'cvp-playlist';
  playlistArea.setAttribute('role', 'tablist');
  playlistArea.setAttribute('aria-label', 'Video playlist');

  items.forEach((item, index) => {
    const card = buildThumbnailCard(item, index, index === 0, isCardsLayout);
    card.setAttribute('role', 'tab');
    card.setAttribute('aria-selected', index === 0 ? 'true' : 'false');
    card.id = `cvp-tab-${playerCount + 1}-${index}`;

    card.addEventListener('click', () => {
      playlistArea.querySelectorAll('.cvp-playlist-item').forEach((btn) => {
        btn.classList.remove('is-active');
        btn.setAttribute('aria-selected', 'false');
      });
      card.classList.add('is-active');
      card.setAttribute('aria-selected', 'true');

      switchVideo(videoContainer, item.videoId);
      activeTitle.textContent = item.title || '';

      if (item.transcriptHref) {
        transcriptLink.href = item.transcriptHref;
        transcriptLink.hidden = false;
      } else {
        transcriptLink.hidden = true;
      }
    });

    playlistArea.append(card);
  });

  // Assemble layout
  if (isCardsLayout) {
    block.append(playlistArea, playerArea);
  } else if (playlistLayout === 'top' || playlistLayout === 'bottom') {
    const scrollWrapper = document.createElement('div');
    scrollWrapper.className = 'cvp-playlist-scroll-wrapper';

    const prevBtn = document.createElement('button');
    prevBtn.type = 'button';
    prevBtn.className = 'cvp-playlist-nav cvp-playlist-prev';
    prevBtn.setAttribute('aria-label', 'Previous videos');

    const nextBtn = document.createElement('button');
    nextBtn.type = 'button';
    nextBtn.className = 'cvp-playlist-nav cvp-playlist-next';
    nextBtn.setAttribute('aria-label', 'Next videos');

    const scrollAmount = 240;
    prevBtn.addEventListener('click', () => {
      playlistArea.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
    });
    nextBtn.addEventListener('click', () => {
      playlistArea.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    });

    scrollWrapper.append(prevBtn, playlistArea, nextBtn);

    if (playlistLayout === 'top') {
      block.append(scrollWrapper, playerArea);
    } else {
      block.append(playerArea, scrollWrapper);
    }
  } else if (playlistLayout === 'left') {
    block.append(playlistArea, playerArea);
  } else {
    block.append(playerArea, playlistArea);
  }

  // Initialize the Brightcove player with the first video
  if (accountId && items[0].videoId) {
    initPlayer(videoContainer, accountId, playerId, items[0].videoId, enableCaptions);
  }

  // Keyboard navigation within playlist
  playlistArea.addEventListener('keydown', (e) => {
    const tabs = [...playlistArea.querySelectorAll('.cvp-playlist-item')];
    const current = tabs.indexOf(document.activeElement);
    if (current < 0) return;

    let next = -1;
    if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
      next = (current + 1) % tabs.length;
    } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
      next = (current - 1 + tabs.length) % tabs.length;
    } else if (e.key === 'Home') {
      next = 0;
    } else if (e.key === 'End') {
      next = tabs.length - 1;
    }

    if (next >= 0) {
      e.preventDefault();
      tabs[next].focus();
    }
  });
}

export default async function decorate(block) {
  renderBlock(block);
}
