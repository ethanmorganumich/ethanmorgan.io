const interactiveLinks = document.querySelectorAll(".play-link");
const aside = document.querySelector("#hover-aside");
const defaultAside = aside?.textContent ?? "";

interactiveLinks.forEach((link) => {
  if (!aside || !link.dataset.aside) return;

  const showAside = () => {
    aside.textContent = `↳ ${link.dataset.aside}`;
  };

  const resetAside = () => {
    aside.textContent = defaultAside;
  };

  link.addEventListener("pointerenter", showAside);
  link.addEventListener("pointerleave", resetAside);
  link.addEventListener("focus", showAside);
  link.addEventListener("blur", resetAside);
});
