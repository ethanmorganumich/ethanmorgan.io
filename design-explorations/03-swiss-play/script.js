const targets = Array.from(document.querySelectorAll(".annotation-target"));
const rail = document.querySelector(".annotation-rail");
const indexLabel = document.querySelector("#annotation-index");
const annotationCopy = document.querySelector("#annotation-copy");
const leaderPath = document.querySelector("#leader-path");
const leaderOrigin = document.querySelector("#leader-origin");
const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

let activeTarget = document.querySelector(".inline-annotation");
let frame = null;

function drawLeader(target) {
  if (!target || !rail || !leaderPath || window.innerWidth <= 1152) {
    leaderPath?.setAttribute("d", "");
    return;
  }

  const targetRect = target.getBoundingClientRect();
  const railRect = rail.getBoundingClientRect();
  const startX = targetRect.right + 9;
  const startY = targetRect.top + targetRect.height / 2;
  const endX = railRect.left - 8;
  const endY = railRect.top + 30;
  const bend = Math.max(36, (endX - startX) * 0.5);

  leaderPath.setAttribute(
    "d",
    `M ${startX} ${startY} C ${startX + bend} ${startY}, ${endX - bend} ${endY}, ${endX} ${endY}`,
  );
  leaderOrigin?.setAttribute("cx", String(startX));
  leaderOrigin?.setAttribute("cy", String(startY));
}

function placeRail(target) {
  if (!rail || !target || window.innerWidth <= 1152) return;

  const targetRect = target.getBoundingClientRect();
  const railHeight = rail.offsetHeight;
  const desiredTop = targetRect.top + targetRect.height / 2;
  const boundedTop = Math.min(
    window.innerHeight - railHeight / 2 - 24,
    Math.max(railHeight / 2 + 24, desiredTop),
  );

  rail.style.top = `${boundedTop}px`;
}

function activate(target) {
  if (!target) return;

  activeTarget = target;
  indexLabel.textContent = target.dataset.index || "·";
  annotationCopy.textContent = target.dataset.note || "A note in the margin.";
  placeRail(target);
  drawLeader(target);
}

function queueLayout() {
  if (frame) cancelAnimationFrame(frame);
  frame = requestAnimationFrame(() => {
    placeRail(activeTarget);
    drawLeader(activeTarget);
    frame = null;
  });
}

targets.forEach((target) => {
  target.addEventListener("pointerenter", () => activate(target));
  target.addEventListener("focus", () => activate(target));
});

window.addEventListener("resize", queueLayout, { passive: true });
window.addEventListener("scroll", queueLayout, { passive: true });

if (!reducedMotion.matches) {
  window.addEventListener(
    "pointermove",
    (event) => {
      if (!rail || window.innerWidth <= 1152) return;
      const offset = ((event.clientY / window.innerHeight) - 0.5) * 6;
      rail.style.transform = `translateY(calc(-50% + ${offset}px))`;
    },
    { passive: true },
  );
}

activate(activeTarget);
