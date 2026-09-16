# Approved migration — September 16, 2026

## Requirements

The approved visual reference is `design-explorations/08-centered-index/`, including its new blog index and example article. Use its compact, centered, left-aligned document column, Inter typography, near-white background, dark ink, fixed desktop index, compact mobile navigation, red active section number, blue cursor-following links, animated underlines, and inline Levenshtein animation with a larger red caret. Preserve actual minimal character edits, backspace behavior, continuous caret position, and reduced-motion support.

The homepage contains a short factual introduction, essential links, recent work, and the blog link. No large hero, rainbow links, photographs, or time-based palette. Existing biography and resume remain the content source; do not invent new employment facts.

Build a fresh public Markdown blog, not a Quartz reskin. Support headings, code blocks, links, and a section index. Keep Obsidian as an optional authoring environment and publish only explicitly selected Markdown files. Start the public index empty: neither old posts nor the design's example article are automatically published.

## Final routes

| Route | Final role |
| --- | --- |
| `/` | Approved personal homepage. |
| `/blog/` | Fresh public blog index. |
| `/blog/<slug>/` | New explicitly published articles. |
| Existing `/blog/*.html` and nested article paths | Preserved legacy content, outside the new post index. |
| `/v2/` | Original portfolio with its original assets and resume. |
| `/resume.pdf` | Current resume. |

Preserve the old blog landing page as an archive entry point without changing the paths of existing articles. Do not ship the rejected root refresh or the experimental `/writing/` frontend. Keep the existing domain and hosting; no DNS or platform migration is requested.

## Publishing and verification

- New authoring uses portable Markdown and an explicit publish selection; never copy an entire Obsidian vault into public output.
- Generate a dedicated static deployment directory containing only intended public files. Source documents, private notes, dependencies, experiments, and publishing scripts are excluded.
- Preserve legacy article HTML/assets and the original portfolio. New builds must not erase or overwrite legacy article paths.
- Verify routes, local assets, navigation targets, generated articles, reduced-motion handling, and the production build before committing and pushing.
- Check in the approved design and requirements as a checkpoint first. After migration, remove superseded local prototypes and obsolete build paths; their history remains in Git.
- Pushing the final migration is authorized. Do not equate a successful push with a confirmed production deployment.

## Deferred

Unlisted letters for particular people, alternate domains, photos, time-based colors, and publishing the example essay are outside this migration. Unlisted letters would be public to anyone with their link.

## Status

Requirements approved. Implementation and final verification follow the design checkpoint commit.
