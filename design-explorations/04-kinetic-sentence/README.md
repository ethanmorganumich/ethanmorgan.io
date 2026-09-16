# 04 — Kinetic sentence

A deliberately spare, single-screen personal-site concept built around one computational detail.

## The idea

The title and introduction never move or change. Only the final interest phrase is editable, and
its line reserves enough space for every phrase so the page does not jump during a transformation.
There are no work grids, biography sections, project lists, or conventional portfolio structures.

This explores the remembered Michigan PhD-site reference as one possible design direction rather
than a requirement for the eventual site. All details and links are fictional placeholders.

## The actual algorithm

`createEditPlan(source, target)` builds the complete dynamic-programming matrix for Levenshtein
distance. Each cell stores the cheapest cost among deletion, insertion, and substitution; matching
characters have zero substitution cost. The code backtracks from the bottom-right cell to produce
one minimal character-level operation sequence, then reverses that sequence for playback.

Playback walks across unchanged characters and performs only the plan's edits. A character that is
about to be deleted or substituted is shown with a strike-through; an inserted or substituted
character is highlighted after it appears. A quiet status line names every operation and counts
progress through the minimum edit distance.

Timing is intentionally legible:

- 5.2-second rest between complete phrases
- 72 ms for the caret to cross each preserved character
- 240 ms preview before removing or substituting a character
- 300 ms to show each operation's result

Clicking or keyboard-activating the phrase advances it manually. Hover and focus pause the resting
timer. With reduced motion enabled, activation swaps phrases immediately and automatic playback is
disabled. Without JavaScript, the first phrase and the complete page remain readable.

## Run locally

No build step or dependencies are required. Serve this directory with any static server, or open
`index.html` directly in a browser.

## Files

- `index.html` — the one-screen structure and fictional copy
- `styles.css` — fixed editing space, responsive layout, and operation states
- `script.js` — Levenshtein matrix, minimal-path backtracking, and playback
