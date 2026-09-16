import { mkdir, readdir, readFile, stat, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import matter from 'gray-matter'
import MarkdownIt from 'markdown-it'

const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const safeSlug = /^[a-z0-9]+(?:-[a-z0-9]+)*$/

function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, (character) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[character])
}

function escapeXml(value) {
  return escapeHtml(value)
}

function headingSlug(value, used) {
  const base = String(value).toLowerCase().replace(/<[^>]*>/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') || 'section'
  let id = base
  let suffix = 2
  while (used.has(id)) id = `${base}-${suffix++}`
  used.add(id)
  return id
}

function renderMarkdown(source) {
  const headings = []
  const usedHeadingIds = new Set(['main'])
  const markdown = new MarkdownIt({ html: false, linkify: true, typographer: true })
  const defaultHeadingOpen = markdown.renderer.rules.heading_open
  markdown.renderer.rules.heading_open = (tokens, index, options, environment, self) => {
    const token = tokens[index]
    const inline = tokens[index + 1]
    const label = inline?.children?.filter((child) => child.type === 'text' || child.type === 'code_inline').map((child) => child.content).join('') || inline?.content || ''
    const id = headingSlug(label, usedHeadingIds)
    token.attrSet('id', id)
    if (token.tag === 'h2' || token.tag === 'h3') headings.push({ id, label })
    return defaultHeadingOpen ? defaultHeadingOpen(tokens, index, options, environment, self) : self.renderToken(tokens, index, options)
  }
  markdown.renderer.rules.link_open = (tokens, index, options, environment, self) => {
    tokens[index].attrJoin('class', 'tracking-link')
    return self.renderToken(tokens, index, options)
  }
  return { html: markdown.render(source), headings }
}

function validatePost(data, fileName, dateLiteral) {
  for (const field of ['title', 'description']) {
    if (typeof data[field] !== 'string' || !data[field].trim()) throw new Error(`${fileName}: published posts require a ${field}`)
  }
  const date = dateLiteral ?? (data.date instanceof Date ? data.date.toISOString().slice(0, 10) : data.date)
  const dateParts = typeof date === 'string' && /^([0-9]{4})-([0-9]{2})-([0-9]{2})$/.exec(date)
  const parsedDate = dateParts && new Date(`${date}T00:00:00Z`)
  if (!parsedDate || Number.isNaN(parsedDate.valueOf()) || parsedDate.getUTCFullYear() !== Number(dateParts[1]) || parsedDate.getUTCMonth() + 1 !== Number(dateParts[2]) || parsedDate.getUTCDate() !== Number(dateParts[3])) throw new Error(`${fileName}: date must be YYYY-MM-DD`)
  const fallbackSlug = path.basename(fileName, path.extname(fileName))
  const slug = data.slug ?? fallbackSlug
  if (typeof slug !== 'string' || !safeSlug.test(slug)) throw new Error(`${fileName}: slug must be a safe lowercase slug`)
  return { title: data.title.trim(), date, description: data.description.trim(), slug }
}

function pageShell({ title, description, canonical, bodyClass, main, toc = '', skipLabel }) {
  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="description" content="${escapeHtml(description)}">
    <link rel="canonical" href="${escapeHtml(canonical)}">
    <link rel="icon" href="/v2/favicon.ico">
    <title>${escapeHtml(title)} — Ethan Morgan</title>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Inter:opsz,wght@14..32,400..700&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="/assets/site.css">
    <link rel="stylesheet" href="/assets/blog.css">
  </head>
  <body class="${bodyClass}">
    <a class="skip-link" href="#main">Skip to ${skipLabel}</a>
    <aside class="index" aria-label="Blog navigation">
      <a class="back-link tracking-link" href="/">← Ethan Morgan</a>${toc}
    </aside>
    <main class="document" id="main">
${main}
    </main>
    <script src="/assets/site.js"></script>
  </body>
</html>
`
}

function indexPage(posts, siteUrl) {
  const entries = posts.length
    ? posts.map((post) => `          <li><a class="tracking-link entry-title" href="/blog/${encodeURIComponent(post.slug)}/">${escapeHtml(post.title)}</a><p>${escapeHtml(post.description)}</p><span class="entry-meta">${escapeHtml(post.date)}</span></li>`).join('\n')
    : '          <li>No posts yet.</li>'
  return pageShell({
    title: 'Blog',
    description: 'Notes on software, experiments, and making things, by Ethan Morgan.',
    canonical: `${siteUrl}/blog/`,
    bodyClass: 'blog-index',
    skipLabel: 'the posts',
    toc: '\n      <nav><a href="#notes"><span>01 /</span> Notes</a><a href="#about-blog"><span>02 /</span> About</a></nav>',
    main: `      <header class="opening" id="notes"><h1>Notes from making things</h1><div class="opening-copy"><p>Software, small experiments, and things that take a little more than a link to explain.</p></div></header>
      <section class="section" aria-label="Posts"><ol class="entries post-list">\n${entries}\n      </ol></section>
      <footer class="section footer" id="about-blog"><h2 class="section-label">About these notes</h2><div class="prose"><p>A place for technical posts and unfinished questions. If something here gets you thinking, <a class="tracking-link" href="mailto:e@ethanmorgan.io">write to me</a>.</p><p><a class="tracking-link" href="/blog/archive.html">Older notes</a> · <a class="tracking-link" href="/">Back to my homepage</a></p></div></footer>`,
  })
}

function articlePage(post, siteUrl) {
  const { html, headings } = renderMarkdown(post.content)
  const toc = headings.length ? `\n      <nav>${headings.map((heading, index) => `<a href="#${heading.id}"><span>${String(index + 1).padStart(2, '0')} /</span> ${escapeHtml(heading.label)}</a>`).join('')}</nav>` : ''
  return pageShell({
    title: post.title,
    description: post.description,
    canonical: `${siteUrl}/blog/${encodeURIComponent(post.slug)}/`,
    bodyClass: 'blog-article',
    skipLabel: 'the article',
    toc,
    main: `      <article class="article-body"><header class="article-header"><h1>${escapeHtml(post.title)}</h1><p class="post-meta">Ethan Morgan · ${escapeHtml(post.date)}</p></header>\n${html}        <footer class="footer"><p><a class="tracking-link" href="/blog/">← All notes</a></p></footer></article>`,
  })
}

function feedXml(posts, siteUrl) {
  const items = posts.map((post) => `    <entry><title>${escapeXml(post.title)}</title><id>${escapeXml(`${siteUrl}/blog/${post.slug}/`)}</id><link href="${escapeXml(`${siteUrl}/blog/${post.slug}/`)}"/><updated>${post.date}T00:00:00Z</updated><summary>${escapeXml(post.description)}</summary></entry>`).join('\n')
  const updated = posts[0]?.date ? `${posts[0].date}T00:00:00Z` : new Date(0).toISOString()
  return `<?xml version="1.0" encoding="utf-8"?>\n<feed xmlns="http://www.w3.org/2005/Atom"><title>Ethan Morgan’s notes</title><id>${escapeXml(`${siteUrl}/blog/`)}</id><link rel="self" href="${escapeXml(`${siteUrl}/blog/feed.xml`)}"/><updated>${updated}</updated><author><name>Ethan Morgan</name></author>\n${items}\n</feed>\n`
}

export async function buildBlog({ outDir, siteUrl, postsDir = path.join(projectRoot, 'posts') }) {
  if (!outDir) throw new Error('outDir is required')
  if (!siteUrl) throw new Error('siteUrl is required')
  const normalizedSiteUrl = siteUrl.replace(/\/$/, '')
  const names = await readdir(postsDir, { withFileTypes: true }).catch((error) => error.code === 'ENOENT' ? [] : Promise.reject(error))
  const posts = []
  const slugs = new Set()
  for (const entry of names.filter((entry) => entry.isFile() && entry.name.endsWith('.md')).sort((a, b) => a.name.localeCompare(b.name))) {
    const source = await readFile(path.join(postsDir, entry.name), 'utf8')
    const parsed = matter(source)
    if (parsed.data.published !== true) continue
    const dateMatch = source.match(/^\s*date:\s*["']?(\d{4}-\d{2}-\d{2})["']?\s*$/m)
    const metadata = validatePost(parsed.data, entry.name, dateMatch?.[1])
    if (slugs.has(metadata.slug)) throw new Error(`${entry.name}: duplicate slug ${metadata.slug}`)
    slugs.add(metadata.slug)
    posts.push({ ...metadata, content: parsed.content })
  }
  posts.sort((first, second) => second.date.localeCompare(first.date) || first.slug.localeCompare(second.slug))
  for (const post of posts) {
    const target = path.join(outDir, 'blog', post.slug)
    for (const existingPath of [target, path.join(outDir, 'blog', `${post.slug}.html`)]) {
      try {
        await stat(existingPath)
        throw new Error(`Refusing to overwrite existing blog path: /blog/${post.slug}/`)
      } catch (error) {
        if (error.code !== 'ENOENT') throw error
      }
    }
  }
  await mkdir(path.join(outDir, 'blog'), { recursive: true })
  await writeFile(path.join(outDir, 'blog', 'index.html'), indexPage(posts, normalizedSiteUrl))
  await writeFile(path.join(outDir, 'blog', 'feed.xml'), feedXml(posts, normalizedSiteUrl))
  await Promise.all(posts.map(async (post) => {
    const target = path.join(outDir, 'blog', post.slug)
    await mkdir(target, { recursive: true })
    await writeFile(path.join(target, 'index.html'), articlePage(post, normalizedSiteUrl))
  }))
  return posts.map(({ content, ...metadata }) => metadata)
}
