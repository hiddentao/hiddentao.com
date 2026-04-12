import safeGet from 'lodash.get'
import React, { useMemo } from "react"
import unified from 'unified'
import parse from 'remark-parse'
import remark2react from 'remark-react'
import { Link } from 'gatsby'

import SyntaxHighlighter from './syntaxHighlighter'
import Image from './image'
import { cx } from '../utils/cx'
import '../styles/markdown.css'

const IMAGE_EXTENSIONS = new Set(['jpg', 'jpeg', 'gif', 'png', 'bmp'])

const RenderParagraph = ({ children }) => {
  const imgSrc = safeGet(children, '0.props.src', '')
  const dotPos = imgSrc.lastIndexOf('.')
  const ext = (dotPos ? imgSrc.substring(dotPos + 1) : '').toLowerCase()

  if (IMAGE_EXTENSIONS.has(ext)) {
    return <div className="md-img-wrapper">{children}</div>
  }
  return <p className="md-paragraph">{children}</p>
}

const RenderImage = ({ src, alt, title }) => {
  const finalSrc = src.startsWith('//') ? `https://${src}` : src

  if (finalSrc.startsWith('http')) {
    return <img src={finalSrc} alt={alt} title={title} />
  }
  return <Image src={finalSrc} alt={alt} title={title} />
}

const RenderAnchor = ({ href, title, children }) => {
  if (href === 'no-longer-valid') {
    return (
      <span
        data-tooltip-id="app-tooltip"
        data-tooltip-content="Sorry, this URL is no longer accessible"
        className="invalid-url"
      >
        {children}
      </span>
    )
  }
  if (!href || href.startsWith('http')) {
    return <a href={href} title={title}>{children}</a>
  }
  return <Link to={href} title={title}>{children}</Link>
}

const RenderCode = ({ children }) => (
  <span className="md-code-span">{children}</span>
)

const generateRenderPre = bodyMarkdown => args => {
  const codeSrc = safeGet(args, 'children.0.props.children.0')
  const codeSrcTrimmed = codeSrc.substr(0, 50).trim()

  let lang = ''
  let m
  const regex = /```\w+\s*\n/gm
  while ((m = regex.exec(bodyMarkdown)) !== null) {
    if (m.index === regex.lastIndex) {
      regex.lastIndex++
    }
    const snippet = bodyMarkdown.substring(m.index + m[0].length).substr(0, 50).trim()
    if (snippet.localeCompare(codeSrcTrimmed) === 0) {
      lang = m[0].substring(3).trim()
      break
    }
  }

  return <SyntaxHighlighter language={lang}>{codeSrc}</SyntaxHighlighter>
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
  ), [markdown])

  return (
    <div className={cx("markdown-body", className)}>{output}</div>
  )
}

export default Markdown
