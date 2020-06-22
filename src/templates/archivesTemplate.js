import styled from '@emotion/styled'
import React, { useMemo } from "react"
import { graphql } from "gatsby"
import { IntlContextConsumer, injectIntl } from "gatsby-plugin-intl"

import { getResolvedVersionForLanguage } from '../utils/node'
import { parseDate } from "../utils/date"
import Layout from "../components/layout"
import PostList from "../components/postList"
import SEO from "../components/seo"

const YearContainer = styled.div`
  h3 {
    padding-bottom: 0.7rem;
    border-bottom: 1px solid ${({ theme }) => theme.archives.year.borderColor};
    margin: 3rem 0 1rem;
  }
`

const Page = ({ intl, lang, data }) => {
  // sort blog post and categorize by year
  const postsByYear = useMemo(() => {
    const blogPosts = data.allMarkdownPage.nodes
      .map(n => {
        return {
          ...getResolvedVersionForLanguage(n.versions, lang, n.lang),
          path: n.path,
        }
      })

    const categorized = {}

    blogPosts.forEach(post => {
      const { year } = parseDate(post.date)

      if (!categorized[year]) {
        categorized[year] = [post]
      } else {
        categorized[year].push(post)
      }
    })

    const years = Object.keys(categorized)
    years.sort().reverse()

    const ret = []

    years.forEach(year => {
      ret.push({ year, posts: categorized[year] })
    })

    return ret
  }, [ data, lang ])

  return (
    <Layout>
      <SEO title='Blog archive' />
      <h1>Blog</h1>
      {postsByYear.map(( { year, posts }) => (
        <YearContainer key={year}>
          <h3>{year}</h3>
          <PostList posts={posts} />
        </YearContainer>
      ))}
    </Layout>
  )
}

const Template = ({ intl, data }) => {
  return (
    <IntlContextConsumer>
      {({ language: lang }) => (
        <Page lang={lang} data={data} intl={intl} />
      )}
    </IntlContextConsumer>
  )
}

export default injectIntl(Template)

export const pageQuery = graphql`
  query {
    allMarkdownPage(filter: { type: { eq: "blog" }, draft: { ne: true } }, sort: { order:DESC, fields: date }) {
      nodes {
        ...MarkdownPageFields
      }
    }
  }
`
