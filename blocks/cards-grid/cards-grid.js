const LINE1_SPAN_CLASSES = "cta-card-grid-line-1 abbv-icon-keyboard_arrow_right i-a";

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
      line1Span.innerHTML = line1P.innerHTML;
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
