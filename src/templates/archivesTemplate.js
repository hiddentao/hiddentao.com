import React, { useMemo } from "react"
import { graphql } from "gatsby"

import { getResolvedVersionForLanguage } from '../utils/node'
import { parseDate } from "../utils/date"
import Layout from "../components/layout"
import PostList from "../components/postList"
import SEO from "../components/seo"

const Page = ({ lang, data }) => {
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
      <div className="cyber-container mt-12 mb-8">
        <h1 className="cyber-h1 mono mb-12">/blog</h1>
        {postsByYear.map(( { year, posts }) => (
          <div key={year} className="[&_h3]:pb-[0.7rem] [&_h3]:border-b [&_h3]:border-dark-grey [&_h3]:mt-12 [&_h3]:mb-4">
            <h3 className="mono text-white">{year}</h3>
            <PostList posts={posts} />
          </div>
        ))}
      </div>
    </Layout>
  )
}

const Template = ({ data }) => {
  return (
    <Page lang='en' data={data} />
  )
}

export default Template

export const pageQuery = graphql`
  query {
    allMarkdownPage(filter: { type: { eq: "blog" }, draft: { ne: true } }, sort: { order:DESC, fields: date }) {
      nodes {
        ...MarkdownPageFields
      }
    }
  }
`
