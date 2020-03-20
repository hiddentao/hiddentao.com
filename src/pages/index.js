import React, { useMemo } from "react"
import styled from '@emotion/styled'
import { useStaticQuery, graphql } from 'gatsby'
import { IntlContextConsumer } from 'gatsby-plugin-intl'

import Layout from "../components/layout"
import SEO from "../components/seo"
import Markdown from "../components/markdown"
import PostList from "../components/postList"
import { getResolvedVersionForLanguage } from '../utils/node'

const StyledMarkdown = styled(Markdown)`
  margin-top: 0.5rem;
`

const CONTENT = `
I’m Ram, a full stack developer from the UK. I’ve been helping
people build better products since 2005.

* I am from: UK
* I studied: Computer Science @ [Imperial College London](http://www.imperial.ac.uk/)
* I work with: Ethereum Foundation, IBM, Symbian, NBC Universal, [more...](https://www.linkedin.com/in/hiddentao/)
* I build with: Javascript, Node.js, Phonegap, Ethereum, [more...](https://github.com/hiddentao)
* [read more...](/about)
`

const PageHeading = styled.h1`
  margin-bottom: 2rem;
`

const PostsHeading = styled.h3`
  margin-top: 2rem;
`

const Page = ({ lang }) => {
  const data = useStaticQuery(graphql`
    query {
      allMarkdownPage(filter: { type: { eq: "blog" }, draft: { ne: true } }, sort: { order:DESC, fields: date }, limit: 10 ) {
        nodes {
          ...MarkdownPageFields
        }
      }
    }
  `)

  const posts = useMemo(() => {
    return data.allMarkdownPage.nodes
      .map(n => ({
        ...getResolvedVersionForLanguage(n.versions, lang, n.lang),
        path: n.path,
      }))
  }, [ data, lang ])

  return (
    <Layout>
      <SEO title='Home' />
      <PageHeading>Welcome!</PageHeading>
      <StyledMarkdown markdown={CONTENT} />
      <PostsHeading>Recent posts</PostsHeading>
      <PostList posts={posts} />
    </Layout>
  )
}

const IndexPage = () => (
  <IntlContextConsumer>
    {({ language: lang }) => (
      <Page lang={lang} />
    )}
  </IntlContextConsumer>
)

export default IndexPage
