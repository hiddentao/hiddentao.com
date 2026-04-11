import { ThemeProvider } from '@emotion/react'
import styled from '@emotion/styled'
import { boxShadow, flex, loadFonts } from 'emotion-styled-utils'
import { graphql, useStaticQuery } from 'gatsby'
import React, { useState, useEffect, useMemo, useCallback } from "react"
import Headroom from 'react-headroom'

import { setupThemes } from '../themes'
import Footer from "./footer"
import GlobalStyles from './globalStyles'
import Header from "./header"

import MaxContentWidth from "./maxContentWidth"

global.process = require('process')

const themes = setupThemes({
  width: {
    mobile: '450px',
    desktop: '750px',
  },
  height: {
    tall: '800px',
  }
})

const Container = styled.div`
  color: ${({ theme }) => theme.textColor};
`

const HeaderWrapper = styled.div`
  transition: all 0.3s linear;
  background: ${ ({ floating, theme }) => (floating ? theme.header.floating.wrapper.bgColor : theme.header.wrapper.bgColor) };
  ${({ theme, floating }) => floating ? boxShadow({ color: theme.header.floating.wrapper.shadowColor }) : ''};
  ${({ floating, noStaticHeader }) => (noStaticHeader && !floating) ? `
    opacity: 0;
    pointer-events: none;
  ` : ""};
`

const Content = styled.div`
  width: 100%;
  position: relative;
`

const Layout = ({ children, noHeader, noFooter }) => {
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
        name: 'Bricolage Grotesque',
        weights: {
          regular: 400,
          bold: 700,
        }
      },
      body: {
        name: 'Bricolage Grotesque',
        weights: {
          regular: 400,
          bold: 700,
        }
      },
      text: {
        name: 'Fira Code',
        weights: {
          regular: 400,
          bold: 600,
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
      regexTest: /projects/,
      label: 'Projects',
      path: '/projects'
    },
  ], [])

  return (
    <ThemeProvider theme={themes.get('default')}>
      <GlobalStyles />
      <div className="scanline"></div>
      <Container style={{
        backgroundColor: '#02080a',
        backgroundImage: 'linear-gradient(rgba(17, 138, 178, 0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(17, 138, 178, 0.1) 1px, transparent 1px)',
        backgroundSize: '40px 40px',
        backgroundAttachment: 'fixed',
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
        {!noFooter && (
          <MaxContentWidth>
            <Footer navLinks={navLinks} />
          </MaxContentWidth>
        )}
      </Container>
    </ThemeProvider>
  )
}

export default Layout
