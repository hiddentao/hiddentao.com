import React from "react"

import Layout from "../components/layout"
import SEO from "../components/seo"

const NotFoundPage = () => (
  <Layout>
    <SEO title="404: Not found" />
    <div className="cyber-container" style={{ marginTop: '3rem', marginBottom: '8rem', textAlign: 'center' }}>
      <h1 className="cyber-h1">NOT FOUND// 404</h1>
      <p className="mono" style={{ marginTop: '2rem', fontSize: '1.2rem' }}>You just hit a route that doesn&#39;t exist... the sadness.</p>
    </div>
  </Layout>
)

export default NotFoundPage
