# hiddentao.com website

Live: https://hiddentao.com

## Development

_Note: pre-builds for `node-canvas` aren't available for arm64 MacOS, so you'll need to [build it yourself](https://github.com/Automattic/node-canvas/wiki/Installation%3A-Mac-OS-X)_

To start dev server:

```shell
export DATOCMS_API_TOKEN=...
npm start
```

To just build:

```shell
npm run build
```

## Check links

Scan all markdown blog posts for broken URLs. Dead links are automatically replaced with Wayback Machine archive URLs where available. Links with no archive get their URL set to `no-longer-valid`, which the site renders as an `<abbr>` tooltip.

```shell
node scripts/check-links.js
```

Options:

- `--no-write` — dry run, report only without modifying files
- `--glob=PATTERN` — only process files whose path contains PATTERN
- `--limit=N` — only check the first N unique URLs
- `--concurrency=N` — max parallel HTTP requests (default: 8)

Results are written to `link-check-report.json`.

## Deploy to production

```shell
npm run deploy
```
