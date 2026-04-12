import React from "react"
import Layout from "../components/layout"
import SEO from "../components/seo"
import BookCallButton from "../components/bookCallButton"
import CyberContainer from "../components/cyberContainer"

const services = [
  {
    id: 'sprint',
    name: 'Architecture Sprint',
    duration: '[1-2_WEEKS]',
    description: 'You have a product idea or existing codebase and need a senior engineer\'s perspective. I\'ll review your architecture, identify risks, and deliver a concrete technical roadmap you can execute on.'
  },
  {
    id: 'build',
    name: 'Build Phase',
    duration: '[1-3_MONTHS]',
    description: 'You need core features shipped. I\'ll design the architecture and build it — smart contracts, APIs, web apps — or embed with your existing team to accelerate delivery.'
  },
  {
    id: 'cto',
    name: 'Fractional CTO',
    duration: '[ONGOING]',
    description: 'You need part-time technical leadership without a full-time CTO salary. I\'ll set your tech strategy, mentor your developers, make build-vs-buy decisions, and be the technical voice in the room.'
  }
]

const ServicesPage = () => {
  return (
    <Layout>
      <SEO title="Services" description="Software consulting services, architecture sprints, build phases, and fractional CTO." />

      <CyberContainer className="mb-32">
        <div className="mb-16">
          <h1 className="cyber-h1 mono">/services</h1>
        </div>

        <div className="grid-single-centered">
          {services.map(service => (
            <div className="glass-card" key={service.id}>
              <div className="mono mb-4">{service.duration}</div>
              <h3>{service.name}</h3>
              <p>{service.description}</p>
            </div>
          ))}
        </div>

        <div className="btn-container justify-center mt-24">
          <BookCallButton label="BOOK_CALL()" />
          <a
            href="https://linkedin.com/in/hiddentao"
            target="_blank"
            rel="noopener noreferrer"
            className="mono"
          >VIEW_PAST_WORK()</a>
        </div>
      </CyberContainer>
    </Layout>
  )
}

export default ServicesPage
