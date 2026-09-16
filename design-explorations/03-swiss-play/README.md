# Concept 03: Swiss Play

This is a local, build-free design exploration for a personal site. Open `index.html` in a browser or serve the directory with any static file server.

## Visual idea

The concept borrows from Swiss editorial design rather than portfolio conventions:

- a strict four-column grid;
- oversized, tightly set typography;
- an off-white paper tone with signal red and cobalt accents;
- compact, index-like project and note listings;
- thin rules and coded labels instead of cards, gradients, or dashboard surfaces.

All names, projects, dates, and contact details are fictional placeholders.

## Interaction: live annotation rail

On larger screens, hovering or focusing an annotated phrase or link activates a marginal note. JavaScript:

1. reads the item's short note and index code;
2. positions a small editorial annotation in the right margin;
3. draws a responsive SVG leader from the selected item to that note.

The interaction is intentionally secondary. The content, links, and hierarchy remain complete with JavaScript disabled. Keyboard focus triggers the same behavior as pointer hover. The connecting layer is removed on narrower screens, where it would compete with reading space, and the tiny ambient movement is disabled when reduced motion is preferred.

## Files

- `index.html` — semantic page structure and placeholder content
- `styles.css` — responsive editorial system and interaction states
- `script.js` — annotation activation, positioning, and SVG leader drawing

There are no dependencies and no build step.
