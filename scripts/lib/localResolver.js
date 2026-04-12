const fs = require('fs')
const path = require('path')

const PROJECT_ROOT = path.resolve(__dirname, '../..')
const MD_ROOT = path.join(PROJECT_ROOT, 'src/pages/markdown')
const STATIC_ROOT = path.join(PROJECT_ROOT, 'static')

/**
 * Check if a local path resolves to an existing Gatsby route or static asset.
 *
 * Gatsby routes for this site:
 *   Blog:   /archives/YYYY/MM/DD/{slug}  → src/pages/markdown/blog/{slug}/en.md
 *   Static: /{slug}                      → src/pages/markdown/static/{slug}/en.md
 *   Assets: /anything                    → static/anything
 */
function resolveLocalPath(urlPath) {
  // Normalize: strip trailing slash, leading slash
  const cleaned = urlPath.replace(/\/+$/, '').replace(/^\//, '')

  if (!cleaned) {
    // Root path "/" — always valid
    return { valid: true, reason: 'root' }
  }

  // Blog archive route: /archives/YYYY/MM/DD/{slug}
  const archiveMatch = cleaned.match(/^archives\/\d{4}\/\d{2}\/\d{2}\/(.+)$/)
  if (archiveMatch) {
    const slug = archiveMatch[1]
    const mdPath = path.join(MD_ROOT, 'blog', slug, 'en.md')
    if (fs.existsSync(mdPath)) {
      return { valid: true, reason: 'blog-route' }
    }
    return { valid: false, reason: `no blog post found for slug: ${slug}` }
  }

  // Static markdown page: /{slug}
  const staticMdPath = path.join(MD_ROOT, 'static', cleaned, 'en.md')
  if (fs.existsSync(staticMdPath)) {
    return { valid: true, reason: 'static-page' }
  }

  // Static asset: check static/ directory
  const staticAssetPath = path.join(STATIC_ROOT, cleaned)
  if (fs.existsSync(staticAssetPath)) {
    return { valid: true, reason: 'static-asset' }
  }

  // Also check with index.html appended (for directory routes)
  if (fs.existsSync(path.join(staticAssetPath, 'index.html'))) {
    return { valid: true, reason: 'static-asset-dir' }
  }

  // Check src/pages for JS page components (e.g., src/pages/index.js)
  const jsPagePath = path.join(PROJECT_ROOT, 'src/pages', cleaned + '.js')
  const jsxPagePath = path.join(PROJECT_ROOT, 'src/pages', cleaned + '.jsx')
  const jsIndexPath = path.join(PROJECT_ROOT, 'src/pages', cleaned, 'index.js')
  if (fs.existsSync(jsPagePath) || fs.existsSync(jsxPagePath) || fs.existsSync(jsIndexPath)) {
    return { valid: true, reason: 'js-page' }
  }

  return { valid: false, reason: `no local route found for: /${cleaned}` }
}

/**
 * For a fully-qualified hiddentao.com URL, extract the path and check locally.
 */
function resolveInternalUrl(url) {
  try {
    const parsed = new URL(url)
    return resolveLocalPath(parsed.pathname)
  } catch {
    return { valid: false, reason: `invalid URL: ${url}` }
  }
}

module.exports = { resolveLocalPath, resolveInternalUrl }
