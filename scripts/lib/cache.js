const fs = require('fs')
const path = require('path')

const CACHE_PATH = path.resolve(__dirname, '../../.link-check-cache.json')
const TTL_OK = 7 * 24 * 60 * 60 * 1000      // 7 days
const TTL_INVALID = 1 * 24 * 60 * 60 * 1000  // 1 day
const FLUSH_INTERVAL = 20

class LinkCache {
  constructor({ disabled = false } = {}) {
    this.disabled = disabled
    this.data = {}
    this._dirty = 0
    if (!disabled) this._load()
  }

  _load() {
    try {
      this.data = JSON.parse(fs.readFileSync(CACHE_PATH, 'utf-8'))
    } catch {
      this.data = {}
    }
  }

  get(url) {
    if (this.disabled) return null
    const entry = this.data[url]
    if (!entry) return null
    const age = Date.now() - new Date(entry.checkedAt).getTime()
    const ttl = entry.status === 'ok' ? TTL_OK : TTL_INVALID
    if (age > ttl) return null
    return entry
  }

  set(url, entry) {
    if (this.disabled) return
    this.data[url] = { ...entry, checkedAt: new Date().toISOString() }
    this._dirty++
    if (this._dirty >= FLUSH_INTERVAL) this.flush()
  }

  flush() {
    if (this.disabled || this._dirty === 0) return
    fs.writeFileSync(CACHE_PATH, JSON.stringify(this.data, null, 2))
    this._dirty = 0
  }
}

module.exports = { LinkCache }
