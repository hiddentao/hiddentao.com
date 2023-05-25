const path = require('path')
const fs = require('fs')
const { UltimateTextToImage, getCanvasImage } = require("ultimate-text-to-image")
const { mkdirp } = require('mkdirp')

const { siteMetadata: { defaultLanguage } } = require('../gatsby-config')

const generated = {}

let ogiBgImg

exports.initOgImageGenerator = async () => {
  const data = fs.readFileSync(path.join(__dirname, '..', 'static', 'bg.png'))
  return getCanvasImage({ buffer: data }).then(img => {
    ogiBgImg = img
  })
}

exports.generateOgImage = ({ title, pageId, lang }) => {
  if (pageId.endsWith('/')) {
    pageId = pageId.slice(0, -1)
  }

  const finalPageId = lang === defaultLanguage ? pageId : `${pageId}-${lang}`

  if (!generated[finalPageId]) {
    const dPath = path.join(__dirname, '..', 'static', 'ogi')

    mkdirp.sync(dPath)
    
    new UltimateTextToImage(title, {
      width: 527,
      height: 351,
      fontFamily: "Arial",
      fontColor: "#ffffff",
      fontSize: 52,
      minFontSize: 10,
      lineHeight: 50,
      autoWrapLineHeightMultiplier: 1.2,
      margin: 20,
      marginBottom: 40,
      align: "center",
      valign: "middle",
      images: [
        { canvasImage: ogiBgImg, repeat: "fit" }
      ]
    }).render().toFile(path.join(dPath, `${finalPageId}.png`)) 

    generated[finalPageId] = `/ogi/${finalPageId}.png`
  }

  return generated[finalPageId]
}
