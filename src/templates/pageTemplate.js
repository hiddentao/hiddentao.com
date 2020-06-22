import trunc from 'lodash.truncate'
import styled from '@emotion/styled'
import { Location } from '@reach/router'
import React, { useMemo } from "react"
import { graphql } from "gatsby"
import { IntlContextConsumer, Link } from "gatsby-plugin-intl"
import { DiscussionEmbed } from "disqus-react"

import { getResolvedVersionForLanguage } from '../utils/node'
import { calculateReadTimeInMinutes } from '../utils/string'
import Layout from "../components/layout"
import Language from "../components/language"
import PageLastUpdatedDate from "../components/pageLastUpdatedDate"
import SEO from "../components/seo"
import Markdown from "../components/markdown"

const StyledPageLastUpdatedDate = styled(PageLastUpdatedDate)`
  font-size: 1.2rem;
  margin: 1rem 0 0;
`

const PostReadTime = styled.p`
  margin: 0.8rem 0 0;
  font-size: 1rem;
  font-style: italic;
  color: ${({ theme }) => theme.readTime.textColor};
`

const StyledMarkdown = styled(Markdown)`
  font-size: 1.4rem;
  background-color: ${({ theme }) => theme.contentSection.bgColor};
  color: ${({ theme }) => theme.contentSection.textColor};
  padding: 1rem;
  border-radius: 5px;
  margin-top: 2.5rem;

  ${({ theme }) => theme.media.when({ minW: 'desktop' })} {
    font-size: 1.4rem;
  }
`

const Heading = styled.h1`
  margin: 1rem 0 0;
`

const StyledLanguage = styled(Language)`
  margin-top: 0.8rem;
`

const Comments = styled.div`
  margin-top: 2.5rem;
`

const BottomNav = styled.div`
  margin-top: 1.5rem;
  padding: 1rem 0;
  border-top: 1px dashed ${({ theme }) => theme.pageBottomNav.borderColor};
  border-bottom: 1px dashed ${({ theme }) => theme.pageBottomNav.borderColor};
  font-size: 0.8rem;
  line-height: 1rem;
  ul {
    list-style: none;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: flex-start;
    li {
      max-width: 40%;
      a {
        margin: 0 0.5em;
      }
    }
  }
`

const PageBottomNavItemLink = ({ currentLanguage, item }) => {
  const { title } = useMemo(() => (
    getResolvedVersionForLanguage(item.versions, currentLanguage, item.lang)
  ), [ item, currentLanguage ])

  return (
    <Link to={item.path}>{title}</Link>
  )
}

const PageBottomNav = ({ currentLanguage, newer, older }) => {
  if (!newer && !older) {
    return null
  }

  return (
    <BottomNav>
      <ul>
        <li>
          {newer ? (
            <>
              ⇦<PageBottomNavItemLink currentLanguage={currentLanguage} item={newer} />
            </>

          ) : null}
        </li>
        <li>
          {older ? (
            <>
              <PageBottomNavItemLink currentLanguage={currentLanguage} item={older} />⇨
            </>
          ) : null}
        </li>
      </ul>
    </BottomNav>
  )
}

const Page = ({ siteUrl, currentLanguage, current, ...nav }) => {
  const { type, lang: fallbackLang, versions } = current

  const fields = useMemo(() => (
    getResolvedVersionForLanguage(versions, currentLanguage, fallbackLang)
  ), [ versions, currentLanguage, fallbackLang ])

  const summary = useMemo(() => {
    const src = fields.summary || fields.markdown

    return src ? trunc(src, { length: 100 }) : null
  }, [ fields ])

  return (
    <Layout>
      <SEO title={fields.title} description={summary} />
      <Heading>{fields.title}</Heading>
      <StyledPageLastUpdatedDate date={fields.date} showOldDateWarning={type === 'blog'} />
      {type === 'blog' ? (
        <PostReadTime>({calculateReadTimeInMinutes(fields.markdown)} minute read)</PostReadTime>
      ) : null}
      {versions.length > 1 ? (
        <StyledLanguage availableLanguages={versions.map(v => v.lang)} />
      ) : null}
      <StyledMarkdown markdown={fields.markdown} />
      {type === 'blog' ? <PageBottomNav {...nav} /> : null}
      {type === 'blog' ? (
        <Comments>
          <Location>
            {({ location }) => (
              <DiscussionEmbed shortname='hiddentao' config={{
                url: `${siteUrl}${location.pathname}`
              }} />
            )}
          </Location>
        </Comments>
      ) : null}
    </Layout>
  )
}

export default function Template({ data }) {
  return (
    <IntlContextConsumer>
      {({ language: currentLanguage }) => (
        <Page
          siteUrl={data.site.siteMetadata.siteUrl}
          currentLanguage={currentLanguage}
          current={data.current}
          newer={data.newer}
          older={data.older}
        />
      )}
    </IntlContextConsumer>
  )
}

export const pageQuery = graphql`
  fragment MarkdownPageFields on MarkdownPage {
    path
    type
    lang
    versions {
      lang
      date
      title
      summary
      markdown
    }
  }

  query($id: String!, $newerPageId: String, $olderPageId: String) {
    current: markdownPage( id: {  eq: $id } ) {
      ...MarkdownPageFields
    }
    newer: markdownPage( id: { eq: $newerPageId } ) {
      ...MarkdownPageFields
    }
    older: markdownPage( id: { eq: $olderPageId } ) {
      ...MarkdownPageFields
    }
    site {
      siteMetadata {
        siteUrl
      }
    }
  }
`
