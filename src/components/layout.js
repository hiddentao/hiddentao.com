import { graphql, useStaticQuery } from 'gatsby'
import React, { useState, useMemo, useCallback } from "react"
import Headroom from 'react-headroom'

import Footer from "./footer"
import GlobalStyles from './globalStyles'
import Header from "./header"

import MaxContentWidth from "./maxContentWidth"

global.process = require('process')

const Layout = ({ children, noHeader, noFooter }) => {
  const [floatingHeader, setFloatingHeader] = useState(false)

  const onHeaderFloat = useCallback(() => {
    setFloatingHeader(true)
  }, [])

  const onHeaderUnfloat = useCallback(() => {
    setFloatingHeader(false)
  }, [])

  useStaticQuery(graphql`
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

  const headerWrapperStyle = {
    backgroundColor: floatingHeader ? 'rgba(6, 214, 160, 0.9)' : 'rgba(6, 214, 160, 0)',
    boxShadow: floatingHeader ? '0 2px 2px rgba(0,0,0,0.75)' : 'none',
    ...(noHeader && !floatingHeader ? { opacity: 0, pointerEvents: 'none' } : {}),
  }

  return (
    <>
      <GlobalStyles />
      <div className="scanline"></div>
      <div
        className="text-white"
        style={{
          backgroundColor: '#02080a',
          backgroundImage: 'linear-gradient(rgba(17, 138, 178, 0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(17, 138, 178, 0.1) 1px, transparent 1px)',
          backgroundSize: '40px 40px',
          backgroundAttachment: 'fixed',
          minHeight: '100vh',
        }}
      >
        <Headroom onPin={onHeaderFloat} onUnfix={onHeaderUnfloat}>
          <div className="transition-all duration-300" style={headerWrapperStyle}>
            <MaxContentWidth>
              <Header navLinks={navLinks} />
            </MaxContentWidth>
          </div>
        </Headroom>
        <div className="w-full relative">
          {children}
        </div>
        {!noFooter && (
          <MaxContentWidth>
            <Footer navLinks={navLinks} />
          </MaxContentWidth>
        )}
      </div>
    </>
  )
}

export default Layout
