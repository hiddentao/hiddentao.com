import { graphql } from "gatsby"
import { emojify } from "node-emoji"
import React from "react"
import Layout from "../components/layout"
import CyberLink from "../components/cyberLink"
import SEO from "../components/seo"

const ProjectsPage = ({ data }) => {
  const repos = data.allGithubRepo.nodes
  const projects = data.allExternalProject.nodes

  return (
    <Layout>
      <SEO title="Projects" description="Open source libraries and products by Ram" />

      <div className="cyber-container mt-12 mb-32">
        <div className="mb-12">
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
                className="glass-card no-underline block text-inherit"
                data-tooltip-id="app-tooltip"
                data-tooltip-content={emojify(`View ${repo.name} on GitHub — ${repo.stars.toLocaleString()} stars`)}
              >
                <h3 className="mono text-caribbean-green mb-2">
                  {repo.name}
                  <span className="mono text-mid-grey text-[0.9rem] ml-2">{repo.stars.toLocaleString()}_★</span>
                </h3>
                <p>{emojify(repo.description)}</p>
              </a>
            ))}
          </div>
          <CyberLink href="https://github.com/hiddentao" tooltip="See all repos on GitHub">cd /github && ls -a &rarr;</CyberLink>
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
                className="glass-card no-underline block text-inherit"
                data-tooltip-id="app-tooltip"
                data-tooltip-content={`Visit ${project.name}`}
              >
                <h3 className="mono text-caribbean-green mb-2">{project.name}</h3>
                <p>{emojify(project.description)}</p>
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
