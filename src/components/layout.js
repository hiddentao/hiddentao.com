import React, { useMemo } from "react"
import { Global } from '@emotion/core'
import PropTypes from "prop-types"
import styled from '@emotion/styled'
import { useStaticQuery, graphql } from 'gatsby'

import { asideBorderColor } from '../styles/common'
import { mq } from '../styles/breakpoints'
import resetStyles from '../styles/reset'
import globalStyles from '../styles/global'
import Header from "./header"
import Aside from "./Aside"
import Footer from "./footer"

const Content = styled.div`
  padding: 2rem 1rem 3rem;
  position: relative;
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: flex-start;
`

const asideBarWidth = 200

const StyledAside = styled(Aside)(() => mq({
  flex: '0',
  display: ['none', 'none', 'block'],
  width: `${asideBarWidth}px`,
  minWidth: `${asideBarWidth}px`,
  fontSize: '0.7rem',
  borderRight: `1px dashed ${asideBorderColor}`,
  marginRight: '50px',
  paddingTop: '0.5rem',
}))

const Main = styled.main(() => mq({
  flex: 1,
  maxWidth: ['100%', '100%', `calc(100vw - ${asideBarWidth + 100}px)`],
}))

const Layout = ({ children }) => {
  const data = useStaticQuery(graphql`
    {
      blog: allFile( filter: { fields: { page: { type: { eq: "blog" } } } }, sort: { order:DESC, fields: fields___page___date }, limit: 1 ) {
        nodes {
          fields {
            page {
              path
            }
          }
        }
      }
      site {
        siteMetadata {
          title
        }
      }
    }
  `)

  const navLinks = useMemo(() => [
    {
      regexTest: /archives\//,
      label: 'Blog',
      path: data.blog.nodes[0].fields.page.path
    },
    {
      regexTest: /archives$/,
      label: 'Archives',
      path: '/archives'
    },
    {
      regexTest: /code/,
      label: 'Code',
      path: '/code'
    },
    {
      regexTest: /talks/,
      label: 'Talks',
      path: '/talks'
    },
    {
      regexTest: /about/,
      label: 'About',
      path: '/about'
    },
  ], [ data ])

  return (
    <>
      <Global styles={resetStyles}/>
      <Global styles={globalStyles}/>
      <Header navLinks={navLinks} siteTitle={data.site.siteMetadata.title} />
      <Content>
        <StyledAside />
        <Main>{children}</Main>
      </Content>
      <Footer navLinks={navLinks} />
    </>
  )
}

Layout.propTypes = {
  children: PropTypes.node.isRequired,
}

export default Layout
