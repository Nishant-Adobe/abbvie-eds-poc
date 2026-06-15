/* eslint-disable */
/* global WebImporter */

/**
 * Transformer: rewrite linzess.com source DAM image URLs to the project DAM.
 *
 * The source page references images at /content/dam/linzess/images/<Name>.
 * Leaving them relative (./media_<hash>) makes the markup/xwalk publish path
 * mangle them into a broken /content/dam/.../media1_<hash> DAM path that 404s.
 * Absolute project DAM URLs (/content/dam/abbvie-eds-poc/linzess/images/<Name>)
 * survive publish unchanged, so we rewrite every image src/srcset here, in
 * beforeTransform, before the block parsers read the <img> elements.
 */
const TransformHook = { beforeTransform: 'beforeTransform', afterTransform: 'afterTransform' };

const SOURCE_DAM_PREFIX = '/content/dam/linzess/images/';
const PROJECT_DAM_PREFIX = '/content/dam/abbvie-eds-poc/linzess/images/';

function rewriteUrl(value) {
  if (!value) return value;
  // Absolute or host-qualified source DAM path → project DAM path.
  return value.replace(
    /(https?:\/\/[^/]+)?\/content\/dam\/linzess\/images\//g,
    PROJECT_DAM_PREFIX,
  );
}

export default function transform(hookName, element, payload) {
  if (hookName !== TransformHook.beforeTransform) return;

  element.querySelectorAll('img, source').forEach((el) => {
    ['src', 'data-src', 'srcset', 'data-srcset'].forEach((attr) => {
      const val = el.getAttribute(attr);
      if (val && val.includes(SOURCE_DAM_PREFIX)) {
        el.setAttribute(attr, rewriteUrl(val));
      }
    });
  });
}
