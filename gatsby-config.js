const supportedLanguages = ['en', 'zh-TW', 'ml']
const defaultLanguage = 'en'

module.exports = {
  siteMetadata: {
    siteUrl: 'https://hiddentao.com',
    title: `Hiddentao`,
    description: `Ramesh Nair's personal blog on technology and programming.`,
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
      },
    },
    // markdown-driven pages
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        name: `markdown`,
        path: `${__dirname}/src/pages/markdown`,
      },
    },
    // i18n
    {
      resolve: `gatsby-plugin-intl`,
      options: {
        path: `${__dirname}/src/intl`,
        languages: supportedLanguages,
        defaultLanguage,
        redirect: false,
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
          feed_url: 'http://feedpress.me/hiddentao',
          site_url: siteUrl,
          managingEditor: 'Ramesh Nair',
          webMaster: 'Ramesh Nair',
          copyright: 'Copyright HiddenTao Ltd. All Rights Reserved.',
        }),
        feeds: [
          {
            serialize: ({ query: { site, allFile } }) => {
              return allFile.nodes.map(node => {
                const { path: pagePath, lang } = node.fields.page
                const { title, date, summary } = node.fields.page.versions.find(v => {
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
                allFile( limit:1000, filter: { fields: { page: { type: { eq: "blog" } } } }, sort: { order:DESC, fields: fields___page___date } ) {
                  nodes {
                    fields {
                      page {
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
                }
              }
            `,
            output: "/feed.xml",
            title: "Hiddentao blog",
          },
        ],
      },
    },
  ],
}
