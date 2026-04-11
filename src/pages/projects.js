import React from "react"
import Layout from "../components/layout"
import SEO from "../components/seo"

const projects = [
  {
    id: 'squel',
    name: 'squel',
    description: 'SQL query builder for JavaScript (1,600+ GitHub Stars)',
    url: 'https://github.com/hiddentao/squel',
    image: null
  },
  {
    id: 'fast-levenshtein',
    name: 'fast-levenshtein',
    description: 'Levenshtein algorithm implementation (577+ GitHub Stars)',
    url: 'https://github.com/hiddentao/fast-levenshtein',
    image: null
  },
  {
    id: 'chatfall',
    name: 'Chatfall',
    description: 'Full-stack app bundled to a single executable (Node.js, Bun)',
    url: 'https://github.com/hiddentao/chatfall',
    image: null
  },
  {
    id: 'hiddentao-vc',
    name: 'Hiddentao.vc',
    description: 'Angel investment portfolio — 20+ startups (Ethereum, Varda, ConsenSys)',
    url: 'https://hiddentao.vc',
    image: null
  }
]

const ProjectsPage = () => {
  return (
    <Layout>
      <SEO title="Projects" description="Portfolio of projects and creative works by Ram" />
      
      <div className="cyber-container" style={{ marginTop: '3rem', marginBottom: '8rem' }}>
        <div style={{ textAlign: "center", marginBottom: "4rem" }}>
          <h1 className="cyber-h1" style={{ fontSize: "2.5rem" }}>Projects</h1>
        </div>

        <div className="grid-3">
          {projects.map(project => (
            <a 
              href={project.url} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="glass-card" 
              key={project.id}
              style={{ textDecoration: 'none', display: 'block', color: 'inherit' }}
            >
              <h3 className="mono" style={{ color: "var(--caribbean-green)", marginBottom: "0.5rem" }}>{project.name}</h3>
              <p>{project.description}</p>
            </a>
          ))}
        </div>
      </div>
    </Layout>
  )
}

export default ProjectsPage