import React, { useState, useEffect, useMemo, useCallback } from "react"
import styled from '@emotion/styled'
import { useStaticQuery, graphql } from 'gatsby'
import { ThemeProvider } from 'emotion-theming'
import Headroom from 'react-headroom'
import { flex, loadFonts, boxShadow } from 'emotion-styled-utils'

import { setupThemes } from '../themes'
import GlobalStyles from './globalStyles'
import Header from "./header"
import Image from "./image"
import MaxContentWidth from "./maxContentWidth"
import Footer from "./footer"

const themes = setupThemes({
  width: {
    mobile: '450px',
    desktop: '750px',
  },
  height: {
    tall: '800px',
  }
})

const Container = styled(Image)`
  color: ${({ theme }) => theme.textColor};
`

const HeaderWrapper = styled.div`
  transition: all 0.3s linear;
  background: ${ ({ floating, theme }) => (floating ? theme.header.floating.wrapper.bgColor : theme.header.wrapper.bgColor) };
  ${({ theme, floating }) => floating ? boxShadow({ color: theme.header.floating.wrapper.shadowColor }) : ''};
  ${({ floating, noStaticHeader }) => (noStaticHeader && !floating) ? `
    opacity: 0;
    pointer-events: none;
  ` : ``};
`

const Content = styled(MaxContentWidth)`
  padding: 2rem 1rem 3rem;
  position: relative;
`

const Layout = ({ children, noHeader }) => {
  const [floatingHeader, setFloatingHeader] = useState(false)

  const onHeaderFloat = useCallback(() => {
    setFloatingHeader(true)
  }, [])

  const onHeaderUnfloat = useCallback(() => {
    setFloatingHeader(false)
  }, [])

  const [ , forceUpdate ] = useState()

  useEffect(() => {
    loadFonts({
      header: {
        name: 'Raleway',
        weights: {
          thin: 300,
          regular: 400,
          bold: 700,
        }
      },
      body: {
        name: 'Roboto',
        weights: {
          thin: 300,
          regular: 400,
          bold: 700,
        }
      },
      text: {
        name: 'Crimson Text',
        weights: {
          regular: 400,
          bold: 700,
        }
      }
    }, window.document).then(forceUpdate, err => console.error(err))
  }, [])

  const data = useStaticQuery(graphql`
    {
      site {
        siteMetadata {
          title
        }
      }
    }
  `)

  const navLinks = useMemo(() => [
    {
      regexTest: /blog$/,
      label: 'Blog',
      path: '/blog'
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
    <ThemeProvider theme={themes.get('default')}>
      <GlobalStyles />
      <Container bg={true} src='bg.png' style={{
        backgroundPosition: 'auto',
        backgroundColor: 'black',
        backgroundAttachment: 'fixed',
        backgroundRepeat: 'repeat',
        backgroundSize: 'auto',
        minHeight: '100vh',
      }}>
        <Headroom onPin={onHeaderFloat} onUnfix={onHeaderUnfloat}>
          <HeaderWrapper floating={floatingHeader} noStaticHeader={noHeader}>
            <MaxContentWidth>
              <Header navLinks={navLinks} />
            </MaxContentWidth>
          </HeaderWrapper>
        </Headroom>
        <Content>
          {children}
        </Content>
        <MaxContentWidth>
          <Footer navLinks={navLinks} />
        </MaxContentWidth>
      </Container>
    </ThemeProvider>
  )
}

export default Layout
