import React, { Fragment } from 'react'
import { css, Global } from '@emotion/core'
import { useTheme } from 'emotion-theming'
import { resetStyles, childAnchors } from 'emotion-styled-utils'

const GlobalStyles = () => {
  const theme = useTheme()

  return (
    <Fragment>
      {/* <link rel='stylesheet' href='https://unpkg.com/@fortawesome/fontawesome-svg-core@1.2.17/styles.css' integrity='sha384-bM49M0p1PhqzW3LfkRUPZncLHInFknBRbB7S0jPGePYM+u7mLTBbwL0Pj/dQ7WqR' crossOrigin='anonymous' /> */}
      <Global styles={css(resetStyles)} />
      <Global styles={css`
        * {
          box-sizing: border-box;
        }

        html {
          ${theme.font('body')};
          font-size: 16px;

          ${theme.media.when({ minW: 'mobile' })} {
            font-size: 18px;
          }
        }

        ${childAnchors({
          ...theme.anchor,
          extraStyles: `
            cursor: pointer;
            text-decoration: none;
          `
        })};

        h1, h2, h3 {
          ${theme.font('header')};
          margin: 1.8em 0 1em;
          font-weight: bolder;
          line-height: 1em;
        }

        h1 {
          font-size: 2.1rem;
          margin: 0 0 1.8em;
        }

        h2 {
          font-size: 1.5em;
        }

        h3 {
          font-weight: 300;
          font-size: 1.2em;
        }
      `} />
    </Fragment>
  )
}

export default GlobalStyles