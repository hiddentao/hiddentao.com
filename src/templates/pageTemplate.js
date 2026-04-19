import trunc from "lodash.truncate"
import { Location } from "@reach/router"
import React, { useMemo } from "react"
import { graphql, Link } from "gatsby"
import { DiscussionEmbed } from "disqus-react"

import { getResolvedVersionForLanguage } from "../utils/node"
import CyberContainer from "../components/cyberContainer"
import Layout from "../components/layout"
import PageLastUpdatedDate from "../components/pageLastUpdatedDate"
import SEO from "../components/seo"
import Markdown from "../components/markdown"
import BookCallButton from "../components/bookCallButton"

const PageBottomNavItemLink = ({ currentLanguage, item }) => {
  const { title } = useMemo(
    () =>
      getResolvedVersionForLanguage(item.versions, currentLanguage, item.lang),
    [item, currentLanguage]
  )

  return <Link to={item.path}>{title}</Link>
}

const PageBottomNav = ({ currentLanguage, newer, older }) => {
  if (!newer && !older) {
    return null
  }

  return (
    <div className="mt-6 py-4 border-y border-dashed border-grey text-[0.8rem] leading-4">
      <ul className="list-none flex justify-between items-start [&_li]:max-w-[40%] [&_li_a]:mx-2">
        <li>
          {newer ? (
            <>
              ⇦
              <PageBottomNavItemLink
                currentLanguage={currentLanguage}
                item={newer}
              />
            </>
          ) : null}
        </li>
        <li>
          {older ? (
            <>
              <PageBottomNavItemLink
                currentLanguage={currentLanguage}
                item={older}
              />
              ⇨
            </>
          ) : null}
        </li>
      </ul>
    </div>
  )
}

const Page = ({ siteUrl, currentLanguage, current, ...nav }) => {
  const { type, path, lang: fallbackLang, versions } = current

  const fields = useMemo(
    () =>
      getResolvedVersionForLanguage(versions, currentLanguage, fallbackLang),
    [versions, currentLanguage, fallbackLang]
  )

  const summary = useMemo(() => {
    const src = fields.summary || fields.markdown

    return src ? trunc(src, { length: 100 }) : null
  }, [fields])

  return (
    <Layout>
      <SEO title={fields.title} description={summary} ogi={fields.ogi} />
      <CyberContainer className="mb-8">
        {type === "blog" ? (
          <h1 className="cyber-h1 text-[3rem] mb-4">{fields.title}</h1>
        ) : (
          <>
            <h1 className="cyber-h1 mono mb-4">{path}</h1>
            <p className="text-md text-light-grey">{fields.title}</p>
          </>
        )}
        <PageLastUpdatedDate className="text-md mt-4" date={fields.date} />
        {type === "blog" ? (
          <p className="mt-[0.8rem] text-base italic text-light-grey">
            ({fields.readtime} minute read)
          </p>
        ) : null}
        <Markdown
          className="text-[1.4rem] bg-white text-black p-4 rounded-[5px] mt-10"
          markdown={fields.markdown}
        />
        {type === "blog" ? (
          <div className="mt-12 px-8 pt-4 pb-8 bg-[color-mix(in_srgb,var(--color-white)_3%,transparent)] border-l-4 border-darkest-grey rounded">
            <h3 className="italic mt-0 mono text-2xl">
              Need help shipping your product?
            </h3>
            <p className="mb-10 leading-body">
              Let's talk about your project and see{" "}
              <a href="/services" className="text-cyan-accent underline">
                how I can help
              </a>
              .
            </p>
            <BookCallButton className="cyber-btn" />
          </div>
        ) : null}
        {type === "blog" ? <PageBottomNav {...nav} /> : null}
        {type === "blog" ? (
          <div className="mt-10">
            <Location>
              {({ location }) => (
                <DiscussionEmbed
                  shortname="hiddentao"
                  config={{
                    url: `${siteUrl}${location.pathname}`,
                  }}
                />
              )}
            </Location>
          </div>
        ) : null}
      </CyberContainer>
    </Layout>
  )
}

export default function Template({ data }) {
  return (
    <Page
      siteUrl={data.site.siteMetadata.siteUrl}
      currentLanguage="en"
      current={data.current}
      newer={data.newer}
      older={data.older}
    />
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
      readtime
      ogi
    }
  }

  query($id: String!, $newerPageId: String, $olderPageId: String) {
    current: markdownPage(id: { eq: $id }) {
      ...MarkdownPageFields
    }
    newer: markdownPage(id: { eq: $newerPageId }) {
      ...MarkdownPageFields
    }
    older: markdownPage(id: { eq: $olderPageId }) {
      ...MarkdownPageFields
    }
    site {
      siteMetadata {
        siteUrl
      }
    }
  }
`
