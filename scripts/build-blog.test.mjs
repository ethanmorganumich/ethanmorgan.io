import assert from 'node:assert/strict'
import test, { after } from 'node:test'
import { mkdtemp, mkdir, readFile, rm, writeFile } from 'node:fs/promises'
import os from 'node:os'
import path from 'node:path'
import { buildBlog } from './build-blog.mjs'

const temporaryRoots = []

async function fixture(files = {}) {
  const root = await mkdtemp(path.join(os.tmpdir(), 'blog-build-'))
  temporaryRoots.push(root)
  const postsDir = path.join(root, 'posts')
  const outDir = path.join(root, 'out')
  await mkdir(postsDir)
  await Promise.all(Object.entries(files).map(([name, content]) => writeFile(path.join(postsDir, name), content)))
  return { outDir, postsDir }
}

after(async () => Promise.all(temporaryRoots.map((root) => rm(root, { recursive: true, force: true }))))

const published = ({ title = 'A post', date = '2026-09-16', description = 'A description', slug = 'a-post' } = {}, body = '## A heading\n\nParagraph.') => `---
published: true
title: ${JSON.stringify(title)}
date: ${date}
description: ${JSON.stringify(description)}
slug: ${slug}
---
${body}
`

test('builds only published posts and returns sitemap metadata', async () => {
  const { outDir, postsDir } = await fixture({
    'published.md': published(),
    'draft.md': '---\npublished: false\ntitle: Draft\n---\nHidden',
  })
  const posts = await buildBlog({ outDir, postsDir, siteUrl: 'https://example.test/' })
  assert.deepEqual(posts, [{ title: 'A post', date: '2026-09-16', description: 'A description', slug: 'a-post' }])
  await assert.doesNotReject(readFile(path.join(outDir, 'blog', 'a-post', 'index.html')))
  await assert.rejects(readFile(path.join(outDir, 'blog', 'draft', 'index.html')))
})

test('escapes front matter and Markdown HTML while retaining fenced code', async () => {
  const { outDir, postsDir } = await fixture({
    'a-post.md': published({ title: '<img src=x>', description: '<script>alert(1)</script>' }, '## Safe heading\n\n<script>alert(1)</script>\n\n```js\nconst value = "<safe>"\n```'),
  })
  await buildBlog({ outDir, postsDir, siteUrl: 'https://example.test' })
  const page = await readFile(path.join(outDir, 'blog', 'a-post', 'index.html'), 'utf8')
  assert.match(page, /&lt;img src=x&gt;/)
  assert.match(page, /&lt;script&gt;alert\(1\)&lt;\/script&gt;/)
  assert.match(page, /<pre><code class="language-js">const value = &quot;&lt;safe&gt;&quot;/)
})

test('adds heading IDs and a numbered article TOC', async () => {
  const { outDir, postsDir } = await fixture({ 'a-post.md': published({}, '## First section\n\nText\n\n### Second section') })
  await buildBlog({ outDir, postsDir, siteUrl: 'https://example.test' })
  const page = await readFile(path.join(outDir, 'blog', 'a-post', 'index.html'), 'utf8')
  assert.match(page, /href="#first-section"><span>01 \/<\/span> First section/)
  assert.match(page, /href="#second-section"><span>02 \/<\/span> Second section/)
  assert.match(page, /<h2 id="first-section">First section<\/h2>/)
})

test('keeps heading IDs unique when generated suffixes collide', async () => {
  const { outDir, postsDir } = await fixture({ 'a-post.md': published({}, '## A\n\n## A\n\n## A 2\n\n# Main\n\n[Documentation](/docs)') })
  await buildBlog({ outDir, postsDir, siteUrl: 'https://example.test' })
  const page = await readFile(path.join(outDir, 'blog', 'a-post', 'index.html'), 'utf8')
  assert.match(page, /<h2 id="a">A<\/h2>/)
  assert.match(page, /<h2 id="a-2">A<\/h2>/)
  assert.match(page, /<h2 id="a-2-2">A 2<\/h2>/)
  assert.match(page, /<h1 id="main-2">Main<\/h1>/)
  assert.match(page, /<a href="\/docs" class="tracking-link">Documentation<\/a>/)
})

test('rejects duplicate slugs and occupied legacy post paths', async () => {
  const duplicate = await fixture({
    'one.md': published({}, 'One'),
    'two.md': published({ title: 'Two' }, 'Two'),
  })
  await assert.rejects(buildBlog({ ...duplicate, siteUrl: 'https://example.test' }), /duplicate slug/)

  const collision = await fixture({ 'a-post.md': published() })
  await mkdir(path.join(collision.outDir, 'blog', 'a-post'), { recursive: true })
  await writeFile(path.join(collision.outDir, 'blog', 'a-post', 'index.html'), 'legacy article')
  await assert.rejects(buildBlog({ ...collision, siteUrl: 'https://example.test' }), /Refusing to overwrite/)

  const htmlCollision = await fixture({ 'a-post.md': published() })
  await mkdir(path.join(htmlCollision.outDir, 'blog'), { recursive: true })
  await writeFile(path.join(htmlCollision.outDir, 'blog', 'a-post.html'), 'legacy article')
  await assert.rejects(buildBlog({ ...htmlCollision, siteUrl: 'https://example.test' }), /Refusing to overwrite/)
})

test('rejects invalid published dates', async () => {
  const { outDir, postsDir } = await fixture({ 'a-post.md': published({ date: '2026-02-30' }) })
  await assert.rejects(buildBlog({ outDir, postsDir, siteUrl: 'https://example.test' }), /date must be YYYY-MM-DD/)
})

test('writes a clean empty index and empty feed', async () => {
  const { outDir, postsDir } = await fixture()
  const posts = await buildBlog({ outDir, postsDir, siteUrl: 'https://example.test' })
  assert.deepEqual(posts, [])
  const index = await readFile(path.join(outDir, 'blog', 'index.html'), 'utf8')
  assert.match(index, /No posts yet\./)
  assert.match(index, /fonts.googleapis.com/)
  assert.match(index, /class="back-link tracking-link"/)
  assert.match(index, /<h2 class="section-label">About these notes<\/h2>/)
  assert.doesNotMatch(index, /<nav><a class=/)
  await assert.doesNotReject(readFile(path.join(outDir, 'blog', 'feed.xml')))
})
