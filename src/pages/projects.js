import { graphql } from "gatsby"
import React from "react"
import Layout from "../components/layout"
import SEO from "../components/seo"

const cardStyle = { textDecoration: 'none', display: 'block', color: 'inherit' }
const titleStyle = { color: "var(--caribbean-green)", marginBottom: "0.5rem" }
const starStyle = { color: "#888", fontSize: "0.9rem", marginLeft: "0.5rem" }
const moreLinkStyle = { textDecoration: "none", display: "inline-block", marginTop: "1.5rem" }

const ProjectsPage = ({ data }) => {
  const repos = data.allGithubRepo.nodes
  const projects = data.allExternalProject.nodes

  return (
    <Layout>
      <SEO title="Projects" description="Open source libraries and products by Ram" />

      <div className="cyber-container" style={{ marginTop: '3rem', marginBottom: '8rem' }}>
        <div style={{ marginBottom: "3rem" }}>
          <h1 className="cyber-h1 mono">/projects</h1>
        </div>

        <section className="cyber-section">
          <div className="section-tag mono"># OPEN_SOURCE</div>
          <div className="grid-3">
            {repos.map(repo => (
              <a
                key={repo.name}
                href={repo.url}
                target="_blank"
                rel="noopener noreferrer"
                className="glass-card"
                style={cardStyle}
                data-tooltip-id="app-tooltip"
                data-tooltip-content={`View ${repo.name} on GitHub — ${repo.stars.toLocaleString()} stars`}
              >
                <h3 className="mono" style={titleStyle}>
                  {repo.name}
                  <span className="mono" style={starStyle}>{repo.stars.toLocaleString()}_★</span>
                </h3>
                <p>{repo.description}</p>
              </a>
            ))}
          </div>
          <a
            href="https://github.com/hiddentao"
            target="_blank"
            rel="noopener noreferrer"
            className="mono"
            style={moreLinkStyle}
            data-tooltip-id="app-tooltip"
            data-tooltip-content="See all repos on GitHub"
          >cd /github && ls -a &rarr;</a>
        </section>

        <section className="cyber-section">
          <div className="section-tag mono"># PROJECTS</div>
          <div className="grid-3">
            {projects.map(project => (
              <a
                key={project.id}
                href={project.url}
                target="_blank"
                rel="noopener noreferrer"
                className="glass-card"
                style={cardStyle}
                data-tooltip-id="app-tooltip"
                data-tooltip-content={`Visit ${project.name}`}
              >
                <h3 className="mono" style={titleStyle}>{project.name}</h3>
                <p>{project.description}</p>
              </a>
            ))}
          </div>
        </section>
      </div>
    </Layout>
  )
}

export const query = graphql`
  query {
    allGithubRepo(sort: { fields: order, order: ASC }, limit: 5) {
      nodes {
        name
        description
        url
        stars
        language
      }
    }
    allExternalProject(sort: { fields: order, order: ASC }) {
      nodes {
        id
        name
        title
        description
        url
      }
    }
  }
`

export default ProjectsPage
