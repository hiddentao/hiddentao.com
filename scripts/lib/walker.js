const fs = require('fs')
const path = require('path')
const grayMatter = require('gray-matter')

const MD_ROOT = path.resolve(__dirname, '../../src/pages/markdown')

function findMarkdownFiles(dir) {
  const results = []
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name)
    if (entry.isDirectory()) {
      results.push(...findMarkdownFiles(full))
    } else if (entry.name.endsWith('.md')) {
      results.push(full)
    }
  }
  return results
}

function walkMarkdownFiles({ globFilter } = {}) {
  const dirs = [
    path.join(MD_ROOT, 'blog'),
    path.join(MD_ROOT, 'static'),
  ]

  const files = []
  for (const dir of dirs) {
    if (!fs.existsSync(dir)) continue
    files.push(...findMarkdownFiles(dir))
  }

  return files
    .filter(f => {
      if (!globFilter) return true
      const rel = path.relative(MD_ROOT, f)
      return rel.includes(globFilter)
    })
    .map(filePath => {
      const raw = fs.readFileSync(filePath, 'utf-8')
      const parsed = grayMatter(raw)
      // gray-matter.matter is the raw frontmatter string between ---
      // parsed.content is the body after the frontmatter
      // We need the byte offset where the body starts in the raw file
      const fmEnd = raw.indexOf('---', 3)
      const bodyStart = fmEnd === -1 ? 0 : raw.indexOf('\n', fmEnd + 3) + 1
      return {
        filePath,
        relativePath: path.relative(MD_ROOT, filePath),
        raw,
        frontmatter: parsed.data,
        body: parsed.content,
        bodyStart,
      }
    })
}

module.exports = { walkMarkdownFiles, MD_ROOT }
