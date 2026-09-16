import assert from 'node:assert/strict';
import { existsSync, readFileSync, readdirSync, statSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('../', import.meta.url));
const output = path.join(root, 'dist');
function walk(directory) {
  return readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const file = path.join(directory, entry.name);
    return entry.isDirectory() ? walk(file) : [file];
  });
}

const files = walk(output);
const excluded = /(^|\/)(node_modules|content|posts|templates|scripts|design-explorations|writing|\.git)(\/|$)/;
for (const file of files) {
  const relative = path.relative(output, file);
  assert(!excluded.test(relative), `Non-public path in deployment: ${relative}`);
  assert(!relative.endsWith('.md'), `Markdown source in deployment: ${relative}`);
}

// Existing Quartz assets and article URLs must remain byte-for-byte intact.
for (const file of walk(path.join(root, 'blog'))) {
  const relative = path.relative(root, file);
  if (relative === 'blog/index.html') continue;
  assert.deepEqual(readFileSync(path.join(output, relative)), readFileSync(file), `Legacy file changed: ${relative}`);
}
assert.deepEqual(readFileSync(path.join(output, 'blog/archive.html')), readFileSync(path.join(root, 'blog/index.html')));
assert.deepEqual(readFileSync(path.join(output, 'v2/resume.pdf')), readFileSync(path.join(root, 'v2/resume.pdf')));

// Check links and assets on the new pages; legacy pages retain their own routing.
const newPages = ['index.html', '404.html', 'blog/index.html'];
for (const file of files) {
  const relative = path.relative(output, file);
  if (relative.startsWith('blog/') && relative.endsWith('/index.html') && !existsSync(path.join(root, relative))) newPages.push(relative);
}
let links = 0;
for (const relative of newPages) {
  const file = path.join(output, relative);
  const html = readFileSync(file, 'utf8');
  for (const [, raw] of html.matchAll(/(?:href|src)="([^"]+)"/g)) {
    if (/^(https?:|mailto:|data:|tel:)/.test(raw)) continue;
    const url = new URL(raw.replaceAll('&amp;', '&'), `https://local.test/${relative}`);
    let target = path.join(output, decodeURIComponent(url.pathname));
    if (existsSync(target) && statSync(target).isDirectory()) target = path.join(target, 'index.html');
    if (!existsSync(target) && existsSync(`${target}.html`)) target += '.html';
    assert(existsSync(target), `Broken link in ${relative}: ${raw}`);
    if (url.hash && target.endsWith('.html')) {
      const content = readFileSync(target, 'utf8');
      assert(content.includes(`id="${decodeURIComponent(url.hash.slice(1))}"`), `Missing anchor in ${relative}: ${raw}`);
    }
    links++;
  }
}
console.log(`Verified ${links} new-page links, preserved legacy files, and public-only deployment contents.`);
