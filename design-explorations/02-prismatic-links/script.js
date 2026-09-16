const links = document.querySelectorAll(".prism-link");
const ambientLight = document.querySelector(".ambient-light");
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

function updateRefraction(event) {
  const link = event.currentTarget;
  const bounds = link.getBoundingClientRect();
  const localX = Math.min(Math.max(event.clientX - bounds.left, 0), bounds.width);
  const percentage = bounds.width ? (localX / bounds.width) * 100 : 50;

  link.style.setProperty("--prism-x", `${percentage}%`);
  ambientLight?.style.setProperty("--light-x", `${event.clientX}px`);
  ambientLight?.style.setProperty("--light-y", `${event.clientY}px`);
}

function centerRefraction(event) {
  event.currentTarget.style.setProperty("--prism-x", "50%");
}

function addEcho(event) {
  if (reduceMotion.matches || event.detail === 0) return;

  const echo = document.createElement("span");
  echo.className = "refraction-echo";
  echo.style.left = `${event.clientX}px`;
  echo.style.top = `${event.clientY}px`;
  echo.setAttribute("aria-hidden", "true");
  document.body.append(echo);
  echo.addEventListener("animationend", () => echo.remove(), { once: true });
}

links.forEach((link) => {
  link.addEventListener("pointermove", updateRefraction);
  link.addEventListener("focus", centerRefraction);
  link.addEventListener("click", addEcho);
});
