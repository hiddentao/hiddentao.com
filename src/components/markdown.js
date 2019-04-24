import safeGet from 'lodash.get'
import React, { useMemo } from "react"
import styled from '@emotion/styled'
import remark from 'remark'
import remark2react from 'remark-react'
import { Link } from 'gatsby-plugin-intl'

import { mq } from '../styles/breakpoints'
import SyntaxHighlighter from './syntaxHighlighter'
import Image from './image'

const Container = styled.div(() => mq({
  fontSize: '1rem',
  lineHeight: '1.3em',
  'strong, b': {
    fontWeight: 'bolder',
  },
  'em, i': {
    fontStyle: 'italic',
  },
  ul: {
    margin: '1.2rem 0 1.2rem 2rem',
    listStyleType: 'disc',
    li: {
      margin: '0.5rem 0',
    },
  },
  img: {
    maxWidth: '100%',
  },
  pre: {
    fontSize: '0.8rem'
  }
}))

const CodeSpan = styled.span`
  font-family: monospace;
`

const P = styled.p(() => mq({
  margin: '1rem 0',
  '&:first-of-type': {
    marginTop: '0',
  }
}))

const ImgDiv = styled.div(() => mq({
  margin: '2rem 0',
  textAlign: 'center',
  '& > img, & > div': {
    display: 'block',
    margin: '0 auto',
    maxWidth: ['90%', '500px'],
  },
  em: {
    marginTop: '0.2rem',
    fontSize: '90%',
  }
}))

const RenderParagraph = ({ children }) => {
  if (safeGet(children, '0.type.displayName') === 'RenderImage') {
    return <ImgDiv>{children}</ImgDiv>
  } else {
    return <P>{children}</P>
  }
}

const RenderImage = arg => {
  const { src, alt, title } = arg

  // external image links should be rendered using normal image tag
  if (src.startsWith('http')) {
    return <img src={src} alt={alt} title={title} />
  } else {
    return <Image src={src} alt={alt} title={title} />
  }
}

const RenderAnchor = ({ href, title, children }) => {
  // external image links should be rendered using normal image tag
  if (!href || href.startsWith('http')) {
    return <a href={href} title={title}>{children}</a>
  } else {
    return <Link to={href} title={title}>{children}</Link>
  }
}

const RenderCode = ({ children }) => {
  return <CodeSpan>{children}</CodeSpan>
}

const RenderPre = args => {
  // hack to get the code fence language
  const bodyMarkdown = safeGet(args, 'children.0._owner.memoizedProps.markdown')
  const codeSrc = safeGet(args, 'children.0.props.children.0')

  /*
  Structure is usually:

  ```<lang>
  <codeSrc>
  ```
   */
  let lang = ''
  let m
  const regex = /```\w+\s*\n/gm
  while ((m = regex.exec(bodyMarkdown)) !== null) {
    // to avoid infinite looping
    if (m.index === regex.lastIndex) {
      regex.lastIndex++
    }
    if (bodyMarkdown.substring(m.index + m[0].length).startsWith(codeSrc)) {
      lang = m[0].substring(3).trim()
      break
    }
  }

  return (
    <SyntaxHighlighter language={lang}>{codeSrc}</SyntaxHighlighter>
  )
}

const Markdown = ({ markdown, className }) => {
  const output = useMemo(() => (
    remark()
      .use(remark2react, {
        remarkReactComponents: {
          p: RenderParagraph,
          img: RenderImage,
          a: RenderAnchor,
          pre: RenderPre,
          code: RenderCode,
        }
      })
      .processSync(markdown).contents
  ), [ markdown ])

  return (
    <Container className={className}>{output}</Container>
  )
}

export default Markdown
