import { graphql, useStaticQuery } from "gatsby"
import BgImg from 'gatsby-background-image'
import Img from "gatsby-image"
import safeGet from 'lodash.get'
import React, { useMemo } from "react"

import reactNativeTabbedNavGif from '../images/react-native-tabbed-nav.gif'

const GIFS = {
  'react-native-tabbed-nav.gif': reactNativeTabbedNavGif
}

const Image = ({ src, bg, ...props }) => {
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

  if (src.endsWith('gif')) {
    return <img src={GIFS[src]} alt={props.alt} title={props.title} />
  } if (fluid) {
    return bg ? (
      <BgImg
        fluid={fluid}
        {...props}
      />
    ) : (
      <Img
        fluid={fluid}
        style={{
          maxWidth: fluid.presentationWidth,
          margin: "0 auto",
        }}
        Tag='div'
        {...props}
      />
    )
  }
  
  return null
}

export default Image
