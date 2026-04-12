const got = require('got')

const WAYBACK_API = 'https://archive.org/wayback/available'
const MAX_RETRIES = 3
const BASE_DELAY = 2000

/**
 * Query the Wayback Machine availability API for the latest archived snapshot.
 * Returns { archiveUrl, timestamp } or null if no snapshot exists.
 */
async function findArchive(url, { limit }) {
  return limit(async () => {
    let lastErr
    for (let attempt = 0; attempt < MAX_RETRIES; attempt++) {
      try {
        const res = await got(WAYBACK_API, {
          query: { url },
          json: true,
          timeout: 15000,
          retry: 0,
          headers: {
            'user-agent': 'hiddentao-link-checker/1.0',
          },
        })

        const snapshot = res.body &&
          res.body.archived_snapshots &&
          res.body.archived_snapshots.closest

        if (snapshot && snapshot.available && snapshot.url) {
          return {
            archiveUrl: snapshot.url.replace(/^http:/, 'https:'),
            timestamp: snapshot.timestamp,
          }
        }

        return null
      } catch (err) {
        lastErr = err
        const status = err.statusCode || 0
        // Rate limited or server error — back off and retry
        if (status === 429 || status >= 500 || err.code === 'ETIMEDOUT') {
          const delay = BASE_DELAY * Math.pow(2, attempt)
          await new Promise(r => setTimeout(r, delay))
          continue
        }
        // Other error — don't retry
        return null
      }
    }

    console.error(`  Wayback API failed after ${MAX_RETRIES} retries for ${url}: ${lastErr?.message}`)
    return null
  })
}

module.exports = { findArchive }
