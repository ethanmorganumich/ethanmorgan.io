# ethanmorgan.io — design brief

This is a working document for deciding what the next version of the personal site should be. It records facts, goals, references, and open questions. It does **not** prescribe a visual design, domain migration, or interaction before those decisions are made.

## 1. Current system status

### Hosting and infrastructure

| Layer | Current state |
| --- | --- |
| Source control | GitHub repository: `ethanmorganumich/ethanmorgan.io`. |
| Build/deploy | AWS Amplify is configured through `amplify.yml`. It runs `npm ci` and publishes the repository root as static artifacts. |
| Delivery | `ethanmorgan.io` redirects to `www.ethanmorgan.io`. The public site is served from Amazon S3 behind Amazon CloudFront. |
| Application architecture | Static HTML, CSS, JavaScript, images, and PDFs. No server-side application, database, or CMS is defined in this repository. |
| DNS | DNS configuration is not represented in the repository. A future `.me` domain would need its own purchase, DNS, redirect, and canonical-URL plan. |

### Current routes and transition state

| Route | Role |
| --- | --- |
| `/` | The currently public legacy homepage. A prior refresh prototype exists locally but is not the agreed next design and should not be treated as the base. |
| `/blog/` | Existing Quartz-generated public blog and its established URLs. |
| `/v2/` | The preserved version of the old portfolio, staged for the next deployment as a historical reference. |
| `/writing/` | A staged experiment in a more intentional technical-writing front door. Its eventual role should be reconsidered in light of the public-blog versus directed-writing distinction below. |

The old site should be preserved at `/v2/` when a genuinely new design is ready. History is useful, but it is not a design constraint for the new homepage.

### Current blog and writing workflow

The blog is a static Quartz site, not a hosted editor or database-backed CMS.

