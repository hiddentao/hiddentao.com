import React from "react"
import styled from '@emotion/styled'

import SocialLinks from "./socialLinks"
import Icon from "./icon"
import RamImage from './ramImage'

const Container = styled.aside``

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
      <RamImage size='75%' />
      <LocationInfo>
        <Icon name={['fas', 'map-pin']} /><span>London, UK</span>
      </LocationInfo>
      <StyledSocialLinks />
    </Container>
  )
}

export default Aside
