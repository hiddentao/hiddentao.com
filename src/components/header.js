import { Link } from "gatsby-plugin-intl"
import React, { useCallback, useState } from "react"
import styled from '@emotion/styled'
import { Location } from '@reach/router'
import { childAnchors, buttonStyles, boxShadow, flex } from 'emotion-styled-utils'

import Button from './button'
import Icon from './icon'

const Container = styled.header`
  padding: 0.5rem 1.2rem;
  height: 4rem;

  ${({ theme }) => theme.font('header')};

  ${flex({ direction: 'row', justify: 'space-between', align: 'center' })};
`

const Brand = styled.div`
  font-size: 1rem;
  font-weight: bolder;

  ${({ theme }) => childAnchors(theme.header.nav.anchor)};
`

const Nav = styled.ul`
  display: none;
  font-size: 1.2rem;
  list-style: none;

  ${({ theme }) => theme.media.when({ minW: 'desktop' })} {
    display: block;
  }
`

const MobileNavButton = styled(Button)`
  display: block;
  ${({ theme }) => buttonStyles(theme.header.nav.mobileButton)};

  transform: rotate(${({ open }) => open ? 90 : 0}deg);
  transition: all 0.2s;

  ${({ theme }) => theme.media.when({ minW: 'desktop' })} {
    display: none;
  }
`

const NavItem = styled.li`
  display: inline-block;
  font-size: 1rem;

  ${({ theme, selected }) => childAnchors({
    ...theme.header.nav.anchor,
    inHoverState: selected,
    extraStyles: `
      padding: 1em;
      border-radius: 5px;
      text-transform: lowercase;
    `,
  })};
`

const MobileNav = styled.ul`
  position: absolute;
  z-index: 2;
  top: 4rem;
  right: 0;
  border-radius: 5px;
  ${({ theme }) => boxShadow({ color: theme.header.mobileNav.shadowColor })};
`

const roundedCorners = `
  &:first-of-type {
    border-top-left-radius: 5px;
    border-top-right-radius: 5px;
  }

  &:last-of-type {
    border-bottom-left-radius: 5px;
    border-bottom-right-radius: 5px;
  }
`

const MobileNavItem = styled.li`
  display: block;
  font-size: 1rem;
  background-color: ${({ theme, selected }) => selected ? theme.header.mobileNav.hoverBgColor : theme.header.mobileNav.bgColor};
  border-bottom: 1px solid ${({ theme }) => theme.header.mobileNav.borderColor};
  text-align: center;

  &:last-of-type {
    border-color: transparent;
  }

  ${roundedCorners};

  ${({ theme }) => childAnchors({
    ...theme.header.nav.anchor,
    extraStyles: `
      display: block;
      padding: 1em 2em;
      ${roundedCorners};
    `
  })};
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

const Header = ({ navLinks, ...props }) => {
  const [ mobileMenuOpen, setMobileMenuOpen ] = useState(false)

  const toggleMobileMenu = useCallback(() => setMobileMenuOpen(!mobileMenuOpen),
    [ mobileMenuOpen, setMobileMenuOpen ]
  )

  return (
    <Container {...props}>
      <Brand>
        <Link to="/">
          <Icon name={['fas', 'home']} />
        </Link>
      </Brand>
      <Nav>
        <NavLinks Component={NavItem}>{navLinks}</NavLinks>
      </Nav>
      <MobileNavButton onClick={toggleMobileMenu} open={mobileMenuOpen}>
        <Icon name={['fas', 'bars']} />
      </MobileNavButton>
      {mobileMenuOpen ? (
        <MobileNav>
          <NavLinks Component={MobileNavItem}>{navLinks}</NavLinks>
        </MobileNav>
      ) : null}
    </Container>
  )
}

export default Header
