---
title: Building a multi-lingual static site with Gatsby
date: '2019-05-07'
---

**NOTE: The [gatsby-plugin-intl](https://www.gatsbyjs.org/packages/gatsby-plugin-intl/) plugin no longer works 
with the latest version of Gatsby, so I've disabled it for now.**

This past week I ported hiddentao.com (the site you're reading this on)
from Jekyll + Github pages over to
[Gatsby](https://www.gatsbyjs.org) + [Zeit](https://zeit.co). This change had been a
long-time coming. The major reason for re-doing my site was to add support for
multi-lingual posts. I chose Gatsby as the static site generator because it's
built in React (which I use for my work daily) and thus enables an SPA (single-page
app) experience out of the box. In this post I will outline the customizations
I had to make in order to get Gatsby working the way I wanted.

However, before I do that, a short note on why I moved from Github pages to Zeit for
hosting my site. Github pages [supports Jekyll](https://help.github.com/en/articles/using-jekyll-as-a-static-site-generator-with-github-pages) out of the box, which is why I had been
hosting my site there until now. Once I switched to Gatsby I
did initially try hosting the new site through Github pages as well (by storing
publishable assets in a Git repo) but quickly realized that didn't make
much sense since output changed considerably between builds.

Every publish commit was turning out to be huge, and being able to go back in
history via Git commits wasn't a big enough benefit to out-weigh the cost.
It seemed to me that the ability to go back in history made less sense in the
generated output and more sense in the source code, and thus I didn't really
need to use Git to publish the
site. Since I was already using Zeit for other sites I'm hosting, it was a
natural alternative choice. It also simplified my continous deployment flow
as I no longer needed to push code back up to Github in order to deploy.

## Setting up Gatsby for i18n

Now let's dive into how I setup the site using Gatsby. I followed the
official [Quick Start](https://www.gatsbyjs.org/docs/quick-start) guide to
get a simple Gastby site up and running. I decided to work on adding i18n support
straight away. A quick search revealed
[gatsby-plugin-intl](https://www.gatsbyjs.org/packages/gatsby-plugin-intl/) to
be the best choice for this.

I had a few requirements that needed to be met:

* All existing blog posts and pages from my current site had to retain their
URLs (to avoid broken incoming links as well as to retain Disqus comments on
blog posts).
* Each different language version of each page needed to have its own URL,
following a predictable URL pattern. Luckily `gatsby-plugin-intl` already
took care of this.
* If a given post or page didn't exist in a given language then it was to fall
back to showing the default language (English) version.

Inside `gatsby-config.js` I setup `gatsby-plugin-intl`:

```js
const supportedLanguages = [
  { id: 'en', label: 'English' },
  { id: 'zh-TW', label: '中文 (繁體)' },
]
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
  plugins: {
    ...
    // i18n
    {
      resolve: `gatsby-plugin-intl`,
      options: {
        path: `${__dirname}/src/intl`,
        languages: supportedLanguages,
        defaultLanguage,
        // This prevents gatsby-plugin-intl from auto-redirecting to default language versions
        redirect: false,
      },
    },
    ...
  }
}
```

The `src/intl` directory contains translated strings for each language.
These would be the strings used for buttons, nav items, etc and NOT page
content. Here is the `src/intl/en.json` (English) language file
(initially I've just got strings for the language changing button):

```
{
  "en": "English",
  "zh-TW": "Chinese (Trad.)",
  "change-language": "Change language"
}
```

And the `src/intl/zh-TW.json` (Traditional Chinese) equivalent:

```
{
  "en": "英文",
  "zh-TW": "中文 (繁體)",
  "change-language": "換語言"
}
```

## Multi-lingual markdown nodes

My existing content was in Markdown, and luckily Gatsby already has good support
for handling this. However, I quickly realized that in order to meet my above
requirements with respect to i18n I needed more control over Gatsby' internal
page generation process. Specifically, I needed to control when and where the
Markdown got transformed into HTML.

I decided that my Markdown files would sit under the following directory trees:

```
src/pages/markdown
  /blog     <-- contains blog posts (like this one you're reading)
  /static   <-- contains static pages, e.g. "about", "code", "talks"
```

Within a given tree (either `blog` or `layout`), a page would be represented
by a folder containing files, each of which represented the given page in a
different language. For example, the `about` page would be stored in the file
system as:

```
src/pages/markdown/static/about
  /en.md      <-- English version
  /zh-TW.md   <-- Chinese (traditional) version
```

Once generated the above two versions of `about` would be available at the following
URL paths:

```
/about            <- English version
/zh-TW/about      <- Chinese (traditional) version
```

Inside `gatsby-config.js` I added a resolver to _collect_ all files under the
`src/pages/markdown` tree:

```js
// gatsby-config.js
{
  ...
  plugins: [
    ...
    // markdown-driven pages
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        name: `markdown`,
        path: `${__dirname}/src/pages/markdown`,
      },
    },
    ...
  ]
}
```

Then, inside `gatsby-node.js` I hook into various [Gatsby Node APIs](https://www.gatsbyjs.org/docs/node-apis) to actually process the markdown files.

```js
/*
Create internal node representations of each Markdown file
 */
exports.onCreateNode = ({ node, actions, getNodes }) => {
  const { createNodeField } = actions

  if (_isMarkdownNode(node)) {
    // pageType = "blog" or "static"
    // pageId = page slug
    // lang = "en" or "zh-TW"
    const { pageType, pageId, lang } = _getMarkdownNodeIdAndLanguage(node)

    // these values are extracted from within the markdown
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

    // if is default language node then load in versions in other languages
    if (lang === defaultLanguage) {
      // generate all versions of the node (including default language version)
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

    // this adds all the data above to Gatsby's internal representation of the node
    createNodeField({
      node,
      name: 'page',
      value: pageData,
    })
  }

  return node
}
```

_Note: To see the implementation of `_isMarkdownNode()` and other methods please
see the [full source code](https://github.com/hiddentao/hiddentao.com/blob/master/gatsby-node.js)._

Let's say the `about` page has the following two language versions:

* `src/pages/markdown/static/about/en.md`:

```md
---
title: About me
summary: Me
date: '2019-01-01'
---
**This** is _me_.
```

* `src/pages/markdown/static/about/zh-TW.md`:

```md
---
title: 關於我
summary: 我
date: '2019-01-02'
---
**這** 是 _我_.
```

The `onCreateNode` method described above would generate the following `pageData`:

```js
{
  pageId: "about",
  type: "static",
  path: "/about",
  lang: "en"
  date: "2019-01-01",
  draft: false,
  versions: [
    {
      lang: "en",
      summary: "Me",
      title: "About me"
      date: "2019-01-01",,
      markdown: "**This** is _me_."
    },
    {
      lang: "zh-TW",
      summary: "我",
      title: "關於我"
      date: "2019-01-02",,
      markdown: "**這** 是 _我_."
    }
  ]
}
```

Thus, when it comes time to generate this page the `pageData` node field
contains _all_ the information needed to generate this page in all its supported
languages.

Note that if a `zh-TW` version of the page wasn't available then the
corresponding entry inside the `versions` array above would not exist. Thus,
at render time I ensure I fall back to the available default language version
where needed.

## Generating multi-lingual pages

Inside `gatsby-node.js` I implement the [createPages API](https://www.gatsbyjs.org/docs/node-apis/#createPages) to generates pages from the node objects:

```js
exports.createPages = async ({ actions, graphql, getNode }) => {
  const { createPage, createNodeField } = actions

  // fetch the blog posts in reverse chronological order so that we can have
  // them know where they sit in the chain
  const { data: { allFile: { nodes: blogPages } } } = await graphql(`
    {
      allFile( filter: { fields: { page: { type: { eq: "blog" } } } }, sort: { order:DESC, fields: fields___page___date } ) {
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

  // now let's generate the static pages
  const { data: { allFile: { nodes: staticPages } } } = await graphql(`
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
}
```

The first thing to note is that even if there are multiple language versions of a
given page, the code only generates a single page - one representing the
default language version. Thus, taking our example _about_ page above, the code
tells Gatsb to generate the `/about` version but not the `/zh-TW/about` version.
This is because the `gatsby-plugin-intl` plugin internally ensures that
the `/zh-TW/about` relative URL will be available regardless.

```js
const _createMarkdownPages = ({ pages, getNode, createPage }, cb) => {
  pages.forEach(({ id, relativePath }, index) => {
    const node = getNode(id)
    const { fields: { page: { path: pagePath, lang } } } = node

    if (defaultLanguage === lang) {
      createPage({
        path: pagePath,
        component: path.resolve(`src/templates/pageTemplate.js`),
        context: {
          relativePath,
          ...(cb ? cb(index, node) : null)
        },
      })
    }
  })
}
```

The `_createMarkdownPages` function above uses the page template to actually
generate the pages. It accepts a callback as a final parameter - the output
of this callback is merged into the page `context`. This context can then be
used in the graphql query within the page template load in additional data for
the page:

```js
export const pageQuery = graphql`
  fragment FileFields on File {
    fields {
      page {
        path
        type
        lang
        versions {
          lang
          date
          title
          markdown
        }
      }
    }
  }

  query($relativePath: String!, $newerPageId: String, $olderPageId: String) {
    current: file( relativePath: {  eq: $relativePath } ) {
      ...FileFields
    }
    newer: file( id: { eq: $newerPageId } ) {
      ...FileFields
    }
    older: file( id: { eq: $olderPageId } ) {
      ...FileFields
    }
    site {
      siteMetadata {
        siteUrl
      }
    }
  }
`
```

As you can see, for each blog post I load in the next and previous blog posts
according to chronological ordering - this is what lets me generate the
navigation links at the bottom (see the bottom of this post for an example).

## Multi-lingual rendering

The page template rendering function needs to take into account the currently
selected language, and fallback to rendering the default language if necessary:

```js
import { IntlContextConsumer } from "gatsby-plugin-intl"

export default function Template({ data }) {
  return (
    <IntlContextConsumer>
      {({ language: currentLanguage }) => (
        <Page
          siteUrl={data.site.siteMetadata.siteUrl}
          currentLanguage={currentLanguage}
          current={data.current.fields.page}
          newer={safeGet(data.newer, 'fields.page')}
          older={safeGet(data.older, 'fields.page')}
        />
      )}
    </IntlContextConsumer>
  )
}
```

The `IntlContextConsumer` context provider from `gatsby-plugin-intl` will
always provide the active language. Using this the `Page` component
([see code](https://github.com/hiddentao/hiddentao.com/blob/master/src/templates/pageTemplate.js))
can loop through the `versions` of the page and find the matching
language version to display at the time of display.

Finally, if you look at the [about](/about/) page on this site, you will see a language
switcher ([see code](https://github.com/hiddentao/hiddentao.com/blob/master/src/components/language.js)). This utilises `gatsby-plugin-intl` to make switching between language versions
very easy.

## What can be improved?

I use the `Link` component from `gatsby-plugin-intl` to generate internal page
links. This component will generate the correct link for the current language
but it doesn't check to see if the page being linked to has a version in the
current language - it would be good to add logic for this!
