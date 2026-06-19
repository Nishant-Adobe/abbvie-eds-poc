/* eslint-disable */

/**
 * Appends the standard Linzess page metadata block (brand, nav, footer, title)
 * to migrated utility pages so they render with the correct brand chrome.
 */
export default function transform(hookName, element, payload) {
  if (hookName !== 'afterTransform') return;

  const { document } = payload;

  const sourceUrl = payload.params?.originalURL || payload.url || '';
  const slug = (() => {
    try {
      return new URL(sourceUrl).pathname.replace(/\/$/, '').split('/').filter(Boolean).pop() || '';
    } catch (e) {
      return '';
    }
  })();

  const title = (document.title
    || document.querySelector('title')?.textContent
    || element.querySelector('h1, h2, h3')?.textContent
    || '').trim();

  // Per-page, hand-written meta descriptions. The generic "first paragraph"
  // fallback is wrong for pages where regulated ISI copy is appended before
  // this transformer runs (e.g. the sitemap) — it would describe the page with
  // ISI legal text. Keyed by URL slug.
  const PER_PAGE_DESCRIPTION = {
    sitemap: 'Browse the LINZESS® (linaclotide) site map — quick links to Why LINZESS, Understanding Constipation, Find Relief, Resources, and Savings & Support.',
  };

  // Prefer a curated per-page description, then the live page's own meta/OG
  // description, then the first meaningful body paragraph, then a title-derived
  // sentence. PSI's SEO audit flags pages with no meta description.
  const firstParagraph = [...element.querySelectorAll('p')]
    .map((p) => p.textContent.trim())
    .find((t) => t.length > 40);
  const description = (
    PER_PAGE_DESCRIPTION[slug]
    || document.querySelector('meta[name="description"]')?.getAttribute('content')
    || document.querySelector('meta[property="og:description"]')?.getAttribute('content')
    || firstParagraph
    || (title ? `${title} — LINZESS® (linaclotide). Important Safety Information and full Prescribing Information.` : '')
  ).trim().slice(0, 160);

  // Canonical URL — PSI/SEO best practice. Derive from the original live URL's
  // pathname under the canonical linzess.com host.
  let canonical = '';
  try {
    canonical = `https://www.linzess.com${new URL(sourceUrl).pathname.replace(/\/$/, '')}`;
  } catch (e) {
    canonical = '';
  }

  // Some utility pages (e.g. the SMS reminder terms & conditions) render on the
  // live site as standalone documents with NO header/footer. For those, omit the
  // nav/footer metadata so the header/footer blocks have no fragment to load.
  const noChrome = /reminder-terms-conditions/i.test(sourceUrl);

  // For no-chrome pages, set nav/footer to the explicit `false` opt-out so the
  // header/footer blocks skip rendering (omitting them lets footer fall back to
  // the existing /footer fragment, which would still render).
  const cells = [
    ['Metadata'],
    ['brand', 'linzess'],
    ...(noChrome
      ? [['nav', 'false'], ['footer', 'false']]
      : [['nav', '/linzess/nav'], ['footer', '/linzess/footer']]),
    ['title', title],
    ['description', description],
    ['canonical', canonical],
  ].filter((row) => row.length === 1 || row[1]);

  // Use the WebImporter table helper so html2md emits a real block table
  // (a hand-built div.metadata is serialized as plain paragraphs instead).
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.append(table);
}
