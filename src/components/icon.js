import React from 'react'

// From https://github.com/FortAwesome/react-fontawesome/issues/134#issuecomment-471940596
import "@fortawesome/fontawesome-svg-core/styles.css"

import { config, library } from "@fortawesome/fontawesome-svg-core"
import {
  faGithub,
  faLinkedin,
  faStackOverflow
} from '@fortawesome/free-brands-svg-icons'
import {
  faBars,
  faEnvelope,
  faExternalLinkAlt,
  faFolder,
  faHome,
  faMapPin,
  faRss,
  faToriiGate,
} from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

config.autoAddCss = false

library.add(
  faExternalLinkAlt,
  faLinkedin,
  faGithub,
  faStackOverflow,
  faRss,
  faEnvelope,
  faMapPin,
  faHome,
  faBars,
  faToriiGate,
)

export default ({ name }) => <FontAwesomeIcon icon={name} />
