const fs = require('fs')
const path = require("path")
const grayMatter = require('gray-matter')

const PATH_TO_MD_PAGES = path.resolve('src/pages/markdown')
const { siteMetadata: { defaultLanguage } } = require('./gatsby-config')

const PAGE_TEMPLATE = path.resolve(`src/templates/pageTemplate.js`)
const ARCHIVES_TEMPLATE = path.resolve(`src/templates/archivesTemplate.js`)

const _getMarkdownNodeIdAndLanguage = node => {
  const relativePath = path.relative(PATH_TO_MD_PAGES, node.absolutePath)
  // e.g. static/code/my-project/en.md => { pageType: static, pageId: code/my-project, lang: en }
  const tok = relativePath.split('/')
  const pageType = tok[0]
  const mdfile = tok[tok.length - 1]
  const pageId = tok.slice(1, tok.length - 1).join('/')
  const lang = path.basename(mdfile, '.md')
  return { pageType, pageId, lang }
}

const _isMarkdownNode = n => n.internal.mediaType === `text/markdown`

const _loadMarkdownFile = n => grayMatter(fs.readFileSync(n.absolutePath, 'utf-8').toString())

const _generatePagePath = ({ pageType, pageId, date }) => {
  if ('blog' === pageType) {
    const [ year, month, day ] = date.split('-')
    return `/archives/${year}/${month}/${day}/${pageId}`
  } else {
    return `/${pageId}`
  }
}

const _wrapGraphql = graphql => async str => {
  const result = await graphql(str)
  if (result.errors) {
    throw result.errors
  }
  return result
}

const _createMarkdownPages = ({ pages, getNode, createPage }, cb) => {
  pages.forEach(({ id, relativePath }, index) => {
    const node = getNode(id)
    const { fields: { page: { path: pagePath, lang } } } = node

    if (defaultLanguage === lang) {
      createPage({
        path: pagePath,
        component: PAGE_TEMPLATE,
        context: {
          relativePath,
          ...(cb ? cb(index, node) : null)
        },
      })
    }
  })
}

exports.onCreateNode = ({ node, actions, getNodes }) => {
  const { createNodeField } = actions

  if (_isMarkdownNode(node)) {
    const { pageType, pageId, lang } = _getMarkdownNodeIdAndLanguage(node)
    const { data: { title, date, draft }, content: body } = _loadMarkdownFile(node)

    const pageData = {
      pageId,
      type: pageType,
      path: _generatePagePath({ pageType, pageId, date }),
      lang,
      date,
      draft: !!draft,
      versions: []
    }

    // if is default language node
    if (lang === defaultLanguage) {
      // generate all versions of the node (including itself)
      getNodes().forEach(n => {
        if (_isMarkdownNode(n)) {
          const r = _getMarkdownNodeIdAndLanguage(n)

          if (r.pageId === pageId) {
            const gm = _loadMarkdownFile(n)

            pageData.versions.push({
              lang: r.lang,
              summary: gm.data.summary,
              title: gm.data.title,
              date: gm.data.date,
              markdown: gm.content,
            })
          }
        }
      })
    }

    createNodeField({
      node,
      name: 'page',
      value: pageData,
    })
  }

  return node
}

exports.createPages = async ({ actions, graphql, getNode }) => {
  const { createPage, createNodeField } = actions
  const _graphql = _wrapGraphql(graphql)

  // fetch the blog posts in reverse chronological order so that we can have
  // them know where they sit in the chain
  const { data: { allFile: { nodes: blogPages } } } = await _graphql(`
    {
      allFile( filter: { fields: { page: { type: { eq: "blog" }, draft: { ne: true } } } }, sort: { order:DESC, fields: fields___page___date } ) {
        nodes {
          id
          relativePath
        }
      }
    }
  `)
  _createMarkdownPages({ pages: blogPages, getNode, createPage }, index => {
    const newerPageId = 0 < index ? blogPages[index - 1].id : null
    const olderPageId = (blogPages.length - 1) > index ? blogPages[index + 1].id : null
    return { newerPageId, olderPageId }
  })

  const { data: { allFile: { nodes: staticPages } } } = await _graphql(`
    {
      allFile( filter: { fields: { page: { type: { eq: "static" } } } } ) {
        nodes {
          id
          relativePath
        }
      }
    }
  `)
  _createMarkdownPages({ pages: staticPages, getNode, createPage })

  createPage({
    path: '/archives',
    component: ARCHIVES_TEMPLATE,
    context: {},
  })
}
