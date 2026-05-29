export default function parse(element, { document }) {
  const videoPlayers = element.querySelectorAll('[data-video-id]');
  const firstVideo = videoPlayers[0];
  const account = firstVideo ? firstVideo.getAttribute('data-account') || '1029485116001' : '1029485116001';
  const player = firstVideo ? firstVideo.getAttribute('data-player') || 'Mcp9TXMkPT' : 'Mcp9TXMkPT';

  const cells = [['Carousel Video Playlist']];

  // Config rows
  cells.push(['']);  // sectionHeading
  cells.push(['']);  // sectionDescription
  cells.push(['0']); // maxVisible
  cells.push([account]); // accountId
  cells.push(['']);  // playlistId
  cells.push([player]); // playerId
  cells.push(['']);  // playMode
  cells.push(['']);  // empty

  // Item rows
  videoPlayers.forEach((vp) => {
    const videoId = vp.getAttribute('data-video-id') || '';
    if (!videoId) return;

    const card = vp.closest('.abbv-flex-item-v2') || vp.closest('.flexboxitem-v2') || vp.parentElement;
    const titleEl = card ? card.querySelector('h3, .vjs-dock-title') : null;
    const title = titleEl ? titleEl.textContent.trim() : '';
    const transcriptLink = card ? card.querySelector('a[href*="transcript"]') : null;
    const transcript = transcriptLink ? transcriptLink.getAttribute('href') || '' : '';

    cells.push([videoId, title, transcript, '', '', '', '']);
  });

  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
