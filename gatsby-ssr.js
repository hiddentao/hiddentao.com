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

const UMAMI_WEBSITE_ID = '3b375d0b-e074-4dfc-964d-ba9761515921'

export const onPreRenderHTML = ({
  getHeadComponents,
  replaceHeadComponents,
}) => {
  const headComponents = getHeadComponents()
  replaceHeadComponents([
    ...headComponents,
    <script
      key="umami-analytics"
      defer
      src="https://umami.hiddentao.com/script.js"
      data-website-id={UMAMI_WEBSITE_ID}
    />,
    <script
      key="umami-recorder"
      defer
      src="https://umami.hiddentao.com/recorder.js"
      data-website-id={UMAMI_WEBSITE_ID}
      data-sample-rate="1"
      data-mask-level="moderate"
      data-max-duration="300000"
    />,
  ])
}
