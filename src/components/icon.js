import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { library } from '@fortawesome/fontawesome-svg-core'
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
} from '@fortawesome/free-solid-svg-icons'

library.add(
  faTwitter,
  faLinkedin,
  faGithub,
  faStackOverflow,
  faRss,
  faEnvelope,
  faMapPin,
)

export default ({ name }) => <FontAwesomeIcon icon={name} />
