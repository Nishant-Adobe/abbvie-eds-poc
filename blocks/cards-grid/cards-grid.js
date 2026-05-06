const LINE1_SPAN_CLASSES = "cta-card-grid-line-1 abbv-icon-keyboard_arrow_right i-a";

/**
 * Match index.html line-1 treatment: brand in .cta-card-grid-risa-pri, UE strong → spans.
 * @param {string} html from line1 <p>
 */
function normalizeLine1Html(html) {
  let h = (html || "").trim();
  if (!h) return "";
  h = h
    .replace(
      /<strong\b[^>]*>([\s\S]*?)<\/strong>/gi,
      '<span class="cta-card-grid-risa-pri">$1</span>'
    )
    .replace(
      /<b\b[^>]*>([\s\S]*?)<\/b>/gi,
      '<span class="cta-card-grid-risa-pri">$1</span>'
    );
  if (!h.includes("cta-card-grid-risa-pri")) {
    h = h.replace(/\bSKYRIZI\b/i, '<span class="cta-card-grid-risa-pri">SKYRIZI</span>');
  }
  return h;
}

function createWrapperATag(wrapper) {
  const card = document.createElement("a");
  card.className = "grid-card";
  const sourceLink = wrapper.querySelector("a[href]");

  if (sourceLink) {
    card.href = sourceLink.getAttribute("href") || "#";
    card.target = sourceLink.getAttribute("target") || "_self";
  }

  while (wrapper.firstChild) {
    card.append(wrapper.firstChild);
  }

  const innerLinkDiv = card.firstElementChild;
  if (innerLinkDiv) {
    innerLinkDiv.remove();
  }

  const firstDiv = card.firstElementChild;
  if (firstDiv?.tagName === "DIV") {
    const line1P = firstDiv.querySelector("p");
    if (line1P) {
      const line1Span = document.createElement("span");
      line1Span.className = LINE1_SPAN_CLASSES;
      line1Span.innerHTML = normalizeLine1Html(line1P.innerHTML);
      firstDiv.replaceWith(line1Span);
    } else {
      firstDiv.remove();
    }
  }

  return card;
}

export default function decorate(block) {
  const wrappers = [
    ...block.querySelectorAll('div[data-aue-component="grid-card"]'),
  ];
  wrappers.forEach((wrapper) => {
    const card = createWrapperATag(wrapper);
    wrapper.replaceWith(card);
  });
}
