const supportedLanguages = [
  { id: 'en', label: 'English' },
  // { id: 'zh-TW', label: '中文 (繁體)' },
  // { id: 'ml', label: 'മലയാളം' },
]
const defaultLanguage = 'en'

module.exports = {
  siteMetadata: {
    siteUrl: 'https://hiddentao.com',
    title: `Hiddentao Labs`,
    description: `Ram (Hiddentao Labs) is a software developer based in London, UK.`,
    author: `@hiddentao`,
    defaultLanguage,
    supportedLanguages,
  },
  plugins: [
    `gatsby-plugin-emotion`,
    `gatsby-plugin-react-helmet`,
    // process images
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        name: `images`,
        path: `${__dirname}/src/images`,
      },
    },
    `gatsby-transformer-sharp`,
    `gatsby-plugin-sharp`,
    // manifest file
    {
      resolve: `gatsby-plugin-manifest`,
      options: {
        name: `Hiddentao`,
        short_name: `hiddentao`,
        start_url: `/`,
        background_color: `#000`,
        theme_color: `#fff`,
        display: `minimal-ui`,
        legacy: false,
        include_favicon: false,
        theme_color_in_head: false,
        icons: [],
      },
    },
    // local pages
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        name: `markdown`,
        path: `${__dirname}/src/pages/markdown`,
      },
    },
    // datocms
    {
      resolve: `gatsby-source-datocms`,
      options: {
        // You can find your read-only API token under the Settings > API tokens
        // section of your administrative area:
        apiToken: process.env.DATOCMS_API_TOKEN,

        // If you are working on development/staging environment, you might want to
        // preview the latest version of records instead of the published one:
        previewMode: false,

        // Disable automatic reloading of content when some change occurs on DatoCMS:
        disableLiveReload: false,

        // Custom API base URL (most don't need this)
        apiUrl: 'https://site-api.datocms.com',
      },
    },
    // i18n
    // {
    //   resolve: `gatsby-plugin-intl`,
    //   options: {
    //     path: `${__dirname}/src/intl`,
    //     languages: supportedLanguages.map(l => l.id),
    //     defaultLanguage,
    //     redirect: false,
    //   },
    // },
    // sitemap
    {
      resolve: `gatsby-plugin-advanced-sitemap`,
      options: {
        query: `
          {
            posts: allSitemapNode(filter: { type: { eq: "blog" } }) {
              edges {
                node {
                  id
                  slug
                }
              }
            }
            pages: allSitemapNode(filter: { type: { eq: "static" } }) {
              edges {
                node {
                  id
                  slug
                }
              }
            }
          }
        `,
        mapping: {
          posts: {
            sitemap: `posts`,
          },
          pages: {
            sitemap: `pages`,
          },
        },
        exclude: [
          `/dev-404-page`,
          `/404`,
          `/404.html`,
        ],
        createLinkInHead: true, // optional: create a link in the `<head>` of your site
        addUncaughtPages: false, // optional: will fill up pages that are not caught by queries and mapping and list them under `sitemap-pages.xml`
      },
    },
    // feed
    {
      resolve: `gatsby-plugin-feed`,
      options: {
        // this base query will be merged with any queries in each feed
        query: `
          {
            site {
              siteMetadata {
                title
                description
                siteUrl
              }
            }
          }
        `,
        setup: ({ query: { site: { siteMetadata: { title, description, siteUrl } } } }) => ({
          title,
          description,
          feed_url: 'https://hiddentao.com/feed.xml',
          site_url: siteUrl,
          managingEditor: 'Ramesh Nair',
          webMaster: 'Ramesh Nair',
          copyright: 'Copyright HiddenTao Ltd. All Rights Reserved.',
        }),
        feeds: [
          {
            serialize: ({ query: { site, allMarkdownPage } }) => {
              return allMarkdownPage.nodes.map(node => {
                const { path: pagePath, lang } = node
                const { title, date, summary } = node.versions.find(v => {
                  return v.lang === lang
                })

                return Object.assign({}, {
                  date: new Date(date).toISOString(),
                  url: `${site.siteMetadata.siteUrl}${pagePath}`,
                  guid: `${site.siteMetadata.siteUrl}${pagePath}`,
                  title,
                  description: summary || title,
                })
              })
            },
            query: `
              {
                allMarkdownPage(filter: { type: { eq: "blog" }, draft: { ne: true } }, sort: { order:DESC, fields: date }, limit: 1000) {
                  nodes {
                    path
                    lang
                    versions {
                      lang
                      date
                      title
                      summary
                    }
                  }
                }
              }
            `,
            output: "/feed.xml",
            title: "Hiddentao blog",
          },
        ],
      },
    },
    // robots.txt
    {
      resolve: 'gatsby-plugin-robots-txt',
      options: {
        policy: [{ userAgent: '*', allow: '/' }]
      }
    }
  ],
}
