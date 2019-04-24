import { mq } from './breakpoints'
import { bodyColor, anchorColor, anchorHoverColor } from './common'

export default mq({
  '*':{
    boxSizing: 'border-box'
  },
  html: {
    fontFamily: `San Francisco, Roboto, Segoe UI, Helvetica Neue, Lucida Grande, Arial,sans-serif`,
    fontSize: ['16px', '18px'],
    color: bodyColor,
  },
  a: {
    cursor: 'pointer',
    textDecoration: 'underline',
    color: anchorColor,
    '&:hover': {
      color: anchorHoverColor,
      backgroundColor: anchorColor,
    }
  },
  'h1, h2, h3': {
    margin: '1em 0',
    fontWeight: 'bolder',
  },
  'h1': {
    fontSize: '2.1rem',
    margin: '1rem 0 0',
  },
  'h2': {
    fontSize: '1.5rem',
  },
  'h3': {
    fontSize: '1.2rem',
  },
})
