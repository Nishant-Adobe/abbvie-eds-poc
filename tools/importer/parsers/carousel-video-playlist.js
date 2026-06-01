export default function parse(element, { document }) {
  // Find videos in both homepage format (flexbox-video-cards) and inner page format (playlist carousel)
  let videoPlayers = element.querySelectorAll('[data-video-id]');
  // Deduplicate by video ID (some pages have nested video-js elements)
  const seen = new Set();
  videoPlayers = Array.from(videoPlayers).filter((vp) => {
    const id = vp.getAttribute('data-video-id');
    if (!id || seen.has(id)) return false;
    seen.add(id);
    return true;
  });
  const firstVideo = videoPlayers[0];
  const account = firstVideo ? firstVideo.getAttribute('data-account') || '1029485116001' : '1029485116001';
  const player = firstVideo ? firstVideo.getAttribute('data-player') || 'Mcp9TXMkPT' : 'Mcp9TXMkPT';

  // Skip if no videos found
  if (videoPlayers.length === 0) return;

  const cells = [['Carousel Video Playlist']];

  // Config rows
  cells.push(['']);  // sectionHeading
  cells.push(['']);  // sectionDescription
  cells.push(['0']); // maxVisible
  cells.push([account]); // accountId
  cells.push(['']);  // playlistId
  cells.push([player]); // playerId
  cells.push(['false']); // playMode
  cells.push(['']);  // empty

  // Item rows
  videoPlayers.forEach((vp) => {
    const videoId = vp.getAttribute('data-video-id') || '';
    if (!videoId) return;

    const card = vp.closest('.abbv-flex-item-v2') || vp.closest('.flexboxitem-v2') || vp.closest('.abbv-video-player') || vp.parentElement;
    const titleEl = card ? card.querySelector('h3, .vjs-dock-title') : null;
    const title = titleEl ? titleEl.textContent.trim() : '';
    const transcriptLink = card ? card.querySelector('a[href*="transcript"]') : null;
    const transcript = transcriptLink ? transcriptLink.getAttribute('href') || '' : '';

    cells.push([videoId, title, transcript, '', '', '', '']);
  });

  const table = WebImporter.DOMUtils.createTable(cells, document);
  // Don't replace [role=main] — append instead
  if (element.getAttribute('role') === 'main' || element.tagName === 'BODY') {
    element.appendChild(document.createElement('hr'));
    element.appendChild(table);
  } else {
    element.replaceWith(table);
  }
}
