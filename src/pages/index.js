import { Link } from 'gatsby'
import React from "react"
import Helmet from "react-helmet"

import Layout from "../components/layout"


const IndexPage = () => {
  return (
    <Layout>
      <Helmet title="Ram Nair — Software Consultant in Singapore and London">
        <html lang="en" />
        <meta name="description" content="Independent software consultant helping startups ship faster. 20+ years experience. Smart contracts, full-stack apps, fractional CTO. Based in Singapore and London." />
      </Helmet>

      <div>
        <div className="cyber-container">

          <div className="terminal-top">
            <div className="dot dot-r"></div>
            <div className="dot dot-y"></div>
            <div className="dot dot-g"></div>
          </div>
          <div className="hero">
            <div className="hero-content">
              <h1 className="cyber-h1">I help startups ship faster and better.</h1>
              <div className="subtitle mono">{`>>`} Software Consultant · Singapore 🇸🇬 London 🇬🇧</div>
              <p className="desc" style={{fontSize: '1.2rem', maxWidth: '600px', lineHeight:1.6}}><strong>20+ years</strong> building full-stack apps and enabling technical teams. From blockchains to production SaaS.</p>
              
              <div className="btn-container">
                <a href="#book" className="cyber-btn btn-primary">./book_call.sh</a>
                <a href="#work" className="cyber-btn btn-secondary">ls -la ./work</a>
              </div>
            </div>
            <img className="hero-img" src="/ram.png" alt="Ram Nair" />
          </div>

          <div className="logo-bar mono">
            <span>Ethereum</span>
            <span>ENS Labs</span>
            <span>Nayms</span>
            <span>Kaleidoco</span>
            <span>Tribally</span>
            <span>Kickback</span>
          </div>

          <section className="cyber-section" id="work">
            <div className="section-tag mono"># HOW_I_WORK</div>
            <div className="grid-3">
              <div className="glass-card">
                <div className="mono" style={{marginBottom:"1rem"}}>[1-2_WEEKS]</div>
                <h3>Architecture Sprint</h3>
                <p>Product idea or existing codebase needs a senior engineer's eyes. I review architecture, identify risks, and give a technical roadmap.</p>
              </div>
              <div className="glass-card">
                <div className="mono" style={{marginBottom:"1rem"}}>[1-3_MONTHS]</div>
                <h3>Build Phase</h3>
                <p>You need core features shipped. I design architecture and build it — smart contracts, APIs, web apps — or work with your existing team.</p>
              </div>
              <div className="glass-card">
                <div className="mono" style={{marginBottom:"1rem"}}>[ONGOING]</div>
                <h3>Fractional CTO</h3>
                <p>Part-time technical leadership. I set tech strategy, mentor developers, make decisions, and act as the technical voice in the room.</p>
              </div>
            </div>
          </section>

          <section className="cyber-section">
            <div className="section-tag mono"># VERIFICATION</div>
            <div className="testimonial-box">
              <p>"Ram is self-motivated and takes personal pride... He was able to guide us through evolving best practices while consistently delivering ahead of schedule."</p>
              <div className="testimonial-author mono">-- Theodore_Georgas @ Nayms</div>
            </div>
            <div className="testimonial-box">
              <p>"Ram brings a wide depth of knowledge across the tech stack, clean and readable code, and is always a good candidate to bounce new ideas off."</p>
              <div className="testimonial-author mono">-- Colleague @ Nayms</div>
            </div>
            <a href="https://linkedin.com/in/hiddentao" className="mono" style={{textDecoration:"none", display:"inline-block", marginTop:"1rem"}}>+ 14_more_on_LinkedIn()</a>
          </section>
          
          <section className="cyber-section">
            <div className="section-tag mono"># SYSTEM_STATS</div>
            <div className="metrics">
              <div className="metric-item"><div className="metric-value mono">20+</div><div className="metric-label mono">YRS SHIPPING</div></div>
              <div className="metric-item"><div className="metric-value mono">20+</div><div className="metric-label mono">INVESTMENTS</div></div>
              <div className="metric-item"><div className="metric-value mono">2.2k+</div><div className="metric-label mono">GH STARS</div></div>
              <div className="metric-item"><div className="metric-value mono">16</div><div className="metric-label mono">LINKEDIN_RECS</div></div>
              <div className="metric-item"><div className="metric-value mono">100+</div><div className="metric-label mono">TECH_POSTS</div></div>
              <div className="metric-item"><div className="metric-value mono" style={{fontSize:"2rem"}}>MEng</div><div className="metric-label mono">IMPERIAL COL.</div></div>
            </div>
          </section>

          <section className="cyber-section grid-2">
            <div>
              <div className="section-tag mono"># OPEN_SOURCE</div>
              <a href="https://github.com/hiddentao/squel" className="repo-card">
                <h4 className="mono">squel <span style={{color:"#888"}}>1600_★</span></h4>
                <p>SQL builder for JavaScript</p>
              </a>
              <a href="https://github.com/hiddentao/fast-levenshtein" className="repo-card">
                <h4 className="mono">fast-levenshtein <span style={{color:"#888"}}>577_★</span></h4>
                <p>Levenshtein algorithm impl.</p>
              </a>
              <a href="https://github.com/hiddentao/chatfall" className="repo-card">
                <h4 className="mono">Chatfall <span style={{color:"#888"}}>FULL_STACK</span></h4>
                <p>Web app compiled to executable</p>
              </a>
              <a href="https://hiddentao.vc" className="repo-card">
                <h4 className="mono">Hiddentao.vc <span style={{color:"#888"}}>ANGEL_INV</span></h4>
                <p>Angel investment portfolio — 20+ startups</p>
              </a>
            </div>
            <div>
              <div className="section-tag mono"># TX_LOG (READ)</div>
              <ul className="writing-list">
                <li><Link to="/archives/2024/11/16/bundling-your-nodejs-web-app-into-a-single-executable-using-bun" style={{fontSize:"1.2rem"}}>Bundling your Node.js web app into a single executable...<div className="meta"><span className="tag">Full-Stack</span> Nov 2024</div></Link></li>
                <li><Link to="/archives/2020/05/28/upgradeable-smart-contracts-using-diamond-standard" style={{fontSize:"1.2rem"}}>Upgradeable smart contracts using the Diamond Standard<div className="meta"><span className="tag">Blockchain</span> May 2020</div></Link></li>
                <li><Link to="/archives/2020/06/17/building-your-nextjs-web-app-using-graphql" style={{fontSize:"1.2rem"}}>Building your Next.js web app using GraphQL<div className="meta"><span className="tag">Full-Stack</span> Jun 2020</div></Link></li>
                <li><Link to="/archives/2019/03/26/architecting-microservices-for-effective-development-and-deployment" style={{fontSize:"1.2rem"}}>Architecting microservices for effective development...<div className="meta"><span className="tag">Architecture</span> Mar 2019</div></Link></li>
                <li><Link to="/archives/2020/03/21/advanced-role-based-access-control-in-solidity" style={{fontSize:"1.2rem"}}>Advanced role-based access control in Solidity<div className="meta"><span className="tag">Blockchain</span> Mar 2020</div></Link></li>
              </ul>
              <Link to="/blog" className="mono" style={{textDecoration:"none", display:"inline-block", marginTop:"1.5rem"}}>cd /blog && ls -a &rarr;</Link>
            </div>
          </section>
        </div>
      </div>
    </Layout>
  )
}

export default IndexPage
