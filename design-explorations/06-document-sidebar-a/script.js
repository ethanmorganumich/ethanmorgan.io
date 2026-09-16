(() => {
  const phrase = document.querySelector('.changing-phrase');
  const glow = document.querySelector('.link-glow');
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const phrases = ['small surprises', 'clear beginnings', 'quiet confidence', 'room to wander'];

  let current = 0;

  const pause = (ms) => new Promise((resolve) => window.setTimeout(resolve, ms));

  async function replacePhrase(next) {
    while (phrase.textContent) {
      phrase.textContent = phrase.textContent.slice(0, -1);
      await pause(45);
    }
    await pause(280);
    for (const character of next) {
      phrase.textContent += character;
      await pause(62);
    }
  }

  async function cyclePhrases() {
    while (true) {
      await pause(4800);
      current = (current + 1) % phrases.length;
      await replacePhrase(phrases[current]);
    }
  }

  if (!reduceMotion.matches) cyclePhrases();

  document.querySelectorAll('.color-link').forEach((link) => {
    link.addEventListener('pointerenter', () => document.body.classList.add('is-linking'));
    link.addEventListener('pointerleave', () => document.body.classList.remove('is-linking'));
  });

  window.addEventListener('pointermove', (event) => {
    glow.style.left = `${event.clientX}px`;
    glow.style.top = `${event.clientY}px`;
  });
})();
