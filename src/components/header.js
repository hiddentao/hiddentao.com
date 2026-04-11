import { Link } from "gatsby"
import React, { useCallback, useState } from "react"
import styled from '@emotion/styled'
import { Location } from '@reach/router'
import { buttonStyles } from 'emotion-styled-utils'

import Button from './button'
import Icon from './icon'

const HeaderContainer = styled.div`
  width: 100%;
  padding: 1rem 1.2rem;
`

const NavContainer = styled.nav`
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: #fff;
  font-size: 1.1rem;
`

const NavLinks = styled.div`
  display: none;
  gap: 2rem;

  a {
    color: #fff;
    text-decoration: none;
    &[data-selected="true"] {
      color: var(--caribbean-green);
    }
  }
  a:hover { color: var(--caribbean-green); }

  ${({ theme }) => theme.media.when({ minW: 'desktop' })} {
    display: flex;
  }
`

const MobileNavButton = styled(Button)`
  display: block;
  ${({ theme }) => buttonStyles(theme.header.nav.mobileButton)};

  transform: rotate(${({ open }) => open ? 90 : 0}deg);
  transition: all 0.2s;
  color: #fff;

  ${({ theme }) => theme.media.when({ minW: 'desktop' })} {
    display: none;
  }
`

const MobileNavContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  padding-top: 1rem;
  border-top: 1px dashed #333;
  margin-top: 1rem;

  a {
    color: #fff;
    text-decoration: none;
    &[data-selected="true"] {
      color: var(--caribbean-green);
    }
  }
  a:hover { color: var(--caribbean-green); }
`

const _isViewingUrl = (location, regex) => !!location.pathname.match(regex)

const Header = ({ navLinks, ...props }) => {
  const [ mobileMenuOpen, setMobileMenuOpen ] = useState(false)

  const toggleMobileMenu = useCallback(() => setMobileMenuOpen(!mobileMenuOpen),
    [ mobileMenuOpen, setMobileMenuOpen ]
  )

  return (
    <HeaderContainer {...props}>
      <NavContainer className="mono">
        <Link to="/" className="brand">hiddentao</Link>
        <Location>
          {({ location }) => (
            <NavLinks>
              <Link to="/services" data-selected={_isViewingUrl(location, /services/)}>/services</Link>
              <Link to="/blog" data-selected={_isViewingUrl(location, /blog/)}>/blog</Link>
              <Link to="/projects" data-selected={_isViewingUrl(location, /projects/)}>/projects</Link>
              <Link to="/talks" data-selected={_isViewingUrl(location, /talks/)}>/talks</Link>
            </NavLinks>
          )}
        </Location>
        <MobileNavButton onClick={toggleMobileMenu} open={mobileMenuOpen}>
          <Icon name={['fas', 'bars']} />
        </MobileNavButton>
      </NavContainer>
      
      {mobileMenuOpen && (
        <Location>
          {({ location }) => (
            <MobileNavContainer className="mono">
              <Link to="/services" data-selected={_isViewingUrl(location, /services/)}>/services</Link>
              <Link to="/blog" data-selected={_isViewingUrl(location, /blog/)}>/blog</Link>
              <Link to="/projects" data-selected={_isViewingUrl(location, /projects/)}>/projects</Link>
              <Link to="/talks" data-selected={_isViewingUrl(location, /talks/)}>/talks</Link>
            </MobileNavContainer>
          )}
        </Location>
      )}
    </HeaderContainer>
  )
}

export default Header
