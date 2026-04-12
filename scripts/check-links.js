#!/usr/bin/env node

const fs = require('fs')
const path = require('path')
const { walkMarkdownFiles } = require('./lib/walker')
const { extractUrls, classifyUrl, decodeHtmlEntities } = require('./lib/extractor')
const { resolveLocalPath, resolveInternalUrl } = require('./lib/localResolver')
const { checkUrl, isSuspiciousContent } = require('./lib/validator')
const { findArchive } = require('./lib/archiver')
const { rewriteFile } = require('./lib/rewriter')

// ANSI color helpers
const C = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  cyan: '\x1b[36m',
  dim: '\x1b[2m',
  bold: '\x1b[1m',
}

// ---------------------------------------------------------------------------
// Simple concurrency limiter (avoids adding a dependency)
// ---------------------------------------------------------------------------
function pLimit(concurrency) {
  let active = 0
  const queue = []
  function next() {
    if (active >= concurrency || queue.length === 0) return
    active++
    const { fn, resolve, reject } = queue.shift()
    fn().then(resolve, reject).finally(() => { active--; next() })
  }
  return function limit(fn) {
    return new Promise((resolve, reject) => {
      queue.push({ fn, resolve, reject })
      next()
    })
  }
}

// ---------------------------------------------------------------------------
// Parse CLI args
// ---------------------------------------------------------------------------
function parseArgs() {
  const args = process.argv.slice(2)
  const opts = {
    noWrite: false,
    glob: null,
    limit: Infinity,
    concurrency: 8,
  }
  for (const arg of args) {
    if (arg === '--no-write') opts.noWrite = true
    else if (arg.startsWith('--glob=')) opts.glob = arg.split('=')[1]
    else if (arg.startsWith('--limit=')) opts.limit = parseInt(arg.split('=')[1], 10)
    else if (arg.startsWith('--concurrency=')) opts.concurrency = parseInt(arg.split('=')[1], 10)
    else if (arg === '--help' || arg === '-h') {
      console.log(`
Usage: node scripts/check-links.js [options]

Options:
  --no-write       Dry run: report only, don't modify files
  --glob=PATTERN   Only process files whose path contains PATTERN
  --limit=N        Only check the first N unique URLs
  --concurrency=N  Max parallel HTTP requests (default: 8)
  -h, --help       Show this help
`)
      process.exit(0)
    }
  }
  return opts
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------
async function main() {
  const opts = parseArgs()
  console.log(`${C.bold}Link Checker for hiddentao.com${C.reset}`)
  console.log(`  Mode: ${opts.noWrite ? 'report only (--no-write)' : 'in-place rewrite'}`)
  if (opts.glob) console.log(`  Filter: ${opts.glob}`)
  if (opts.limit < Infinity) console.log(`  Limit: ${opts.limit} URLs`)
  console.log()

  // 1. Walk files and extract URLs
  console.log(`${C.dim}Scanning markdown files...${C.reset}`)
  const files = walkMarkdownFiles({ globFilter: opts.glob })
  console.log(`  Found ${files.length} markdown files\n`)

  // Build a per-file map: filePath → [extracted entries]
  const fileEntries = new Map()
  for (const file of files) {
    const entries = extractUrls(file)
    if (entries.length > 0) {
      fileEntries.set(file.filePath, { file, entries })
    }
  }

  // Build a global deduplicated URL → classification + check-result map
  const urlMap = new Map() // url → { classification, entries: [{filePath, ...}] }
  for (const [filePath, { entries }] of fileEntries) {
    for (const entry of entries) {
      const url = entry.classification.normalized || entry.url
      if (!urlMap.has(url)) {
        urlMap.set(url, { classification: entry.classification, entries: [] })
      }
      urlMap.get(url).entries.push({ ...entry, filePath })
    }
  }

  console.log(`  Found ${urlMap.size} unique URLs across all files\n`)

  // 2. Check URLs
  const globalLimit = pLimit(opts.concurrency)
  const hostLimits = new Map()
  function getHostLimit(url) {
    try {
      const host = new URL(url).hostname
      if (!hostLimits.has(host)) {
        hostLimits.set(host, pLimit(2))
      }
      return hostLimits.get(host)
    } catch {
      return globalLimit
    }
  }
  const waybackLimit = pLimit(2)

  const results = new Map() // url → { status, httpStatus, title, reason, archiveUrl, ... }
  let checkedCount = 0
  let limitedCount = 0

  const urlsToCheck = [...urlMap.entries()]
  const promises = []

  for (const [url, info] of urlsToCheck) {
    if (limitedCount >= opts.limit) break
    limitedCount++

    const { classification } = info

    const promise = (async () => {
      let result

      if (classification.kind === 'relative') {
        // Local filesystem check only
        const localResult = resolveLocalPath(url)
        result = {
          status: localResult.valid ? 'ok' : 'invalid',
          reason: localResult.reason,
          local: true,
        }
      } else if (classification.kind === 'internal') {
        // hiddentao.com URL: check local filesystem first
        const localResult = resolveInternalUrl(url)
        if (localResult.valid) {
          result = { status: 'ok', reason: localResult.reason, local: true }
        } else {
          // Local route doesn't exist — check Wayback
          const archive = await findArchive(url, { limit: waybackLimit })
          result = {
            status: 'invalid',
            reason: localResult.reason,
            local: true,
            archiveUrl: archive?.archiveUrl || null,
            archiveTimestamp: archive?.timestamp || null,
          }
        }
      } else {
        // External URL: HTTP check
        const hostLimit = getHostLimit(url)
        const checkResult = await globalLimit(() =>
          checkUrl(url, { perHostLimit: hostLimit })
        )

        result = { ...checkResult }

        // Title overlap heuristic — treat suspicious as invalid
        if (result.status === 'ok' && result.title) {
          const linkTexts = info.entries.map(e => e.text).filter(Boolean)
          for (const text of linkTexts) {
            if (isSuspiciousContent(text, result.title)) {
              result.status = 'invalid'
              result.reason = `title mismatch (link: "${text}", page: "${result.title}")`
              break
            }
          }
        }

        // If invalid, look up Wayback archive
        if (result.status === 'invalid') {
          const archive = await findArchive(url, { limit: waybackLimit })
          result.archiveUrl = archive?.archiveUrl || null
          result.archiveTimestamp = archive?.timestamp || null
        }
      }

      results.set(url, result)
      checkedCount++

      // Progress indicator
      if (checkedCount % 10 === 0) {
        process.stdout.write(`\r  Checked ${checkedCount} URLs...`)
      }
    })()

    promises.push(promise)
  }

  await Promise.all(promises)
  if (checkedCount > 0) {
    process.stdout.write(`\r  Checked ${checkedCount} URLs\n\n`)
  }

  // 3. Build report and apply rewrites
  const report = {
    summary: { files: 0, urls: 0, ok: 0, invalid: 0, rewritten: 0, delinked: 0, localOk: 0, localBroken: 0 },
    files: {},
  }

  const allReplacements = new Map() // filePath → [{rawOffset, rawLength, newUrl}]

  for (const [filePath, { file, entries }] of fileEntries) {
    const fileReport = []
    const countedUrls = new Set() // track unique URLs per file for summary counts

    for (const entry of entries) {
      const url = entry.classification.normalized || entry.url
      const result = results.get(url)
      if (!result) continue

      const reportEntry = {
        url,
        text: entry.text,
        source: entry.source,
        status: result.status,
        reason: result.reason || '',
        archiveUrl: result.archiveUrl || null,
      }
      fileReport.push(reportEntry)

      // Count each unique URL only once for summary stats
      const isNew = !countedUrls.has(url)
      if (isNew) {
        countedUrls.add(url)
        report.summary.urls++

        if (result.local && result.status === 'ok') {
          report.summary.localOk++
        } else if (result.status === 'ok') {
          report.summary.ok++
        } else if (result.status === 'invalid') {
          report.summary.invalid++
          report.summary.rewritten++
          if (!result.archiveUrl) {
            report.summary.delinked++
          }
        }
      }

      // Queue ALL occurrences for rewriting (even duplicates need replacement)
      if (result.status === 'invalid') {
        const newUrl = result.archiveUrl || 'no-longer-valid'
        if (!allReplacements.has(filePath)) {
          allReplacements.set(filePath, [])
        }
        allReplacements.get(filePath).push({
          rawOffset: entry.rawOffset,
          rawLength: entry.rawLength,
          newUrl,
          oldUrl: entry.rawUrl || url,
        })
      }
    }

    if (fileReport.length > 0) {
      report.summary.files++
      const relPath = path.relative(path.resolve(__dirname, '..'), filePath)
      report.files[relPath] = fileReport
    }
  }

  // 4. Print console report
  console.log(`${C.bold}Results:${C.reset}\n`)

  for (const [relPath, entries] of Object.entries(report.files)) {
    console.log(`${C.bold}${relPath}${C.reset}`)

    // Deduplicate by URL for console display (JSON report keeps all occurrences)
    const seen = new Set()
    for (const entry of entries) {
      if (seen.has(entry.url)) continue
      seen.add(entry.url)

      const urlDisplay = entry.url.length > 80 ? entry.url.substring(0, 77) + '...' : entry.url
      switch (entry.status) {
        case 'ok':
          console.log(`  ${C.green}OK${C.reset}       ${C.dim}${urlDisplay}${C.reset}`)
          break
        case 'invalid':
          if (entry.archiveUrl) {
            console.log(`  ${C.cyan}REWROTE${C.reset}  ${urlDisplay}`)
            console.log(`  ${C.dim}         → ${entry.archiveUrl}${C.reset}`)
          } else {
            console.log(`  ${C.cyan}DELINKED${C.reset} ${urlDisplay}`)
            console.log(`  ${C.dim}         → no-longer-valid${C.reset}`)
          }
          break
      }
    }
    console.log()
  }

  // 5. Apply rewrites (unless --no-write)
  const s = report.summary
  if (!opts.noWrite && allReplacements.size > 0) {
    console.log(`${C.bold}Applying ${s.rewritten} replacements across ${allReplacements.size} files...${C.reset}`)
    for (const [filePath, replacements] of allReplacements) {
      const raw = fs.readFileSync(filePath, 'utf-8')
      const ok = rewriteFile(filePath, raw, replacements)
      if (ok) {
        const relPath = path.relative(path.resolve(__dirname, '..'), filePath)
        console.log(`  ${C.green}✓${C.reset} ${relPath} (${replacements.length} URLs)`)
      }
    }
    console.log()
  } else if (opts.noWrite && s.rewritten > 0) {
    console.log(`${C.dim}(dry run — run without --no-write to apply ${s.rewritten} replacements)${C.reset}\n`)
  }

  // 6. Write JSON report
  const reportPath = path.resolve(__dirname, '../link-check-report.json')
  fs.writeFileSync(reportPath, JSON.stringify(report, null, 2))
  console.log(`${C.dim}Full report written to link-check-report.json${C.reset}\n`)

  // Final stats
  console.log(`${C.bold}Summary:${C.reset} ${s.files} files, ${s.urls} URLs`)
  console.log(`  ${C.green}OK:${C.reset}            ${s.ok + s.localOk} (${s.localOk} local)`)
  console.log(`  ${C.red}Invalid:${C.reset}       ${s.invalid}`)
  console.log(`  ${C.cyan}Rewritten:${C.reset}     ${s.rewritten - s.delinked} (archived)`)
  console.log(`  ${C.cyan}Delinked:${C.reset}      ${s.delinked} (no archive)`)
}

main().catch(err => {
  console.error(`\n${C.red}Fatal error:${C.reset}`, err)
  process.exit(2)
})
