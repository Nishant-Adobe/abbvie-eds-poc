/* eslint-disable */
/* global WebImporter */

/**
 * Parser: brightcove-video
 * Base block: brightcove-video
 * Source: https://www.linzess.com/find-relief
 * Selector: .abbv-video-player
 * Generated: 2026-06-04
 *
 * The brightcove-video block is a 44-row positional block (xwalk simple block).
 * Each non-tab model field occupies one row, in the order defined by _brightcove-video.json.
 * Row indices match the ROW constants in brightcove-video.js.
 *
 * Extractable from DOM:
 *  - overlayTitle: .vjs-dock-title OR .abbv-video-content h3
 *  - overlayDescription: .vjs-dock-description OR .abbv-video-content p
 *  - posterImage: .vjs-poster img (poster thumbnail)
 *  - playerId: from video-js class bc-player-{id}_default
 *  - videoContentLayout: from .abbv-video-content-container class (content-bottom, content-none, etc.)
 *  - transcriptLink: a.transcript-link href
 *  - showTranscriptLabel: a.transcript-link text
 *
 * NOT extractable from DOM (dynamically loaded by Brightcove API):
 *  - videoId: requires title-based mapping from authoring analysis
 *  - accountId: known from analysis as 1029485116001 for Linzess
 *
 * UE Model fields (44 rows, tabs excluded):
 *  Row 0: projectNumber, Row 1: overlayTitle, Row 2: overlayDescription,
 *  Row 3: posterType, Row 4: posterImage, Row 5: posterAlt,
 *  Row 6: colorOverlay, Row 7: overlayButtonText, Row 8: overlayButtonIconType,
 *  Row 9: overlayButtonFontIcon, Row 10: overlayButtonImageIcon, Row 11: iconPosition,
 *  Row 12: playerType, Row 13: accountId, Row 14: playerId,
 *  Row 15: videoId, Row 16: playlistId, Row 17: defaultPlaylistVideoId,
 *  Row 18: playlistType, Row 19: videoContentLayout, Row 20: playlistLayout,
 *  Row 21: enablePlaylistThumbnailMetadata, Row 22: enableAutoplay, Row 23: enableLoop,
 *  Row 24: enableCaptions, Row 25: enableVideoChapters, Row 26: enableRecommendedVideo,
 *  Row 27: enablePlayerControls, Row 28: enableSocialShare, Row 29: enableTranscript,
 *  Row 30: transcriptType, Row 31: showTranscriptLabel, Row 32: hideTranscriptLabel,
 *  Row 33: transcriptClickBehavior, Row 34: modalHiddenPanelId, Row 35: transcriptLink,
 *  Row 36: transcriptButtonIconType, Row 37: transcriptShowFontIcon,
 *  Row 38: transcriptShowImageIcon, Row 39: transcriptHideFontIcon,
 *  Row 40: transcriptHideImageIcon, Row 41: transcriptLinkIconPosition,
 *  Row 42: playButtonAriaLabel, Row 43: videoCaption
 */

/**
 * Known video ID mapping based on overlay title (from authoring analysis).
 * Brightcove video IDs are loaded dynamically and not present in scraped DOM.
 */
const VIDEO_ID_MAP = {
  'GETTING ON THE SAME PAGE': '6391879132112',
  'WHAT TO KNOW BEFORE STARTING LINZESS': '6337642986112',
};

/**
 * Default account ID for Linzess brand Brightcove videos.
 */
const LINZESS_ACCOUNT_ID = '1029485116001';

/**
 * Default player ID extracted from the bc-player class pattern.
 */
const DEFAULT_PLAYER_ID = 'Mcp9TXMkPT';

