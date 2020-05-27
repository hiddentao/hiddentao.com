const fs = require('fs')
const get = require('lodash.get')
const path = require("path")
const grayMatter = require('gray-matter')
const { format: formatDate } = require('date-fns')

const PATH_TO_MD_PAGES = path.resolve('src/pages/markdown')
const { siteMetadata: { defaultLanguage } } = require('./gatsby-config')

const PAGE_TEMPLATE = path.resolve(`src/templates/pageTemplate.js`)
const ARCHIVES_TEMPLATE = path.resolve(`src/templates/archivesTemplate.js`)

const _getMarkdownNodeIdAndLanguage = node => {
  const relativePath = path.relative(PATH_TO_MD_PAGES, node.absolutePath)
  // e.g. static/code/my-project/en-gb.md => { pageType: static, pageId: code/my-project, lang: en-gb }
  const tok = relativePath.split('/')
  const pageType = tok[0]
  const mdfile = tok[tok.length - 1]
  const pageId = tok.slice(1, tok.length - 1).join('/')
  const lang = path.basename(mdfile, '.md')
  return { pageType, pageId, lang }
}

const _resolvePrismicLang = l => {
  switch (l) {
    case 'en-gb':
      return 'en'
    case 'zh-tw':
      return 'zh-TW'
    default:
      return l
  }
}

const _convertPrismicRawTextArrayToMarkdownString = lines => {
  let str = ''
  let inCodeBlock = false

  lines.forEach(({ text }) => {
    if (str.length) {
      str = `${str}${(inCodeBlock ? "\n" : "\n\n")}${text}`
    } else {
      str = text
    }

    if (text.includes('```')) {
      // end of code block
      if (text === '```') {
        inCodeBlock = false
      } else {
        inCodeBlock = true
      }
    }
  })

  return str
}

const _isPrismicBlogPostNode = n => (get(n, 'internal.type') === `PrismicBlogPost`)

const _isLocalMarkdownNode = n => (get(n, 'internal.mediaType') === `text/markdown` && !_isPrismicBlogPostNode(n))

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

exports.sourceNodes = ({ actions, createNodeId, createContentDigest, getNodes }) => {
  const { createNode} = actions

  getNodes().forEach(node => {
    let pageType
    let lang
    let pageId
    let title
    let date
    let draft
    const versions = []

    if (_isPrismicBlogPostNode(node)) {
      lang = _resolvePrismicLang(node.lang)

      if (defaultLanguage === lang) {
        pageType = 'blog'
        title = node.data.title.text
        pageId = node.data.slug.text
        date = formatDate(node.data.original_publish_date || node.first_publication_date, 'YYYY-MM-DD'),
        draft = false

        versions.push({
          lang,
          title,
          date,
          summary: _convertPrismicRawTextArrayToMarkdownString(node.data.summary.raw),
          markdown: _convertPrismicRawTextArrayToMarkdownString(node.data.body.raw),
        })

        get(node, 'alternate_languages', []).forEach(({ id }) => {
          const n = getNodes().find(({ prismicId }) => prismicId === id)

          if (n) {
            versions.push({
              lang: _resolvePrismicLang(n.lang),
              title: n.data.title.text,
              date: formatDate(n.data.original_publish_date || n.first_publication_date, 'YYYY-MM-DD'),
              summary: _convertPrismicRawTextArrayToMarkdownString(n.data.summary.raw),
              markdown: _convertPrismicRawTextArrayToMarkdownString(n.data.body.raw),
            })
          }
        })
      }
    } else if (_isLocalMarkdownNode(node)) {
      ; ({ pageType, pageId, lang } = _getMarkdownNodeIdAndLanguage(node))
      ; ({ data: { title, date, draft } } = _loadMarkdownFile(node))

      // if is default language node
      if (lang === defaultLanguage) {
        // generate all versions of the node (including itself)
        getNodes().forEach(n => {
          if (_isLocalMarkdownNode(n)) {
            const r = _getMarkdownNodeIdAndLanguage(n)

            if (r.pageId === pageId) {
              const gm = _loadMarkdownFile(n)

              versions.push({
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
    }

    if (title) {
      const pageData = {
        pageId,
        type: pageType,
        path: _generatePagePath({ pageType, pageId, date }),
        lang,
        date: formatDate(date, 'YYYY-MM-DD'),
        draft: !!draft,
        versions,
      }

      createNode({
        id: createNodeId(node.id),
        parent: node.id,
        children: [],
        ...pageData,
        internal: {
          mediaType: 'x-markdown',
          type: 'MarkdownPage',
          contentDigest: createContentDigest(pageData),
          description: `Markdown page: ${title}`,
        }
      })
    }
  })
}

exports.createPages = async ({ actions, graphql, getNode }) => {
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
    path: '/archives',
    component: ARCHIVES_TEMPLATE,
    context: {},
  })
}
