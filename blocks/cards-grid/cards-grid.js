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

  const gridWrap = document.createElement("div");
  gridWrap.className = "card-grid-item";
  const p = document.createElement("p");
  p.append(card);
  gridWrap.append(p);

  return gridWrap;
}

export default function decorate(block) {
  const wrappers = [...block.querySelectorAll(":scope > div")];
  wrappers.forEach((wrapper) => {
    const card = createWrapperATag(wrapper);
    wrapper.replaceWith(card);
  });
}
