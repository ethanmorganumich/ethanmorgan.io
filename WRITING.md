# Publishing blog notes

The new `/blog` is built from Markdown files explicitly copied into this repository's `posts/` directory. Do not point the builder at an Obsidian vault or traverse one automatically: copy only the note you intend to publish.

Each public post needs front matter like:

```md
---
published: true
title: A useful title
date: 2026-09-16
description: A short, plain-language summary.
slug: a-useful-title
---
```

`slug` may be omitted when the Markdown filename is already a safe lowercase slug. Drafts use `published: false` (or omit it) and are not emitted.

Keep private drafts in Obsidian: files committed to this public repository are visible in GitHub even when they are not emitted as blog pages.

Use standard Markdown links. For images or other public attachments, copy only the intended files into `assets/blog/` and reference them with root paths such as `![Descriptive alt text](/assets/blog/example.png)`. Obsidian wikilinks and vault attachments are not supported.

The site build calls `buildBlog({ outDir, siteUrl })` from `scripts/build-blog.mjs` after copying the legacy output into `outDir`. It writes the replacement `/blog/index.html`, published `/blog/<slug>/index.html` pages, and `/blog/feed.xml`. The build refuses to overwrite an existing post path, preserving legacy article HTML and assets until they are intentionally migrated.

To build and review locally:

```bash
npm ci
npm run build
npm run preview
```

Review generated output before committing or pushing. This workflow never commits or pushes automatically.

Open `http://127.0.0.1:4173/` for the built site. Commit the selected Markdown and attachments; Amplify builds and deploys `dist/` after a push. Do not commit `dist/` or the full vault. To unpublish a new post, set `published: false` and rebuild; the clean output excludes it. Keep slugs stable after publication.
