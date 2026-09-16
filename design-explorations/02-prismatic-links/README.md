# Concept 02: Prismatic Links

This is an intentionally minimal personal directory built around one behavior: links appear to refract light when they are approached.

## Vibe

- A compact editorial split layout: identity on the left, current work on the right
- Enough information to understand the person and browse their work in one viewport
- Large, literary typography paired with quiet utility text
- Restrained washes of blue, violet, rose, gold, and mint
- Fictional placeholder writing and experiment titles
- Personal and slightly curious, without looking like an app or an AI dashboard

## The delightful detail

Every link is a small prism. Hovering tracks the pointer across the link and shifts the origin of a blurred spectrum beneath it. Keyboard focus receives the same color treatment from the center. Clicking with a pointer releases one subtle refraction ring.

The interaction is intentionally most visible in three places: the color atmosphere surrounding “thinking clearly,” the primary navigation links, and the full-row color wash on “On patient tools.” The rest of the directory remains quiet, so the refracted light feels responsive rather than decorative.

JavaScript only adds pointer tracking and the click echo. The links, layout, hover state, focus indicator, anchors, and email action remain useful if JavaScript is unavailable. Motion is effectively removed when the operating system requests reduced motion.

## Files

- `index.html` — semantic single-page structure and fictional content
- `styles.css` — responsive layout, color system, and interaction states
- `script.js` — small progressive enhancement for pointer position and click feedback

Open `index.html` directly in a browser. There is no build step or dependency installation.
