const fs = require('fs')
const path = require('path')

/**
 * Rewrite a markdown file in place, replacing URLs at known offsets.
 *
 * @param {string} filePath - absolute path to the .md file
 * @param {string} raw - original file content
 * @param {Array<{rawOffset: number, rawLength: number, newUrl: string}>} replacements
 *   sorted by rawOffset ascending by the caller (we reverse internally)
 */
function rewriteFile(filePath, raw, replacements) {
  if (!replacements.length) return false

  // Sort descending by offset so earlier splices don't shift later ones
  const sorted = [...replacements].sort((a, b) => b.rawOffset - a.rawOffset)

  let content = raw
  for (const { rawOffset, rawLength, newUrl } of sorted) {
    const before = content.substring(0, rawOffset)
    const after = content.substring(rawOffset + rawLength)
    content = before + newUrl + after
  }

  // Atomic write: write to temp then rename
  const tmpPath = filePath + '.tmp'
  fs.writeFileSync(tmpPath, content, 'utf-8')
  fs.renameSync(tmpPath, filePath)

  return true
}

module.exports = { rewriteFile }
