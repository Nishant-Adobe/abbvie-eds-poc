/* eslint-disable */
/* global WebImporter */

/**
 * DAM path rewrite transformer for LINZESS DTC pages.
 *
 * The live site serves assets from `/content/dam/linzess/...`; the EDS POC
 * project stores them under `/content/dam/abbvie-eds-poc/linzess/...`. This
 * transformer rewrites every <img> src (and srcset) so the imported content
 * references the project DAM. Brightcove poster frames (cf-images host) are
 * mapped to the project's mirrored `/content/dam/abbvie-eds-poc/v1/static/...`
 * path. Runs in afterTransform (after parsers have set final <img> elements).
 */
const LIVE_DAM = '/content/dam/linzess/';
const PROJECT_DAM = '/content/dam/abbvie-eds-poc/linzess/';
const BRIGHTCOVE_HOST = /https?:\/\/cf-images\.[^/]+\/v1\/static\//;
const PROJECT_BRIGHTCOVE = '/content/dam/abbvie-eds-poc/v1/static/';

function rewrite(value) {
  if (!value) return value;
  let out = value;
  // Brightcove poster CDN → project DAM mirror.
  out = out.replace(BRIGHTCOVE_HOST, PROJECT_BRIGHTCOVE);
  // Absolute live host → relative, then live DAM → project DAM.
  out = out.replace(/https?:\/\/www\.linzess\.com/g, '');
  out = out.replace(LIVE_DAM, PROJECT_DAM);
  return out;
}

export default function transform(hookName, element, payload) {
  if (hookName !== 'afterTransform') return;

  element.querySelectorAll('img').forEach((img) => {
    const src = img.getAttribute('src');
    if (src) img.setAttribute('src', rewrite(src));
    const srcset = img.getAttribute('srcset');
    if (srcset) img.setAttribute('srcset', rewrite(srcset));
  });

  // Rewrite Medication Guide / PI PDF links that point at the live DAM PDF.
  element.querySelectorAll('a[href]').forEach((a) => {
    const href = a.getAttribute('href');
    if (href && href.includes('/content/dam/linzess/')) {
      a.setAttribute('href', rewrite(href));
    }
  });
}
