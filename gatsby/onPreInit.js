const { generateOgImage, initOgImageGenerator } = require('./common')

module.exports = async () => {
  await initOgImageGenerator()
  generateOgImage({ title: 'hiddentao.vc', pageId: 'common' }) // common OG image
}
