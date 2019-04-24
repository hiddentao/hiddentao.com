import facepaint from 'facepaint'

const breakpoints = [450, 750]

export const mq = facepaint(
  breakpoints.map(bp => `@media (min-width: ${bp}px)`)
)
