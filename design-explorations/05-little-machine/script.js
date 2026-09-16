const machine = document.querySelector(".machine");
const machineLinks = document.querySelectorAll("[data-machine]");
const caption = document.querySelector("[data-machine-caption]");
const display = document.querySelector(".message-window text");

const machineStates = {
  read: { caption: "finding a page", display: "NOTE" },
  tinker: { caption: "thinking it over", display: "HMM" },
  hello: { caption: "waving back", display: "HI" },
};

let activeLink = null;

function setMachineState(link) {
  if (!machine || !caption || !display || !link) return;

  const state = link.dataset.machine;
  const copy = machineStates[state];
  if (!copy) return;

  activeLink = link;
  machine.dataset.state = state;
  caption.textContent = copy.caption;
  display.textContent = copy.display;
}

function resetMachineState(link) {
  if (!machine || !caption || !display || activeLink !== link) return;

  activeLink = null;
  machine.dataset.state = "idle";
  caption.textContent = "resting";
  display.textContent = "...";
}

function nudgeMachine() {
  if (!machine) return;

  machine.classList.remove("is-clicked");
  requestAnimationFrame(() => machine.classList.add("is-clicked"));
}

machineLinks.forEach((link) => {
  link.addEventListener("pointerenter", () => setMachineState(link));
  link.addEventListener("pointerleave", () => {
    if (document.activeElement !== link) resetMachineState(link);
  });
  link.addEventListener("focus", () => setMachineState(link));
  link.addEventListener("blur", () => resetMachineState(link));
  link.addEventListener("click", nudgeMachine);
});

machine?.addEventListener("animationend", () => {
  machine.classList.remove("is-clicked");
});
