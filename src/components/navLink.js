import { Link } from "gatsby"
import React from 'react'

import Icon from './icon'

export default ({ navLink }) => (
  navLink.path.startsWith('http') ? (
    <a href={navLink.path} className="[&>svg]:text-[80%]">
      {navLink.label} <Icon name={['fas', 'external-link-alt']} />
    </a>
  ) : (
    <Link to={navLink.path}>{navLink.label}</Link>
  )
)
