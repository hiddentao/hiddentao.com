import { graphql, useStaticQuery } from "gatsby"
import React, { useState, useMemo, useCallback } from "react"
import Headroom from "react-headroom"
import { Tooltip } from "react-tooltip"
import { cx } from "../utils/cx"

import Footer from "./footer"
import Header from "./header"

import MaxContentWidth from "./maxContentWidth"

global.process = require("process")

const Layout = ({ children, noHeader, noFooter }) => {
  const [floatingHeader, setFloatingHeader] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const onHeaderFloat = useCallback(() => {
    setFloatingHeader(true)
  }, [])

  const onHeaderUnfloat = useCallback(() => {
    setFloatingHeader(false)
  }, [])

  const showFloatingBg = floatingHeader || mobileMenuOpen

  useStaticQuery(graphql`
    {
      site {
        siteMetadata {
          title
        }
      }
    }
  `)

  const navLinks = useMemo(
    () => [
      {
        regexTest: /blog$/,
        label: "Blog",
        path: "/blog",
      },
      {
        regexTest: /talks/,
        label: "Talks",
        path: "/talks",
      },
      {
        regexTest: /code/,
        label: "Code",
        path: "/code",
      },
    ],
    []
  )

  return (
    <>
      <Tooltip id="app-tooltip" place="top" className="app-tooltip" />
      <div className="scanline"></div>
      <div className="text-white bg-standard [background-image:linear-gradient(color-mix(in_srgb,var(--color-blue-ncs)_10%,transparent)_1px,transparent_1px),linear-gradient(90deg,color-mix(in_srgb,var(--color-blue-ncs)_10%,transparent)_1px,transparent_1px)] [background-size:40px_40px] bg-fixed min-h-screen">
        <Headroom
          onPin={onHeaderFloat}
          onUnfix={onHeaderUnfloat}
          pin={mobileMenuOpen}
          style={{ zIndex: 1000 }}
        >
          <div
            className={cx(
              "transition-all duration-300 mx-0",
              showFloatingBg
                ? "bg-[color-mix(in_srgb,var(--color-caribbean-green)_90%,transparent)] shadow-[0_2px_2px_color-mix(in_srgb,var(--color-black)_75%,transparent)]"
                : "bg-transparent shadow-none",
              noHeader && !showFloatingBg && "opacity-0 pointer-events-none"
            )}
          >
            <MaxContentWidth>
              <Header
                navLinks={navLinks}
                mobileMenuOpen={mobileMenuOpen}
                setMobileMenuOpen={setMobileMenuOpen}
              />
            </MaxContentWidth>
          </div>
        </Headroom>
        <div className="w-full relative">{children}</div>
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
