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
  const firstDiv = card.firstElementChild;
  if (firstDiv?.tagName === "DIV") {
    firstDiv.remove();
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
