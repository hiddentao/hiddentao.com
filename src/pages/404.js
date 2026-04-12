import React from "react"

import CyberContainer from "../components/cyberContainer"
import Layout from "../components/layout"
import SEO from "../components/seo"

const NotFoundPage = () => (
  <Layout>
    <SEO title="404: Not found" />
    <CyberContainer className="mb-32 text-center">
      <h1 className="cyber-h1">NOT FOUND// 404</h1>
      <p className="mono mt-8 text-[1.2rem]">You just hit a route that doesn&#39;t exist... the sadness.</p>
    </CyberContainer>
  </Layout>
)

export default NotFoundPage
