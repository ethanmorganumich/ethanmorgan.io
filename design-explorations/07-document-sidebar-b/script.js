(() => {
  const links = document.querySelectorAll('.tracking-link');
  links.forEach((link) => {
    link.addEventListener('pointermove', (event) => {
      const box = link.getBoundingClientRect();
      link.style.setProperty('--x', `${event.clientX - box.left}px`);
      link.style.setProperty('--y', `${event.clientY - box.top}px`);
    });
  });

  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  const phrase = document.querySelector('.phrase');
  if (!phrase) return;
  const phrases = JSON.parse(phrase.dataset.phrases || '[]');
  let current = phrase.textContent;
  let index = 0;

  const transform = (next) => {
    let shared = 0;
    while (shared < current.length && shared < next.length && current[shared] === next[shared]) shared += 1;
    const erase = () => {
      if (current.length > shared) {
        current = current.slice(0, -1);
        phrase.textContent = current;
        window.setTimeout(erase, 54);
      } else type();
    };
    const type = () => {
      if (current.length < next.length) {
        current += next[current.length];
        phrase.textContent = current;
        window.setTimeout(type, 78);
      } else {
        index = (index + 1) % phrases.length;
        window.setTimeout(() => transform(phrases[index]), 4200);
      }
    };
    erase();
  };

  if (phrases.length > 1) window.setTimeout(() => transform(phrases[1]), 2800);
})();
