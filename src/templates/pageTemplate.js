import safeGet from 'lodash.get'
import styled from '@emotion/styled'
import { Location } from '@reach/router'
import React, { useMemo } from "react"
import { graphql } from "gatsby"
import { IntlContextConsumer, Link } from "gatsby-plugin-intl"
import { DiscussionEmbed } from "disqus-react"

import { getResolvedVersionForLanguage } from '../utils/node'
import { pageBottomNavBorderColor } from '../styles/common'
import Layout from "../components/layout"
import Language from "../components/language"
import PageLastUpdatedDate from "../components/pageLastUpdatedDate"
import SEO from "../components/seo"
import Markdown from "../components/markdown"

const StyledPageLastUpdatedDate = styled(PageLastUpdatedDate)`
  font-size: 1.2rem;
  margin: 0.8rem 0 0;
`

const StyledMarkdown = styled(Markdown)`
  margin-top: 1.5rem;
`

const Heading = styled.h1``

const StyledLanguage = styled(Language)`
  margin-top: 0.8rem;
`

const Comments = styled.div`
  margin-top: 2.5rem;
`

const BottomNav = styled.div`
  margin-top: 1.5rem;
  padding: 1rem 0;
  border-top: 1px dashed ${pageBottomNavBorderColor};
  border-bottom: 1px dashed ${pageBottomNavBorderColor};
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

  console.warn(versions)

  return (
    <Layout>
      <SEO title={fields.title} />
      <Heading>{fields.title}</Heading>
      <StyledPageLastUpdatedDate date={fields.date} showOldDateWarning={type === 'blog'} />
      {versions.length > 1 ? (
        <StyledLanguage
          showAsList={true}
          availableLanguages={versions.map(v => v.lang)}
        />
      ) : null}
      <StyledMarkdown markdown={fields.markdown} />
      <PageBottomNav {...nav} />
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
          current={data.current.fields.page}
          newer={safeGet(data.newer, 'fields.page')}
          older={safeGet(data.older, 'fields.page')}
        />
      )}
    </IntlContextConsumer>
  )
}

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
