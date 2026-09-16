# ethanmorgan.io — approved design

Approved September 16, 2026. The reference implementation was `design-explorations/08-centered-index/`, saved in checkpoint commit `c2a0fd7`. Its homepage, blog index, and article layout are the basis of the production migration. Earlier experiments remain available in Git history.

## 1. Infrastructure and publishing

The site is static HTML, CSS, JavaScript, images, and PDFs, maintained in `ethanmorganumich/ethanmorgan.io`. The existing Amplify configuration builds a dedicated `dist/` directory; this migration retains the existing domain and hosting. DNS and production redirect settings live outside this repository.

The historical blog is Quartz-generated HTML. Preserve its article files and assets at their existing URLs. The new blog is built independently from explicitly selected Markdown files in `posts/`; only posts marked `published: true` are listed or rendered. Obsidian can remain the editor, but the build must not traverse a vault or publish arbitrary notes. See [WRITING.md](WRITING.md).

## 2. Visual requirements

- A compact document, not a portfolio landing page.
- A centered main column, up to 34rem wide, with left-aligned text.
- Inter body text at 16px, normal weight, comfortable paragraph spacing; modest names and headings.
- Almost-white paper (`#fefdfb`), dark ink (`#292826`), quiet metadata.
- Fixed far-left section index on desktop, near the top of the document; compact inline navigation on mobile.
- Numbered labels such as `01 / About`; the active number is red and its label darkens as the reader scrolls.
- Few dividing rules. Sections flow at full column width without redundant labels or split heading columns.
- No large hero, rainbow links, photographs, or decorative background effects in this version.

## 3. Interaction requirements

Links have a cursor-following effect in shades of blue and an animated underline. The full link stays colored on hover, including long links. Keyboard focus remains usable.

An inline sentence changes through a real Levenshtein edit path. The caret moves through the string; deletions appear as backspaces; replacements appear as backspace and typing. Direction alternates so the next change begins where the last one ended. Use the larger red caret (3px wide, 1.15em tall). No strikethroughs or operation labels. The sentence stays readable without waiting for the animation, and reduced motion keeps it static.

## 4. Content and routes

| Area | Purpose |
| --- | --- |
| `/` | Short factual introduction, essential links, recent work, and the public blog. |
| `/blog/` | New public technical writing index, starting empty. |
| `/blog/<slug>/` | New articles with the same document style, headings, code blocks, and numbered table of contents. |
| Existing Quartz article URLs | Older posts, preserved but not automatically listed in the new blog. |
| `/blog/archive.html` | Preserved original blog landing page. |
| `/v2/` | Original portfolio with its assets and original resume. |
| `/resume.pdf` | Current resume. |
| `/gpu-calculator/` | Existing GPU Payback Lab, preserved. |

Use existing factual biography and project information. The layout sample “A cursor with a memory” is an example, not an approved public post. Keep the new blog free of sample and old content until a post is explicitly selected.

Public blog posts address anyone interested in the subject. Future letters would address particular people and be shared by direct link. An unlisted letter would not be private. Letters are not part of this migration.

## 5. Inspiration

| Reference | What informed the design |
| --- | --- |
| [benji.org](https://benji.org/) | An ordinary, readable personal introduction with playful code-driven details. |
| [Drawesome](https://benji.org/drawesome) | Color used deliberately in small interactions. The final links use one blue family rather than the earlier multicolor treatment. |
| [rajan.sh](https://www.rajan.sh/) | A confident individual voice. |
| [ped.ro](https://ped.ro/) | Separation between the personal front door and writing. |
| [nat.org](https://nat.org/) | Simplicity, while avoiding its harsher tone. |
| [sasi.codes](https://sasi.codes/) | Permission for something personal and unexpected. |
| Unidentified Michigan PhD site | A memorable character-editing sentence rather than erase-and-retype animation. |

## 6. Delivery requirements

Preserve legacy article URLs and the original portfolio, verify internal links and assets, support keyboard access and reduced motion, and generate only intended public files into `dist/`. Use the existing GitHub/Amplify deployment flow. Remove superseded experiments and obsolete publishing scripts after saving their history.

See [MIGRATION.md](MIGRATION.md) for the approved scope and migration state.

## 7. Deferred

- Unlisted letters and their naming.
- An alternate `.me` domain.
- Photography once suitable images are chosen.
- Time-of-day colors, with a manual override if implemented.
- Choosing among the four retained favicon concepts.
- Rich interactive article embeds beyond the initial Markdown publishing workflow.

JavaScript and frameworks are allowed. The implementation should stay as small as the chosen experience needs.
