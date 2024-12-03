const path = require('path')

const ARCHIVES_TEMPLATE = path.join(__dirname, `../src/templates/archivesTemplate.js`)
const PAGE_TEMPLATE = path.join(__dirname, `../src/templates/pageTemplate.js`)
const { siteMetadata: { defaultLanguage } } = require('../gatsby-config')

const _wrapGraphql = graphql => async str => {
  const result = await graphql(str)
  if (result.errors) {
    throw result.errors
  }
  return result
}

const _createMarkdownPages = ({ pages, getNode, createPage }, cb) => {
  pages.forEach(({ id }, index) => {
    const node = getNode(id)
    const { path: pagePath, lang } = node

    if (defaultLanguage === lang) {
      createPage({
        path: pagePath,
        component: PAGE_TEMPLATE,
        context: {
          id,
          ...(cb ? cb(index, node) : null)
        },
      })
    }
  })
}

module.exports = async ({ actions, graphql, getNode }) => {
  const { createPage } = actions
  const _graphql = _wrapGraphql(graphql)

  // fetch the blog posts in reverse chronological order so that we can have
  // them know where they sit in the chain
  const { data: { allMarkdownPage: { nodes: blogPages } } } = await _graphql(`
    {
      allMarkdownPage(filter: { type: { eq: "blog" }, draft: { ne: true } }, sort: { order:DESC, fields: date }) {
        nodes {
          id
        }
      }
    }
  `)
  _createMarkdownPages({ pages: blogPages, getNode, createPage }, index => {
    const newerPageId = 0 < index ? blogPages[index - 1].id : null
    const olderPageId = (blogPages.length - 1) > index ? blogPages[index + 1].id : null
    return { newerPageId, olderPageId }
  })

  const { data: { allMarkdownPage: { nodes: staticPages } } } = await _graphql(`
    {
      allMarkdownPage(filter: { type: { eq: "static" } }) {
        nodes {
          id
        }
      }
    }
  `)
  _createMarkdownPages({ pages: staticPages, getNode, createPage })

  createPage({
    path: '/blog',
    component: ARCHIVES_TEMPLATE,
    context: {},
  })

  const { createRedirect } = actions;

  // Redirects
  const redirectPaths = {
    '/squel/api.html': 'https://hiddentao.github.io/squel/api.html',
    '/squel': 'https://hiddentao.github.io/squel',
    '/archives': '/blog',
    '/code/wordpress-page-tagger-plugin/': 'https://github.com/hiddentao/page-tagger',
    '/code/wordpress-page-tags-plugin/': 'https://github.com/hiddentao/page-tagger',
    '/code/wordpress-server-info-plugin/': 'https://github.com/hiddentao',
    '/code/common-utils/': 'https://github.com/hiddentao',
    '/code/wordpress-randomhello-plugin/': 'https://github.com/hiddentao',
    '/archives/tag/code/': '/blog',
    '/code/3d-graphics/': 'https://github.com/hiddentao',
    '/about/': '/',
  }
  for (const [fromPath, toPath] of Object.entries(redirectPaths)) {
    createRedirect({
      fromPath,
      toPath,
      isPermanent: true,
    })
  }
}


