import { Link } from "gatsby-plugin-intl"
import React, { useCallback, useState } from "react"
import styled from '@emotion/styled'
import { Location } from '@reach/router'

import { mq } from '../styles/breakpoints'
import Button from './button'
import {
  anchorColor,
  navLinkActiveBgColor,
  navLinkHoverColor,
  navLinkColor,
  headerBgColor
} from '../styles/common'

const Container = styled.header`
  background-color: ${headerBgColor};
  padding: 0.5rem 1.2rem;
  height: 4rem;
  box-shadow: 0px 0px 14px 0px rgba(0,0,0,0.75);
  a {
    border: none;
    color: ${navLinkColor};
    text-decoration: none;
    border-bottom: 1px solid transparent;
    &:hover {
      color: ${navLinkHoverColor};
      background-color: transparent;
      border-bottom: 1px solid ${anchorColor};
    }
  }

  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`

const Brand = styled.div`
  font-size: 1rem;
  font-weight: bolder;
  a {
    color: #eee;
  }
`

const Nav = styled.ul(() => mq({
  fontSize: '1.2rem',
  listStyle: 'none',
  display: ['none', 'none', 'block'],
}))

const MobileNavButton = styled(Button)(({ open }) => mq({
  display: ['block', 'block', 'none'],
  borderColor: navLinkColor,
  color: navLinkColor,
  '&:hover': {
    color: navLinkHoverColor,
    borderColor: navLinkHoverColor,
    backgroundColor: 'transparent',
  },
  transform: `rotate(${open ? '180deg': '0deg'})`,
  transition: 'all 0.2s',
}))

const NavItem = styled.li`
  padding: 1em;
  display: inline-block;
  font-size: 1rem;
  background-color: ${({ selected }) => selected ? navLinkActiveBgColor : 'transparent'};
  border-radius: 5px;
  a {
    text-transform: lowercase;
    color: ${({ selected }) => selected ? navLinkHoverColor : navLinkColor};
  }
`

const MobileNav = styled.ul`
  position: absolute;
  z-index: 2;
  top: 4rem;
  right: 0;
  background-color: ${headerBgColor};
  border-bottom-left-radius: 5px;
  border-bottom-right-radius: 5px;
  box-shadow: 0px 0px 14px 0px rgba(0,0,0,0.75);
`

const MobileNavItem = styled.li`
  padding: 1em 2em;
  display: block;
  font-size: 1rem;
  background-color: ${({ selected }) => selected ? navLinkActiveBgColor : 'transparent'};
  border-bottom: 1px solid ${navLinkColor};
  text-align: center;
  &:last-of-type {
    border-bottom: none;
  }
  a {
    color: ${({ selected }) => selected ? navLinkHoverColor : navLinkColor};
  }
`

const _isViewingUrl = (location, regex) => !!location.pathname.match(regex)

const NavLinks = ({ children: links, Component }) => (
  <Location>
    {({ location }) => (
      links.map(navLink => (
        <Component key={navLink.label} selected={_isViewingUrl(location, navLink.regexTest)}>
          <Link to={navLink.path}>{navLink.label}</Link>
        </Component>
      ))
    )}
  </Location>
)

const Header = ({ navLinks, siteTitle }) => {
  const [ mobileMenuOpen, setMobileMenuOpen ] = useState(false)

  const toggleMobileMenu = useCallback(() => setMobileMenuOpen(!mobileMenuOpen),
    [ mobileMenuOpen, setMobileMenuOpen ]
  )

  return (
    <Container>
      <Brand>
        <Link to="/">{siteTitle}</Link>
      </Brand>
      <Nav>
        <NavLinks Component={NavItem}>{navLinks}</NavLinks>
      </Nav>
      <MobileNavButton onClick={toggleMobileMenu} open={mobileMenuOpen}>↓</MobileNavButton>
      {mobileMenuOpen ? (
        <MobileNav>
          <NavLinks Component={MobileNavItem}>{navLinks}</NavLinks>
        </MobileNav>
      ) : null}
    </Container>
  )
}

export default Header
