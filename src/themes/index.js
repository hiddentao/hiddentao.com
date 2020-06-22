import { Themes } from 'emotion-styled-utils'

import dark from './dark'

export const setupThemes = breakpoints => {
  const themes = new Themes({}, breakpoints)

  themes.add('default', dark)

  return themes
}