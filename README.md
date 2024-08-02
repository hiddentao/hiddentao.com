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

## Deploy to production

```shell
npm run deploy
```
