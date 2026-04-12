const got = require('got')

const USER_AGENT = 'hiddentao-link-checker/1.0 (https://hiddentao.com)'
const TIMEOUT = 15000
const STOP_WORDS = new Set([
  'a', 'an', 'the', 'is', 'at', 'of', 'on', 'in', 'to', 'for', 'and',
  'or', 'but', 'with', 'by', 'from', 'as', 'it', 'its', 'this', 'that',
  '-', '–', '—', '|', '/', '\\',
])

/**
 * Extract <title> text from an HTML string (first 50KB).
 */
function extractTitle(html) {
  if (!html || typeof html !== 'string') return ''
  const chunk = html.substring(0, 50000)
  const match = chunk.match(/<title[^>]*>([^<]*)<\/title>/i)
  return match ? match[1].trim() : ''
}

/**
 * Extract first <h1> text from an HTML string (first 50KB).
 */
function extractH1(html) {
  if (!html || typeof html !== 'string') return ''
  const chunk = html.substring(0, 50000)
  const match = chunk.match(/<h1[^>]*>([^<]*)<\/h1>/i)
  return match ? match[1].trim() : ''
}

/**
 * Check if a page looks like a "not found" error page.
 */
function looksLikeNotFoundPage(title, h1, body) {
  const pattern = /\b(404|page not found|not found|doesn'?t exist|no longer available|has been removed)\b/i
  if (pattern.test(title)) return true
  if (pattern.test(h1)) return true
  // Also check the raw body for very explicit signals (only first 10KB to avoid false matches)
  const bodySnippet = (body || '').substring(0, 10000)
  // Only match if the body is short (likely an error page) or has very strong signals
  if (bodySnippet.length < 5000 && pattern.test(bodySnippet)) return true
  return false
}

/**
 * Compute Jaccard similarity between two sets of words.
 */
function jaccardSimilarity(wordsA, wordsB) {
  if (wordsA.size === 0 || wordsB.size === 0) return 0
  let intersection = 0
  for (const w of wordsA) {
    if (wordsB.has(w)) intersection++
  }
  const union = wordsA.size + wordsB.size - intersection
  return union === 0 ? 0 : intersection / union
}

/**
 * Tokenize a string into a set of meaningful lowercase words.
 */
function tokenize(str) {
  if (!str) return new Set()
  const words = str
    .toLowerCase()
    .replace(/[^\w\s-]/g, ' ')
    .split(/\s+/)
    .filter(w => w.length > 1 && !STOP_WORDS.has(w))
  return new Set(words)
}

/**
 * Check if a fetched page title is suspiciously different from the link text.
 * Returns true if suspicious (low overlap), false otherwise.
 */
function isSuspiciousContent(linkText, pageTitle) {
  const linkTokens = tokenize(linkText)
  // Only apply heuristic if link text has enough meaningful words
  if (linkTokens.size < 3) return false
  const titleTokens = tokenize(pageTitle)
  if (titleTokens.size === 0) return false
  const similarity = jaccardSimilarity(linkTokens, titleTokens)
  return similarity < 0.15
}

/**
 * Validate a URL by making an HTTP request.
 * Returns { status: 'ok'|'invalid'|'suspicious', httpStatus, title, reason, finalUrl }
 */
async function checkUrl(url, { perHostLimit, delay = 250 }) {
  return perHostLimit(async () => {
    // Small jitter delay between requests to the same host
    if (delay > 0) {
      await new Promise(r => setTimeout(r, Math.random() * delay))
    }

    try {
      const res = await got(url, {
        timeout: TIMEOUT,
        retry: 1,
        followRedirect: true,
        headers: {
          'user-agent': USER_AGENT,
          'accept': 'text/html,application/xhtml+xml,*/*',
        },
        throwHttpErrors: false,
      })

      const httpStatus = res.statusCode
      const body = typeof res.body === 'string' ? res.body : ''
      const title = extractTitle(body)
      const h1 = extractH1(body)
      const finalUrl = res.url || url

      if (httpStatus >= 400) {
        return { status: 'invalid', httpStatus, title, reason: `HTTP ${httpStatus}`, finalUrl }
      }

      if (looksLikeNotFoundPage(title, h1, body)) {
        return { status: 'invalid', httpStatus, title, reason: 'not-found-in-body', finalUrl }
      }

      return { status: 'ok', httpStatus, title, finalUrl }
    } catch (err) {
      const reason = err.code || err.message || 'unknown error'
      return { status: 'invalid', httpStatus: 0, title: '', reason, finalUrl: url }
    }
  })
}

module.exports = { checkUrl, isSuspiciousContent, extractTitle }
