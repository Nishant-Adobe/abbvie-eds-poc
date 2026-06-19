import { applyCommonProps } from '../../scripts/utils.js';

// A footnote sentence that ends with an inline link (e.g. "Please see full
// Terms and Privacy Policy.") is flattened by the md2jcr publish pipeline into
// separate <p> fragments — and EDS then auto-decorates each lone-link <p> as a
// pill .button. Restore the live inline rendering: drop the button styling and
// re-flow the fragments that were split mid-sentence back into one paragraph.
function reflowFootnoteLinks(block) {
  block.querySelectorAll('a.button').forEach((a) => {
    a.classList.remove('button');
    const wrapper = a.closest('.button-container');
    if (wrapper) wrapper.classList.remove('button-container');
  });

  const endsSentence = (el) => /[.!?:]\s*$/.test(el.textContent);
  let current = block.querySelector(':scope > p');
  while (current) {
    const next = current.nextElementSibling;
    // Merge the next paragraph in only when this one was cut off mid-sentence
    // (no terminal punctuation) — leaves genuinely separate paragraphs intact.
    if (next && next.tagName === 'P' && !endsSentence(current)) {
      // Only insert a joining space when the next fragment doesn't begin with
      // punctuation (avoids "Privacy Policy ." when a lone "." was split off).
      const startsWithPunct = /^\s*[.,!?:;)]/.test(next.textContent);
      if (current.lastChild && !/\s$/.test(current.textContent) && !startsWithPunct) {
        current.append(document.createTextNode(' '));
      }
      while (next.firstChild) current.append(next.firstChild);
      next.remove();
    } else {
      current = next;
    }
  }
}

export default function decorate(block) {
  applyCommonProps(block);
  const row = block.querySelector(':scope > div');
  if (!row) return;
  const cell = row.querySelector(':scope > div');
  if (cell) {
    while (cell.firstChild) {
      row.parentElement.insertBefore(cell.firstChild, row);
    }
    row.remove();
  }
  // Remove any remaining framework rows (classes placeholder, etc.)
  [...block.querySelectorAll(':scope > div')].forEach((r) => {
    const text = r.textContent.trim();
    if (text === '-' || text === '' || text === 'none') r.remove();
  });

  if (block.classList.contains('footnote')) reflowFootnoteLinks(block);
}
