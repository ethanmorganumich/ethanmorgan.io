(function () {
  "use strict";

  const trigger = document.querySelector("#kinetic-phrase");
  const phrase = trigger?.querySelector(".phrase-text");
  const operationLabel = document.querySelector("#operation");
  const operationCount = document.querySelector("#operation-count");

  if (!trigger || !phrase || !operationLabel || !operationCount) return;

  const phrases = [
    "making machines easier to understand",
    "making ideas easier to understand",
    "making systems easier to understand",
    "making systems easier to trust",
  ];

  const PAUSE_BETWEEN_PHRASES = 5200;
  const CARET_STEP_DURATION = 72;
  const OPERATION_PREVIEW_DURATION = 240;
  const OPERATION_RESULT_DURATION = 300;

  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  let phraseIndex = 0;
  let currentText = phrases[phraseIndex];
  let timer = null;
  let editing = false;

  function wait(milliseconds) {
    return new Promise((resolve) => window.setTimeout(resolve, milliseconds));
  }

  function createEditPlan(source, target) {
    const rowCount = source.length + 1;
    const columnCount = target.length + 1;
    const costs = Array.from({ length: rowCount }, () => Array(columnCount).fill(0));

    for (let row = 0; row < rowCount; row += 1) costs[row][0] = row;
    for (let column = 0; column < columnCount; column += 1) costs[0][column] = column;

    for (let row = 1; row < rowCount; row += 1) {
      for (let column = 1; column < columnCount; column += 1) {
        const substitutionCost = source[row - 1] === target[column - 1] ? 0 : 1;
        costs[row][column] = Math.min(
          costs[row - 1][column] + 1,
          costs[row][column - 1] + 1,
          costs[row - 1][column - 1] + substitutionCost,
        );
      }
    }

    const operations = [];
    let row = source.length;
    let column = target.length;

    while (row > 0 || column > 0) {
      if (
        row > 0 &&
        column > 0 &&
        source[row - 1] === target[column - 1] &&
        costs[row][column] === costs[row - 1][column - 1]
      ) {
        operations.push({
          type: "keep",
          from: source[row - 1],
          to: target[column - 1],
        });
        row -= 1;
        column -= 1;
      } else if (
        row > 0 &&
        column > 0 &&
        costs[row][column] === costs[row - 1][column - 1] + 1
      ) {
        operations.push({
          type: "substitute",
          from: source[row - 1],
          to: target[column - 1],
        });
        row -= 1;
        column -= 1;
      } else if (row > 0 && costs[row][column] === costs[row - 1][column] + 1) {
        operations.push({ type: "delete", from: source[row - 1] });
        row -= 1;
      } else {
        operations.push({ type: "insert", to: target[column - 1] });
        column -= 1;
      }
    }

    return {
      distance: costs[source.length][target.length],
      operations: operations.reverse(),
    };
  }

  function characterNode(character, state) {
    const node = document.createElement("span");
    node.className = `active-character${state === "removing" ? " is-removing" : ""}`;
    node.textContent = character === " " ? "\u00a0" : character;
    node.setAttribute("aria-hidden", "true");
    return node;
  }

  function render(buffer, caretPosition, options = {}) {
    const before = document.createTextNode(buffer.slice(0, caretPosition).join(""));
    const afterStart = options.activeIndex === caretPosition ? caretPosition + 1 : caretPosition;
    const after = document.createTextNode(buffer.slice(afterStart).join(""));
    const nodes = [before];

    if (options.showCaret !== false) {
      const caret = document.createElement("span");
      caret.className = "caret";
      caret.setAttribute("aria-hidden", "true");
      nodes.push(caret);
    }

    if (options.activeIndex === caretPosition && buffer[caretPosition] !== undefined) {
      nodes.push(characterNode(buffer[caretPosition], options.activeState));
    }

    nodes.push(after);
    phrase.replaceChildren(...nodes);
  }

  function describeCharacter(character) {
    return character === " " ? "space" : `“${character}”`;
  }

  function describeOperation(operation) {
    if (operation.type === "insert") return `insert ${describeCharacter(operation.to)}`;
    if (operation.type === "delete") return `delete ${describeCharacter(operation.from)}`;
    return `substitute ${describeCharacter(operation.from)} → ${describeCharacter(operation.to)}`;
  }

  function updateAccessibleName(text) {
    trigger.setAttribute(
      "aria-label",
      `Change interest. Current interest: ${text}.`,
    );
  }

  function setRestingState(distance = "—") {
    operationLabel.textContent = "resting";
    operationCount.textContent = `edit distance ${distance}`;
  }

  async function transformTo(nextText) {
    if (editing) return;
    editing = true;
    window.clearTimeout(timer);
    trigger.classList.add("is-editing");

    const plan = createEditPlan(currentText, nextText);

    if (reduceMotion.matches) {
      currentText = nextText;
      phrase.textContent = currentText;
      updateAccessibleName(currentText);
      setRestingState(plan.distance);
      trigger.classList.remove("is-editing");
      editing = false;
      return;
    }

    const buffer = Array.from(currentText);
    const edits = plan.operations.filter((operation) => operation.type !== "keep");
    let completedEdits = 0;
    let position = 0;

    operationCount.textContent = `edit distance ${plan.distance}`;
    render(buffer, position);
    await wait(OPERATION_PREVIEW_DURATION);

    for (const operation of plan.operations) {
      if (operation.type === "keep") {
        position += 1;
        render(buffer, position);
        await wait(CARET_STEP_DURATION);
        continue;
      }

      completedEdits += 1;
      operationLabel.textContent = describeOperation(operation);
      operationCount.textContent = `${completedEdits} / ${edits.length}`;

      if (operation.type === "delete" || operation.type === "substitute") {
        render(buffer, position, {
          activeIndex: position,
          activeState: "removing",
        });
        await wait(OPERATION_PREVIEW_DURATION);
      }

      if (operation.type === "delete") {
        buffer.splice(position, 1);
        render(buffer, position);
      } else if (operation.type === "insert") {
        buffer.splice(position, 0, operation.to);
        render(buffer, position, { activeIndex: position, activeState: "added" });
        position += 1;
      } else {
        buffer[position] = operation.to;
        render(buffer, position, { activeIndex: position, activeState: "added" });
        position += 1;
      }

      await wait(OPERATION_RESULT_DURATION);
      render(buffer, position);
    }

    currentText = nextText;
    phrase.textContent = currentText;
    updateAccessibleName(currentText);
    setRestingState(plan.distance);
    trigger.classList.remove("is-editing");
    editing = false;
    scheduleNext();
  }

  function nextPhrase() {
    if (editing) return;
    phraseIndex = (phraseIndex + 1) % phrases.length;
    transformTo(phrases[phraseIndex]);
  }

  function scheduleNext() {
    window.clearTimeout(timer);
    if (reduceMotion.matches || trigger.matches(":hover, :focus")) return;
    timer = window.setTimeout(nextPhrase, PAUSE_BETWEEN_PHRASES);
  }

  trigger.addEventListener("click", nextPhrase);
  trigger.addEventListener("pointerenter", () => window.clearTimeout(timer));
  trigger.addEventListener("pointerleave", scheduleNext);
  trigger.addEventListener("focus", () => window.clearTimeout(timer));
  trigger.addEventListener("blur", scheduleNext);
  reduceMotion.addEventListener("change", scheduleNext);

  scheduleNext();
})();
