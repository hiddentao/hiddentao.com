import React from 'react'

export const onRenderBody = ({ setHeadComponents }) => {
  setHeadComponents([
    <link
      key="gf-preconnect-1"
      rel="preconnect"
      href="https://fonts.googleapis.com"
    />,
    <link
      key="gf-preconnect-2"
      rel="preconnect"
      href="https://fonts.gstatic.com"
      crossOrigin="anonymous"
    />,
    <link
      key="gf-bricolage"
      rel="stylesheet"
      href="https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:wght@400;700&display=swap"
    />,
    <link
      key="gf-firacode"
      rel="stylesheet"
      href="https://fonts.googleapis.com/css2?family=Fira+Code:wght@400;600&display=swap"
    />,
  ])
}
