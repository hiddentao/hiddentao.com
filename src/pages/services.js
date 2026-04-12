import React from "react"
import Layout from "../components/layout"
import SEO from "../components/seo"
import BookCallButton from "../components/bookCallButton"
import CyberContainer from "../components/cyberContainer"
import CyberLink from "../components/cyberLink"
import CyberSection from "../components/cyberSection"

const engagements = [
  {
    id: 'sprint',
    tag: '[1-2_WEEKS]',
    name: 'Architecture Sprint',
    description: 'Product idea or existing codebase needs a senior engineer\'s eyes. I review architecture, identify risks, and give a technical roadmap.',
  },
  {
    id: 'build',
    tag: '[1-3_MONTHS]',
    name: 'Build Phase',
    description: 'You need core features shipped. I design architecture and build it — smart contracts, APIs, web apps — or work with your existing team.',
  },
  {
    id: 'cto',
    tag: '[ONGOING]',
    name: 'Fractional CTO',
    description: 'Part-time technical leadership. I set tech strategy, mentor developers, make decisions, and act as the technical voice in the room.',
  },
]

const offerings = [
  {
    id: 'blockchain',
    tag: '[BLOCKCHAIN]',
    name: 'Smart Contract Engineering',
    description: 'Solidity development, auditing, DeFi protocols, and token systems. Built for Ethereum Foundation, ENS Labs, and multiple DeFi startups.',
  },
  {
    id: 'fullstack',
    tag: '[FULL_STACK]',
    name: 'Web Application Development',
    description: 'React, Node.js, GraphQL, PostgreSQL. Production SaaS apps, real-time systems, and complex frontends across fintech, media, and e-commerce.',
  },
  {
    id: 'mobile',
    tag: '[MOBILE]',
    name: 'Mobile Apps',
    description: 'React Native for iOS and Android. Cross-platform architecture, OTA deployment, and native integrations — analytics, push, maps, audio.',
  },
  {
    id: 'ai',
    tag: '[AI_ML]',
    name: 'AI & Agentic Systems',
    description: 'LLM integration, agentic AI workflows, and deep learning pipelines. Intelligent features and autonomous agents for real business problems.',
  },
  {
    id: 'devops',
    tag: '[DEVOPS]',
    name: 'Cloud & Infrastructure',
    description: 'AWS, Kubernetes, Docker, CI/CD pipelines. Production-grade deployment, monitoring, and scaling for teams without dedicated ops.',
  },
  {
    id: 'architecture',
    tag: '[ARCHITECTURE]',
    name: 'System Design & Review',
    description: 'Architecture audits, risk assessment, and technical roadmapping. Senior engineer perspective on your codebase, stack, and scaling strategy.',
  },
  {
    id: 'security',
    tag: '[SECURITY]',
    name: 'Security & Auditing',
    description: 'Smart contract audits, dependency analysis, and threat modelling. Security-first approach honed across blockchain and financial systems.',
  },
  {
    id: 'leadership',
    tag: '[CTO]',
    name: 'Technical Leadership',
    description: 'Tech strategy, build-vs-buy decisions, vendor evaluation, and being the technical voice in board and investor conversations.',
  },
  {
    id: 'team',
    tag: '[TEAM]',
    name: 'Team Building & Mentoring',
    description: 'Hiring engineers, development processes, code review culture, and mentoring. Scaling engineering teams from 2 to 20.',
  },
  {
    id: 'duediligence',
    tag: '[DUE_DILIGENCE]',
    name: 'Technical Due Diligence',
    description: 'Evaluating tech stacks, codebases, and engineering teams for investors and acquirers. Independent assessment before funding rounds or M&A.',
  },
  {
    id: 'advisory',
    tag: '[ADVISORY]',
    name: 'Startup Advisory',
    description: 'Strategic and technical advisor to blockchain and fintech startups. Product-market fit, go-to-market, and navigating the Web3 ecosystem.',
  },
  {
    id: 'opensource',
    tag: '[OPEN_SOURCE]',
    name: 'Open Source & Dev Tools',
    description: 'Published libraries with 2.2k+ GitHub stars. Developer-facing tools, SDKs, and open-source infrastructure.',
  },
]

const ServicesPage = () => {
  return (
    <Layout>
      <SEO title="Services" description="Software consulting services — smart contracts, full-stack apps, AI, fractional CTO, and startup advisory." />

      <CyberContainer className="mb-32">
        <div className="mb-16">
          <h1 className="cyber-h1 mono">/services</h1>
          <div className="subtitle mono">{`>>`} What I build, lead, and advise on</div>
        </div>

        <CyberSection tag="HOW_I_WORK">
          <div className="grid-3">
            {engagements.map(e => (
              <div className="glass-card" key={e.id}>
                <div className="mono mb-4">{e.tag}</div>
                <h3>{e.name}</h3>
                <p>{e.description}</p>
              </div>
            ))}
          </div>
          <BookCallButton label="BOOK_CALL()" />
        </CyberSection>

        <CyberSection tag="OFFERINGS">
          <div className="grid-3">
            {offerings.map(o => (
              <div className="glass-card" key={o.id}>
                <div className="mono mb-4">{o.tag}</div>
                <h3>{o.name}</h3>
                <p>{o.description}</p>
              </div>
            ))}
          </div>
          <CyberLink
            href="https://linkedin.com/in/hiddentao"
            tooltip="View past work and recommendations on LinkedIn"
          >+ more_on_LinkedIn()</CyberLink>
        </CyberSection>
      </CyberContainer>
    </Layout>
  )
}

export default ServicesPage