1. Notes are authored as Markdown in Ethan's Obsidian workspace (`Ethan's Workspace/ethanmorgan.io`).
2. A sibling Quartz repository reads those notes through a local symlink and renders static HTML.
3. The legacy build script generates the existing `/blog/` output.
4. Generated files are committed with the site and served as static assets.

Characteristics of the current blog:

- **Obsidian-native:** writing begins in the environment Ethan already uses to think and take notes.
- **Markdown-first:** notes remain portable, durable, and owned rather than locked into a publishing service.
- **Static:** pages are fast and inexpensive to host, with no runtime backend.
- **Quartz-shaped:** tags, indexes, generated navigation, and digital-garden page chrome make the blog feel like a separate product.
- **Build-time publishing:** publishing requires generating the static site, committing the generated output, and deploying it.

The likely direction is to preserve **Obsidian for authoring, Markdown for ownership, and static files for publishing**. The unresolved question is whether Quartz should remain the reader-facing experience or become a quiet build tool underneath a more custom writing site.

### Two kinds of publishing

| Kind | Intent | Audience and distribution |
| --- | --- | --- |
| **Blog** | “I made, learned, or noticed this—anyone interested can read it.” | Public, discoverable, and appropriate for technical notes, projects, and broadly useful ideas. `/blog/` is the natural home. |
| **Letters / directed writing** | “I want to explain this more fully to people I care about.” | Written for a particular group and shared with a direct link, such as in a short email or text. The full letter lives on the site; the message is simply the invitation. |

The second category is intentionally shared, not private. A static link can be unlisted from navigation and search indexes, but anyone with it can forward it. Material that needs real confidentiality belongs in a protected document or a different system.

## 2. Goals

The next personal site should:

- Feel simple, personal, and considered.
- Make Ethan's work and writing easy to understand.
- Include at least one moment of genuine delight—something built with code that feels worth discovering.
- Feel like something Ethan is proud to send people.
- Stay fast, legible, accessible, and calm on both desktop and mobile.
- Make the writing experience feel connected to the personal site without forcing writing onto the homepage.

## 3. Requirements

### Must

- Preserve the current site at `/v2/` when the new site is deployed.
- Preserve existing `/blog/` URLs.
- Support a public home for technical writing.
- Support intentionally shared, direct-address writing without forcing it into the public blog.
- Respect reduced-motion preferences and never make essential content depend on an animation completing.
- Avoid a generic portfolio, dashboard, or AI-product-marketing feel.
- Keep the homepage concise; content should have room to breathe.

### Should

- Have a visually excellent but restrained interface.
- Add delight without adding product complexity: a playful link, a small drawing, or another light code-driven detail is enough.
- Use a narrow, document-like main column with a small sidebar that remains visible while scrolling on desktop.
- Make it clear, quickly, who Ethan is, what he cares about, and where to find his writing.
- Be easy to evolve as work, writing, and life change.

### Could

- Use a shorter personal domain such as `ethan.me` or `ethanmorgan.me` as a future primary domain, with `.io` redirecting permanently.
- Include an unlisted letters area for intentionally shared, public-but-not-promoted writing.
- Include small experiments or side projects when they support the personal character of the site.

### Not decided

- The primary domain (`.io` versus `.me`).
- Whether a framework helps the site enough to justify its added build/runtime surface.
- The exact typography and final accent colors.
- Whether the cursor-following links and slow text transition are enough, or whether the page needs one additional delightful detail.
- Whether Quartz remains visibly present in the public writing experience.
- Whether the directed-writing area should be called `letters`, `writing`, or something else.
- The exact amount of work history or project detail that belongs on the homepage.

## 4. Design inspiration

These references are prompts for observation, not pages to imitate.

| Reference | What feels compelling | What to avoid copying |
| --- | --- | --- |
| [rajan.sh](https://www.rajan.sh/) | A personal site that reads with confidence and feels authored by an individual. | Extra visual material that competes with the writing. |
| [benji.org](https://benji.org/) | A simple surface made memorable by playful, code-driven interactions. | Making every element interactive or turning the site into a toybox. |
| [nat.org](https://nat.org/) | Strong typographic hierarchy and conviction. | Its harsher, more brutalist tone. |
| [ped.ro](https://ped.ro/) | A clear separation between a personal front door and a focused writing space. | Making the two spaces feel unrelated. |
| [sasi.codes](https://sasi.codes/) | Permission for an unexpected, personal, clever detail. | Letting novelty obscure the person or the work. |
| Michigan PhD site (to find again) | A restrained text transformation that made a simple introduction feel computational and memorable. | Treating its exact typing/editing mechanic as a requirement before evaluating other ideas. |

## 5. Design principles

- **One beautiful idea, executed simply.** One memorable detail is more valuable than many decorative ones.
- **Delight without complexity.** Prefer a playful link or a little drawing over an elaborate interactive system.
- **Signal over surface area.** The site should say a lot with very little.
- **Personality through behavior.** A small interaction can reveal more character than a pile of visual effects.
- **Content first.** Interaction should never hide, delay, or compete with the actual writing and work.
- **Long-lived rather than trendy.** The site should still feel good and usable in a few years.
- **History is a feature.** Old work can be preserved without dictating what comes next.

## 6. Interaction playground

The memorable interaction is deliberately open. These are candidate directions, not commitments:

- A sentence or annotation that transforms through visible edits.
- Links that behave in a pleasant, physical, or surprising way.
- A small illustrated or generative detail near an important part of the page.
- An interactive explanation of a concept Ethan genuinely cares about.
- A playful side experiment that exists simply because it is fun.

Any candidate should be judged by the same questions:

1. Does it feel personal rather than generic?
2. Is it pleasant without being distracting?
3. Does the site remain complete and readable without it?
4. Would Ethan still enjoy it after seeing it for two years?
5. Does it belong on this site, rather than being a separate experiment?

## 7. Information architecture

The homepage should feel like a well-typeset document rather than a conventional landing page. On desktop, a narrow sticky sidebar acts as the document index while the main column scrolls. On smaller screens, the index should collapse into a compact inline navigation element rather than consume permanent horizontal space.

The current layout direction is more specific:

- The document is a genuinely centered, slightly narrower reading column with generous space on both sides.
- All document text remains left-aligned; “centered” describes the column, not its typography.
- The index stays near the far-left edge and is vertically centered on desktop.
- Index labels use the compact `01 / About` pattern and a small monospaced face.
- Sections flow in one column. Do not spend a third of the document width on a section label beside content, and do not pair a label with a redundant heading that restates it.
- Use rules selectively for list structure, not as the main way to communicate every division on the page.

The initial structure should be small:

| Area | Purpose |
| --- | --- |
| Home | A concise introduction and the clearest routes into the rest of the site. |
| Blog | Public technical notes, projects, and broadly useful ideas. |
| Archive | The prior site at `/v2/`, plus legacy blog material at `/blog/`. |
| Letters / directed writing (optional) | Unlisted, direct-address writing for an intended group. A direct URL is unlisted, not private. |

Work/project detail can live on the homepage, in writing, or behind a single route. It does not need to become a large portfolio section by default.

The homepage itself should contain a concise introduction, a short personal blurb, essential links, one delightful interaction, and a small list of recent work or writing. It should be medium-length: more substantial than a splash page, but short enough to understand without a long portfolio scroll.

## 8. First build: bare bones

The next implementation should be a small homepage, not a full system:

1. Establish the visual foundation: precise type, dense but comfortable spacing, a near-white or very light warm background, and dark ink.
2. Build the document layout with a sticky desktop index and a focused central reading column.
3. Add a concise introduction, personal blurb, links, and a short list of recent things.
4. Preserve the cursor-following color response on important links, and consider a restrained animated underline as part of the same interaction.
5. Implement the changing phrase as a true Levenshtein edit path. The caret should move through matching characters and perform only the required insertions, deletions, and replacements. Use typing and backspace behavior rather than a forward delete; alternate direction between transitions so the caret begins each one where the prior transformation finished. It should be slow enough to follow, while showing no strike-throughs, operation labels, or algorithm visualization.
6. Keep the current public blog intact while deciding what its future reader experience should be.

The current typography direction is a compact Inter-led system, inspired by Benji's editorial surface. Use weight, scale, and spacing for hierarchy rather than mixing serif and monospaced families. Keep the page mostly white and ink-like; use a vivid blue, green, yellow, and red palette only inside small interactions such as link exploration.

Photography is intentionally excluded from the first build. It can be added later when there is a specific image that contributes something meaningful; the layout should not reserve an empty photo slot.

### Deferred palette idea

A later iteration may let the page's ambient palette shift gradually with time of day: nearly white in the morning, lightly warm in the afternoon, muted near dusk, and dark at night. This should be evaluated only after the static palette and layout feel right. If implemented, it should preserve contrast, respect reduced-motion and color-scheme preferences where relevant, and provide a manual override.

JavaScript is welcome when it makes the result better. A framework is also allowed if it earns its added weight; this is a design choice, not a rule. The default bias should simply be toward the smallest implementation that supports the final experience.

## 9. Open decisions and next steps

1. Define what a visitor should understand about Ethan within ten seconds.
2. Find the Michigan PhD reference again and collect a few more examples of simple sites with one excellent interaction.
3. Choose a shortlist of interaction experiments to prototype; do not choose based on novelty alone.
4. Decide whether the public blog should remain Quartz-shaped or be rendered in a custom reader experience while keeping the Obsidian/Markdown workflow.
5. Check whether `ethan.me` or `ethanmorgan.me` is worth acquiring and, only then, plan redirects and canonical URLs.
6. Draft the first directed letter about the job transition, decide whether it is called a letter or writing, and confirm its intended audience and privacy level.
7. Sketch a bare-bones homepage before writing implementation code.
