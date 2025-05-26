import styled from '@emotion/styled'
import { childAnchors, flex } from 'emotion-styled-utils'
import { Link } from "gatsby"
import React from "react"

import NavLink from './navLink'
import SocialLinks from './socialLinks'

const Container = styled.footer`
  background-color: ${({ theme }) => theme.footer.bgColor};
  padding: 2rem;
  margin-top: 3rem;
  border-top: 1px dashed ${({ theme }) => theme.footer.borderColor};;
  font-size: 1rem;

  ${({ theme }) => childAnchors(theme.footer.anchor)};
`

const Top = styled.div`
  ${flex({ direction: 'column', justify: 'flex-start', align: 'flex-start' })};
  margin-bottom: 2.5rem;

  ${({ theme }) => theme.media.when({ minW: 'desktop' })} {
    ${flex({ direction: 'row', justify: 'space-between', align: 'flex-start' })};
  }
`

const TopLeft = styled.div`
  ${flex({ direction: 'row', justify: 'flex-start', align: 'flex-start' })};
  margin-bottom: 3rem;

  ${({ theme }) => theme.media.when({ minW: 'desktop' })} {
    margin-bottom: 0;
  }
`

const Nav = styled.ul`
  list-style: none;
  display: block;
  min-width: 7rem;
  margin-right: 2rem;
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
    margin-bottom: 0.4rem;
  }
`

const Footer = ({ navLinks }) => (
  <Container>
    <Top>
      <TopLeft>
        <Nav>
          <TopNavItem><Link to='/'>Home</Link></TopNavItem>
          {navLinks.map(navLink => (
            <NavItem key={navLink.label}>
              <NavLink navLink={navLink} />
            </NavItem>
          ))}
        </Nav>
        <Social>
          <StyledSocialLinks />
        </Social>
      </TopLeft>
    </Top>
    <Copyright>
      © Ramesh Nair
    </Copyright>
  </Container>
)

export default Footer
