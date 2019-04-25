import safeGet from 'lodash.get'
import React, { useMemo } from "react"
import { graphql, useStaticQuery } from "gatsby"
import Img from "gatsby-image"

import reactNativeTabbedNavGif from '../images/react-native-tabbed-nav.gif'

const GIFS = {
  'react-native-tabbed-nav.gif': reactNativeTabbedNavGif
}

const Image = ({ src, ...props }) => {
  if (src.endsWith('gif')) {
    return <img src={GIFS[src]} alt={props.alt} title={props.title} />
  }

  const data = useStaticQuery(graphql`
    query {
      allFile( filter: { internal: { mediaType: { regex: "/image/" } } } ) {
        nodes {
          relativePath
          childImageSharp {
            fluid {
              ...GatsbyImageSharpFluid_noBase64
              presentationWidth
            }
          }
        }
      }
    }
  `)

  const match = useMemo(() => (
    data.allFile.nodes.find(({ relativePath }) => src === relativePath)
  ), [ data, src ])

  const fluid = safeGet(match, 'childImageSharp.fluid')

  return fluid ? (
    <Img
      fluid={fluid}
      style={{
        maxWidth: fluid.presentationWidth,
        margin: "0 auto",
      }}
      Tag='div'
      {...props}
    />
  ) : null
}

export default Image
