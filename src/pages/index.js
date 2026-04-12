import { Link, graphql, useStaticQuery } from 'gatsby'
import React from "react"
import Helmet from "react-helmet"

import CyberContainer from "../components/cyberContainer"
import Layout from "../components/layout"
import BookCallButton from "../components/bookCallButton"
import CyberLink from "../components/cyberLink"
import CyberSection from "../components/cyberSection"
import { getResolvedVersionForLanguage } from "../utils/node"
import { formatDate } from "../utils/date"


const IndexPage = () => {
  const data = useStaticQuery(graphql`
    query {
      allMarkdownPage(
        filter: { type: { eq: "blog" }, draft: { ne: true } }
        sort: { order: DESC, fields: date }
        limit: 5
      ) {
        nodes {
          ...MarkdownPageFields
        }
      }
      allGithubRepo(sort: { fields: order, order: ASC }, limit: 3) {
        nodes {
          name
          description
          url
          stars
        }
      }
    }
  `)

  const posts = data.allMarkdownPage.nodes.map(n => ({
    ...getResolvedVersionForLanguage(n.versions, 'en', n.lang),
    path: n.path,
  }))

  const repos = data.allGithubRepo.nodes

  return (
    <Layout>
      <Helmet title="Hiddentao Labs — I help startups ship faster and better.">
        <html lang="en" />
        <meta name="description" content="Independent software consultant helping startups ship faster and better. 20+ years experience. Smart contracts, full-stack apps, fractional CTO. Based in Singapore and UK." />
      </Helmet>

      <div>
        <CyberContainer className="mt-0">

          <div className="terminal-top">
            <div className="dot dot-r"></div>
            <div className="dot dot-y"></div>
            <div className="dot dot-g"></div>
          </div>
          <div className="hero">
            <div className="hero-content">
              <h1 className="cyber-h1">I help startups ship faster and better.</h1>
              <div className="subtitle mono">{`>>`} Software Consultant <span className="block sm:inline">{`>>`} Singapore 🇸🇬 UK 🇬🇧</span></div>
              <p className="desc text-[1.2rem] max-w-[600px] leading-[1.6]"><strong>20+ years</strong> building full-stack apps and enabling technical teams. From blockchains to production SaaS.</p>

              <div className="btn-container">
                <BookCallButton label="./book_call.sh" />
                <a
                  href="#work"
                  className="cyber-btn"
                  data-tooltip-id="app-tooltip"
                  data-tooltip-content="Scroll to how I work"
                >ls -la ./work</a>
              </div>
            </div>
            <img className="hero-img" src="/ram.png" alt="Hiddentao Labs" />
          </div>

          <div className="logo-bar mono">
            <a href="https://ethereum.org" target="_blank" rel="noopener noreferrer">Ethereum Foundation</a>
            <a href="https://ens.domains" target="_blank" rel="noopener noreferrer">ENS Labs</a>
            <a href="https://www.onre.finance" target="_blank" rel="noopener noreferrer">OnRe</a>
            <a href="https://www.nbcuniversal.com" target="_blank" rel="noopener noreferrer">NBC Universal</a>
          </div>

          <CyberSection tag="HOW_I_WORK" id="work">
            <div className="grid-3">
              <div className="glass-card">
                <div className="mono mb-4">[1-2_WEEKS]</div>
                <h3>Architecture Sprint</h3>
                <p>Product idea or existing codebase needs a senior engineer's eyes. I review architecture, identify risks, and give a technical roadmap.</p>
              </div>
              <div className="glass-card">
                <div className="mono mb-4">[1-3_MONTHS]</div>
                <h3>Build Phase</h3>
                <p>You need core features shipped. I design architecture and build it — smart contracts, APIs, web apps — or work with your existing team.</p>
              </div>
              <div className="glass-card">
                <div className="mono mb-4">[ONGOING]</div>
                <h3>Fractional CTO</h3>
                <p>Part-time technical leadership. I set tech strategy, mentor developers, make decisions, and act as the technical voice in the room.</p>
              </div>
            </div>
            <CyberLink to="/services" tooltip="View all service offerings">cd /services &rarr;</CyberLink>
          </CyberSection>

          <CyberSection tag="VERIFICATION">
            <div className="testimonial-box">
              <p>"Ram is self-motivated and takes personal pride... He was able to guide us through evolving best practices while consistently delivering ahead of schedule."</p>
              <div className="testimonial-author mono">-- Theodore_Georgas @ OnRe</div>
            </div>
            <div className="testimonial-box">
              <p>"When we started developing a solution in blockchain for lending and needed a lead to guide us through, Ram was there to help out. He was diligent on time and extremely reliable."</p>
              <div className="testimonial-author mono">-- Abhishek_Agarwal @ Google</div>
            </div>
            <CyberLink
              href="https://linkedin.com/in/hiddentao"
              tooltip="Read 14 more recommendations on LinkedIn"
            >+ more_on_LinkedIn()</CyberLink>
          </CyberSection>

          <CyberSection tag="SYSTEM_STATS">
            <div className="metrics">
              <div className="metric-item"><div className="metric-value mono">20+</div><div className="metric-label mono">YRS SHIPPING</div></div>
              <div className="metric-item"><div className="metric-value mono">20+</div><div className="metric-label mono">INVESTMENTS</div></div>
              <div className="metric-item"><div className="metric-value mono">2.2k+</div><div className="metric-label mono">GH STARS</div></div>
              <div className="metric-item"><div className="metric-value mono">16</div><div className="metric-label mono">LINKEDIN_RECS</div></div>
              <div className="metric-item"><div className="metric-value mono">100+</div><div className="metric-label mono">TECH_POSTS</div></div>
            </div>
          </CyberSection>

          <CyberSection className="grid-2">
            <div>
              <div className="section-tag mono"># OPEN_SOURCE</div>
              {repos.map(repo => (
                <a
                  key={repo.name}
                  href={repo.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="repo-card"
                  data-tooltip-id="app-tooltip"
                  data-tooltip-content={`View ${repo.name} on GitHub — ${repo.stars.toLocaleString()} stars`}
                >
                  <h4 className="mono">{repo.name} <span className="text-mid-grey">{repo.stars.toLocaleString()}_★</span></h4>
                  <p>{repo.description}</p>
                </a>
              ))}
              <CyberLink to="/code" tooltip="See all code">cd /code && ls -a &rarr;</CyberLink>
            </div>
            <div>
              <div className="section-tag mono"># BLOG</div>
              <ul className="writing-list">
                {posts.map(post => (
                  <li key={post.path}>
                    <Link to={post.path} className="text-[1.2rem]">
                      {post.title}
                      <div className="meta">{formatDate(new Date(post.date), 'MMM YYYY')}</div>
                    </Link>
                  </li>
                ))}
              </ul>
              <CyberLink to="/blog" tooltip="Browse all blog posts">cd /blog && ls -a &rarr;</CyberLink>
            </div>
          </CyberSection>
        </CyberContainer>
      </div>
    </Layout>
  )
}

export default IndexPage
