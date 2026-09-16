import { cp, copyFile, lstat, mkdir, mkdtemp, readdir, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { buildBlog } from './build-blog.mjs';

const root = fileURLToPath(new URL('../', import.meta.url));
const output = path.join(root, 'dist');
const staging = await mkdtemp(path.join(tmpdir(), 'ethan-site-'));
const siteUrl = 'https://www.ethanmorgan.io';

// Only these public sources are deployed; never traverse the Obsidian symlink.
const publicFiles = ['index.html', '404.html', 'resume.pdf', 'assets/site.css', 'assets/site.js', 'assets/blog.css'];
const publicDirectories = ['v2', 'blog', 'gpu-calculator'];

async function rejectSymlinks(directory) {
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const target = path.join(directory, entry.name);
    if (entry.isSymbolicLink()) throw new Error(`Public asset must not be a symlink: ${target}`);
    if (entry.isDirectory()) await rejectSymlinks(target);
  }
}

try {
  for (const file of publicFiles) {
    const source = path.join(root, file);
    if (!(await lstat(source)).isFile()) throw new Error(`Expected a public file: ${file}`);
    await mkdir(path.dirname(path.join(staging, file)), { recursive: true });
    await copyFile(source, path.join(staging, file));
  }
  for (const directory of publicDirectories) {
    const source = path.join(root, directory);
    if (!(await lstat(source)).isDirectory()) throw new Error(`Expected a public directory: ${directory}`);
    await rejectSymlinks(source);
    await cp(source, path.join(staging, directory), { recursive: true });
  }
  const attachments = path.join(root, 'assets/blog');
  const attachmentsStat = await lstat(attachments).catch((error) => {
    if (error.code === 'ENOENT') return null;
    throw error;
  });
  if (attachmentsStat) {
    if (!attachmentsStat.isDirectory()) throw new Error('Blog attachments must be a directory, not a symlink.');
    await rejectSymlinks(attachments);
    await cp(attachments, path.join(staging, 'assets/blog'), { recursive: true });
  }
  await copyFile(path.join(staging, 'blog/index.html'), path.join(staging, 'blog/archive.html'));
  await buildBlog({ outDir: staging, siteUrl });

  const urls = [];
  async function collectPages(directory) {
    for (const entry of await readdir(directory, { withFileTypes: true })) {
      const file = path.join(directory, entry.name);
      if (entry.isDirectory()) await collectPages(file);
      else if (entry.name.endsWith('.html') && entry.name !== '404.html') {
        let relative = path.relative(staging, file).split(path.sep).map(encodeURIComponent).join('/');
        relative = relative.replace(/(^|\/)index\.html$/, '$1');
        urls.push(`${siteUrl}/${relative}`);
      }
    }
  }
  await collectPages(staging);
  const escape = (value) => value.replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;');
  await writeFile(path.join(staging, 'sitemap.xml'), `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.sort().map((url) => `  <url><loc>${escape(url)}</loc></url>`).join('\n')}\n</urlset>\n`);
  await writeFile(path.join(staging, 'robots.txt'), `User-agent: *\nAllow: /\nSitemap: ${siteUrl}/sitemap.xml\n`);

  // Rebuild only the disposable output directory, after all generation succeeds.
  await rm(output, { recursive: true, force: true });
  await mkdir(output);
  await cp(staging, output, { recursive: true });
  console.log(`Built dist with ${urls.length} pages; legacy article paths preserved.`);
} finally {
  await rm(staging, { recursive: true, force: true });
}
