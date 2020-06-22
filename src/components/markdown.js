import safeGet from 'lodash.get'
import React, { useMemo } from "react"
import styled from '@emotion/styled'
import unified from 'unified'
import parse from 'remark-parse'
import remark2react from 'remark-react'
import { Link } from 'gatsby-plugin-intl'

import SyntaxHighlighter from './syntaxHighlighter'
import Image from './image'

const Container = styled.div`
  ${({ theme }) => theme.font('text', 'regular')};
  line-height: 1.3em;

  strong, b {
    font-weight: bolder;
  }

  em, i {
    font-style: italic;
  }

  ol, ul {
    margin: 1.2em 0 1.2em 2em;
    list-style-type: disc;
    li {
      margin: 0.5em 0;
    }
  }

  ol {
    list-style-type: decimal;
  }

  img {
    max-width: 100%;
  }

  pre {
    font-size: 70%;
    background-color: ${({ theme }) => theme.code.bgColor};
  }
`

const CodeSpan = styled.span`
  font-family: monospace;
  font-size: 80%;
  padding: 0.1em;
  background-color: ${({ theme }) => theme.code.bgColor};
`

const P = styled.p`
  margin: 1em 0;

  &:first-of-type {
    margin-top: 0;
  }
`

const ImgDiv = styled.div`
  margin: 2em 0;
  text-align: center;

  & > img, & > div {
    display: block;
    margin: 0 auto;
    max-width: 90%;
  }

  em {
    margin-top: 0.2em;
    font-size: 90%;
  }

  ${({ theme }) => theme.media.when({ minW: 'mobile' })} {
    & > img, & > div {
      max-width: 500px;
    }
  }
`

const RenderParagraph = ({ children }) => {
  const imgSrc = safeGet(children, '0.props.src', '')
  const dotPos = imgSrc.lastIndexOf('.')
  const ext = (dotPos ? imgSrc.substring(dotPos + 1) : '').toLowerCase()

  switch (ext) {
    case 'jpg':
    case 'jpeg':
    case 'gif':
    case 'png':
    case 'bmp':
      return <ImgDiv>{children}</ImgDiv>
    default:
      return <P>{children}</P>
  }
}

const RenderImage = arg => {
  const { src, alt, title } = arg

  const finalSrc = (src.startsWith('//')) ? `https://${src}` : src

  // external image links should be rendered using normal image tag
  if (finalSrc.startsWith('http')) {
    return <img src={finalSrc} alt={alt} title={title} />
  } else {
    return <Image src={finalSrc} alt={alt} title={title} />
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

const generateRenderPre = bodyMarkdown => args => {
  // hack to get the code fence language
  const codeSrc = safeGet(args, 'children.0.props.children.0')
  const codeSrcTrimmed = codeSrc.substr(0, 50).trim()

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
    const snippet = bodyMarkdown.substring(m.index + m[0].length).substr(0, 50).trim()
    if (snippet.localeCompare(codeSrcTrimmed) === 0) {
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
    unified()
      .use(parse)
      .use(remark2react, {
        remarkReactComponents: {
          p: RenderParagraph,
          img: RenderImage,
          a: RenderAnchor,
          pre: generateRenderPre(markdown),
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
