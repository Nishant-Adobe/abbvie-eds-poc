/* eslint-disable */
/* global WebImporter */

/**
 * Embed parser — LINZESS Brightcove video.
 *
 * Source instance: `.abbv-video-player` (page-level, not modal). The video is
 * a Brightcove player; for the static import we capture the poster frame
 * (from the `.vjs-poster` background-image) as a single image, with the video
 * name as alt text. Matches the known-good output:
 *   <div class="embed"><div><div><picture><img src=POSTER alt=NAME></picture></div></div></div>
 *
 * Replaces `element` so the validator can locate the created block.
 */
function posterFromPlayer(element) {
  const poster = element.querySelector('.vjs-poster');
  if (poster) {
    const bg = poster.style.backgroundImage || '';
    const m = bg.match(/url\(["']?([^"')]+)["']?\)/);
    if (m) return m[1];
    const dataPoster = poster.getAttribute('data-poster');
    if (dataPoster) return dataPoster;
  }
  // Fallback: <video poster> attribute.
  const video = element.querySelector('video, video-js, [poster]');
  if (video && video.getAttribute('poster')) return video.getAttribute('poster');
  return '';
}

export default function parse(element, { document }) {
  const poster = posterFromPlayer(element);
  const name = element.getAttribute('data-videoname')
    ? element.getAttribute('data-videoname').replace(/^Watch:\s*/i, '').trim()
    : '';

  const cell = document.createElement('div');
  if (poster) {
    const picture = document.createElement('picture');
    const img = document.createElement('img');
    img.setAttribute('src', poster);
    if (name) img.setAttribute('alt', name);
    picture.append(img);
    cell.append(picture);
  }

  const cells = [
    ['Embed'],
    [cell],
  ];

  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
