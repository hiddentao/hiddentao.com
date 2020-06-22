import { Link } from "gatsby-plugin-intl"
import React from "react"
import { childAnchors } from 'emotion-styled-utils'
import styled from '@emotion/styled'

import SocialLinks from './socialLinks'

const Container = styled.footer`
  background-color: ${({ theme }) => theme.footer.bgColor};
  padding: 2rem;
  margin-top: 3rem;
  border-top: 1px dashed ${({ theme }) => theme.footer.borderColor};;
  font-size: 1.3rem;

  ${({ theme }) => childAnchors(theme.footer.anchor)};
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
  min-width: 7rem;
`

const NavItem = styled.li`
  display: block;
  margin-bottom: 0.4rem;
`

const TopNavItem = styled(NavItem)`
  font-weight: bolder;
`

const Copyright = styled.div`
  font-size: 60%;
  color: ${({ theme }) => theme.footer.copyright.textColor};
`

const Social = styled.div``

const StyledSocialLinks = styled(SocialLinks)`
  li {
    color: ${({ theme }) => theme.footer.anchor.textColor};
    font-size: 70%;
    margin-bottom: 0.4rem;
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
      © Hiddentao Ltd
    </Copyright>
  </Container>
)

export default Footer
