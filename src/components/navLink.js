import { Link } from "gatsby-plugin-intl"
import styled from '@emotion/styled'
import React from 'react'

import Icon from './icon'

const Anchor = styled.a`
  svg {
    font-size: 80%;
  }
`

export default ({ navLink }) => (
  (navLink.path.startsWith('http')) ? (
    <Anchor href={navLink.path}>{navLink.label} <Icon name={['fas', 'external-link-alt']} /></Anchor>
  ) : (
    <Link to={navLink.path}>{navLink.label}</Link>
  )
)
