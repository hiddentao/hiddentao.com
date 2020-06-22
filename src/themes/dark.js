import Color from 'color'
import { opacify } from 'emotion-styled-utils'

import {
  white,
  black,
  darkGrey,
  darkestGrey,
  green,
  red,
  yellow,
  grey,
  lightGrey,
  lighterGrey,
  transparent,
} from './colors'

// https://coolors.co/ef476f-ffd166-06d6a0-118ab2-073b4c
const paradisePink = '#ef476f'
const orangeYellowCrayola = '#ffd166'
const caribbeanGreen = '#06d6a0'
const blueNcs = '#118ab2'
const midnightGreenEagleGreen = '#073b4c'
const violet = '#6a4c93'

const textColor = white
const anchorColor = paradisePink

const sectionBgColor = opacify(violet, 0.9)//Color(caribbeanGreen).alpha(0.3).hex()
const sectionAnchorColor = anchorColor//Color(anchorColor).lighten(0.1).hex()

const shadowColor = 'rgba(0,0,0,0.75)'

export default {
  textColor,
  anchor: {
    textColor: anchorColor,
    hoverTextColor: white,
    hoverBgColor: anchorColor,
    borderColor: anchorColor,
    hoverBorderColor: anchorColor,
  },
  button: {
    disabledBgColor: grey,
    disabledTextColor: darkGrey,
    disabledBorderColor: grey,
    bgColor: anchorColor,
    textColor: white,
    borderColor: anchorColor,
    hoverBgColor: opacify(anchorColor, 0.9),
    hoverTextColor: white,
    hoverBorderColor: anchorColor,
    shadowColor,
  },
  header: {
    nav: {
      anchor: {
        textColor: white,
        borderColor: transparent,
        hoverTextColor: black,
        hoverBgColor: white,
        hoverBorderColor: white,
      },
      mobileButton: {
        bgColor: transparent,
        textColor: white,
        borderColor: transparent,
        hoverBgColor: white,
        hoverTextColor: black,
        hoverBorderColor: transparent,
        shadowColor,
      },
    },
    mobileNav: {
      bgColor: caribbeanGreen,
      hoverBgColor: Color(caribbeanGreen).darken(0.2).hex(),
      borderColor: Color(caribbeanGreen).lighten(0.2).hex(),
      shadowColor,
    },
    floating: {
      wrapper: {
        bgColor: opacify(caribbeanGreen, 0.9),
        shadowColor,
      },
    },
    wrapper: {
      bgColor: opacify(caribbeanGreen, 0),
    },
  },
  splash: {
    dividerColor: darkGrey,
    anchor: {
      textColor: white,
      hoverTextColor: anchorColor,
      hoverBgColor: transparent,
      borderColor: transparent,
      hoverBorderColor: transparent,
    },
  },
  testimonial: {
    bgColor: transparent,
    shadowColor,
    quote: {
      textColor: grey,
    },
    attribution: {
      textColor: white,
    }
  },
  section: {
    bgColor: sectionBgColor,
    textColor: white,
    borderColor: sectionBgColor,
    shadowColor,
    heading: {
      textColor: black,
    },
    anchor: {
      textColor: sectionAnchorColor,
      borderColor: sectionAnchorColor,
      hoverTextColor: white,
      hoverBgColor: sectionAnchorColor,
      hoverBorderColor: sectionAnchorColor,
    },
  },
  contentSection: {
    bgColor: white,
    textColor: black,
  },
  aside: {
    textColor: lightGrey,
    borderColor: lightGrey,
  },
  lastUpdatedDate: {
    textColor: Color(lightGrey).darken(0.2).hex(),
    warning: {
      textColor: orangeYellowCrayola,
    },
  },
  readTime: {
    textColor: lightGrey,
  },
  footer: {
    borderColor: darkGrey,
    anchor: {
      textColor: anchorColor,
      hoverTextColor: white,
      hoverBgColor: anchorColor,
      borderColor: transparent,
      hoverBorderColor: anchorColor,
    },
    copyright: {
      textColor: darkGrey,
    },
  },
  archives: {
    year: {
      borderColor: darkGrey,
    },
  },
  languageModal: {
    title: {
      textColor: black,
    },
  },
  postList: {
    date: {
      textColor: grey,
    }
  },
  alert: {
    warning: {
      bgColor: yellow,
      borderColor: yellow,
    }
  },
  pageBottomNav: {
    borderColor: grey,
  },
  ramImage: {
    shadowColor,
  },
  code: {
    bgColor: opacify(orangeYellowCrayola, 0.5),
  },
}

