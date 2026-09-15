import safeGet from "lodash.get"
import React, { useEffect, useMemo } from "react"
import unified from "unified"
import parse from "remark-parse"
import remarkRehype from "remark-rehype"
import rehypeRaw from "rehype-raw"
import rehypeReact from "rehype-react"
import { Link } from "gatsby"

import SyntaxHighlighter from "./syntaxHighlighter"
import Image from "./image"
import { cx } from "../utils/cx"
import "../styles/markdown.css"

const IMAGE_EXTENSIONS = new Set(["jpg", "jpeg", "gif", "png", "bmp"])

const RenderParagraph = ({ children }) => {
  const imgSrc = safeGet(children, "0.props.src", "")
  const dotPos = imgSrc.lastIndexOf(".")
  const ext = (dotPos ? imgSrc.substring(dotPos + 1) : "").toLowerCase()

  if (IMAGE_EXTENSIONS.has(ext)) {
    return <div className="md-img-wrapper">{children}</div>
  }
  return <p className="md-paragraph">{children}</p>
}

const RenderImage = ({ src, alt, title }) => {
  if (!src) {
    return null
  }

  const finalSrc = src.startsWith("//") ? `https://${src}` : src

  if (finalSrc.startsWith("http")) {
    return <img src={finalSrc} alt={alt} title={title} />
  }
  return <Image src={finalSrc} alt={alt} title={title} />
}

const RenderAnchor = ({ href, title, children }) => {
  if (href === "no-longer-valid") {
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
  if (!href || href.startsWith("http")) {
    return (
      <a href={href} title={title}>
        {children}
      </a>
    )
  }
  return (
    <Link to={href} title={title}>
      {children}
    </Link>
  )
}

const RenderCode = ({ children }) => (
  <span className="md-code-span">{children}</span>
)

const generateRenderPre = bodyMarkdown => args => {
  const codeSrc = safeGet(args, "children.0.props.children.0")

  // Raw HTML can reach this override with a shape the lookup above doesn't fit.
  if (typeof codeSrc !== "string") {
    return <pre>{args.children}</pre>
  }

  const codeSrcTrimmed = codeSrc.substr(0, 50).trim()

  let lang = ""
  let m
  const regex = /```\w+\s*\n/gm
  while ((m = regex.exec(bodyMarkdown)) !== null) {
    if (m.index === regex.lastIndex) {
      regex.lastIndex++
    }
    const snippet = bodyMarkdown
      .substring(m.index + m[0].length)
      .substr(0, 50)
      .trim()
    if (snippet.localeCompare(codeSrcTrimmed) === 0) {
      lang = m[0].substring(3).trim()
      break
    }
  }

  return <SyntaxHighlighter language={lang}>{codeSrc}</SyntaxHighlighter>
}

// React never runs a <script> element it creates, and one that only exists in
// the server-rendered HTML won't run after a client-side navigation either.
// Render nothing and append a real DOM node instead, so embeds work both ways.
const RenderScript = ({ src, type, children }) => {
  const inline = useMemo(() => {
    const parts = Array.isArray(children) ? children : [children]
    return parts.filter(c => typeof c === "string").join("")
  }, [children])

  useEffect(() => {
    if (!src && !inline) {
      return undefined
    }

    const el = document.createElement("script")

    if (type) {
      el.type = type
    }
    if (src) {
      el.src = src
      el.async = true
    } else {
      el.text = inline
    }

    document.body.appendChild(el)

    return () => {
      document.body.removeChild(el)
    }
  }, [src, type, inline])

  return null
}

const _toStyleObject = str =>
  str.split(";").reduce((m, decl) => {
    const pos = decl.indexOf(":")

    if (0 < pos) {
      const prop = decl.slice(0, pos).trim()
      const value = decl.slice(pos + 1).trim()

      if (prop && value) {
        // CSS custom properties are passed through to React untouched.
        const key = prop.startsWith("--")
          ? prop
          : prop.replace(/-([a-z])/g, (_, c) => c.toUpperCase())
        m[key] = value
      }
    }

    return m
  }, {})

// Raw HTML gives us `style` as a string; React needs an object.
const rehypeInlineStyles = () => tree => {
  const walk = node => {
    if (node.properties && typeof node.properties.style === "string") {
      node.properties.style = _toStyleObject(node.properties.style)
    }
    ;(node.children || []).forEach(walk)
  }

  walk(tree)
  return tree
}

const Markdown = ({ markdown, className }) => {
  const output = useMemo(() => {
    const file = unified()
      .use(parse)
      .use(remarkRehype, { allowDangerousHtml: true })
      .use(rehypeRaw)
      .use(rehypeInlineStyles)
      .use(rehypeReact, {
        createElement: React.createElement,
        components: {
          p: RenderParagraph,
          img: RenderImage,
          a: RenderAnchor,
          pre: generateRenderPre(markdown),
          code: RenderCode,
          script: RenderScript,
        },
      })
      .processSync(markdown)

    // unified 8 puts compiler output on `contents`; 9+ uses `result`.
    return file.result || file.contents
  }, [markdown])

  return <div className={cx("markdown-body", className)}>{output}</div>
}

export default Markdown
