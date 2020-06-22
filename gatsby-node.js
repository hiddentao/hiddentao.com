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

const _resolveDatoCmsLang = l => {
  switch (l) {
    case 'en':
      return 'en'
    case 'zh':
      return 'zh-TW'
    default:
      return l
  }
}

const _isDatoCmsBlogPostNode = n => (get(n, 'internal.type') === `DatoCmsBlogPost`)

const _isLocalMarkdownNode = n => (get(n, 'internal.mediaType') === `text/markdown` && !get(n, 'internal.type').includes('Dato'))

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

const _createSitemapNode = ({ createNode, createNodeId, createContentDigest, slug, lang, pageType }) => {
  const id = createNodeId(`${slug}${lang}`)
  const finalSlug = (lang !== defaultLanguage ? `/${lang}${slug}` : slug)

  createNode({
    id,
    slug: finalSlug,
    type: pageType,
    children: [],
    internal: {
      mediaType: 'x-sitemap-node',
      type: 'SitemapNode',
      contentDigest: createContentDigest({ id, finalSlug }),
      description: `Sitemap node: ${finalSlug}`,
    }
  })
}


exports.sourceNodes = ({ actions, createNodeId, createContentDigest, getNodes }) => {
  const { createNode} = actions
  const sitemapNodeCallProps = { createNode, createNodeId, createContentDigest }

  const allNodes = getNodes()

  allNodes.forEach(node => {
    let pageType
    let lang
    let pageId
    let title
    let slug
    let date
    let draft
    const versions = []

    if (_isDatoCmsBlogPostNode(node)) {
      lang = _resolveDatoCmsLang(node.locale)

      if (defaultLanguage === lang) {
        pageType = 'blog'
        title = node.title
        pageId = node.slug
        date = formatDate(node.date, 'YYYY-MM-DD'),
        draft = false
        slug = _generatePagePath({ pageType, pageId, date })

        _createSitemapNode({ ...sitemapNodeCallProps, slug, lang, pageType })

        versions.push({
          lang,
          title,
          date,
          summary: node.summary,
          markdown: node.body,
        })

        // check for other locales
        const idPrefix = node.id.substr(0, node.id.indexOf(node.locale))

        allNodes.forEach(n => {
          if (n.id.startsWith(idPrefix) && n.id !== node.id && n.title) {
            console.log(node.id, n.id, n)
            const l = _resolveDatoCmsLang(n.locale)

            _createSitemapNode({ ...sitemapNodeCallProps, slug, lang: l, pageType })

            versions.push({
              lang: l,
              title: n.title,
              date: formatDate(n.date, 'YYYY-MM-DD'),
              summary: n.summary,
              markdown: n.body,
            })
          }
        })

        get(node, 'alternate_languages', []).forEach(({ id }) => {
          const n = getNodes().find(({ prismicId }) => prismicId === id)
        })
      }
    } else if (_isLocalMarkdownNode(node)) {
      const ln = _getMarkdownNodeIdAndLanguage(node)

      // if is default language node
      if (ln.lang === defaultLanguage) {
        ; ({ pageType, pageId, lang } = ln)
        ; ({ data: { title, date, draft } } = _loadMarkdownFile(node))

        slug = _generatePagePath({ pageType, pageId, date })

        _createSitemapNode({ ...sitemapNodeCallProps, slug, lang, pageType })

        // generate all versions of the node (including itself)
        getNodes().forEach(n => {
          if (_isLocalMarkdownNode(n)) {
            const r = _getMarkdownNodeIdAndLanguage(n)

            if (r.pageId === pageId) {
              const gm = _loadMarkdownFile(n)

              _createSitemapNode({ ...sitemapNodeCallProps, slug, lang: r.lang, pageType })

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

    if (title && slug) {
      const pageData = {
        pageId,
        type: pageType,
        path: slug,
        slug,
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
    path: '/blog',
    component: ARCHIVES_TEMPLATE,
    context: {},
  })
}
