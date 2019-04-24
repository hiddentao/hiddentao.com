import { Link } from "gatsby-plugin-intl"
import React from "react"
import styled from '@emotion/styled'

import { footerBgColor, footerLinkColor, anchorHoverColor } from '../styles/common'
import SocialLinks from './socialLinks'

const Container = styled.footer`
  background-color: ${footerBgColor};
  padding: 1rem;
  border-top: 1px solid #999;
  a {
    color: ${footerLinkColor};
    &:hover {
      color: ${anchorHoverColor};
    }
  }
`

const Top = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: flex-start;
  margin-bottom: 1.7rem;
`

const Nav = styled.ul`
  list-style: none;
  display: block;
  font-size: 0.7rem;
  min-width: 7rem;
`

const NavItem = styled.li`
  display: block;
  margin-bottom: 0.3rem;
`

const TopNavItem = styled(NavItem)`
  font-weight: bolder;
`

const Copyright = styled.div`
  font-size: 0.6rem;
`

const Social = styled.div``

const StyledSocialLinks = styled(SocialLinks)`
  li {
    color: ${footerLinkColor};
    font-size: 0.7rem;
    margin-bottom: 0.3rem;
  }
`

const Footer = ({ navLinks }) => (
  <Container>
    <Top>
      <Nav>
        <TopNavItem><Link to='/'>Home</Link></TopNavItem>
        {navLinks.map(navLink => (
          <NavItem key={navLink.label}>
            <Link to={navLink.path}>{navLink.label}</Link>
          </NavItem>
        ))}
      </Nav>
      <Social>
        <StyledSocialLinks />
      </Social>
    </Top>
    <Copyright>
      © HiddenTao Ltd. <a href="https://github.com/hiddentao/hiddentao.github.io">Source on Github</a>.
    </Copyright>
  </Container>
)

export default Footer
