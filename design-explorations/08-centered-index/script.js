(() => {
  const indexLinks = [...document.querySelectorAll('.index nav a')];
  const sections = indexLinks.map((link) => document.querySelector(link.hash));

  function updateIndex() {
    const readingLine = window.innerHeight * 0.3;
    let activeIndex = 0;

    sections.forEach((section, index) => {
      if (section.getBoundingClientRect().top <= readingLine) activeIndex = index;
    });

    const scrollHeight = document.documentElement.scrollHeight;
    if (scrollHeight > window.innerHeight && window.scrollY + window.innerHeight >= scrollHeight - 2) {
      activeIndex = sections.length - 1;
    }

    indexLinks.forEach((link, index) => {
      if (index === activeIndex) link.setAttribute('aria-current', 'location');
      else link.removeAttribute('aria-current');
    });
  }

  window.addEventListener('scroll', updateIndex, { passive: true });
  window.addEventListener('resize', updateIndex);
  window.addEventListener('load', updateIndex);
  updateIndex();

  document.querySelectorAll('.tracking-link').forEach((link) => {
    link.addEventListener('pointermove', (event) => {
      const bounds = link.getBoundingClientRect();
      const x = event.clientX - bounds.left;
      const y = event.clientY - bounds.top;
      const radius = Math.hypot(Math.max(x, bounds.width - x), Math.max(y, bounds.height - y));
      link.style.setProperty('--x', `${x}px`);
      link.style.setProperty('--y', `${y}px`);
      link.style.setProperty('--radius', `${radius}px`);
    });
  });

  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  const before = document.querySelector('.phrase-before');
  const after = document.querySelector('.phrase-after');
  if (!before || !after) return;

  const phrases = [
    'useful software',
    'humane systems',
    'tools that last',
    'clearer interfaces',
  ];
  const pause = (milliseconds) => new Promise((resolve) => window.setTimeout(resolve, milliseconds));

  let phraseIndex = 0;
  let value = phrases[phraseIndex];
  let caret = value.length;
  let isReversing = true;

  function render() {
    before.textContent = value.slice(0, caret);
    after.textContent = value.slice(caret);
  }

  function forwardPath(source, target) {
    const rows = source.length + 1;
    const columns = target.length + 1;
    const distance = Array.from({ length: rows }, () => Array(columns).fill(0));

    for (let i = source.length; i >= 0; i -= 1) distance[i][target.length] = source.length - i;
    for (let j = target.length; j >= 0; j -= 1) distance[source.length][j] = target.length - j;

    for (let i = source.length - 1; i >= 0; i -= 1) {
      for (let j = target.length - 1; j >= 0; j -= 1) {
        if (source[i] === target[j]) {
          distance[i][j] = distance[i + 1][j + 1];
        } else {
          distance[i][j] = 1 + Math.min(
            distance[i + 1][j + 1],
            distance[i + 1][j],
            distance[i][j + 1],
          );
        }
      }
    }

    const operations = [];
    let i = 0;
    let j = 0;

    while (i < source.length || j < target.length) {
      if (i < source.length && j < target.length && source[i] === target[j]) {
        operations.push({ type: 'move' });
        i += 1;
        j += 1;
      } else if (i < source.length && j < target.length && distance[i][j] === 1 + distance[i + 1][j + 1]) {
        operations.push({ type: 'replace', character: target[j] });
        i += 1;
        j += 1;
      } else if (i < source.length && distance[i][j] === 1 + distance[i + 1][j]) {
        operations.push({ type: 'delete' });
        i += 1;
      } else {
        operations.push({ type: 'insert', character: target[j] });
        j += 1;
      }
    }

    return operations;
  }

  function reversePath(source, target) {
    const rows = source.length + 1;
    const columns = target.length + 1;
    const distance = Array.from({ length: rows }, () => Array(columns).fill(0));

    for (let i = 0; i <= source.length; i += 1) distance[i][0] = i;
    for (let j = 0; j <= target.length; j += 1) distance[0][j] = j;

    for (let i = 1; i <= source.length; i += 1) {
      for (let j = 1; j <= target.length; j += 1) {
        if (source[i - 1] === target[j - 1]) {
          distance[i][j] = distance[i - 1][j - 1];
        } else {
          distance[i][j] = 1 + Math.min(
            distance[i - 1][j - 1],
            distance[i - 1][j],
            distance[i][j - 1],
          );
        }
      }
    }

    const operations = [];
    let i = source.length;
    let j = target.length;

    while (i > 0 || j > 0) {
      if (i > 0 && j > 0 && source[i - 1] === target[j - 1]) {
        operations.push({ type: 'move' });
        i -= 1;
        j -= 1;
      } else if (i > 0 && j > 0 && distance[i][j] === 1 + distance[i - 1][j - 1]) {
        operations.push({ type: 'replace', character: target[j - 1] });
        i -= 1;
        j -= 1;
      } else if (i > 0 && distance[i][j] === 1 + distance[i - 1][j]) {
        operations.push({ type: 'delete' });
        i -= 1;
      } else {
        operations.push({ type: 'insert', character: target[j - 1] });
        j -= 1;
      }
    }

    return operations;
  }

  async function moveRight() {
    caret += 1;
    render();
    await pause(95);
  }

  async function moveLeft() {
    caret -= 1;
    render();
    await pause(95);
  }

  async function backspace() {
    value = `${value.slice(0, caret - 1)}${value.slice(caret)}`;
    caret -= 1;
    render();
    await pause(185);
  }

  async function type(character) {
    value = `${value.slice(0, caret)}${character}${value.slice(caret)}`;
    caret += 1;
    render();
    await pause(200);
  }

  async function transform(target) {
    const operations = isReversing ? reversePath(value, target) : forwardPath(value, target);

    for (const operation of operations) {
      if (isReversing) {
        if (operation.type === 'move') await moveLeft();
        if (operation.type === 'delete') await backspace();
        if (operation.type === 'replace') {
          await backspace();
          await type(operation.character);
          await moveLeft();
        }
        if (operation.type === 'insert') {
          await type(operation.character);
          await moveLeft();
        }
      } else {
        if (operation.type === 'move') await moveRight();
        if (operation.type === 'delete') {
          await moveRight();
          await backspace();
        }
        if (operation.type === 'replace') {
          await moveRight();
          await backspace();
          await type(operation.character);
        }
        if (operation.type === 'insert') await type(operation.character);
      }
    }

    isReversing = !isReversing;
  }

  async function cycle() {
    while (true) {
      await pause(4300);
      phraseIndex = (phraseIndex + 1) % phrases.length;
      await transform(phrases[phraseIndex]);
    }
  }

  render();
  cycle();
})();
