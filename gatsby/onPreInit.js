const { generateOgImage, initOgImageGenerator } = require('./common')

module.exports = async () => {
  await initOgImageGenerator()
  generateOgImage({ title: 'hiddentao.com', pageId: 'common' }) // common OG image
}
