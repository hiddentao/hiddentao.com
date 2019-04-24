import React from "react"
import styled from '@emotion/styled'

import { avatarImgBorderColor } from '../styles/common'
import SocialLinks from "./socialLinks"
import Icon from "./icon"

const Container = styled.aside``

const avatarImgWidth = '75%'

const AvatarImg = styled.img`
  width: ${avatarImgWidth};
  height: ${avatarImgWidth};
  border-radius: ${avatarImgWidth};
  padding: 5px;
  border: 1px solid ${avatarImgBorderColor};
`

const StyledSocialLinks = styled(SocialLinks)`
  margin: 0 0 0 1rem;
`

const LocationInfo = styled.div`
  margin: 1rem 0 0.7rem 1rem;
  svg {
    min-width: 2em;
  }
`

const Aside = ({ className }) => {
  return (
    <Container className={className}>
      <AvatarImg src="https://en.gravatar.com/userimage/8741423/cc61f1f47e6f0f00b509b644ed1355dc.jpg?size=200" alt="Ramesh Nair" />
      <LocationInfo>
        <Icon name={['fas', 'map-pin']} /><span>London, UK</span>
      </LocationInfo>
      <StyledSocialLinks />
    </Container>
  )
}

export default Aside