export default function parse(element, { document }) {
  // --- Extract content from source DOM ---

  // Overlay title: from .abbv-video-content h3 (if non-empty) or .vjs-dock-title
  const contentArea = element.querySelector('.abbv-video-content');
  const dockTitle = element.querySelector('.vjs-dock-title');
  const contentH3 = contentArea?.querySelector('h3');
  const titleEl = (contentH3 && contentH3.textContent.trim()) ? contentH3 : dockTitle;
  const overlayTitle = titleEl?.textContent?.trim() || '';

  // Overlay description: from .abbv-video-content p (if non-empty) or .vjs-dock-description
  const dockDesc = element.querySelector('.vjs-dock-description');
  const contentP = contentArea?.querySelector('p');
  const descEl = (contentP && contentP.textContent.trim()) ? contentP : dockDesc;
  const overlayDescription = descEl?.textContent?.trim() || '';

  // Poster image: from .vjs-poster img
  const posterImg = element.querySelector('.vjs-poster img');
  const posterSrc = posterImg?.getAttribute('src') || '';

  // Player ID: extract from video-js class (pattern: bc-player-{playerId}_default)
  const videoJs = element.querySelector('video-js');
  let playerId = DEFAULT_PLAYER_ID;
  if (videoJs) {
    const classMatch = videoJs.className.match(/bc-player-([A-Za-z0-9]+)_default/);
    if (classMatch) {
      playerId = classMatch[1];
    }
  }

  // Video content layout: from .abbv-video-content-container class (content-bottom, content-none, etc.)
  const contentContainer = element.querySelector('.abbv-video-content-container');
  let videoContentLayout = 'bottom';
  if (contentContainer) {
    if (contentContainer.classList.contains('content-none')) videoContentLayout = 'none';
    else if (contentContainer.classList.contains('content-left')) videoContentLayout = 'left';
    else if (contentContainer.classList.contains('content-right')) videoContentLayout = 'right';
    else if (contentContainer.classList.contains('content-bottom')) videoContentLayout = 'bottom';
  }

  // Transcript link: from a.transcript-link
  const transcriptLinkEl = element.querySelector('a.transcript-link');
  const transcriptHref = transcriptLinkEl?.getAttribute('href') || '';
  const transcriptLabel = transcriptLinkEl?.textContent?.trim() || '';
  const hasTranscript = !!transcriptHref;

  // Video ID: lookup from title mapping (not available in DOM)
  const videoId = VIDEO_ID_MAP[overlayTitle] || '';

  // --- Build 44-row cells array (one row per model field, excluding tabs) ---
  // Each cell gets a field hint comment for xwalk UE integration.
  // Per hinting rules: skip fields ending in Title, Type, MimeType, Alt, Text for comments.
  // However, in this block model, fields like "overlayTitle" and "posterAlt" are standalone
  // fields (not collapsed into a parent), so they DO get their own rows per the model.
  // The hinting rule about collapsed fields applies to fields that are HTML attribute
  // suffixes of a parent (e.g., imageAlt for image). Here each field is independent.

  // Helper: create a cell with field hint comment and text content
  function hintedCell(fieldName, value) {
    if (!value && value !== 'false' && value !== '0') {
      // Empty cell - no hint needed per hinting rules
      return [''];
    }
    const frag = document.createDocumentFragment();
    frag.appendChild(document.createComment(` field:${fieldName} `));
    const text = document.createTextNode(value);
    frag.appendChild(text);
    return [frag];
  }

  // Helper: create a cell with field hint and a link element
  function hintedLinkCell(fieldName, href, text) {
    if (!href) return [''];
    const frag = document.createDocumentFragment();
    frag.appendChild(document.createComment(` field:${fieldName} `));
    const link = document.createElement('a');
    link.href = href;
    link.textContent = text || href;
    frag.appendChild(link);
    return [frag];
  }

  // Helper: create a cell with field hint and an image element
  function hintedImageCell(fieldName, src, alt) {
    if (!src) return [''];
    const frag = document.createDocumentFragment();
    frag.appendChild(document.createComment(` field:${fieldName} `));
    const img = document.createElement('img');
    img.src = src;
    if (alt) img.alt = alt;
    frag.appendChild(img);
    return [frag];
  }

  const cells = [
    /* Row 0:  projectNumber */             hintedCell('projectNumber', ''),
    /* Row 1:  overlayTitle */              hintedCell('overlayTitle', overlayTitle),
    /* Row 2:  overlayDescription */        hintedCell('overlayDescription', overlayDescription),
    /* Row 3:  posterType */                hintedCell('posterType', 'brightcove'),
    /* Row 4:  posterImage */               hintedImageCell('posterImage', posterSrc, overlayTitle),
    /* Row 5:  posterAlt */                 hintedCell('posterAlt', ''),
    /* Row 6:  colorOverlay */              hintedCell('colorOverlay', ''),
    /* Row 7:  overlayButtonText */         hintedCell('overlayButtonText', 'Watch Video'),
    /* Row 8:  overlayButtonIconType */     hintedCell('overlayButtonIconType', 'icon-font'),
    /* Row 9:  overlayButtonFontIcon */     hintedCell('overlayButtonFontIcon', 'play'),
    /* Row 10: overlayButtonImageIcon */    [''],
    /* Row 11: iconPosition */              hintedCell('iconPosition', 'left'),
    /* Row 12: playerType */                hintedCell('playerType', 'single'),
    /* Row 13: accountId */                 hintedCell('accountId', LINZESS_ACCOUNT_ID),
    /* Row 14: playerId */                  hintedCell('playerId', playerId),
    /* Row 15: videoId */                   hintedCell('videoId', videoId),
    /* Row 16: playlistId */                hintedCell('playlistId', ''),
    /* Row 17: defaultPlaylistVideoId */    hintedCell('defaultPlaylistVideoId', ''),
    /* Row 18: playlistType */              hintedCell('playlistType', ''),
    /* Row 19: videoContentLayout */        hintedCell('videoContentLayout', videoContentLayout),
    /* Row 20: playlistLayout */            hintedCell('playlistLayout', ''),
    /* Row 21: enablePlaylistThumbnailMetadata */ hintedCell('enablePlaylistThumbnailMetadata', 'false'),
    /* Row 22: enableAutoplay */            hintedCell('enableAutoplay', 'false'),
    /* Row 23: enableLoop */                hintedCell('enableLoop', 'false'),
    /* Row 24: enableCaptions */            hintedCell('enableCaptions', 'false'),
    /* Row 25: enableVideoChapters */       hintedCell('enableVideoChapters', 'false'),
    /* Row 26: enableRecommendedVideo */    hintedCell('enableRecommendedVideo', 'false'),
    /* Row 27: enablePlayerControls */      hintedCell('enablePlayerControls', 'true'),
    /* Row 28: enableSocialShare */         hintedCell('enableSocialShare', 'false'),
    /* Row 29: enableTranscript */          hintedCell('enableTranscript', hasTranscript ? 'true' : 'false'),
    /* Row 30: transcriptType */            hintedCell('transcriptType', hasTranscript ? 'custom' : ''),
    /* Row 31: showTranscriptLabel */       hintedCell('showTranscriptLabel', transcriptLabel || 'View Transcript'),
    /* Row 32: hideTranscriptLabel */       hintedCell('hideTranscriptLabel', ''),
    /* Row 33: transcriptClickBehavior */   hintedCell('transcriptClickBehavior', hasTranscript ? 'new-tab' : ''),
    /* Row 34: modalHiddenPanelId */        hintedCell('modalHiddenPanelId', ''),
    /* Row 35: transcriptLink */            hintedLinkCell('transcriptLink', transcriptHref, transcriptLabel),
    /* Row 36: transcriptButtonIconType */  hintedCell('transcriptButtonIconType', hasTranscript ? 'icon-font' : ''),
    /* Row 37: transcriptShowFontIcon */    hintedCell('transcriptShowFontIcon', hasTranscript ? 'play' : ''),
    /* Row 38: transcriptShowImageIcon */   [''],
    /* Row 39: transcriptHideFontIcon */    hintedCell('transcriptHideFontIcon', ''),
    /* Row 40: transcriptHideImageIcon */   [''],
    /* Row 41: transcriptLinkIconPosition */ hintedCell('transcriptLinkIconPosition', hasTranscript ? 'after' : ''),
    /* Row 42: playButtonAriaLabel */       hintedCell('playButtonAriaLabel', ''),
    /* Row 43: videoCaption */              hintedCell('videoCaption', ''),
  ];

  const block = WebImporter.Blocks.createBlock(document, { name: 'brightcove-video', cells });
  element.replaceWith(block);
}
