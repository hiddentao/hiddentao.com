import styled from '@emotion/styled'
import React, { useMemo } from "react"
import { graphql } from "gatsby"
import { IntlContextConsumer, injectIntl } from "gatsby-plugin-intl"

import { archivesYearColor, archivesYearBorderColor } from '../styles/common'
import { getResolvedVersionForLanguage } from '../utils/node'
import { parseDate } from "../utils/date"
import Layout from "../components/layout"
import PostList from "../components/postList"
import SEO from "../components/seo"

const YearContainer = styled.div`
  h3 {
    color: ${archivesYearColor};
    font-size: 1rem;
    padding-bottom: 0.7rem;
    border-bottom: 1px solid ${archivesYearBorderColor};
    margin: 1.7rem 0 1rem;
  }
`

const Page = ({ intl, lang, data }) => {
  // sort blog post and categorize by year
  const postsByYear = useMemo(() => {
    const blogPosts = data.allFile.nodes
      .map(n => {
        const postData = n.fields.page

        return {
          ...getResolvedVersionForLanguage(postData.versions, lang, postData.lang),
          path: postData.path,
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
      <h1>Blog archive</h1>
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
    allFile( filter: { fields: { page: { type: { eq: "blog" }, draft: { ne: true } } } }, sort: { order:DESC, fields: fields___page___date } ) {
      nodes {
        ...FileFields
      }
    }
  }
`
