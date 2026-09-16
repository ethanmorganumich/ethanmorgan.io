#!/usr/bin/env bash

# Publish Markdown notes from Ethan's Workspace as the public /writing site.
# Usage: ./buildWriting.sh

set -euo pipefail

site_dir="$(cd "$(dirname "$0")" && pwd)"
quartz_dir="$(cd "$site_dir/../quartz" && pwd)"
content_dir="$site_dir/content"
output_dir="$site_dir/writing"
temporary_output="$(mktemp -d)"
temporary_content="$(mktemp -d)"

cleanup() {
  rm -rf "$temporary_output"
  rm -rf "$temporary_content"
}
trap cleanup EXIT

rsync -a --exclude 'Learnings/' --exclude 'First Blog.md' "$content_dir/" "$temporary_content/"

(
  cd "$quartz_dir"
  npx quartz build --directory "$temporary_content" --output "$temporary_output"
)

node - "$temporary_output" <<'NODE'
const crypto = require("crypto")
const fs = require("fs")
const path = require("path")

const root = process.argv[2]
const moduleTag = /<script type="module">([\s\S]*?)<\/script>/g
let sharedModule = null

function visit(directory) {
  for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
    const file = path.join(directory, entry.name)
    if (entry.isDirectory()) {
      visit(file)
      continue
    }
    if (!entry.name.endsWith(".html")) continue

    const html = fs.readFileSync(file, "utf8")
    const modules = [...html.matchAll(moduleTag)]
    if (!modules.length) continue

    for (const match of modules) {
      const module = match[1]
      if (!sharedModule) sharedModule = module
      if (module !== sharedModule) {
        throw new Error(`Unexpected page-specific module in ${file}`)
      }
    }

    fs.writeFileSync(file, html.replace(moduleTag, '<script type="module" src="/writing/postscript.module.js"></script>'))
  }
}

visit(root)
if (!sharedModule) throw new Error("Quartz emitted no module script")
fs.writeFileSync(path.join(root, "postscript.module.js"), sharedModule)

function normalizeInternalLinks(directory) {
  for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
    const file = path.join(directory, entry.name)
    if (entry.isDirectory()) {
      normalizeInternalLinks(file)
      continue
    }
    if (!entry.name.endsWith(".html")) continue

    const html = fs.readFileSync(file, "utf8")
    const updated = html.replace(/href=(['"])([^'"#?]+)\1/g, (match, quote, href) => {
      if (href.startsWith("/") || href.includes("://") || href.startsWith("mailto:")) return match

      const target = path.resolve(path.dirname(file), href)
      return fs.existsSync(`${target}.html`) ? `href=${quote}${href}.html${quote}` : match
    })
    fs.writeFileSync(file, updated)
  }
}

normalizeInternalLinks(root)

const contentIndex = JSON.parse(fs.readFileSync(path.join(root, "static", "contentIndex.json"), "utf8"))
const notes = Object.entries(contentIndex)
  .filter(([slug]) => slug !== "index" && slug !== "First-Blog" && !slug.startsWith("Learnings/"))
  .map(([slug, note]) => {
    const page = fs.readFileSync(path.join(root, `${slug}.html`), "utf8")
    const date = page.match(/<time datetime="([^"]+)"/)
    return { slug, ...note, date: date?.[1] ?? null }
  })
  .sort((first, second) => (second.date ?? "").localeCompare(first.date ?? ""))
fs.writeFileSync(path.join(root, "static", "writingIndex.json"), JSON.stringify(notes))

console.log(`Shared writing module: ${crypto.createHash("sha256").update(sharedModule).digest("hex").slice(0, 12)}`)
NODE

find "$temporary_output" -type f \( -name '*.html' -o -name '*.xml' -o -name '*.json' \) -exec \
  perl -0pi -e 's#ethanmorgan\.io/blog#ethanmorgan.io/writing#g; s#(["\x27])/blog/#$1/writing/#g' {} +
find "$temporary_output" -type f -name '*.html' -exec \
  perl -0pi -e 's#<head>#<head><link rel="stylesheet" href="/writing/ethan-writing.css">#' {} +
cp "$site_dir/assets/writing.css" "$temporary_output/ethan-writing.css"
cp "$site_dir/assets/writing-index.css" "$temporary_output/writing-index.css"
cp "$site_dir/assets/writing-index.js" "$temporary_output/writing-index.js"
cp "$site_dir/assets/writing-index.html" "$temporary_output/index.html"

rm -rf "$output_dir"
mv "$temporary_output" "$output_dir"
trap - EXIT

printf 'Built %s\n' "$output_dir"
