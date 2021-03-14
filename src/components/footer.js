import { Link } from "gatsby-plugin-intl"
import React from "react"
import { flex, childAnchors } from 'emotion-styled-utils'
import styled from '@emotion/styled'

import SocialLinks from './socialLinks'
import Button from './button'
import NavLink from './navLink'

const Container = styled.footer`
  background-color: ${({ theme }) => theme.footer.bgColor};
  padding: 2rem;
  margin-top: 3rem;
  border-top: 1px dashed ${({ theme }) => theme.footer.borderColor};;
  font-size: 1.3rem;

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

const TopRight = styled.div`
  text-align: right;
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
    font-size: 70%;
    margin-bottom: 0.4rem;
  }
`

const BuyMeACoffee = styled.a`
  display: inline-block;

  img {
    height: 34px;
    width: 35px;
    vertical-align: middle;
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
      <TopRight>
        <BuyMeACoffee
          target='_blank'
          href='https://www.buymeacoffee.com/hiddentao'
        >
          <Button>
            <img src="https://cdn.buymeacoffee.com/buttons/bmc-new-btn-logo.svg" alt="Buy me a coffee" />
            <span>Buy me a coffee</span>
          </Button>
        </BuyMeACoffee>
      </TopRight>
    </Top>
    <Copyright>
      © Hiddentao Ltd
    </Copyright>
  </Container>
)

export default Footer
