const unified = require('unified')
const remarkParse = require('remark-parse')

/**
 * Decode HTML entities commonly found in frontmatter/markdown.
 */
function decodeHtmlEntities(str) {
  return str
    .replace(/&#(\d+);/g, (_, n) => String.fromCharCode(parseInt(n, 10)))
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
}

/**
 * Classify a URL into a category for routing validation logic.
 */
function classifyUrl(url) {
  if (!url || typeof url !== 'string') return { kind: 'skip', normalized: url }

  const trimmed = url.trim()

  // Skip non-HTTP schemes and anchors
  if (/^(mailto:|tel:|javascript:|data:|#)/i.test(trimmed)) {
    return { kind: 'skip', normalized: trimmed }
  }

  // Relative links
  if (trimmed.startsWith('/') || trimmed.startsWith('./') || trimmed.startsWith('../')) {
    return { kind: 'relative', normalized: trimmed }
  }

  // hiddentao.com links (fully qualified)
  try {
    const parsed = new URL(trimmed)
    if (/^(www\.)?hiddentao\.com$/i.test(parsed.hostname)) {
      return { kind: 'internal', normalized: trimmed }
    }
  } catch {
    // Not a valid URL - skip it
    return { kind: 'skip', normalized: trimmed }
  }

  // Protocol-relative URLs
  if (trimmed.startsWith('//')) {
    return { kind: 'external', normalized: 'https:' + trimmed }
  }

  // Standard external URLs
  if (/^https?:\/\//i.test(trimmed)) {
    return { kind: 'external', normalized: trimmed }
  }

  return { kind: 'skip', normalized: trimmed }
}

/**
 * Walk a remark AST node tree collecting link/image URLs with positions.
 */
function walkAst(node, results) {
  if (node.type === 'link' || node.type === 'image') {
    const url = node.url
    if (url && node.position) {
      // For link nodes, the text content is the children
      let text = ''
      if (node.type === 'link' && node.children) {
        text = node.children
          .filter(c => c.type === 'text')
          .map(c => c.value)
          .join('')
      } else if (node.type === 'image') {
        text = node.alt || ''
      }
      results.push({
        url,
        text,
        startOffset: node.position.start.offset,
        endOffset: node.position.end.offset,
      })
    }
  }
  if (node.children) {
    for (const child of node.children) {
      walkAst(child, results)
    }
  }
}

/**
 * Extract URLs from the markdown body using remark AST.
 * Returns objects with { url, text, source: 'body', rawOffset, rawLength }
 * where rawOffset/rawLength refer to positions in the original raw file.
 */
function extractBodyUrls(body, bodyStart) {
  const tree = unified().use(remarkParse).parse(body)
  const astResults = []
  walkAst(tree, astResults)

  return astResults.map(r => {
    // The url inside the AST node is the decoded URL.
    // We need to find the raw URL in the original body text for rewriting.
    // The node position covers the entire markdown syntax e.g. [text](url)
    // We need to locate just the URL portion within that range.
    const nodeRaw = body.substring(r.startOffset, r.endOffset)

    // Find the URL portion in the raw node text
    // For links: [text](url) or [text](url "title")
    // For images: ![alt](url) or ![alt](url "title")
    let urlStart, urlEnd
    const parenOpen = nodeRaw.lastIndexOf('(')
    if (parenOpen !== -1) {
      const parenClose = nodeRaw.lastIndexOf(')')
      const insideParen = nodeRaw.substring(parenOpen + 1, parenClose)
      // URL may be followed by a title in quotes
      const urlMatch = insideParen.match(/^([^\s"']+)/)
      if (urlMatch) {
        urlStart = r.startOffset + parenOpen + 1
        urlEnd = urlStart + urlMatch[1].length
      }
    }

    if (urlStart === undefined) {
      // Fallback: can't parse, report the whole node
      return null
    }

    const rawUrl = body.substring(urlStart, urlEnd)

    return {
      url: decodeHtmlEntities(rawUrl),
      rawUrl,
      text: r.text,
      source: 'body',
      rawOffset: bodyStart + urlStart,
      rawLength: urlEnd - urlStart,
    }
  }).filter(Boolean)
}

/**
 * Extract URLs from the frontmatter summary field.
 * The summary may contain HTML-entity-encoded URLs and markdown-style links.
 */
function extractSummaryUrls(raw, frontmatter) {
  const summary = frontmatter.summary
  if (!summary || typeof summary !== 'string') return []

  const results = []

  // Find where the summary value appears in the raw file.
  // gray-matter strips it, so we need to locate it in the raw YAML.
  // We search for 'summary:' in the frontmatter section.
  const fmEndIdx = raw.indexOf('---', 3)
  const fmSection = raw.substring(0, fmEndIdx)

  // Match markdown-style links: [text](url)
  const mdLinkRe = /\[([^\]]*)\]\(([^)]+)\)/g
  let match
  while ((match = mdLinkRe.exec(summary)) !== null) {
    const rawUrl = match[2]
    const decodedUrl = decodeHtmlEntities(rawUrl)

    // Find position in raw file
    const posInFm = fmSection.indexOf(match[0])
    if (posInFm !== -1) {
      const urlStartInMatch = match[0].indexOf('(') + 1
      results.push({
        url: decodedUrl,
        rawUrl,
        text: match[1],
        source: 'summary',
        rawOffset: posInFm + urlStartInMatch,
        rawLength: rawUrl.length,
      })
    }
  }

  // Match bare URLs (not already captured by markdown links)
  const bareUrlRe = /https?:(?:&#47;&#47;|\/\/)[^\s)<>"']+/g
  while ((match = bareUrlRe.exec(summary)) !== null) {
    const rawUrl = match[0]
    const decodedUrl = decodeHtmlEntities(rawUrl)
    // Skip if this URL is already captured as part of a markdown link
    if (results.some(r => r.url === decodedUrl)) continue

    const posInFm = fmSection.indexOf(rawUrl)
    if (posInFm !== -1) {
      results.push({
        url: decodedUrl,
        rawUrl,
        text: '',
        source: 'summary',
        rawOffset: posInFm,
        rawLength: rawUrl.length,
      })
    }
  }

  return results
}

/**
 * Extract all URLs from a markdown file.
 * Returns { url, rawUrl, text, source, rawOffset, rawLength, classification }
 */
function extractUrls({ raw, frontmatter, body, bodyStart }) {
  const bodyUrls = extractBodyUrls(body, bodyStart)
  const summaryUrls = extractSummaryUrls(raw, frontmatter)
  const all = [...summaryUrls, ...bodyUrls]

  // Add classification and deduplicate by URL (keep first occurrence for rewriting)
  const seen = new Map()
  const results = []

  for (const entry of all) {
    const classification = classifyUrl(entry.url)
    const item = { ...entry, classification }

    if (classification.kind === 'skip') continue

    if (!seen.has(entry.url)) {
      seen.set(entry.url, [item])
      results.push(item)
    } else {
      seen.get(entry.url).push(item)
    }
  }

  // Return all entries (including duplicates) — caller needs all for rewriting
  const allWithClass = all
    .map(entry => ({ ...entry, classification: classifyUrl(entry.url) }))
    .filter(e => e.classification.kind !== 'skip')

  return allWithClass
}

module.exports = { extractUrls, classifyUrl, decodeHtmlEntities }
