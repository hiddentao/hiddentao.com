import React from 'react'

// From https://github.com/FortAwesome/react-fontawesome/issues/134#issuecomment-471940596
import "@fortawesome/fontawesome-svg-core/styles.css"

import { config, library } from "@fortawesome/fontawesome-svg-core"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faTwitter,
  faLinkedin,
  faGithub,
  faStackOverflow
} from '@fortawesome/free-brands-svg-icons'
import {
  faRss,
  faEnvelope,
  faMapPin,
  faHome,
  faBars,
  faExternalLinkAlt,
} from '@fortawesome/free-solid-svg-icons'

config.autoAddCss = false

library.add(
  faExternalLinkAlt,
  faTwitter,
  faLinkedin,
  faGithub,
  faStackOverflow,
  faRss,
  faEnvelope,
  faMapPin,
  faHome,
  faBars,
)

export default ({ name }) => <FontAwesomeIcon icon={name} />
