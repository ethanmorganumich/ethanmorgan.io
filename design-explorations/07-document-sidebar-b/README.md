# Document sidebar — draft B

Open `index.html` directly in a browser; no build step is required.

This second direction treats the site as an asymmetric editorial document rather than a centered personal landing page. A slim, far-left index stays visible on desktop, while section numbers and labels live in a narrow document margin beside a reading-width column. The typographic rhythm is denser and more archival than Draft A, but the page stays deliberately small: introduction, essential links, recent work, and writing.

The palette uses only near-white paper, dark ink, and a restrained rust accent. There are no photo slots, cards, doodles, notebook rules, time-based theme behavior, or decorative color fields.

`script.js` adds two progressive enhancements:

- Important links reveal rust color around the pointer position. Without JavaScript they remain ordinary, accessible underlined links.
- The intro phrase waits, then visibly backspaces and types its next wording. It never uses strike-throughs or process labels. The initial phrase is present in the HTML, and the animation is skipped for `prefers-reduced-motion`.

Responsive CSS converts the persistent index to a compact inline document index below 720px. Keyboard focus is visible through normal browser focus styling, and the skip link bypasses the index.
